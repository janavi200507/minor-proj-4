import { useState } from "react";
import { CheckSquare, NotebookPen, Leaf, Menu, X } from "lucide-react";
import TaskManager from "./components/TaskManager.jsx";
import NotesManager from "./components/NotesManager.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("tasks");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changePage = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Leaf size={21} /></div>
          <div>
            <h1>daybook</h1>
            <p>Make room for what matters</p>
          </div>
          <button className="mobile-close icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className={activePage === "tasks" ? "nav-item active" : "nav-item"} onClick={() => changePage("tasks")}>
            <CheckSquare size={19} /><span>My Tasks</span>
          </button>
          <button className={activePage === "notes" ? "nav-item active" : "nav-item"} onClick={() => changePage("notes")}>
            <NotebookPen size={19} /><span>My Notes</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="quote-mark">“</div>
          <p className="sidebar-quote">A little progress each day adds up to big results.</p>
          <span className="sidebar-caption">YOUR DAILY REMINDER</span>
        </div>
        <div className="sidebar-footer"><span className="status-dot"></span> Your space, your pace</div>
      </aside>

      {mobileMenuOpen && <button className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage === "tasks" ? "My Tasks" : "My Notes"}</strong></div>
          <div className="topbar-right"><span className="today-dot"></span><span>YOUR PERSONAL SPACE</span></div>
        </header>

        {activePage === "tasks" ? <TaskManager /> : <NotesManager />}
        <footer className="page-footer">Made for your everyday moments <span>✳</span></footer>
      </main>
    </div>
  );
}
