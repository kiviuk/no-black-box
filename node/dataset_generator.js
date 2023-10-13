const draw = require('../common/draw');
const constants = require('../common/constants');
const utils = require('../common/utils');

const {createCanvas} = require('canvas');
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');


const fs = require('fs');
const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
fileNames.forEach(fn => {
    const rawJsonFile = fs.readFileSync(constants.RAW_DIR + "/" + fn);
    const {session, student, drawings} = JSON.parse(rawJsonFile);
    for (let label in drawings) {
        samples.push(
            {
                id,
                label,
                student_name: student.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''),
                student_id: session
            }
        )

        let paths = drawings[label];
        fs.writeFileSync(
            constants.JSON_DIR + "/" + id + ".json",
            JSON.stringify(paths)
        );

        // generateImageFile(
        //     constants.IMG_DIR + "/" + id + ".png",
        //     paths
        // );

        utils.printProgress(id, fileNames.length * 8)
        id++;
    }
});

fs.writeFileSync(
    constants.SAMPLES,
    JSON.stringify(samples)
);

fs.writeFileSync(
    constants.SAMPLES_JS,
    JSON.stringify(samples)
);

function generateImageFile(outFile, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}




