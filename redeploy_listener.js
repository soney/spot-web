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

function pause(ms) {
    return new Promise((resolve, reject) => {
	setTimeout(resolve, ms);
    });
}

let inWaitingPeriod = false;
let currentlyBuilding = false;
let pending = false;
const build = async () => {
    if(currentlyBuilding && !inWaitingPeriod) {
	pending = true;
    } else {
	let shouldRebuildWhenDone = pending;
	pending = false;
	currentlyBuilding = true;

	inWaitingPeriod = true;
	await pause(1000 * 5);
	inWaitingPeriod = false;
        await pull();
        await deploy();
	currentlyBuilding = false;
	if(shouldRebuildWhenDone) {
	    await build();
	    pending = false;
	}
    }
};


const port = 8889;
http.createServer(async (req, res) => {
    res.end(inWaitingPeriod ? 'noted' : (currentlyBuilding ? 'queue' : 'build'));
    await build();
}).listen(port);

setInterval(async () => {
    console.log('auto pull...');
    const changed = await pull();

    if(changed) {
        await deploy();
    }
}, 1000*60*60*24);

console.log(`listening on port ${port}`);
