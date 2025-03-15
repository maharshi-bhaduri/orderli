import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import GraphicButton from "../components/GraphicButton";
import { useMutation } from "@tanstack/react-query";
import { postService } from "../utils/APIService";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const anonKey = import.meta.env.VITE_APP_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, anonKey);

export default function PartnerOrders() {
  const partnerId = localStorage.getItem("partnerId");
  const [orders, setOrders] = useState({});
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (!partnerId) {
      console.error("Partner ID is missing.");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("order_items_live")
        .select("*")
        .eq("partnerId", partnerId)
        .eq("complete", 0) // Fetch only orders where complete is 0
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error.message);
      } else {
        const groupedOrders = {};
        const initialTimers = {};

        data.forEach((order) => {
          const key = `${order.tableId}-${order.createdAt}`;
          if (!groupedOrders[key]) {
            groupedOrders[key] = {
              tableId: order.tableId,
              createdAt: order.createdAt,
              items: [],
              completedItems: new Set(),
            };
            initialTimers[key] = Math.floor(
              (Date.now() - new Date(order.createdAt).getTime()) / 1000
            );
          }
          groupedOrders[key].items.push(order);
        });

        setOrders(groupedOrders);
        setTimers(initialTimers);
      }
    };


    fetchOrders();

    const subscription = supabase
      .channel(`orders-partnerId-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items_live", filter: `partnerId=eq.${partnerId}` },
        (payload) => {
          const localCache = JSON.parse(localStorage.getItem("ordersToUpdate")) || {};
          if (localCache[payload.new.orderItemId] !== undefined) return; // Ignore if it's already updated locally

          setOrders((prev) => {
            const updatedOrders = { ...prev };
            const key = `${payload.new.tableId}-${payload.new.createdAt}`;

            if (payload.eventType === "INSERT") {
              if (!updatedOrders[key]) {
                updatedOrders[key] = {
                  tableId: payload.new.tableId,
                  createdAt: payload.new.createdAt,
                  items: [],
                  completedItems: new Set(),
                };
              }
              updatedOrders[key].items.push(payload.new);
            } else if (payload.eventType === "UPDATE") {
              if (updatedOrders[key]?.items) {
                updatedOrders[key].items = updatedOrders[key].items.map((order) => // error at this line
                  order.orderItemId === payload.new.orderItemId ? payload.new : order
                );
              }
            } else if (payload.eventType === "DELETE") {
              if (updatedOrders[key]) {
                updatedOrders[key].items = updatedOrders[key].items.filter(
                  (order) => order.orderItemId !== payload.old.orderItemId
                );
                if (updatedOrders[key].items.length === 0) delete updatedOrders[key];
              }
            }
            return updatedOrders;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [partnerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        Object.keys(updatedTimers).forEach((key) => {
          updatedTimers[key] += 1; // Increment every second
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleItemStatus = (orderKey, orderItemId, currentStatus) => {
    let newStatus;

    if (currentStatus === 0) {
      newStatus = 1; // First click - Move to Step 1
    } else if (currentStatus === 1) {
      newStatus = 2; // Second click - Move to Step 2
    } else {
      newStatus = 0; // Reset to default (unselected)
    }

    updateOrderItem({ orderId: orderItemId, newStatus });

    setOrders((prev) => {
      const updatedOrders = { ...prev };
      updatedOrders[orderKey].items = updatedOrders[orderKey].items.map((item) =>
        item.orderItemId === orderItemId ? { ...item, itemStatus: newStatus } : item
      );

      return updatedOrders;
    });
  };


  const { mutate: updateOrderItem } = useMutation(
    async ({ orderId, newStatus }) => {
      const { error } = await supabase
        .from("order_items_live")
        .update({ itemStatus: newStatus })
        .eq("orderItemId", orderId);

      if (error) throw new Error(error.message);
    },
    {
      onSuccess: (_, variables) => {
        console.log('updated supabase', variables)
        const { orderId } = variables;
        setOrders((prevOrders) => {
          const updatedOrders = { ...prevOrders };
          for (const key in updatedOrders) {
            updatedOrders[key].items = updatedOrders[key].items.map((item) =>
              item.orderItemId === orderId ? { ...item, status: variables.newStatus } : item
            );
            if (updatedOrders[key].items.length === 0) delete updatedOrders[key]; // Remove empty orders
          }
          return updatedOrders;
        });
      },
      onError: (error) => console.error("Failed to update order status:", error),
    }
  );

  const markOrderComplete = async (orderKey) => {
    console.log("marking order item done: ", orderKey)
    const orderItems = orders[orderKey]?.items || [];

    if (orderItems.length === 0) return;

    // Update `complete` flag in Supabase
    const { error } = await supabase
      .from("order_items_live")
      .update({ complete: 1 })
      .in("orderItemId", orderItems.map(item => item.orderItemId));

    if (error) {
      console.error("Error marking order as complete:", error);
      return;
    }

    // Remove order from UI
    setOrders((prev) => {
      const updatedOrders = { ...prev };
      delete updatedOrders[orderKey];
      return updatedOrders;
    });
  };


  return (
    <div className="p-4 w-full h-[calc(100vh-20px)] overflow-y-auto">
      {Object.keys(orders).length > 0 ? (
        <div className="flex gap-4 flex-wrap p-2">
          {
            Object.entries(orders).map(([orderKey, order]) => {
              const allChecked = order.items.every(item => item.itemStatus === 2); // ✅ Check if all items have itemStatus === 2

              const createdAt = new Date(order.createdAt);
              const elapsedMinutes = Math.floor((Date.now() - createdAt) / 60000);
              const isUrgent = elapsedMinutes > 40;

              return (
                <div
                  key={orderKey}
                  className={`shadow-md p-4 rounded-lg border-2 min-w-[300px] relative transition-all 
                    ${allChecked ? "bg-green-100 border-green-300 border-2" : "bg-white"
                    } ${isUrgent && !allChecked ? "border-red-500 border-2" : "border-gray-300"}`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-lg">Table {order.tableId}</span>
                      <span className={`text-sm mx-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-full border
                                         ${isUrgent ? "bg-red-400 text-white border-red-500 border-2" : "bg-gray-200 border-gray-500"}`} >
                        {elapsedMinutes} min
                      </span>
                    </div>
                    <GraphicButton
                      onClick={() => markOrderComplete(orderKey)}
                      text="✔ Complete"
                      disabled={!allChecked} // ✅ Unlock only when all items have status 2
                      className={`px-3 py-1 rounded ${allChecked ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    />
                  </div>

                  {/* Order Items List */}
                  <div>
                    {order.items.map((item) => (
                      <div
                        key={item.orderItemId}
                        className={`flex first:rounded-t-md last:rounded-b-md justify-between items-center p-2 border cursor-pointer hover:bg-gray-100 transition-all
                          ${item.itemStatus === 1 ? "bg-yellow-100 border-yellow-300" : ""}
                          ${item.itemStatus === 2 ? "bg-green-100 border-green-300" : ""}
                        `}
                        onClick={() => toggleItemStatus(orderKey, item.orderItemId, item.itemStatus)}
                      >
                        <div className="flex items-center mr-2">
                          <span className="p-2 mr-2 border border-gray-500 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <span className="font-medium">{item.itemName}</span>
                        </div>
                        <button
                          className={`ml-2 w-6 h-6 rounded-full border flex items-center justify-center transition-all
                          ${item.itemStatus === 0 ? "bg-white border-2 border-gray-400" : ""}
                          ${item.itemStatus === 1 ? "bg-orange-300 border-2 border-orange-500" : ""}
                          ${item.itemStatus === 2 ? "bg-white border-2 border-green-500" : ""}`}
                          onClick={() => toggleItemStatus(orderKey, item.orderItemId, item.itemStatus)}
                        >
                          {item.itemStatus === 2 && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-4 h-4">
                              <path fillRule="evenodd" d="M20.285 6.707a1 1 0 0 0-1.414-1.414L9 15.164l-4.293-4.293a1 1 0 1 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0l10-10z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          }
        </div>
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )
      }
    </div>
  );
}
