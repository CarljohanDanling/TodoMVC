// sätt alla eventlisteners i början av programmet - "Jakob Kallin"

const section = document.querySelector("#activity-section");
section.remove();

const form = document.querySelector("form");
form.onsubmit = event => {
    event.preventDefault();

    // let paragraph = document.createElement("P");
    const userInput = document.querySelector("#todo-input");
    const text = document.createTextNode(userInput.value);
    // paragraph.appendChild(text);

    const clone = section.cloneNode(true);
    document.body.appendChild(clone);

    document.querySelector("#activity-section").querySelector("P").appendChild(text);

}