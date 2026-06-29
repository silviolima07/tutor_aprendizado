import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="mb-8">
        <span className="text-6xl mb-4 block">🚀</span>
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
          Bem-vindo ao Tutor de Aprendizado
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Um assistente inteligente que personaliza seu aprendizado com IA Generativa.
          Configure suas preferências e comece a aprender agora!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/config"
          className="btn-glow px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Começar Agora
        </Link>
        <Link
          to="/dashboard"
          className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
        >
          Ver Dashboard
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          { icon: '🎯', title: 'Personalizado', desc: 'Trilha adaptada ao seu nível e ritmo.' },
          { icon: '📊', title: 'Acompanhamento', desc: 'Progresso em tempo real com métricas.' },
          { icon: '🏆', title: 'Gamificação', desc: 'Badges e conquistas para motivar.' },
        ].map((item, i) => (
          <div key={i} className="card-hover bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <span className="text-3xl mb-2 block">{item.icon}</span>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
