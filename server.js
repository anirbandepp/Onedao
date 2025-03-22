const cluster = require('cluster');
const os = require('os');

const app = require('./gateway/app');

const configure = require('./bootstrap/config.js');

const startServer = () => {

    const PORT = configure.port || 3000;

    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    startServer();
    console.log(`Worker ${process.pid} started`);
}