const express = require('express')
const app = express()
const port = 3000
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const morgan = require('morgan');
const { json } = require('body-parser');
const { response } = require('express');
app.use(morgan('combined'))
app.use(express.json())

function connect(){
  if(global.connection && global.connection.state !== 'disconnected')
      return global.connection;
  const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database:"db_app"  
  });
  global.connection = connection;
  console.log("Conectou ao MySQL!!!");
  return connection;
}

app.get('/', (req, res) => {
  res.send('Olá mundo!')
})

//retorna todos usuarios
app.get('/usuarios', (req, res) => {
  const conn = connect();
  conn.query('SELECT * FROM usuarios;',
  function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
      res.send();
  });
})

//retorna o usuario pelo id
app.get('/usuarios/:id?', (req, res) =>{
  const conn = connect();  
  let filter = '';
  if(req.params.id) filter = ' WHERE id =' + parseInt(req.params.id);
  conn.query('SELECT * FROM usuarios' + filter,
  function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
      res.send();
  });
  })

//adiciona um novo usuario
app.post('/usuario/novo', (req, res) => {
    const conn = connect(); 
    id=req.body.id;
    usuario=req.body.usuario;
    senha=req.body.senha;
    console.log("novo usuario: "+" nome:"+req.body.usuario+" senha:"+req.body.senha+ " id:"+req.body.id);
    conn.query('INSERT INTO usuarios(id,usuario,senha) VALUES (?,?,?)',[id,usuario,senha],
      function(err, result, fields) {
          if (err) throw err;
          console.log(result);
      }
    );
    res.send()
})

//deleta usuario por id
app.get('/usuarios/del/:id?', (req, res) =>{
  const conn = connect();   
  let filter = '';
    id = parseInt(req.params.id);
    if(req.params.id) filter = ' WHERE ID=' + id;
    conn.query('DELETE FROM usuarios' + filter,
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
      res.send();
  });
})

//authentication
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'luiz' && req.body.password === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    res.status(403).json({message: 'Login inválido!'});
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

function verificaJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})