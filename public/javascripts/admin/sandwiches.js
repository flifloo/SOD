document.querySelectorAll(".delete")
    .forEach(e => e.addEventListener("click", ev => {
        if (!confirm("Do you really want to remove this sandwich ?"))
            ev.preventDefault();
    }));
