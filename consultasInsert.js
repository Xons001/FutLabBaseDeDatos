const express = require('express')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

app.get('/login/:mail/:password', async (req, res) => {
    try {
        const client = await pool.connect();
        var mail = req.params.mail;
        var password = req.params.password;
        console.log(mail);
        console.log(password);
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

app.listen(PORT, function () {
  console.log('Example app listening on port 5000!');
});