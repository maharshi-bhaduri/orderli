export default function SearchService(searchFor, searchIn, searchColumns) {
  return searchIn.filter(function (item) {
    const lowerSearchText = searchFor.toLowerCase();
    return searchColumns.some((column) => {
      if (item[column] && typeof item[column] === "string") {
        return item[column].toLowerCase().includes(lowerSearchText);
      }
      return false;
    });
  });
}
