const constants = require('../common/constants.js');
const featureFunctions = require('../common/featureFunctions.js');


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
    sample.point = [
        featureFunctions.getPathCount(paths),
        featureFunctions.getPointCount(paths)
    ];
}

const featureNames = ["Path Count", "Point Count"];

fs.writeFileSync(constants.FEATURES,
    JSON.stringify({
        featureNames,
        samples: samples.map(s => {
            return {
                point:s.point,
                label:s.label
            };
        }),
    })
);

fs.writeFileSync(constants.FEATURES_JS,
    `[${JSON.stringify(
        {
            featureNames,
            samples
        }
    )}]`
);

console.log("DONE!")
