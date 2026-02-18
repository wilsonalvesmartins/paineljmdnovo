import React, { useState, useEffect, useMemo } from 'react';
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
 * Versão 5.2 - Sistema Unificado e Blindado
 */

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
  
  // Formato: 0010495-16.2023.5.15.0112 (7-2.4.1.2.4)
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

// --- COMPONENTES DE INTERFACE ---

const BrazilMap = ({ processes = [], onStateClick }) => {
  const stats = useMemo(() => {
    const data = {};
    processes.forEach(p => {
      if (!data[p.uf]) data[p.uf] = { total: 0 };
      data[p.uf].total++;
    });
    return data;
  }, [processes]);

  const getStateColor = (uf) => {
    const count = stats[uf]?.total || 0;
    return count === 0 ? '#e5e7eb' : count < 3 ? '#93c5fd' : '#1e40af';
  };

  const states = [
    { id: 'RR', x: 100, y: 30, r: 15 }, { id: 'AP', x: 180, y: 40, r: 12 }, { id: 'AM', x: 70, y: 80, r: 35 }, 
    { id: 'PA', x: 160, y: 90, r: 30 }, { id: 'AC', x: 30, y: 130, r: 12 }, { id: 'RO', x: 75, y: 150, r: 15 }, 
    { id: 'TO', x: 190, y: 140, r: 15 }, { id: 'MA', x: 215, y: 80, r: 15 }, { id: 'PI', x: 235, y: 95, r: 14 }, 
    { id: 'CE', x: 260, y: 75, r: 12 }, { id: 'RN', x: 285, y: 85, r: 10 }, { id: 'PB', x: 285, y: 100, r: 9 }, 
    { id: 'PE', x: 280, y: 115, r: 10 }, { id: 'AL', x: 285, y: 130, r: 8 }, { id: 'SE', x: 275, y: 140, r: 8 }, 
    { id: 'BA', x: 240, y: 160, r: 25 }, { id: 'MT', x: 120, y: 190, r: 25 }, { id: 'GO', x: 180, y: 200, r: 18 }, 
    { id: 'DF', x: 195, y: 195, r: 6 }, { id: 'MS', x: 130, y: 250, r: 20 }, { id: 'MG', x: 220, y: 230, r: 22 }, 
    { id: 'ES', x: 255, y: 235, r: 10 }, { id: 'RJ', x: 240, y: 265, r: 10 }, { id: 'SP', x: 190, y: 280, r: 20 }, 
    { id: 'PR', x: 170, y: 310, r: 15 }, { id: 'SC', x: 180, y: 335, r: 12 }, { id: 'RS', x: 160, y: 365, r: 18 }
  ];

  return (
    <div className="relative w-full h-96 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
      <svg viewBox="0 0 320 400" className="w-full h-full max-w-lg">
        {states.map((s) => (
          <g key={s.id} onClick={() => onStateClick(s.id)} className="cursor-pointer hover:opacity-80">
            <circle cx={s.x} cy={s.y} r={s.r} fill={getStateColor(s.id)} stroke="white" strokeWidth="2" />
            <text x={s.x} y={s.y} dy=".3em" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" pointerEvents="none">{s.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// --- VIEWS ---

const DashboardView = ({ processes, onStateClick }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
        <div><p className="text-slate-500 text-xs font-bold uppercase">Processos</p><h3 className="text-2xl font-bold">{processes.length}</h3></div>
        <FileText className="text-indigo-600" size={28} />
      </div>
      <div className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
        <div><p className="text-slate-500 text-xs font-bold uppercase">Ativos</p><h3 className="text-2xl font-bold">{processes.filter(p => p.status === 'Ativo').length}</h3></div>
        <Briefcase className="text-blue-600" size={28} />
      </div>
    </div>
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Abrangência Nacional</h3>
      <BrazilMap processes={processes} onStateClick={onStateClick} />
    </div>
  </div>
);

const ListView = ({ processes, filterState, setFilterState, onProcessClick }) => {
  const [term, setTerm] = useState('');
  const filtered = processes.filter(p => (!filterState || p.uf === filterState) && (!term || p.client.toLowerCase().includes(term.toLowerCase()) || p.cnj.includes(term)));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Processos {filterState ? `(${filterState})` : ''}</h2>
        <div className="relative w-64 flex items-center gap-2">
          {filterState && <button onClick={() => setFilterState(null)} className="text-xs text-indigo-600 underline">Limpar</button>}
          <input type="text" placeholder="Filtrar..." className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500" value={term} onChange={e => setTerm(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-slate-500 text-[10px] font-bold uppercase">
            <tr><th className="p-4">Cliente</th><th className="p-4">Tribunal</th><th className="p-4">Status</th><th className="p-4"></th></tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => onProcessClick(p.id)}>
                <td className="p-4"><div className="font-semibold text-slate-900">{p.client}</div><div className="text-xs text-slate-400 font-mono mt-0.5">{p.cnj}</div></td>
                <td className="p-4 text-slate-600 font-medium">{p.trt}</td>
                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(p.status)}`}>{p.status}</span></td>
                <td className="p-4 text-right"><ChevronRight size={16} className="text-slate-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-slate-400">Nenhum registo encontrado.</div>}
      </div>
    </div>
  );
};

const FormView = ({ onSave, onCancel }) => {
  const [f, setF] = useState({ client: '', uf: 'SP', trt: 'TRT-15', cnj: '' });
  return (
    <div className="max-w-xl mx-auto py-4">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Novo Cadastro</h2>
      <form onSubmit={e => { e.preventDefault(); onSave({...f, id: Date.now().toString(), status: 'Ativo', movements: []}); }} className="bg-white p-8 rounded-2xl border shadow-lg space-y-6">
        <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Cliente</label><input required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={f.client} onChange={e => setF({...f, client: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">UF</label><select className="w-full p-2.5 border rounded-lg bg-white" value={f.uf} onChange={e => setF({...f, uf: e.target.value})}>
            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(u => <option key={u}>{u}</option>)}
          </select></div>
          <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tribunal</label><input className="w-full p-2.5 border rounded-lg bg-slate-50" readOnly value={f.trt} /></div>
        </div>
        <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Número do Processo (CNJ)</label><input required placeholder="0010495-16.2023.5.15.0112" className="w-full p-2.5 border rounded-lg font-mono outline-none focus:ring-2 focus:ring-indigo-500" value={f.cnj} onChange={e => setF({...f, cnj: maskCNJ(e.target.value)})} /></div>
        <div className="flex gap-3 pt-4"><button type="button" onClick={onCancel} className="flex-1 p-3 bg-slate-100 rounded-lg text-sm font-bold">Cancelar</button><button type="submit" className="flex-1 p-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">Salvar</button></div>
      </form>
    </div>
  );
};

const DetailView = ({ process, onBack, onAddMovement, onDeleteMovement }) => {
  if (!process) return null;
  const [showAdd, setShowAdd] = useState(false);
  const [newM, setNewM] = useState({ title: '', date: new Date().toISOString().split('T')[0], type: 'Documento', description: '' });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="text-slate-400 flex items-center gap-1 text-sm hover:text-indigo-600 transition-colors"><ArrowLeft size={16} /> Voltar</button>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-8 border-b">
          <div className="flex justify-between items-start">
            <div><h1 className="text-3xl font-bold text-slate-900">{process.client}</h1><p className="font-mono text-lg text-slate-500 mt-1">{process.cnj}</p></div>
            <div className="text-right"><span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(process.status)} shadow-sm`}>{process.status}</span><p className="text-sm text-slate-500 font-medium mt-3">{process.trt}</p></div>
          </div>
        </div>
        <div className="p-8">
           <div className="flex justify-between items-center mb-8"><h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">Histórico Processual</h3><button onClick={() => setShowAdd(true)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold transition-colors">Adicionar Movimento</button></div>
           {showAdd && (
             <form onSubmit={e => { e.preventDefault(); onAddMovement(process.id, {...newM, id: Date.now().toString()}); setShowAdd(false); }} className="mb-10 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-2 border rounded-lg bg-white" value={newM.type} onChange={e => setNewM({...newM, type: e.target.value})}><option>Documento</option><option>Audiência</option><option>Prazo</option><option>Sentença</option></select>
                  <input type="date" className="p-2 border rounded-lg bg-white" value={newM.date} onChange={e => setNewM({...newM, date: e.target.value})} />
                </div>
                <input required placeholder="Título do Evento" className="w-full p-2 border rounded-lg bg-white" value={newM.title} onChange={e => setNewM({...newM, title: e.target.value})} />
                <textarea placeholder="Descrição..." className="w-full p-2 border rounded-lg bg-white" value={newM.description} onChange={e => setNewM({...newM, description: e.target.value})} />
                <div className="flex gap-2 justify-end"><button type="button" onClick={() => setShowAdd(false)} className="px-4 py-1.5 text-xs text-slate-500">Cancelar</button><button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">Salvar</button></div>
             </form>
           )}
           <div className="space-y-6">
              {process.movements.map((mov, idx) => (
                <div key={mov.id} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-6 group">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1"><h4 className="font-semibold text-sm text-slate-900">{mov.title}</h4><p className="text-xs text-slate-500 mt-1">{mov.description}</p></div>
                    <div className="flex flex-col items-end gap-2"><span className="text-xs text-slate-400">{formatDate(mov.date)}</span><button onClick={() => onDeleteMovement(process.id, mov.id)} className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
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
  const [ufFilter, setUfFilter] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('jmd_db_v5');
    if (data) try { setProcs(JSON.parse(data)); } catch(e) {}
  }, []);

  useEffect(() => { localStorage.setItem('jmd_db_v5', JSON.stringify(procs)); }, [procs]);

  if (!auth) return <LoginView onLogin={() => setAuth(true)} />;

  const handleSave = (np) => { setProcs([np, ...procs]); setView('dashboard'); };
  const handleAddMov = (pid, m) => { setProcs(procs.map(p => p.id === pid ? {...p, movements: [m, ...p.movements]} : p)); };
  const handleDelMov = (pid, mid) => { setProcs(procs.map(p => p.id === pid ? {...p, movements: p.movements.filter(x => x.id !== mid)} : p)); };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <style>{`
        body { margin: 0; background-color: #f8fafc; font-family: sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full transition-all z-20">
        <div className="p-8 border-b border-slate-800 text-center font-bold text-xl tracking-tight text-indigo-400 uppercase">JMD Processos</div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <button onClick={() => { setUfFilter(null); setView('dashboard'); }} className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard size={18} /> Visão Geral</button>
          <button onClick={() => { setUfFilter(null); setView('list'); }} className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}><Search size={18} /> Processos</button>
        </nav>
        <div className="p-6 border-t border-slate-800"><button onClick={() => setView('form')} className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"><PlusCircle size={18} /> Novo Processo</button></div>
      </aside>
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        <ErrorBoundary>
          {view === 'dashboard' && <DashboardView processes={procs} onStateClick={(uf) => { setUfFilter(uf); setView('list'); }} />}
          {view === 'list' && <ListView processes={procs} filterState={ufFilter} setFilterState={setUfFilter} onProcessClick={(id) => { setSelId(id); setView('detail'); }} />}
          {view === 'form' && <FormView onSave={handleSave} onCancel={() => setView('dashboard')} />}
          {view === 'detail' && <DetailView process={procs.find(x => x.id === selId)} onBack={() => setView('list')} onAddMovement={handleAddMov} onDeleteMovement={handleDelMov} />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
