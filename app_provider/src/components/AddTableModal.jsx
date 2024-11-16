import React, { useState } from "react";

import { useMutation } from "react-query";
import { postService } from "../utils/APIService";
export default function AddTableModal({ open, onClose }) {
  const partnerId = localStorage.getItem("partnerId");
  const [loading, setLoading] = useState();
  const [tableData, setTableData] = useState({
    partnerId,
    noOfTables: "",
    seatCapacity: "",
  });

  const handleChange = function (event) {
    console.log(event.target.name, event.target.value);
    setTableData((prev) => {
      const { name, value } = event.target;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const { mutate: addTableData } = useMutation(
    (tableData) => {
      return postService(import.meta.env.VITE_APP_ADD_TABLE, tableData);
    },
    {
      onSuccess: () => {
        console.log("Tables added successfully frontend");
        setLoading(false);
        onClose();
      },
    },
    {
      onError: (err) => {
        console.error(`${error} encountered`);
      },
    }
  );

  const handleSubmit = async function (event) {
    console.log("inside handle submit");
    event.preventDefault();
    setLoading(true);
    addTableData(tableData);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="md:w-2/3 w-full h-2/3 p-6 m-2 bg-white shadow-md rounded-lg overflow-y-scroll">
        <h1 className="text-2xl font-semibold mb-4">Add table data</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nooftables"
              className="block text-sm font-medium text-gray-700"
            >
              Number of tables
            </label>
            <input
              type="number"
              id="nooftables"
              name="noOfTables"
              value={tableData.noOfTables}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            />
          </div>
          {/* <div className="mb-4">
            <label
              htmlFor="tablesize"
              className="block text-sm font-medium text-gray-700"
            >
              Seat Capacity
            </label>
            <input
              type="number"
              id="tablesize"
              name="seatCapacity"
              value={tableData.seatCapacity}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            />
          </div> */}
          <div className="mb-4">
            <label
              htmlFor="tablesize"
              className="block text-sm font-medium text-gray-700"
            >
              Seat Capacity
            </label>
            <input
              type="number"
              id="tablesize"
              name="seatCapacity"
              value={tableData.seatCapacity}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>{" "}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
