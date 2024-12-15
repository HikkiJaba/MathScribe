import React from 'react';
import { Line } from 'react-chartjs-2';  // Импорт компонента Line из react-chartjs-2
import './ComparisonResultModal.css';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Регистрируем необходимые компоненты для Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function ComparisonResultModal({ isOpen, onClose, result, formula1, formula2, comparisonMethod }) {
  const renderGraph = (commonSymbols) => {
    // Отфильтруем пробелы и преобразуем данные для графика
    const filteredSymbols = Object.keys(commonSymbols).filter(symbol => symbol.trim() !== '');
    const chartData = {
      labels: filteredSymbols, // Используем символы как метки на оси X
      datasets: [
        {
          label: 'Частота совпадений символов',
          data: filteredSymbols.map(symbol => commonSymbols[symbol]), // Значения — частота символов
          borderColor: 'rgba(75,192,192,1)',  // Цвет линии графика
          backgroundColor: 'rgba(75,192,192,0.2)', // Цвет заливки
          fill: true,  // Заполняем область под графиком
        },
      ],
    };
  
    // Настраиваем параметры графика
    const options = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Символы',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Частота',
          },
          beginAtZero: true, // Начинаем с 0 для ясности графика
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Частота символа "${context.label}": ${context.raw}`;
            },
          },
        },
      },
    };
  
    return (
      <Line data={chartData} options={options} />
    );
  };
  
  

  // Функция для отрисовки результатов сравнения в зависимости от выбранного метода
  const renderComparisonResults = () => {
    switch (comparisonMethod) {
      case 'graph':
        return (
          <div>
            <h3>Граф сравнения</h3>
            {result.graph_data ? (
              renderGraph(result.graph_data) // Отображаем граф, если данные есть
            ) : (
              <p>Нет данных для графа.</p>
            )}
            <p><strong>Процент совпадения по графу:</strong> {result.match_percentage || 0}%</p>
          </div>
        );
  
      case 'symbol':
        return (
          <div>
            <h3>Результаты по символам</h3>
            <p><strong>Совпадающие символы:</strong> {result.symbols || 'Нет данных о символах'}</p>
            <p><strong>Процент совпадения:</strong> {result.match_percentage || 0}%</p>
          </div>
        );
  
      case 'fragments':
        return (
          <div>
            <h3>Результаты по фрагментам</h3>
            {result.fragments && result.fragments.length > 0 ? (
              <ul>
                {result.fragments.map((fragment, index) => (
                  <li key={index}><strong>Фрагмент {index + 1}:</strong> {fragment}</li>
                ))}
              </ul>
            ) : (
              <p>Фрагменты совпадений отсутствуют.</p>
            )}
            <p><strong>Процент совпадения:</strong> {result.match_percentage || 0}%</p>
          </div>
        );
  
      case 'style':
        return (
          <div>
            <h3>Результаты по стилю</h3>
            <p><strong>Структура Формулы 1:</strong> {JSON.stringify(result.structure1 || {})}</p>
            <p><strong>Структура Формулы 2:</strong> {JSON.stringify(result.structure2 || {})}</p>
            <p><strong>Процент совпадения:</strong> {result.match_percentage || 0}%</p>
          </div>
        );
  
      case 'lcs':
        return (
          <div>
            <h3>Результаты LCS (максимальная общая подстрока)</h3>
            <p><strong>Общая подстрока:</strong> {result.lcs || 'Нет совпадений'}</p>
            <p><strong>Процент совпадения:</strong> {result.match_percentage || 0}%</p>
          </div>
        );
  
      case 'context':
        return (
          <div>
            <h3>Результаты контекстного анализа</h3>
            <p><strong>Описание совпадений:</strong> {result.context_match_description || 'Нет данных'}</p>
            <p><strong>Процент совпадения:</strong> {result.match_percentage || 0}%</p>
          </div>
        );
  
      default:
        return (
          <div>
            <p>Метод сравнения не выбран или не поддерживается.</p>
          </div>
        );
    }
  };
  

  return (
    <div className={`comparison-modal-overlay ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="comparison-modal-container">
        <button className="modal-close-button" onClick={onClose}>✖</button>
        <h2>Результаты сравнения</h2>
        {result ? (
          <div className="comparison-modal-content">
            <p><strong>Процент совпадения:</strong> {result.match_percentage}%</p>
            <p><strong>Метод сравнения:</strong> {comparisonMethod}</p>
            <p><strong>Формула 1:</strong> {formula1}</p>
            <p><strong>Формула 2:</strong> {formula2}</p>
            {renderComparisonResults()}  {/* Отображаем результаты сравнения */}
          </div>
        ) : (
          <p>Нет данных для отображения результатов.</p>
        )}
      </div>
    </div>
  );
}

export default ComparisonResultModal;
