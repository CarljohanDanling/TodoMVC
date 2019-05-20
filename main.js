// sätt alla eventlisteners i början av programmet - "Jakob Kallin"

// Diverse deklarationer.
let activities = [];
let activitiesToRemove = [];
let activityIdCounter = 0;
let filteringOption = "";

const selectArrow = document.querySelector("#down-arrow");
selectArrow.remove();

const activity = document.querySelector("#activity");
activity.remove();

const selectionSection = document.querySelector(".selector-section");
const clearCompleted = document.querySelector("#clear-completed");
const filterAll = document.querySelector(".filter-all");
const filterActive = document.querySelector(".filter-active");
const filterCompleted = document.querySelector(".filter-completed");

// Funktioner och EventListener börjar här -->
filterAll.addEventListener("click", filterAllActivities);

filterActive.addEventListener("click", (event) => {
    filteringActivities(event);
})

filterCompleted.addEventListener("click", (event) => {
    filteringActivities(event);
})

clearCompleted.addEventListener("click", clearCompletedActivities);

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
    visibilityClearCompleted();
});

// Selektering av form och händelser kring form.
const form = document.querySelector("form");
form.onsubmit = event => {
    event.preventDefault();

    const userInput = document.querySelector("#todo-input");
    const text = document.createTextNode(userInput.value);

    renderActivity(text);
    visabilitySelectionSection();
    renderDownArrow();
    setOpacityForDownArrow();
    visibilityDownArrow();
    filteringActivities(event);

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
            visibilityClearCompleted();
            visibilityFiltering(clone);
        })

    clone.querySelector(".removal-sign")
        .addEventListener("click", () => {
            removeActivity(clone);
            visabilitySelectionSection();
            setOpacityForDownArrow();
            itemsLeftManager();
            visibilityClearCompleted();
        });
    itemsLeftManager();
    removalSignActivity(clone);
}

function visibilityFiltering(clone) {
    if (filteringOption === "filter-completed") {
        clone.style.display = "none";
    }

    else if (filteringOption === "filter-active") {
        clone.style.display = "none";
    }
}

function visabilitySelectionSection() {
    if (activities.length > 0) {
        selectionSection
            .className = "selector-section-visible";
    }
    else {
        selectionSection
            .className = "selector-section";
    }
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

function visibilityClearCompleted() {
    if (activities.some(a => a.querySelector('input[name="checkbox-input"]').checked === true)) {
        clearCompleted.style.display = "block";
    }
    else {
        clearCompleted.style.display = "none";
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


// // Sätter opaciteten för down arrow.
function setOpacityForDownArrow() {
    if (checkIfAllActivtiesAreChecked() === true) {
        selectArrow.closest("div").style.opacity = "1.0";
    } else {
        selectArrow.closest("div").style.opacity = "0.2";
    }
}

function itemsLeftManager() {
    let numberOfItemsLeft = document.querySelector("#nr-left");
    let itemsLeftText = document.querySelector("#items-left");
    let counter = 0;

    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === false) {
            counter++
        }
    })
    numberOfItemsLeft.textContent = counter;

    if (counter > 1 || counter === 0) {
        itemsLeftText.textContent = "items left";
    }
    else {
        itemsLeftText.textContent = "item left";
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

// // Tar bort en aktivitet från webbläsaren och även i activities[].
// // activities[] filtrerar bort den man valt att ta bort.
function removeActivity(clone) {
    clone.remove();
    activities = activities.filter(a => a.id !== clone.id);
    visibilityDownArrow();
    visibilityClearCompleted();
}

function clearCompletedActivities() {
    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === true) {
            removeActivity(a);
        }
    })
}

function filterAllActivities() {
    activities.forEach(a =>
        a.style.display = "flex");
}

function filteringActivities(e) {
    activities.forEach(a => {
        if (e.type === "submit") {
            if (filteringOption === "") {
                a.style.display = "flex";
            }
            else if (filteringOption === "filter-active" && a.querySelector('input[name="checkbox-input"]')
                .checked === false) {
                a.style.display = "flex";
            }
            else if (filteringOption === "filter-completed" && a.querySelector('input[name="checkbox-input"]')
                .checked === true) {
                a.style.display = "flex";
            }
            else {
                a.style.display = "none";
            }
        }

        // Vid click.
        else {
            if (e.currentTarget.className === "filter-completed") {
                filteringOption = e.currentTarget.className;

                if (a.querySelector('input[name="checkbox-input"]')
                    .checked === true) {

                    a.style.display = "flex";
                }
                else {
                    a.style.display = "none";
                }
            }

            else {
                if (a.querySelector('input[name="checkbox-input"]')
                    .checked === true) {

                    a.style.display = "none";
                }
                else {
                    a.style.display = "flex";
                }
                filteringOption = e.currentTarget.className;
            }
        }
    })
}