import {
  createContext,
  useState,
  useEffect,
} from "react";

export const WishlistContext =
  createContext();

function WishlistProvider({
  children,
}) {

  const [wishlist, setWishlist] =
    useState(() => {

      const savedWishlist =
        localStorage.getItem(
          "wishlist"
        );

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

    });

  useEffect(() => {

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);

  const addToWishlist = (product) => {

    const exists = wishlist.find(
      (item) =>
        item._id === product._id
    );

    if (!exists) {

      setWishlist([
        ...wishlist,
        product,
      ]);

    }

  };

 const removeFromWishlist = (_id) => {

  setWishlist(
    wishlist.filter(
      (item) =>
        item._id !== _id
    )
  );

};
  const clearWishlist = () => {

    setWishlist([]);

    localStorage.removeItem(
      "wishlist"
    );

  };

  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >

      {children}

    </WishlistContext.Provider>

  );

}

export default WishlistProvider;