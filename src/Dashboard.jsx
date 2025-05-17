import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserCard = ({ user }) => (
  <div
    className="p-4 border rounded-xl bg-white hover:bg-teal-50 shadow-[8px_8px_15px_#222831,-8px_-8px_15px_#547792] hover:scale-110 transform transition-transform duration-500 bg-gradient-to-br from-white via-teal-50 to-emerald-200
"
  >
    <h2 className="text-xl font-semibold font-serif text-teal-800">
      {user.name}
    </h2>
    <p className="font-serif">
      ✉️ Email:<span className="text-blue-500 underline">{user.email}</span>{" "}
    </p>
    <p className="font-serif">🏢 City: {user.address.city}</p>
    <p className="font-serif">
      ☎️ Phone: <span className="text-green-600 underline ">{user.phone}</span>
    </p>
    <Link
      to={`/users/${user.id}`}
      className="text-teal-500 hover:underline mt-2 inline-block font-semibold font-serif"
    >
      View Details
    </Link>
  </div>
);

const UserCardSkeleton = () => (
  <div className="p-4 border rounded-xl shadow-md bg-gray-200 animate-pulse space-y-3">
    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-full"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    <div className="h-5 bg-gray-300 rounded w-24 mt-2"></div>
  </div>
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  // 🆕 pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let temp = [...users];
    if (search) {
      temp = temp.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (cityFilter) {
      temp = temp.filter((u) => u.address.city === cityFilter);
    }
    setFilteredUsers(temp);
    setCurrentPage(1); // 🆕 reset to first page on filter change
  }, [search, cityFilter, users]);

  const cities = [...new Set(users.map((u) => u.address.city))];

  // 🆕 pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-teal-800 font-serif">
          Users Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-extrabold">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-teal-800 font-serif">
        Users Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full p-3 rounded-2xl bg-white text-teal-500 
           shadow-[8px_8px_15px_#222831,-8px_-8px_15px_#547792] 
           focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border-y-2 p-2 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400 md:w-28 shadow-[8px_8px_15px_#222831,-8px_-8px_15px_#547792]"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center text-xl text-red-700 mt-10">
          No Results Found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 ">
            {currentUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-teal-600 text-white"
                    : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
