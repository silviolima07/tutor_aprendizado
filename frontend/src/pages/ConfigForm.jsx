import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

const SOURCE_OPTIONS = [
  { id: 'YouTube',    icon: '▶️', label: 'YouTube',              color: 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' },
  { id: 'Medium',     icon: '✍️', label: 'Medium',               color: 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
  { id: 'GitHub',     icon: '🐙', label: 'GitHub',               color: 'border-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { id: 'Artigos',    icon: '📄', label: 'Artigos Acadêmicos',   color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' },
  { id: 'Docs',       icon: '📖', label: 'Documentação Oficial', color: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
];

// Mensagens rotativas exibidas durante a busca da IA
const LOADING_MESSAGES = [
  '🔍 Pesquisando em 43 repositórios do GitHub...',
  '📰 Lendo 12 artigos do Medium sobre o tema...',
  '▶️ Analisando vídeos do YouTube mais relevantes...',
  '🤖 Agente de IA organizando os conteúdos...',
  '📚 Gerando ementa personalizada para você...',
  '✅ Quase pronto! Finalizando a curadoria...',
];

// Ementa gerada simulada pela IA
const GENERATED_CURRICULUM = [
  { module: 'Módulo 1', title: 'Fundamentos e Conceitos Base',        lessons: 3, source: 'YouTube + Docs' },
  { module: 'Módulo 2', title: 'Prática Guiada com Exemplos Reais',   lessons: 4, source: 'GitHub + Medium' },
  { module: 'Módulo 3', title: 'Técnicas Avançadas e Boas Práticas',  lessons: 3, source: 'Artigos + Docs' },
  { module: 'Módulo 4', title: 'Projeto Final Integrador',            lessons: 2, source: 'GitHub' },
];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < current
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
              : i === current
              ? 'bg-blue-500 text-white ring-4 ring-blue-300/50'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-12 transition-all duration-500 ${i < current ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Etapa 1: O que aprender e fontes ──────────────────────────────────────────
function Step1({ form, setForm, onNext }) {
  const toggleSource = (id) => {
    setForm(prev => ({
      ...prev,
      sources: prev.sources.includes(id)
        ? prev.sources.filter(s => s !== id)
        : [...prev.sources, id],
    }));
  };

  const isValid = form.topic.trim().length > 2 && form.sources.length > 0;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center mb-6">
        <span className="text-5xl">🎯</span>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-3">O que você quer aprender?</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Nossa IA vai montar um plano de estudos personalizado para você.</p>
      </div>

      {/* Campo do tópico */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tema de estudo</label>
        <input
          id="config-topic"
          value={form.topic}
          onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))}
          placeholder="Ex: Inteligência Artificial Generativa, Python, React..."
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all text-base"
        />
      </div>

      {/* Nível de conhecimento */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Seu nível atual</label>
        <div className="grid grid-cols-3 gap-3">
          {['Iniciante', 'Intermediário', 'Avançado'].map(level => (
            <button
              key={level}
              type="button"
              id={`level-${level.toLowerCase()}`}
              onClick={() => setForm(prev => ({ ...prev, knowledgeLevel: level }))}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                form.knowledgeLevel === level
                  ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300'
              }`}
            >
              {level === 'Iniciante' ? '🌱 ' : level === 'Intermediário' ? '🌿 ' : '🌳 '}{level}
            </button>
          ))}
        </div>
      </div>

      {/* Fontes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Onde devemos pesquisar? <span className="text-blue-500">(escolha ao menos uma)</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SOURCE_OPTIONS.map(src => {
            const selected = form.sources.includes(src.id);
            return (
              <button
                key={src.id}
                type="button"
                id={`source-${src.id.toLowerCase()}`}
                onClick={() => toggleSource(src.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  selected
                    ? `${src.color} border-current shadow-sm`
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{src.icon}</span>
                <span>{src.label}</span>
                {selected && <span className="ml-auto text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button
        id="btn-next-step1"
        type="button"
        disabled={!isValid}
        onClick={onNext}
        className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none mt-2"
      >
        Buscar conteúdo com IA →
      </button>
    </div>
  );
}

// ── Tela de Loading (Interlúdio) ──────────────────────────────────────────────
function StepLoading({ topic, sources }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Spinner animado */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-t-indigo-400 border-transparent animate-spin animate-[spin_0.8s_linear_infinite_reverse]" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Agente IA trabalhando...</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">Tema: <span className="italic">{topic}</span></p>
      </div>

      <div className="bg-gray-900 dark:bg-gray-950 text-green-400 font-mono text-sm rounded-xl p-4 w-full min-h-[80px] flex items-center">
        <span className="animate-pulse mr-2 text-green-300">▶</span>
        <span className="transition-all">{LOADING_MESSAGES[msgIndex]}</span>
      </div>

      {/* Mostra APENAS as fontes que o usuário selecionou */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sources.length > 0
          ? sources.map(s => {
              const src = SOURCE_OPTIONS.find(o => o.id === s);
              return (
                <span key={s} className={`px-3 py-1 rounded-full text-xs font-semibold border ${src?.color || 'border-gray-300 text-gray-500'}`}>
                  {src?.icon} {s}
                </span>
              );
            })
          : <span className="text-xs text-gray-400">Buscando em todas as fontes...</span>
        }
      </div>
    </div>
  );
}

// ── Etapa 2: Ementa gerada ────────────────────────────────────────────────────
function Step2({ topic, onNext, onBack }) {
  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center">
        <span className="text-5xl">✨</span>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-3">Ementa Gerada pela IA</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Encontramos <strong className="text-blue-600">12 aulas</strong> em <strong className="text-blue-600">4 módulos</strong> sobre <em>"{topic}"</em>
        </p>
      </div>

      <div className="space-y-3">
        {GENERATED_CURRICULUM.map((mod, i) => (
          <div key={i} className="flex items-start gap-4 bg-white dark:bg-gray-700/60 rounded-xl p-4 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wide">{mod.module}</p>
              <p className="font-semibold text-gray-800 dark:text-white text-sm mt-0.5">{mod.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">📚 {mod.lessons} aulas · 🔗 {mod.source}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
        💡 <strong>40 publicações</strong> do Reddit (r/MachineLearning) e <strong>15 artigos</strong> do Medium foram consultados para montar essa ementa.
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          Voltar
        </button>
        <button
          id="btn-next-step2"
          type="button"
          onClick={onNext}
          className="w-2/3 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
        >
          Gostei! Definir meu prazo →
        </button>
      </div>
    </div>
  );
}

// ── Etapa 3: Deadline ─────────────────────────────────────────────────────────
function Step3({ form, setForm, onSubmit, loading, onBack }) {
  const today = new Date().toISOString().split('T')[0];
  const isValid = !!form.deadline;

  const calcDays = () => {
    if (!form.deadline) return null;
    const diff = Math.ceil((new Date(form.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };
  const days = calcDays();

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center">
        <span className="text-5xl">📅</span>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-3">Defina sua Data Final</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Quando você quer concluir todos os <strong>12 módulos</strong>?</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Horas de estudo por dia</label>
        <div className="flex items-center gap-4">
          <input
            id="config-daily-hours"
            type="range"
            min="1"
            max="8"
            value={form.dailyHours}
            onChange={e => setForm(prev => ({ ...prev, dailyHours: Number(e.target.value) }))}
            className="flex-1 accent-blue-500"
          />
          <span className="w-16 text-center font-bold text-blue-600 dark:text-blue-400 text-lg">{form.dailyHours}h/dia</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Data final de conclusão</label>
        <input
          id="config-deadline"
          type="date"
          min={today}
          value={form.deadline}
          onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all"
        />
      </div>

      {days !== null && days > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-center shadow-lg shadow-blue-500/30">
          <p className="text-3xl font-extrabold">{days} dias</p>
          <p className="text-blue-100 text-sm mt-1">para concluir · {form.dailyHours}h por dia · estimativa de {Math.round(days * form.dailyHours / 12)} horas por módulo</p>
        </div>
      )}

      {days !== null && days <= 0 && (
        <p className="text-red-500 text-sm text-center">⚠️ Escolha uma data futura.</p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={onBack}
          className="w-1/3 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-40"
        >
          Voltar
        </button>
        <button
          id="btn-start-learning"
          type="button"
          disabled={!isValid || (days !== null && days <= 0) || loading}
          onClick={onSubmit}
          className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Salvando plano...' : '🚀 Começar a estudar!'}
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function ConfigForm() {
  const navigate = useNavigate();
  // 0=step1, 1=loading, 2=step2(ementa), 3=step3(deadline)
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    topic: '',
    knowledgeLevel: 'Iniciante',
    dailyHours: 2,
    deadline: '',
    sources: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const goToLoading = () => {
    setStep(1);
    // Simula tempo de busca da IA (4 segundos) e vai para a ementa
    setTimeout(() => setStep(2), 4000);
  };

  // POC: salva localmente sem precisar do backend.
  // Na Etapa 2, esta função acionará agentes reais de busca.
  const handleSubmit = () => {
    setSubmitting(true);
    // Simula brevemente o salvamento (feedback visual)
    setTimeout(() => {
      localStorage.setItem('studentConfig', JSON.stringify({
        ...form,
        curriculum: GENERATED_CURRICULUM,
        configuredAt: new Date().toISOString(),
      }));
      navigate('/dashboard');
    }, 600);
  };

  const stepLabels = ['Intenção', 'IA buscando', 'Ementa', 'Prazo'];

  return (
    <div className="page-enter max-w-xl mx-auto mt-8 pb-20 px-4">
      <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2 text-center">
        ⚙️ Configurar Aprendizado
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Nossa IA vai pesquisar nas melhores fontes e montar um plano só para você.
      </p>

      {/* Indicador de etapas (exclui a tela de loading do indicador) */}
      {step !== 1 && (
        <StepIndicator current={step > 1 ? step - 1 : step} total={3} />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        {step === 0 && <Step1 form={form} setForm={setForm} onNext={goToLoading} />}
        {step === 1 && <StepLoading topic={form.topic} sources={form.sources} />}
        {step === 2 && <Step2 topic={form.topic} onNext={() => setStep(3)} onBack={() => setStep(0)} />}
        {step === 3 && <Step3 form={form} setForm={setForm} onSubmit={handleSubmit} loading={submitting} onBack={() => setStep(2)} />}
      </div>
    </div>
  );
}

export default ConfigForm;
