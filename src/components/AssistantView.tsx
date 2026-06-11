import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Coffee, Clock, Calendar, HelpCircle } from 'lucide-react';
import GlassCard from './GlassCard';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface AssistantViewProps {
  onSendMessage: (prompt: string, history: Message[]) => Promise<string>;
}

export default function AssistantView({ onSendMessage }: AssistantViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your **Dikshu's Cafe Digital Concierge** ☕ No matter if you are looking for culinary coffee recommendations, checking on our glasshouse opening times, or tracking a pending pastry order, I am here to help. Ask me anything!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append user message
    const updatedMsgs = [...messages, { sender: 'user', text: textToSend } as Message];
    setMessages(updatedMsgs);
    setInputText('');
    setIsTyping(true);

    try {
      // API call to Express wrapper
      const response = await onSendMessage(textToSend, updatedMsgs);
      setMessages((prev) => [...prev, { sender: 'assistant', text: response }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "I apologize, our ambient system is experiencing a high volume of requests. Let me guide you: yes, our café signature gold espresso is served daily. What other drink description can I find for you?"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (prompt: string) => {
    handleSend(prompt);
  };

  const starterChips = [
    { title: "Recommend popular drink", icon: <Coffee className="w-3.5 h-3.5" /> },
    { title: "Check timing hours", icon: <Clock className="w-3.5 h-3.5" /> },
    { title: "How do I book window seats?", icon: <Calendar className="w-3.5 h-3.5" /> },
    { title: "How to track my order status?", icon: <HelpCircle className="w-3.5 h-3.5" /> }
  ];

  return (
    <div id="ai-assistant-page" className="bg-cafe-cream min-h-screen pt-32 pb-24 font-sans text-cafe-smoky">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono">
            / DIGITALLY ENERGETIC GUIDANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase text-cafe-charcoal">
            Aesthetic AI Concierge
          </h1>
          <p className="text-xs sm:text-sm text-cafe-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Delve into menu ingredients, ask custom brewing advice, or trace order schedules with our conversational model.
          </p>
        </div>

        {/* Master Glass Panel */}
        <GlassCard theme="light" className="h-[550px] max-w-3xl mx-auto flex flex-col justify-between p-0 relative" hoverEffect={false}>
          
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-cafe-smoky/5 bg-white/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-cafe-smoky flex items-center justify-center border border-cafe-gold/30">
                <Coffee className="w-4 h-4 text-cafe-gold text-center" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-cafe-charcoal block leading-none">Dikshu bot guide</span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-600 block mt-0.5 font-bold font-mono">● Active conversational stream</span>
              </div>
            </div>
            
            <span className="px-3 py-1 bg-white/45 border border-cafe-smoky/5 rounded-full text-[9px] font-mono tracking-wide text-cafe-charcoal/60">
              Model Alias: gemini-1.5-flash
            </span>
          </div>

          {/* Messages Lists scroll segment */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cafe-smoky text-white rounded-tr-none shadow-md'
                      : 'bg-white border border-[#deb887]/25 text-cafe-smoky rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Markdown or pure text representations */}
                  <p className="whitespace-pre-line font-sans prose max-w-none">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white border border-[#deb887]/25 text-cafe-smoky rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cafe-bronze animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cafe-bronze animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cafe-bronze animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt inputs and suggestion chips */}
          <div className="p-4 border-t border-cafe-smoky/5 bg-white/30 space-y-3">
            
            {/* Quick Chips suggestions */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
              {starterChips.map((chip, k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleChipClick(chip.title)}
                  className="flex items-center space-x-1.5 shrink-0 px-3 py-1.5 bg-white hover:bg-cafe-cream border border-[#deb887]/30 text-[10px] uppercase font-bold tracking-wider text-cafe-charcoal rounded-full transition-all cursor-pointer select-none"
                >
                  {chip.icon}
                  <span>{chip.title}</span>
                </button>
              ))}
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ASK RECIPE INGREDIENTS OR COFFEE TIMINGS..."
                className="flex-1 bg-white border border-[#deb887]/40 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky font-mono tracking-tight uppercase"
              />
              <button
                type="submit"
                className="p-3 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky rounded-xl transition-all duration-300 shadow-md cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 text-center" />
              </button>
            </form>

          </div>

        </GlassCard>

      </div>
    </div>
  );
}
