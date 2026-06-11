import React, { useState } from 'react';
import { Star, Plus, Eye, RefreshCw, Leaf } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductCardProps {
  key?: string;
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onOpenQuickView: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function ProductCard({
  item,
  onAddToCart,
  onOpenQuickView,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      id={`product-${item.id}`}
      className="w-full h-[400px] perspective-1000 font-sans group relative cursor-pointer"
    >
      {/* Target Container for 3D flip */}
      <div
        className={`w-full h-full duration-700 ease-out transform style-3d relative ${
          isFlipped ? '[transform:rotateY(180deg)]' : 'shadow-lg hover:shadow-2xl'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* ================= CARD FRONT FACE ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden glass-dark border border-white/5 flex flex-col backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Item Image with dynamic gradient overlay */}
          <div className="relative h-48 overflow-hidden select-none shrink-0 bg-cafe-smoky">
            <img
              referrerPolicy="no-referrer"
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cafe-charcoal via-transparent to-transparent opacity-90"></div>

            {/* Quick Badges in Header */}
            <div className="absolute top-3 left-3 flex flex-col space-y-1">
              {item.isPopular && (
                <span className="px-2.5 py-1 bg-cafe-gold text-cafe-charcoal text-[9px] font-bold uppercase tracking-wider rounded-md shadow-md">
                  POPULAR CHOICE
                </span>
              )}
              {item.isVegan && (
                <span className="w-6 h-6 rounded-full bg-emerald-500/80 border border-emerald-400/20 text-white flex items-center justify-center shadow-lg" title="Vegan Option">
                  <Leaf className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Favorite Star Index button */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
              className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 border ${
                isFavorite
                  ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                  : 'bg-black/15 border-white/5 text-white/70 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Core Body Metadata */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cafe-gold font-mono uppercase tracking-widest">
                  {item.category}
                </span>
                <span className="flex items-center text-[10px] text-white/80 font-mono">
                  <Star className="w-3 h-3 text-cafe-gold fill-current mr-0.5" />
                  {item.rating}
                </span>
              </div>
              
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mt-1 truncate group-hover:text-cafe-gold transition-colors">
                {item.name}
              </h3>
              
              <p className="text-xs text-cafe-cream/60 leading-relaxed mt-2 line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Cart & Flipping Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
              <div>
                <span className="text-[9px] text-cafe-cream/40 block leading-none uppercase">Premium price</span>
                <span className="font-mono text-sm font-bold text-cafe-gold mt-1 block">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* 3D Flip Quick Info Trigger */}
                <button
                  type="button"
                  onClick={handleFlipToggle}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-cafe-cream/80 hover:text-white transition-all xl:opacity-0 group-hover:opacity-100"
                  title="View Ingredients"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Quick Add */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                  className="px-3 py-2 bg-cafe-gold hover:bg-cafe-cream text-cafe-charcoal font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ================= CARD BACK FACE ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden glass-dark border border-cafe-gold/20 p-5 flex flex-col justify-between [transform:rotateY(180deg)] backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Header block info */}
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3">
              <span className="text-[10px] uppercase font-bold text-cafe-gold tracking-widest font-mono">
                Ingredients &amp; Nutrients
              </span>
              <span className="text-[10px] uppercase font-mono text-cafe-cream/50">
                Cal: {item.calorieCount} kcal
              </span>
            </div>

            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">
              {item.name}
            </h3>

            {/* Ingredients Lists */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] uppercase text-cafe-cream/40 tracking-wider block">Raw composition:</span>
              <ul className="grid grid-cols-2 gap-2">
                {item.ingredients.map((ing, k) => (
                  <li key={k} className="text-xs text-cafe-cream/80 flex items-center space-x-1.5 leading-relaxed truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cafe-gold shrink-0"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro details metrics */}
            <div className="mt-4 space-y-1 bg-white/5 rounded-xl p-3 border border-white/5 text-[10px] uppercase tracking-wider text-cafe-cream/60">
              <div className="flex justify-between">
                <span>Vegan Friendly:</span>
                <span className="font-bold text-white font-mono">{item.isVegan ? 'YES' : 'NO'}</span>
              </div>
              <div className="flex justify-between">
                <span>Gluten Free:</span>
                <span className="font-bold text-white font-mono">{item.isGlutenFree ? 'YES' : 'NO'}</span>
              </div>
              <div className="flex justify-between">
                <span>Preparation time:</span>
                <span className="font-bold text-cafe-gold font-mono">6 - 8 MINS</span>
              </div>
            </div>
          </div>

          {/* Flip back navigation trigger */}
          <div className="border-t border-white/5 pt-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFlipToggle}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-cafe-cream text-xs uppercase font-mono tracking-wider flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip Front</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onOpenQuickView(item); }}
              className="text-[10px] uppercase tracking-wider text-cafe-gold font-bold hover:underline"
            >
              View Bio
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
