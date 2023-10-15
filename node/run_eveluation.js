const constants = require("../common/constants.js");
const utils = require("../common/utils.js");

const KNN = require("../common/classifiers/knn.js");
const fs = require("fs");

console.log("RUNNING CLASSIFICATION...");

const {samples: trainingSamples} = JSON.parse(
    fs.readFileSync(constants.TRAINING)
);

let k = 50;
const kNN = new KNN(trainingSamples, k);

const {samples: testingSamples} = JSON.parse(
    fs.readFileSync(constants.TESTING)
);

let correctCount = 0;
let totalCount = 0;
for (const sample of testingSamples) {
    const {label: predictedLabel} = kNN.predict(sample.point);
    correctCount += predictedLabel === sample.label;
    totalCount++;
}

console.log("ACCURACY: " +
    correctCount + "/" + totalCount + " (" +
    utils.formatPercent(correctCount / totalCount) +
    ")"
);

console.log("GENERATING DECISION BOUNDARY...");

const {createCanvas} = require('canvas');
const canvas = createCanvas(100, 100);
const ctx = canvas.getContext('2d');
for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
        const point = [
            x / canvas.width,
            1 - y / canvas.height
        ];
        const {label} = kNN.predict(point);
        ctx.fillStyle = utils.styles[label].color;
        ctx.fillRect(x, y, 1, 1);

    }

}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);
console.log("DONE!");