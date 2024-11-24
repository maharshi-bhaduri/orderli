import React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useIsFetching } from "react-query";
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

export default function Orders({ items }) {
  const tableId = 1;

  useEffect(() => {
    const subscription = supabase
      .channel("order_update")
      .on(
        "postgres_changes",
        {
          event: "broadcast",
          schema: "public",
          channel: "order_update",
        },
        (payload) => {
          console.log("Order update received:", payload);
          // Example: Display a notification to the customer
          alert(
            `Order ${payload.orderItemId} status updated to ${payload.status}`
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

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
              {items && items.length > 0 ? (
                items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{i}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.itemDetails.itemName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{""}</td>
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
