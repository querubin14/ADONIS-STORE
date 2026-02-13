
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StockRoutes from './components/routes/StockRoutes';
import WebRoutes from './components/routes/WebRoutes';
import CartDrawer from './components/CartDrawer';
import { ShopProvider, useShop } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import SEO from './components/SEO';
import LoadingScreen from './components/LoadingScreen';
import WhatsAppButton from './components/WhatsAppButton';

const MainContent: React.FC = () => {
  const { loading } = useShop();
  const isStockApp = import.meta.env.VITE_APP_MODE === 'admin';

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <SEO />
      {/* Only show CartDrawer on Web App, not Stock App, unless requested otherwise. Keeping it separate is cleaner. */}
      {!isStockApp && (
        <>
          <CartDrawer />
          <WhatsAppButton />
        </>
      )}

      {isStockApp ? (
        <StockRoutes />
      ) : (
        <WebRoutes />
      )}
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <MainContent />
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;


