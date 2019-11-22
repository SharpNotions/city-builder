#! /bin/bash

node ./src/index.js | node ./jscadTranspiler/readCityData.js | node ./jscadTranspiler/index.js 

