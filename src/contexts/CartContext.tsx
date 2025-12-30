import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type CartItem = {
  productId: number;
  name: string;
  price: number; // numeric
  image?: string;
  quantity: number;
  type: "product" | "kit";
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number, type: "product" | "kit") => void;
  clearCart: () => void;
  updateQuantity: (
    productId: number,
    type: "product" | "kit",
    quantity: number
  ) => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.type === item.type
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.type === item.type
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem: CartContextType["removeItem"] = (productId, type) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.type === type)
      )
    );
  };

  const clearCart = () => setItems([]);

  const updateQuantity: CartContextType["updateQuantity"] = (
    productId,
    type,
    quantity
  ) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.type === type
          ? { ...i, quantity }
          : i
      )
    );
  };

  const totalAmount = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    totalAmount,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
