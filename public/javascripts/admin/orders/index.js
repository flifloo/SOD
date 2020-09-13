document.querySelectorAll(".order form")
    .forEach(e => e.addEventListener("submit", ev => {
        if (!confirm("Do you really want to remove this ?"))
            ev.preventDefault();
    }));
