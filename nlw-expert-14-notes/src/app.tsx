import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string,
  dateOfCreation: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  })

  function handleNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      dateOfCreation: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];
    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    })

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleNoteSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;


  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NLW Expert"></img>

      <form>
        <input 
        type="text"
        placeholder="Pesquise entre suas notas..."
        onChange={handleNoteSearch}
        className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500">
        </input>
      </form>

      <div className="h-px bg-slate-700 w-full"/>

      <div id="gridNotes" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] p-5">
        <NewNoteCard handleNoteCreated={handleNoteCreated}/>

        {filteredNotes.map((note) => {
          return (
            <NoteCard handleNoteDeleted={handleNoteDeleted} key={note.id} noteCard={note}/>
          );
        })}
      </div>
    </div>
  )
}