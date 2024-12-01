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
          const { partnerDetails, tableDetails } = response.data.data;

          // Save tableId to local storage if tableDetails is present
          if (tableDetails && tableDetails.tableId) {
            localStorage.setItem("tableId", tableDetails.tableId);
          }

          // Extract social links for icons
          const socialLinks = {
            facebook:
              partnerDetails.social1.includes("facebook")
                ? partnerDetails.social1
                : partnerDetails.social2.includes("facebook")
                  ? partnerDetails.social2
                  : partnerDetails.social3.includes("facebook")
                    ? partnerDetails.social3
                    : null,
            instagram:
              partnerDetails.social1.includes("instagram")
                ? partnerDetails.social1
                : partnerDetails.social2.includes("instagram")
                  ? partnerDetails.social2
                  : partnerDetails.social3.includes("instagram")
                    ? partnerDetails.social3
                    : null,
          };

          // Return the structured data
          return {
            partnerDetails: {
              id: partnerDetails.partnerId,
              name: partnerDetails.partnerName,
              about: partnerDetails.about,
              socialLinks
            },
            tableDetails
          };
        })
        .catch((err) => {
          console.error("Error fetching partner details:", err);
          throw err; // Let react-query handle the error
        }),
    {
      staleTime: 1000 * 60 * 5, // Cache validity period
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
