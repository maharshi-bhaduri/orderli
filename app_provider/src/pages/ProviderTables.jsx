import GraphicButton from "../components/GraphicButton";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import TableSquare from "../components/TableSquare";
import { getTables } from "../utils/queryService";
import Modal from "../components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../utils/APIService";
import { useParams } from "react-router-dom";

export default function ProviderTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add" or "edit"
  const [currentTable, setCurrentTable] = useState();
  const [formData, setFormData] = useState({
    noOfTables: "",
    seatingCapacity: "",
    status: "",
  });
  let url = "";
  const queryClient = useQueryClient();
  const { partnerHandle } = useParams();
  const { data: tables, isLoading, isError } = getTables(partnerHandle);

  // Mutation for add/edit table
  const { mutateAsync: saveTableData, isLoading: isSaving } = useMutation(
    (data) =>
      postService(
        modalMode === "add"
          ? import.meta.env.VITE_APP_ADD_TABLE
          : import.meta.env.VITE_APP_UPDATE_TABLE,
        data
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tables", partnerHandle]);
        setIsModalOpen(false);
        setFormData({ noOfTables: "", seatingCapacity: "", status: "" });
      },
      onError: (err) => console.error("Error saving table data:", err),
    }
  );

  const handleAddClick = () => {
    setModalMode("add");
    setFormData({ noOfTables: "", seatingCapacity: "", status: "Available" });
    setIsModalOpen(true);
  };

  const handleEditClick = (table) => {
    url = `www.snaqr.com/~${table.suffix}`;
    setModalMode("edit");
    setFormData({ ...table });
    console.log(formData);
    setCurrentTable(table);
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = { ...formData, partnerHandle };
    console.log(formData);
    await saveTableData(payload);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full"></div>
      <div className={"rounded-lg bg-white " + "w-full flex flex-col"}>
        <div
          className="flex items-center justify-between border
        rounded-t-lg w-full"
        >
          <GraphicButton
            text="Add"
            buttonStyle="bluefill"
            onClick={handleAddClick}
            disabled={isLoading}
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </GraphicButton>

          <div className="flex items-center gap-4 ml-4 border rounded-md p-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-300 rounded-full"></span>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-300 rounded-full"></span>
              <span className="text-sm">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-300 rounded-full"></span>
              <span className="text-sm">Occupied</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="mx-8 my-8">
            <div className="w-full grid grid-cols-4 gap-4">
              {tables &&
                tables.map((table) => (
                  <TableSquare
                    key={table.tableId}
                    table={table}
                    onClick={() => handleEditClick(table)}
                    startTableIndex={tables[0]?.tableId}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Reusable Modal */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        >
          <h1 className="text-2xl font-semibold mb-4">
            {modalMode === "add" ? "Add Table" : "Edit Table"}
          </h1>
          <form>
            {modalMode === "add" && (
              <div className="mb-4">
                <label
                  htmlFor="noOfTables"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Tables
                </label>
                <input
                  type="number"
                  id="noOfTables"
                  name="noOfTables"
                  min="0"
                  value={formData.noOfTables}
                  onChange={handleFormChange}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="seatingCapacity"
                className="block text-sm font-medium text-gray-700"
              >
                Seat Capacity
              </label>
              <input
                type="number"
                id="seatingCapacity"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value > 0 && value <= 16) {
                    handleFormChange(e);
                  } else if (value > 16) {
                    alert(`Seating capacity cannot exceed 16`);
                  }
                }}
                min="1"
                max="16"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {modalMode === "edit" && (
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Occupied">Occupied</option>
                </select>
                <div className="mt-4 flex justify-center">
                  <div className="w-36 h-36">
                    <QRCode
                      size={256}
                      style={{ height: "100%", width: "100%" }}
                      value={url}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </Modal>
      </div>
    </div>
  );
}
