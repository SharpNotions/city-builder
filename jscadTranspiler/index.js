const fs = require('fs');
const path = require('path');
let inputString = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    inputString += chunk;
  }
});

process.stdin.on('end', () => {
  const cityData = JSON.parse(inputString);
  const cityJsCad = fs.readFileSync(path.join(__dirname, 'city.jscad'), 'utf8');

  fs.writeFileSync(path.join(__dirname, '../stl-vis/examples/city.jscad'), cityJsCad.replace('{{ inject_data }}', `const buildings = ${JSON.stringify(cityData)}`));
});
