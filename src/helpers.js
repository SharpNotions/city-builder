const cross = (arrA, arrB) => {
  let retArr = [];
  for (let i = 0; i < arrA.length; i++) {
    for (let j = 0; j < arrB.length; j++) {
      retArr.push([arrA[i], arrB[j]]);
    }
  }
  return retArr;
};

const range = (n) => Array.from({length: n}, (_, i) => i);

const normalize = (list) => {
  const sum = list.reduce((a,b) => a + b, 0);

  return list.map(x => x / sum);
};

const weightedRandomSelect = (weights, coll) => {
  weights = normalize(weights);

  let rand = Math.random();

  for (let i = 0; i < weights.length; i++) {
    const p = weights[i];

    if (rand < p) {
      return coll[i];
    } else {
      rand -= p;
    }
  }

  return coll[coll.length - 1];
};

const treeFold = (
  leafF,
  branchF
) => (
  tree
) => {
  if (tree.children) {
    return branchF(
      tree,
      ...tree.children.map(treeFold(leafF, branchF))
    )
  } else {
    return leafF(tree);
  }
};

module.exports = {
  cross,
  range,
  weightedRandomSelect,
  normalize,
  treeFold
};