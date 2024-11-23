import GraphicButton from "../components/GraphicButton";
import { useState } from "react";
import Loader from "../components/Loader";
import AddTableModal from "../components/AddTableModal";
import EditTableModal from "../components/EditTableModal";
import TableSquare from "../components/TableSquare";
import { getTables } from "../utils/queryService";
export default function ProviderTables() {
  const [isAddOpen, setIsAddOpen] = useState();
  const [isEditOpen, setIsEditOpen] = useState();
  const [currentTable, setCurrentTable] = useState();

  const partnerId = localStorage.getItem("partnerId");
  const { data: tables, isLoading, isError } = getTables(partnerId);

  const handleEditClick = (table) => {
    setIsEditOpen(true);
    setCurrentTable(table);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
      </div>
      <div className={"rounded-lg bg-white " + "w-full  flex flex-col  "}>
        <div
          className=" flex items-center justify-between border
        rounded-t-lg w-full"
        >
          <GraphicButton
            text="Add"
            buttonStyle="bluefill"
            onClick={() => setIsAddOpen(true)}
            disabled={isLoading}
          >
            <span className="material-symbols-outlined text-sm">add</span>
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
                  partnerId={partnerId}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
