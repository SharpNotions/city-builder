const fs = require('fs');

const cityData = JSON.parse(fs.readFileSync('./data/city.json', 'utf8'));
const cityJsCad = fs.readFileSync('./city.jscad', 'utf8');

fs.writeFileSync('../stl-vis/examples/city.jscad', cityJsCad.replace('{{ inject_data }}', `const buildings = ${JSON.stringify(cityData)}`));
