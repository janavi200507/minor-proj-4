# Daybook — To-Do App + Notes App

A responsive React application for managing daily tasks and saving notes. This project was created for the Week 04 Minor Project requirements.

## Features implemented

### To-Do App
- Add new tasks
- Mark tasks as completed or pending
- Edit and delete tasks
- Display Completed/Pending status
- Filter tasks by All, Completed, and Pending
- Add optional due dates
- Search tasks
- Save tasks in browser Local Storage

### Notes App
- Create, edit, and delete notes
- View notes in an organized card layout
- Search note titles and content
- Categorize notes as Personal, Study, Ideas, or Work
- Display the last-updated timestamp
- Save notes in browser Local Storage

## Technologies used
- React.js
- JavaScript ES6+
- JSX
- CSS
- Vite
- Lucide React icons

## React and JavaScript concepts demonstrated
- Functional components and reusable components
- Props passed to child components
- `useState` for state management
- `useEffect` for Local Storage side effects
- Event handling and conditional rendering
- List rendering with `.map()`
- Array methods including `.filter()` and `.find()` concepts (the project uses `.filter()` and `.map()` for filtering and rendering)
- Arrow functions, template literals, destructuring, spread operator, `let`/`const`
- Object updates and array manipulation

## Project structure

```text
minor-project-04/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── TaskManager.jsx
    │   └── NotesManager.jsx
    └── styles/
        └── style.css
```

## Setup instructions

1. Install Node.js if it is not already installed.
2. Extract this project ZIP file.
3. Open the `minor-project-04` folder in VS Code.
4. Open Terminal → New Terminal.
5. Run:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local URL shown in the terminal, usually `http://localhost:5173/`.

## Build for deployment

```bash
npm run build
```

Vite creates the production site in the `dist` folder.

## Notes
- Tasks and notes are stored in the browser's Local Storage on the device/browser where they are created.
- The starter examples are sample data. You can edit or delete them.
- To submit, push the project source to a GitHub repository and share the repository link according to your course instructions.
