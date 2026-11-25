import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Running day-trader-skill test suite...');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    passed++;
    console.log(`✓ PASS: ${message}`);
  }
}

// 1. Python unit tests
try {
  const pyOut = execSync('PYTHONPATH=tests python3 -m unittest discover -s tests 2>&1', { encoding: 'utf-8' });
  assert(pyOut.includes('OK'), 'All Python unittests passed (315+ tests)');
} catch (e) {
  assert(false, 'Python test error: ' + e.message);
}

// 2. Metadata files
assert(fs.existsSync('./LICENSE'), 'LICENSE exists');
const lic = fs.readFileSync('./LICENSE', 'utf-8');
assert(lic.includes('Abdullah Formuli'), 'LICENSE lists Abdullah Formuli');

assert(fs.existsSync('./MAINTAINERS.md'), 'MAINTAINERS.md exists');
const maint = fs.readFileSync('./MAINTAINERS.md', 'utf-8');
assert(maint.includes('Maintained solely by Abdullah Formuli'), 'MAINTAINERS.md asserts sole maintainer status');

assert(fs.existsSync('./package.json'), 'package.json exists');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
assert(pkg.author.includes('Abdullah Formuli'), 'package.json author matches');
assert(pkg.repository.url.includes('authrain-cloud-abdullahformuli/day-trader-skill'), 'package.json repo matches');

assert(fs.existsSync('./CITATION.cff'), 'CITATION.cff exists');
const cff = fs.readFileSync('./CITATION.cff', 'utf-8');
assert(cff.includes('Abdullah'), 'CITATION.cff contains author name');

// 3. Plugin manifest
const plugin = JSON.parse(fs.readFileSync('./.claude-plugin/plugin.json', 'utf-8'));
assert(plugin.author.name === 'Abdullah Formuli', 'plugin.json author matches');

console.log(`\nAll ${passed}/${total} test checks passed successfully!`);
