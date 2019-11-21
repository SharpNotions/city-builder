const fs = require('fs');

const maxDim = 30;
const numHouses = 300;
const numSkyScrapers = 30;
const randNum = () => Math.floor(Math.random()*maxDim)
const buildRandomBuilding = sign => ({
  x: (Math.random() > 0.5 ? 1 : -1) * randNum(),
  y: (Math.random() > 0.5 ? 1 : -1) * randNum(),
});
const buildBuildings = (buildingType, amount) => {
  return {
    [buildingType]: [...Array(amount)].map(() => buildRandomBuilding())
  }
};

const cityData = {
  ...buildBuildings('house', numHouses),
  ...buildBuildings('skyScraper', numSkyScrapers),
};

fs.writeFileSync('./data/city.json', JSON.stringify(cityData))
