import GraphicButton from "../components/GraphicButton";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import AddTableModal from "../components/AddTableModal";
import EditTableModal from "../components/EditTableModal";
import TableSquare from "../components/TableSquare";
import { getTables } from "../utils/queryService";
export default function ProviderTables() {
  const [isAddOpen, setIsAddOpen] = useState();
  const [isEditOpen, setIsEditOpen] = useState();
  const [currentTable, setCurrentTable] = useState();
  const [refreshTables, setRefreshTables] = useState();
  const partnerId = localStorage.getItem("partnerId");
  // Fetch tables, the 'refreshTables' will trigger the re-fetch when updated

  const {
    data: tables,
    isLoading,
    isError,
  } = getTables(partnerId, refreshTables);

  useEffect(() => {
    if (refreshTables) setRefreshTables(false); // Reset the refresh flag after the re-fetch
  }, [refreshTables]);

  const handleEditClick = (table) => {
    setIsEditOpen(true);
    setCurrentTable(table);
  };

  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6">
        <header className="text-2xl font-medium">Table Management</header>
      </div>
      <div className={"rounded-lg bg-white " + "w-full  flex flex-col  "}>
        <div
          className=" flex items-center justify-between border
        rounded-lg w-full bg-orange-300"
        >
          <GraphicButton
            text="Add"
            buttonStyle=""
            onClick={() => setIsAddOpen(true)}
          >
            <span className="material-symbols-outlined">add</span>
          </GraphicButton>
        </div>
        {isAddOpen && (
          <AddTableModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
        )}
        {/* Render Table Squares */}
        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="mx-8 my-8">
            <div className="w-full grid grid-cols-4 gap-4 ">
              {tables &&
                tables.map((table) => (
                  <TableSquare
                    key={table.tableId}
                    table={table}
                    onClick={() => handleEditClick(table)}
                  />
                ))}
              {isEditOpen && (
                <EditTableModal
                  open={isEditOpen}
                  onClose={() => setIsEditOpen(false)}
                  table={currentTable}
                  onTableEdited={() => setRefreshTables(true)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
