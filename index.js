const express = require('express')
var mysql = require('mysql')
const app = express()
const port = 3000
var morgan = require('morgan')
app.use(morgan('combined'))
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"db_app"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', (req, res) => {
  res.send('Olá mundo!')
})

app.get('/encanado', (req, res) => {
    res.send()
  })

app.use('/login', (req, res) => {
    console.log(req.body.usuario);
    nome = req.body.usuario;
    senha = req.body.senha;
    con.connect(function(err){
      if (err) throw err;
    con.query('SELECT usuario,senha FROM usuarios where usuario = ${nome}  and senha = ${senha}'
    , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
    });
    res.send()
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})