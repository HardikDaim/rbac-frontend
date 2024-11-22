import React, { useEffect, useState } from "react";
import { getRoles, addRole, deleteRole, updateRolePermissions } from "../api/api";

const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ name: "", permissions: "" });
  const [editFormData, setEditFormData] = useState({ permissions: "" }); // State for editing permissions
  const [errors, setErrors] = useState({ name: "", permissions: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleToEdit, setRoleToEdit] = useState(null); // State for the role being edited

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data } = await getRoles();
    setRoles(data);
  };

  const validateForm = () => {
    const newErrors = { name: "", permissions: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required.";
    }

    if (!formData.permissions.trim()) {
      newErrors.permissions = "Permissions are required.";
    } else {
      const permissionsArray = formData.permissions.split(",").map((p) => p.trim());
      if (permissionsArray.length === 0) {
        newErrors.permissions = "At least one permission is required.";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const permissions = formData.permissions.split(",").map((p) => p.trim());
    await addRole({ name: formData.name, permissions });
    setFormData({ name: "", permissions: "" });
    fetchRoles();
  };

  const handleDeleteRole = async (id) => {
    await deleteRole(id);
    fetchRoles();
    setShowDeleteModal(false);
  };

  const openDeleteModal = (roleId) => {
    setRoleToDelete(roleId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setRoleToDelete(null);
    setShowDeleteModal(false);
  };

  const handleEditRolePermissions = async (e) => {
    e.preventDefault();
    if (!editFormData.permissions.trim()) {
      setErrors((prev) => ({ ...prev, permissions: "Permissions are required." }));
      return;
    }

    const permissions = editFormData.permissions.split(",").map((p) => p.trim());
    await updateRolePermissions(roleToEdit, { permissions });
    fetchRoles();
    setRoleToEdit(null); // Close edit mode
  };

  const closeEditModal = () => {
    setRoleToEdit(null); // Close the edit modal
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Role Management</h1>

      {/* Add Role Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-medium mb-4">Add New Role</h2>
        <form onSubmit={handleAddRole} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Role Name"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Permissions (comma-separated)"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.permissions}
              onChange={(e) =>
                setFormData({ ...formData, permissions: e.target.value })
              }
            />
            {errors.permissions && (
              <p className="text-red-500 text-sm mt-1">{errors.permissions}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Role
          </button>
        </form>
      </div>

      {/* Roles Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-medium mb-4">Roles List</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium text-gray-700">Role</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Permissions</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id} className="border-b">
                <td className="py-3 px-4">{role.name}</td>
                <td className="py-3 px-4">{role.permissions.join(", ")}</td>
                <td className="py-3 px-4 flex flex-col items-center md:flex-row justify-start">
                  <button
                    onClick={() => setRoleToEdit(role._id)}
                    className="text-yellow-500 hover:text-yellow-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(role._id)}
                    className="ml-3 text-red-500 hover:text-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Are you sure you want to delete this role?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => handleDeleteRole(roleToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {roleToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <h2 className="text-lg font-medium mb-4">Edit Permissions</h2>
            <form onSubmit={handleEditRolePermissions} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Permissions (comma-separated)"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editFormData.permissions}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, permissions: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;
