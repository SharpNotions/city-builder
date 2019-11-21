function buildBuilding(position, scale) {
  return cube({ size: 1, center: true })
    .translate(position)
    .scale(scale);
}
function buildHouse(position) {
  return buildBuilding(position, [1, 1, 1]);
}
function buildSkyScraper(position) {
  return buildBuilding(position, [1, 1, 3]);
}
function getBuildingPosition(building) {
  return [building.x, building.y, 0];
}
function main () {
  const houses = [
    { x: 2, y: 2 },
    { x: 3, y: 4 },
    { x: 2, y: -4 },
    { x: -2, y: 2 },
    { x: -2, y: 4 },
    { x: -4, y: -4 }
  ];
  const skyScrapers = [
    { x: 0, y: 0 }
  ];
  return union(
    ...houses.map(house => buildHouse(getBuildingPosition(house))),
    ...skyScrapers.map(skyScraper => buildSkyScraper(getBuildingPosition(skyScraper)))
  );
}
