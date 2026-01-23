
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import ProductDetail from '../../pages/ProductDetail';
import CategoryPage from '../../pages/CategoryPage';
import BlogPage from '../../pages/BlogPage';

import ShippingPolicy from '../../pages/ShippingPolicy';
import ExchangePolicy from '../../pages/ExchangePolicy';
import PaymentMethods from '../../pages/PaymentMethods';
import Contact from '../../pages/Contact';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import TermsOfUse from '../../pages/TermsOfUse';
import CareGuide from '../../pages/CareGuide';

import AdminDashboard from '../../pages/Admin';

import Login from '../../pages/Login';
import ProtectedRoute from '../ProtectedRoute';

const WebRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/exchange-policy" element={<ExchangePolicy />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/care-guide" element={<CareGuide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
};

export default WebRoutes;
