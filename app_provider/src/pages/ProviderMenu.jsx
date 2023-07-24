import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from 'react-query';
import { postService } from "../utils/APIService";
import { getMenu } from "../utils/queryService";
import localforage from "localforage";
import MenuEditRow from "../components/MenuEditRow";

export default function ProviderMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newAdditionDisabled, setNewAdditionDisabled] = useState(false)
  const [updateEnabled, setUpdateEnabled] = useState(-1)
  const { providerHandle } = useParams();
  const { data: menu, isLoading, isError } = getMenu(providerHandle);
  const [updatedMenu, setUpdatedMenu] = useState([]);
  const defaultNewMenuItem = {
    menuId: Date.now(),
    itemName: "",
    description: "",
    price: 0
  }

  const [newMenuItem, setNewMenuItem] = useState(defaultNewMenuItem);

  const [editItemId, setEditItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteRow, setDeleteRow] = useState(-1);
  const [editedMenuItem, setEditedMenuItem] = useState({});

  const updateMenuItemsWithCachedOperations = async () => {
    const addOperations = await localforage.getItem('add') || [];
    const updateOperations = await localforage.getItem('update') || [];
    const deleteOperations = await localforage.getItem('delete') || [];

    const updatedMenuItems = menu.map((menuItem) => {
      const updateOperation = updateOperations.find(
        (operation) => operation.menuId === menuItem.menuId
      );
      const deleteOperation = deleteOperations.find(
        (operation) => operation.menuId === menuItem.menuId
      );
      if (updateOperation) {
        return { ...updateOperation, operation: 'update' };
      }
      if (deleteOperation) {
        return { ...deleteOperation, operation: 'delete' };
      }
      return { ...menuItem, operation: null };
    });
    const removedDeletes = updatedMenuItems.filter((item) => item.operation !== 'delete');
    const updatedMenuWithAdditions = [...removedDeletes,
    ...addOperations.map(
      (menuItem) => ({ ...menuItem, operation: 'add' })
    )
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
        queryClient.invalidateQueries(['menu', providerHandle]);
      }
    }
  );

  const handleSaveMenu = async () => {
    const addOperations = await localforage.getItem('add') || [];
    const updateOperations = await localforage.getItem('update') || [];
    const deleteOperations = await localforage.getItem('delete') || [];

    const removeOperationKey = (obj) => {
      const { operation, ...updatedData } = obj;
      return updatedData;
    };
    const addListWithoutOperation = addOperations.map(removeOperationKey).map(
      (obj) => {
        const { menuId, ...updatedData } = obj;
        return updatedData;
      }
    );
    const updateListWithoutOperation = updateOperations.map(removeOperationKey);
    const deleteListWithoutOperation = deleteOperations.map(removeOperationKey);

    const cachedChanges = {
      providerHandle: providerHandle,
      addMenuItems: addListWithoutOperation,
      updateMenuItems: updateListWithoutOperation,
      deleteMenuItems: deleteListWithoutOperation
    }

    await localforage.setItem('update', []);
    await localforage.setItem('add', []);
    await localforage.setItem('delete', []);

    updateMenu(cachedChanges)
  }

  const handleAddMenuItem = async () => {
    const addOperations = await localforage.getItem('add') || [];
    // setNewAdditionDisabled(true);
    // const newItemOper = { ...newMenuItem, operation: "add" }
    addOperations.push(newMenuItem);
    // addMenuItem(newMenuItem);
    setUpdatedMenu((prevUpdatedMenu) => [...prevUpdatedMenu, { ...newMenuItem, operation: "add" }])
    await localforage.setItem('add', addOperations);

    setNewMenuItem(defaultNewMenuItem);
  };

  const handleUpdateMenuItem = async (menuItem) => {
    console.log("menuItem ", menuItem)
    if (menuItem.operation === 'add') {
      const addOperations = await localforage.getItem('add');
      const updatedAddCache = addOperations.map((cachedItem) =>
        cachedItem.menuId === menuItem.menuId ? menuItem : cachedItem
      );
      await localforage.setItem('add', updatedAddCache);
    }
    else if (!menuItem.operation || menuItem.operation === "update") {
      const updateOperations = await localforage.getItem('update') || [];
      const updatedOperations = updateOperations.map(operation => {
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
      await localforage.setItem('update', updatedOperations);
    }
    updateMenuItemsWithCachedOperations();
    // updateMenuItem(menuItem);
    // setUpdateEnabled(menuItem.menuId)
    setIsEditing(false);
    setUpdateEnabled(-1)
  };

  const handleDeleteMenuItem = async (menuItem) => {
    if (menuItem.operation === 'add') {
      const addOperations = await localforage.getItem('add');
      const indexToRemove = addOperations.findIndex((item) => item.menuId === menuItem.menuId);
      // If the menu item is found, remove it from the array
      if (indexToRemove !== -1) {
        addOperations.splice(indexToRemove, 1);
        // Save the updated addOperations array back to localforage
        await localforage.setItem('add', addOperations);
      }
    }
    else if (menuItem.operation === null || menuItem.operation === "update") {
      const deleteOperations = await localforage.getItem('delete') || [];
      deleteOperations.push(menuItem);
      await localforage.setItem('delete', deleteOperations);
      setDeleteRow(menuItem.menuId);
      // deleteMenuItem(menuItem);
    }
    updateMenuItemsWithCachedOperations();
  };

  const handleEditMenuItem = (menuItem) => {
    setEditItemId(menuItem.menuId);
    setIsEditing(true);
    setEditedMenuItem(menuItem)
  };

  const cancelEditMenuItem = async (editedMenuItem) => {
    const updateOperations = await localforage.getItem('update') || [];

    const updatedOperations = updateOperations.filter(
      (operation) => operation.menuId !== editedMenuItem.menuId
    );

    await localforage.setItem('update', updatedOperations);
    setIsEditing(false);
  };

  return (
    <div className="">
      <div className="flex items-center justify-center my-8">
        <input
          type="text"
          placeholder="Item Name"
          value={newMenuItem.itemName}
          disabled={newAdditionDisabled}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, itemName: e.target.value })
          }
          className="border border-gray-300 px-2 py-1 rounded mx-4"
        />
        <input
          type="text"
          placeholder="Description"
          value={newMenuItem.description}
          disabled={newAdditionDisabled}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, description: e.target.value })
          }
          className="border border-gray-300 px-2 py-1 rounded mx-4"
        />
        <input
          type="number"
          placeholder="Price"
          value={newMenuItem.price}
          disabled={newAdditionDisabled}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, price: e.target.value })
          }
          className="border border-gray-300 px-2 py-1 rounded mx-4"
        />
        <button
          onClick={() => handleAddMenuItem()}
          disabled={newAdditionDisabled}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${newAdditionDisabled ? "bg-gray-300" : "hover:bg-blue-600 mx-2"}`}
        >Add Item</button>
        {/* addition trigger */}
      </div>
      <div className="flex justify-center my-4">
        {isLoading ? (
          <p>Loading menu items...</p>
        ) : isError ? (
          <p>Error loading menu items.</p>
        ) : updatedMenu?.length == 0 ? <div className="flex w-3/4 justify-center rounded-lg border border-gray-300 bg-gray-100 p-5">
          <h1>Ready to Set the Table? Add an Item!</h1>
        </div>
          :
          (
            <table className="w-3/4 mt-4">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100">Item Name</th>
                  <th className="py-2 px-4 bg-gray-100">Description</th>
                  <th className="py-2 px-4 bg-gray-100">Price</th>
                  <th className="py-2 px-4 bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && updatedMenu.map((menuItem) => (

                  <tr key={menuItem.menuId}
                  >
                    {editItemId === menuItem.menuId && isEditing ? (
                      <MenuEditRow
                        editedMenuItem={editedMenuItem}
                        cancelEditMenuItem={() => cancelEditMenuItem(editedMenuItem)}
                        handleUpdateMenuItem={() => handleUpdateMenuItem(editedMenuItem)}
                        onChange={(e) => {
                          setEditedMenuItem(e)
                        }}
                      />
                    ) : (
                      <>
                        {/* Display mode table cells */}
                        <td className="py-2 px-4 w-1/4">{menuItem.itemName}</td>
                        <td className="py-2 px-4 w-1/4">{menuItem.description}</td>
                        <td className="py-2 px-4 w-1/4">{menuItem.price}</td>
                        <td className="py-2 px-4 w-1/4">
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
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
      <button
        onClick={() => handleSaveMenu()}
        // disabled={updateEnabled === menuItem.menuId} //no menu item here
        className={`bg-blue-500 text-white py-2 px-4 rounded mx-2 hover:bg-blue-600"}`}
      >
        Save
      </button>
    </div>
  );

}
