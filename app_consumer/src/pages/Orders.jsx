import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useParams } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

// Progress Bar Component
const ProgressBar = ({ totalSteps, activeStep }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        return (
          <React.Fragment key={index}>
            <div
              className={`h-3 w-3 flex items-center justify-center rounded-full ${isCompleted
                ? "bg-green-500"
                : isActive
                  ? "bg-green-400 animate-pulse"
                  : "bg-gray-300"
                }`}
            ></div>
            {index < totalSteps - 1 && (
              <div
                className={`h-1 w-3 ${isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function Orders() {
  const navigate = useNavigate();
  let { partnerHandle } = useParams();
  const tableId = localStorage.getItem("tableId");
  const [orders, setOrders] = useState([]);

  const orderMap = {
    0: "Received",
    1: "Preparing",
    2: "Done",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("order_items_live")
        .select("*")
        .eq("tableId", tableId)
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error.message);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();

    const subscription = supabase
      .channel("order_update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "order_items_live",
          filter: `tableId=eq.${tableId}`,
        },
        (payload) => {
          const updatedOrder = payload.new;

          setOrders((oldOrders) => {
            const existingOrderIndex = oldOrders.findIndex(
              (order) => order.orderItemId === updatedOrder.orderItemId
            );
            if (existingOrderIndex !== -1) {
              const updatedOrders = [...oldOrders];
              updatedOrders[existingOrderIndex] = updatedOrder;
              return updatedOrders;
            } else {
              return [...oldOrders, updatedOrder];
            }
          });
        }
      )
      .subscribe()
      .on("subscribed", () => {
        console.log("Successfully subscribed to order_update channel");
      })
      .on("error", (error) => {
        console.error("Subscription error:", error);
      });

    return () => supabase.removeChannel(subscription);
  }, [tableId]);

  // Group orders by createdTime
  const groupedOrders = orders.reduce((acc, order) => {
    const orderTime = new Date(order.createdAt).toLocaleString();
    if (!acc[orderTime]) acc[orderTime] = [];
    acc[orderTime].push(order);
    return acc;
  }, {});

  return (
    <div className="text-black w-full flex flex-col items-center justify-center select-none">
      <div className="rounded-lg mx-2 my-2 flex flex-col justify-center items-center w-full max-w-2xl mt-16">
        <div className="w-full max-h-[calc(100vh-180px)] overflow-y-scroll">
          {Object.keys(groupedOrders).length === 0 ? (
            <div className="text-center py-4">No orders found.</div>
          ) : (
            Object.entries(groupedOrders).map(([orderTime, orders]) => (
              <div key={orderTime} className="mb-4 last:mb-0 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Ordered at {orderTime}</h2>
                {orders.map((order) => (
                  <div
                    key={order.orderItemId}
                    className="grid grid-cols-2 gap-4 items-center p-4 mb-2 last:mb-0 bg-gray-100 rounded-lg shadow-sm"
                    style={{ gridTemplateRows: "1fr auto" }}
                  >
                    {/* Item Name */}
                    <div className="col-span-1 row-span-2">
                      <h3 className="font-semibold">{order.itemName}</h3>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-200 text-gray-500 text-xs">
                          {orderMap[
                            order.itemStatus > 2
                              ? 2
                              : order.itemStatus < 0
                                ? 0
                                : order.itemStatus
                          ]}
                        </div>
                      </div>
                      <div className="text-right">
                        ${order.itemPrice?.toFixed(2) || "N/A"}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="col-span-1 flex items-center justify-between">
                      <ProgressBar totalSteps={3} activeStep={order.itemStatus} />
                      <div
                        className="px-3 py-1 ml-2 rounded-lg bg-gray-200 text-md w-10
                      text-xs text-gray-500 flex justify-center"
                      >
                        ×<span className="ml-2">{order.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Checkout Button */}
        <div
          className="rounded-t-lg bg-white p-4 mx-2 flex flex-col fixed bottom-0 shadow-md w-full max-w-2xl"
        >
          <div className="flex justify-end items-center w-full">
            <button
              className="bg-green-500 px-4 py-2 rounded-lg text-white"
              onClick={() =>
                navigate(`/${partnerHandle}/checkout`, { state: { orders } })
              }
              disabled={!orders.every((order) => order.itemStatus === 2)}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
