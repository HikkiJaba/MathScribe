import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import './App.css';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;