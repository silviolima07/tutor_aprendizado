import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao carregar métricas.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-xl">Carregando painel FinOps...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Admin Dashboard (FinOps)
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Gastos Totais (Estimado)</h2>
          <p className="text-4xl font-bold text-green-500 mt-2">
            ${metrics?.total_cost?.toFixed(4)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-gray-500 text-sm font-semibold uppercase">Tokens Processados</h2>
          <p className="text-4xl font-bold text-blue-500 mt-2">
            {metrics?.total_tokens?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uso por Usuário */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Custos por Usuário</h3>
          {metrics?.users?.length > 0 ? (
            <div className="space-y-4">
              {metrics.users.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {user.user_name}
                  </span>
                  <div className="text-right">
                    <p className="text-green-500 font-bold">${user.cost?.toFixed(4)}</p>
                    <p className="text-sm text-gray-500">{user.tokens?.toLocaleString()} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum dado registrado ainda.</p>
          )}
        </div>

        {/* Uso por Modelo */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Uso por Modelo</h3>
          {metrics?.models?.length > 0 ? (
            <div className="space-y-4">
              {metrics.models.map((model, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {model.model}
                  </span>
                  <div className="text-right">
                    <p className="text-green-500 font-bold">${model.cost?.toFixed(4)}</p>
                    <p className="text-sm text-gray-500">{model.tokens?.toLocaleString()} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum dado registrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
