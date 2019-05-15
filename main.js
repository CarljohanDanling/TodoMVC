// sätt alla eventlisteners i början av programmet - "Jakob Kallin"

const selectArrow = document.querySelector("#down-arrow");
selectArrow.remove();

const activity = document.querySelector("#activity");
activity.remove();

let activities = [];
let activityIdCounter = 0;

selectArrow.addEventListener("click", () => {
    activities.forEach(a => {
        a.querySelector('input[name="checkbox-input"]')
            .checked = true;
        activityToggleStatus(a);
    })
    checkIfAllActivtiesAreChecked();
})

const form = document.querySelector("form");
form.onsubmit = event => {
    event.preventDefault();



    const userInput = document.querySelector("#todo-input");
    const text = document.createTextNode(userInput.value);

    renderActivity(text);
    activityIdCounter += 1;

    renderDownArrow();

    form.reset();
}

function renderDownArrow() {
    if (activities.length === 1) {
        document.querySelector("#toggle-all")
            .appendChild(selectArrow);
    } else if (activities.length > 1) {
        return;
    } else {
        selectArrow.remove();
    }
}

function renderActivity(text) {
    let clone = activity.cloneNode(true);
    clone.id = clone.id + activityIdCounter;

    document.querySelector("#activity-section")
        .appendChild(clone);

    clone.querySelector("P")
        .appendChild(text);

    activities.push(clone);

    clone.querySelector(".checkbox")
        .addEventListener("click", () => {
            activityToggleStatus(clone);
            checkIfAllActivtiesAreChecked();
        })

    clone.querySelector(".removal-sign")
        .addEventListener("click", () => {
            removeActivity(clone);
        });

    removalSignActivity(clone);
}

function checkIfAllActivtiesAreChecked() {
    let counter = 0;

    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === true) {
            counter++;
        }
    })

    if (counter === activities.length) {
        selectArrow.closest("div").style.opacity = "1.0";
    } else {
        selectArrow.closest("div").style.opacity = "0.2";
    }

}

function activityToggleStatus(clone) {
    let checkbox = clone.querySelector('input[name="checkbox-input"]');
    if (checkbox.checked === true) {
        clone.querySelector(".unchecked").style.display = "none";
        clone.querySelector(".checked").style.display = "block";
    } else {
        clone.querySelector(".unchecked").style.display = "block";
        clone.querySelector(".checked").style.display = "none";
    }

}

function removalSignActivity(clone) {
    clone.addEventListener("mouseover", () => {
        clone.querySelector(".removal-sign")
            .style.visibility = "visible";
    });

    clone.addEventListener("mouseout", () => {
        clone.querySelector(".removal-sign")
            .style.visibility = "hidden";
    });
}

function removeActivity(clone) {
    clone.remove();
    activities = activities.filter(a => a.id !== clone.id);
    renderDownArrow();
}