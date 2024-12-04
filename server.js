// Importando dependências
const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const cors = require('cors');  // Importando o cors

// Carregar variáveis do arquivo .env
dotenv.config();

// Criando uma instância do servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Configurando o Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Usando o middleware CORS para permitir requisições de qualquer origem
app.use(cors());  // Isso permite requisições de qualquer origem. Em produção, você pode restringir.

// Definindo uma rota para enviar a mensagem
app.get('/enviar-mensagem', (req, res) => {
  const { destinatario, mensagem } = req.query;

  if (!destinatario || !mensagem) {
    return res.status(400).json({ error: 'É necessário passar os parâmetros "destinatario" e "mensagem".' });
  }

  // Enviar a mensagem usando o Twilio
  client.messages
    .create({
      from: process.env.TWILIO_SANDBOX_NUMBER, // Número do sandbox do Twilio
      to: `whatsapp:${destinatario}`,          // Número de destino com o prefixo whatsapp:
      body: mensagem                          // Mensagem a ser enviada
    })
    .then(message => {
      // Responde com a SID da mensagem em formato JSON
      res.json({ sid: message.sid });
    })
    .catch(error => {
      res.status(500).json({ error: `Erro ao enviar mensagem: ${error.message}` });
    });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
