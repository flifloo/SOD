document.querySelectorAll("a.remove")
    .forEach(e => e.addEventListener("click", ev => {
        if (!confirm("Do you really want to remove this user ?"))
            ev.preventDefault();
    }));
