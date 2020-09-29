const date = document.getElementById("date");

document.querySelectorAll("h4").forEach((e) => {
    e.addEventListener("click", ev => {
        ev.stopPropagation();
        let action;
        if (e.classList.contains("collapsed"))
            action = "remove";
        else
            action = "add";

        e.parentElement.querySelectorAll(".collection").forEach(c => c.classList[action]("hide"));
        e.classList[action]("collapsed");
    })
});

date.addEventListener("change", () => window.location.href = "?date="+date.value);
