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
      <div>
        <h2>Add New Menu Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={newMenuItem.item_name}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, item_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newMenuItem.description}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          value={newMenuItem.price}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, price: e.target.value })
          }
        />
        <button onClick={() => handleAddMenuItem()}>Add Item</button>
      </div>
      <div>
        <h2>Menu Items</h2>
        {isLoading ? (
          <p>Loading menu items...</p>
        ) : isError ? (
          <p>Error loading menu items.</p>
        ) : (
          <div>
            {menu.map((menuItem) => (
              <div key={menuItem.menu_id}>
                {console.log("Main main e ", editItemId)}
                {console.log("Main main m", menuItem.menu_id)}
                {editItemId === menuItem.menu_id && isEditing ? (
                  <>
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
                    />
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
                    />
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
                    />
                    <button onClick={() => handleUpdateMenuItem(editedMenuItem)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p>{menuItem.item_name}</p>
                    <p>{menuItem.description}</p>
                    <p>{menuItem.price}</p>
                    <button onClick={() => handleEditMenuItem(menuItem)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteMenuItem(menuItem)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
