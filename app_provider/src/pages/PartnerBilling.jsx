import React, { useState, useEffect } from "react";
import { getProfile } from "../utils/queryService";
import { useParams } from "react-router-dom";
import { postService, getService } from "../utils/APIService"; // ⬅️ Added getService
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // ⬅️ Added useQuery
import Cookies from "js-cookie";
import Loader from "../components/Loader";

export default function PartnerBilling() {
  const queryClient = useQueryClient();
  const { partnerHandle } = useParams();

  const [charges, setCharges] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [invoiceSettings, setInvoiceSettings] = useState({
    gstin: "",
    footerMessage: "",
    upiId: "",
    currency: "",
  });

  const [newCharge, setNewCharge] = useState({ label: "", value: "", type: "%", optional: false });
  const [newDiscount, setNewDiscount] = useState({ label: "", value: "", type: "%" });

  // 🔥 Fetch partner profile
  const {
    data: partnerDetails,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = getProfile(partnerHandle);

  // 🔥 Fetch billing configuration
  const {
    data: billingConfig,
    isLoading: isBillingConfigLoading,
    isError: isBillingConfigError,
  } = useQuery(["billing-config", partnerHandle], async () => {
    const res = await getService(`${import.meta.env.VITE_APP_GET_BILL_CONFIG}?partnerHandle=${encodeURIComponent(partnerHandle)}`);
    return res?.data?.data; // Assuming your API returns { data: {...} }
  });

  // 🔥 When partnerDetails comes, set invoice basic info
  useEffect(() => {
    if (partnerDetails) {
      const constructedAddress = `${partnerDetails.address}, ${partnerDetails.city} - ${partnerDetails.postalCode}`;
      setInvoiceSettings((prev) => ({
        ...prev,
        restaurantName: partnerDetails.partnerName || "",
        address: constructedAddress || "",
      }));
    }
  }, [partnerDetails]);

  // 🔥 When billingConfig comes, set charges, discounts, and invoice fields
  useEffect(() => {
    if (billingConfig) {
      setCharges(billingConfig.charges || []);
      setDiscounts(billingConfig.discounts || []);
      setInvoiceSettings((prev) => ({
        ...prev,
        gstin: billingConfig.gstin || "",
        footerMessage: billingConfig.footerMessage || "",
        upiId: billingConfig.upiId || "",
        currency: billingConfig.currency || "INR",
      }));
    }
  }, [billingConfig]);

  const { mutate: saveBillingDetails, isLoading: isSaving } = useMutation(
    (billingDetails) =>
      postService(import.meta.env.VITE_APP_UPDATE_CONFIG, billingDetails),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["partner", partnerHandle]);
        queryClient.invalidateQueries(["billing-config", partnerHandle]);
        console.log("Billing details updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update billing details:", error);
      },
    }
  );

  const handleAddCharge = () => {
    if (newCharge.label && newCharge.value) {
      setCharges([...charges, newCharge]);
      setNewCharge({ label: "", value: "", type: "%", optional: false });
    }
  };

  const handleAddDiscount = () => {
    if (newDiscount.label && newDiscount.value) {
      setDiscounts([...discounts, newDiscount]);
      setNewDiscount({ label: "", value: "", type: "%" });
    }
  };

  const handleRemoveCharge = (index) => {
    const updated = [...charges];
    updated.splice(index, 1);
    setCharges(updated);
  };

  const handleRemoveDiscount = (index) => {
    const updated = [...discounts];
    updated.splice(index, 1);
    setDiscounts(updated);
  };

  const toggleOptional = (index) => {
    const updated = [...charges];
    updated[index].optional = !updated[index].optional;
    setCharges(updated);
  };

  const handleSave = () => {
    const billingDetailsPayload = {
      partnerId: partnerDetails.partnerId,
      currency: invoiceSettings.currency,
      gstin: invoiceSettings.gstin,
      upiId: invoiceSettings.upiId,
      footerMessage: invoiceSettings.footerMessage,
      charges: charges,
      discounts: discounts,
    };

    console.log("Saving Billing Details...", billingDetailsPayload);
    saveBillingDetails(billingDetailsPayload);
  };

  return (
    <div className="w-full p-5 flex flex-col gap-4 h-[calc(100vh-20px)] overflow-y-scroll">

      {/* GRID for Additional Charges + Default Discount */}
      {isProfileLoading ?
        <div className="w-full h-full flex items-center justify-center">
          <Loader></Loader>
        </div>
        :
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Additional Charges Section */}
            <div className="bg-white rounded-lg p-4 border border-red-300">
              <h2 className="text-base font-semibold mb-4">Charges</h2>
              {charges.map((charge, index) => (
                <div key={index} className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    placeholder="Label"
                    className="border p-2 rounded-md w-1/2 flex-grow ml-2 first:ml-0"
                    value={charge.label}
                    onChange={(e) => {
                      const updated = [...charges];
                      updated[index].label = e.target.value;
                      setCharges(updated);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Value"
                    className="border p-2 rounded-md w-1/4 ml-2 first:ml-0"
                    value={charge.value}
                    onChange={(e) => {
                      const updated = [...charges];
                      updated[index].value = e.target.value;
                      setCharges(updated);
                    }}
                  />
                  <select
                    className="border p-2 rounded-md ml-2 first:ml-0"
                    value={charge.type}
                    onChange={(e) => {
                      const updated = [...charges];
                      updated[index].type = e.target.value;
                      setCharges(updated);
                    }}
                  >
                    <option value="%">%</option>
                    <option value="₹">₹</option>
                  </select>

                  {/* Optional Button */}
                  <button
                    onClick={() => toggleOptional(index)}
                    className={`px-3 py-3 rounded-md ml-2 first:ml-0 text-xs font-semibold transition-all duration-75
                  ${charge.optional ? "bg-green-200 text-green-800" : "bg-gray-300 text-white"}
                `}
                  >
                    Optional
                  </button>

                  {/* Remove Icon */}
                  <span
                    onClick={() => handleRemoveCharge(index)}
                    className="material-symbols-outlined ml-2 first:ml-0 text-white cursor-pointer bg-red-300 hover:bg-red-500 transition-colors duration-200 rounded-full p-2"
                  >
                    remove
                  </span>
                </div>
              ))}

              {/* Add New Charge Row */}
              <div className="flex items-center justify-between mt-4">
                <input
                  type="text"
                  placeholder="New Charge Label"
                  className="border p-2 rounded-md flex-grow ml-2 first:ml-0"
                  value={newCharge.label}
                  onChange={(e) => setNewCharge({ ...newCharge, label: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Value"
                  className="border p-2 rounded-md w-1/5 ml-2 first:ml-0"
                  value={newCharge.value}
                  onChange={(e) => setNewCharge({ ...newCharge, value: e.target.value })}
                />
                <select
                  className="border p-2 rounded-md ml-2 first:ml-0"
                  value={newCharge.type}
                  onChange={(e) => setNewCharge({ ...newCharge, type: e.target.value })}
                >
                  <option value="%">%</option>
                  <option value="₹">₹</option>
                </select>

                {/* Add Icon */}
                <span
                  onClick={handleAddCharge}
                  className="material-symbols-outlined ml-2 first:ml-0 text-white cursor-pointer bg-green-300 hover:bg-green-500 transition-colors duration-200 rounded-full p-2"
                >
                  add
                </span>
              </div>
            </div>

            {/* Default Discount Section */}
            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <h2 className="font-semibold mb-4">Discounts</h2>

              {discounts.map((discount, index) => (
                <div key={index} className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    placeholder="Label"
                    className="border p-2 rounded-md flex-grow ml-2 first:ml-0"
                    value={discount.label}
                    onChange={(e) => {
                      const updated = [...discounts];
                      updated[index].label = e.target.value;
                      setDiscounts(updated);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Value"
                    className="border p-2 rounded-md w-1/4 ml-2 first:ml-0"
                    value={discount.value}
                    onChange={(e) => {
                      const updated = [...discounts];
                      updated[index].value = e.target.value;
                      setDiscounts(updated);
                    }}
                  />
                  <select
                    className="border p-2 rounded-md ml-2 first:ml-0"
                    value={discount.type}
                    onChange={(e) => {
                      const updated = [...discounts];
                      updated[index].type = e.target.value;
                      setDiscounts(updated);
                    }}
                  >
                    <option value="%">%</option>
                    <option value="₹">₹</option>
                  </select>

                  {/* Remove Icon */}
                  <span
                    onClick={() => handleRemoveDiscount(index)}
                    className="material-symbols-outlined ml-2 first:ml-0 text-white cursor-pointer bg-red-300 hover:bg-red-500 transition-colors duration-200 rounded-full p-2"
                  >
                    remove
                  </span>
                </div>
              ))}

              {/* Add New Discount Row */}
              <div className="flex items-center justify-between mt-4">
                <input
                  type="text"
                  placeholder="New Discount Label"
                  className="border p-2 rounded-md flex-grow ml-2 first:ml-0"
                  value={newDiscount.label}
                  onChange={(e) => setNewDiscount({ ...newDiscount, label: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Value"
                  className="border p-2 rounded-md w-1/5 ml-2 first:ml-0"
                  value={newDiscount.value}
                  onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
                />
                <select
                  className="border p-2 rounded-md ml-2 first:ml-0"
                  value={newDiscount.type}
                  onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                >
                  <option value="%">%</option>
                  <option value="₹">₹</option>
                </select>

                {/* Add Icon */}
                <span
                  onClick={handleAddDiscount}
                  className="material-symbols-outlined ml-2 first:ml-0 text-white cursor-pointer bg-green-300 hover:bg-green-500 transition-colors duration-200 rounded-full p-2"
                >
                  add
                </span>
              </div>
            </div>
          </div>
          {/* Invoice Settings Section */}
          <div className="bg-white rounded-lg ">
            <h2 className="font-semibold mb-4">Invoice Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Business Name <i className="text-xs text-gray-500">(editable in the brand section)</i>
                </label>
                <input
                  type="text"
                  className="border p-2 rounded-md"
                  placeholder="Enter Restaurant Name"
                  value={invoiceSettings.restaurantName}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">GSTIN (if registered)</label>
                <input
                  type="text"
                  className="border p-2 rounded-md"
                  placeholder="Enter GSTIN Number"
                  value={invoiceSettings.gstin}
                  onChange={(e) =>
                    setInvoiceSettings({ ...invoiceSettings, gstin: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Currency</label>
                <select
                  className="border p-2 rounded-md"
                  value={invoiceSettings.currency || "INR"}
                  onChange={(e) =>
                    setInvoiceSettings({ ...invoiceSettings, currency: e.target.value })
                  }
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">UPI ID</label>
                <input
                  type="text"
                  className="border p-2 rounded-md"
                  placeholder="Enter UPI ID"
                  value={invoiceSettings.upiId || ""}
                  onChange={(e) =>
                    setInvoiceSettings({ ...invoiceSettings, upiId: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium mb-1">
                  Address <i className="text-xs text-gray-500">(editable in the brand section)</i>
                </label>
                <textarea
                  className="border p-2 rounded-md"
                  rows="2"
                  placeholder="Enter Business Address"
                  value={invoiceSettings.address}
                  disabled
                ></textarea>
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium mb-1">Footer Message (Terms & Conditions)</label>
                <textarea
                  className="border p-2 rounded-md"
                  rows="2"
                  placeholder="e.g., Thank you for dining with us!"
                  value={invoiceSettings.footerMessage}
                  onChange={(e) =>
                    setInvoiceSettings({ ...invoiceSettings, footerMessage: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 transition-colors duration-200 text-white font-semibold py-2 px-6 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </>
      }
    </div>
  );
}
