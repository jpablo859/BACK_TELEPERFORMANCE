const mongoose = require('mongoose');


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URI_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos conectada con éxito');
    } catch(err) {
        console.log(err)
        throw new Error('No se pudo inicializar la base de datos');
    }
}

module.exports = {
    dbConnection
}