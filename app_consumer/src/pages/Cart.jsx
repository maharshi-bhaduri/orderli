import React, { useState } from "react";
import { useCart } from "../utils/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Orders from "./Orders";
import axios from "axios";

export default function Cart() {
  let { partnerHandle } = useParams();
  const [view, setView] = useState("cart");
  const [orders, setOrders] = useState([]);
  const { cart, dispatch } = useCart();
  const cartItems = Object.values(cart.cartItems);
  const navigate = useNavigate();

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (total, { itemDetails, quantity }) => total + itemDetails.price * quantity,
    0
  );

  const handleAdd = (menuId, item) => {
    dispatch({ type: "ADD_ITEM", payload: { menuId, item } });
  };

  const handleRemove = (menuId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { menuId } });
  };

  const placeOrderMutation = useMutation(
    (payload) => axios.post(import.meta.env.VITE_APP_POST_ADD_ORDER, payload),
    {
      onSuccess: () => {
        // Clear the cart only on success
        setOrders(Object.values(cart.cartItems));
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("cart");
        console.log("Order placed successfully");
      },
      onError: (error) => {
        console.error("Error placing order:", error);
      },
    }
  );

  const handlePlaceOrder = () => {
    // Construct the payload as a list of objects with partnerId and menuId
    const tableId = localStorage.getItem("tableId");
    console.log("cart", cart);
    console.log("cartItems", cart.cartItems);
    console.log("cartItems object values", Object.values(cart.cartItems));
    const payload = Object.values(cart.cartItems).map((cartItem) => ({
      partnerId: cartItem.itemDetails.partnerId,
      menuId: cartItem.itemDetails.menuId,
      quantity: cartItem.quantity,
      tableId,
    }));
    console.log("payload", payload);

    // Trigger the mutation
    placeOrderMutation.mutate(payload);
  };

  return (
    <div className="bg-orange-300 bg-cover bg-center pt-2 px-2 h-screen">
      <div className="text-black w-full flex flex-col items-center justify-center">
        <div
          className="rounded-b-lg bg-white border border-gray-300 border-t-0 p-2 mx-2 flex flex-col fixed top-0
                      justify-center items-center shadow-md w-full max-w-2xl"
        >
          <div className="w-full flex text-sm justify-between h-10">
            <button
              className="mr-2 px-2 border border-gray-300 text-gray-500
              rounded-lg bg-white hover:bg-gray-300 transition ease-in-out"
              onClick={() => navigate(`/${partnerHandle}`)}
            >
              Home
            </button>

            {/* Slider to Toggle Between Cart and Orders */}
            <div className="flex items-center justify-center w-full h-full">
              <div className="relative w-40 h-full bg-gray-100 shadow-inner rounded-lg flex items-center">
                {/* Slider Button */}
                <div
                  className={`absolute w-20 h-full py-2 bg-orange-200 bg-opacity-50 border border-orange-400 rounded-lg transition-transform transform ${view === "cart" ? "translate-x-0" : "translate-x-20"
                    }`}
                ></div>
                {/* Labels */}
                <button
                  className={`h-full flex-1 text-center text-black transition-all duration-100 ${view === "cart" ? "text-black" : "text-gray-500"
                    }`}
                  onClick={() => setView("cart")}
                >
                  Cart
                </button>
                <button
                  className={`h-full flex-1 text-center transition-all duration-100 ${view === "orders" ? "text-black" : "text-gray-500"
                    }`}
                  onClick={() => setView("orders")}
                >
                  Orders
                </button>
              </div>
            </div>
            <button
              className="ml-2 px-2 border border-gray-300 text-gray-500
              rounded-lg bg-white hover:bg-gray-300 transition ease-in-out relative"
              onClick={() => navigate(`/${partnerHandle}/menu`)}
            >
              Menu
            </button>
          </div>
        </div>

        {view === "cart" ? (
          <div className="text-black w-full flex flex-col items-center justify-center">
            <div
              className="rounded-lg bg-white p-2 mx-2 my-2 flex flex-col
                      justify-center items-center shadow-md w-full max-w-2xl mt-16"
            >
              <div className="p-4 w-full max-h-[calc(100vh-220px)] overflow-y-scroll">
                {cartItems.length === 0 ? (
                  <div className="text-center py-4">Your cart is empty.</div>
                ) : (
                  cartItems.map(({ itemDetails, quantity }) => (
                    <div
                      key={itemDetails.menuId}
                      className="grid grid-cols-3 gap-4 items-center p-4 mb-2 last:mb-0 bg-gray-100 rounded-lg"
                      style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
                    >
                      {/* Item Name */}
                      <div>
                        <h3 className="font-semibold">
                          {itemDetails.itemName}
                        </h3>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleRemove(itemDetails.menuId)}
                          className="px-2 py-1 bg-red-500 text-white rounded-l text-md"
                        >
                          -
                        </button>
                        <div className="px-3 py-1 bg-gray-200 text-md w-10 flex justify-center">
                          {quantity}
                        </div>
                        <button
                          onClick={() =>
                            handleAdd(itemDetails.menuId, itemDetails)
                          }
                          className="px-2 py-1 bg-green-500 text-white rounded-r text-md"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right font-semibold">
                        ${itemDetails.price.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div
              className="rounded-t-lg bg-white p-4 mx-2 flex flex-col fixed bottom-0
                      shadow-md w-full max-w-2xl"
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-2 flex justify-center items-center rounded-lg border bg-gray-200">
                  <h2 className="text-xl mx-2">Total:</h2>
                  <h2 className="text-xl mr-2">
                    {totalAmount.toFixed(2)}
                  </h2>
                </div>
                <button
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg ${cart.cartItems && Object.keys(cart.cartItems).length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-green-600"
                    }`}
                  onClick={handlePlaceOrder}
                  disabled={
                    cart.cartItems && Object.keys(cart.cartItems).length === 0
                  }
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Orders />
        )}
      </div>
    </div>
  );
}
