import React, {useEffect, useState} from "react";
import Header from "./components/Header/Header";
import Workspace from "./components/Workspace/Workspace";

// store
import {DBConfig} from './DBConfig';
import {initDB, useIndexedDB} from 'react-indexed-db';

initDB(DBConfig);

const App: React.FC = () => {
    const { add, getAll, deleteRecord, update, getByIndex, openCursor  } = useIndexedDB('notes');

    const [note, setNote] = useState('');
    const [noteActiveId, setNoteActiveId] = useState();
    const [allNotes, setAllNotes] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);

    const changeValueNote = (note) => {
        setNote(note);
        if (noteActiveId) {
            update({ id: noteActiveId, title: note }).then(
                () => {
                    getAll().then(personsFromDB => {
                        updateListNotes(personsFromDB);
                    });
                },
                error => {
                    console.log(error);
                }
            );
        }
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

    //actions with storage
    const handleAddNote = () => {
        add({ title: '' }).then(
            (id, z) => {
                setActiveNote({ id, title: '' });
                getAll().then(personsFromDB => {
                    updateListNotes(personsFromDB);
                });
            },
            error => {
                console.log(error);
            }
        );
    }
    const handleDeleteNote = () => {
        deleteRecord(noteActiveId).then(() => {
            setNote('');
            getAll().then(personsFromDB => {
                updateListNotes(personsFromDB);
            });
        });
    }

    const handleSearchChange = (element) => {
        setSearchValue(element);
        if (!element) {
            getAll().then(personsFromDB => {
                updateListNotes(personsFromDB);
            });
            setFilteredNotes([]);
        } else {
            allNotes.forEach(item => {
                if(item.title.toLowerCase().includes(element.toLowerCase())) {
                    setFilteredNotes(filteredNotes.push(item));
                }
                setFilteredNotes([]);
            });
            console.log('filteredNotes', filteredNotes);
            updateListNotes(filteredNotes);
        }
    }
    useEffect(() => {
        getAll().then(personsFromDB => {
            updateListNotes(personsFromDB);
        });
    }, []);

    return (
        <div className="App">
            <Header
                allNotes={allNotes}
                searchValue={searchValue}
                handleAddNote={handleAddNote}
                handleDeleteNote={handleDeleteNote}
                handleSearchChange={handleSearchChange}
            />
            <Workspace
                note={note}
                noteActiveId={noteActiveId}
                changeValueNote={changeValueNote}
                allNotes={allNotes}
                updateListNotes={updateListNotes}
                setActiveNote={setActiveNote}
            />

        </div>
    );
};
export default App;
