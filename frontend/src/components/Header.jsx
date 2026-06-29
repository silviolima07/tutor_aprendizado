import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Header() {
  const { role, setRole } = useUser();
  const [isDark, setIsDark] = useState(() => {
    // Check initial preference from localStorage or system
    if (localStorage.getItem('theme') === 'dark' || 
       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold tracking-tight group-hover:text-blue-200 transition-colors">
            Tutor de Aprendizado
          </h1>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-4 text-sm font-medium">
            <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
            <Link to="/progress" className="hover:text-blue-200 transition-colors">Progresso</Link>
            <Link to="/config" className="hover:text-blue-200 transition-colors">Configurar</Link>
          </nav>
          
          <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2">
            <span className="text-xs text-blue-200">Logado como:</span>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-blue-800/50 border border-blue-400 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="student">Aluno</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-white/20 transition-colors ml-2"
            title="Alternar Tema"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
