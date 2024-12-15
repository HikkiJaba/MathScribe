import React, { useEffect, useRef, useState } from 'react';
import 'mathlive';
import './Preview.css';

function Preview({ latexCode, onLatexChange }) {
    const [copiedContent, setCopiedContent] = useState(''); // Состояние для хранения скопированного содержимого
    const mathFieldRef = useRef(null);

    useEffect(() => {
        const mathField = mathFieldRef.current;

        if (mathField) {
            // Устанавливаем начальное значение
            if (latexCode !== mathField.value) {
                mathField.value = latexCode;
            }

            // Настройки для скрытия меню и клавиатуры
            mathField.setOptions({
                virtualKeyboardMode: 'manual', // Отключаем виртуальную клавиатуру
                toolbarPosition: 'none', // Отключаем панель инструментов
                spacebarKillsFocus: true, // Отключаем фокус с клавиши пробела
                placeholder: "Ввод" // Устанавливаем плейсхолдер
            });

            // Отключаем контекстное меню (правый клик)
            const handleContextMenu = (event) => {
                event.preventDefault(); // Предотвращаем стандартное контекстное меню
            };

            mathField.addEventListener('contextmenu', handleContextMenu);

            // Функция для вставки матрицы
            const insertMatrix = () => {
                const rows = prompt("Введите количество строк (макс. 5):", "2");
                const cols = prompt("Введите количество столбцов (макс. 5):", "2");

                const rowsNum = Math.min(Math.max(1, parseInt(rows, 10)), 5); // Ограничиваем от 1 до 5
                const colsNum = Math.min(Math.max(1, parseInt(cols, 10)), 5); // Ограничиваем от 1 до 5

                let matrix = "\\begin{matrix}\n";
                for (let i = 0; i < rowsNum; i++) {
                    matrix += Array(colsNum).fill("a").join(" & ") + " \\\\ \n"; // Заполняем матрицу значениями
                }
                matrix += "\\end{matrix}";

                mathField.value += matrix; // Добавляем матрицу в поле (не заменяем!)
            };

            // Функция для вставки формулы (LaTeX код)
            const insertFormula = (latexFormula) => {
                mathField.value += latexFormula; // Добавляем формулу в поле, а не заменяем
            };

            // Функция для копирования содержимого
            const copyContent = () => {
                const content = mathField.value;
                setCopiedContent(content); // Сохраняем скопированное содержимое в состоянии
                navigator.clipboard.writeText(content).then(() => {
                    console.log("Содержимое скопировано в буфер обмена");
                }).catch(err => {
                    console.error("Не удалось скопировать: ", err);
                });
            };

            // Функция для вставки ранее скопированного содержимого
            const pasteContent = () => {
                if (copiedContent) {
                    mathField.value += copiedContent; // Вставляем ранее скопированное содержимое
                } else {
                    console.log('Нет скопированного содержимого');
                }
            };

            // Сложные формулы для подменю
            const formulas = [
                { label: '∫ₐᵇ f(x) dx (Интеграл с пределами)', latex: '\\int_a^b f(x) dx' },
                { label: '∬ₐᵇ f(x, y) dx dy (Двойной интеграл)', latex: '\\iint_a^b f(x, y) \\, dx \\, dy' },
                { label: 'Cov(X, Y) (Ковариационная матрица)', latex: '\\text{Cov}(X, Y)' },
                { label: '∑ᵢ₌₀ⁿ fⁱ(x) (Ряд Тейлора)', latex: '\\sum_{i=0}^n f^i(x)' },
                { label: 'Jₙ(x) (Функция Бесселя)', latex: 'J_n(x)' },
                { label: 'ln(x) (Логарифм с базой e)', latex: '\\ln(x)' },
                { label: 'det(A) (Матричный детерминант)', latex: '\\det(A)' },
                { label: 'Γ(x) (Гамма-функция)', latex: '\\Gamma(x)' },
                { label: 'dy/dx = f(x) (Дифференциальное уравнение)', latex: '\\frac{dy}{dx} = f(x)' },
            ];

            // Кастомизируем пункты меню
            mathField.menuItems = [
                {
                    label: 'Вставить матрицу', // Русская метка
                    onMenuSelect: insertMatrix // Вставляем матрицу при выборе
                },
                {
                    type: 'divider' // Разделитель
                },
                {
                    label: 'Вставить формулу', // Новое подменю для вставки формулы
                    submenu: formulas.map((formulaItem) => ({
                        label: formulaItem.label,
                        onMenuSelect: () => insertFormula(formulaItem.latex) // Вставляем выбранную формулу как LaTeX
                    }))
                },
                {
                    type: 'divider' // Разделитель
                },
                {
                    label: 'Копировать', // Новый пункт "Копировать"
                    onMenuSelect: copyContent // Копируем содержимое при выборе
                },
                {
                    type: 'divider' // Разделитель
                },
                {
                    label: 'Вставить', // Новый пункт "Вставить"
                    onMenuSelect: pasteContent // Вставляем скопированное содержимое
                },
            ];

            const handleInput = () => {
                const newLatex = mathField.value;
                onLatexChange(newLatex); // Уведомляем App
            };

            mathField.addEventListener('input', handleInput);

            return () => {
                mathField.removeEventListener('input', handleInput);
                mathField.removeEventListener('contextmenu', handleContextMenu);
            };
        }
    }, [latexCode, onLatexChange, copiedContent]);

    return (
        <div className="preview-container">
            <math-field ref={mathFieldRef}>
                {latexCode}
            </math-field>
        </div>
    );
}

export default Preview;
