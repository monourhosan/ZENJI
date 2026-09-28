import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalCount,
    subtotal,
    discount,
    appliedPromo,
    applyPromo,
    removePromo,
    freeShippingThreshold,
    shippingCost,
    finalTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen && !isCheckoutOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, isCheckoutOpen, closeCart]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  if (!isCartOpen) return null;

  // Free shipping calculation
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#101010] border-l border-white/10 shadow-2xl flex flex-col text-white transform transition-transform duration-300 ease-out animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ccff00]" />
            <h2 className="font-heading font-black text-xl uppercase tracking-wider">
              Shopping Bag
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
              {totalCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Ribbon */}
        <div className="px-5 py-3 bg-[#161616] border-b border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-[#ccff00]" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-[#ccff00] font-bold">Free Worldwide Express Unlocked!</span>
              ) : (
                <span>Add ${amountNeededForFreeShipping.toFixed(2)} for Free Shipping</span>
              )}
            </span>
            <span className="text-[10px] text-neutral-500">{Math.round(shippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ccff00] transition-all duration-500 ease-out"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg uppercase tracking-tight text-white mb-1">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-neutral-400 font-mono max-w-xs">
                  Discover Drop 04 and secure your archival pieces before stock is depleted.
                </p>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  const el = document.getElementById('collection');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-2 px-6 py-3 bg-white hover:bg-[#ccff00] text-black font-mono text-xs uppercase tracking-widest font-bold rounded transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0 border border-white/10">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-sm text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-neutral-400">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold">
                          {item.size}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                      aria-label={`Remove ${item.product.name} from bag`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <div className="flex items-center border border-white/15 rounded bg-black/40 font-mono text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-white text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] font-mono text-neutral-500">
                          ${item.product.price} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Pricing & Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#0d0d0d] space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#ccff00]">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-bold">{appliedPromo}</span>
                    <span className="text-neutral-400">(-${discount.toFixed(2)})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-neutral-400 hover:text-white text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. ZENJI10)"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError('');
                      }}
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-white/5 border border-white/15 rounded text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ccff00]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs uppercase font-bold rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-400 font-mono">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#ccff00]">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className={shippingCost === 0 ? 'text-[#ccff00]' : 'text-white'}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span className="font-heading uppercase tracking-wider">Total</span>
                <span className="font-mono text-lg">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 bg-white hover:bg-[#ccff00] text-black font-mono text-xs uppercase tracking-[0.2em] font-black rounded flex items-center justify-center gap-2 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-neutral-500 font-mono uppercase tracking-wider">
              Complimentary 30-Day Returns • Carbon-Neutral Delivery
            </p>
          </div>
        )}
      </aside>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
