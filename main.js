// Diverse deklarationer.
let activities = [];
let activityIdCounter = 0;
let filteringOption = "";

const toggleAll = document.querySelector("#toggle-all")
const clearCompleted = document.querySelector("#clear-completed-div");
const filterAll = document.querySelector("#filter-all");
const filterActive = document.querySelector("#filter-active");
const filterCompleted = document.querySelector("#filter-completed");
const selectionSection = document.querySelector(".selector-section");

const selectArrow = document.querySelector("#down-arrow");
selectArrow.remove();
const activity = document.querySelector("#activity");
activity.remove();

// Funktioner och EventListener börjar här -->

window.addEventListener("load", localStorageLoad, false);
window.addEventListener("unload", localStorageSave, false);

window.addEventListener("hashchange", () => {
    hashManager();
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
    form.reset();
}

// Renderar aktiviteten och lägger till i activities[].
// Lägger till relaterade eventlisteners på checkbox och "remove" krysset. 
function renderActivity(activityText, activityStatus) {
    let clone = activity.cloneNode(true);
    clone.id = clone.id + activityIdCounter;

    document.querySelector("#activity-section")
        .appendChild(clone);

    clone.querySelector("P")
        .appendChild(activityText);

    activities.push(clone);

    updateCheckboxManager(clone, activityStatus);

    clone.querySelector("#checkbox-input")
        .addEventListener("change", (event) => {
            updateCheckboxManager(clone, activityStatus);
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
    visibilitySelectionSection();
    renderDownArrow();
    setOpacityForDownArrow();
    visibilityDownArrow();
    removalSignActivity(clone);
    filteringClone(clone);

    activityIdCounter += 1;
}

function filteringClone(clone) {
    const inputValue = clone.querySelector('input[name="checkbox-input"]').checked;

    if (filteringOption === "filter-completed") {
        inputValue === true ? clone.style.display = "grid" : clone.style.display = "none";
    }

    else if (filteringOption === "filter-active") {
        inputValue === false ? clone.style.display = "grid" : clone.style.display = "none";
    }

    else {
        clone.style.display = "grid";
    }
}

function updateCheckboxManager(clone, activityStatus) {
    activityToggleStatus(clone, activityStatus);
    setOpacityForDownArrow();
    itemsLeftManager();
    changeClassOnActivityText();
    visibilityClearCompleted();
    filteringClone(clone);
}

function hashManager() {
    if (location.hash === "#active") {
        onClickSectionFiltering("filter-active");
    }
    else if (location.hash === "#completed") {
        onClickSectionFiltering("filter-completed");
    }
    else {
        onClickSectionFiltering("filter-all");
    }
}

function visibilitySelectionSection() {
    activities.length > 0 ? selectionSection.className = "selector-section-visible" : selectionSection.className = "selector-section";
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
    activities.some(a => {
        if (a.querySelector('input[name="checkbox-input"]').checked === true) {
            clearCompleted.style.display = "block";
        }
        else {
            clearCompleted.style.display = "none";
        }
    })
}

function visibilityDownArrow() {
    activities.length >= 1 ? selectArrow.style.visibility = "visible" : selectArrow.style.visibility = "hidden";
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

    return counter === activities.length ? true : false;
}

// Sätter CSS-attribut.
function activityToggleStatus(clone, activityStatus) {
    let checkbox = clone.querySelector('input[name="checkbox-input"]');

    if (activityStatus === undefined || activityStatus.textContent === "already-loaded") {
        if (checkbox.checked === true) {
            clone.querySelector(".unchecked").style.display = "none";
            clone.querySelector(".checked").style.display = "flex";
        } else {
            clone.querySelector(".unchecked").style.display = "block";
            clone.querySelector(".checked").style.display = "none";
        }
    }

    else {
        if (activityStatus.textContent === "completed") {
            checkbox.checked = true;
            clone.querySelector(".unchecked").style.display = "none";
            clone.querySelector(".checked").style.display = "flex";
        }
        else {
            checkbox.checked = false;
            clone.querySelector(".unchecked").style.display = "block";
            clone.querySelector(".checked").style.display = "none"
        }
        activityStatus.textContent = "already-loaded";
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
        const inputValue = a.querySelector('input[name="checkbox-input"]').checked;
        let className = a.querySelector("P").className;

        inputValue === false ? className = "activity-text" : className = "activity-text-checked";
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
        const inputValue = a.querySelector('input[name="checkbox-input"]').checked;

        if (comparisonFilter === "filter-active") {
            inputValue === true ? a.style.display = "none" : a.style.display = "grid";

            filteringOption = comparisonFilter
            filterAll.className = "non-selected";
            filterActive.className = "selected";
            filterCompleted.className = "non-selected";
        }

        else if (comparisonFilter === "filter-completed") {
            inputValue === true ? a.style.display = "grid" : a.style.display = "none";

            filteringOption = comparisonFilter;
            filterAll.className = "non-selected";
            filterActive.className = "non-selected";
            filterCompleted.className = "selected";
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
    localStorage.setItem('filtering', JSON.stringify(location.hash));
}

function checkStatusForActivityText(clone) {
    let activityText;
    let changeText = clone.querySelector(".edit-activity-text");
    const inputValue = clone.querySelector('input[name="checkbox-input"]')

    if (inputValue === true) {
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

function localStorageLoad() {
    let loadedItemsArray = localStorage.getItem("Todo") ? JSON.parse(localStorage.getItem("Todo")) : []
    let currentActivityStatus = JSON.parse(localStorage.getItem("filtering"));

    loadedItemsArray.forEach(a => {
        let activityText = document.createTextNode(a.activityText);
        let activityStatus = document.createTextNode(a.activityStatus);
        renderActivity(activityText, activityStatus);
    })
    location.hash = currentActivityStatus;
    hashManager();
}

function localStorageSave() {
    const toDoObjects = activities.map(a => new Object({
        activityText: a.querySelector("P").textContent,
        activityStatus: a.querySelector('input[name="checkbox-input"]').checked ? "completed" : "active"
    }));
    localStorage.setItem("Todo", JSON.stringify(toDoObjects));
}