import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const CART_KEY = "student_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_KEY));
    if (stored) setCart(stored);
  }, []);

  const updateStorage = (updated) => {
    setCart(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  };

  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);

    if (exists) {
      updateStorage(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      updateStorage([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) =>
    updateStorage(cart.filter((i) => i.id !== id));

  const clearCart = () => updateStorage([]);

  const increaseQty = (id) =>
    updateStorage(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const decreaseQty = (id) =>
    updateStorage(
      cart
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
        )
        .filter((i) => i.qty > 0)
    );

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
