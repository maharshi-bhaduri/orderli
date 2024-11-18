import React, { createContext, useContext, useReducer } from "react";

// Initial cart state
const initialState = {
    cartItems: {}, // { [menuId]: { itemDetails, quantity } }
};

// Cart reducer
function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM":
            return {
                ...state,
                cartItems: {
                    ...state.cartItems,
                    [action.payload.menuId]: {
                        itemDetails: action.payload.item,
                        quantity: (state.cartItems[action.payload.menuId]?.quantity || 0) + 1,
                    },
                },
            };
        case "REMOVE_ITEM":
            const updatedCart = { ...state.cartItems };
            if (updatedCart[action.payload.menuId].quantity > 1) {
                updatedCart[action.payload.menuId].quantity -= 1;
            } else {
                delete updatedCart[action.payload.menuId];
            }
            return { ...state, cartItems: updatedCart };
        default:
            return state;
    }
}

// Create Context
const CartContext = createContext();

// Context Provider
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    return (
        <CartContext.Provider value={{ cart: state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook for easier usage
export function useCart() {
    return useContext(CartContext);
}
