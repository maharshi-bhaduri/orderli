import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getService, postService } from "../utils/APIService";

export default function ProviderMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const providerHandle = location.state ? location.state : location.pathname.split('/').pop();
  const { data: menu, isLoading, isError } = useQuery(['menu', providerHandle], () =>
    getService(import.meta.env.VITE_APP_GET_PROVIDER_MENU, { providerHandle })
      .then((response) => response.data)
  );

  const [newMenuItem, setNewMenuItem] = useState({
    item_name: "",
    description: "",
    provider_handle: providerHandle,
    price: 0
  });

  const [editItemId, setEditItemId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMenuItem, setEditedMenuItem] = useState(null);


  const queryClient = useQueryClient();

  const { mutate: addMenuItem } = useMutation(
    (menuItem) =>
      postService(import.meta.env.VITE_APP_ADD_MENU_ITEM, menuItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['menu', providerHandle]);
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
    addMenuItem(newMenuItem);
    setNewMenuItem({
      item_name: "",
      description: "",
      provider_handle: providerHandle,
      price: 0
    });
  };

  const handleUpdateMenuItem = (menuItem) => {
    updateMenuItem(menuItem);
  };

  const handleDeleteMenuItem = (menuItem) => {
    deleteMenuItem(menuItem);
  };

  const handleEditMenuItem = (menuItem) => {
    setEditItemId(menuItem.menu_id);
    setIsEditing(true);
    setEditedMenuItem(menuItem)
  };
  console.log("e outside", editItemId)

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
          value={newMenuItem.item_name}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, item_name: e.target.value })
          }
          className="border border-gray-300 px-2 py-1 rounded mx-4"
        />
        <input
          type="text"
          placeholder="Description"
          value={newMenuItem.description}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, description: e.target.value })
          }
          className="border border-gray-300 px-2 py-1 rounded mx-4"
        />
        <input
          type="number"
          placeholder="Price"
          value={newMenuItem.price}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, price: e.target.value })
          }
          className="border border-gray-300 px-2 py-1 rounded mx-4"
        />
        <button
          onClick={() => handleAddMenuItem()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mx-2"
        >Add Item</button>
      </div>
      <div className="flex justify-center my-4">
        {isLoading ? (
          <p>Loading menu items...</p>
        ) : isError ? (
          <p>Error loading menu items.</p>
        ) : (
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
                <tr key={menuItem.menu_id}>
                  {editItemId === menuItem.menu_id && isEditing ? (
                    <>
                      {/* Edit mode input fields */}
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={editedMenuItem.item_name}
                          onChange={(e) =>
                            setEditedMenuItem({
                              ...editedMenuItem,
                              item_name: e.target.value,
                            })
                          }
                          className="border border-gray-300 px-2 py-1 rounded"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          placeholder="Description"
                          value={editedMenuItem.description}
                          onChange={(e) =>
                            setEditedMenuItem({
                              ...editedMenuItem,
                              description: e.target.value,
                            })
                          }
                          className="border border-gray-300 px-2 py-1 rounded"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          placeholder="Price"
                          value={editedMenuItem.price}
                          onChange={(e) =>
                            setEditedMenuItem({
                              ...editedMenuItem,
                              price: e.target.value,
                            })
                          }
                          className="border border-gray-300 px-2 py-1 rounded"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleUpdateMenuItem(editedMenuItem)}
                        >
                          Save
                        </button>
                        <button onClick={cancelEditMenuItem}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Display mode table cells */}
                      <td className="py-2 px-4">{menuItem.item_name}</td>
                      <td className="py-2 px-4">{menuItem.description}</td>
                      <td className="py-2 px-4">{menuItem.price}</td>
                      <td className="py-2 px-4">
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
        )}
      </div>
    </div>
  );

}
