import React, { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser, getRoles, updateUserRole, updateUserStatus } from "../api/api";
import ClipLoader from "react-spinners/ClipLoader";  // Import ClipLoader

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [errors, setErrors] = useState({});
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data } = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.role) errors.role = "Role is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addUser(formData);
      setFormData({ name: "", email: "", role: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUserId) {
      setLoading(true);
      try {
        await deleteUser(deleteUserId);
        fetchUsers();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditRole = async () => {
    if (userBeingEdited && newRole) {
      setLoading(true);
      try {
        await updateUserRole(userBeingEdited, newRole);
        fetchUsers();
        setIsEditRoleModalOpen(false);
        setUserBeingEdited(null);
        setNewRole("");
      } catch (error) {
        console.error("Error updating role:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangeStatus = async (userId, newStatus) => {
    setLoading(true);
    try {
      await updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteUserId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openEditRoleModal = (user) => {
    setUserBeingEdited(user._id);
    setNewRole(user.role?._id || "");
    setIsEditRoleModalOpen(true);
  };

  const closeEditRoleModal = () => {
    setIsEditRoleModalOpen(false);
    setUserBeingEdited(null);
    setNewRole("");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6 text-center">User Management</h1>

      {/* Add User Form */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-medium mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <button
            type="submit"
            className={`w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Add User"}
          </button>
        </form>
      </div>

      {/* Users List (Card Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center">
            <ClipLoader size={50} color="#ffffff" />
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col space-y-4"
            >
              <div>
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-500">{user.role?.name}</span>
                <select
                  value={user.status}
                  onChange={(e) => handleChangeStatus(user._id, e.target.value)}
                  className="mt-2 p-2 border rounded-lg bg-gray-700 text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="flex space-x-4">
                  <button
                    onClick={() => openEditRoleModal(user)}
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => openDeleteModal(user._id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal for Deleting User */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-sm w-full transition-all duration-300 transform scale-105">
            <h3 className="text-xl font-medium mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditRoleModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-sm w-full transition-all duration-300 transform scale-105">
            <h3 className="text-xl font-medium mb-4">Change User Role</h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleEditRole}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditRoleModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
