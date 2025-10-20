import { useState, useEffect, useContext } from "react";
import { api } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Css/ProjectList.css";

export default function ProjectList({ theme }) {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert("Failed to fetch projects");
    }
  };

  const deleteProject = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter((p) => p._id !== id));
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  const createNewProject = async () => {
    try {
      const { data } = await api.post("/projects", {
        title: "Untitled Project",
        files: [
          {
            name: "App.js",
            code: `import React from 'react';
export default function App() {
  return <div>Hello World</div>;
}`,
          },
        ],
      });
      fetchProjects();
      navigate(`/editor/${data._id}`);
    } catch (err) {
      alert("Failed to create new project");
    }
  };

  const renameProject = async (id) => {
    try {
      await api.put(`/projects/${id}`, { title: newName });
      setProjects(
        projects.map((p) =>
          p._id === id ? { ...p, title: newName } : p
        )
      );
      setEditingId(null);
    } catch (err) {
      alert("Failed to rename project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`project-list-wrapper ${theme === "light" ? "light" : ""}`}>
      <div className="project-header">
        <h1 className="project-title">Your Projects</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Search projects..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="new-project-button" onClick={createNewProject}>
            ➕ New Project
          </button>
        </div>
      </div>

      <div className="project-cards">
        {filteredProjects.length === 0 ? (
          <p className="no-projects">No projects found. Create one!</p>
        ) : (
          filteredProjects.map((p) => (
            <div key={p._id} className="project-card">
              {editingId === p._id ? (
                <input
                  className="rename-input"
                  value={newName}
                  autoFocus
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => renameProject(p._id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && renameProject(p._id)
                  }
                />
              ) : (
                <span
                  className="project-name"
                  onClick={() => navigate(`/editor/${p._id}`)}
                >
                  {p.title}
                </span>
              )}

              <div className="hover-actions">
                <button
                  className="rename-button"
                  onClick={() => {
                    setEditingId(p._id);
                    setNewName(p.title);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteProject(p._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
