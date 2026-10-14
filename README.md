# ✅ Task Tracker

> **A simple task manager with a built-in time tracker.** Organize your tasks, track focused work time, and keep your progress saved in the browser.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Task_Tracker-181717?style=for-the-badge&logo=github)](https://github.com/Skoulskiy/ts_react_zustand_task_tracker)
[![Live Demo](https://img.shields.io/badge/Live_Demo-🚀_Open_App-brightgreen?style=for-the-badge)](https://skoulskiy.github.io/ts_react_zustand_task_tracker/)

---

## 📌 Project Overview

Task Tracker is a browser-based app for managing everyday tasks and tracking the time spent on them. Create tasks, start or pause a timer, and mark tasks as complete. Your task list and timer progress are saved in the browser, so you can continue where you left off.

## 💡 Engineering Highlights

* **Typed task model**: task state and timer data are defined with TypeScript.
* **Centralized state management**: Zustand manages task creation, completion, timer controls, and deletion.
* **Persistent task data**: tasks and accumulated time are saved in `localStorage`.
* **Single active timer**: starting a task pauses any other running task.
* **Static deployment**: GitHub Actions builds and deploys the app to GitHub Pages on pushes to `master`.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **UI** | React 19, TypeScript |
| **Application State** | Zustand |
| **Styling** | Tailwind CSS 4 |
| **Icons** | React Icons |
| **Build Tool** | Vite |
| **Code Quality** | ESLint |
| **Data Persistence** | Browser `localStorage` |
| **Deployment** | GitHub Actions, GitHub Pages |

## 🚀 Features

* 📝 **Task management**: add, delete, and mark tasks as completed.
* ⏱️ **Time tracking**: start, pause, and stop a task timer; stopping saves the elapsed time.
* 🔒 **Completion guard**: completed tasks cannot be started.
* ▶️ **One timer at a time**: starting another task pauses the current timer.
* 🗂️ **Task filters**: view all, active, waiting, or completed tasks.
* 💾 **Persistent data**: tasks and time are retained in browser storage.
* 📱 **Responsive interactions**: task deletion is available through the context menu.

## 💻 Local Development

### Prerequisites

* **Node.js**: 20.19+ or 22.12+
* **npm**

### Installation and Setup

```bash
git clone https://github.com/Skoulskiy/ts_react_zustand_task_tracker.git
cd ts_react_zustand_task_tracker
npm install
npm run dev
```

Create a production build and run the linter:

```bash
npm run build
npm run lint
```

## 🚀 Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys the app to GitHub Pages whenever changes are pushed to `master`.

To enable deployment for the repository:

1. Open **Settings → Pages** on GitHub.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `master` or manually run the **Deploy to GitHub Pages** workflow from the **Actions** tab.

The published app will be available at:

https://skoulskiy.github.io/ts_react_zustand_task_tracker/

## 👤 Author

* **GitHub**: [@Skoulskiy](https://github.com/Skoulskiy)
