import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Layouts/Home'; 



const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />

    </Routes>
  </main>
);

export default Main;
