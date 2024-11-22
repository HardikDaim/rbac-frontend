import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 text-center mb-8">
          Role-Based Access Control System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-6">
          Manage users and roles efficiently with our intuitive interface.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/roles"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center shadow-md transform hover:scale-105 transition-all duration-300"
          >
            Manage Roles
          </Link>
          <Link
            to="/users"
            className="block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-center shadow-md transform hover:scale-105 transition-all duration-300"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
