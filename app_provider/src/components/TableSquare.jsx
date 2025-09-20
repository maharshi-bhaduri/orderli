export default function TableSquare({
  table,
  onClick,
  startTableIndex,
  alerts,
}) {
  const { tableId, seatingCapacity, status, suffix } = table;
  let occupied = false;
  for (let [k, v] of Object.entries(alerts)) {
    if (k === "table_occupied" && v === true) {
      occupied = true;
      break;
    }
  }
  // Determine color based on status
  const bgColor = occupied ? (alerts?.bill_requested ? "bg-orange-100" : "bg-red-100") : "bg-green-100";
  const borderColor = occupied ? (alerts?.bill_requested ? "border-2 border-orange-500" : "border-red-300") : "border-green-500";

  const textColor = occupied ? "text-red-800" : "text-green-800"; // Occupied

  return (
    <div className="flex-grow flex justify-start">
      <div
        className={`px-10 h-20 flex-grow flex flex-col border ${borderColor} relative border-or rounded-xl hover:scale-105 transition-all duration-100
                  text-black font-medium overflow-hidden ${bgColor} cursor-pointer`}
        onClick={onClick}
      >
        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className={`text-sm ${textColor} font-semibold`}>
            {`Table ${tableId - startTableIndex + 1}`}
          </div>
          <div className={`flex ${textColor}`}>
            <span className="material-symbols-outlined text-sm">group</span>
            <span className="pl-2 text-sm">{seatingCapacity}</span>
          </div>
          <div>
            <span className={`text-xs ${textColor} font-semibold`}>
              Id {suffix}
            </span>
          </div>
        </div>

        {/* Alert Badge */}
        {/* {alerts?.bill_requested && (
          <div className="absolute bottom-1 right-1 bg-orange-400 border border-orderlee-primary-100 text-white text-xs px-2 py-1 rounded-lg animate-pulse-border">
            <span className="material-symbols-outlined text-xs ">
              receipt_long
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
}
