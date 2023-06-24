import cluster from 'cluster'
import path from 'path'
import fs from 'fs'
import { createServer } from "http"
import { Server } from "socket.io"
import Readline from 'readline'
import { fileURLToPath } from 'url'
import yargs from 'yargs/yargs'
const rl = Readline.createInterface(process.stdin, process.stdout)
const __dirname = path.dirname(fileURLToPath(import.meta.url))


var isRunning = false
/**
* Start a js file
* @param {String} file `path/to/file`
*/
function start(file) {
if (isRunning) return
isRunning = true
let args = [path.join(__dirname, file), ...process.argv.slice(2)]
/*  CFonts.say([process.argv[0], ...args].join(' '), {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']
})*/
cluster.setupMaster({
exec: path.join(__dirname, file),
args: args.slice(1),
})
let p = cluster.fork()
p.on('message', data => {
console.log('[RECEIVED]', data)
  
switch (data) {

    
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break

    
case 'SIGABRT':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break

    
}
})
p.on('exit', (_, code) => {
if(code == null) process.exit()
isRunning = false
console.error('Exited with code:', code)

if (code === 0) return
fs.watchFile(args[0], () => {
fs.unwatchFile(args[0])
start(file)
})
})
let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})
// console.log(p)
}

start("bantuan.js")
