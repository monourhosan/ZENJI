import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, ToastMessage } from '../types';


interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  freeShippingThreshold: number;
  shippingCost: number;
  finalTotal: number;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zenji_cart_v1';
const PROMO_STORAGE_KEY = 'zenji_promo_v1';
const FREE_SHIPPING_THRESHOLD = 120;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, appliedPromo);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promo', e);
    }
  }, [appliedPromo]);

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, size: string, color?: string, quantity: number = 1) => {
    const chosenColor = color || (product.colors[0]?.name ?? 'Standard');
    const itemId = `${product.id}-${size}-${chosenColor}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prevItems,
        {
          id: itemId,
          product,
          size,
          color: chosenColor,
          quantity,
        },
      ];
    });

    addToast(
      'Added to Bag',
      `${quantity}x ${product.name} (${size} / ${chosenColor})`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        addToast('Removed from Bag', item.product.name, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromo = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'ZENJI10') {
      setAppliedPromo('ZENJI10');
      addToast('Promo Code Applied', '10% discount on your order', 'success');
      return { success: true, message: 'ZENJI10 applied (-10%)' };
    }
    if (cleaned === 'ARCHIVE15') {
      setAppliedPromo('ARCHIVE15');
      addToast('VIP Code Applied', '15% discount on your order', 'success');
      return { success: true, message: 'ARCHIVE15 applied (-15%)' };
    }
    return { success: false, message: 'Invalid promo code. Try "ZENJI10"' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    addToast('Promo Removed', undefined, 'info');
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedPromo === 'ZENJI10') {
    discount = Math.round(subtotal * 0.1 * 100) / 100;
  } else if (appliedPromo === 'ARCHIVE15') {
    discount = Math.round(subtotal * 0.15 * 100) / 100;
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 15;
  const finalTotal = Math.max(0, subtotal - discount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discount,
        appliedPromo,
        applyPromo,
        removePromo,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        shippingCost,
        finalTotal,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
