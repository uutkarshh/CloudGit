import Navbar from "../user/Navbar";
import React, { useEffect, useState } from "react";
import "./dashboard.css";

const Dashboard = () => {
  const [repository, setRepository] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepo, setSuggestedRepo] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const [repoRes, suggestRes] = await Promise.allSettled([
          fetch(`http://localhost:8080/repo/user/${userId}`),
          fetch(`http://localhost:8080/repo/all`),
        ]);

        if (repoRes.status === "fulfilled") {
          const repoData = await repoRes.value.json();
          setRepository(repoData.repositories || []);
        }

        if (suggestRes.status === "fulfilled") {
          const suggestData = await suggestRes.value.json();
          setSuggestedRepo(suggestData || []);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult(repository);
      return;
    }

    const filteredRepos = repository.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(filteredRepos);
  }, [searchQuery, repository]);

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div>
      <Navbar />
      <section
        id="dashboard"
        style={{ display: "flex", gap: "20px", padding: "20px" }}
      >
        {/* Suggested Repositories */}
        <aside
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h3>Suggested Repositories</h3>
          {suggestedRepo.length > 0 ? (
            <div
              style={{
                maxHeight: suggestedRepo.length > 2 ? "200px" : "auto",
                overflowY: suggestedRepo.length > 2 ? "auto" : "visible",
              }}
            >
              {suggestedRepo.map((repo) => (
                <div
                  key={repo._id}
                  onClick={() => handleRepoClick(repo)}
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                >
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No suggested repositories available.</p>
          )}
        </aside>

        {/* Search and Main Repository Section */}
        <main
          style={{
            flex: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h3>Your Repositories</h3>
          <div id="search" style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
            />
          </div>
          {searchResult.length > 0 ? (
            <div
              style={{
                maxHeight: searchResult.length > 2 ? "200px" : "auto",
                overflowY: searchResult.length > 2 ? "auto" : "visible",
              }}
            >
              {searchResult.map((repo) => (
                <div
                  key={repo._id}
                  onClick={() => handleRepoClick(repo)}
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                >
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No repositories found.</p>
          )}
        </main>

        {/* Display selected repo content as a scrollable list */}
        {selectedRepo && (
          <div
            className="repo-content"
            style={{
              flex: 1.5,
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <h3>Repository Content</h3>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              {Array.isArray(selectedRepo.content) ? (
                <ul>
                  {selectedRepo.content.map((line, index) => (
                    <li key={index} style={{ whiteSpace: "pre-wrap" }}>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{selectedRepo.content}</p>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <aside
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit</p>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default Dashboard;
