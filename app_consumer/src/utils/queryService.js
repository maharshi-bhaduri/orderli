import { useQuery } from "@tanstack/react-query";
import { getService, postService } from "./APIService";

export const getMenu = (partnerHandle) =>
  useQuery(
    ["menu", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_MENU, {
        partnerHandle,
      }).then((response) => {
        return response.data.data
      }),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

export const getPartnerDetails = (partnerHandle) =>
  useQuery(
    ["partnerDetails", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_PARTNER_DETAILS, {
        partnerHandle,
      })
        .then((response) => {
          const { partnerId, partnerName, about, social1, social2, social3 } = response.data.data;
          return {
            id: partnerId,
            name: partnerName,
            about,
            socialLinks: {
              facebook: social1.includes("facebook")
                ? social1
                : social3.includes("facebook")
                  ? social3
                  : null, // Changed from social2 to social3 based on the provided API response
              instagram: social1.includes("instagram")
                ? social1
                : social3.includes("instagram")
                  ? social3
                  : null, // Changed from social2 to social3 based on the provided API response
            },
          };
        })
        .catch((err) => {
          console.error("Error fetching partner details:", err);
          throw err; // It's better to throw the error to let react-query handle it
        }),
    {
      staleTime: 1000 * 60 * 5,
    }
  );


export const getFeedback = (partnerHandle) =>
  useQuery(
    ["feedback", partnerHandle],
    () =>
      getService(import.meta.env.VITE_APP_GET_FEEDBACK_CONSUMERS, {
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
