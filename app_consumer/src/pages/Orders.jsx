import React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

export default function Orders() {
  const tableId = 1;
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    //function to fetch initial data
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("order_items_live")
        .select("*")
        .eq("tableId", tableId);

      if (error) {
        console.error("Error fetching orders:", error.message);
      } else {
        console.log("Initial orders fetched:", data);
        setOrders(data); // Set initial state
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
          console.log("Order update received:", payload.new);
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

  return (
    <div className="text-black w-full flex flex-col items-center justify-center">
      {/* Orders Section */}
      <div className="rounded-lg bg-white p-2 mx-2 my-2 flex flex-col justify-center items-center shadow-md w-full max-w-2xl mt-16">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        {/* Add your orders related content here */}
        <div className="w-full">
          <p className="text-center py-4">Here are your past orders:</p>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Sl no</th>
                <th className="border border-gray-200 px-4 py-2">Name</th>
                <th className="border border-gray-200 px-4 py-2">Qty</th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {i + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.itemName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.quantity}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.itemStatus === 1 ? "In Progress" : "Completed"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
