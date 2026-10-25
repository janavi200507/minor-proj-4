import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, FileText, FolderHeart, Pencil, Plus, Search, Trash2, X, Check } from "lucide-react";

const categories = ["Personal", "Study", "Ideas", "Work"];
const noteColors = ["note-cream", "note-sage", "note-rose", "note-lilac"];
const startingNotes = [
  { id: 101, title: "A little reminder", content: "Make time for the things that make you feel like yourself. Progress can be quiet, too.", category: "Personal", updatedAt: new Date().toISOString(), color: "note-cream" },
  { id: 102, title: "Things to learn", content: "• React components\n• State and props\n• useEffect and Local Storage", category: "Study", updatedAt: new Date().toISOString(), color: "note-sage" },
  { id: 103, title: "Project ideas", content: "Keep a list of small ideas. They might turn into something wonderful later.", category: "Ideas", updatedAt: new Date().toISOString(), color: "note-rose" }
];

function NoteForm({ initialNote, onSave, onCancel }) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [category, setCategory] = useState(initialNote?.category || "Personal");

  const submitForm = (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), category });
  };

  return (
    <form className="note-form" onSubmit={submitForm}>
      <label htmlFor="note-title">Note title</label>
      <input id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your note a title" required autoFocus />
      <label htmlFor="note-category">Category</label>
      <select id="note-category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <label htmlFor="note-content">Your note</label>
      <textarea id="note-content" rows="5" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write down whatever is on your mind..." required />
      <div className="form-actions">
        <button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button>
        <button type="submit" className="button button-primary"><Check size={16} /> {initialNote ? "Save changes" : "Save note"}</button>
      </div>
    </form>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  const dateLabel = new Date(note.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <article className={`note-card ${note.color || "note-cream"}`}>
      <div className="note-card-top"><span className="note-category"><FolderHeart size={12} /> {note.category}</span><div className="note-actions"><button className="icon-button" onClick={() => onEdit(note)} aria-label="Edit note"><Pencil size={15} /></button><button className="icon-button delete-action" onClick={() => onDelete(note.id)} aria-label="Delete note"><Trash2 size={15} /></button></div></div>
      <h3>{note.title}</h3>
      <p className="note-content">{note.content}</p>
      <div className="note-card-footer"><span><CalendarDays size={12} /> Updated {dateLabel}</span><span className="note-fold"></span></div>
    </article>
  );
}

export default function NotesManager() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("daybook-notes");
      return saved ? JSON.parse(saved) : startingNotes;
    } catch {
      return startingNotes;
    }
  });
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    localStorage.setItem("daybook-notes", JSON.stringify(notes));
  }, [notes]);

  const visibleNotes = useMemo(() => notes
    .filter((note) => selectedCategory === "All" || note.category === selectedCategory)
    .filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(searchText.toLowerCase())), [notes, selectedCategory, searchText]);

  const saveNote = (details) => {
    if (editingNote) {
      setNotes((currentNotes) => currentNotes.map((note) => note.id === editingNote.id ? { ...note, ...details, updatedAt: new Date().toISOString() } : note));
    } else {
      const newNote = { ...details, id: Date.now(), updatedAt: new Date().toISOString(), color: noteColors[notes.length % noteColors.length] };
      setNotes((currentNotes) => [newNote, ...currentNotes]);
    }
    setShowForm(false);
    setEditingNote(null);
  };

  const editNote = (note) => { const selectedNote = notes.find((item) => item.id === note.id); if (selectedNote) { setEditingNote(selectedNote); setShowForm(true); } };
  const deleteNote = (id) => setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));

  return (
    <section className="content-wrap notes-page">
      <div className="page-intro">
        <div><div className="eyebrow">COLLECT YOUR THOUGHTS</div><h2>My Notes<span className="title-period">.</span></h2><p className="page-description">A home for your ideas, plans, and little reminders.</p></div>
        <button className="button button-primary add-main" onClick={() => { setEditingNote(null); setShowForm(true); }}><Plus size={17} /> New note</button>
      </div>

      <div className="notes-summary">
        <div className="notes-summary-icon"><BookOpen size={22} /></div>
        <div><strong>{notes.length} {notes.length === 1 ? "note" : "notes"} saved</strong><p>Your thoughts, all in one calm little corner.</p></div>
        <div className="summary-decoration">✳</div>
      </div>

      {showForm && <div className="form-panel note-form-panel"><div className="form-panel-heading"><div><h3>{editingNote ? "Edit your note" : "Write a new note"}</h3><p>It doesn’t need to be perfect. Just get it down.</p></div><button className="icon-button" onClick={() => { setShowForm(false); setEditingNote(null); }} aria-label="Close form"><X size={18} /></button></div><NoteForm key={editingNote?.id || "new-note"} initialNote={editingNote} onSave={saveNote} onCancel={() => { setShowForm(false); setEditingNote(null); }} /></div>}

      <div className="notes-toolbar">
        <div className="search-box notes-search"><Search size={16} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search your notes..." aria-label="Search notes" /></div>
        <div className="category-filters">{["All", ...categories].map((category) => <button key={category} className={`category-button ${selectedCategory === category ? "category-active" : ""}`} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div>
      </div>

      <div className="notes-grid">
        {visibleNotes.map((note) => <NoteCard key={note.id} note={note} onEdit={editNote} onDelete={deleteNote} />)}
        {visibleNotes.length === 0 && <div className="empty-state notes-empty"><div className="empty-icon"><FileText size={24} /></div><h3>{searchText ? "No notes found" : "Your page is waiting"}</h3><p>{searchText ? "Try a different search or category." : "Start collecting your thoughts by creating a note."}</p>{!searchText && <button className="button button-outline" onClick={() => setShowForm(true)}><Plus size={16} /> Create a note</button>}</div>}
      </div>
      <div className="list-note"><span className="tiny-sparkle">✳</span> Good ideas deserve a place to stay.</div>
    </section>
  );
}
