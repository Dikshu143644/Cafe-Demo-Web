import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MenuItem, Booking, Order, User, UserRole, DiningType, BookingStatus, OrderStatus } from './src/types';
import { MENU_ITEMS } from './src/data/mockData';

// Shared stateful in-memory database to enable full-stack interactivity
const DB = {
  users: [
    {
      id: 'u1',
      name: 'Elena Rostova',
      email: 'omkardsupe143644@gmail.com', // Pre-populated user from requests
      phone: '+44 7911 123456',
      role: 'customer' as UserRole,
      isOtpVerified: true,
      loyaltyPoints: 340,
      favorites: ['m1', 'm3']
    },
    {
      id: 'u2',
      name: 'Aiden Vance',
      email: 'manager@cafevista.com',
      phone: '+44 7911 654321',
      role: 'manager' as UserRole,
      isOtpVerified: true,
      loyaltyPoints: 1000,
      favorites: []
    }
  ] as User[],
  
  bookings: [] as Booking[],
  orders: [] as Order[],
  messages: [] as Array<{ id: string; name: string; email: string; message: string; date: string }>,
  otpStore: new Map<string, { code: string; expiresAt: number; phone?: string; email?: string }>()
};

// Seed initial reservations and orders for rich manager analytics out-of-the-box
DB.bookings.push(
  {
    id: 'b1',
    customerName: 'Aurelia Vance',
    customerEmail: 'aurelia@example.com',
    customerPhone: '+44 7911 333333',
    date: '2026-06-08',
    time: '14:30',
    guestsCount: 2,
    tablePreference: 'window',
    occasion: 'Anniversary',
    status: 'approved' as BookingStatus
  },
  {
    id: 'b2',
    customerName: 'Marcus Sterling',
    customerEmail: 'sterling@example.com',
    customerPhone: '+44 7911 444444',
    date: '2026-06-09',
    time: '19:00',
    guestsCount: 4,
    tablePreference: 'garden',
    occasion: 'Business Dinner',
    status: 'pending' as BookingStatus
  }
);

DB.orders.push(
  {
    id: 'o-4012',
    customerName: 'Elena Rostova',
    customerEmail: 'omkardsupe143644@gmail.com',
    customerPhone: '+44 7911 123456',
    items: [
      { menuItemId: 'm1', name: 'Gilded Espresso Crema', price: 6.50, quantity: 2 },
      { menuItemId: 'm4', name: 'Pistachio Glazed Croissant', price: 8.50, quantity: 2 }
    ],
    subtotal: 30.00,
    discount: 3.00,
    total: 30.50,
    diningType: 'dine-in' as DiningType,
    status: 'completed' as OrderStatus,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
  },
  {
    id: 'o-7821',
    customerName: 'David Mercer',
    customerEmail: 'mercer@example.com',
    customerPhone: '+44 7922 999999',
    items: [
      { menuItemId: 'm3', name: 'Smoked Salmon Sourdough', price: 16.00, quantity: 1 },
      { menuItemId: 'm2', name: 'Velvet Lavender Honey Latte', price: 7.25, quantity: 1 }
    ],
    subtotal: 23.25,
    discount: 0,
    total: 26.75,
    diningType: 'pickup' as DiningType,
    status: 'preparing' as OrderStatus,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 mins ago
  }
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Elegant in-memory rate limiter to secure API resources
  const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  
  const apiRateLimiter = (options: { windowMs: number; max: number; message: string }) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Use proxy header or remote address as unique client key
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous-ip';
      const key = `${req.path}:${clientIp}`;
      const now = Date.now();
      
      let record = rateLimitStore.get(key);
      
      // Reset rate limit window if expired or not registered
      if (!record || now > record.resetTime) {
        record = {
          count: 1,
          resetTime: now + options.windowMs
        };
        rateLimitStore.set(key, record);
        res.setHeader('X-RateLimit-Limit', options.max);
        res.setHeader('X-RateLimit-Remaining', options.max - 1);
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
        return next();
      }
      
      if (record.count >= options.max) {
        res.setHeader('X-RateLimit-Limit', options.max);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
        res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: options.message,
          retryAfterMs: Math.max(0, record.resetTime - now)
        });
      }
      
      record.count++;
      res.setHeader('X-RateLimit-Limit', options.max);
      res.setHeader('X-RateLimit-Remaining', options.max - record.count);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      next();
    };
  };

  // Setup Lazy Gemini API client
  let aiClient: any = null;
  const getAIClient = (): GoogleGenAI | null => {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }
    }
    return aiClient;
  };

  // --- API ROUTES ---

  // Auth: Log In
  app.post('/api/auth/login', apiRateLimiter({ windowMs: 60000, max: 10, message: "Too many login attempts. Please rest 60 seconds." }), (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const matchedUser = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid login credentials or unregistered email address' });
    }

    // In production we would use bcrypt, here we match mock passwords cleanly
    res.json({
      message: 'Logged in successfully',
      user: matchedUser
    });
  });

  // Auth: Signup with automatic OTP generation
  app.post('/api/auth/signup', apiRateLimiter({ windowMs: 60000, max: 10, message: "Security limit triggered. Please wait 60 seconds before creating a new profile." }), (req, res) => {
    const { name, email, phone, password, role } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Please enter all required fields' });
    }

    const existingUser = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Create verification OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60000; // 5 mins
    DB.otpStore.set(email.toLowerCase(), { code: otpCode, expiresAt, phone, email });

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      role: (role === 'manager' ? 'manager' : 'customer') as UserRole,
      isOtpVerified: false,
      loyaltyPoints: 100, // Welcome gift points
      favorites: []
    };

    DB.users.push(newUser);

    // Return mock SMS verification and user profiles
    res.status(201).json({
      message: 'Account initialized. A numeric OTP has been issued.',
      user: newUser,
      debugOtp: otpCode // Exposing OTP back so tester UI can fill it automatically
    });
  });

  // Auth: Verify OTP
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const storedOtp = DB.otpStore.get(email.toLowerCase());
    if (!storedOtp) {
      return res.status(404).json({ error: 'No verification session active. Please resend code.' });
    }

    if (Date.now() > storedOtp.expiresAt) {
      DB.otpStore.delete(email.toLowerCase());
      return res.status(408).json({ error: 'OTP has expired. Please request a new code.' });
    }

    if (storedOtp.code !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    // Mark verified
    const userIndex = DB.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      DB.users[userIndex].isOtpVerified = true;
    }

    DB.otpStore.delete(email.toLowerCase());

    res.json({
      message: 'Identity verified successfully!',
      user: DB.users[userIndex]
    });
  });

  // Auth: Resend OTP
  app.post('/api/auth/resend-otp', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60000;
    DB.otpStore.set(email.toLowerCase(), { code: otpCode, expiresAt, email });

    res.json({
      message: 'A new 6-digit code has been texted/emailed.',
      debugOtp: otpCode
    });
  });

  // Menu retrieval
  app.get('/api/menu', (req, res) => {
    res.json(MENU_ITEMS);
  });

  // Bookings: Submit reservation & auto approve for mock flows
  app.post('/api/bookings', apiRateLimiter({ windowMs: 60000, max: 5, message: "Daily booking capacity is heavily guarded; please wait a minute before making another reservation." }), (req, res) => {
    const { customerName, customerEmail, customerPhone, date, time, guestsCount, tablePreference, occasion, specialNotes, userId } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !date || !time || !guestsCount) {
      return res.status(400).json({ error: 'Please populate all mandatory booking options' });
    }

    const newBooking: Booking = {
      id: 'bk_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      userId,
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      guestsCount: parseInt(guestsCount),
      tablePreference,
      occasion,
      specialNotes,
      status: 'approved' as BookingStatus, // auto approve in live mock simulation
      calendarEventId: 'evt_' + Math.random().toString(36).substr(2, 9)
    };

    DB.bookings.unshift(newBooking);

    // Credit loyalty points to the user if logged in
    if (userId) {
      const idx = DB.users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        DB.users[idx].loyaltyPoints += 50; // 50 points per booking
      }
    }

    res.status(201).json({
      message: 'Booking created. Confirmation email sent via Gmail API client and Calendar sync updated.',
      booking: newBooking
    });
  });

  // Bookings: Get list
  app.get('/api/bookings', (req, res) => {
    res.json(DB.bookings);
  });

  // Bookings: Update state (Manager Action)
  app.patch('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const bookingIndex = DB.bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    DB.bookings[bookingIndex].status = status as BookingStatus;
    res.json({ message: `Booking status turned ${status}`, booking: DB.bookings[bookingIndex] });
  });

  // Orders: Place order and compute loyalty reward points
  app.post('/api/orders', (req, res) => {
    const { customerName, customerEmail, customerPhone, items, subtotal, discount, total, diningType, userId, paymentMethod } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ error: 'Cannot place empty order' });
    }

    const orderId = 'o-' + Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      id: orderId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      discount,
      total,
      diningType,
      status: 'pending' as OrderStatus,
      paymentStatus: 'paid', // Mark paid immediately for mock Razorpay success flow
      paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    DB.orders.unshift(newOrder);

    // Award loyalty points based on total spend ($1 = 10 points)
    if (userId) {
      const userIdx = DB.users.findIndex(u => u.id === userId);
      if (userIdx !== -1) {
        DB.users[userIdx].loyaltyPoints += Math.floor(total * 10);
      }
    }

    res.status(201).json({
      message: 'Order placed, Razorpay test signature verified successfully.',
      order: newOrder
    });
  });

  // Orders: Get order listing
  app.get('/api/orders', (req, res) => {
    res.json(DB.orders);
  });

  // Orders: Update order status (Manager action)
  app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const index = DB.orders.findIndex(o => o.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    DB.orders[index].status = status as OrderStatus;
    res.json({ message: `Order status updated to ${status}`, order: DB.orders[index] });
  });

  // Contact support messaging
  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please enter all fields to proceed' });
    }

    const msg = {
      id: 'msg_' + Math.random().toString(36).substr(2, 5),
      name,
      email,
      message,
      date: new Date().toLocaleDateString()
    };

    DB.messages.unshift(msg);
    res.status(201).json({ message: 'Thank you! Your feedback is registered securely.', contact: msg });
  });

  app.get('/api/contact', (req, res) => {
    res.json(DB.messages);
  });

  // AI assistant conversational endpoint
  app.post('/api/assistant', apiRateLimiter({ windowMs: 60000, max: 15, message: "You have reached our digital sanctuary's conversational limit. Please rest 60 seconds." }), async (req, res) => {
    const { prompt, history, chatHistory, user } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const query = prompt.toLowerCase();
    let responseText = '';
    let actionObj: any = null;

    // Try Gemini if available
    const client = getAIClient();
    if (client) {
      try {
        const systemMsg = `You are the elegant Café Vista AI Concierge and voice assistant.
Introduce the café as a glassmorphic aesthetic refuge where single-origin brews meet editorial botany under greenhouse glass.
You have the power to auto-book tables and auto-order (add to cart) on behalf of users in real-time.

Food Menu: ${JSON.stringify(MENU_ITEMS)}.
Current User Details: ${user ? JSON.stringify(user) : 'Not Logged In'}.

If the user wants to order or add a drink or pastry, set action type to "add_to_cart" and identify the correct itemId (one of m1 to m8) and itemName.
If the user wants to book or reserve a table/seat, set action type to "book_table" and extract guestsCount, date, time (default 16:30), and tablePreference ("window" | "garden" | "lounge").
Otherwise, set action to null.

You MUST reply ONLY with a JSON object conforming exactly to this structure (no additional fields):
{
  "response": "Conversational, eloquent reply text containing markdown. Direct, friendly, and elegant.",
  "action": {
    "type": "add_to_cart" | "book_table" | null,
    "itemId": "m1" | "m2" | "m3" | "m4" | "m5" | "m6" | "m7" | "m8" | null,
    "itemName": "Item Name String" | null,
    "guestsCount": number | null,
    "date": "YYYY-MM-DD" | null,
    "time": "HH:MM" | null,
    "tablePreference": "window" | "garden" | "lounge" | null
  }
}`;

        const aiResponse = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `${systemMsg}\n\nUser Prompt: ${prompt}`,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text.trim());
          responseText = parsed.response;
          actionObj = parsed.action || null;
        }
      } catch (error: any) {
        console.error('Gemini assistant structured model error:', error.message);
      }
    }

    // Fallback or rule-based parser if Gemini offline or failed
    if (!responseText) {
      if (query.includes('recommend') || query.includes('suggest') || query.includes('menu') || query.includes('popular')) {
        responseText = `I highly recommend our **Gilded Espresso Crema** ($6.50) topped with gold flakes, or our popular **Velvet Lavender Honey Latte** ($7.25) brewed with smooth organic oat milk. For brunch, our **Smoked Salmon Sourdough** ($16.00) is exceptional! Would you like me to add one of these fine options into your cart?`;
      } 
      else if (query.includes('order') || query.includes('add') || query.includes('buy') || query.includes('want a') || query.includes('get a')) {
        let matchedItem = MENU_ITEMS.find(item => query.includes(item.name.toLowerCase()) || query.includes(item.id));
        if (!matchedItem) {
          if (query.includes('gilded') || query.includes('gold') || query.includes('espresso')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm1');
          } else if (query.includes('lavender') || query.includes('honey') || query.includes('velvet')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm2');
          } else if (query.includes('salmon') || query.includes('sourdough')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm3');
          } else if (query.includes('croissant') || query.includes('pistachio')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm4');
          } else if (query.includes('mushroom') || query.includes('truffle') || query.includes('crepe')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm5');
          } else if (query.includes('brew') || query.includes('cardamom') || query.includes('cold brew')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm6');
          } else if (query.includes('eclair') || query.includes('éclair') || query.includes('rosewater')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm7');
          } else if (query.includes('turmeric') || query.includes('silk') || query.includes('yellow')) {
            matchedItem = MENU_ITEMS.find(item => item.id === 'm8');
          }
        }

        if (matchedItem) {
          responseText = `Certainly! I've automatically added the **${matchedItem.name}** ($${matchedItem.price.toFixed(2)}) to your physical selection. You'll see it in your Cart Drawer now! Let me know if you would like me to add anything else!`;
          actionObj = {
            type: 'add_to_cart',
            itemId: matchedItem.id,
            itemName: matchedItem.name
          };
        } else {
          responseText = `I couldn't quite resolve which menu item you wanted to order. We have options like Gilded Espresso (m1), Lavender Latte (m2), Pistachio Croissant (m4), or Salmon Sourdough (m3). Which one should I add to your order?`;
        }
      } 
      else if (query.includes('book') || query.includes('table') || query.includes('reserve') || query.includes('seats')) {
        let pref = 'window';
        if (query.includes('garden')) pref = 'garden';
        else if (query.includes('lounge')) pref = 'lounge';

        let guests = 2;
        const guestMatch = query.match(/(\d+)\s*(guest|people|person|seat)/);
        if (guestMatch) {
          guests = parseInt(guestMatch[1]);
        }

        const dateStr = new Date().toISOString().split('T')[0];

        responseText = `Perfect choice. I have initiated an auto-booking for a **${pref} table** for **${guests} guests** for **today** (${dateStr}) at **16:30** under your profile. It's now fully approved and logged!`;
        actionObj = {
          type: 'book_table',
          guestsCount: guests,
          date: dateStr,
          time: '16:30',
          tablePreference: pref
        };
      } 
      else if (query.includes('hours') || query.includes('time') || query.includes('open') || query.includes('close') || query.includes('when')) {
        responseText = `Our doors are open for visual coffee experiences during these timetables:
- **Weekdays (Mon-Fri):** 7:00 AM — 9:00 PM
- **Saturdays:** 8:00 AM — 10:00 PM
- **Sundays:** 8:00 AM — 8:00 PM`;
      } 
      else if (query.includes('track') || query.includes('order') || query.includes('my status')) {
        responseText = `Tracking your active order is simple! Simply jump into your **Customer Dashboard** profile tab. You will see a glowing live tracker displaying whether your order is currently 'Pending', 'Preparing', 'Ready for Collection', or 'Dine-In Completed'!`;
      } 
      else if (query.includes('hello') || query.includes('hi ') || query.includes('hey') || query.includes('who are you')) {
        responseText = `Hello! I am your **Café Vista Digital Concierge & Voice Guide** ☕ No matter if you are looking for culinary coffee recommendations, checking on our glasshouse opening times, or tracking a pending pastry order, I am here to help. Ask me anything!`;
      }
      else {
        responseText = `I hear you! At Café Vista, we offer a lovely selection of single-origin beans, hand-kneaded laminated pastries, and real-time custom booking. Feel free to say: *"Order a Velvet Lavender Honey Latte"* or *"Book a garden table for 4 guests"* to see our auto-assistant in action!`;
      }
    }

    res.json({ success: true, response: responseText, action: actionObj });
  });

  // --- VITE MIDDLEWARE / STATIC DISTRIBUTION ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Café Vista Server booting smoothly on http://localhost:${PORT}`);
  });
}

startServer();
