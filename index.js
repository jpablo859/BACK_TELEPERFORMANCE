const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

dbConnection();

app.use(cors());

app.use(express.json());

app.use('/api/user', require('./routes/user.routes'));

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${ PORT }`));