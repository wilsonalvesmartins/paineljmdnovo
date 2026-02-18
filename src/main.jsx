import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar as CalendarIcon, 
  FileText, 
  Search, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  Briefcase, 
  MapPin, 
  Gavel, 
  Printer, 
  Calculator,
  ArrowLeft,
  X,
  Lock,
  User,
  MoreHorizontal,
  Video,
  Edit2,
  Trash2,
  Save,
  CalendarDays
} from 'lucide-react';

/**
 * JMD PROCESSOS TRABALHISTAS
 * Sistema de Gestão Jurídica Inteligente - Versão 3.3 (Consolidated & Clean Data)
 */

// --- DADOS DE CONFIGURAÇÃO (TRTs) ---
const TRT_REGIONS = [
  { region: '1ª Região', trt: 'TRT-1', states: ['RJ'], name: 'Rio de Janeiro' },
  { region: '2ª Região', trt: 'TRT-2', states: ['SP'], name: 'SP - Capital/Litoral (Grande SP/Baixada)' },
  { region: '3ª Região', trt: 'TRT-3', states: ['MG'], name: 'Minas Gerais' },
  { region: '4ª Região', trt: 'TRT-4', states: ['RS'], name: 'Rio Grande do Sul' },
  { region: '5ª Região', trt: 'TRT-5', states: ['BA'], name: 'Bahia' },
  { region: '6ª Região', trt: 'TRT-6', states: ['PE'], name: 'Pernambuco' },
  { region: '7ª Região', trt: 'TRT-7', states: ['CE'], name: 'Ceará' },
  { region: '8ª Região', trt: 'TRT-8', states: ['PA', 'AP'], name: 'Pará e Amapá' },
  { region: '9ª Região', trt: 'TRT-9', states: ['PR'], name: 'Paraná' },
  { region: '10ª Região', trt: 'TRT-10', states: ['DF', 'TO'], name: 'Distrito Federal e Tocantins' },
  { region: '11ª Região', trt: 'TRT-11', states: ['AM', 'RR'], name: 'Amazonas e Roraima' },
  { region: '12ª Região', trt: 'TRT-12', states: ['SC'], name: 'Santa Catarina' },
  { region: '13ª Região', trt: 'TRT-13', states: ['PB'], name: 'Paraíba' },
  { region: '14ª Região', trt: 'TRT-14', states: ['RO', 'AC'], name: 'Rondônia e Acre' },
  { region: '15ª Região', trt: 'TRT-15', states: ['SP'], name: 'SP - Interior (Campinas e região)' },
  { region: '16ª Região', trt: 'TRT-16', states: ['MA'], name: 'Maranhão' },
  { region: '17ª Região', trt: 'TRT-17', states: ['ES'], name: 'Espírito Santo' },
  { region: '18ª Região', trt: 'TRT-18', states: ['GO'], name: 'Goiás' },
  { region: '19ª Região', trt: 'TRT-19', states: ['AL'], name: 'Alagoas' },
  { region: '20ª Região', trt: 'TRT-20', states: ['SE'], name: 'Sergipe' },
  { region: '21ª Região', trt: 'TRT-21', states: ['RN'], name: 'Rio Grande do Norte' },
  { region: '22ª Região', trt: 'TRT-22', states: ['PI'], name: 'Piauí' },
  { region: '23ª Região', trt: 'TRT-23', states: ['MT'], name: 'Mato Grosso' },
  { region: '24ª Região', trt: 'TRT-24', states: ['MS'], name: 'Mato Grosso do Sul' },
];

const UF_LIST = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// --- DADOS INICIAIS LIMPOS (Para produção) ---
const INITIAL_DATA = [];

// --- UTILITÁRIOS ---

const formatDate = (dateString) => {
  if (!dateString) return '-';
  if (dateString.includes('T')) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
  } else {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  }
};

const maskCNJ = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{7})(\d)/, '$1-$2')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{4})(\d)/, '$1.$2')
    .replace(/(\d{1})(\d)/, '$1.$2')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(.\d{4})\d+?$/, '$1');
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Ativo': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Arquivado': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Suspenso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Recurso': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Execução': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// --- COMPONENTES ---

const LoginView = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === 'administrador' && pass === '36672456') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-xl mx-auto flex items-center justify-center mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">JMD Processos Trabalhistas</h1>
          <p className="text-slate-500">Acesso Restrito</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded flex items-center gap-2">
              <AlertTriangle size={16} /> Credenciais inválidas.
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

const BrazilMap = ({ processes, onStateClick }) => {
  const [hoveredState, setHoveredState] = useState(null);

  const stats = useMemo(() => {
    const data = {};
    processes.forEach(p => {
      if (!data[p.uf]) data[p.uf] = { total: 0, trt2: 0, trt15: 0, active: 0 };
      data[p.uf].total++;
      if (p.status === 'Ativo') data[p.uf].active++;
      if (p.uf === 'SP') {
        if (p.trt === 'TRT-2') data[p.uf].trt2++;
        if (p.trt === 'TRT-15') data[p.uf].trt15++;
      }
    });
    return data;
  }, [processes]);

  const getStateColor = (uf) => {
    const count = stats[uf]?.total || 0;
    if (count === 0) return '#e5e7eb';
    if (count < 2) return '#93c5fd';
    if (count < 5) return '#3b82f6';
    return '#1e40af';
  };

  const states = [
    { id: 'RR', name: 'Roraima', x: 100, y: 30, r: 15 },
    { id: 'AP', name: 'Amapá', x: 180, y: 40, r: 12 },
    { id: 'AM', name: 'Amazonas', x: 70, y: 80, r: 35 },
    { id: 'PA', name: 'Pará', x: 160, y: 90, r: 30 },
    { id: 'AC', name: 'Acre', x: 30, y: 130, r: 12 },
    { id: 'RO', name: 'Rondônia', x: 75, y: 150, r: 15 },
    { id: 'TO', name: 'Tocantins', x: 190, y: 140, r: 15 },
    { id: 'MA', name: 'Maranhão', x: 215, y: 80, r: 15 },
    { id: 'PI', name: 'Piauí', x: 235, y: 95, r: 14 },
    { id: 'CE', name: 'Ceará', x: 260, y: 75, r: 12 },
    { id: 'RN', name: 'Rio G. Norte', x: 285, y: 85, r: 10 },
    { id: 'PB', name: 'Paraíba', x: 285, y: 100, r: 9 },
    { id: 'PE', name: 'Pernambuco', x: 280, y: 115, r: 10 },
    { id: 'AL', name: 'Alagoas', x: 285, y: 130, r: 8 },
    { id: 'SE', name: 'Sergipe', x: 275, y: 140, r: 8 },
    { id: 'BA', name: 'Bahia', x: 240, y: 160, r: 25 },
    { id: 'MT', name: 'Mato Grosso', x: 120, y: 190, r: 25 },
    { id: 'GO', name: 'Goiás', x: 180, y: 200, r: 18 },
    { id: 'DF', name: 'Distrito Federal', x: 195, y: 195, r: 6 },
    { id: 'MS', name: 'Mato G. Sul', x: 130, y: 250, r: 20 },
    { id: 'MG', name: 'Minas Gerais', x: 220, y: 230, r: 22 },
    { id: 'ES', name: 'Espírito Santo', x: 255, y: 235, r: 10 },
    { id: 'RJ', name: 'Rio de Janeiro', x: 240, y: 265, r: 10 },
    { id: 'SP', name: 'São Paulo', x: 190, y: 280, r: 20 },
    { id: 'PR', name: 'Paraná', x: 170, y: 310, r: 15 },
    { id: 'SC', name: 'Santa Catarina', x: 180, y: 335, r: 12 },
    { id: 'RS', name: 'Rio G. Sul', x: 160, y: 365, r: 18 },
  ];

  return (
    <div className="relative w-full h-96 bg-slate-50 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 320 400" className="w-full h-full max-w-lg drop-shadow-lg">
        {states.map((state) => (
          <g 
            key={state.id}
            onClick={() => onStateClick(state.id)}
            onMouseEnter={() => setHoveredState(state)}
            onMouseLeave={() => setHoveredState(null)}
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
          >
            <circle 
              cx={state.x} 
              cy={state.y} 
              r={state.r} 
              fill={getStateColor(state.id)} 
              stroke="white" 
              strokeWidth="2"
            />
            <text x={state.x} y={state.y} dy=".3em" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">
              {state.id}
            </text>
          </g>
        ))}
      </svg>
      {hoveredState && (
        <div 
          className="absolute z-50 bg-slate-800 text-white text-sm rounded-lg p-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ top: hoveredState.y - 10, left: hoveredState.x + 40 }}
        >
          <div className="font-bold border-b border-slate-600 pb-1 mb-1 whitespace-nowrap">{hoveredState.name}</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span>Total Processos:</span>
              <span className="font-bold">{stats[hoveredState.id]?.total || 0}</span>
            </div>
            {hoveredState.id === 'SP' && (
              <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-slate-300">
                <div className="flex justify-between gap-2">
                  <span>TRT-2:</span>
                  <span className="text-white font-mono">{stats['SP']?.trt2 || 0}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>TRT-15:</span>
                  <span className="text-white font-mono">{stats['SP']?.trt15 || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProcessTimeline = ({ movements, onEdit, onDelete }) => {
  const visibleMovements = movements.filter(m => m.title !== 'Cadastro Inicial');

  return (
    <div className="space-y-6 ml-2">
      {visibleMovements.map((mov, idx) => (
        <div key={idx} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-6 group">
          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
            idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'
          }`}></div>
          
          <div className="flex flex-col gap-2 relative">
            {/* Ações de Edição (Aparecem no Hover) */}
            <div className="absolute right-0 top-0 hidden group-hover:flex gap-2 no-print">
                <button 
                    onClick={() => onEdit(mov)} 
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                    title="Editar"
                >
                    <Edit2 size={14} />
                </button>
                <button 
                    onClick={() => onDelete(mov.id)} 
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded"
                    title="Excluir"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="flex justify-between items-start pr-12">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                   mov.type === 'Prazo' ? 'bg-red-100 text-red-700' : 
                   mov.type === 'Audiência' ? 'bg-orange-100 text-orange-700' : 
                   'bg-slate-100 text-slate-500'
                }`}>
                  {mov.type}
                </span>
                <h4 className={`font-semibold text-sm mt-1 ${idx === 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                  {mov.title}
                </h4>
              </div>
              <div className="text-xs text-slate-400 font-mono whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                {formatDate(mov.date)}
              </div>
            </div>

            <p className="text-sm text-slate-500">{mov.description}</p>
            
            {mov.type === 'Audiência' && (
              <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 border border-slate-200 mt-1">
                <div className="flex gap-4">
                  <span><strong>Tipo:</strong> {mov.hearingType || 'Não informado'}</span>
                  <span><strong>Modalidade:</strong> {mov.modality || 'Presencial'}</span>
                </div>
                {mov.link && (
                  <div className="mt-1 pt-1 border-t border-slate-200">
                    <a href={mov.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                      <Video size={12} /> Link da Sala de Audiência
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {visibleMovements.length === 0 && (
        <p className="text-slate-400 text-center text-sm py-4">Nenhuma movimentação relevante registrada.</p>
      )}
    </div>
  );
};

// --- CALCULADORA AVANÇADA (Aba Dedicada) ---
const AdvancedCalculatorView = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(15);
    const [countMode, setCountMode] = useState('business'); // 'business' or 'calendar'
    const [holidays, setHolidays] = useState([]); // Array de strings 'YYYY-MM-DD'
    const [newHoliday, setNewHoliday] = useState('');
    const [extendWeekend, setExtendWeekend] = useState(true);
    const [resultDate, setResultDate] = useState(null);

    const addHoliday = () => {
        if (newHoliday && !holidays.includes(newHoliday)) {
            setHolidays([...holidays, newHoliday].sort());
            setNewHoliday('');
        }
    };

    const removeHoliday = (date) => {
        setHolidays(holidays.filter(h => h !== date));
    };

    const calculate = () => {
        let current = new Date(startDate);
        // Regra processual: contagem começa no dia seguinte
        current.setDate(current.getDate() + 1);

        let added = 0;
        
        // Loop dia a dia
        while (added < days) {
            const isWeekend = current.getDay() === 0 || current.getDay() === 6;
            const isHoliday = holidays.includes(current.toISOString().split('T')[0]);

            if (countMode === 'business') {
                if (!isWeekend && !isHoliday) {
                    added++;
                }
            } else {
                // Dias corridos conta tudo
                added++;
            }
            
            // Só avança o dia se ainda não terminamos
            if (added < days) {
                current.setDate(current.getDate() + 1);
            }
        }

        // Se dias corridos, verifica se o FINAL cai em dia não útil para prorrogar
        if (countMode === 'calendar' && extendWeekend) {
            while (true) {
                const isWeekend = current.getDay() === 0 || current.getDay() === 6;
                const isHoliday = holidays.includes(current.toISOString().split('T')[0]);
                if (!isWeekend && !isHoliday) break;
                current.setDate(current.getDate() + 1);
            }
        }
        
        setResultDate(current);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calculator className="text-indigo-600" /> Calculadora de Prazos Processuais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna Esquerda: Inputs */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data de Publicação/Ciência</label>
                        <input type="date" className="w-full p-3 border rounded-lg" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prazo (Dias)</label>
                        <input type="number" className="w-full p-3 border rounded-lg" value={days} onChange={e => setDays(parseInt(e.target.value))} />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700">Modo de Contagem</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 border rounded-lg cursor-pointer flex items-center justify-center gap-2 ${countMode === 'business' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50'}`}>
                                <input type="radio" name="mode" className="hidden" checked={countMode === 'business'} onChange={() => setCountMode('business')} />
                                <Briefcase size={16} /> Dias Úteis (CPC/CLT)
                            </label>
                            <label className={`flex-1 p-3 border rounded-lg cursor-pointer flex items-center justify-center gap-2 ${countMode === 'calendar' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50'}`}>
                                <input type="radio" name="mode" className="hidden" checked={countMode === 'calendar'} onChange={() => setCountMode('calendar')} />
                                <CalendarDays size={16} /> Dias Corridos
                            </label>
                        </div>
                    </div>

                    {countMode === 'calendar' && (
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="extend" checked={extendWeekend} onChange={e => setExtendWeekend(e.target.checked)} className="w-4 h-4 text-indigo-600" />
                            <label htmlFor="extend" className="text-sm text-slate-700">Prorrogar se vencer em dia não útil</label>
                        </div>
                    )}

                    <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200">
                        Calcular Prazo Fatal
                    </button>
                </div>

                {/* Coluna Direita: Feriados e Resultado */}
                <div className="space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Feriados / Suspensões</label>
                        <div className="flex gap-2 mb-4">
                            <input type="date" className="flex-1 p-2 border rounded" value={newHoliday} onChange={e => setNewHoliday(e.target.value)} />
                            <button onClick={addHoliday} className="bg-slate-100 px-4 py-2 rounded text-slate-600 hover:bg-slate-200"><PlusCircle size={18} /></button>
                        </div>
                        
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {holidays.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum feriado adicionado.</p>}
                            {holidays.map(h => (
                                <div key={h} className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                                    <span>{formatDate(h)}</span>
                                    <button onClick={() => removeHoliday(h)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                     </div>

                     {resultDate && (
                        <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl text-center animate-in zoom-in">
                            <span className="block text-sm font-bold text-green-700 uppercase tracking-wide mb-2">Prazo Final</span>
                            <div className="text-4xl font-extrabold text-green-800 mb-2">
                                {formatDate(resultDate.toISOString().split('T')[0])}
                            </div>
                            <div className="text-green-600 text-sm">
                                {resultDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                            </div>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [filterState, setFilterState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('jmd_processes_v2');
    if (saved) {
      setProcesses(JSON.parse(saved));
    } else {
      setProcesses(INITIAL_DATA);
      localStorage.setItem('jmd_processes_v2', JSON.stringify(INITIAL_DATA));
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (processes.length > 0) {
      localStorage.setItem('jmd_processes_v2', JSON.stringify(processes));
    }
  }, [processes]);

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- ACTIONS ---
  const handleStateClick = (uf) => {
    setFilterState(uf);
    setActiveView('list');
  };

  const handleProcessClick = (id) => {
    setSelectedProcessId(id);
    setActiveView('detail');
  };

  const handleSaveProcess = (newProcess) => {
    setProcesses([newProcess, ...processes]);
    setActiveView('dashboard');
  };

  const handleAddMovement = (procId, movement) => {
    const updated = processes.map(p => {
      if (p.id === procId) {
        // Se tiver ID (edição), substitui. Se não (novo), adiciona no topo.
        const existingIndex = p.movements.findIndex(m => m.id === movement.id);
        let newMovements;
        
        if (existingIndex >= 0) {
            newMovements = [...p.movements];
            newMovements[existingIndex] = movement;
        } else {
            newMovements = [{...movement, id: Date.now().toString()}, ...p.movements];
        }

        let updates = { movements: newMovements };
        if (movement.type === 'Audiência') {
           updates.nextHearing = `${movement.date}T${movement.time || '00:00'}`;
        }
        return { ...p, ...updates };
      }
      return p;
    });
    setProcesses(updated);
  };

  const handleDeleteMovement = (procId, movId) => {
      const updated = processes.map(p => {
          if (p.id === procId) {
              return { ...p, movements: p.movements.filter(m => m.id !== movId) };
          }
          return p;
      });
      setProcesses(updated);
  };

  const handleChangeStatus = (procId, newStatus) => {
    const updated = processes.map(p => {
        if (p.id === procId) return { ...p, status: newStatus };
        return p;
    });
    setProcesses(updated);
  };

  const printReport = () => {
    window.print();
  };

  // --- VIEWS ---

  const DashboardView = () => {
    const activeCount = processes.filter(p => p.status === 'Ativo').length;
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const today = new Date();
    
    const upcomingHearings = processes.reduce((acc, p) => {
        if (p.nextHearing) {
            const hDate = new Date(p.nextHearing);
            if (hDate >= today && hDate <= nextWeek) return acc + 1;
        }
        return acc;
    }, 0);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Audiências (7 dias)</p>
              <h3 className="text-2xl font-bold text-slate-800">{upcomingHearings}</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Gavel size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Processos</p>
              <h3 className="text-2xl font-bold text-slate-800">{processes.length}</h3>
            </div>
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg"><FileText size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Ativos</p>
              <h3 className="text-2xl font-bold text-slate-800">{activeCount}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={24} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={18} /> Mapa Nacional</h3>
            <BrazilMap processes={processes} onStateClick={handleStateClick} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-y-auto max-h-[460px]">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} /> Radar de Atividade</h3>
            <div className="space-y-4">
              {processes
                .filter(p => p.movements.length > 0)
                .sort((a, b) => new Date(b.movements[0].date) - new Date(a.movements[0].date))
                .slice(0, 5)
                .map(p => (
                  <div key={p.id} onClick={() => handleProcessClick(p.id)} className="cursor-pointer group hover:bg-slate-50 p-2 rounded transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-slate-400">{p.trt}</span>
                      <span className="text-xs text-slate-400">{formatDate(p.movements[0].date)}</span>
                    </div>
                    <p className="font-medium text-sm text-slate-800 group-hover:text-indigo-600 truncate">{p.client}</p>
                    <p className="text-xs text-slate-500 truncate">{p.movements[0].title}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ListView = () => {
    let list = filterState ? processes.filter(p => p.uf === filterState) : processes;

    if (searchTerm) {
        list = list.filter(p => 
            p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.cnj.includes(searchTerm) ||
            p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    return (
      <div className="animate-in slide-in-from-right duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => { setFilterState(null); setActiveView('dashboard'); }} className="p-2 hover:bg-slate-200 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800">
              {filterState ? `Processos em ${filterState}` : 'Todos os Processos'}
            </h2>
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-bold">{list.length}</span>
          </div>

          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
             <input 
                type="text" 
                placeholder="Pesquisar cliente, CNJ..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Cliente / Processo</th>
                <th className="p-4 font-medium">Tribunal</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Última Mov.</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleProcessClick(p.id)}>
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{p.client}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{p.cnj}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-700">{p.trt}</div>
                    <div className="text-xs text-slate-400">{p.uf}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600 truncate max-w-[150px]">{p.movements[0]?.title}</div>
                    <div className="text-xs text-slate-400">{formatDate(p.movements[0]?.date)}</div>
                  </td>
                  <td className="p-4 text-right">
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="p-12 text-center text-slate-400">Nenhum processo encontrado.</div>}
        </div>
      </div>
    );
  };

  const FormView = () => {
    const [formData, setFormData] = useState({
      client: '',
      uf: 'SP',
      trt: 'TRT-2',
      cnj: '',
      tags: ''
    });

    const availableTRTs = useMemo(() => {
        return TRT_REGIONS.filter(region => region.states.includes(formData.uf));
    }, [formData.uf]);

    useEffect(() => {
        const trts = TRT_REGIONS.filter(region => region.states.includes(formData.uf));
        if (trts.length > 0) {
            setFormData(prev => ({ ...prev, trt: trts[0].trt }));
        }
    }, [formData.uf]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newProc = {
        id: Date.now().toString(),
        client: formData.client,
        cnj: formData.cnj,
        uf: formData.uf,
        trt: formData.trt,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: 'Ativo',
        nextHearing: null,
        movements: [
          { id: 'initial', date: new Date().toISOString(), title: 'Cadastro Inicial', description: 'Processo cadastrado no sistema.', type: 'Admin' }
        ]
      };
      handleSaveProcess(newProc);
    };

    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PlusCircle className="text-indigo-600" /> Novo Cadastro
        </h2>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Cliente</label>
            <input required type="text" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado (UF)</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                value={formData.uf} onChange={e => setFormData({...formData, uf: e.target.value})}>
                {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tribunal/Jurisdição</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                value={formData.trt} onChange={e => setFormData({...formData, trt: e.target.value})}>
                {availableTRTs.map(t => (
                    <option key={t.trt} value={t.trt}>{t.trt} - {t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número do Processo (CNJ)</label>
            <input required type="text" className="w-full p-3 border border-slate-300 rounded-lg font-mono tracking-wide"
              placeholder="0000000-00.0000.5.15.0000"
              value={formData.cnj} onChange={e => setFormData({...formData, cnj: maskCNJ(e.target.value)})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Etiquetas (Separar por vírgula)</label>
            <input type="text" className="w-full p-3 border border-slate-300 rounded-lg"
              placeholder="Trabalhista, Urgente, Pro Bono"
              value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setActiveView('dashboard')} className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">Cadastrar Processo</button>
          </div>
        </form>
      </div>
    );
  };

  const ProcessDetailView = () => {
    const process = processes.find(p => p.id === selectedProcessId);
    if (!process) return null;

    const [newMovOpen, setNewMovOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    
    // Estado do form
    const [movData, setMovData] = useState({ 
        id: null,
        title: '', 
        description: '', 
        type: 'Documento', 
        date: new Date().toISOString().split('T')[0],
        hearingType: 'Una', 
        modality: 'Presencial', 
        link: '',
        time: '10:00',
        deadlineGoal: ''
    });

    const startEditing = (mov) => {
        setMovData({
            ...mov,
            hearingType: mov.hearingType || 'Una',
            modality: mov.modality || 'Presencial',
            link: mov.link || '',
            time: mov.time || '10:00',
            deadlineGoal: ''
        });
        setNewMovOpen(true);
    };

    const submitMovement = (e) => {
      e.preventDefault();
      let finalTitle = movData.title;
      let finalDesc = movData.description;

      if (movData.type === 'Prazo' && movData.deadlineGoal) {
          finalTitle = `Prazo: ${movData.deadlineGoal}`;
      }
      if (movData.type === 'Audiência') {
          finalTitle = `Audiência ${movData.hearingType} (${movData.modality})`;
      }

      handleAddMovement(process.id, {
          ...movData,
          title: finalTitle,
          description: finalDesc
      });
      setNewMovOpen(false);
      setMovData({ id: null, title: '', description: '', type: 'Documento', date: new Date().toISOString().split('T')[0], hearingType: 'Una', modality: 'Presencial', link: '', time: '10:00', deadlineGoal: '' });
    };

    return (
      <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <button onClick={() => setActiveView('dashboard')} className="flex items-center text-slate-500 hover:text-indigo-600 gap-1">
            <ArrowLeft size={18} /> Voltar ao Dashboard
          </button>
        </div>

        {/* --- ESTRUTURA DE RELATÓRIO PDF OCULTA (Só aparece no Print) --- */}
        <div id="printable-report" className="hidden print:block font-serif text-black p-8">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase">Relatório de Andamento Processual</h1>
                <p className="text-sm mt-1">JMD Consultoria Jurídica</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                    <p><strong>Cliente:</strong> {process.client}</p>
                    <p><strong>Processo:</strong> {process.cnj}</p>
                </div>
                <div className="text-right">
                    <p><strong>Tribunal:</strong> {process.trt} ({process.uf})</p>
                    <p><strong>Status:</strong> {process.status}</p>
                </div>
            </div>

            <h3 className="text-lg font-bold border-b border-black mb-4 pb-1">Histórico de Movimentações</h3>
            <div className="space-y-4">
                {process.movements.filter(m => m.title !== 'Cadastro Inicial').map((m, idx) => (
                    <div key={idx} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between font-bold text-sm">
                            <span>{formatDate(m.date)} - {m.type.toUpperCase()}</span>
                        </div>
                        <p className="text-sm font-semibold">{m.title}</p>
                        <p className="text-sm text-justify">{m.description}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center text-xs border-t pt-4">
                <p>Documento gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')}.</p>
            </div>
        </div>

        {/* Ficha Visual (Tela) */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{process.client}</h1>
                <p className="font-mono text-lg text-slate-600 mt-1">{process.cnj}</p>
              </div>
              <div className="text-right relative">
                <button 
                  onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border cursor-pointer ${getStatusColor(process.status)}`}
                >
                  {process.status} <MoreHorizontal size={14} />
                </button>

                {statusMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        {['Ativo', 'Arquivado', 'Suspenso', 'Recurso', 'Execução'].map(s => (
                            <button key={s} 
                                onClick={() => { handleChangeStatus(process.id, s); setStatusMenuOpen(false); }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <p className="text-slate-500 mt-2 font-medium">{process.trt} - {process.uf}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 flex-wrap">
              {process.tags.map(tag => <span key={tag} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">{tag}</span>)}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><FileText size={20} /> Histórico de Movimentações</h3>
              
              {!newMovOpen && (
                <button onClick={() => { setMovData({ id: null, title: '', description: '', type: 'Documento', date: new Date().toISOString().split('T')[0], hearingType: 'Una', modality: 'Presencial', link: '', time: '10:00', deadlineGoal: '' }); setNewMovOpen(true); }} className="w-full mb-6 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 no-print">
                  <PlusCircle size={18} /> Adicionar Nova Movimentação
                </button>
              )}

              {newMovOpen && (
                <form onSubmit={submitMovement} className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 animate-in fade-in zoom-in-95 no-print relative">
                   <div className="flex justify-between items-center mb-3 border-b pb-2">
                       <span className="font-bold text-slate-700">{movData.id ? 'Editar Movimentação' : 'Nova Movimentação'}</span>
                       <button type="button" onClick={() => setNewMovOpen(false)}><X size={16} /></button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mb-3">
                      <select className="p-2 border rounded" value={movData.type} onChange={e => setMovData({...movData, type: e.target.value})}>
                        <option>Documento</option>
                        <option>Audiência</option>
                        <option>Prazo</option>
                        <option>Sentença</option>
                        <option>Admin</option>
                      </select>
                      <input type="date" required className="p-2 border rounded" value={movData.date} onChange={e => setMovData({...movData, date: e.target.value})} />
                   </div>

                   {movData.type === 'Audiência' && (
                       <div className="bg-orange-50 p-3 rounded border border-orange-200 mb-3 space-y-3">
                           <div className="grid grid-cols-2 gap-3">
                               <div>
                                   <label className="text-xs font-bold text-orange-800">Tipo</label>
                                   <select className="w-full p-1 border rounded text-sm" value={movData.hearingType} onChange={e => setMovData({...movData, hearingType: e.target.value})}>
                                       <option>Una</option>
                                       <option>Inicial</option>
                                       <option>Instrução</option>
                                       <option>Julgamento</option>
                                       <option>Conciliação</option>
                                   </select>
                               </div>
                               <div>
                                   <label className="text-xs font-bold text-orange-800">Hora</label>
                                   <input type="time" className="w-full p-1 border rounded text-sm" value={movData.time} onChange={e => setMovData({...movData, time: e.target.value})} />
                               </div>
                           </div>
                           <div>
                               <label className="text-xs font-bold text-orange-800">Modalidade</label>
                               <div className="flex gap-4 mt-1">
                                   <label className="flex items-center gap-1 text-sm"><input type="radio" name="modality" value="Presencial" checked={movData.modality === 'Presencial'} onChange={() => setMovData({...movData, modality: 'Presencial'})} /> Presencial</label>
                                   <label className="flex items-center gap-1 text-sm"><input type="radio" name="modality" value="Online" checked={movData.modality === 'Online'} onChange={() => setMovData({...movData, modality: 'Online'})} /> Online</label>
                               </div>
                           </div>
                           {movData.modality === 'Online' && (
                               <input type="text" placeholder="Cole o Link da audiência aqui..." className="w-full p-2 border rounded text-sm" value={movData.link} onChange={e => setMovData({...movData, link: e.target.value})} />
                           )}
                       </div>
                   )}

                   {movData.type === 'Prazo' && (
                       <div className="bg-red-50 p-3 rounded border border-red-200 mb-3">
                           <label className="text-xs font-bold text-red-800">Manifestação sobre o que?</label>
                           <input type="text" placeholder="Ex: Réplica, Cálculos, Laudo Pericial..." className="w-full p-2 border rounded mt-1" 
                               value={movData.deadlineGoal} onChange={e => setMovData({...movData, deadlineGoal: e.target.value})} />
                       </div>
                   )}

                   {movData.type !== 'Audiência' && movData.type !== 'Prazo' && (
                        <input type="text" placeholder="Título (ex: Despacho do Juiz)" className="w-full p-2 border rounded mb-3" value={movData.title} onChange={e => setMovData({...movData, title: e.target.value})} />
                   )}
                   
                   <div className="relative">
                        <textarea 
                            placeholder="Descrição adicional..." 
                            rows="3" 
                            className="w-full p-2 border rounded mb-3" 
                            value={movData.description} 
                            onChange={e => setMovData({...movData, description: e.target.value})} 
                        />
                   </div>
                   
                   <div className="flex justify-end gap-2">
                     <button type="button" onClick={() => setNewMovOpen(false)} className="text-slate-500 text-sm hover:underline">Cancelar</button>
                     <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center gap-2">
                        <Save size={14} /> Salvar
                     </button>
                   </div>
                </form>
              )}

              <ProcessTimeline 
                 movements={process.movements} 
                 onEdit={startEditing} 
                 onDelete={(movId) => handleDeleteMovement(process.id, movId)}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 no-print">
                <h4 className="font-bold text-slate-700 mb-3">Ações Rápidas</h4>
                <div className="space-y-2">
                  <button onClick={printReport} className="w-full text-left p-3 bg-white border hover:bg-indigo-50 hover:text-indigo-700 rounded transition-colors text-sm text-slate-600 flex items-center gap-2 font-medium">
                    <Printer size={16} /> Gerar Relatório PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InternalCalendarView = () => {
      const events = processes.flatMap(p => {
          return p.movements
            .filter(m => m.type === 'Audiência' || m.type === 'Prazo')
            .map(m => ({
                id: p.id + m.date,
                date: m.date,
                time: m.time || '00:00',
                type: m.type,
                title: m.title,
                client: p.client,
                processId: p.id
            }));
      }).sort((a, b) => new Date(a.date) - new Date(b.date));

      return (
        <div className="animate-in fade-in max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CalendarIcon className="text-indigo-600" /> Agenda Interna do Escritório
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-medium text-slate-500 flex justify-between">
                    <span>Próximos Compromissos</span>
                    <span>{events.length} eventos encontrados</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">Nenhum evento agendado.</div>
                    ) : (
                        events.map((evt, idx) => (
                            <div key={idx} onClick={() => handleProcessClick(evt.processId)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center gap-4 group transition-colors">
                                <div className="text-center min-w-[60px]">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">{new Date(evt.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                                    <span className="block text-xl font-bold text-slate-800">{new Date(evt.date).getDate()}</span>
                                    <span className="block text-xs text-slate-500">{new Date(evt.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                                </div>
                                <div className={`w-1 h-12 rounded-full ${evt.type === 'Audiência' ? 'bg-orange-400' : 'bg-red-400'}`}></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                                            evt.type === 'Audiência' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {evt.type}
                                        </span>
                                        {evt.type === 'Audiência' && <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {evt.time}</span>}
                                    </div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600">{evt.title}</h4>
                                    <p className="text-sm text-slate-500">{evt.client}</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600" size={20} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print:hidden { display: none !important; }
          body { background: white; }
          .sidebar { display: none; }
          /* Garante que o relatório ocupe a página toda */
          #printable-report { display: block !important; width: 100%; height: 100%; }
        }
      `}</style>

      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 transition-all sidebar">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">J</div>
          <span className="font-bold text-lg tracking-tight hidden lg:block">JMD Processos</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> <span className="hidden lg:block">Visão Geral</span>
          </button>
          
          <button onClick={() => setActiveView('list')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Search size={20} /> <span className="hidden lg:block">Processos</span>
          </button>

          <button onClick={() => setActiveView('calendar')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <CalendarIcon size={20} /> <span className="hidden lg:block">Agenda Interna</span>
          </button>

          <button onClick={() => setActiveView('calculator')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'calculator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Calculator size={20} /> <span className="hidden lg:block">Calculadora</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={() => setActiveView('form')} className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg shadow-lg">
             <PlusCircle size={20} /> <span className="hidden lg:block font-bold">Novo Processo</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 ml-20 lg:ml-64 p-4 lg:p-8 overflow-y-auto h-full">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'list' && <ListView />}
        {activeView === 'form' && <FormView />}
        {activeView === 'detail' && <ProcessDetailView />}
        {activeView === 'calendar' && <InternalCalendarView />}
        {activeView === 'calculator' && <AdvancedCalculatorView />}
      </main>
    </div>
  );
}

// Render the App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
