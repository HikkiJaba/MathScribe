from sympy import sympify
import numpy as np
from scipy.spatial.distance import cosine
import matplotlib.pyplot as plt
import re

# Пример сравнения по символам
def compare_by_symbols(formula1, formula2):
    try:
        # Преобразуем формулы в символьные выражения с помощью sympy
        expr1 = sympify(formula1)
        expr2 = sympify(formula2)
        
        # Сравниваем их на уровне символов
        symbols1 = set(str(expr1.free_symbols))
        symbols2 = set(str(expr2.free_symbols))

        # Процент совпадения
        common_symbols = symbols1.intersection(symbols2)
        match_percentage = (len(common_symbols) / max(len(symbols1), len(symbols2))) * 100

        return {
            "match_percentage": match_percentage,
            "symbols": list(common_symbols)
        }
    except Exception as e:
        raise ValueError(f"Ошибка при сравнении по символам: {str(e)}")

# Пример сравнения по стилю (не совсем точный, просто для демонстрации)
def extract_structure(formula):
    """
    Извлекает структуру формулы: тип операции и количество операндов.
    """
    try:
        expr = sympify(formula)  # Парсим формулу
        if isinstance(expr, Add):  # Сложение
            return {"operation": "add", "operands": len(expr.args)}
        elif isinstance(expr, Mul):  # Умножение
            return {"operation": "multiply", "operands": len(expr.args)}
        elif isinstance(expr, Pow):  # Возведение в степень
            return {"operation": "power", "operands": len(expr.args)}
        else:
            return {"operation": "unknown", "operands": 0}  # Для других операций
    except Exception as e:
        return {"operation": "error", "operands": 0}

def compare_style(formula1, formula2):
    """
    Сравнивает формулы по стилю (структуре операций).
    """
    structure1 = extract_structure(formula1)
    structure2 = extract_structure(formula2)

    # Если одна из формул вызвала ошибку, совпадение — 0%.
    if structure1["operation"] == "error" or structure2["operation"] == "error":
        return {
            "match_percentage": 0,
            "structure1": structure1,
            "structure2": structure2,
            "matched_characters": 0,
            "total_characters": max(len(formula1), len(formula2))
        }

    # Если структуры совпадают, добавляем 100% совпадения
    match_percentage = 100 if structure1 == structure2 else 0

    # Подсчёт совпавших символов для более детального вывода
    matched_characters = sum(1 for a, b in zip(formula1, formula2) if a == b)

    return {
        "match_percentage": match_percentage,
        "structure1": structure1,
        "structure2": structure2,
        "matched_characters": matched_characters,
        "total_characters": max(len(formula1), len(formula2))
    }




# Пример сравнения по графу
def compare_by_graph(formula1, formula2):
    # Для графа можно использовать, например, библиотеку matplotlib для построения графиков
    fig, axs = plt.subplots(1, 2, figsize=(10, 5))

    # Здесь для демонстрации просто рисуем пустые графики
    axs[0].plot(np.random.randn(10))
    axs[1].plot(np.random.randn(10))

    plt.savefig('comparison_graph.png')  # Сохраняем график в файл

    return {
        "match_percentage": 80,  # Пример значения для демонстрации
        "graph_data": [
            {"x": i, "y": np.random.randn()} for i in range(10)
        ]
    }

# Пример сравнения по максимальной общей подстроке (LCS)
def compare_by_lcs(formula1, formula2):
    # В этом примере просто вычисляем длину LCS для строк
    def lcs(str1, str2):
        m = len(str1)
        n = len(str2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if str1[i - 1] == str2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]

    lcs_length = lcs(formula1, formula2)

    return {
        "match_percentage": (lcs_length / max(len(formula1), len(formula2))) * 100,
        "lcs_length": lcs_length
    }

# Пример сравнения по контексту
def compare_by_context(formula1, formula2):
    # Для демонстрации просто проверим, совпадают ли строки полностью
    return {
        "match_percentage": 100 if formula1 == formula2 else 0,
        "context_comparison": f"Formulas {'match' if formula1 == formula2 else 'do not match'}"
    }

# Пример сравнения по фрагментам
def compare_by_fragments(formula1, formula2):
    # Для фрагментов можно использовать N-граммы или другие методы
    fragments1 = {formula1[i:i+3] for i in range(len(formula1) - 2)}
    fragments2 = {formula2[i:i+3] for i in range(len(formula2) - 2)}
    
    common_fragments = fragments1.intersection(fragments2)
    match_percentage = (len(common_fragments) / max(len(fragments1), len(fragments2))) * 100

    return {
        "match_percentage": match_percentage,
        "fragments": list(common_fragments)
    }
