const commandAction = document.getElementById("command-action");
const rmButton = document.getElementById("remove-command");
const locals = {
    command: document.querySelector("#command1>h2").innerHTML.replace(" 1", ""),
    sandwich: document.querySelector("label[for='sandwich1']").innerHTML,
    day: document.querySelector("label[for='day1']").innerHTML
};

function lastCommandId() {
    let list = document.querySelectorAll("div.command h2");
    return parseInt(list[list.length-1].innerText.replace("Command ", ""));
}

document.getElementById("add-command").addEventListener("click", () => {
    let id = lastCommandId() + 1;
    commandAction.insertAdjacentHTML("beforebegin", `<div id="command${id}" class="command">
    <h2>${locals.command} ${id}</h2>
    <div class="field">
        <label for="sandwich${id}">${locals.sandwich}</label>
        <input id="sandwich${id}" type="list" list="sandwich-list" name="sandwich${id}" autocomplete="off" required>
    </div>
    <div class="field">
        <label for="day${id}">${locals.day}</label>
        <input id="da${id}y" type="date" name="date${id}" required>
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
