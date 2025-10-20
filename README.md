# CipherStudio - Your Browser-Based React IDE

Hey there! 👋  
CipherStudio is a **mini online IDE built with React**, letting you **create, manage, and edit projects** directly in your browser. Think of it like a tiny CodeSandbox or VS Code, but simplified for learning and quick experiments.

---

## What It Can Do

### User Authentication
- Sign up or log in to your account.
- Keep your projects safe with **login-based access**.
- Unauthorized access redirects to login automatically.

### Projects
- Create, rename, and delete projects easily.
- Each project can have multiple files and folders.
- Starts with a default `App.js` so you can start coding immediately.
- Save your work and fetch it anytime.

### File & Folder Management
- Add **files and folders** inside projects.
- Rename inline by double-clicking (just like in VS Code).
- Delete items safely with confirmation.
- Supports nested folders — you can organize your code properly.

### Code Editor
- Edit your code directly in the browser.
- **Reset a file** to its original state anytime.
- Uses **Fira Code font** for that clean, developer-friendly look.
- Live preview powered by **Sandpack** for React projects.

### IDE-Like Features
- **Dark & light theme toggle**.
- Collapsible sidebar to focus on your code.
- Fullscreen editor mode.
- Hover actions for quick **rename/delete**.
- Realistic IDE-like UI and responsive design.

### Console
- Integrated console to show logs.
- Toggle it on or off as needed.

---

## Tech Stack

- **Frontend:** React.js, React Router, Sandpack  
- **Backend:** Node.js, Express.js  
- **Styling:** CSS (responsive & IDE-like design)  
- **Auth:** JWT, Context API  
- **Extras:** react-toastify for notifications, react-split for resizable panels  

---

## How to Run Locally

1. Clone this repo:

```bash
git clone https://github.com/Vansh-13/CipherSchoolStudio-IDE
.git
cd cipherstudio
