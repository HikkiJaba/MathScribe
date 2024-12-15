import React, { useState } from 'react';
import './ComparisonSidebar.css';
import ComparisonResultModal from '../Modal/ComparisonResultModal';  // Импортируем модальное окно с результатами сравнения

function ComparisonSidebar({ isOpen, onClose }) {
  const [formula1, setFormula1] = useState('');
  const [formula2, setFormula2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparisonMethod, setComparisonMethod] = useState('symbol');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

  const handleCompare = async () => {
    try {
      const response = await fetch('http://localhost:5000/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formula1, formula2, comparisonMethod }),
      });
      const data = await response.json();
      setComparisonResult(data);
      setIsModalOpen(true);  // Открытие модального окна после получения результата
    } catch (error) {
      console.error('Ошибка сравнения формул:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Закрытие модального окна
  };

  return (
    <div className={`comparison-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="close-button-container">
        <button className="close-button" onClick={onClose}>✖</button>
      </div>

      <div className="analysis-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>Анализ 2 функций</h2>
        <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
      </div>

      {isExpanded && (
        <div className="analysis-content">
          <textarea
            placeholder="Введите формулу 1"
            value={formula1}
            onChange={(e) => setFormula1(e.target.value)}
          />
          <textarea
            placeholder="Введите формулу 2"
            value={formula2}
            onChange={(e) => setFormula2(e.target.value)}
          />

          <select value={comparisonMethod} onChange={(e) => setComparisonMethod(e.target.value)}>
            <option value="symbol">По символам</option>
            <option value="graph">Через граф</option>
            <option value="lcs">Максимальная общая подстрока</option>
          </select>

          <button onClick={handleCompare}>Сравнить</button>
        </div>
      )}

      {/* Модальное окно для отображения результата */}
      <ComparisonResultModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        result={comparisonResult} 
        formula1={formula1}
        formula2={formula2}
        comparisonMethod={comparisonMethod} 
      />
    </div>
  );
}

export default ComparisonSidebar;
