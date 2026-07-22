const fs = require('fs');
let h = fs.readFileSync('play.html', 'utf8');
const main = fs.readFileSync('_play-main.html', 'utf8').trim();
h = h.replace(/<main class="main">[\s\S]*?<\/main>/, main);
h = h.replace(
  /content="[^"]*Queue Clear[^"]*"/g,
  'content="Monitor Snake — a small dual-monitor arcade game."'
);
h = h.replace(
  /Three quick browser games[^"]*/g,
  'Monitor Snake — a small dual-monitor arcade game.'
);
fs.writeFileSync('play.html', h);
fs.unlinkSync('_play-main.html');
fs.unlinkSync(__filename);
console.log('play ok');
