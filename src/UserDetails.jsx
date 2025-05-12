import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

// ✅ Skeleton Loader
const UserDetailsSkeleton = () => (
  <div className="p-4 max-w-xl mx-auto animate-pulse space-y-4">
    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
    ))}
    <div className="h-4 bg-gray-300 rounded w-32 mt-4"></div>
  </div>
);

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <UserDetailsSkeleton />;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/30 backdrop-blur-md rounded-xl p-6 shadow-[8px_8px_15px_#222831,-8px_-8px_15px_#547792]">
        <h1 className="text-2xl font-bold mb-4 text-teal-700 font-serif">
          {user.name}'s Details
        </h1>
        <div className="space-y-2 text-gray-800">
          <p className="font-serif">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="font-serif">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="font-serif">
            <strong>Phone:</strong> {user.phone}
          </p>
          <p className="font-serif">
            <strong>Website:</strong> {user.website}
          </p>
          <p className="font-serif">
            <strong>City:</strong> {user.address.city}
          </p>
          <p className="font-serif">
            <strong>Street:</strong> {user.address.street}
          </p>
          <p className="font-serif">
            <strong>Company:</strong> {user.company.name}
          </p>
        </div>
        <Link
          to="/"
          className="mt-6 inline-block text-teal-600 font-medium hover:underline font-serif"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UserDetails;
