import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 

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
  CalendarDays,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';

/**
 * JMD PROCESSOS TRABALHISTAS
 * Versão 4.4 (Production Ready)
 */

// --- DADOS DE CONFIGURAÇÃO (TRTs) ---
const TRT_REGIONS = [
  { region: '15ª Região', trt: 'TRT-15', states: ['SP'], name: 'SP - Interior' },
  { region: '2ª Região', trt: 'TRT-2', states: ['SP'], name: 'SP - Capital/Litoral' },
  { region: '1ª Região', trt: 'TRT-1', states: ['RJ'], name: 'Rio de Janeiro' },
  { region: '3ª Região', trt: 'TRT-3', states: ['MG'], name: 'Minas Gerais' },
  { region: '4ª Região', trt: 'TRT-4', states: ['RS'], name: 'Rio Grande do Sul' },
  { region: '5ª Região', trt: 'TRT-5', states: ['BA'], name: 'Bahia' },
  { region: '6ª Região', trt: 'TRT-6', states: ['PE'], name: 'Pernambuco' },
  { region: '7ª Região', trt: 'TRT-7', states: ['CE'], name: 'Ceará' },
  { region: '8ª Região', trt: 'TRT-8', states: ['PA', 'AP'], name: 'Pará e Amapá' },
  { region: '9ª Região', trt: 'TRT-9', states: ['PR'], name: 'Paraná' },
  { region: '10ª Região', trt: 'TRT-10', states: ['DF', 'TO'], name: 'DF e Tocantins' },
  { region: '11ª Região', trt: 'TRT-11', states: ['AM', 'RR'], name: 'Amazonas e Roraima' },
  { region: '12ª Região', trt: 'TRT-12', states: ['SC'], name: 'Santa Catarina' },
  { region: '13ª Região', trt: 'TRT-13', states: ['PB'], name: 'Paraíba' },
  { region: '14ª Região', trt: 'TRT-14', states: ['RO', 'AC'], name: 'Rondônia e Acre' },
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

// --- UTILITÁRIOS ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    if (dateString.includes('T')) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } else {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
  } catch (e) { return '-'; }
};

const maskCNJ = (value) => {
  if (!value) return '';
  
  let v = value.replace(/\D/g, '').slice(0, 20);
  
  if (v.length > 16) {
    return v.replace(/^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d+)/, '$1-$2.$3.$4.$5.$6');
  } else if (v.length > 14) {
    return v.replace(/^(\d{7})(\d{2})(\d{4})(\d{1})(\d+)/, '$1-$2.$3.$4.$5');
  } else if (v.length > 13) {
    return v.replace(/^(\d{7})(\d{2})(\d{4})(\d+)/, '$1-$2.$3.$4');
  } else if (v.length > 9) {
    return v.replace(/^(\d{7})(\d{2})(\d+)/, '$1-$2.$3');
  } else if (v.length > 7) {
    return v.replace(/^(\d{7})(\d+)/, '$1-$2');
  }
  
  return v;
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

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-slate-50 flex-col gap-4 p-8 text-center">
          <AlertTriangle size={48} className="text-red-500" />
          <h2 className="text-2xl font-bold text-slate-800">Ocorreu um erro inesperado</h2>
          <p className="text-slate-600 bg-slate-100 p-4 rounded font-mono text-sm max-w-lg overflow-auto">
            {this.state.error?.toString()}
          </p>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Limpar Cache e Recarregar
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

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
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">JMD Processos</h1>
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

const BrazilMap = ({ processes = [], onStateClick }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const stats = useMemo(() => {
    const data = {};
    if (!Array.isArray(processes)) return data; 
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
          <g key={state.id} onClick={() => onStateClick(state.id)} onMouseEnter={() => setHoveredState(state)} onMouseLeave={() => setHoveredState(null)} className="cursor-pointer transition-all duration-300 hover:opacity-80">
            <circle cx={state.x} cy={state.y} r={state.r} fill={getStateColor(state.id)} stroke="white" strokeWidth="2" />
            <text x={state.x} y={state.y} dy=".3em" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">{state.id}</text>
          </g>
        ))}
      </svg>
      {hoveredState && (
        <div className="absolute z-50 bg-slate-800 text-white text-sm rounded-lg p-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full" style={{ top: hoveredState.y - 10, left: hoveredState.x + 40 }}>
          <div className="font-bold border-b border-slate-600 pb-1 mb-1 whitespace-nowrap">{hoveredState.name}</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4"><span>Total Processos:</span><span className="font-bold">{stats[hoveredState.id]?.total || 0}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProcessTimeline = ({ movements, onEdit, onDelete }) => {
  const visibleMovements = (movements || []).filter(m => m.title !== 'Cadastro Inicial');
  return (
    <div className="space-y-6 ml-2">
      {visibleMovements.map((mov, idx) => (
        <div key={idx} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-6 group">
          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
          <div className="flex flex-col gap-2 relative">
            <div className="absolute right-0 top-0 hidden group-hover:flex gap-2 no-print">
                <button onClick={() => onEdit(mov)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded" title="Editar"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(mov.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded" title="Excluir"><Trash2 size={14} /></button>
            </div>
            <div className="flex justify-between items-start pr-12">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${mov.type === 'Prazo' ? 'bg-red-100 text-red-700' : mov.type === 'Audiência' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>{mov.type}</span>
                <h4 className={`font-semibold text-sm mt-1 ${idx === 0 ? 'text-slate-900' : 'text-slate-600'}`}>{mov.title}</h4>
              </div>
              <div className="text-xs text-slate-400 font-mono whitespace-nowrap bg-slate-50 px-2 py-1 rounded">{formatDate(mov.date)}</div>
            </div>
            <p className="text-sm text-slate-500">{mov.description}</p>
          </div>
        </div>
      ))}
      {visibleMovements.length === 0 && <p className="text-slate-400 text-center text-sm py-4">Nenhuma movimentação relevante registrada.</p>}
    </div>
  );
};

const AdvancedCalculatorView = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(15);
    const [countMode, setCountMode] = useState('business'); 
    const [holidays, setHolidays] = useState([]); 
    const [newHoliday, setNewHoliday] = useState('');
    const [extendWeekend, setExtendWeekend] = useState(true);
    const [resultDate, setResultDate] = useState(null);

    const addHoliday = () => { if (newHoliday && !holidays.includes(newHoliday)) { setHolidays([...holidays, newHoliday].sort()); setNewHoliday(''); } };
    const removeHoliday = (date) => { setHolidays(holidays.filter(h => h !== date)); };
    const calculate = () => {
        let current = new Date(startDate); current.setDate(current.getDate() + 1);
        let added = 0;
        while (added < days) {
            const isWeekend = current.getDay() === 0 || current.getDay() === 6;
            const isHoliday = holidays.includes(current.toISOString().split('T')[0]);
            if (countMode === 'business') { if (!isWeekend && !isHoliday) added++; } else { added++; }
            if (added < days) current.setDate(current.getDate() + 1);
        }
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
        <div className="max-w-4xl mx-auto animate-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Calculator className="text-indigo-600" /> Calculadora de Prazos Processuais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Data de Publicação</label><input type="date" className="w-full p-3 border rounded-lg" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Prazo (Dias)</label><input type="number" className="w-full p-3 border rounded-lg" value={days} onChange={e => setDays(parseInt(e.target.value))} /></div>
                    <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200">Calcular Prazo Fatal</button>
                </div>
                {resultDate && (
                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl text-center">
                        <span className="block text-sm font-bold text-green-700 uppercase tracking-wide mb-2">Prazo Final</span>
                        <div className="text-4xl font-extrabold text-green-800 mb-2">{formatDate(resultDate.toISOString().split('T')[0])}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FormView = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      client: '',
      uf: 'SP',
      trt: 'TRT-15',
      cnj: '',
      tags: ''
    });

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
      onSave(newProc);
    };

    const handleStateChange = (e) => {
        const newUf = e.target.value;
        const validTrts = TRT_REGIONS.filter(r => r.states.includes(newUf));
        setFormData(prev => ({
            ...prev,
            uf: newUf,
            trt: validTrts.length > 0 ? validTrts[0].trt : ''
        }));
    };

    const currentTrts = TRT_REGIONS.filter(region => region.states.includes(formData.uf));

    return (
      <div className="max-w-2xl mx-auto">
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
                value={formData.uf} 
                onChange={handleStateChange}>
                {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tribunal/Jurisdição</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                value={formData.trt} onChange={e => setFormData({...formData, trt: e.target.value})}>
                {currentTrts.map(t => (
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
            <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">Cadastrar Processo</button>
          </div>
        </form>
      </div>
    );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [filterState, setFilterState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const fetchProcesses = async () => {
    try {
      const res = await fetch('/api/processes');
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (Array.isArray(data)) {
            setProcesses(data);
            setIsOnline(true);
            return;
        }
      }
      throw new Error("API falhou ou retornou dados inválidos");
    } catch (err) {
      console.warn("API indisponível, usando LocalStorage:", err);
      setIsOnline(false);
      const localData = localStorage.getItem('jmd_processes_backup');
      if (localData) {
          try {
              const parsed = JSON.parse(localData);
              if (Array.isArray(parsed)) setProcesses(parsed);
          } catch(e) { setProcesses([]); }
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        fetchProcesses();
    }
  }, [isAuthenticated]);

  useEffect(() => {
      if (processes.length > 0) {
          localStorage.setItem('jmd_processes_backup', JSON.stringify(processes));
      }
  }, [processes]);

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleStateClick = (uf) => {
    setFilterState(uf);
    setActiveView('list');
  };

  const handleProcessClick = (id) => {
    setSelectedProcessId(id);
    setActiveView('detail');
  };

  const handleSaveProcess = async (newProcess) => {
    try {
      const res = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProcess)
      });
      if (!res.ok) throw new Error("Falha na API");
      fetchProcesses();
    } catch (e) {
      const updated = [newProcess, ...processes];
      setProcesses(updated);
      localStorage.setItem('jmd_processes_backup', JSON.stringify(updated));
    }
    setActiveView('dashboard');
  };

  const handleAddMovement = async (procId, movement) => {
    const process = processes.find(p => p.id === procId);
    if (!process) return;

    let newMovements;
    const existingIndex = (process.movements || []).findIndex(m => m.id === movement.id);
    
    if (existingIndex >= 0) {
        newMovements = [...process.movements];
        newMovements[existingIndex] = movement;
    } else {
        newMovements = [{...movement, id: Date.now().toString()}, ...(process.movements || [])];
    }

    let updates = { movements: newMovements };
    if (movement.type === 'Audiência') {
       updates.nextHearing = `${movement.date}T${movement.time || '00:00'}`;
    }

    try {
        await fetch(`/api/processes/${procId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        fetchProcesses();
    } catch (e) {
        const updatedProcs = processes.map(p => p.id === procId ? { ...p, ...updates } : p);
        setProcesses(updatedProcs);
    }
  };

  const handleDeleteMovement = async (procId, movId) => {
      const process = processes.find(p => p.id === procId);
      if (!process) return;
      
      const newMovements = (process.movements || []).filter(m => m.id !== movId);
      try {
        await fetch(`/api/processes/${procId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movements: newMovements })
        });
        fetchProcesses();
      } catch (e) {
          const updatedProcs = processes.map(p => p.id === procId ? { ...p, movements: newMovements } : p);
          setProcesses(updatedProcs);
      }
  };

  const handleChangeStatus = async (procId, newStatus) => {
    try {
        await fetch(`/api/processes/${procId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchProcesses();
    } catch (e) {
        const updatedProcs = processes.map(p => p.id === procId ? { ...p, status: newStatus } : p);
        setProcesses(updatedProcs);
    }
  };

  const printReport = () => {
    window.print();
  };

  const safeProcesses = Array.isArray(processes) ? processes : [];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print:hidden { display: none !important; }
          body { background: white; }
          .sidebar { display: none; }
          #printable-report { display: block !important; width: 100%; height: 100%; }
        }
      `}</style>

      <ErrorBoundary>
        <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 transition-all sidebar">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <span className="font-bold text-lg tracking-tight hidden lg:block text-center w-full">JMD Processos</span>
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
          
          {activeView === 'form' && <FormView onSave={handleSaveProcess} onCancel={() => setActiveView('dashboard')} />}
          
          {activeView === 'detail' && <ProcessDetailView />}
          {activeView === 'calendar' && <InternalCalendarView />}
          {activeView === 'calculator' && <AdvancedCalculatorView />}
        </main>
      </ErrorBoundary>
    </div>
  );
}

// Render the App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
