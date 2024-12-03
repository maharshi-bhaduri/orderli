export default function TableSquare({ table, onClick }) {
  const { tableId, seatingCapacity, status } = table;

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
      <div className="flex-1 w-full flex flex-col items-center justify-center ">
        <div
          className={`text-sm ${textColor} font-semibold`}
        >{`Table ${tableId}`}</div>
        <div className={`flex ${textColor}`}>
          <span className="material-symbols-outlined text-sm">Group</span>
          <span className="pl-2 text-sm">{seatingCapacity}</span>
        </div>
      </div>
    </div>
  );
}
