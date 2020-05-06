const express = require('express')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://tfcxapmrfbwkcq:43695daad5506f1514de9ec0ee5e37fed9514ae2507139aee85284584420c18a@ec2-54-217-213-79.eu-west-1.compute.amazonaws.com:5432/d4fv13je3mkhai",
  ssl: true
});


var app = express();

app.get('/', function (req, res) {
    res.send('Hello World! Prueba');
});

app.get('/clientes', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM cliente');
        const results = { 'results': (result) ? result.rows : null};
        
        var clientes = results['results'];
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ clientes }));
        
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Entro en el catch => " + err);
    }
});

app.get('/cursos', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM cursos');
        const results = { 'results': (result) ? result.rows : null};
        
        var cursos = results['results'];
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ cursos }));
        
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Entro en el catch => " + err);
    }
});


app.get('/login/:mail/:password', async (req, res) => {
    try {
        const client = await pool.connect();
        var mail = req.params.mail;
        var password = req.params.password;

        const result = await client.query("SELECT * FROM cliente where mail = '" + mail + "' AND password = '" + password + "'");
        const results = { 'results': (result) ? result.rows : null};
        
        var clientes = results['results'];
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ clientes }));
        
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Entro en el catch => " + err);
    }
});

app.post('/registrar/:nombre/:apellidos/:mail/:password', async (req, res) => {
    try {
        const client = await pool.connect()
        var data =req.body;

        var nombre = data.nombre;
        var apellidos = data.apellidos;
        var email = data.mail;
        var password = data.password;

        const result = await client.query("INSERT INTO cliente (nombre, apellidos, mail, password) values ('" + nombre + "', '" + apellidos + "', '" + email + "', '" + password +"')");

        const results = { 'results': (result) ? result.rows : null};
        var clientes = results['results'];

        var dataResponse = {
            codigo: 0,
            texto: "",
        };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dataResponse));
        client.release();

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(PORT, function () {
  console.log('Example app listening on port 5000!');
});