import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
const CartContext = createContext();

const initialCartState = {
  cartItems: {}, // Initialize as an empty cart
};

// Reducer to manage cart state
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuId, item } = action.payload;
      const existingItem = state.cartItems[menuId] || {
        quantity: 0,
        itemDetails: item,
      };
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [menuId]: {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          },
        },
      };
    }
    case "REMOVE_ITEM": {
      const { menuId } = action.payload;
      const updatedCartItems = { ...state.cartItems };
      if (updatedCartItems[menuId]) {
        updatedCartItems[menuId].quantity -= 1;
        if (updatedCartItems[menuId].quantity <= 0) {
          delete updatedCartItems[menuId];
        }
      }
      return { ...state, cartItems: updatedCartItems };
    }
    case "SET_CART": {
      return { ...state, cartItems: action.payload.cartItems };
    }
    case "CLEAR_CART":
      return { ...state, cartItems: {} };
    default:
      return state;
  }
}

// Cart Provider component
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const location = useLocation();
  const partnerHandle = location.pathname.split("/")[1];
  console.log(partnerHandle);
  // Load cart from localStorage on app initialization
  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem(`${partnerHandle}_cart`)) || {};
    console.log("Loaded saved cart:", savedCart);
    dispatch({ type: "SET_CART", payload: { cartItems: savedCart } });
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      `${partnerHandle}_cart`,
      JSON.stringify(cart.cartItems)
    );
  }, [cart.cartItems]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use the cart context
export function useCart() {
  return useContext(CartContext);
}
