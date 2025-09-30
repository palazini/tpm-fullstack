// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import LoginPage from './components/LoginPage.jsx';
import MainLayout from './components/MainLayout.jsx';
import InicioTurnoPage from './pages/InicioTurnoPage.jsx';

const AUTH_EVENT = 'auth-user-changed';

function readStoredUser() {
  try { return JSON.parse(localStorage.getItem('usuario') || 'null'); }
  catch { return null; }
}

export default function App() {
  const [user, setUser] = useState(() => readStoredUser());
  const location = useLocation();

  // 🔁 Recarrega o user a cada mudança de rota (inclui pós-login via navigate)
  useEffect(() => {
    setUser(readStoredUser());
  }, [location.key]);

  // 🔔 Reage imediatamente a login/logout na MESMA aba (evento customizado)
  useEffect(() => {
    const onAuth = () => setUser(readStoredUser());
    window.addEventListener(AUTH_EVENT, onAuth);
    return () => window.removeEventListener(AUTH_EVENT, onAuth);
  }, []);

  // Multi-aba: se outra aba fizer login/logout (aqui o 'storage' funciona)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'usuario') setUser(readStoredUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const role = (user?.role || '').trim().toLowerCase();

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" />
      <Routes>
        {!user && <Route path="/*" element={<LoginPage />} />}

        {user && role === 'operador' && (
          <>
            {/* Wizard fora do layout */}
            <Route path="/inicio-turno" element={<InicioTurnoPage user={user} />} />
            {/* App “normal” com sidebar etc. */}
            <Route path="/*" element={<MainLayout user={user} />} />
          </>
        )}

        {user && role !== 'operador' && (
          <Route path="/*" element={<MainLayout user={user} />} />
        )}
      </Routes>
    </DndProvider>
  );
}
