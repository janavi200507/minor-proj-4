import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, CheckCircle2, Circle, ClipboardList, Clock3, Pencil, Plus, Search, Trash2, X } from "lucide-react";

const startingTasks = [
  { id: 1, title: "Plan my week", dueDate: "", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Review class notes", dueDate: "", completed: true, createdAt: new Date().toISOString() },
  { id: 3, title: "Work on my project", dueDate: "", completed: false, createdAt: new Date().toISOString() }
];

function TaskForm({ initialTask, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), dueDate });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task name</label>
      <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What would you like to get done?" autoFocus required />
      <label htmlFor="task-date">Due date <span className="optional-label">OPTIONAL</span></label>
      <input id="task-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      <div className="form-actions">
        <button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button>
        <button type="submit" className="button button-primary"><Check size={16} /> {initialTask ? "Save changes" : "Add task"}</button>
      </div>
    </form>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const dueLabel = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";

  return (
    <article className={`task-row ${task.completed ? "task-completed" : ""}`}>
      <button className={`task-check ${task.completed ? "checked" : ""}`} onClick={() => onToggle(task.id)} aria-label={task.completed ? "Mark task pending" : "Mark task completed"}>
        {task.completed ? <Check size={15} /> : <span />}
      </button>
      <div className="task-main">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span className={`status-pill ${task.completed ? "status-done" : "status-pending"}`}>
            {task.completed ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
            {task.completed ? "Completed" : "Pending"}
          </span>
          {dueLabel && <span className="due-label"><CalendarDays size={12} /> {dueLabel}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task"><Pencil size={16} /></button>
        <button className="icon-button delete-action" onClick={() => onDelete(task.id)} aria-label="Delete task"><Trash2 size={16} /></button>
      </div>
    </article>
  );
}

export default function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("daybook-tasks");
      return saved ? JSON.parse(saved) : startingTasks;
    } catch {
      return startingTasks;
    }
  });
  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("daybook-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = useMemo(() => tasks
    .filter((task) => filter === "All" || (filter === "Completed" ? task.completed : !task.completed))
    .filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase())), [tasks, filter, searchText]);

  const saveTask = (taskDetails) => {
    if (editingTask) {
      setTasks((currentTasks) => currentTasks.map((task) => task.id === editingTask.id ? { ...task, ...taskDetails } : task));
    } else {
      const newTask = { ...taskDetails, id: Date.now(), completed: false, createdAt: new Date().toISOString() };
      setTasks((currentTasks) => [newTask, ...currentTasks]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const toggleTask = (id) => setTasks((currentTasks) => currentTasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  const deleteTask = (id) => setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  const editTask = (task) => { const selectedTask = tasks.find((item) => item.id === task.id); if (selectedTask) { setEditingTask(selectedTask); setShowForm(true); } };

  return (
    <section className="content-wrap">
      <div className="page-intro">
        <div>
          <div className="eyebrow">A FRESH START, EVERY DAY</div>
          <h2>My Tasks<span className="title-period">.</span></h2>
          <p className="page-description">Small steps lead to lovely things. What’s on your list today?</p>
        </div>
        <button className="button button-primary add-main" onClick={() => { setEditingTask(null); setShowForm(true); }}><Plus size={17} /> Add a task</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon stat-icon-total"><ClipboardList size={19} /></div><div><span className="stat-label">TOTAL TASKS</span><strong>{tasks.length}</strong><small>On your list</small></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-pending"><Clock3 size={19} /></div><div><span className="stat-label">PENDING</span><strong>{pendingCount}</strong><small>Still to do</small></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-done"><CheckCircle2 size={19} /></div><div><span className="stat-label">COMPLETED</span><strong>{completedCount}</strong><small>Nicely done</small></div></div>
      </div>

      <div className="section-heading">
        <div><h3>Your to-do list</h3><p>Keep your day moving at your own pace.</p></div>
        <div className="search-box"><Search size={16} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Find a task..." aria-label="Search tasks" /></div>
      </div>

      <div className="filter-bar">
        {["All", "Pending", "Completed"].map((option) => <button key={option} className={`filter-button ${filter === option ? "filter-active" : ""}`} onClick={() => setFilter(option)}>{option}<span>{option === "All" ? tasks.length : option === "Completed" ? completedCount : pendingCount}</span></button>)}
      </div>

      {showForm && <div className="form-panel"><div className="form-panel-heading"><div><h3>{editingTask ? "Edit task" : "Create a task"}</h3><p>Give yourself a clear next step.</p></div><button className="icon-button" onClick={() => { setShowForm(false); setEditingTask(null); }} aria-label="Close form"><X size={18} /></button></div><TaskForm key={editingTask?.id || "new-task"} initialTask={editingTask} onSave={saveTask} onCancel={() => { setShowForm(false); setEditingTask(null); }} /></div>}

      <div className="task-list">
        {visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask} />)}
        {visibleTasks.length === 0 && <div className="empty-state"><div className="empty-icon"><Circle size={24} /></div><h3>{searchText ? "No matching tasks" : "Nothing here just yet"}</h3><p>{searchText ? "Try another search word." : "Add a task to give your day a little direction."}</p>{!searchText && <button className="button button-outline" onClick={() => setShowForm(true)}><Plus size={16} /> Create your first task</button>}</div>}
      </div>
      <div className="list-note"><span className="tiny-sparkle">✳</span> You’ve got this. One thing at a time.</div>
    </section>
  );
}
