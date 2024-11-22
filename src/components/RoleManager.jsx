import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import the icons
import {
  getRoles,
  addRole,
  deleteRole,
  updateRolePermissions,
} from "../api/api";

const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ name: "", permissions: "" });
  const [editFormData, setEditFormData] = useState({ permissions: "" });
  const [errors, setErrors] = useState({ name: "", permissions: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    const { data } = await getRoles();
    setRoles(data);
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = { name: "", permissions: "" };
    if (!formData.name.trim()) {
      newErrors.name = "Role name is required.";
    }
    if (!formData.permissions.trim()) {
      newErrors.permissions = "Permissions are required.";
    } else {
      const permissionsArray = formData.permissions
        .split(",")
        .map((p) => p.trim());
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
      setErrors((prev) => ({
        ...prev,
        permissions: "Permissions are required.",
      }));
      return;
    }
    const permissions = editFormData.permissions
      .split(",")
      .map((p) => p.trim());
    await updateRolePermissions(roleToEdit, { permissions });
    fetchRoles();
    setRoleToEdit(null);
  };

  const closeEditModal = () => {
    setRoleToEdit(null);
  };

  return (
    <>
      {/* Loading Spinner */}
      {loading && (
        <div className="h-screen flex justify-center items-center py-10">
          <ClipLoader color="white" size={50} />
        </div>
      )}
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-200">
          Role Management
        </h1>

        {!loading && (
          <>
            {/* Add Role Form */}
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-medium mb-4 text-gray-200">
                Add New Role
              </h2>
              <form onSubmit={handleAddRole} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Role Name"
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Permissions (comma-separated)"
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                    value={formData.permissions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        permissions: e.target.value,
                      })
                    }
                  />
                  {errors.permissions && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permissions}
                    </p>
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

            {/* Roles Card Layout for Mobile */}
            <div className="lg:hidden">
              {roles.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {roles.map((role) => (
                    <div
                      key={role._id}
                      className="bg-gray-800 p-4 rounded-lg shadow-lg relative"
                    >
                      {/* Edit and Delete buttons moved to the top-right */}
                      <div className="absolute top-6 right-4 flex space-x-4">
                        <button
                          onClick={() => setRoleToEdit(role._id)}
                          className="text-yellow-400 text-lg hover:text-yellow-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteModal(role._id)}
                          className="text-red-400 text-lg hover:text-red-500"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-200">
                        {role.name}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Permissions: {role.permissions.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-200">No roles available.</p>
              )}
            </div>

            {/* Roles Table for Larger Screens */}
            <div className="hidden lg:block bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-medium mb-4 text-gray-200">
                Roles List
              </h2>
              {roles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="py-3 px-4 text-left font-medium text-gray-200">
                          Role
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-gray-200">
                          Permissions
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role._id} className="border-b border-gray-600">
                          <td className="py-3 px-4 text-gray-200">
                            {role.name}
                          </td>
                          <td className="py-3 px-4 text-gray-200">
                            {role.permissions.join(", ")}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setRoleToEdit(role._id)}
                                className="text-yellow-400 hover:text-yellow-500 transition duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(role._id)}
                                className="text-red-400 hover:text-red-500 transition duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-200">No roles available.</p>
              )}
            </div>
          </>
        )}

        {/* Modals */}
        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-medium text-white mb-4">
                Are you sure you want to delete this role?
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDeleteRole(roleToDelete)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {roleToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-medium text-white mb-4">
                Edit Role Permissions
              </h3>
              <form onSubmit={handleEditRolePermissions}>
                <input
                  type="text"
                  placeholder="Permissions (comma-separated)"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                  value={editFormData.permissions}
                  onChange={(e) =>
                    setEditFormData({
                      permissions: e.target.value,
                    })
                  }
                />
                {errors.permissions && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.permissions}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
                >
                  Update Permissions
                </button>
              </form>
              <button
                onClick={closeEditModal}
                className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoleManager;
