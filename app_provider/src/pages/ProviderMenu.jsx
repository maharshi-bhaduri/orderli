import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { postService } from "../utils/APIService";
import { getMenu } from "../utils/queryService";
import localforage from "localforage";
import MenuEditRow from "../components/MenuEditRow";
import { AnimatePresence, motion } from "framer-motion";
import { dietMap } from "../utils/optionMap";
import TabGroup from "../components/TabGroup";
import { tabMap } from "../utils/optionMap";
import MenuItemCard from "../components/MenuItemCard";
import BorderedPallete from "../components/BorderedPallete";
import GraphicButton from "../components/GraphicButton";
import MenuItemGrid from "../components/MenuItemGrid";

export default function ProviderMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addCategory, setAddCategory] = useState(false)
  const { providerHandle } = useParams();
  const { data: menu, isLoading, isError } = getMenu(providerHandle);
  const [updatedMenu, setUpdatedMenu] = useState([]);
  const [category, setCategory] = useState("");
  const [menuItem, setMenuItem] = useState(false);
  const [addingNewItem, setAddingNewItem] = useState(false)
  const noCatText = "Please select a category to see items contained."
  const defaultNewMenuItem = {
    menuId: Date.now(), //temporary
    itemName: "",
    description: "",
    dietCategory: 1,
    category: category,
    serves: 1,
    price: 0,
    activeFlag: 1
  };

  const [newMenuItem, setNewMenuItem] = useState(defaultNewMenuItem);
  const [editItemId, setEditItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editedMenuItem, setEditedMenuItem] = useState(null);
  const [newCategory, setNewCategory] = useState("")
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
    // Create a Set to store unique categories
    const uniqueCategories = new Set(categories);

    // Loop through the API response and add categories to the Set
    menu.forEach(item => {
      if (item.category !== null) {
        uniqueCategories.add(item.category);
      }
    });

    // Convert the Set to an array
    setCategories(Array.from(uniqueCategories));

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

  const handleAddMenuItem = async (menuItem) => {
    const addOperations = (await localforage.getItem("add")) || [];
    console.log("addOperations ", addOperations)
    console.log("menuItem ", menuItem)
    const updatedAddCache = addOperations.map((cachedItem) =>
      cachedItem.menuId === menuItem.menuId ? menuItem : cachedItem
    );
    console.log("updatedAddCache ", updatedAddCache)
    // setNewAdditionDisabled(true);
    // const newItemOper = { ...newMenuItem, operation: "add" }
    // updatedAddCache.push(newMenuItem);
    // addMenuItem(newMenuItem);
    setUpdatedMenu((prevUpdatedMenu) => [
      ...prevUpdatedMenu,
      { ...newMenuItem, operation: "add" },
    ]);
    await localforage.setItem("add", updatedAddCache);
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
    setAddingNewItem(false)
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

  const handleMenuItemSelect = async (menuId) => {
    setMenuItem(menuId);
  };

  return (
    <div className="w-full grid grid-cols-5 rounded-lg my-2 bg-white shadow-md">
      <div className="grid grid-cols-5 col-span-5">
        {/* Category section below*/}
        <div className="rounded-lg col-span-3 flex items-center overflow-x-scroll bg-gray-100">

          {
            addCategory ?
              <div className="h-full flex items-center bg-gray-300 rounded-lg sticky left-0">
                <input type="text" className="border border-gray-300 w-28 px-2 ml-4 mr-2 py-1 rounded"
                  autoFocus
                  onChange={(e) => { setNewCategory(e.target.value) }}></input>
                <div
                  className="rounded-lg border border-gray-200 my-2 p-2 transition ease-in-out cursor-pointer select-none 
                        bg-blue-500 hover:bg-blue-700 sticky left-2"
                  onClick={() => setCategories([...categories, newCategory])}
                >
                  <h1 className="text-sm text-white whitespace-nowrap">Add</h1>
                </div>
                <div
                  className="rounded-lg border border-gray-200 m-2 p-2 transition ease-in-out cursor-pointer select-none 
                        bg-gray-500 hover:bg-gray-700 sticky left-2"
                  onClick={() => setAddCategory(false)}
                >
                  <h1 className="text-sm text-white whitespace-nowrap">Cancel</h1>
                </div>
              </div>
              :
              <div
                className="rounded-lg border border-gray-200 my-2 p-2 transition ease-in-out cursor-pointer select-none 
                        bg-blue-500 hover:bg-blue-700 sticky left-2"
                onClick={() => setAddCategory(true)}
              >
                <h1 className="text-sm text-white whitespace-nowrap">+ Category</h1>
              </div>

          }
          <div className="flex items-center ml-2">
            <TabGroup
              tabMap={categories}
              onSelect={handleCategorySelect}
            />
          </div>
        </div>
        <div className="bg-white col-span-2">
          {/* Actions section below*/}
          <div className="w-auto pl-2 col-span-2">
            <div className=" w-full flex justify-evenly rounded-lg  bg-white">
              <button
                onClick={() => handleSaveMenu()}
                className={`bg-blue-500 text-white m-2 px-4 py-2 rounded-lg hover:bg-blue-600"}`}
              >
                Save
              </button>
              <GraphicButton text={"Add Item"} onClick={() => {
                setNewMenuItem(defaultNewMenuItem);
                setAddingNewItem(!addingNewItem)
              }
              } />
            </div>
          </div>
        </div>
      </div>
      <div
        className="pb-4 h-[calc(100vh-112px)] overflow-y-scroll
          w-full col-span-5"
      >
        <div className="-mt-4 flex flex-col items-center text-sm w-full">
          {!category ?
            <BorderedPallete type="notify">
              <div className="w-full flex items-center justify-center ">
                {noCatText}
              </div>
            </BorderedPallete>
            :
            <div className="flex flex-col w-full">
              {isLoading ? (
                <p className="my-4">Loading menu items...</p>
              ) : isError ? (
                <p>Error loading menu items.</p>
              ) : updatedMenu?.length == 0 ? (
                <div className="flex w-3/4 my-4 justify-center rounded-lg border border-gray-300 bg-gray-100 p-5">
                  <h1>Ready to Set the Table? Add an Item!</h1>
                </div>
              ) : (
                <div className="grid grid-cols-5 mt-4">
                  <div className="flex flex-col col-span-2">
                    <div className="bg-gray-100 px-4 pb-2 flex items-center">
                      <h2 className="text-xl">
                        Items
                      </h2>
                      <div
                        className="rounded-lg border border-gray-200 p-2 mx-2 transition ease-in-out cursor-pointer select-none 
                                 bg-blue-500 hover:bg-blue-700 sticky left-2"
                        onClick={() => {
                          setNewMenuItem(defaultNewMenuItem);
                          setAddingNewItem(!addingNewItem);
                        }}
                      >
                        <h1 className="text-sm text-white whitespace-nowrap">+ New</h1>
                      </div>
                    </div>
                    <div className="pb-4 h-[calc(100vh-152px)] overflow-y-scroll">
                      {!isLoading &&
                        updatedMenu.filter(
                          (item) => item.category === category
                        )
                          .map((item, index) =>
                            <MenuItemCard
                              key={item.menuId}
                              item={item}
                              id={item.menuId}
                              onSelect={handleEditMenuItem}
                            />
                          )
                      }
                    </div>
                  </div>
                  <div className="col-span-3 px-4">
                    {addingNewItem ? (
                      newMenuItem &&
                      <BorderedPallete title="Add New Item">

                        <MenuItemGrid
                          item={newMenuItem}
                          categories={categories}
                          type="update"
                          onChange={(e) => {
                            console.log("e", e)
                            setNewMenuItem(e);
                            handleAddMenuItem(e);
                          }}
                        />
                      </BorderedPallete>
                    )
                      :
                      (
                        editedMenuItem &&
                        <BorderedPallete title="Edit Menu Item">

                          <MenuItemGrid
                            item={editedMenuItem}
                            categories={categories}
                            type="update"
                            onChange={(e) => {
                              setEditedMenuItem(e);
                              handleUpdateMenuItem(e);
                            }}
                          />
                        </BorderedPallete>
                      )
                    }
                  </div>
                  <div className="grid grid-cols-6 col-span-1">
                  </div>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
