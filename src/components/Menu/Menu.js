import React from "react";
import {ReactComponent as Add} from '../../svg/add.svg';
import {ReactComponent as Basket} from '../../svg/basket.svg';
import {ReactComponent as Edit} from '../../svg/edit.svg';

// Hooks
import {useIndexedDB} from 'react-indexed-db';

// styles
import "./MenuStyle.scss";

function Menu({note, setActiveNote, allNotes, updateListNotes, noteActiveId, setNoteActiveId}) {
    const { add, getAll, deleteRecord, update } = useIndexedDB('notes');
    console.log(allNotes);
    const handleAddNote = () => {
        add({ title: '' }).then(
            (id, z) => {
                setActiveNote({ id, title: '' });
                console.log('id', id);
            },
            error => {
                console.log(error);
            }
        );
        getAll().then(personsFromDB => {
            updateListNotes(personsFromDB);
        });
    }
    const handleDeleteNote = () => {
        deleteRecord(noteActiveId).then(() => {
            // console.log(event.target);
        });
        getAll().then(personsFromDB => {
            updateListNotes(personsFromDB);
        });
    }
    const handleEditNote = () => {
        // update({title: note},noteActiveValue).then(event => {
        //     changeValueNote(noteActiveValue);
        // });
        // getAll().then(personsFromDB => {
        //     updateListNotes(personsFromDB);
        // });
    }
    return (
        <div className='menu'>
            <div className='menu__list'>
                <button
                    onClick={handleAddNote}
                    type='text'
                    className='menu__item'
                >
                    <Add />
                </button>
                <button
                    disabled={allNotes.length === 0}
                    onClick={handleDeleteNote}
                    type='text'
                    className='menu__item'
                >
                    <Basket />
                </button>
                <button
                    disabled={allNotes.length === 0}
                    onClick={handleEditNote}
                    type='text'
                    className='menu__item'
                >
                    <Edit />
                </button>
            </div>
        </div>

    )
}

export default Menu;
