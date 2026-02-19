import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// ⚠️ IMPORTANTE: No seu GitHub, REMOVA AS BARRAS (//) DA LINHA ABAIXO:
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

/**
 * JMD PROCESSOS TRABALHISTAS
 * Versão 6.2 (Preview Fix & Styles Injection)
 */

// --- ESTILOS INJETADOS (Para garantir funcionamento visual no Preview) ---
// Este componente garante que o visual funcione mesmo se o index.css falhar
const GlobalStyles = () => (
  <style>{`
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    body { background-color: #f8fafc; font-family: sans-serif; margin: 0; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .animate-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @media print {
      .no-print { display: none !important; }
      body { background: white; }
      .sidebar { display: none; }
      main { margin-left: 0 !important; padding: 0 !important; }
    }
  `}</style>
);

// --- DADOS ---
const TRT_REGIONS = [
  { region: '15ª Região', trt: 'TRT-15', states: ['SP'], name: 'SP - Interior (Campinas)' },
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
const formatDate = (d) => {
  if (!d) return '-';
  try { return new Date(d).toLocaleDateString('pt-BR'); } catch (e) { return '-'; }
};

const maskCNJ = (v) => {
  if (!v) return '';
  let r = v.replace(/\D/g, '').slice(0, 20);
  if (r.length > 16) return r.replace(/^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d+)/, '$1-$2.$3.$4.$5.$6');
  if (r.length > 14) return r.replace(/^(\d{7})(\d{2})(\d{4})(\d{1})(\d+)/, '$1-$2.$3.$4.$5');
  if (r.length > 13) return r.replace(/^(\d{7})(\d{2})(\d{4})(\d+)/, '$1-$2.$3.$4');
  if (r.length > 9) return r.replace(/^(\d{7})(\d{2})(\d+)/, '$1-$2.$3');
  if (r.length > 7) return r.replace(/^(\d{7})(\d+)/, '$1-$2');
  return r;
};

const getStatusColor = (s) => {
  if(s==='Ativo') return 'bg-blue-100 text-blue-800';
  if(s==='Arquivado') return 'bg-gray-100 text-gray-800';
  if(s==='Execução') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

// --- COMPONENTES AUXILIARES ---

// Error Boundary para capturar erros de renderização
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

const LoginView = ({ onLogin }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">JMD Processos</h1>
        <form onSubmit={e => { e.preventDefault(); if(u==='administrador' && p==='36672456') onLogin(); }}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Usuário</label>
            <input className="w-full border p-2 rounded" value={u} onChange={e=>setU(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-1">Senha</label>
            <input type="password" className="w-full border p-2 rounded" value={p} onChange={e=>setP(e.target.value)} />
          </div>
          <button className="w-full bg-indigo-600 text-white p-2 rounded font-bold">Entrar</button>
        </form>
      </div>
    </div>
  );
};

const BrazilMap = ({ processes = [], onStateClick }) => {
  const states = [
    {id:'SP', x:220, y:280}, {id:'RJ', x:260, y:270}, {id:'MG', x:240, y:240},
    {id:'RS', x:180, y:360}, {id:'PR', x:190, y:320}, {id:'SC', x:200, y:340},
    {id:'BA', x:280, y:180}, {id:'AM', x:80, y:100}, {id:'PA', x:180, y:100},
    {id:'MT', x:140, y:200}, {id:'GO', x:200, y:220}, {id:'MS', x:160, y:260}
  ];
  const stats = useMemo(() => {
    const d = {};
    if (Array.isArray(processes)) {
      processes.forEach(p => { if(!d[p.uf]) d[p.uf]=0; d[p.uf]++; });
    }
    return d;
  }, [processes]);

  return (
    <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center border relative overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {states.map(s => (
           <g key={s.id} onClick={() => onStateClick(s.id)} className="cursor-pointer hover:opacity-80">
             <circle cx={s.x} cy={s.y} r={18} fill={stats[s.id] ? '#3b82f6' : '#cbd5e1'} stroke="white" strokeWidth="2" />
             <text x={s.x} y={s.y} dy=".3em" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{s.id}</text>
           </g>
        ))}
      </svg>
      <div className="absolute bottom-2 right-2 text-xs text-slate-400">* Mapa simplificado</div>
    </div>
  );
};

const ProcessTimeline = ({ movements = [], onDelete }) => {
  // Garante que movements seja sempre um array
  const safeMovements = Array.isArray(movements) ? movements : [];
  return (
    <div className="space-y-6 ml-2">
      {safeMovements.filter(m => m.title !== 'Cadastro Inicial').map((m, i) => (
        <div key={m.id || i} className="relative pl-6 border-l-2 border-slate-300 pb-4">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white"></div>
          <div className="flex justify-between">
              <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase">{m.type}</span>
                  <h4 className="font-bold text-slate-800">{m.title}</h4>
                  <p className="text-sm text-slate-600">{m.description}</p>
              </div>
              <div className="text-right">
                  <span className="text-xs text-slate-400 block">{formatDate(m.date)}</span>
                  <button onClick={() => onDelete(m.id)} className="text-red-400 hover:text-red-600 mt-1"><Trash2 size={14}/></button>
              </div>
          </div>
        </div>
      ))}
      {safeMovements.length <= 1 && <p className="text-center text-slate-400 text-sm">Nenhuma movimentação extra.</p>}
    </div>
  );
};

// --- VIEWS ---

const DashboardView = ({ processes, onStateClick }) => {
  const active = processes.filter(p => p.status === 'Ativo').length;
  return (
    <div className="animate-in space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between">
           <div><p className="text-slate-500 text-xs font-bold">TOTAL</p><h3 className="text-3xl font-bold">{processes.length}</h3></div>
           <FileText size={32} className="text-indigo-600" />
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between">
           <div><p className="text-slate-500 text-xs font-bold">ATIVOS</p><h3 className="text-3xl font-bold">{active}</h3></div>
           <Briefcase size={32} className="text-blue-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
         <h3 className="font-bold mb-4">Mapa de Processos</h3>
         <BrazilMap processes={processes} onStateClick={onStateClick} />
      </div>
    </div>
  );
};

const ListView = ({ processes, filter, setFilter, setView, setSelId }) => {
  const [q, setQ] = useState('');
  const list = processes
    .filter(p => !filter || p.uf === filter)
    .filter(p => !q || p.client.toLowerCase().includes(q.toLowerCase()) || p.cnj.includes(q));

  return (
    <div className="animate-in space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Lista {filter ? `(${filter})` : ''}</h2>
        <div className="flex gap-2">
            {filter && <button onClick={()=>setFilter(null)} className="text-xs underline text-indigo-600">Limpar</button>}
            <input placeholder="Buscar..." className="border rounded p-1 text-sm" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr><th className="p-3">Cliente</th><th className="p-3">Tribunal</th><th className="p-3">Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y">
                {list.map(p => (
                    <tr key={p.id} onClick={()=>{setSelId(p.id); setView('detail')}} className="hover:bg-slate-50 cursor-pointer">
                        <td className="p-3 font-medium">{p.client}<br/><span className="text-xs text-slate-400 font-mono">{p.cnj}</span></td>
                        <td className="p-3">{p.trt}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(p.status)}`}>{p.status}</span></td>
                        <td className="p-3 text-right"><ChevronRight size={16} className="text-slate-300" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
        {list.length === 0 && <div className="p-8 text-center text-slate-400">Nada encontrado.</div>}
      </div>
    </div>
  );
};

const FormView = ({ onSave, onCancel }) => {
    const [f, setF] = useState({ client: '', uf: 'SP', trt: 'TRT-15', cnj: '' });
    return (
        <div className="animate-in max-w-lg mx-auto bg-white p-8 rounded-xl border shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle className="text-indigo-600"/> Novo Processo</h2>
            <form onSubmit={e => { e.preventDefault(); onSave({...f, id: Date.now().toString(), status: 'Ativo', movements: [{id:'initial', title:'Cadastro', date: new Date().toISOString(), type: 'Admin', description: 'Processo iniciado.'}] }); }} className="space-y-4">
                <div><label className="text-xs font-bold text-slate-500 block mb-1">CLIENTE</label><input required className="w-full border p-2 rounded" value={f.client} onChange={e=>setF({...f, client: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 block mb-1">UF</label><select className="w-full border p-2 rounded bg-white" value={f.uf} onChange={e=>{
                        const trt = TRT_REGIONS.find(r=>r.states.includes(e.target.value))?.trt || '';
                        setF({...f, uf: e.target.value, trt});
                    }}>{UF_LIST.map(u=><option key={u}>{u}</option>)}</select></div>
                    <div><label className="text-xs font-bold text-slate-500 block mb-1">TRIBUNAL</label><input className="w-full border p-2 rounded bg-slate-100" readOnly value={f.trt} /></div>
                </div>
                <div><label className="text-xs font-bold text-slate-500 block mb-1">CNJ (20 Dígitos)</label><input required placeholder="0010495-16.2023.5.15.0112" className="w-full border p-2 rounded font-mono" value={f.cnj} onChange={e=>setF({...f, cnj: maskCNJ(e.target.value)})} /></div>
                <div className="flex gap-2 pt-4">
                    <button type="button" onClick={onCancel} className="flex-1 border p-2 rounded hover:bg-slate-50">Cancelar</button>
                    <button className="flex-1 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Salvar</button>
                </div>
            </form>
        </div>
    );
};

const DetailView = ({ process, onBack, onUpdate }) => {
    const [add, setAdd] = useState(false);
    const [m, setM] = useState({ title: '', type: 'Documento', description: '', date: new Date().toISOString().split('T')[0] });

    if (!process) return null;

    const handleAdd = (e) => {
        e.preventDefault();
        const updated = { ...process, movements: [{...m, id: Date.now().toString()}, ...(process.movements || [])] };
        onUpdate(updated);
        setAdd(false);
        setM({ title: '', type: 'Documento', description: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleDel = (id) => {
        const updated = { ...process, movements: (process.movements || []).filter(x => x.id !== id) };
        onUpdate(updated);
    };

    return (
        <div className="animate-in max-w-3xl mx-auto space-y-6">
            <button onClick={onBack} className="text-sm text-slate-500 flex items-center gap-1 hover:text-indigo-600"><ArrowLeft size={16}/> Voltar</button>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-slate-50 flex justify-between items-start">
                    <div><h1 className="text-2xl font-bold">{process.client}</h1><p className="font-mono text-slate-500">{process.cnj}</p></div>
                    <div className="text-right">
                        <select className={`text-xs font-bold p-1 rounded border ${getStatusColor(process.status)}`} value={process.status} onChange={e => onUpdate({...process, status: e.target.value})}>
                            {['Ativo', 'Arquivado', 'Suspenso', 'Execução'].map(s=><option key={s}>{s}</option>)}
                        </select>
                        <p className="text-xs text-slate-400 mt-2">{process.trt}</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-bold text-slate-700">Histórico</h3>
                        <button onClick={()=>setAdd(!add)} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold hover:bg-indigo-200">+ Movimentação</button>
                    </div>
                    {add && (
                        <form onSubmit={handleAdd} className="mb-6 p-4 bg-slate-50 border border-dashed rounded-lg space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <select className="border p-1 rounded" value={m.type} onChange={e=>setM({...m, type: e.target.value})}><option>Documento</option><option>Audiência</option><option>Prazo</option></select>
                                <input type="date" className="border p-1 rounded" value={m.date} onChange={e=>setM({...m, date: e.target.value})} />
                            </div>
                            <input required placeholder="Título" className="w-full border p-1 rounded" value={m.title} onChange={e=>setM({...m, title: e.target.value})} />
                            <textarea placeholder="Descrição" className="w-full border p-1 rounded" value={m.description} onChange={e=>setM({...m, description: e.target.value})} />
                            <button className="w-full bg-indigo-600 text-white p-1 rounded text-xs font-bold">Adicionar</button>
                        </form>
                    )}
                    <ProcessTimeline movements={process.movements} onDelete={handleDel} />
                </div>
            </div>
            
            <div id="printable-report" className="hidden">
                 <div className="p-10 font-serif">
                     <h1 className="text-2xl text-center mb-10 border-b pb-4">Relatório Processual - JMD</h1>
                     <h2 className="text-xl font-bold">{process.client}</h2>
                     <p>{process.cnj}</p>
                     <hr className="my-4"/>
                     {(process.movements || []).map(m => (
                         <div key={m.id || Math.random()} className="mb-4">
                             <p className="font-bold">{formatDate(m.date)} - {m.title}</p>
                             <p>{m.description}</p>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

const CalculatorView = () => {
    const [d, setD] = useState(15);
    const [s, setS] = useState(new Date().toISOString().split('T')[0]);
    const [r, setR] = useState(null);

    const calc = () => {
        let curr = new Date(s); curr.setDate(curr.getDate() + 1);
        let c = 0;
        while(c < d) {
            if(curr.getDay()!==0 && curr.getDay()!==6) c++;
            if(c < d) curr.setDate(curr.getDate()+1);
        }
        setR(curr);
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl border shadow-md animate-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-indigo-600"/> Calculadora de Prazos</h2>
            <div className="space-y-4">
                <div><label className="text-xs font-bold text-slate-500 block">Publicação</label><input type="date" className="w-full border p-2 rounded" value={s} onChange={e=>setS(e.target.value)}/></div>
                <div><label className="text-xs font-bold text-slate-500 block">Dias (Úteis)</label><input type="number" className="w-full border p-2 rounded" value={d} onChange={e=>setD(e.target.value)}/></div>
                <button onClick={calc} className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700">Calcular</button>
                {r && <div className="mt-4 p-4 bg-green-50 text-green-800 text-center rounded border border-green-200 font-bold text-xl">Fatal: {formatDate(r.toISOString().split('T')[0])}</div>}
            </div>
        </div>
    );
};

const CalendarView = ({ processes, onClick }) => {
    const events = processes.flatMap(p => (p.movements || []).filter(m => m.type === 'Audiência' || m.type === 'Prazo').map(m => ({ ...m, pid: p.id, client: p.client }))).sort((a,b) => new Date(a.date) - new Date(b.date));
    return (
        <div className="max-w-4xl mx-auto animate-in bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50 font-bold text-slate-700 flex items-center gap-2"><CalendarIcon size={18}/> Agenda de Compromissos</div>
            <div className="divide-y">
                {events.map((e, i) => (
                    <div key={i} onClick={() => onClick(e.pid)} className="p-4 hover:bg-slate-50 cursor-pointer flex gap-4 items-center">
                        <div className="text-center w-12"><div className="text-xl font-bold text-slate-800">{new Date(e.date).getDate()}</div><div className="text-[10px] uppercase text-slate-500">{new Date(e.date).toLocaleDateString('pt-BR',{month:'short'})}</div></div>
                        <div className="flex-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-white ${e.type==='Audiência'?'bg-orange-400':'bg-red-400'}`}>{e.type}</span>
                            <h4 className="font-bold text-sm mt-1">{e.title}</h4>
                            <p className="text-xs text-slate-500">{e.client}</p>
                        </div>
                        <ChevronRight className="text-slate-300"/>
                    </div>
                ))}
                {events.length === 0 && <div className="p-8 text-center text-slate-400">Nenhum compromisso futuro.</div>}
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---

export default function App() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState('dashboard');
  const [procs, setProcs] = useState([]);
  const [selId, setSelId] = useState(null);
  const [uf, setUf] = useState(null);

  // Carregar dados (Híbrido API/Local)
  useEffect(() => {
    const load = async () => {
        try {
            const res = await fetch('/api/processes');
            if(res.ok) { const d = await res.json(); if(Array.isArray(d)) { setProcs(d); return; } }
        } catch(e) {}
        const local = localStorage.getItem('jmd_db_v6');
        if(local) try { setProcs(JSON.parse(local)); } catch(e) {}
    };
    if(auth) load();
  }, [auth]);

  // Salvar Local
  useEffect(() => {
      if(procs.length > 0) localStorage.setItem('jmd_db_v6', JSON.stringify(procs));
  }, [procs]);

  const save = async (np) => {
     // Tenta salvar na API, senão salva local
     try { await fetch('/api/processes', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(np)}); } catch(e) {}
     setProcs([np, ...procs]);
     setView('dashboard');
  };

  const update = async (updatedProc) => {
     try { await fetch(`/api/processes/${updatedProc.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updatedProc)}); } catch(e) {}
     setProcs(procs.map(p => p.id === updatedProc.id ? updatedProc : p));
  };

  if(!auth) return (
      <>
        <GlobalStyles />
        <LoginView onLogin={() => setAuth(true)} />
      </>
  );

  return (
    <div className="flex h-screen text-slate-900">
      <GlobalStyles />
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 font-bold text-center text-lg tracking-wider">JMD Processos</div>
        <nav className="flex-1 p-4 space-y-2">
            <button onClick={()=>{setUf(null); setView('dashboard')}} className={`w-full flex gap-3 p-3 rounded hover:bg-slate-800 ${view==='dashboard'?'bg-indigo-600':''}`}><LayoutDashboard size={20}/> Visão Geral</button>
            <button onClick={()=>{setUf(null); setView('list')}} className={`w-full flex gap-3 p-3 rounded hover:bg-slate-800 ${view==='list'?'bg-indigo-600':''}`}><Search size={20}/> Processos</button>
            <button onClick={()=>setView('calendar')} className={`w-full flex gap-3 p-3 rounded hover:bg-slate-800 ${view==='calendar'?'bg-indigo-600':''}`}><CalendarIcon size={20}/> Agenda</button>
            <button onClick={()=>setView('calculator')} className={`w-full flex gap-3 p-3 rounded hover:bg-slate-800 ${view==='calculator'?'bg-indigo-600':''}`}><Calculator size={20}/> Calculadora</button>
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={()=>setView('form')} className="w-full bg-indigo-600 p-3 rounded font-bold flex justify-center gap-2 hover:bg-indigo-700"><PlusCircle/> Novo</button></div>
      </aside>
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
         <ErrorBoundary>
            {view === 'dashboard' && <DashboardView processes={procs} onStateClick={(u)=>{setUf(u); setView('list')}} />}
            {view === 'list' && <ListView processes={procs} filter={uf} setFilter={setUf} setView={setView} setSelId={setSelId} />}
            {view === 'form' && <FormView onSave={save} onCancel={()=>setView('dashboard')} />}
            {view === 'detail' && <DetailView process={procs.find(p=>p.id===selId)} onBack={()=>setView('list')} onUpdate={update} onAddMovement={()=>{}} onDeleteMovement={()=>{}} />}
            {view === 'calendar' && <CalendarView processes={procs} onClick={(id)=>{setSelId(id); setView('detail')}} />}
            {view === 'calculator' && <CalculatorView />}
         </ErrorBoundary>
      </main>
    </div>
  );
}

// Injeção de estilo e renderização final
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
