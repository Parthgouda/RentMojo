import {
  createContext,
  useState,
  useEffect,
} from "react";

export const CartContext =
  createContext();

export function CartProvider({
  children,
}) {

  const [cart, setCart] =
    useState(() => {

      const savedCart =
        localStorage.getItem("cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    });

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  const addToCart = (product) => {

    const existingProduct =
  cart.find(
    (item) =>
      item._id === product._id
  );

    if (existingProduct) {

      const updatedCart =
        cart.map((item) =>

           item._id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item

        );

      setCart(updatedCart);

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);

    }

  };

const removeFromCart = (_id) => {

  const updatedCart =
    cart.filter(
      (item) => item._id !== _id
    );

  setCart(updatedCart);

};

 const increaseQuantity = (_id) => {

  const updatedCart =
    cart.map((item) =>

      item._id === _id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item

    );

  setCart(updatedCart);

};

 const decreaseQuantity = (_id) => {

  const updatedCart =
    cart.map((item) =>

      item._id === _id
        ? {
            ...item,
            quantity:
              item.quantity > 1
                ? item.quantity - 1
                : 1,
          }
        : item

    );

  setCart(updatedCart);

};

  const clearCart = () => {

    setCart([]);

    localStorage.removeItem("cart");

  };

  return (

    <CartContext.Provider
     value={{
  cart,
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
}}
    >

      {children}

    </CartContext.Provider>

  );

}