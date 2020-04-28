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
  
    
    res.send('Hello World!');
});

app.get('/clientes', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM cliente');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.listen(PORT, function () {
  console.log('Example app listening on port 5000!');
});