import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const API_URL = 'http://localhost:8000/api';

function Dashboard() {
  const { role } = useUser();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [finops, setFinops] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchPromises = [
          fetch(`${API_URL}/mock/user`),
          fetch(`${API_URL}/mock/progress`),
          fetch(`${API_URL}/mock/lesson`),
        ];
        
        if (role === 'admin') {
          fetchPromises.push(fetch(`${API_URL}/mock/finops`));
        }

        const responses = await Promise.all(fetchPromises);
        
        setUser(await responses[0].json());
        setProgress(await responses[1].json());
        setLesson(await responses[2].json());
        
        if (role === 'admin' && responses[3]) {
          setFinops(await responses[3].json());
        }
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // --- VISÃO DO ADMIN ---
  if (role === 'admin') {
    return (
      <div className="page-enter mt-6 space-y-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">🖥️ Dashboard do Sistema</h2>
        
        {finops && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-700">Métricas Operacionais</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 border-t-4 border-indigo-500 rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total de Alunos</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{finops.total_students}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border-t-4 border-emerald-500 rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Aproveitamento Global</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{finops.global_performance}%</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border-t-4 border-blue-500 rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Custo Total Acumulado</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">${finops.session_cost.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border-t-4 border-purple-500 rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tokens Processados</p>
                <div className="mt-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                  <p>{finops.tokens_input.toLocaleString()} <span className="text-xs text-gray-500 font-normal">Input</span></p>
                  <p>{finops.tokens_output.toLocaleString()} <span className="text-xs text-gray-500 font-normal">Output</span></p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 pt-4 dark:border-gray-700">Origem das Informações (Mais Acessadas)</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
               <div className="space-y-4">
                 {finops.top_sources.map((src, idx) => (
                   <div key={idx} className="flex items-center">
                     <span className="w-48 text-sm font-medium text-gray-700 dark:text-gray-300">{src.name}</span>
                     <div className="flex-1 ml-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                       <div className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2 rounded-full" style={{ width: `${src.percentage}%` }}></div>
                     </div>
                     <span className="ml-4 text-sm text-gray-500 w-10 text-right">{src.percentage}%</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- VISÃO DO ALUNO ---
  return (
    <div className="page-enter mt-6 space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Saudação */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold">👋 Olá, {user?.name || 'Estudante'}!</h2>
        <p className="text-blue-100 mt-1">Nível: {user?.knowledge_level} · {user?.daily_hours}h/dia</p>
      </div>

      {/* Cards de progresso */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-hover bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md text-center">
          <p className="text-3xl font-bold text-blue-600">{progress?.completed_lessons || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aulas concluídas</p>
        </div>
        <div className="card-hover bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md text-center">
          <p className="text-3xl font-bold text-green-500">{progress?.percentual_acertos_global || 0}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aproveitamento</p>
        </div>
        <div className="card-hover bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md text-center">
          <p className="text-3xl font-bold text-yellow-500">{progress?.badges?.length || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Badges</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Progresso Geral</span>
          <span className="text-gray-500">
            {progress?.completed_lessons}/{progress?.total_lessons} aulas
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="progress-fill bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
            style={{ width: `${((progress?.completed_lessons || 0) / (progress?.total_lessons || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Próxima aula */}
      {lesson && (
        <div className="card-hover bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">📖 Próxima Aula</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{lesson.title} — {lesson.content}</p>
          <div className="flex gap-3">
            <Link
              to={`/lesson/${lesson.id}`}
              className="btn-glow px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Iniciar Aula
            </Link>
            <Link
              to={`/quiz/${lesson.id}`}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Fazer Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
