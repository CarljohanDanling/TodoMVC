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
filterAll.addEventListener("click", filteringAll);

filterActive.addEventListener("click", (event) => {
    filteringActiveOrCompleted(event);
})

filterCompleted.addEventListener("click", (event) => {
    filteringActiveOrCompleted(event);
})

clearCompleted.addEventListener("click", () => {
    clearCompletedActivities();
    visibilitySelectionSection();
})

selectArrow.addEventListener("click", (event) => {
    if (checkIfAllActivtiesAreChecked() === true) {
        activities.forEach(a => {
            a.querySelector('input[name="checkbox-input"]')
                .checked = false;
            activityToggleStatus(a);
            filteringClone(a);
        })
        setOpacityForDownArrow();
    }
    else {
        activities.forEach(a => {
            a.querySelector('input[name="checkbox-input"]')
                .checked = true;
            activityToggleStatus(a);
            filteringClone(a);
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
    visibilitySelectionSection();
    renderDownArrow();
    setOpacityForDownArrow();
    visibilityDownArrow();


    activityIdCounter += 1;
    form.reset();
}

// Renderar aktiviteten och lägger till i activities[].
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
            filteringClone(clone);
        })

    clone.querySelector(".removal-sign")
        .addEventListener("click", () => {
            removeActivity(clone);
            visibilitySelectionSection();
            setOpacityForDownArrow();
            itemsLeftManager();
            visibilityClearCompleted();
        });
    itemsLeftManager();
    removalSignActivity(clone);
    filteringClone(clone);
}

function filteringClone(clone) {
    if (filteringOption === "") {
        clone.style.display = "flex";
    }

    else if (filteringOption === "filter-completed") {
        if (clone.querySelector('input[name="checkbox-input"]').checked === true) {
            clone.style.display = "flex";
        }
        else {
            clone.style.display = "none";
        }
    }

    else if (filteringOption === "filter-active") {
        if (clone.querySelector('input[name="checkbox-input"]').checked === false) {
            clone.style.display = "flex";
        }
        else {
            clone.style.display = "none";
        }
    }
}

function visibilitySelectionSection() {
    if (activities.length > 0) {
        selectionSection
            .className = "selector-section-visible";
    }
    else {
        selectionSection
            .className = "selector-section";
    }
}

// Renderar down arrow.
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

// Sätter opaciteten för down arrow.
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

function filteringAll() {
    activities.forEach(a =>
        a.style.display = "flex");
}

function filteringActiveOrCompleted(e) {
    activities.forEach(a => {
        if (e.currentTarget.className === "filter-completed") {

            if (a.querySelector('input[name="checkbox-input"]')
                .checked === true) {

                a.style.display = "flex";
            }
            else {
                a.style.display = "none";
            }
            filteringOption = e.currentTarget.className;
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
    })
}