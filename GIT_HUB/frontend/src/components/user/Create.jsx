import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./create.css";
import Navbar from "../user/Navbar";

const Create = () => {
  const [formData, setFormData] = useState({
    repoName: "",
    description: "",
    content: "",
  });

  const [userId, setUserId] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      setUserId(loggedInUserId);
    } else {
      alert("User not logged in! Please login first.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found. Please login first.");
      return;
    }

    try {
      const payload = {
        name: formData.repoName,
        owner: userId,
        description: formData.description,
        content: formData.content,
        issues: [],
      };

      const response = await fetch("http://localhost:8080/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Repository created successfully:", data);
        alert("Repository created successfully!");
        setFormData({
          repoName: "",
          description: "",
          content: "",
        });
        navigate("/repo"); // Navigate to the /repo page after successful creation
      } else {
        console.error("Failed to create repository");
        alert("Failed to create repository");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <Navbar />

      <h2 className="text-xl font-bold mb-4">Create a Repository</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Repository Name:</label>
          <input
            type="text"
            name="repoName"
            value={formData.repoName}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            style={{ height: "50px" }} // Small description box
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            style={{ height: "280px" }} // Large content box
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
          >
            Create Repository
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
