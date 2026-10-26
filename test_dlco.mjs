import { runAllAutomatedTests } from './src/engine/testRunner.ts';

console.log('====================================================');
console.log('DLCO VIRTUAL TRAINER KIT — AUTOMATED VERIFICATION SUITE');
console.log('====================================================\n');

const report = runAllAutomatedTests();

let currentGroup = '';
report.results.forEach(item => {
  if (item.group !== currentGroup) {
    currentGroup = item.group;
    console.log(`\n${currentGroup}:`);
  }
  const symbol = item.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`  ${symbol}: ${item.name}`);
  if (item.message) {
    console.log(`    ↳ ${item.message}`);
  }
});

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${report.passed} / ${report.total} PASSED (${((report.passed / report.total) * 100).toFixed(1)}%)`);
console.log(`FAILURES: ${report.failed}`);
console.log('====================================================\n');

if (report.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
