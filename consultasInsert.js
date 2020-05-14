const express = require('express')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const crypto = require('crypto');

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

app.get('/cursos/grado/:grado_id', async (req, res) => {
    try {
        const client = await pool.connect();
        var grado_id = req.params.grado_id;
        
        const result = await client.query('SELECT * FROM grados where grado_id = ' + grado_id);
        const results = { 'results': (result) ? result.rows : null};
        
        var grado = results['results'];
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ grado }));
        
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Entro en el catch => " + err);
    }
});

app.get('/cursos/master/:master_id', async (req, res) => {
    try {
        const client = await pool.connect();
        var master_id = req.params.master_id;
        
        const result = await client.query('SELECT * FROM masters where master_id = ' + master_id);
        const results = { 'results': (result) ? result.rows : null};
        
        var master = results['results'];
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ master }));
        
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

        var hash = crypto.createHmac('sha256', password).digest('hex');
        
        const result = await client.query("SELECT * FROM cliente where mail = '" + mail + "' AND password = '" + hash + "'");
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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/registrar', async (req, res) => {
    try {
        const client = await pool.connect()
        var data =req.body;

        var nombre = data.nombre;
        var apellidos = data.apellidos;
        var email = data.mail;
        var password = data.password;

        var hash = crypto.createHmac('sha256', password).digest('hex');
        
        const result = await client.query("INSERT INTO cliente (nombre, apellidos, mail, password) values ('" + nombre + "', '" + apellidos + "', '" + email + "', '" + hash +"')");

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

app.post('/inscripcion', async (req, res) => {
    try {
        const client = await pool.connect()
        var data =req.body;

        var inscripcion_id = data.inscripcion_id;
        var curso_id = data.curso_id;
        var cliente_id = data.cliente_id;
        
        const result = await client.query("INSERT INTO inscripciones (inscripcion_id, curso_id, cliente_id) values ('" + inscripcion_id + "', '" + curso_id + "', '" + cliente_id +"')");

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