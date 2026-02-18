import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// O import abaixo foi comentado para garantir o funcionamento no ambiente de visualização.
// No seu ambiente local/servidor, certifique-se de que o arquivo index.css existe.
// import './index.css'; 

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
  Wifi,
  WifiOff
} from 'lucide-react';

const TRT_REGIONS = [
  { region: '15ª Região', trt: 'TRT-15', states: ['SP'], name: 'SP - Interior (Campinas/Região)' },
  { region: '2ª Região', trt: 'TRT-2', states: ['SP'], name: 'SP - Capital/Grande SP/Baixada' },
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
  if (v.length <= 7) return v;
  if (v.length <= 9) return v.replace(/(\d{7})(\d+)/, '$1-$2');
  if (v.length <= 13) return v.replace(/(\d{7})(\d{2})(\d+)/, '$1-$2.$3');
  if (v.length <= 14) return v.replace(/(\d{7})(\d{2})(\d{4})(\d+)/, '$1-$2.$3.$4');
  if (v.length <= 16) return v.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d+)/, '$1-$2.$3.$4.$5');
  return v.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d+)/, '$1-$2.$3.$4.$5.$6');
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
          <p className="text-slate-600 bg-slate-100 p-4 rounded font-mono text-sm max-w-lg overflow-auto text-left">
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
          <p className="text-slate-500 text-sm">Acesso Restrito</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={user} onChange={e => setUser(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="password" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={pass} onChange={e => setPass(e.target.value)} />
            </div>
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded flex items-center gap-2"><AlertTriangle size={16} /> Credenciais inválidas.</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Entrar no Sistema</button>
        </form>
      </div>
    </div>
  );
};

const BrazilMap = ({ processes = [], onStateClick }) => {
  const stats = useMemo(() => {
    const data = {};
    if (!Array.isArray(processes)) return data; 
    processes.forEach(p => {
      if (!data[p.uf]) data[p.uf] = { total: 0 };
      data[p.uf].total++;
    });
    return data;
  }, [processes]);

  const getStateColor = (uf) => {
    const count = stats[uf]?.total || 0;
    if (count === 0) return '#e5e7eb';
    return count < 3 ? '#93c5fd' : '#1e40af';
  };

  const states = [
    { id: 'RR', name: 'Roraima', x: 100, y: 30, r: 15 }, { id: 'AP', name: 'Amapá', x: 180, y: 40, r: 12 }, { id: 'AM', name: 'Amazonas', x: 70, y: 80, r: 35 }, { id: 'PA', name: 'Pará', x: 160, y: 90, r: 30 }, { id: 'AC', name: 'Acre', x: 30, y: 130, r: 12 }, { id: 'RO', name: 'Rondônia', x: 75, y: 150, r: 15 }, { id: 'TO', name: 'Tocantins', x: 190, y: 140, r: 15 }, { id: 'MA', name: 'Maranhão', x: 215, y: 80, r: 15 }, { id: 'PI', name: 'Piauí', x: 235, y: 95, r: 14 }, { id: 'CE', name: 'Ceará', x: 260, y: 75, r: 12 }, { id: 'RN', name: 'Rio G. Norte', x: 285, y: 85, r: 10 }, { id: 'PB', name: 'Paraíba', x: 285, y: 100, r: 9 }, { id: 'PE', name: 'Pernambuco', x: 280, y: 115, r: 10 }, { id: 'AL', name: 'Alagoas', x: 285, y: 130, r: 8 }, { id: 'SE', name: 'Sergipe', x: 275, y: 140, r: 8 }, { id: 'BA', name: 'Bahia', x: 240, y: 160, r: 25 }, { id: 'MT', name: 'Mato Grosso', x: 120, y: 190, r: 25 }, { id: 'GO', name: 'Goiás', x: 180, y: 200, r: 18 }, { id: 'DF', name: 'Distrito Federal', x: 195, y: 195, r: 6 }, { id: 'MS', name: 'Mato G. Sul', x: 130, y: 250, r: 20 }, { id: 'MG', name: 'Minas Gerais', x: 220, y: 230, r: 22 }, { id: 'ES', name: 'Espírito Santo', x: 255, y: 235, r: 10 }, { id: 'RJ', name: 'Rio de Janeiro', x: 240, y: 265, r: 10 }, { id: 'SP', name: 'São Paulo', x: 190, y: 280, r: 20 }, { id: 'PR', name: 'Paraná', x: 170, y: 310, r: 15 }, { id: 'SC', name: 'Santa Catarina', x: 180, y: 335, r: 12 }, { id: 'RS', name: 'Rio G. Sul', x: 160, y: 365, r: 18 },
  ];

  return (
    <div className="relative w-full h-96 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 320 400" className="w-full h-full max-w-lg drop-shadow-lg">
        {states.map((s) => (
          <g key={s.id} onClick={() => onStateClick(s.id)} className="cursor-pointer transition-all duration-300 hover:opacity-80">
            <circle cx={s.x} cy={s.y} r={s.r} fill={getStateColor(s.id)} stroke="white" strokeWidth="2" />
            <text x={s.x} y={s.y} dy=".3em" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">{s.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const ProcessTimeline = ({ movements, onEdit, onDelete }) => {
  const visibleMovements = (movements || []).filter(m => m.title !== 'Cadastro Inicial');
  return (
    <div className="space-y-6">
      {visibleMovements.map((mov, idx) => (
        <div key={idx} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-6 group">
          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
          <div className="flex flex-col relative">
            <div className="absolute right-0 top-0 hidden group-hover:flex gap-2">
                <button onClick={() => onEdit(mov)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(mov.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-600">{mov.type}</span>
                <h4 className="font-semibold text-sm text-slate-900">{mov.title}</h4>
              </div>
              <div className="text-xs text-slate-400">{formatDate(mov.date)}</div>
            </div>
            <p className="text-xs text-slate-500 mt-1">{mov.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashboardView = ({ processes, onStateClick, handleProcessClick }) => {
    const active = processes.filter(p => p.status === 'Ativo').length;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
            <div><p className="text-slate-500 text-xs">Total Processos</p><h3 className="text-xl font-bold">{processes.length}</h3></div>
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><FileText size={20} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
            <div><p className="text-slate-500 text-xs">Ativos</p><h3 className="text-xl font-bold">{active}</h3></div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold text-sm mb-4">Mapa de Atuação</h3>
          <BrazilMap processes={processes} onStateClick={onStateClick} />
        </div>
      </div>
    );
};

const ListView = ({ processes, filterState, setFilterState, searchTerm, setSearchTerm, handleProcessClick }) => {
    let list = filterState ? processes.filter(p => p.uf === filterState) : processes;
    if (searchTerm) list = list.filter(p => p.client.toLowerCase().includes(searchTerm.toLowerCase()) || p.cnj.includes(searchTerm));
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Processos {filterState ? `(${filterState})` : ''}</h2>
          <div className="relative w-64 flex gap-2">
            {filterState && <button onClick={() => setFilterState(null)} className="text-xs text-indigo-600 underline">Limpar</button>}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input type="text" placeholder="Filtrar..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr><th className="p-4">Cliente</th><th className="p-4">Tribunal</th><th className="p-4">Status</th><th className="p-4"></th></tr>
            </thead>
            <tbody className="divide-y">
              {list.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleProcessClick(p.id)}>
                  <td className="p-4"><div className="font-semibold">{p.client}</div><div className="text-xs text-slate-400 font-mono">{p.cnj}</div></td>
                  <td className="p-4">{p.trt}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td className="p-4 text-right text-slate-300"><ChevronRight size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="p-10 text-center text-slate-400">Nenhum processo encontrado.</div>}
        </div>
      </div>
    );
};

const FormView = ({ onSave, onCancel }) => {
    const [f, setF] = useState({ client: '', uf: 'SP', trt: 'TRT-15', cnj: '', tags: '' });
    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Novo Cadastro</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ ...f, id: Date.now().toString(), status: 'Ativo', movements: [{id:'i', title:'Cadastro', date:new Date().toISOString(), type:'Admin'}] }); }} className="bg-white p-6 rounded-xl border space-y-4">
          <div><label className="text-xs font-bold text-slate-500">Cliente</label><input required className="w-full p-2 border rounded" value={f.client} onChange={e => setF({...f, client: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500">UF</label><select className="w-full p-2 border rounded" value={f.uf} onChange={e => setF({...f, uf: e.target.value})}>{UF_LIST.map(u => <option key={u}>{u}</option>)}</select></div>
            <div><label className="text-xs font-bold text-slate-500">Tribunal</label><select className="w-full p-2 border rounded" value={f.trt} onChange={e => setF({...f, trt: e.target.value})}>{TRT_REGIONS.filter(r => r.states.includes(f.uf)).map(r => <option key={r.trt} value={r.trt}>{r.name}</option>)}</select></div>
          </div>
          <div><label className="text-xs font-bold text-slate-500">CNJ (20 dígitos)</label><input required placeholder="0010495-16.2023.5.15.0112" className="w-full p-2 border rounded font-mono" value={f.cnj} onChange={e => setF({...f, cnj: maskCNJ(e.target.value)})} /></div>
          <div className="flex gap-2 pt-4"><button type="button" onClick={onCancel} className="flex-1 p-2 bg-slate-100 rounded text-sm font-bold">Cancelar</button><button type="submit" className="flex-1 p-2 bg-indigo-600 text-white rounded text-sm font-bold">Salvar Processo</button></div>
        </form>
      </div>
    );
};

const ProcessDetailView = ({ process, onBack, onUpdate }) => {
    if (!process) return null;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1 text-sm hover:text-indigo-600"><ArrowLeft size={16} /> Voltar para a lista</button>
        <div className="bg-white rounded-xl border p-8 shadow-sm">
            <div className="flex justify-between items-start">
                <div><h1 className="text-2xl font-bold text-slate-900">{process.client}</h1><p className="font-mono text-slate-500 mt-1">{process.cnj}</p></div>
                <div className="text-right"><span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(process.status)}`}>{process.status}</span><p className="text-xs text-slate-400 mt-2">{process.trt}</p></div>
            </div>
            <div className="mt-10 border-t pt-8">
                <h3 className="font-bold text-sm text-slate-800 mb-6 flex items-center gap-2"><Clock size={18} /> Histórico de Movimentações</h3>
                <ProcessTimeline movements={process.movements} onEdit={()=>{}} onDelete={()=>{}} />
            </div>
        </div>
      </div>
    );
};

const AdvancedCalculatorView = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(15);
    const [resultDate, setResultDate] = useState(null);

    const calculate = () => {
        let current = new Date(startDate);
        current.setDate(current.getDate() + 1);
        let added = 0;
        while (added < days) {
            const isWeekend = current.getDay() === 0 || current.getDay() === 6;
            if (!isWeekend) added++;
            if (added < days) current.setDate(current.getDate() + 1);
        }
        setResultDate(current);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Calculator className="text-indigo-600" /> Calculadora de Prazos (Dias Úteis)</h2>
            <div className="space-y-4">
                <div><label className="text-xs font-bold text-slate-500">Data de Publicação</label><input type="date" className="w-full p-2 border rounded" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><label className="text-xs font-bold text-slate-500">Prazo (em dias)</label><input type="number" className="w-full p-2 border rounded" value={days} onChange={e => setDays(parseInt(e.target.value))} /></div>
                <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors">Calcular Prazo Fatal</button>
                {resultDate && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <span className="text-xs font-bold text-green-700 uppercase">Prazo Final</span>
                        <div className="text-2xl font-bold text-green-800">{formatDate(resultDate.toISOString().split('T')[0])}</div>
                    </div>
                )}
            </div>
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

  const fetchProcesses = async () => {
    try {
      const res = await fetch('/api/processes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setProcesses(data);
      }
    } catch (err) {
      const local = localStorage.getItem('jmd_processes_backup');
      if (local) setProcesses(JSON.parse(local));
    }
  };

  useEffect(() => { if (isAuthenticated) fetchProcesses(); }, [isAuthenticated]);

  useEffect(() => {
    if (processes.length > 0) localStorage.setItem('jmd_processes_backup', JSON.stringify(processes));
  }, [processes]);

  if (!isAuthenticated) return <LoginView onLogin={() => setIsAuthenticated(true)} />;

  const handleSaveProcess = async (newProcess) => {
    try {
      await fetch('/api/processes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProcess) });
      fetchProcesses();
    } catch (e) {
      setProcesses([newProcess, ...processes]);
    }
    setActiveView('dashboard');
  };

  const handleProcessClick = (id) => {
      setSelectedProcessId(id);
      setActiveView('detail');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full transition-all">
        <div className="p-8 border-b border-slate-800 text-center font-bold text-xl tracking-tight">JMD Processos</div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard size={18} /> Visão Geral</button>
          <button onClick={() => setActiveView('list')} className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Search size={18} /> Processos</button>
          <button onClick={() => setActiveView('calculator')} className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'calculator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Calculator size={18} /> Calculadora</button>
        </nav>
        <div className="p-6 border-t border-slate-800"><button onClick={() => setActiveView('form')} className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"><PlusCircle size={18} /> Novo Processo</button></div>
      </aside>
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        <ErrorBoundary>
            {activeView === 'dashboard' && <DashboardView processes={processes} onStateClick={(uf) => { setFilterState(uf); setActiveView('list'); }} />}
            {activeView === 'list' && <ListView processes={processes} filterState={filterState} setFilterState={setFilterState} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleProcessClick={handleProcessClick} />}
            {activeView === 'form' && <FormView onSave={handleSaveProcess} onCancel={() => setActiveView('dashboard')} />}
            {activeView === 'detail' && <ProcessDetailView process={processes.find(x => x.id === selectedProcessId)} onBack={() => setActiveView('list')} />}
            {activeView === 'calculator' && <AdvancedCalculatorView />}
        </ErrorBoundary>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
