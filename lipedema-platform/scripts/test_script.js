const fs = require('fs');
console.log('Test script running');
fs.writeFileSync('test_output.txt', 'Script ran successfully');
console.log('Done');
