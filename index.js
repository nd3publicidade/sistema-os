
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/os', upload.single('arquivo'), async (req, res) => {
  const { cliente, servico, prazo, observacoes } = req.body;
  const arquivo = req.file.path;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: 'Sistema OS <' + process.env.EMAIL_USER + '>',
      to: 'contato@nd3.com.br',
      subject: `Nova OS de ${cliente}`,
      text: `Serviço: ${servico}\nPrazo: ${prazo}\nObservações: ${observacoes}`
    });

    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: 'Erro ao enviar e-mail.' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
