import React, { useState, } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCog, 
    faPen, 
    faPlus, 
    faTrash 
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../ThemeContext';
import './Sidebar.css';

function Sidebar({ 
    onLayerSelect, 
    activeLayer, 
    layerNames, 
    onLayerRename,
    onLayerAdd,
    onLayerDelete,
    className
}) {
    const [editingLayer, setEditingLayer] = useState(null);
    const [tempName, setTempName] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { isDarkTheme, toggleTheme } = useTheme();
    const [layers, setLayers] = useState([1, 2, 3]);

    const handleLayerClick = (layer) => {
        if (onLayerSelect) {
            onLayerSelect(layer);
        }
    };

    const startRename = (layer, currentName) => {
        setEditingLayer(layer);
        setTempName(currentName);
    };

    const handleRenameSubmit = (layer) => {
        if (tempName.trim()) {
            onLayerRename(layer, tempName.trim());
            setEditingLayer(null);
        }
    };

    const handleRenameCancel = () => {
        setEditingLayer(null);
    };

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleAddLayer = () => {
        // Находим максимальный номер слоя и добавляем новый
        const maxLayer = Math.max(...layers);
        const newLayer = maxLayer + 1;
        
        // Обновляем список слоев
        setLayers([...layers, newLayer]);
        
        // Вызываем колбэк для родительского компонента
        onLayerAdd(newLayer);
        
        // Автоматически выбираем новый слой
        onLayerSelect(newLayer);
    };

    const handleDeleteLayer = (layerToDelete) => {
        // Нельзя удалить последний слой
        if (layers.length <= 1) return;

        // Удаляем слой из списка
        const updatedLayers = layers.filter(layer => layer !== layerToDelete);
        setLayers(updatedLayers);

        // Вызываем колбэк для родительского компонента
        onLayerDelete(layerToDelete);

        // Выбираем первый слой после удаления
        onLayerSelect(updatedLayers[0]);
    };

    return (
        <div className={`sidebar ${className || ''}`}>
            <div className="sidebar-header">
                <div className="logo">MathScribe</div>
                <div className="settings-container">
                    <button 
                        className="settings-btn" 
                        onClick={toggleSettings}
                        title="Настройки"
                    >
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                    {isSettingsOpen && (
                        <div className="settings-dropdown">
                            <ul>
                                <li onClick={toggleTheme}>
                                    {isDarkTheme ? 'Светлая тема' : 'Темная тема'}
                                </li>
                                <li><a href="https://disk.yandex.ru/i/JRKYhJ5uoGDNWg" target="_blank">О программе</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="layers-header">
                <h3>Слои</h3>
                <button 
                    className="add-layer-btn" 
                    onClick={handleAddLayer}
                    disabled={layers.length >= 10}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>

            <div className="layers">
                {layers.map((layer) => (
                    <div
                        key={layer}
                        className={`layer ${activeLayer === layer ? 'active' : ''}`}
                    >
                        {editingLayer === layer ? (
                            <div className="layer-rename">
                                <input 
                                    type="text" 
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={() => handleRenameSubmit(layer)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameSubmit(layer);
                                        if (e.key === 'Escape') handleRenameCancel();
                                    }}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div 
                                className="layer-content"
                                onClick={() => handleLayerClick(layer)}
                            >
                                <span>{layerNames[layer]}</span>
                                <div className="layer-actions">
                                    <FontAwesomeIcon 
                                        icon={faPen} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startRename(layer, layerNames[layer]);
                                        }}
                                    />
                                    {layers.length > 1 && (
                                        <FontAwesomeIcon 
                                            icon={faTrash} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteLayer(layer);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;