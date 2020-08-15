const commandAction = document.getElementById("command-action");
const rmButton = document.getElementById("remove-command");
const more = document.getElementById("more");
const dark = document.getElementById("dark");
const about = document.getElementById("about");
const contact = document.getElementById("contact");

function lastCommandId() {
    let list = document.querySelectorAll("div.command h2");
    return parseInt(list[list.length-1].innerText.replace("Command ", ""));
}

document.getElementById("add-command").addEventListener("click", () => {
    let id = lastCommandId() + 1;
    commandAction.insertAdjacentHTML("beforebegin", `<div id="command${id}" class="command">
    <h2>Command ${id}</h2>
    <div class="field">
        <label for="sandwich">Sandwich:</label>
        <input id="sandwich" type="list" list="sandwich-list" name="sandwich${id}" required>
    </div>
    <div class="field">
        <label for="day">Day:</label>
        <input id="day" type="list" list="date-list" name="date${id}" required>
    </div>
</div>`);
    document.getElementById("command"+lastCommandId()).scrollIntoView({behavior: "smooth"});
    rmButton.classList.remove("hide");
});

rmButton.addEventListener("click", () => {
    let id = lastCommandId();
    document.getElementById("command"+id).remove();
    if (id === 2)
        rmButton.classList.add("hide");
});

more.firstChild.addEventListener("click", () => {
    dark.classList.remove("hide");
    about.classList.remove("hide");
});

more.lastChild.addEventListener("click", () => {
    dark.classList.remove("hide");
    contact.classList.remove("hide")
});

dark.addEventListener("click", () => {
    dark.classList.add("hide");
    if (! about.classList.contains("hide"))
        about.classList.add("hide");
    else
        contact.classList.add("hide");
});
