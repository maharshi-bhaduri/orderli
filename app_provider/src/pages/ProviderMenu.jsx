import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getService, postService } from "../utils/APIService";

export default function ProviderMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [newAdditionDisabled, setNewAdditionDisabled] = useState(false)
  const [updateEnabled, setUpdateEnabled] = useState(-1)
  const providerHandle = location.state ? location.state : location.pathname.split('/').pop();
  const { data: menu, isLoading, isError } = useQuery(['menu', providerHandle], () =>
    getService(import.meta.env.VITE_APP_GET_PROVIDER_MENU, { providerHandle })
      .then((response) => response.data)
  );

  const [newMenuItem, setNewMenuItem] = useState({
    itemName: "",
    description: "",
    providerHandle: providerHandle,
    price: 0
  });

  const [editItemId, setEditItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteRow, setDeleteRow] = useState(-1);
  const [editedMenuItem, setEditedMenuItem] = useState(null);


  const queryClient = useQueryClient();

  const { mutate: addMenuItem } = useMutation(
    (menuItem) =>
      postService(import.meta.env.VITE_APP_ADD_MENU_ITEM, menuItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', providerHandle]);
        setNewAdditionDisabled(false)
      }
    },
    {
      onError: () => {
        setNewAdditionDisabled(false)
        //handle errors here
      }
    }
  );

  const { mutate: updateMenuItem } = useMutation(
    (menuItem) =>
      postService(import.meta.env.VITE_APP_UPDATE_MENU_ITEM, menuItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', providerHandle]);
        setEditItemId(null);
        setIsEditing(false);
        setUpdateEnabled(-1)
      }
    }
  );

  const { mutate: deleteMenuItem } = useMutation(
    (menuItem) =>
      postService(import.meta.env.VITE_APP_DELETE_MENU_ITEM, menuItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', providerHandle]);
      }
    }
  );

  const handleAddMenuItem = () => {
    setNewAdditionDisabled(true)
    addMenuItem(newMenuItem);
    setNewMenuItem({
      itemName: "",
      description: "",
      providerHandle: providerHandle,
      price: 0
    });
  };

  const handleUpdateMenuItem = (menuItem) => {
    setUpdateEnabled(menuItem.menuId)
    updateMenuItem(menuItem);
  };

  const handleDeleteMenuItem = (menuItem) => {
    setDeleteRow(menuItem.menuId);
    deleteMenuItem(menuItem);
  };

  const handleEditMenuItem = (menuItem) => {
    setEditItemId(menuItem.menuId);
    setIsEditing(true);
    setEditedMenuItem(menuItem)
  };

  const cancelEditMenuItem = () => {
    setIsEditing(false);
  };

  const handleSaveMenuItem = (menuItem) => {
    handleUpdateMenuItem(menuItem);
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">Welcome! Time to set the table!</h1>
      <div className="flex items-center justify-center my-4">
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
      </div>
      <div className="flex justify-center my-4">
        {isLoading ? (
          <p>Loading menu items...</p>
        ) : isError ? (
          <p>Error loading menu items.</p>
        ) : menu.length == 0 ? <div className="flex w-3/4 justify-center rounded-lg border border-gray-300 bg-gray-100 p-5">
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
                {menu.map((menuItem) => (
                  <tr key={menuItem.menuId}
                    className={deleteRow === menuItem.menuId ? "opacity-0 transition-opacity duration-500" : ""}>
                    {editItemId === menuItem.menuId && isEditing ? (
                      <>
                        <td className="py-2 px-4 w-1/4">
                          <input
                            type="text"
                            placeholder="Item Name"
                            value={editedMenuItem.itemName}
                            disabled={updateEnabled === menuItem.menuId}
                            onChange={(e) =>
                              setEditedMenuItem({
                                ...editedMenuItem,
                                itemName: e.target.value,
                              })
                            }
                            className="w-50 border border-gray-300 px-2 py-1 rounded"
                          />
                        </td>
                        <td className="py-2 px-4 w-1/4">
                          <input
                            type="text"
                            placeholder="Description"
                            value={editedMenuItem.description}
                            disabled={updateEnabled === menuItem.menuId}
                            onChange={(e) =>
                              setEditedMenuItem({
                                ...editedMenuItem,
                                description: e.target.value,
                              })
                            }
                            className="w-50 border border-gray-300 px-2 py-1 rounded"
                          />
                        </td>
                        <td className="py-2 px-4 w-1/4">
                          <input
                            type="number"
                            placeholder="Price"
                            value={editedMenuItem.price}
                            disabled={updateEnabled === menuItem.menuId}
                            onChange={(e) =>
                              setEditedMenuItem({
                                ...editedMenuItem,
                                price: e.target.value,
                              })
                            }
                            className="w-50 border border-gray-300 px-2 py-1 rounded"
                          />
                        </td>
                        <td className="py-2 px-4 w-1/4">
                          <button
                            onClick={() => handleUpdateMenuItem(editedMenuItem)}
                            disabled={updateEnabled === menuItem.menuId}
                            className={`bg-blue-500 text-white py-2 px-4 rounded mx-2 
                          ${updateEnabled === menuItem.menuId ? "bg-gray-300" : "hover:bg-blue-600"}`}
                          >
                            Save
                          </button>
                          <button onClick={cancelEditMenuItem}
                            disabled={updateEnabled === menuItem.menuId}
                            className={`bg-gray-300 text-gray-700 py-2 px-4 rounded mx-2
                          ${updateEnabled === menuItem.menuId ? "bg-gray-300 text-white" : "hover:bg-gray-400"}`}
                          >Cancel</button>
                        </td>
                      </>
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
    </div>
  );

}
