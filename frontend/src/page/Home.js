import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import Editor from '../components/Editor/Editor';
import Preview from '../components/Preview/Preview';
import ComparisonSidebar from '../components/Sidebar/ComparisonSidebar';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBars,
    faPen,
    faDownload,
    faUserCircle,
    faCog,
} from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faPen, faDownload, faUserCircle, faCog);

function Home() {
    const [activeLayer, setActiveLayer] = useState(1);
    const [layerNames, setLayerNames] = useState({
        1: 'Слой 1', 
        2: 'Слой 2',
        3: 'Слой 3'
    });
    const [layerContent, setLayerContent] = useState({
        1: '',
        2: '',
        3: '',
    });
    const [layerIds, setLayerIds] = useState({
        1: 1,
        2: 2,
        3: 3
    });
    const navigate = useNavigate();
    const [isComparisonOpen, setComparisonOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false); // Добавляем состояние для модального окна

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    useEffect(() => {
        // Если пользователь не залогинен, редирект на страницу логина
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLatexChange = (newLatex) => {
        setLayerContent((prev) => ({
            ...prev,
            [activeLayer]: newLatex,
        }));
    };

    const handleLayerSelect = (layer) => {
        setActiveLayer(layer);
    };

    const handleLayerRename = (layer, newName) => {
        setLayerNames((prev) => ({
            ...prev,
            [layer]: newName,
        }));
    };

    const handleLayerAdd = () => {
        const newLayerId = Object.keys(layerNames).length + 1;
        const newLayerName = `Слой ${newLayerId}`;
        setLayerNames((prev) => ({
            ...prev,
            [newLayerId]: newLayerName,
        }));
        setLayerContent((prev) => ({
            ...prev,
            [newLayerId]: '',
        }));
        setLayerIds((prev) => ({
            ...prev,
            [newLayerId]: newLayerId,
        }));
        setActiveLayer(newLayerId);
    };

    const handleLayerDelete = (layerToDelete) => {
        const updatedLayerNames = { ...layerNames };
        const updatedLayerContent = { ...layerContent };
        const updatedLayerIds = { ...layerIds };

        delete updatedLayerNames[layerToDelete];
        delete updatedLayerContent[layerToDelete];
        delete updatedLayerIds[layerToDelete];

        setLayerNames(updatedLayerNames);
        setLayerContent(updatedLayerContent);
        setLayerIds(updatedLayerIds);

        // Если удалён активный слой, выбираем следующий
        if (activeLayer === layerToDelete) {
            const remainingLayers = Object.keys(updatedLayerNames);
            setActiveLayer(remainingLayers[0] || null);
        }
    };

    // Открытие модального окна
    const openModal = () => {
        setModalOpen(true);
    };

    // Закрытие модального окна
    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="app">
            <Sidebar
                onLayerSelect={handleLayerSelect}
                activeLayer={activeLayer}
                layerNames={layerNames}
                onLayerRename={handleLayerRename}
                onLayerAdd={handleLayerAdd}
                onLayerDelete={handleLayerDelete}
                className={isSidebarVisible ? '' : 'hidden'}
            />
            <div className="content">
                <Header 
                    layer={activeLayer} 
                    layerName={layerNames[activeLayer]} 
                    onOpenComparison={() => setComparisonOpen(true)} 
                    onToggleSidebar={toggleSidebar} 
                />
                <div className="main">
                    <Editor
                        layer={activeLayer}
                        latexCode={layerContent[activeLayer]}
                        onUpdate={handleLatexChange}
                    />
                    <Preview
                        latexCode={layerContent[activeLayer]}
                        onLatexChange={handleLatexChange}
                    />
                </div>
            </div>
            <ComparisonSidebar
                isOpen={isComparisonOpen}
                onClose={() => setComparisonOpen(false)}
            />
        </div>
    );
}

export default Home;
