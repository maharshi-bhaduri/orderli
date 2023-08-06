import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { postService } from "../utils/APIService";
import { getMenu } from "../utils/queryService";
import localforage from "localforage";
import MenuEditRow from "../components/MenuEditRow";
import { AnimatePresence, motion } from "framer-motion";
import TabGroup from "../components/TabGroup";
import { tabMap } from "../utils/optionMap";
import BorderedPallete from "../components/BorderedPallete";
import GraphicButton from "../components/GraphicButton";

export default function ProviderMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { providerHandle } = useParams();
  const { data: menu, isLoading, isError } = getMenu(providerHandle);
  const [updatedMenu, setUpdatedMenu] = useState([]);
  const [category, setCategory] = useState("");
  const [addingNewItem, setAddingNewItem] = useState(false)
  const noCatText = "Please select a category to see items contained."
  const defaultNewMenuItem = {
    menuId: Date.now(), //temporary
    itemName: "",
    description: "",
    price: 0,
  };

  const [newMenuItem, setNewMenuItem] = useState(defaultNewMenuItem);
  const [editItemId, setEditItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMenuItem, setEditedMenuItem] = useState({});
  const variants = {
    enter: {
      x: -50, // Slide in from the left
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: 50, // Slide out to the right
      opacity: 0,
    },
  };

  const updateMenuItemsWithCachedOperations = async () => {
    const addOperations = (await localforage.getItem("add")) || [];
    const updateOperations = (await localforage.getItem("update")) || [];
    const deleteOperations = (await localforage.getItem("delete")) || [];

    const updatedMenuItems = menu.map((menuItem) => {
      const updateOperation = updateOperations.find(
        (operation) => operation.menuId === menuItem.menuId
      );
      const deleteOperation = deleteOperations.find(
        (operation) => operation.menuId === menuItem.menuId
      );
      if (deleteOperation) {
        return { ...deleteOperation, operation: "delete" };
      }
      if (updateOperation) {
        return { ...updateOperation, operation: "update" };
      }
      return { ...menuItem, operation: null };
    });
    const removedDeletes = updatedMenuItems.filter(
      (item) => item.operation !== "delete"
    );

    const updatedMenuWithAdditions = [
      ...removedDeletes,
      ...addOperations.map((menuItem) => ({ ...menuItem, operation: "add" })),
    ];
    setUpdatedMenu(updatedMenuWithAdditions);
  };

  useEffect(() => {
    if (menu) {
      updateMenuItemsWithCachedOperations();
    }
  }, [menu]);

  const { mutate: updateMenu } = useMutation(
    (cachedChanges) =>
      postService(import.meta.env.VITE_APP_UPDATE_MENU, cachedChanges),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menu", providerHandle]);
      },
    }
  );

  const handleSaveMenu = async () => {
    const addOperations = (await localforage.getItem("add")) || [];
    const updateOperations = (await localforage.getItem("update")) || [];
    const deleteOperations = (await localforage.getItem("delete")) || [];

    const removeOperationKey = (obj) => {
      const { operation, ...updatedData } = obj;
      return updatedData;
    };
    const addListWithoutOperation = addOperations
      .map(removeOperationKey)
      .map((obj) => {
        const { menuId, ...updatedData } = obj;
        return updatedData;
      });
    const updateListWithoutOperation = updateOperations.map(removeOperationKey);
    const deleteListWithoutOperation = deleteOperations.map(removeOperationKey);

    const cachedChanges = {
      providerHandle: providerHandle,
      addMenuItems: addListWithoutOperation,
      updateMenuItems: updateListWithoutOperation,
      deleteMenuItems: deleteListWithoutOperation,
    };

    await localforage.setItem("update", []);
    await localforage.setItem("add", []);
    await localforage.setItem("delete", []);

    updateMenu(cachedChanges);
  };

  const handleAddMenuItem = async () => {
    const addOperations = (await localforage.getItem("add")) || [];
    // setNewAdditionDisabled(true);
    // const newItemOper = { ...newMenuItem, operation: "add" }
    addOperations.push(newMenuItem);
    // addMenuItem(newMenuItem);
    setUpdatedMenu((prevUpdatedMenu) => [
      ...prevUpdatedMenu,
      { ...newMenuItem, operation: "add" },
    ]);
    await localforage.setItem("add", addOperations);
    setNewMenuItem(defaultNewMenuItem);
  };

  const handleUpdateMenuItem = async (menuItem) => {
    console.log("menuItem ", menuItem);
    if (menuItem.operation === "add") {
      const addOperations = await localforage.getItem("add");
      const updatedAddCache = addOperations.map((cachedItem) =>
        cachedItem.menuId === menuItem.menuId ? menuItem : cachedItem
      );
      await localforage.setItem("add", updatedAddCache);
    } else if (!menuItem.operation || menuItem.operation === "update") {
      const updateOperations = (await localforage.getItem("update")) || [];
      const updatedOperations = updateOperations.map((operation) => {
        if (operation.menuId === menuItem.menuId) {
          return menuItem;
        }
        return operation;
      });
      const isMenuItemUpdated = updateOperations.some(
        (operation) => operation.menuId === menuItem.menuId
      );

      if (!isMenuItemUpdated) {
        updatedOperations.push(menuItem);
      }
      await localforage.setItem("update", updatedOperations);
    }
    updateMenuItemsWithCachedOperations();
    setIsEditing(false);
  };

  const handleDeleteMenuItem = async (menuItem) => {
    if (menuItem.operation === "add") {
      const addOperations = await localforage.getItem("add");
      const indexToRemove = addOperations.findIndex(
        (item) => item.menuId === menuItem.menuId
      );
      // If the menu item is found, remove it from the array
      if (indexToRemove !== -1) {
        addOperations.splice(indexToRemove, 1);
        // Save the updated addOperations array back to localforage
        await localforage.setItem("add", addOperations);
      }
    } else if (menuItem.operation === null || menuItem.operation === "update") {
      const deleteOperations = (await localforage.getItem("delete")) || [];
      deleteOperations.push(menuItem);
      await localforage.setItem("delete", deleteOperations);
    }
    updateMenuItemsWithCachedOperations();
  };

  const handleEditMenuItem = (menuItem) => {
    setEditItemId(menuItem.menuId);
    setIsEditing(true);
    setEditedMenuItem(menuItem);
  };

  const cancelEditMenuItem = async (editedMenuItem) => {
    const updateOperations = (await localforage.getItem("update")) || [];

    const updatedOperations = updateOperations.filter(
      (operation) => operation.menuId !== editedMenuItem.menuId
    );

    await localforage.setItem("update", updatedOperations);
    setIsEditing(false);
  };

  const handleCategorySelect = async (categoryName) => {
    setCategory(categoryName);
  };
  console.log(category)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex m-2 w-full items-center ">
        <div className="h-full flex-grow rounded-lg p-2 bg-white items-center justify-center">
          <TabGroup
            tabMap={tabMap}
            onSelect={handleCategorySelect}
            newTab="+ Category"
          />
        </div>
        <div className="h-full flex-grow justify-evenly flex rounded-lg ml-4 p-2 bg-white">
          <button
            onClick={() => handleSaveMenu()}
            className={`bg-blue-500 text-white m-2 px-4 py-2 rounded-lg hover:bg-blue-600"}`}
          >
            Save
          </button>
          <GraphicButton text={"Add Item"} onClick={() => setAddingNewItem(!addingNewItem)} />
        </div>
      </div>
      <div
        className="rounded-lg my-2 bg-white px-4 pb-4 h-[calc(100vh-121px)] overflow-y-auto
          w-full flex flex-col items-center text-sm"
      >
        {!category ?
          <BorderedPallete type="notify">
            <div className="w-full flex items-center justify-center ">
              {noCatText}
            </div>
          </BorderedPallete>
          :
          <BorderedPallete title="Menu">
            <div className="flex flex-col w-full">
              {
                addingNewItem &&
                <BorderedPallete type="notify">
                  <table>
                    <tbody>
                      <MenuEditRow
                        editedMenuItem={newMenuItem}
                        type="add"
                        handleAddMenuItem={() => handleAddMenuItem()}
                        onChange={(e) => {
                          setNewMenuItem(e);
                        }}
                      />
                    </tbody>
                  </table>
                </BorderedPallete>
              }
              <div className="flex justify-center my-4">
                {isLoading ? (
                  <p>Loading menu items...</p>
                ) : isError ? (
                  <p>Error loading menu items.</p>
                ) : updatedMenu?.length == 0 ? (
                  <div className="flex w-3/4 justify-center rounded-lg border border-gray-300 bg-gray-100 p-5">
                    <h1>Ready to Set the Table? Add an Item!</h1>
                  </div>
                ) : (
                  <table className="w-3/4 mt-4">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-gray-100 text-left">Item Name</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Description</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Price</th>
                        <th className="py-2 px-4 bg-gray-100 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {!isLoading &&
                          updatedMenu.map((menuItem) =>
                            editItemId === menuItem.menuId && isEditing ? (
                              <MenuEditRow
                                key={menuItem.menuId}
                                editedMenuItem={editedMenuItem}
                                cancelEditMenuItem={() =>
                                  cancelEditMenuItem(editedMenuItem)
                                }
                                handleUpdateMenuItem={() =>
                                  handleUpdateMenuItem(editedMenuItem)
                                }
                                type="update"
                                onChange={(e) => {
                                  setEditedMenuItem(e);
                                }}
                              />
                            ) : (
                              <motion.tr key={menuItem.menuId}
                                initial="enter"
                                animate="visible"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.3 }}>
                                <td className="py-2 px-4 w-1/4">{menuItem.itemName}</td>
                                <td className="py-2 px-4 w-1/4">
                                  {menuItem.description}
                                </td>
                                <td className="py-2 px-4 w-1/4">{menuItem.price}</td>
                                <td className="py-2 px-4 w-1/4 flex">
                                  <button
                                    onClick={() => handleEditMenuItem(menuItem)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mx-2"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenuItem(menuItem)}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mx-2"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </motion.tr>
                            )
                          )
                        }
                      </AnimatePresence>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </BorderedPallete>
        }
      </div>
    </div>
  );
}
