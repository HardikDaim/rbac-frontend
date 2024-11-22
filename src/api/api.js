import axios from "axios";

const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_PROD_URL // Production URL
  : process.env.REACT_APP_LOCAL_URL; // Local URL


export const getUsers = async () => axios.get(`${BASE_URL}/users`);
export const addUser = async (data) => axios.post(`${BASE_URL}/users`, data);
export const deleteUser = async (id) => axios.delete(`${BASE_URL}/users/${id}`);
export const updateUserRole = async (userId, newRoleId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}/role`, {
        roleId: newRoleId,
      });
      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };
export const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}/status`, {
        status: newStatus,
      });
      return response.data; // Return the updated user data
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };

export const getRoles = async () => axios.get(`${BASE_URL}/roles`);
export const addRole = async (data) => axios.post(`${BASE_URL}/roles`, data);
export const deleteRole = async (id) => axios.delete(`${BASE_URL}/roles/${id}`);
export const updateRolePermissions = async (id, permissions) => 
    axios.patch(`${BASE_URL}/roles/${id}`, { permissions });