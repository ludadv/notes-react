import React, {useState} from "react";
import Header from "./components/Header/Header";
import Workspace from "./components/Workspace/Workspace";

// store
import {DBConfig} from './DBConfig';
import {initDB, useIndexedDB} from 'react-indexed-db';

initDB(DBConfig);

const App: React.FC = () => {
    const { add, getAll, deleteRecord, update } = useIndexedDB('notes');

    const [note, setNote] = useState('');
    const [noteActiveId, setNoteActiveId] = useState();
    const [allNotes, setAllNotes] = useState([]);


    const changeValueNote = (text) => {
        setNote(text);
        update({ id: noteActiveId, title: text }).then(
            () => {
                getAll().then(personsFromDB => {
                    updateListNotes(personsFromDB);
                });
            },
            error => {
                console.log(error);
            }
        );
        console.log('noteActiveId', noteActiveId);
    }
    const updateListNotes = (allNotes) => {
        setAllNotes(allNotes.sort((a, b) => {
            return b.id - a.id
        }));
    }
    const setActiveNote = (item) => {
        setNoteActiveId(item.id);
        setNote(item.title);
    }
    return (
        <div className="App">
            <Header
                note={note}
                updateListNotes={updateListNotes}
                changeValueNote={changeValueNote}
                setNoteActiveId={setNoteActiveId}
                allNotes={allNotes}
                setActiveNote={setActiveNote}
                noteActiveId={noteActiveId}
            />
            <Workspace
                note={note}
                changeValueNote={changeValueNote}
                allNotes={allNotes}
                updateListNotes={updateListNotes}
                noteActiveId={noteActiveId}
                setActiveNote={setActiveNote}
            />

        </div>
    );
};
export default App;
