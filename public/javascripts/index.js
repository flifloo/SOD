const commandAction = document.getElementById("command-action");
const addButton = document.getElementById("add-command");
const rmButton = document.getElementById("remove-command");

function lastCommandId() {
    let list = document.querySelectorAll("div.command h2");
    return parseInt(list[list.length-1].innerText.replace("Command ", ""));
}

addButton.addEventListener("click", () => {
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
