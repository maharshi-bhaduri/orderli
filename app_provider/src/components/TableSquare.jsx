export default function TableSquare({ table, onClick }) {
  const { tableId, seatingCapacity, status } = table;

  // Determine color based on status
  const bgColor = status === "Available" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`h-16 flex flex-col items-center justify-center 
                    rounded-md text-white font-medium ${bgColor} cursor-pointer`}
      onClick={onClick}
    >
      <div>{`Table #${tableId}`}</div>
    </div>
  );
}
