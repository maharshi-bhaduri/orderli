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
  const [orders, setOrders] = useState([]);
  const { mutate: updateOrder } = useMutation(
    ({ orderId, newStatus }) => {
      return postService(import.meta.env.VITE_APP_UPDATE_ORDER_PARTNER, {
        orderId,
        newStatus,
      });
    },
    {
      onSuccess: (data, variables) => {
        console.log("Order status updated successfully:", data);
        const { orderId, newStatus } = variables;
        setOrders((prev) =>
          prev.map((o) =>
            o.orderItemId === orderId ? { ...o, itemStatus: newStatus } : o
          )
        );
      },
    },
    {
      onError: (error) => {
        console.error("Failed to update order status:", error);
      },
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
        setOrders(data);
      }
    };

    fetchOrders();

    const subscription = supabase
      .channel(`orders-partnerId-${partnerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items_live",
          filter: `partnerId=eq.${partnerId}`,
        },
        (payload) => {
          console.log("Real-time payload:", payload);
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) =>
                order.orderItemId === payload.new.orderItemId
                  ? payload.new
                  : order
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter(
                (order) => order.orderItemId !== payload.old.orderItemId
              )
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [partnerId]);

  const toggleOrderStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status

    updateOrder({ orderId, newStatus });
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Partner Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">
                Order Item ID
              </th>
              <th className="border border-gray-200 px-4 py-2">Item Name</th>
              <th className="border border-gray-200 px-4 py-2">Quantity</th>
              <th className="border border-gray-200 px-4 py-2">Item Price</th>
              <th className="border border-gray-200 px-4 py-2">Item Status</th>
              <th className="border border-gray-200 px-4 py-2">Created At</th>
              <th className="border border-gray-200 px-4 py-2">Table Id</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
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
                    ${order.itemPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {order.itemStatus === 1 ? "In Progress" : "Completed"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {order.tableId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <GraphicButton
                      onClick={() =>
                        toggleOrderStatus(order.orderItemId, order.itemStatus)
                      }
                      text="Change Status"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center border border-gray-200 px-4 py-2"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
