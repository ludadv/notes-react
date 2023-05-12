import React from "react";
import {ReactComponent as Add} from '../../svg/add.svg';
import {ReactComponent as Basket} from '../../svg/basket.svg';
import {ReactComponent as Edit} from '../../svg/edit.svg';

// styles
import "./MenuStyle.scss";

function Menu(props) {
    return (
        <div className='menu'>
            <div className='menu__list'>
                <button
                    type='text'
                    className='menu__item'
                >
                    <Add />
                </button>
                <button
                    type='text'
                    className='menu__item'
                >
                    <Basket />
                </button>
                <button
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