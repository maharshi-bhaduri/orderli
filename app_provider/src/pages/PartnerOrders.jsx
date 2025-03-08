import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import GraphicButton from "../components/GraphicButton";
import { useMutation } from "@tanstack/react-query";
import { postService } from "../utils/APIService";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

export default function PartnerOrders() {
  const partnerId = localStorage.getItem("partnerId");
  const [orders, setOrders] = useState({});
  const [timers, setTimers] = useState({});

  const { mutate: updateOrder } = useMutation(
    ({ orderId, newStatus }) =>
      postService(import.meta.env.VITE_APP_UPDATE_ORDER_PARTNER, {
        orderId,
        newStatus,
      }),
    {
      onSuccess: (_, variables) => {
        const { orderId } = variables;
        setOrders((prevOrders) => {
          const updatedOrders = { ...prevOrders };
          for (const key in updatedOrders) {
            updatedOrders[key].items = updatedOrders[key].items.filter(
              (item) => item.orderItemId !== orderId
            );
            if (updatedOrders[key].items.length === 0) delete updatedOrders[key]; // Remove empty orders
          }
          return updatedOrders;
        });
      },
      onError: (error) => console.error("Failed to update order status:", error),
    }
  );

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
              updatedOrders[key].items = updatedOrders[key].items.map((order) =>
                order.orderItemId === payload.new.orderItemId ? payload.new : order
              );
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

  const toggleItemStatus = (orderKey, orderItemId) => {
    setOrders((prev) => {
      const updatedOrders = { ...prev };
      const updatedCompletedItems = new Set(updatedOrders[orderKey].completedItems);

      if (updatedCompletedItems.has(orderItemId)) {
        updatedCompletedItems.delete(orderItemId);
      } else {
        updatedCompletedItems.add(orderItemId);
      }

      updatedOrders[orderKey] = { ...updatedOrders[orderKey], completedItems: updatedCompletedItems };

      // Update local storage cache
      const cachedUpdates = JSON.parse(localStorage.getItem("ordersToUpdate")) || {};
      cachedUpdates[orderItemId] = updatedCompletedItems.has(orderItemId) ? 0 : 1; // 0 = completed
      localStorage.setItem("ordersToUpdate", JSON.stringify(cachedUpdates));

      return updatedOrders;
    });
  };

  const pushBatchedUpdates = () => {
    const cachedUpdates = JSON.parse(localStorage.getItem("ordersToUpdate")) || {};

    if (Object.keys(cachedUpdates).length === 0) return; // No updates to push

    const updates = Object.entries(cachedUpdates).map(([orderItemId, newStatus]) => ({
      orderId: orderItemId,
      newStatus,
    }));

    postService(import.meta.env.VITE_APP_UPDATE_ORDER_PARTNER, { updates })
      .then(() => {
        // Clear successful updates
        localStorage.removeItem("ordersToUpdate");
      })
      .catch((error) => {
        console.error("Batch update failed, will retry in next cycle:", error);
      });
  };

  const markOrderComplete = (orderKey) => {
    orders[orderKey].items.forEach(({ orderItemId }) =>
      updateOrder({ orderId: orderItemId, newStatus: 0 })
    );
  };

  return (
    <div className="p-4 w-full h-[calc(100vh-20px)] overflow-y-auto">
      {Object.keys(orders).length > 0 ? (
        <div className="flex gap-4 flex-wrap p-2">
          {Object.entries(orders).map(([orderKey, order]) => {
            const allChecked = order.items.length === order.completedItems.size;
            const createdAt = new Date(order.createdAt);
            const elapsedMinutes = Math.floor((Date.now() - createdAt) / 60000);
            const isUrgent = elapsedMinutes > 40; // Change this threshold as needed

            return (
              <div
                key={orderKey}
                className={`shadow-md p-4 rounded-lg border-2 min-w-[300px] relative transition-all ${allChecked ? "bg-green-100 border-green-300 border-2" : "bg-white"
                  } ${isUrgent & !allChecked ? "border-red-500 border-2" : "border-gray-300"}`} // Red border for urgency
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
                    disabled={!allChecked}
                    className={`px-3 py-1 rounded ${allChecked ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  />
                </div>

                {/* Order Items List */}
                <div>
                  {order.items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === order.items.length - 1;

                    return (
                      <div
                        key={item.orderItemId}
                        className={`flex justify-between items-center p-2 border cursor-pointer hover:bg-gray-100 transition-all ${order.completedItems.has(item.orderItemId) ? "bg-green-100" : "bg-white"
                          } ${isFirst ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`}
                        onClick={() => toggleItemStatus(orderKey, item.orderItemId)}
                      >
                        <div className="flex items-center">
                          <span className="p-2 mr-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <span className="font-medium">{item.itemName}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={order.completedItems.has(item.orderItemId)}
                          className="w-5 h-5 accent-green-500 mx-2 cursor-pointer"
                          readOnly
                        />
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )
      }
    </div>
  );
}
