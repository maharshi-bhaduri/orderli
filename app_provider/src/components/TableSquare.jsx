export default function TableSquare({ table, onClick, startTableIndex, alerts }) {
  const { tableId, seatingCapacity, status, suffix } = table;

  // Determine color based on status
  const bgColor =
    status === "Available"
      ? "bg-green-300"
      : status === "Reserved"
        ? "bg-yellow-300"
        : "bg-red-300"; // Occupied

  const textColor =
    status === "Available"
      ? "text-green-800"
      : status === "Reserved"
        ? "text-yellow-800"
        : "text-red-800"; // Occupied

  return (
    <div
      className={`h-20 w-40 flex flex-col relative rounded-xl 
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
      {alerts?.bill_requested && (
        <div className="absolute bottom-1 right-1 bg-orange-400 border border-orderlee-primary-100 text-white text-xs px-2 py-1 rounded-lg animate-pulse-border">
          <span
            className="material-symbols-outlined text-xs "
          >
            receipt_long
          </span>
        </div>
      )}
    </div>
  );
}
