import React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);
export default function OrdersSubscription() {
  const [orders, setOrders] = useState();
  const tableId = 1;
  useEffect(() => {
    if (!tableId) {
      console.log("Table Id is missing");
      return;
    }
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("order_items_live")
        .select("*")
        .eq("tableId", tableId)
        .order("createdAt", { ascending: false });

      if (error) {
        console.log("Error fetching order", error.message);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();

    const subscription = supabase
      .channel(`orders-tableId-${tableId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items_live",
          filter: `tableId-eq.${tableId}`,
        },
        (payload) => {
          console.log("Real-time payload", payload);
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) => {
              return prev.map((order) => {
                return order.orderItemId === payload.new.orderItemId
                  ? payload.new
                  : order;
              });
            });
            alert(
              `Order ${payload.new.orderItemId} status has been updated: ${payload.new.status}`
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => {
              return prev.filter((order) => {
                return order.orderItemId !== payload.old.orderItemId;
              });
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
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
                <th className="border border-gray-200 px-4 py-2">Item ID</th>
                <th className="border border-gray-200 px-4 py-2">Name</th>
                <th className="border border-gray-200 px-4 py-2">Qty</th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderItemId} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {order.orderItemId}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.itemName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.quantity}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.itemStatus == 1 ? "In Progress" : "Completed"}
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
