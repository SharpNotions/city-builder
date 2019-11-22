const globalScalar = 2;
const positionalScalar = 25;

const buildBuilding = (position, scale) =>
  cube({ size: globalScalar, center: [true, true, false] })
    .translate(position)
    .scale(scale);

const buildHouse = position =>
  buildBuilding(position, [globalScalar, globalScalar, globalScalar]);

const buildSkyScraper = position => {
  return buildBuilding(position, [globalScalar, globalScalar, globalScalar * (Math.floor(Math.random() * 3) + 3)]);
}

const getBuildingPosition = building =>
  [positionalScalar * building.x + positionalScalar / 2, positionalScalar * building.y + positionalScalar / 2, 0];

const builders = {
  house: buildHouse,
  skyScraper: buildSkyScraper
};

function main () {
{{ inject_data }}
  return union(
    ...Object.keys(buildings).reduce((city, buildingType) =>
      [
        ...city,
        ...buildings[buildingType].map(building =>
          builders[buildingType](getBuildingPosition(building))
        )
      ]
    , [])
  );
}
