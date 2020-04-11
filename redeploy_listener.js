const http = require('http');
const { spawn } = require('child_process');
const simpleGit = require('simple-git');

const directoryGit = simpleGit(__dirname);

function pull() {
    return new Promise((resolve, reject) => {
        directoryGit.pull((err, update) => {
            if(update.files.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    })
}
function deploy() {
    return new Promise((resolve, reject) => {
        const buildSpawn = spawn('npm', ['run', 'build'], {stdio: 'inherit', shell: true})
        buildSpawn.on('error', (err) => {
            console.error(err);
        });
        buildSpawn.on('close', (code, signal) => {
            if(code === 0) {
                resolve();
            } else {
                reject(code);
            }
            console.log(`child process terminated due to signal ${signal}, ${code}`);
        });
    });
}

const port = 8889;
http.createServer((req, res) => {
    pull().then((changed) => {
        return deploy();
    }).then(() => {
        res.end('ok');
    })
}).listen(port);

setInterval(() => {
    console.log('auto pull...');
    pull().then((changed) => {
        if(changed) {
            return deploy();
        }
    });
}, 1000*60*30);

console.log(`listening on port ${port}`);
