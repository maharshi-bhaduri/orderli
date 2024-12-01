import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../utils/APIService";
import { getMenu } from "../utils/queryService";
import localforage from "localforage";
import TabGroup from "../components/TabGroup";
import MenuItemCard from "../components/MenuItemCard";
import BorderedPallete from "../components/BorderedPallete";
import GraphicButton from "../components/GraphicButton";
import MenuItemGrid from "../components/MenuItemGrid";
import Loader from "../components/Loader";

export default function ProviderMenu() {
  const queryClient = useQueryClient();
  const [addCategory, setAddCategory] = useState(false);
  const { partnerHandle } = useParams();
  const {
    data: menu,
    isLoading: isMenuLoading,
    isError,
  } = getMenu(partnerHandle);
  const [updatedMenu, setUpdatedMenu] = useState([]);
  const [category, setCategory] = useState("");
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(-1);
  const noCatText = "Please select a category to see items contained.";

  const defaultNewMenuItem = {
    menuId: Date.now(),
    itemName: "",
    description: "",
    dietCategory: 1,
    category: category,
    serves: 1,
    price: 0,
    activeFlag: 1,
  };

  const [newMenuItem, setNewMenuItem] = useState(defaultNewMenuItem);
  const [categories, setCategories] = useState([]);
  const [editedMenuItem, setEditedMenuItem] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [pendingChanges, setPendingChanges] = useState(false);
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

    // Create a Set to store unique categories
    const uniqueCategories = new Set(categories);
    // Loop through the API response and add categories to the Set
    updatedMenuWithAdditions.forEach((item) => {
      if (item.category !== null) {
        uniqueCategories.add(item.category);
      }
    });

    // Convert the Set to an array
    setCategories(Array.from(uniqueCategories));
  };

  useEffect(() => {
    if (menu) {
      updateMenuItemsWithCachedOperations();
    }
  }, [menu]);

  useEffect(() => {
    if (!category) {
      setCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    checkForChanges().then((hasChanges) => {
      setPendingChanges(hasChanges);
    });
  });

  const checkForChanges = async () => {
    try {
      const addList = (await localforage.getItem("add")) || [];
      const updateList = (await localforage.getItem("update")) || [];
      const deleteList = (await localforage.getItem("delete")) || [];
      const hasChanges =
        addList.length > 0 || updateList.length > 0 || deleteList.length > 0;
      return hasChanges;
    } catch (error) {
      console.error("Error checking for changes:", error);
      return false;
    }
  };

  const { mutate: updateMenu, isLoading: isUpdatingMenu } = useMutation(
    (cachedChanges) =>
      postService(import.meta.env.VITE_APP_UPDATE_MENU, cachedChanges),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menu", partnerHandle]);
        setAddingNewItem(false);
        setEditedMenuItem(null);
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
      partnerHandle: partnerHandle,
      addMenuItems: addListWithoutOperation,
      updateMenuItems: updateListWithoutOperation,
      deleteMenuItems: deleteListWithoutOperation,
    };

    await localforage.setItem("update", []);
    await localforage.setItem("add", []);
    await localforage.setItem("delete", []);

    updateMenu(cachedChanges);
  };

  const handleAddMenuItem = async (menuItem) => {
    setAddingNewItem(true);
    const addOperations = (await localforage.getItem("add")) || [];
    const newItem = { ...menuItem, operation: "add" };
    const isMenuItemAdded = addOperations.some(
      (operation) => operation.menuId === menuItem.menuId
    );

    if (!isMenuItemAdded) {
      addOperations.push(newItem);
    }
    const updatedAddCache = addOperations.map((cachedItem) =>
      cachedItem.menuId === newItem.menuId ? newItem : cachedItem
    );
    if (updatedAddCache.length == 0) {
      await localforage.setItem("add", [newItem]);
    } else {
      await localforage.setItem("add", updatedAddCache);
    }
    updateMenuItemsWithCachedOperations();
  };

  const handleUpdateMenuItem = async (menuItem) => {
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
  };

  const handleDeleteMenuItem = async (menuItem) => {
    setNewMenuItem(null);
    setEditedMenuItem(null);
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
  // let isMenuLoading = true;

  const handleEditMenuItem = (menuItem) => {
    setActiveMenuId(menuItem.menuId);
    setAddingNewItem(false);
    setEditedMenuItem(menuItem);
  };

  const handleCategorySelect = async (categoryName) => {
    setCategory(categoryName);
  };

  return (
    <div className="w-full rounded-lg">
      {/* Category section below*/}
      <div className="w-full flex items-center">
        {addCategory ? (
          <div className="h-full flex items-center m-2">
            <input
              type="text"
              className="text-lg border border-blue-700 w-28 px-2 py-1 rounded-l-lg focus:border-blue-700 focus:outline-none focus:outline-8"
              autoFocus
              onChange={(e) => {
                setNewCategory(e.target.value);
              }}
            ></input>
            <div
              className="border border-blue-700 transition ease-in-out cursor-pointer select-none 
                        bg-blue-500 hover:bg-blue-700 flex items-center py-1 px-2 text-white"
              onClick={() => {
                setCategories([...categories, newCategory]);
                setAddCategory(false);
              }}
            >
              <span className="material-symbols-outlined text-lg">check</span>
            </div>
            <div
              className="rounded-r-lg border border-gray-700 transition ease-in-out cursor-pointer select-none 
                        bg-gray-500 hover:bg-gray-700 flex items-center text-white py-1 px-2"
              onClick={() => setAddCategory(false)}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-end sticky top-0 right-0">
            <div
              className="rounded-lg border border-gray-200 m-2 p-2 cursor-pointer select-none 
                        bg-blue-500 hover:bg-blue-700"
              onClick={() => setAddCategory(true)}
            >
              <h1 className="text-sm text-white whitespace-nowrap">
                + Category
              </h1>
            </div>
          </div>
        )}
        <div className="w-0 border-r-2 border-gray-300 mx-1 my-3 rounded-full">
          &nbsp;
        </div>
        <div
          className="flex flex-auto mt-2 mx-2 overflow-x-scroll"
          style={{ scrollbarGutter: "stable" }}
        >
          <TabGroup
            tabMap={categories}
            onSelect={handleCategorySelect}
            selectedOption={category ? category : categories[0]}
          />
        </div>
        <div className="w-0 border-r-2 border-gray-300 mx-1 my-3 rounded-full">
          &nbsp;
        </div>
        <div className="h-full flex justify-end sticky top-0 right-0">
          {/* Actions section below link*/}

          <div className="w-auto flex items-center ">
            {isUpdatingMenu ? (
              <GraphicButton
                buttonStyle="bluefill"
                onClick={() => handleSaveMenu()}
                disabled={true}
              >
                Syncing
                <span className="ml-2 relative flex justify-center items-center w-full h-full">
                  <span className="w-3/ h-3/4 border-8 border-solid border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></span>
                </span>
              </GraphicButton>
            ) : pendingChanges ? (
              <GraphicButton
                buttonStyle="bluefill"
                onClick={() => handleSaveMenu()}
                disabled={isMenuLoading}
              >
                Sync
              </GraphicButton>
            ) : (
              <GraphicButton
                buttonStyle="greenline"
                onClick={() => handleSaveMenu()}
                disabled={true}
              >
                Synced
                <span className="material-symbols-outlined ml-2">
                  check_circle
                </span>
              </GraphicButton>
            )}
          </div>
        </div>
      </div>
      <div
        className="pb-4 h-[calc(100vh-132px)]
          w-full col-span-5"
      >
        <div className="flex flex-col items-center text-sm w-full h-full">
          {
            <div className="flex flex-col w-full h-full">
              {isMenuLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : isError ? (
                <p>Error loading menu items.</p>
              ) : (
                <div className="grid grid-cols-5">
                  <div className="flex flex-col col-span-2 mx-2 mt-2">
                    <div className="bg-gray-100 px-4 py-2 flex items-center border border-gray-200 border-b-0 rounded-t-lg">
                      <h2 className="text-xl">{category}</h2>
                      <div
                        className="rounded-lg border border-gray-200 p-2 mx-2 transition ease-in-out cursor-pointer select-none 
                                 bg-blue-500 hover:bg-blue-700 sticky left-2"
                        onClick={() => {
                          setNewMenuItem(defaultNewMenuItem);
                          setAddingNewItem(true);
                          setActiveMenuId(defaultNewMenuItem.menuId);
                        }}
                      >
                        <h1 className="text-sm text-white whitespace-nowrap">
                          + Item
                        </h1>
                      </div>
                    </div>
                    <div className="pb-4 overflow-y-scroll max-h-[calc(100vh-146px)] bg-gray-100 border border-x-gray-200 border-t-0 pl-2 rounded-b-lg"
                      style={{ scrollbarGutter: "stable" }}
                    >
                      {!isMenuLoading && updatedMenu?.length == 0 ? (
                        <div className="flex w-3/4 my-4 justify-center rounded-lg border border-gray-300 bg-gray-100 p-5">
                          <h1>Ready to Set the Table? Add an Item!</h1>
                        </div>
                      ) : (
                        updatedMenu
                          .filter((item) => item.category === category)
                          .map((item, index) => (
                            <MenuItemCard
                              key={item.menuId}
                              item={item}
                              id={item.menuId}
                              activeId={activeMenuId}
                              onSelect={handleEditMenuItem}
                            />
                          ))
                      )}
                    </div>
                  </div>
                  <div className="col-span-3 px-2">
                    {!addingNewItem && !editedMenuItem && (
                      <div className="h-full mt-4">
                        <BorderedPallete type="notify">
                          <div className="flex justify-center w-full">
                            Select an item to edit or add a new item
                          </div>
                        </BorderedPallete>
                      </div>
                    )}
                    {addingNewItem
                      ? newMenuItem && (
                        <div className="relative h-[calc(100vh-132px)] overflow-y-scroll mt-4">
                          <BorderedPallete title="Add New Item">
                            <div className="absolute top-0 right-0">
                              <GraphicButton
                                text="Delete"
                                buttonStyle="red"
                                onClick={() =>
                                  handleDeleteMenuItem({
                                    ...newMenuItem,
                                    operation: "add",
                                  })
                                }
                                disabled={isMenuLoading}
                              />
                            </div>
                            <MenuItemGrid
                              item={newMenuItem}
                              categories={categories}
                              type="update"
                              onChange={(e) => {
                                setNewMenuItem(e);
                                setCategory(e.category);
                                handleAddMenuItem(e);
                              }}
                            />
                          </BorderedPallete>
                        </div>
                      )
                      : editedMenuItem && (
                        <div className="relative h-[calc(100vh-132px)] overflow-y-scroll mt-4">
                          <BorderedPallete title="Edit Menu Item">
                            <div className="absolute top-0 right-0">
                              <GraphicButton
                                text="Delete"
                                buttonStyle="red"
                                onClick={() =>
                                  handleDeleteMenuItem(editedMenuItem)
                                }
                              />
                            </div>
                            <MenuItemGrid
                              item={editedMenuItem}
                              categories={categories}
                              type="update"
                              onChange={(e) => {
                                setEditedMenuItem(e);
                                setCategory(e.category);
                                handleUpdateMenuItem(e);
                              }}
                            />
                          </BorderedPallete>
                        </div>
                      )}
                  </div>
                  <div className="grid grid-cols-6 col-span-1"></div>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
