import React, { useEffect, useState } from "react";
import Navbar from "../user/Navbar";

const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  const fetchRepos = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/repo/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRepos(data.repositories || []);
      } else {
        setError("Failed to fetch user repositories");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  fetchRepos();

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
    setUpdatedDescription(repo.description);
    setUpdatedContent(
      Array.isArray(repo.content) ? repo.content.join("\n") : repo.content
    );
  };

  const handleUpdateRepo = async () => {
    if (!updatedDescription || !updatedContent) {
      alert("Description and Content cannot be empty");
      return;
    }

    const updatedRepo = {
      description: updatedDescription,
      content: updatedContent.split("\n").filter((line) => line.trim() !== ""),
    };

    try {
      const response = await fetch(
        `http://localhost:8080/repo/update/${selectedRepo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRepo),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedRepos = repos.map((repo) =>
          repo._id === selectedRepo._id ? data.repository : repo
        );
        setRepos(updatedRepos);
        setSelectedRepo(null);
        setUpdatedContent("");
        setUpdatedDescription("");
        alert("Repository updated successfully");
      } else {
        setError("Failed to update repository");
      }
    } catch (err) {
      setError("Something went wrong while updating repository");
    }
  };

  const handleDeleteRepo = async (repoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/repo/delete/${repoId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const updatedRepos = repos.filter((repo) => repo._id !== repoId);
          setRepos(updatedRepos);
          setSelectedRepo(null);
          alert("Repository deleted successfully");
        } else {
          setError("Failed to delete repository");
        }
      } catch (err) {
        setError("Something went wrong while deleting repository");
      }
    }
  };

  if (loading) {
    return <div>Loading repositories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />

      <div
        className="repo-container"
        style={{ display: "flex", gap: "20px", padding: "20px" }}
      >
        <div className="repo-list" style={{ flex: 1 }}>
          <h2>Repositories</h2>
          <div
            style={{
              maxHeight: repos.length > 2 ? "300px" : "auto",
              overflowY: repos.length > 2 ? "auto" : "visible",
            }}
          >
            {repos.length === 0 ? (
              <p>No repositories found</p>
            ) : (
              <ul>
                {repos.map((repo) => (
                  <li
                    key={repo._id}
                    onClick={() => handleRepoClick(repo)}
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      border: "1px solid #ccc",
                      marginBottom: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    <h3>{repo.name}</h3>
                    <p>{repo.description}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRepo(repo._id);
                      }}
                      style={{ marginTop: "10px", color: "#ccc" }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedRepo && (
          <div
            className="repo-content"
            style={{
              flex: 2,
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#3a3a3a",
            }}
          >
            <h3>Repository Content</h3>
            <pre
              style={{
                backgroundColor: "#3a3a3a",
                padding: "10px",
                borderRadius: "5px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {Array.isArray(selectedRepo.content)
                ? selectedRepo.content.join("\n")
                : selectedRepo.content}
            </pre>

            <h4>Update Repository</h4>
            <div>
              <label>Description: </label>
              <input
                type="text"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                placeholder="Update description"
                style={{ marginBottom: "10px", width: "100%" }}
              />
            </div>
            <div>
              <label>Content: </label>
              <textarea
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
                placeholder="Update content"
                style={{ marginBottom: "10px", width: "100%", height: "150px" }}
              />
            </div>
            <button onClick={handleUpdateRepo}>Update Repository</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Repo;
