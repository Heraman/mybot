const { spawn } = require('child_process')
const path = require('path')
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;

// Route utama untuk cek status bot
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

function start() {
    let args = [path.join(__dirname, 'run.js'), ...process.argv.slice(2)]
    console.log([process.argv[0], ...args].join('\n'))
    let p = spawn(process.argv[0], args, {
          stdio: ['inherit', 'inherit', 'inherit', 'ipc']
       })
       .on('message', data => {
          if (data == 'reset') {
             console.log('Restarting Bot...')
             p.kill()
             start()
             delete p
          }
       })
       .on('exit', code => {
          console.error('Exited with code:', code)
          if (code == '.' || code == 1 || code == 0) start()
       })
 }
 start()

 app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});