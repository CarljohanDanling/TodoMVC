// Diverse deklarationer.
let activities = [];
let activitiesToRemove = [];
let activityIdCounter = 0;
let filteringOption = "";
const selectArrow = document.querySelector("#down-arrow");
selectArrow.remove();

const toggleAll = document.querySelector("#toggle-all")

const activity = document.querySelector("#activity");
activity.remove();

const selectionSection = document.querySelector(".selector-section");
const clearCompleted = document.querySelector("#clear-completed-div");
const filterAll = document.querySelector("#filter-all");
const filterActive = document.querySelector("#filter-active");
const filterCompleted = document.querySelector("#filter-completed");

// Funktioner och EventListener börjar här -->

window.addEventListener("hashchange", () => {
    if (location.hash === "#active") {
        onClickSectionFiltering("filter-active");
    }
    else if (location.hash === "#completed") {
        onClickSectionFiltering("filter-completed");
    }
    else {
        onClickSectionFiltering("filter-all");
    }
});

filterAll.addEventListener("click", (event) => {
    location.hash = "#";
});

filterActive.addEventListener("click", (event) => {
    location.hash = "#active";
})

filterCompleted.addEventListener("click", (event) => {
    location.hash = "#completed";
})

clearCompleted.addEventListener("click", () => {
    clearCompletedActivities();
    visibilitySelectionSection();
})

toggleAll.addEventListener("click", (event) => {
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
            visibilityClearCompleted();
        });

    clone.querySelector(".activity-text")
        .addEventListener("dblclick", () => {
            clone.querySelector(".checkbox-area")
                .classList.toggle("checkbox-area-edit");
            toggleVisibilityActivityTextAndInput(clone);
        });

    clone.querySelector(".edit-activity-text")
        .addEventListener("keydown", () => {
            editActivityText(clone);
        });

    itemsLeftManager();
    removalSignActivity(clone);
    filteringClone(clone);
}

function filteringClone(clone) {
    if (filteringOption === "") {
        clone.style.display = "grid";
    }

    else if (filteringOption === "filter-completed") {
        if (clone.querySelector('input[name="checkbox-input"]').checked === true) {
            clone.style.display = "grid";
        }
        else {
            clone.style.display = "none";
        }
    }

    else if (filteringOption === "filter-active") {
        if (clone.querySelector('input[name="checkbox-input"]').checked === false) {
            clone.style.display = "grid";
        }
        else {
            clone.style.display = "none";
        }
    }

    else {
        clone.style.display = "grid";
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
        clone.querySelector(".checked").style.display = "flex";
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
    itemsLeftManager();
}

function clearCompletedActivities() {
    activities.forEach(a => {
        if (a.querySelector('input[name="checkbox-input"]')
            .checked === true) {
            removeActivity(a);
        }
    })
}

function onClickSectionFiltering(comparisonFilter) {
    activities.forEach(a => {
        if (comparisonFilter === "filter-completed") {

            if (a.querySelector('input[name="checkbox-input"]')
                .checked === true) {

                a.style.display = "grid";
            }
            else {
                a.style.display = "none";
            }

            filteringOption = comparisonFilter;
            filterAll.className = "non-selected";
            filterActive.className = "non-selected";
            filterCompleted.className = "selected";
        }

        else if (comparisonFilter === "filter-active") {
            if (a.querySelector('input[name="checkbox-input"]')
                .checked === true) {

                a.style.display = "none";
            }

            else {
                a.style.display = "grid";
            }
            filteringOption = comparisonFilter
            filterAll.className = "non-selected";
            filterActive.className = "selected";
            filterCompleted.className = "non-selected";
        }

        else {
            activities.forEach(a =>
                a.style.display = "grid");

            filteringOption = comparisonFilter
            filterAll.className = "selected";
            filterActive.className = "non-selected";
            filterCompleted.className = "non-selected";
        }
    })
}

function checkStatusForActivityText(clone) {
    let activityText;
    let changeText = clone.querySelector(".edit-activity-text");

    if (clone.querySelector('input[name="checkbox-input"]')
        .checked === true) {
        activityText = clone.querySelector(".activity-text-checked");
    } else {
        activityText = clone.querySelector(".activity-text");
    }
    return [activityText, changeText];
}

function toggleVisibilityActivityTextAndInput(clone, event) {
    let arrayOfItems = checkStatusForActivityText(clone);

    let activityText = arrayOfItems[0];
    let changeText = arrayOfItems[1];

    activityText.hidden = true;
    changeText.hidden = false;
    changeText.focus();
    changeText.value = activityText.textContent;
}

function editActivityText(clone) {
    let arrayOfItems = checkStatusForActivityText(clone);

    let activityText = arrayOfItems[0];
    let changeText = arrayOfItems[1];

    if (event.keyCode === 13) {
        if (changeText.value.length > 0) {
            activityText.hidden = false;
            changeText.hidden = true;
            activityText.textContent = changeText.value;

            clone.querySelector(".checkbox-area")
                .classList.toggle("checkbox-area-edit");
        }
        else {
            removeActivity(clone);
            visibilitySelectionSection();
        }
    }
}