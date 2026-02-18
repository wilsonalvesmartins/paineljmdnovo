import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Garante que a pasta de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Garante que o arquivo de banco de dados existe
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Funções auxiliares de Banco de Dados
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- API ROUTES ---

// Listar Processos
app.get('/api/processes', (req, res) => {
  const processes = readDB();
  res.json(processes);
});

// Adicionar Processo
app.post('/api/processes', (req, res) => {
  const processes = readDB();
  const newProcess = { ...req.body, id: Date.now().toString() };
  // Adiciona no topo
  processes.unshift(newProcess);
  writeDB(processes);
  res.json(newProcess);
});

// Atualizar Processo (Edição ou Nova Movimentação)
app.put('/api/processes/:id', (req, res) => {
  const processes = readDB();
  const index = processes.findIndex(p => p.id === req.params.id);
  
  if (index !== -1) {
    // Mescla os dados antigos com os novos
    processes[index] = { ...processes[index], ...req.body };
    writeDB(processes);
    res.json(processes[index]);
  } else {
    res.status(404).json({ error: 'Processo não encontrado' });
  }
});

// Deletar Processo (Opcional)
app.delete('/api/processes/:id', (req, res) => {
  let processes = readDB();
  processes = processes.filter(p => p.id !== req.params.id);
  writeDB(processes);
  res.json({ success: true });
});

// --- SERVIR O FRONTEND ---
// Serve os arquivos estáticos gerados pelo Vite (React)
app.use(express.static(path.join(__dirname, 'dist')));

// Qualquer outra rota retorna o index.html (para o SPA funcionar)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Banco de dados local: ${DB_FILE}`);
});
