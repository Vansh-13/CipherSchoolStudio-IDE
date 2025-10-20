import React, { useState, useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useParams, useNavigate } from "react-router-dom";
import Split from "react-split";
import { api } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/ProjectEditor.css";

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({ title: "", structure: [] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingItem, setCreatingItem] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [originalCode, setOriginalCode] = useState({});
  const [showConsole, setShowConsole] = useState(false);
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [consoleLogs] = useState([]);

  // NEW STATES for rename
  const [renamingItem, setRenamingItem] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // -------------------- Fetch Project --------------------
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        const fixedStructure = (data.structure || []).map(fixStructure);
        setProject({ title: data.title || "", structure: fixedStructure });

        const defaultCodes = {};
        const collectDefaults = (items) =>
          items.forEach((f) => {
            if (f.type === "file") defaultCodes[f.path] = f.code || "";
            else if (f.children) collectDefaults(f.children);
          });
        collectDefaults(fixedStructure);
        setOriginalCode(defaultCodes);

        setSelectedFile(null);
      } catch {
        toast.error("Failed to load project");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, navigate]);

  const fixStructure = (item) => {
    if (item.type === "folder") {
      return { ...item, children: (item.children || []).map(fixStructure) };
    } else {
      return { ...item, code: item.code || "" };
    }
  };

  // -------------------- Recursive Utils --------------------
  const updateStructure = (structure, path, updatedItem) =>
    structure.map((item) =>
      item.path === path
        ? updatedItem
        : item.type === "folder"
        ? { ...item, children: updateStructure(item.children || [], path, updatedItem) }
        : item
    );

  const removeItem = (structure, path) =>
    structure
      .filter((f) => f.path !== path)
      .map((f) => (f.type === "folder" ? { ...f, children: removeItem(f.children || [], path) } : f));

  // -------------------- Add Folder/File --------------------
  const addFolder = (parentPath = "", name) => {
    if (!name) return;
    const newFolder = { type: "folder", name, path: `${parentPath}/${name}`, children: [] };

    const insertIntoStructure = (items) =>
      parentPath === ""
        ? [...items, newFolder]
        : items.map((f) =>
            f.path === parentPath
              ? { ...f, children: [...(f.children || []), newFolder] }
              : f.type === "folder"
              ? { ...f, children: insertIntoStructure(f.children || []) }
              : f
          );

    setProject((prev) => ({ ...prev, structure: insertIntoStructure(prev.structure) }));
    toast.info(`📁 Folder '${name}' created`);
  };

  const addFile = (parentPath = "", name) => {
    if (!name) return;
    const newFile = { type: "file", name, path: `${parentPath}/${name}`, code: `// ${name}` };

    const insertIntoStructure = (items) =>
      parentPath === ""
        ? [...items, newFile]
        : items.map((f) =>
            f.path === parentPath
              ? { ...f, children: [...(f.children || []), newFile] }
              : f.type === "folder"
              ? { ...f, children: insertIntoStructure(f.children || []) }
              : f
          );

    setProject((prev) => ({ ...prev, structure: insertIntoStructure(prev.structure) }));
    setOriginalCode((prev) => ({ ...prev, [`${parentPath}/${name}`]: `// ${name}` }));
    toast.info(`📄 File '${name}' created`);
  };

  // -------------------- Rename (inline) --------------------
  const handleRenameSubmit = (item) => {
    if (!renameValue.trim() || renameValue === item.name) {
      setRenamingItem(null);
      return;
    }
    const renamed = { ...item, name: renameValue, path: item.path.replace(item.name, renameValue) };
    setProject({ ...project, structure: updateStructure(project.structure, item.path, renamed) });
    setRenamingItem(null);
    toast.success(`✏️ Renamed to '${renameValue}'`);
  };

  // -------------------- Delete --------------------
  const deleteItem = (item) => {
    if (!window.confirm(`🗑 Delete '${item.name}'?`)) return;
    setProject({ ...project, structure: removeItem(project.structure, item.path) });
    if (selectedFile?.path === item.path) setSelectedFile(null);
    toast.warning(`🗑 Deleted '${item.name}'`);
  };

  // -------------------- Save Project --------------------
  const saveProject = async () => {
    try {
      setSaving(true);
      await api.put(`/projects/${id}`, { title: project.title, structure: project.structure });
      toast.success("Project saved!");
    } catch {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // -------------------- Render Structure --------------------
  const renderStructure = (items = []) =>
    items.map((item) =>
      item.type === "folder" ? (
        <div key={item.path} className="folder-item">
          <div className="folder-header">
            {renamingItem?.path === item.path ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleRenameSubmit(item)}
                onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(item)}
                className="inline-rename-input"
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setRenamingItem(item);
                  setRenameValue(item.name);
                }}
              >
                📁 {item.name}
              </span>
            )}
            <div className="file-actions">
              <button onClick={() => setCreatingItem({ type: "file", parentPath: item.path })}>＋</button>
              <button onClick={() => setCreatingItem({ type: "folder", parentPath: item.path })}>📂</button>
              <button
                onClick={() => {
                  setRenamingItem(item);
                  setRenameValue(item.name);
                }}
              >
                ✏️
              </button>
              <button onClick={() => deleteItem(item)}>🗑</button>
            </div>
          </div>
          <div className="folder-children">
            {renderStructure(item.children || [])}
            {creatingItem?.parentPath === item.path && creatingItem.type && (
              <input
                autoFocus
                className="inline-create-input"
                placeholder={`New ${creatingItem.type}`}
                onBlur={(e) => {
                  creatingItem.type === "file"
                    ? addFile(item.path, e.target.value)
                    : addFolder(item.path, e.target.value);
                  setCreatingItem(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    creatingItem.type === "file"
                      ? addFile(item.path, e.target.value)
                      : addFolder(item.path, e.target.value);
                    setCreatingItem(null);
                  }
                  if (e.key === "Escape") setCreatingItem(null);
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          key={item.path}
          className={`file-item ${selectedFile?.path === item.path ? "active" : ""}`}
          onClick={() => setSelectedFile(item)}
        >
          {renamingItem?.path === item.path ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRenameSubmit(item)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(item)}
              className="inline-rename-input"
            />
          ) : (
            <span
              onDoubleClick={() => {
                setRenamingItem(item);
                setRenameValue(item.name);
              }}
            >
              📄 {item.name}
            </span>
          )}
          <div className="file-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRenamingItem(item);
                setRenameValue(item.name);
              }}
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(item);
              }}
            >
              🗑
            </button>
          </div>
        </div>
      )
    );

  // -------------------- Sandpack Files --------------------
  const sandpackFiles = {};
  const collectFiles = (items = []) =>
    items.forEach((item) => {
      if (item.type === "file") sandpackFiles[`/${item.name}`] = item.code;
      else if (item.children) collectFiles(item.children);
    });
  collectFiles(project.structure);

  if (loading) return <div className="loading">Loading Project...</div>;

  return (
    <div className={`editor-container ${theme}`}>
      {/* Navbar */}
      <div className="editor-navbar">
        <input
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          placeholder="Project Title"
          className="project-title-input"
        />
        <div className="navbar-buttons">
          <button onClick={() => setCreatingItem({ type: "folder", parentPath: "" })}>📂 Folder</button>
          <button onClick={() => setCreatingItem({ type: "file", parentPath: "" })}>📄 File</button>
          <button onClick={saveProject}>{saving ? "💾 Saving..." : "💾 Save"}</button>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? "➡️ Show Sidebar" : "⬅️ Hide Sidebar"}
          </button>
        </div>
      </div>

      {/* Split View */}
      <Split className="editor-main" sizes={[20, 80]} minSize={200} gutterSize={6}>
        {!sidebarCollapsed && (
          <div className="editor-sidebar">
            {renderStructure(project.structure)}

            {/* Inline input for ROOT LEVEL new file/folder */}
            {creatingItem?.parentPath === "" && creatingItem.type && (
              <input
                autoFocus
                className="inline-create-input"
                placeholder={`New ${creatingItem.type}`}
                onBlur={(e) => {
                  if (creatingItem.type === "file") addFile("", e.target.value);
                  else addFolder("", e.target.value);
                  setCreatingItem(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (creatingItem.type === "file") addFile("", e.target.value);
                    else addFolder("", e.target.value);
                    setCreatingItem(null);
                  }
                  if (e.key === "Escape") setCreatingItem(null);
                }}
              />
            )}
          </div>
        )}

        <div className={`editor-content-wrapper ${editorFullscreen ? "fullscreen" : ""}`}>
          <div className="editor-content">
            {selectedFile ? (
              <>
                <div className="file-tab">
                  {selectedFile.name}
                  <div className="file-tab-actions">
                    <button
                      title="Reset Code"
                      onClick={() => {
                        const defaultCode = originalCode[selectedFile.path] || "";
                        setSelectedFile({ ...selectedFile, code: defaultCode });
                        const updateFileCode = (items) =>
                          items.map((item) => {
                            if (item.path === selectedFile.path) return { ...item, code: defaultCode };
                            if (item.type === "folder" && item.children)
                              return { ...item, children: updateFileCode(item.children) };
                            return item;
                          });
                        setProject((prev) => ({ ...prev, structure: updateFileCode(prev.structure) }));
                        toast.info("Code reset to default");
                      }}
                    >
                      🔄
                    </button>
                    <button title="Toggle Console" onClick={() => setShowConsole(!showConsole)}>
                      💻
                    </button>
                    <button title="Fullscreen" onClick={() => setEditorFullscreen(!editorFullscreen)}>
                      ⬜
                    </button>
                  </div>
                </div>

                <textarea
                  className="code-editor"
                  value={selectedFile.code}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setSelectedFile({ ...selectedFile, code: newCode });
                    const updateFileCode = (items) =>
                      items.map((item) => {
                        if (item.path === selectedFile.path) return { ...item, code: newCode };
                        if (item.type === "folder" && item.children)
                          return { ...item, children: updateFileCode(item.children) };
                        return item;
                      });
                    setProject((prev) => ({ ...prev, structure: updateFileCode(prev.structure) }));
                  }}
                />

                <Sandpack
                  template="react"
                  files={sandpackFiles}
                  theme={theme}
                  options={{ showLineNumbers: true, showTabs: true, editorHeight: 400 }}
                />

                {showConsole && (
                  <div className="editor-console">
                    <div className="console-header">Console</div>
                    <div className="console-content">
                      {consoleLogs.length ? (
                        consoleLogs.map((log, idx) => <div key={idx}>{log}</div>)
                      ) : (
                        <div className="console-empty">No logs yet</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-file-selected">🖋 Select a file to start editing</div>
            )}
          </div>
        </div>
      </Split>

      <ToastContainer position="top-right" autoClose={2000} theme={theme === "light" ? "light" : "dark"} />
    </div>
  );
}
