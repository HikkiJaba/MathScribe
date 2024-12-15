import React, { useState } from 'react';
import './Editor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy } from '@fortawesome/free-solid-svg-icons';
import katex from 'katex';  // Импортируем KaTeX
import 'katex/dist/katex.min.css';  // Импортируем стили KaTeX

function SearchModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const response = await fetch(`http://localhost:5000/api/search?query=${searchQuery}`);
            const data = await response.json();
            
            // Рендерим LaTeX для каждого результата
            const renderedResults = data.map((result) => ({
                ...result,
                formulaRendered: renderLatex(result.formula)
            }));

            setResults(renderedResults);  // Обновляем состояние с результатами
        } catch (error) {
            console.error('Error searching formulas:', error);
        }
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryClick = (category) => {
        setSearchQuery(category);  // Вставляем текст категории в инпут
        // Убираем автоматический запуск поиска
    };

    const handleCopyFormula = (formula) => {
        navigator.clipboard.writeText(formula).then(() => {
            // Optionally show a success message here
        }).catch((error) => {
            console.error('Error copying formula:', error);
        });
    };

    // Функция для рендеринга LaTeX через KaTeX
    const renderLatex = (latex) => {
        try {
            return katex.renderToString(latex, { throwOnError: false });
        } catch (error) {
            return `<span class="error">Invalid LaTeX</span>`;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay">
            <div className="search-modal-content">
                <button className="search-modal-close" onClick={onClose}>
                    ×
                </button>
                <div className="mathscribe-formula-search-container">
                    <h2 className="mathscribe-search-modal-title">Библиотека формул</h2>
                    <p className="mathscribe-search-modal-description">Найдите нужную математическую формулу</p>

                    <div className="mathscribe-search-input-wrapper">
                        <input
                            type="text"
                            className="mathscribe-search-modal-input"
                            placeholder="Например, площадь круга, синус угла..."
                            value={searchQuery}
                            onChange={handleChange}
                        />
                        <button className="mathscribe-search-modal-button" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                    <div className="mathscribe-popular-categories">
                        <h3 className="mathscribe-categories-title">Быстрый поиск:</h3>
                        <div className="mathscribe-category-chips">
                            <span 
                                className="mathscribe-category-chip" 
                                onClick={() => handleCategoryClick('Геометрия')}
                            >
                                Геометрия
                            </span>
                            <span 
                                className="mathscribe-category-chip" 
                                onClick={() => handleCategoryClick('Тригонометрия')}
                            >
                                Тригонометрия
                            </span>
                            <span 
                                className="mathscribe-category-chip" 
                                onClick={() => handleCategoryClick('Физика')}
                            >
                                Физика
                            </span>
                            <span 
                                className="mathscribe-category-chip" 
                                onClick={() => handleCategoryClick('Алгебра')}
                            >
                                Алгебра
                            </span>
                        </div>
                    </div>
                        
                    <div className="mathscribe-search-results">
                        {results.length > 0 ? (
                            results.map((result, index) => (
                                <div className="mathscribe-result-item" key={index}>
                                    <div className="mathscribe-formula-preview" dangerouslySetInnerHTML={{ __html: result.formulaRendered }} />
                                    <div className="mathscribe-formula-explanation">
                                        <p>{result.explanation}</p>
                                    </div>
                                    <button
                                        className="mathscribe-copy-formula-btn"
                                        onClick={() => handleCopyFormula(result.formula)}
                                    >
                                        <FontAwesomeIcon icon={faCopy} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>Нет результатов</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchModal;
