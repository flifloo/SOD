const date = document.getElementById("date");


function collapse(e, subDiv) {
    e.addEventListener("click", ev => {
        ev.stopPropagation();
        let action;
        if (e.classList.contains("collapse"))
            action = "remove";
        else
            action = "add";

        e.querySelectorAll("."+subDiv).forEach(e => e.classList[action]("hide"));
        e.classList[action]("collapse");
    })
}


document.querySelectorAll(".department").forEach(e => collapse(e, "user"));

document.querySelectorAll(".user").forEach(e => collapse(e, "order"));

document.querySelectorAll(".order").forEach(e => collapse(e, "sandwich"))

date.addEventListener("change", () => window.location.href = "?date="+date.value);
