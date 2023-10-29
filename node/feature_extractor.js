#!/usr/bin/env node

const constants = require('../common/constants.js');
const featureFunctions = require('../common/featureFunctions.js');
const utils = require('../common/utils');

const fs = require('fs');

console.log("EXTRACTING FEATURES!")

// ingest samples.json
// Array of {"id":1,"label":"car","student_name":"Radu","student_id":1663053145814}
const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

// iterate over all student submissions
for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    const paths = JSON.parse(
        fs.readFileSync(constants.JSON_DIR + "/" + sample.id + ".json")
    );
    const functions = featureFunctions.inUse.map((f) => f.function);
    sample.point = functions.map((f) => f(paths));
    utils.printProgress(i, samples.length - 1);
}

const featureNames = featureFunctions.inUse.map(f => f.name);

console.log("\nGENERATING SPLITS...");

const trainingAmount = samples.length * 0.5;

const training = [];
const testing = [];

for (let i = 0; i < samples.length; i++) {
    if (i < trainingAmount) {
        training.push(samples[i]);
    } else {
        testing.push(samples[i]);
    }
}

// NORMALIZATION

const minMax = utils.normalizePoints(
    training.map(s => s.point)
);

utils.normalizePoints(
    testing.map(s=>s.point), minMax
)

// ALL DATA

fs.writeFileSync(constants.FEATURES,
    JSON.stringify({
        featureNames,
        samples: samples.map(s => {
            return {
                point: s.point,
                label: s.label
            };
        }),
    })
);

fs.writeFileSync(constants.FEATURES_JS,
    `${JSON.stringify(
        {
            featureNames,
            samples
        }
    )}`
);

// TRAINING DATA

fs.writeFileSync(constants.TRAINING,
    JSON.stringify({
        featureNames,
        samples: training.map(s => {
            return {
                point: s.point,
                label: s.label
            };
        }),
    })
);

fs.writeFileSync(constants.TRAINING_JS,
    `${JSON.stringify(
        {
            featureNames,
            samples:training
        }
    )}`
);

// TESTING DATA

fs.writeFileSync(constants.TESTING,
    JSON.stringify({
        featureNames,
        samples: testing.map(s => {
            return {
                point: s.point,
                label: s.label
            };
        }),
    })
);

fs.writeFileSync(constants.TESTING_JS,
    `${JSON.stringify(
        {
            featureNames,
            samples:testing
        }
    )}`
);


fs.writeFileSync(constants.MIN_MAX_JS,
    `${JSON.stringify(minMax)}`
);

console.log("DONE!")
