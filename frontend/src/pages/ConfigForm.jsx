import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

function ConfigForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    topic: '',
    knowledgeLevel: 'Iniciante',
    dailyHours: 1,
    deadline: '',
    sources: [],
  });
  const [loading, setLoading] = useState(false);

  const sourceOptions = ['GitHub', 'Medium', 'YouTube', 'Artigos', 'Documentação Oficial'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSource = (source) => {
    setForm((prev) => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter((s) => s !== source)
        : [...prev.sources, source],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erro ao enviar config:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">⚙️ Configurar Aprendizado</h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tópico</label>
          <input
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="Ex: Python, Machine Learning..."
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível de Conhecimento</label>
          <select
            name="knowledgeLevel"
            value={form.knowledgeLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horas por dia</label>
          <input
            name="dailyHours"
            type="number"
            min="1"
            max="12"
            value={form.dailyHours}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prazo final</label>
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fontes de estudo</label>
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => toggleSource(src)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  form.sources.includes(src)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-glow w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar e Continuar'}
        </button>
      </form>
    </div>
  );
}

export default ConfigForm;
