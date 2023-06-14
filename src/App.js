import React, {useEffect, useRef, useState} from "react";
import Header from "./components/Header/Header";
import Workspace from "./components/Workspace/Workspace";

// store
import {DBConfig} from './DBConfig';
import {initDB, useIndexedDB} from 'react-indexed-db';

initDB(DBConfig);

const App: React.FC = () => {
    const { add, getAll, deleteRecord, update  } = useIndexedDB('notes');

    const [note, setNote] = useState('');
    const [noteActiveId, setNoteActiveId] = useState();
    const [allNotes, setAllNotes] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [readOnly, setReadOnly] = useState(true);

    const inputElement = useRef(null);

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
    }
    const updateListNotes = (allNotes) => {
        setAllNotes(allNotes.sort((a, b) => {
            return b.id - a.id
        }));
    }
    const setActiveNote = (item) => {
        setNoteActiveId(item.id);
        setNote(item.title);
        if (inputElement.current) {
            inputElement.current.focus();
        }
        if (item.title.length === 0) {
            setReadOnly(false);
        } else {
            setReadOnly(true);
        }
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
        if (noteActiveId) {
            deleteRecord(noteActiveId).then(() => {
                setNote('');
                getAll().then(personsFromDB => {
                    updateListNotes(personsFromDB);
                });
            });
        }
    }
    const handleEditNote = () => {
        if (inputElement.current && noteActiveId) {
            inputElement.current.focus();
            setReadOnly(false);
        }
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
                noteActiveId={noteActiveId}
                handleAddNote={handleAddNote}
                handleDeleteNote={handleDeleteNote}
                handleEditNote={handleEditNote}
                handleSearchChange={handleSearchChange}
            />
            <Workspace
                note={note}
                noteActiveId={noteActiveId}
                changeValueNote={changeValueNote}
                allNotes={allNotes}
                updateListNotes={updateListNotes}
                setActiveNote={setActiveNote}
                inputElement={inputElement}
                readOnly={readOnly}

            />

        </div>
    );
};
export default App;
