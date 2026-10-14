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
* **Static deployment**: the production build is published from the `gh-pages` branch using GitHub Pages.

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
| **Deployment** | GitHub Pages |

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

The production build is published to the `gh-pages` branch. To enable GitHub Pages:

1. Open **Settings → Pages** on GitHub.
2. Set **Build and deployment → Source** to **Deploy from a branch**.
3. Select **gh-pages** as the branch and **/(root)** as the folder.
4. Click **Save**.

To publish a new version after making changes, run `npm run build`, copy the contents of `dist` to the root of `gh-pages`, and push the branch.

The app will be available at [skoulskiy.github.io/ts_react_zustand_task_tracker](https://skoulskiy.github.io/ts_react_zustand_task_tracker/).

## 👤 Author

* **GitHub**: [@Skoulskiy](https://github.com/Skoulskiy)
