from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import difflib
from comparison_methods import compare_style, compare_by_graph, compare_by_lcs, compare_by_context, compare_by_fragments
from sympy import sympify, Add, Mul, Pow
from sympy.parsing.latex import parse_latex
from collections import Counter
import os
import asyncio
import json
import html



app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Layer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    data = db.Column(db.Text, nullable=False)

    user = db.relationship('User', backref='layers')

with app.app_context():
    db.create_all()

def create_default_layers(user_id):
    default_layers = [
        Layer(name="Layer 1", data="", user_id=user_id),
        Layer(name="Layer 2", data="", user_id=user_id),
        Layer(name="Layer 3", data="", user_id=user_id),
    ]
    db.session.add_all(default_layers)
    db.session.commit()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Имя пользователя и пароль обязательны"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"msg": "Пользователь с таким именем уже существует"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    create_default_layers(new_user.id)

    return jsonify({"msg": "Регистрация прошла успешно"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Неверное имя пользователя или пароль"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200







def longest_common_substring(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    lcs_length = 0
    lcs_end = 0

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > lcs_length:
                    lcs_length = dp[i][j]
                    lcs_end = i
            else:
                dp[i][j] = 0

    # Извлекаем подстроку
    lcs = s1[lcs_end - lcs_length: lcs_end]
    return lcs, lcs_length


@app.route('/compare', methods=['POST'])
def compare():
    data = request.json
    formula1 = data['formula1']
    formula2 = data['formula2']
    comparison_method = data['comparisonMethod']
    
    if comparison_method == 'symbol':
        symbols1 = set(formula1)
        symbols2 = set(formula2) 
        common_symbols = symbols1.intersection(symbols2) 
        
        match_percentage = (len(common_symbols) / len(symbols1)) * 100 
        result = {
            'match_percentage': match_percentage,
            'symbols': list(common_symbols)  
        }
        
        return jsonify(result)

    elif comparison_method == 'lcs':
        lcs, lcs_length = longest_common_substring(formula1, formula2)
        match_percentage = (lcs_length / max(len(formula1), len(formula2))) * 100
        result = {
            'match_percentage': match_percentage,
            'lcs': lcs
        }
        return jsonify(result)

    elif comparison_method == 'graph':
        try:
            # Преобразуем LaTeX строки в выражения sympy
            expr1 = parse_latex(formula1)
            expr2 = parse_latex(formula2)
            
            # Функция для извлечения графа выражения
            def extract_graph(expr):
                if isinstance(expr, (Add, Mul, Pow)):
                    return {str(expr), *[str(arg) for arg in expr.args]}
                return {str(expr)}  # Для чисел и простых объектов

            nodes1 = extract_graph(expr1)
            nodes2 = extract_graph(expr2)

            common_nodes = nodes1.intersection(nodes2)
            
            # Подсчитаем количество символов в выражениях
            def count_symbols(expr):
                # Преобразуем выражение в строку и подсчитываем частоту символов
                expr_str = str(expr)
                return Counter(expr_str)

            symbols1 = count_symbols(expr1)
            symbols2 = count_symbols(expr2)
            
            # Считаем совпавшие символы и их количество
            common_symbols = symbols1 & symbols2  # Пересечение счетчиков (общие символы)
            
            match_percentage = (len(common_nodes) / max(len(nodes1), len(nodes2))) * 100
            
            result = {
                'match_percentage': match_percentage,
                'graph_data': list(common_nodes),
                'common_symbols': dict(common_symbols),  # Словарь с совпавшими символами и их количеством
                'symbols1_count': dict(symbols1),  # Количество символов в формуле 1
                'symbols2_count': dict(symbols2)   # Количество символов в формуле 2
            }
        except Exception as e:
            result = {
                'match_percentage': 0,
                'error': str(e)
            }
        return jsonify(result)

    return jsonify({'error': 'Invalid comparison method'})

# Загружаем данные из файла
def load_formulas():
    with open('txt.txt', 'r', encoding='utf-8') as file:
        return json.load(file)

@app.route('/api/search', methods=['GET'])
def search_formulas():
    query = request.args.get('query', '').lower()  # Получаем поисковый запрос

    if not query:
        return jsonify([])  # Если запрос пустой, возвращаем пустой список

    formulas = load_formulas()
    results = []

    # Ищем формулы по ключевым словам или по тексту объяснений
    for formula in formulas:
        # Проверяем, содержится ли запрос в ключевых словах или объяснении
        if any(keyword.lower() in query for keyword in formula['keywords']) or query in formula['explanation'].lower():
            results.append(formula)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
