// sätt alla eventlisteners i början av programmet - "Jakob Kallin"

const selectArrow = document.querySelector("#down-arrow");
selectArrow.remove();

const activity = document.querySelector("#activity");
activity.remove();

let activities = [];
let activityIdCounter = 0;

const form = document.querySelector("form");
form.onsubmit = event => {
    event.preventDefault();

    const userInput = document.querySelector("#todo-input");
    const text = document.createTextNode(userInput.value);

    renderActivity(text);
    activityIdCounter += 1;

    renderSelectAllArrow();

    form.reset();
}

function renderSelectAllArrow() {
    if (activities.length === 1) {
        document.querySelector("#select-all")
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

    clone.querySelector(".removal-sign")
        .addEventListener("click", () => {
            removeActivity(clone);
        });
}

function removeActivity(clone) {
    clone.remove();
    activities = activities.filter(a => a.id !== clone.id);
    renderSelectAllArrow();
}