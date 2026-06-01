const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/tranzinc/g, 'translate');
  content = content.replace(/isozinc/g, 'isolate'); // Just in case isolate -> isozinc happened
  
  if (original !== content) {
    fs.writeFileSync(file, content);
  }
}

walk('src').forEach(fix);
console.log('Fixed typos!');
