// index.js
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware para permitir JSON e requisições externas
app.use(cors());
app.use(express.json());

// Rota para teste
app.get('/', (req, res) => {
  res.send('Backend do Arranchamento funcionando!');
});

// Rota de login de teste
app.post('/login', (req, res) => {
  const { idMilitar, senha } = req.body;

  // Aqui por enquanto é apenas teste, depois conecta no banco
  if (idMilitar === 'teste' && senha === '1234') {
    res.json({ success: true, message: 'Login bem-sucedido' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
