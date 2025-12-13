import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const CART_KEY = "student_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from storage on refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch (err) {
      console.error("Cart load error:", err);
      setCart([]);
    }
  }, []);

  // Update cart always updates localStorage also
  const updateStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  };

  /* ---------------- CART ACTIONS ---------------- */

  // Add item or increase qty
  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);

    let updated;
    if (exists) {
      updated = cart.map((i) =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...cart, { ...item, qty: 1 }];
    }

    updateStorage(updated);
  };

  // Remove item by id
  const removeFromCart = (id) => {
    updateStorage(cart.filter((i) => i.id !== id));
  };

  // Remove everything
  const clearCart = () => updateStorage([]);

  // Increase quantity
  const increaseQty = (id) => {
    updateStorage(
      cart.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  // Decrease quantity (stays minimum 1)
  const decreaseQty = (id) => {
    updateStorage(
      cart
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // Total price calculation
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
