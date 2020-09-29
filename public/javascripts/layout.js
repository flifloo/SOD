document.addEventListener("DOMContentLoaded", function() {
    M.AutoInit();
    M.updateTextFields;
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
