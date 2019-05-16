// sätt alla eventlisteners i början av programmet - "Jakob Kallin"

// Diverse deklarationer.
const selectArrow = document.querySelector("#down-arrow");
selectArrow.remove();

const activity = document.querySelector("#activity");
activity.remove();

let activities = [];
let activityIdCounter = 0;


// Funktionerna börjar här -->

// eventListener för "markera/avmarkera alla aktiviteter-pilen".
selectArrow.addEventListener("click", () => {
    if (checkIfAllActivtiesAreChecked() === true) {
        activities.forEach(a => {
            a.querySelector('input[name="checkbox-input"]')
                .checked = false;
            activityToggleStatus(a);
        })
        setOpacityForDownArrow();
    }
    else {
        activities.forEach(a => {
            a.querySelector('input[name="checkbox-input"]')
                .checked = true;
            activityToggleStatus(a);
        })
        setOpacityForDownArrow();
    }
    itemsLeftManager();
    changeClassOnActivityText();
});

// Selektering av form och händelser kring form.
const form = document.querySelector("form");
form.onsubmit = event => {
    event.preventDefault();

    const userInput = document.querySelector("#todo-input");
    const text = document.createTextNode(userInput.value);

    renderActivity(text);
    renderDownArrow();
    setOpacityForDownArrow();
    visibilityDownArrow();

    activityIdCounter += 1;
    form.reset();
}

// Renderar aktiviteten och sätter lägger till i activities[].
// Lägger till relaterade eventlisteners på checkbox och "remove" krysset. 
function renderActivity(text) {
    let clone = activity.cloneNode(true);
    clone.id = clone.id + activityIdCounter;

    document.querySelector("#activity-section")
        .appendChild(clone);

    clone.querySelector("P")
        .appendChild(text);

    activities.push(clone);

    clone.querySelector("#checkbox-input")
        .addEventListener("change", (event) => {
            activityToggleStatus(clone);
            setOpacityForDownArrow();
            itemsLeftManager();
            changeClassOnActivityText();
        })

    clone.querySelector(".removal-sign")
        .addEventListener("click", () => {
            removeActivity(clone);
            setOpacityForDownArrow();
            itemsLeftManager();
        });
    itemsLeftManager();
    removalSignActivity(clone);
}

// Renderar down arrow enbart om EN aktivitet finns i activities[].
// Om det är > 1 så gör funktionen inget.
// Om det är 0 aktiviteter i activities[] så tas down arrow bort.
function renderDownArrow() {
    if (document.getElementById("down-arrow") === null) {
        document.querySelector("#toggle-all")
            .appendChild(selectArrow);
    }
    else {
        return;
    }
}

function visibilityDownArrow() {
    if (activities.length >= 1) {
        selectArrow.style.visibility = "visible";
    }
    else {
        selectArrow.style.visibility = "hidden";
    }
}

// Kontrollerar om alla aktiviteter har input "checked" eller ej.
function checkIfAllActivtiesAreChecked() {
    let counter = 0;

    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === true) {
            counter++;
        }
    })

    if (counter === activities.length) {
        return true;
    } else {
        return false;
    }
}

// Sätter CSS-attribut på unchecked och checked SVG.
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

// Mouseover och mouseout för "remove" krysset.
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

// // Tar bort en aktivitet från webbläsaren och även i activities[].
// // activities[] filtrerar bort den man valt att ta bort.
function removeActivity(clone) {
    clone.remove();
    activities = activities.filter(a => a.id !== clone.id);
    visibilityDownArrow();
}

// // Sätter opaciteten för down arrow.
function setOpacityForDownArrow() {
    if (checkIfAllActivtiesAreChecked() === true) {
        selectArrow.closest("div").style.opacity = "1.0";
    } else {
        selectArrow.closest("div").style.opacity = "0.2";
    }
}

function itemsLeftManager() {
    let numberLeft = document.querySelector("#nr-left");
    let counter = 0;
    let itemsLeft = document.querySelector("#items-left");

    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === false) {
            counter++
        }
    })

    numberLeft.textContent = counter;

    if (counter > 1 || counter === 0) {
        itemsLeft.textContent = "items left";
    }
    else {
        itemsLeft.textContent = "item left";
    }
}

function changeClassOnActivityText() {
    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === false) {
            a.querySelector("P").className = "activity-text";
        }
        else {
            a.querySelector("P").className = "activity-text-checked";
        }
    })
}