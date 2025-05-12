const http = require('http');
const { spawn } = require('child_process');
const simpleGit = require('simple-git');

const directoryGit = simpleGit(__dirname);

function pull() {
    return new Promise((resolve, reject) => {
        directoryGit.pull((err, update) => {
            if(err) {
                console.error(err);
                reject(err);
            } else {
                if(update && update.files && update.files.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    })
}
function deploy() {
    return new Promise((resolve, reject) => {
        const buildSpawn = spawn('yarn', ['deploy'], {stdio: 'inherit', shell: true})
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

async function doBuild() {
    await pull();
    await deploy();
}


let inWaitingPeriod = false;
let currentlyBuilding = false;
let pending = false;
const build = async () => {
    if(inWaitingPeriod) {
        console.log(getDateString() + ": " + "In waiting period, not building");
        return;
    } else if(currentlyBuilding) {
        console.log(getDateString() + ": " + "Adding to queue");
        pending = true;
    } else {
        console.log(getDateString() + ": " + "Request to build recieved. Entering waiting period");
        pending = false;
        currentlyBuilding = true;

        inWaitingPeriod = true;
        console.log(getDateString() + ": " + "Begin pause");
        await pause(1000 * 60 * 5);
        console.log(getDateString() + ": " + "End pause");
        inWaitingPeriod = false;
        await doBuild();
        currentlyBuilding = false;
        if(pending) {
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

// setInterval(async () => {
//     console.log('auto pull...');
//     const changed = await pull();

//     if(changed) {
//         await deploy();
//     }
// }, 1000*60*60*24);

console.log(`listening on port ${port}`);

function getDateString() {
	const now = new Date();

	const options = {
	  weekday: 'long',
	  year: 'numeric',
	  month: 'long',
	  day: 'numeric',
	  hour: 'numeric',
	  minute: '2-digit',
	  hour12: true, // for AM/PM format
      timeZone: 'America/New_York'
	};

	const naturalString = now.toLocaleString('en-US', options);
	return naturalString;
}
