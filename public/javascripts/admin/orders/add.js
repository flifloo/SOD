const orderAction = document.getElementById("order-action");
const rmButton = document.getElementById("remove-order");
const locals = {
    order: document.querySelector("#order1>h2").innerHTML.replace(" 1", ""),
    sandwich: document.querySelector("label[for='sandwich1']").innerHTML,
    day: document.querySelector("label[for='day1']").innerHTML
};

function lastOrderId() {
    let list = document.querySelectorAll("div.order h2");
    return parseInt(list[list.length-1].innerText.replace(locals.order+" ", ""));
}

document.getElementById("add-order").addEventListener("click", () => {
    let id = lastOrderId() + 1;
    orderAction.insertAdjacentHTML("beforebegin", `<div id="order${id}" class="order">
    <h2>${locals.order} ${id}</h2>
    <div class="field">
        <label for="sandwich${id}">${locals.sandwich}</label>
        <span class="list_arrow"><input id="sandwich${id}" type="list" list="sandwich-list" name="sandwiches[${id}]" autocomplete="off" required></span>
    </div>
    <div class="field">
        <label for="day${id}">${locals.day}</label>
        <input id="day${id}" type="date" name="dates[${id}]" required>
    </div>
    <div class="field">
        <label for="give${id}">${locals.day}</label>
        <input id="give${id}" type="checkbox" name="give[${id}]">
    </div>
</div>`);
    document.getElementById("order"+lastOrderId()).scrollIntoView({behavior: "smooth"});
    rmButton.classList.remove("hide");
});

rmButton.addEventListener("click", () => {
    let id = lastOrderId();
    document.getElementById("order"+id).remove();
    if (id === 2)
        rmButton.classList.add("hide");
});
