const draw = require('../common/draw');
const constants = require('../common/constants');
const utils = require('../common/utils');
const geometry = require("../common/geometry.js");

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

        generateImageFile(
            constants.IMG_DIR + "/" + id + ".png", paths
        );

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

    const {vertices, hull} = geometry.minimumBoundingBox({
        points: paths.flat()
    });

    const roundness = geometry.roundness(hull);

    const R = 255 - Math.floor(roundness ** 5 * 255);
    const G = 255 - 0;
    const B = 255 - Math.floor(( 1 - roundness ** 5 ) * 255);
    const color = `rgb(${R},${G},${B})`;
    draw.path(ctx, [...hull, hull[0]], color, 10);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}




