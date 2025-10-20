import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileEditor from "./FileEditor";
import { api } from "../../api/api";
import "../Css/ProjectEditor.css";

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({ title: "", files: [] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);

  // Load project on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (err) {
        alert("❌ Failed to load project");
        navigate("/dashboard");
      }
    };
    if (id) fetchProject();
  }, [id]);

  // Update file content
  const updateFile = (updatedFile) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.name === updatedFile.name ? updatedFile : f
      ),
    }));
  };

  // Save project to backend
  const saveProject = async () => {
    try {
      setSaving(true);
      await api.put(`/projects/${id}`, project);
      alert("✅ Project saved successfully!");
    } catch (err) {
      alert("❌ Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const addFile = () => {
    const fileName = prompt("Enter new file name (e.g. NewFile.js):");
    if (!fileName) return;
    const newFile = { name: fileName, code: `// ${fileName} content` };
    setProject((prev) => ({
      ...prev,
      files: [...prev.files, newFile],
    }));
  };

  const deleteFile = (name) => {
    if (confirm(`Delete ${name}?`)) {
      setProject((prev) => ({
        ...prev,
        files: prev.files.filter((f) => f.name !== name),
      }));
      if (selectedFile?.name === name) setSelectedFile(null);
    }
  };

  const navigateBack = () => navigate("/dashboard");

  return (
    <div className={`editor-container ${theme}`}>
      {/* Navbar */}
      <div className="editor-navbar">
        <input
          type="text"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          placeholder="Project Title"
          className="project-title-input"
        />
        <div className="navbar-buttons">
          <button onClick={saveProject} className="btn save-btn">
            {saving ? "💾 Saving..." : "💾 Save"}
          </button>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="btn theme-btn"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button onClick={navigateBack} className="btn back-btn">
            ⬅ Back
          </button>
        </div>
      </div>

      {/* Editor layout */}
      <div className="editor-main">
        <div className="editor-sidebar">
          <div className="sidebar-header">
            <button className="btn add-file-btn" onClick={addFile}>
              ➕ Add File
            </button>
          </div>
          <div className="files-list">
            {project.files.length === 0 && (
              <div className="no-files">No files yet.</div>
            )}
            {project.files.map((file, i) => (
              <div
                key={i}
                className={`file-item ${
                  selectedFile?.name === file.name ? "active" : ""
                }`}
              >
                <span onClick={() => setSelectedFile(file)}>
                  📄 {file.name}
                </span>
                <button
                  className="delete-file-btn"
                  onClick={() => deleteFile(file.name)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-content">
          {selectedFile ? (
            <FileEditor
              file={selectedFile}
              updateFile={updateFile}
              theme={theme}
            />
          ) : (
            <div className="no-file-selected">
              Select a file to start editing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
