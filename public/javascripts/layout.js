const more = document.getElementById("more");
const dark = document.getElementById("dark");
const about = document.getElementById("about");
const contact = document.getElementById("contact");


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

function cb(token) {
    document.querySelectorAll("div.recaptcha.recaptcha-cb").forEach(el => {
        el.classList.remove("recaptcha-cb");
        let input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "g-recaptcha-response");
        input.setAttribute("value", token);
        el.appendChild(input);
    });
}
