import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.css';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

function Header({ layer, layerName, onOpenComparison, onToggleSidebar }) {
    return (
        <div className="header">
            <div className="title">
                    <FontAwesomeIcon 
                        icon="bars" 
                        onClick={onToggleSidebar} // Теперь это определенный проп
                        style={{cursor: 'pointer'}} 
                    />
                <span>{layerName}</span>
            </div>
            <div className="actions">
            <button onClick={onOpenComparison} className="functional-button">
                <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '8px' }} />
                Функционал
            </button>
            </div>
        </div>
    );
}

export default Header;