import React, { useReducer, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './Editor.css';
import SearchModal from './SearchModall';

const initialState = {
    layerContent: JSON.parse(localStorage.getItem('layerContent')) || {
        1: '',
        2: '',
        3: ''
    },
    currentContent: ''
};

function editorReducer(state, action) { 
    switch (action.type) {
        case 'SET_LAYER_CONTENT': {
            const { layer, content } = action.payload;
            const updatedLayerContent = {
                ...state.layerContent,
                [layer]: content
            };

            localStorage.setItem('layerContent', JSON.stringify(updatedLayerContent));

            return {
                ...state,
                layerContent: updatedLayerContent,
                currentContent: content
            };
        }
        case 'CHANGE_LAYER':
            return {
                ...state,
                currentContent: state.layerContent[action.payload] || ''
            };

        default:
            return state;
    }
}

const errorMessagesMap = {
    "Expected 'EOF'": "Ожидался конец выражения.",
    "Unexpected character": "Обнаружен неожиданный символ.",
    "Expected group": "Ожидалась группа (скобки, например {}).",
    "Undefined control sequence": "Используется неопределённая команда LaTeX.",
    "Missing { or }": "Пропущена открывающая или закрывающая скобка.",
    "Double superscript": "Два знака верхнего индекса подряд.",
    "Double subscript": "Два знака нижнего индекса подряд."
};

function getFriendlyErrorMessage(error) {
    for (const [key, message] of Object.entries(errorMessagesMap)) {
        if (error.includes(key)) {
            return message;
        }
    }
    return "Произошла ошибка в синтаксисе LaTeX. Проверьте ввод.";
}

function Editor({ layer, latexCode, onUpdate }) {
    const [, dispatch] = useReducer(editorReducer, initialState); // Using dispatch only, as state is not needed
    const [error, setError] = useState(null);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);

    useEffect(() => {
        dispatch({
            type: 'CHANGE_LAYER',
            payload: layer
        });
    }, [layer]);

    const handleChange = (e) => {
        const newContent = e.target.value;
        onUpdate(newContent);
        dispatch({
            type: 'SET_LAYER_CONTENT',
            payload: {
                layer: layer,
                content: newContent
            }
        });
    };

    const validateLatex = (latex) => {
        try {
            katex.render(latex, document.createElement('div'));
            setError(null);
        } catch (err) {
            const friendlyMessage = getFriendlyErrorMessage(err.message);
            setError(friendlyMessage);
        }
    };

    useEffect(() => {
        validateLatex(latexCode);
    }, [latexCode]);

    return (
        <div className="editor-container">
            {error && <div className="latex-error">{error}</div>}
            <div className="editor-actions">
                <div className='search-div'>
                    <button 
                        className="search-btn" 
                        onClick={() => {
                            setSearchModalOpen(true);
                        }}
                        title="Открыть поиск формул"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>

            <div className="editor">
                <textarea
                    value={latexCode}
                    onChange={handleChange}
                    placeholder={`Введите формулу LaTeX...`}
                />
            </div>

            <SearchModal isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </div>
    );
}

export default Editor;
