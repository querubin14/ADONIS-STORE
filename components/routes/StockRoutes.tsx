
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../../pages/Admin';

const StockRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};

export default StockRoutes;
