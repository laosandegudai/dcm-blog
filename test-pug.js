const path = require('path');
const rendererPath = path.join(process.cwd(), 'node_modules/.pnpm/hexo-renderer-pug@3.0.0/node_modules/hexo-renderer-pug');
const pugPath = path.join(rendererPath, 'node_modules', 'pug');

let pug;
try {
  pug = require(pugPath);
} catch(e) {
  console.log('Could not load pug from renderer, trying direct...');
  console.log(e.message);
  process.exit(1);
}

// Test 1: !{} interpolation inside script. block
const tpl1 = `script.
  var x = "!{name}";`;
const fn1 = pug.compile(tpl1);
console.log('Test 1 (script. with !{}):');
console.log(fn1({ name: 'hello' }));

// Test 2: using | and !{} inside script tag
const tpl2 = `script
  | var x = "!{name}";`;
const fn2 = pug.compile(tpl2);
console.log('\nTest 2 (script with | and !{}):');
console.log(fn2({ name: 'hello' }));

// Test 3: script with attribute interpolation
const tpl3 = `script(src="https://example.com/js?" + name)`;
const fn3 = pug.compile(tpl3);
console.log('\nTest 3 (script with attribute):');
console.log(fn3({ name: 'abc123' }));
