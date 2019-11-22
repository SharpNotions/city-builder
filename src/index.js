const chance = new (require('chance'));
const fs = require('fs');

const {cross, weightedRandomSelect, treeFold} = require('./helpers');

const geometry = (dim, position) => ({
  dim, position
});

const topGeometry = () => ({
  dim: [1, 1, 1],
  position: [0, 0]
});

const City = (geometry, population) => ({
  kind: 'city',
  geometry,
  population
});

const Building = (geometry, population) => ({
  kind: 'building',
  geometry,
  population
});

const Skyscraper = (geometry) => ({
  kind: 'skyscraper',
  geometry
});

const House = (geometry) => ({
  kind: 'house',
  geometry
});

const Rule = (prob, rule) => ({
  prob,
  rule
});

const rules = {
  city: [
    Rule(0.33, (city) => {
      const newCity = {...city};

      // on 5x5 grid, make 10-20 buildings
      const possibleLocations = cross(
        [0,1,2,3,4],
        [0,1,2,3,4]
      );
      const locationPopulations = [
        [1, 1, 3,  1, 1],
        [1, 3, 7,  3, 1],
        [3, 7, 20, 7, 3],
        [1, 3, 7,  3, 1],
        [1, 1, 3,  1, 1],
      ];
      const locationPopulationSum = locationPopulations.reduce((sum, arr) => {
        return arr.reduce((a, b) => a + b, sum);
      }, 0);

      const numLocations = chance.integer({min: 10, max: 20});
      const chosenLocations = chance.pickset(possibleLocations, numLocations);

      newCity.children = chosenLocations.map(([x, y]) => Building({
        dim: [city.geometry.dim[0] / 5, city.geometry.dim[1] / 5, city.geometry.dim[2]],
        position: [x / 5, y / 5]
      }, city.population * locationPopulations[x][y] / locationPopulationSum));

      return newCity;
    })
  ],
  building: [
    Rule(0.5, (building) => {
      if (building.population <= 0.023) {
        return {
          ...building,
          children: [House(building.geometry)]
        };
      }
      else {
        return {
          ...building,
          children: [Skyscraper(building.geometry)]
        };
      }
    }),
    Rule(0.5, (building) => {
      const newBuilding = {...building};

      if (Math.random() < 0.5) {
        newBuilding.children = [
          Building({
            dim: [building.geometry.dim[0] * 0.5, building.geometry.dim[1], building.geometry.dim[2] * Math.random()],
            position: [0, 0]
          }, building.population * 0.5),
          Building({
            dim: [building.geometry.dim[0] * 0.5, building.geometry.dim[1], building.geometry.dim[2] * Math.random()],
            position: [0.5, 0]
          }, building.population * 0.5),
        ];
      } else {
        newBuilding.children = [
          Building({
            dim: [building.geometry.dim[0], building.geometry.dim[1] * 0.5, building.geometry.dim[2] * Math.random()],
            position: [0, 0]
          }, building.population * 0.5),
          Building({
            dim: [building.geometry.dim[0], building.geometry.dim[1] * 0.5, building.geometry.dim[2] * Math.random()],
            position: [0, 0.5]
          }, building.population * 0.5),
        ];
      }

      return newBuilding;
    })
  ]
};

const applyRules = (rules, shape) => {
  let newShape = {...shape};

  if (shape.children) {
    newShape.children = shape.children.map(childShape => {
      return applyRules(rules, childShape);
    });
  } else {
    const relevantRules = rules[shape.kind];

    if (relevantRules) {
      const selectedRule = weightedRandomSelect(
        relevantRules.map(({prob}) => prob),
        relevantRules
      );

      newShape = selectedRule.rule(newShape);
    }
  }

  return newShape;
};

const absolutizeGeometries = (shape, parentAbsoluteGeometry) => {
  if (parentAbsoluteGeometry) {
    const newGeometry = {
      dim: [
        parentAbsoluteGeometry.dim[0] * shape.geometry.dim[0],
        parentAbsoluteGeometry.dim[1] * shape.geometry.dim[1],
        parentAbsoluteGeometry.dim[2] * shape.geometry.dim[2]
      ],
      position: [
        parentAbsoluteGeometry.position[0] + shape.geometry.position[0] * parentAbsoluteGeometry.dim[0],
        parentAbsoluteGeometry.position[1] + shape.geometry.position[1] * parentAbsoluteGeometry.dim[1],
      ]
    };

    const newShape = {
      ...shape,
      geometry: newGeometry
    };

    if (shape.children) {
      newShape.children = shape.children.map(childShape => {
        return absolutizeGeometries(childShape, newGeometry);
      });
    }

    return newShape;
  } else {
    return absolutizeGeometries(shape, topGeometry());
  }
};


const flatten = (shape) => {
  return treeFold(
    leafShape => {
      const newLeaf = {...leafShape};
      delete newLeaf.children;
      return [newLeaf];
    },
    (branchShape, ...flattenedChildren) => {
      const newBranch = {...branchShape};
      delete newBranch.children;

      return flattenedChildren.reduce((a,b) => a.concat(b), [newBranch]);
    }
  )(shape);
};

const main = () => {
  const startingPopulation = 0.5;

  let city = City(topGeometry(), startingPopulation);

  for (let i = 0; i < 30; i++) {
    city = applyRules(rules, city);
  }

  city = absolutizeGeometries(city);

  // return city;
  return {
    city,
    flattened: flatten(city),
  };
}

const sum = treeFold(
  (leafShape) => leafShape.population || 0,
  (branchShape, ...childSums) => {
    const childSum = childSums.reduce((a, b) => a + b, 0);
    return (branchShape.population || 0) + childSum;
  }
);



const size = treeFold(
  leafShape => 1,
  (branchShape, ...childSizes) => childSizes.reduce((a,b) => a + b, 1)
);

const result = main();
fs.writeFileSync('./output.json', JSON.stringify(result.city, null, 2));
fs.writeFileSync('./outputFlattened.json', JSON.stringify(result.flattened, null, 2));

console.log(JSON.stringify(result.flattened));
