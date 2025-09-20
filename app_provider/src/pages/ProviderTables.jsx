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
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const serviceKey = import.meta.env.VITE_APP_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

export default function ProviderTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "add" or "edit"
  const [currentTable, setCurrentTable] = useState();
  const [tableAlerts, setTableAlerts] = useState({});
  const [formData, setFormData] = useState({
    noOfTables: "",
    seatingCapacity: "",
    status: "",
  });
  const [qrUrl, setQrUrl] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  const queryClient = useQueryClient();
  const { partnerHandle } = useParams();
  const { data: tables, isLoading } = getTables(partnerHandle);
  const [tableStatuses, setTableStatuses] = useState({});

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("table_alerts_live")
        .select("tableId, alertType");

      if (error) {
        console.error("Error fetching alerts:", error);
        return;
      }

      const groupedAlerts = data.reduce((acc, { tableId, alertType }) => {
        if (!acc[tableId]) acc[tableId] = {};
        acc[tableId][alertType] = true;
        return acc;
      }, {});

      setTableAlerts(groupedAlerts);

      const statuses = {};
      for (let tableId of Object.keys(groupedAlerts)) {
        const alerts = groupedAlerts[tableId];
        if (alerts.bill_requested) {
          statuses[tableId] = "Bill Requested";
        } else if (alerts.table_occupied) {
          statuses[tableId] = "Occupied";
        }
      }
      setTableStatuses(statuses);
    };

    fetchAlerts();

    const subscription = supabase
      .channel("table_alerts_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_alerts_live",
        },
        () => fetchAlerts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const { mutateAsync: saveTableData } = useMutation(
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
    const generatedUrl = `www.snaqr.com/~${table.suffix}`;
    setQrUrl(generatedUrl);
    setModalMode("edit");
    setFormData({ ...table });
    setCurrentTable(table);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...formData, partnerHandle };
    await saveTableData(payload);
  };

  const getStatus = (tableId) => {
    return tableStatuses[tableId] || "Available";
  };

  const statusCounts = {
    Available: 0,
    "Bill Requested": 0,
    Occupied: 0,
  };

  tables?.forEach((table) => {
    const status = getStatus(table.tableId);
    statusCounts[status] += 1;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const statusStyles = {
    Available: "bg-green-100 text-green-800 border-green-500",
    "Bill Requested": "bg-yellow-100 text-yellow-800 border-yellow-500",
    Occupied: "bg-red-100 text-red-800 border-red-500",
  };

  const renderStatusButton = (status) => (
    <button
      key={status}
      onClick={() =>
        setActiveFilter((prev) => (prev === status ? null : status))
      }
      className={`flex items-center gap-2 px-3 py-1 rounded-full border transition
        ${statusStyles[status]} 
        ${activeFilter === status ? "border-2 border-gray-800" : "border border-transparent"}`}
    >
      <span className="w-5 h-5 rounded-full border border-gray-400 bg-white text-xs text-center leading-5 font-bold">
        {statusCounts[status]}
      </span>
      <span className="text-sm font-medium">{status}</span>
    </button>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="rounded-lg bg-white w-full flex flex-col">
        <div className="flex items-center justify-between border rounded-t-lg w-full p-4">
          <GraphicButton
            text="Add"
            buttonStyle="bluefill"
            onClick={handleAddClick}
            disabled={isLoading}
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </GraphicButton>

          <div className="flex items-center gap-3 ml-4">
            {["Available", "Bill Requested", "Occupied"].map(renderStatusButton)}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="mx-8 my-8">
            <div className="w-full flex flex-wrap justify-around gap-2">
              {tables?.map((table) => {
                const tableStatus = getStatus(table.tableId);
                const shouldDim =
                  activeFilter && tableStatus !== activeFilter;

                return (
                  <div
                    key={table.tableId}
                    className={shouldDim ? "opacity-30" : "opacity-100"}
                    disabled={shouldDim}
                  >
                    <TableSquare
                      table={table}
                      onClick={() => handleEditClick(table)}
                      startTableIndex={tables[0]?.tableId}
                      alerts={tableAlerts[table.tableId] || {}}
                      status={tableStatus}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              </div>
            )}

            {modalMode === "edit" && (
              <div className="mb-4 flex justify-evenly">
                <div className="mt-4 flex justify-center">
                  <div className="w-36 h-36">
                    <QRCode
                      size={256}
                      style={{ height: "100%", width: "100%" }}
                      value={qrUrl}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
                <div className="flex-col">
                  <h1 className="">Your code is</h1>
                  <h3 className="font-semibold">{formData.checkinCode}</h3>
                </div>
                <div className="mx-2">
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
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <div>
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
