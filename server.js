const app = require('./gateway/app');

const configure = require('./bootstrap/config.js');

const startServer = () => {

    const PORT = configure.port || 3000;

    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}

startServer();