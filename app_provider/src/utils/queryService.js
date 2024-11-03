import { useQuery } from "react-query";
import { getService } from "./APIService";

export const getMenu = (partnerHandle) =>
  useQuery(
    ["menu", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_PROVIDER_MENU, {
        partnerHandle,
      }).then((response) => {
        return response.data;
      }),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

export const getProfile = (partnerHandle) =>
  useQuery(
    ["partner", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_PROVIDER_DETAILS, {
        partnerHandle,
      }).then((response) => {
        return response.data[0];
      }),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!partnerHandle,
    }
  );

export const getFeedback = (partnerHandle) => {
  return useQuery(
    ["feedback", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_FEEDBACK, {
        partnerHandle,
      })
        .then((response) => {
          console.log("output result", response.data);
          return response.data;
        })
        .catch((err) => {
          return err;
        }),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
};
