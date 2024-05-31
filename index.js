const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.post('/content', async (req, res) => {
    try {
      const alunoData = req.body;
  
      const requiredFields = ['name', 'email', 'cpf', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !(field in alunoData));
  
      if (missingFields.length > 0) {
        return res.status(400).send({ error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` });
      }
  
      const docRef = await db.collection("alunos").doc().set({
        name: alunoData.name,
        email: alunoData.email,
        cpf: alunoData.cpf,
        phoneNumber: alunoData.phoneNumber,
        reproved: false
    });
  
      res.status(201).send({ id: docRef.id });
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      res.status(500).send({ error: 'Erro ao criar aluno' });
    }
  });  
  

app.get('/contents', async (req, res) => {
  try {
    const snapshot = await db.collection('alunos').get();
    const alunos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(alunos);
  } catch (error) {
    res.status(500).send({ error: 'Erro ao buscar alunos' });
  }
});

app.put('/contents/:contentId', async (req, res) => {
    try {
      const contentId = req.params.contentId;
      const data = req.body;
      if (!data || !data.name || !data.email || !data.cpf || !data.phoneNumber || !data.reproved) {
        return res.status(400).send({ error: 'Corpo da requisição inválido' });
      }
      await db.collection('alunos').doc(contentId).set(data, { merge: true });
      res.status(204).send();
    } catch (error) {
      res.status(500).send({ error: 'Erro ao atualizar aluno' });
    }
  });
  

app.delete('/contents/:contentId', async (req, res) => {
  try {
    const contentId = req.params.contentId;
    await db.collection('alunos').doc(contentId).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Erro ao deletar aluno' });
  }
});

app.listen(8080, function () {
  console.log('Iniciado na porta 8080');
});