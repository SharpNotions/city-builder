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
  const formattedData = cityData.filter(building => building.kind === 'skyscraper' || building.kind === 'house')
    .map(building => {
      switch (building.kind) {
        case 'skyscraper':
          return { ...building, kind: 'skyScraper' };
        default:
          return building;
      }
    })
    .reduce((map, building) => {
      if (!map[building.kind]) {
        map[building.kind] = [{
          x: building.geometry.position[0],
          y: building.geometry.position[1]
        }]
      } else {
        map[building.kind].push({
          x: building.geometry.position[0],
          y: building.geometry.position[1]
        });
      }
      return map;
    }, {});

  console.log(JSON.stringify(formattedData));
});
