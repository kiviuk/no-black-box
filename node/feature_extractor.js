const constants = require('../common/constants.js');
const featureFunctions = require('../common/featureFunctions.js');
const utils = require('../common/utils');

const fs = require('fs');

console.log("EXTRACTING FEATURES!")

// ingest samples.json
// Array of {"id":1,"label":"car","student_name":"Radu","student_id":1663053145814}
const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

// iterate over all student submissions
for (const sample of samples) {
    const paths = JSON.parse(
        fs.readFileSync(
            constants.JSON_DIR + '/' + sample.id + '.json'
        )
    );

    const functions = featureFunctions.inUse.map(f => f.function);
    sample.point = functions.map(f => f(paths));
}

const minMax = utils.normalizePoints(
    samples.map(s => s.point)
);

const featureNames = featureFunctions.inUse.map(f => f.name);

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

fs.writeFileSync(constants.MIN_MAX_JS,
    `${JSON.stringify(minMax)}`
);

console.log("DONE!")
