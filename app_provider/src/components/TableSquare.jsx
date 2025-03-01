export default function TableSquare({ table, onClick, startTableIndex }) {
  const { tableId, seatingCapacity, status, suffix } = table;
  const url = `www.snaqr.com/~${suffix}`;

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
      </div>

      {/* URL at the bottom */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-black text-xs px-2 py-1 ">
        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </div>
    </div>
  );
}
