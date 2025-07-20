import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8080;

// 🔐 Substitua pelo seu token real do Mercado Pago
const ACCESS_TOKEN = 'APP_USR-1378505679701152-062318-23aa10aba2feed996702d01a0eeb5855-2035935017';

app.use(bodyParser.json());

app.post('/webhook-mercadopago', async (req, res) => {
  const { topic, id } = req.query;

  console.log('🔔 Webhook recebida:', { topic, id });

  if (topic === 'payment') {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      });

      const pagamento = await response.json();
      console.log('📦 Detalhes do pagamento:', pagamento);

      if (pagamento.status === 'approved') {
        console.log(`✅ Pagamento aprovado para ID ${pagamento.id}`);
        // Aqui você pode liberar produto, registrar no banco, etc.
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error('❌ Erro ao consultar pagamento:', error);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook ativa na rota /webhook-mercadopago na porta ${PORT}`);
});
