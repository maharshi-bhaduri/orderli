import { useQuery } from "@tanstack/react-query";
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

export const getProfile = function (partnerHandle) {
  const partnerId = localStorage.getItem("partnerId");
  return useQuery(
    ["partner", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_PROVIDER_DETAILS, {
        partnerHandle,
      }).then((response) => {
        if (!partnerId || partnerId == null) {
          console.log("setting up partnerId in local storage");
          localStorage.setItem("partnerId", response.data[0].partnerId);
        }
        return response.data[0];
      }),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!partnerHandle,
    }
  );
};

export const getFeedback = (partnerHandle) => {
  return useQuery(
    ["feedback", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_FEEDBACK, {
        partnerHandle,
      })
        .then((response) => {
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

export const getTables = (partnerId) =>
  useQuery(
    ["tables", partnerId],
    () =>
      getService(import.meta.env.VITE_APP_GET_TABLES, { partnerId })
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          throw err;
        }),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!partnerId, // Only run if partnerId exists and refreshTables is true
      refetchOnWindowFocus: false, // Optional: Prevent refetching on window focus
    }
  );
