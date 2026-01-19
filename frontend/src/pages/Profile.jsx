import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/user/profile`,
          { headers: { token } }
        );

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">No user data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] px-6 sm:px-16 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <div className="max-w-lg border rounded-lg p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">
            {user.phone || "Not provided"}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Joined On</p>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button className="mt-4 px-6 py-2 bg-black text-white text-sm rounded">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
