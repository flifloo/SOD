for (let e of document.getElementById("orders").children) {
    e.querySelector("a").addEventListener("click", () => e.remove());
}
