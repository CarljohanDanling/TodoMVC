// sätt alla eventlisteners i början av programmet - "Jakob Kallin"

const activity = document.querySelector("#activity");
activity.remove();

//let activities = [];
let activityTexts = [];

const form = document.querySelector("form");
form.onsubmit = event => {
    event.preventDefault();

    const userInput = document.querySelector("#todo-input");
    const text = document.createTextNode(userInput.value);

    activityTexts.push(text);
    renderActivity(text);

    form.reset();
    /*
    document.querySelector("[id=" + clone.id + "]")
        .querySelector("P")
        .appendChild(text);
    */
}

function renderActivity(text) {
    let clone = activity.cloneNode(true);
    document.querySelector("#activity-section")
        .appendChild(clone);

    clone.querySelector("P")
        .appendChild(text);

    clone.querySelector(".removal-sign")
        .addEventListener("click", () => {
            removeActivity(clone);
        });
}

function removeActivity(clone) {
    clone.remove();
}