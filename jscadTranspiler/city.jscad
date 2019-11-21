const buildBuilding = (position, scale) =>
  cube({ size: 1, center: [true, true, false] })
    .translate(position)
    .scale(scale);

const buildHouse = position =>
  buildBuilding(position, [1, 1, 1]);

const buildSkyScraper = position => {
  return buildBuilding(position, [1, 1, Math.floor(Math.random() * 3) + 3]);
}

const getBuildingPosition = building =>
  [building.x, building.y, 0];

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
