import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../utils/APIService";
export default function EditTableModal({ open, onClose, table, partnerId }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(table.status);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: updateTableStatus } = useMutation(
    (updatedTable) => {
      return postService(import.meta.env.VITE_APP_UPDATE_TABLE, updatedTable);
    },
    {
      onError: (err) => {
        setLoading(false);
        console.error("Error updating status:", err);
      },
    }
  );

  const handleSave = async () => {
    setLoading(true);

    try {
      const updatedTable = { ...table, status }; // Update table data
      await updateTableStatus(updatedTable); // call mutate to set the updated table data
      await queryClient.invalidateQueries(["tables", partnerId]); //
      //await queryClient.refetchQueries(["tables", partnerId]);
      onClose(); // Close the modal after successful update
    } catch (err) {
      console.error("Error saving table status", err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="md:w-2/3 w-full h-2/3 p-6 m-2 bg-white shadow-md rounded-lg overflow-y-scroll">
        <h1 className="text-2xl font-semibold mb-4">Edit Table</h1>
        {table ? (
          <div>
            <p>Table ID: {table.tableId}</p>
            <p>Seating Capacity: {table.seatingCapacity}</p>
            <p>Status: {table.status}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Change Status to
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>
        ) : (
          <p>No table data available.</p>
        )}
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
