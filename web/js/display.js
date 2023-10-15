function createRow(container, studentName, student_id, samples) {
    const row = document.createElement("div");
    row.classList.add("row");
    container.appendChild(row);

    const rowLabel = document.createElement("div");
    rowLabel.innerHTML = studentName + "_" + student_id;
    rowLabel.classList.add("rowLabel");
    row.appendChild(rowLabel);

    for (let sample of samples) {
        const {id, label, student_id, correct} = sample;

        const sampleContainer = document.createElement('dev');
        sampleContainer.id = "sample_" + id;
        sampleContainer.onclick = () => handleClick(sample, false);
        sampleContainer.classList.add("sampleContainer");
        if (correct) {
            sampleContainer.style.backgroundColor = "lightgreen";
        }
        const sampleLabel = document.createElement("div");
        sampleLabel.innerHTML = label;
        sampleContainer.appendChild(sampleLabel);

        const img = document.createElement('img');
        img.src = constants.IMG_DIR + '/' + id + '.png';
        img.classList.add("thumb");
        if (utils.flaggedUser.includes(student_id)) {
            img.classList.add("blur");
        }
        sampleContainer.appendChild(img);

        row.appendChild(sampleContainer);
    }
}

function handleClick(sample, doScroll = true) {
    if (sample == null) {
        [...document.querySelectorAll('.emphasize')].forEach(
            e => e.classList.remove('emphasize')
        );
        return;
    }
    const el = document.getElementById(
        "sample_" + sample.id
    );
    if (el.classList.contains('emphasize')) {
        el.classList.remove('emphasize');
        chart.selectSample(null);
        return;
    }
    [...document.querySelectorAll('.emphasize')].forEach(
        e => e.classList.remove('emphasize')
    );
    el.classList.add("emphasize");
    if (doScroll) {
        el.scrollIntoView({
            behavior: 'auto',
            block: 'center'
        });
    }
    if (typeof chart !== 'undefined') {
        chart.selectSample(sample);
    }
}

function toggleInput() {
    if (inputContainer.style.display === 'none') {
        inputContainer.style.display = 'block';
        sketchPad.triggerUpdate();
    } else {
        inputContainer.style.display = 'none';
        chart.hideDynamicPoint();
    }
}

function toggleSamples() {
    chart.toggleSamples();
}