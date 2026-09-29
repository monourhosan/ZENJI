import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle2, CreditCard, Lock, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, discount, shippingCost, finalTotal, clearCart, appliedPromo } = useCart();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form State
  const [form, setForm] = useState({
    email: 'shopper@zenji.shop',
    firstName: 'Alex',
    lastName: 'Vance',
    address: '14 Shibuya Crossing, Dogenzaka',
    city: 'Tokyo',
    postal: '150-0043',
    country: 'Japan',
    paymentMethod: 'apple-pay',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrder = 'ZENJI-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedOrder);
      setIsProcessing(false);
      setStep('success');
      clearCart();
    }, 1200);
  };

  const handleResetAndClose = () => {
    setStep('details');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-900 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout Demo"
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'details' ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-600 mb-2 font-semibold">
              <Lock className="w-3.5 h-3.5 text-neutral-900" />
              <span>Simulated Checkout Demo</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mb-2">
              Express Checkout
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Complete your simulated order. No real payment will be processed.
            </p>

            {/* Order Items Preview */}
            <div className="mb-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between text-xs font-mono mb-3 text-neutral-600">
                <span className="uppercase tracking-wider">Order Summary ({items.length} items)</span>
                <span className="font-bold text-neutral-950">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-neutral-700">
                    <span className="truncate max-w-[240px]">
                      {item.quantity}x {item.product.name} ({item.size})
                    </span>
                    <span className="font-mono text-neutral-950 font-medium">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-col gap-1 text-[11px] font-mono text-neutral-500">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo}):</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className={shippingCost === 0 ? 'text-emerald-700 font-medium' : 'text-neutral-900'}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-500 uppercase mb-1">Email for Confirmation</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 uppercase mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 uppercase mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-neutral-500 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-neutral-500 uppercase mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={form.postal}
                    onChange={(e) => setForm({ ...form, postal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-neutral-500 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>

              {/* Payment Method Selector Demo */}
              <div className="pt-2">
                <label className="block text-neutral-500 uppercase mb-2">Simulated Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: 'apple-pay' })}
                    className={`p-2.5 rounded border text-center font-bold transition-all ${
                      form.paymentMethod === 'apple-pay'
                        ? 'border-neutral-950 bg-neutral-100 text-neutral-950 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: 'card' })}
                    className={`p-2.5 rounded border text-center font-bold transition-all flex items-center justify-center gap-1.5 ${
                      form.paymentMethod === 'card'
                        ? 'border-neutral-950 bg-neutral-100 text-neutral-950 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: 'crypto' })}
                    className={`p-2.5 rounded border text-center font-bold transition-all ${
                      form.paymentMethod === 'crypto'
                        ? 'border-neutral-950 bg-neutral-100 text-neutral-950 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Crypto / Web3
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 mt-6 bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-black rounded flex items-center justify-center gap-2 transition-all duration-300 shadow-xl"
              >
                {isProcessing ? (
                  <span>Processing Verification...</span>
                ) : (
                  <>
                    <span>Place Order • ${finalTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmed View */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-600 mb-2 font-bold">
              Order Confirmed // Drop 04
            </div>
            <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-neutral-950 mb-3">
              Thank You For Your Order
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6">
              Your simulated archive order has been registered in the system. An email confirmation has been dispatched to{' '}
              <span className="text-neutral-950 font-mono font-medium">{form.email}</span>.
            </p>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 max-w-sm mx-auto mb-8 font-mono text-xs text-left space-y-2">
              <div className="flex justify-between text-neutral-500">
                <span>ORDER REF:</span>
                <span className="font-bold text-neutral-950">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>ESTIMATED DISPATCH:</span>
                <span className="text-neutral-950 font-medium">Within 24 Hours</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>TRACKING:</span>
                <span className="text-emerald-700 font-bold">DHL Express Air</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold rounded transition-colors shadow-md"
            >
              Continue Exploring ZENJI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
