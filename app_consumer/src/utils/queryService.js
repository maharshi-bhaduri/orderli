import { useQuery } from "react-query";
import { getService } from "./APIService";

export const getMenu = (providerHandle) =>
  useQuery(
    ["menu", providerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_MENU, {
        providerHandle,
      }).then((response) => response.data),
    {
      staleTime: 1000 * 60 * 5,
    }
  );