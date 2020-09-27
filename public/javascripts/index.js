const orders = document.getElementById("orders");
const sandwich = document.getElementById("sandwich");
const day = document.getElementById("day");
const locals = {
    sandwich: document.querySelector("#oderCreator label").innerHTML,
    date: document.querySelector("label[for=day]").innerHTML
};

function lastOrderId() {
    if (orders.lastChild)
        return parseInt(orders.lastChild.id.replace("order", ""));
    return 0;
}

document.getElementById("addOrder").addEventListener("click", () => {
    if (!sandwich.value || !day.value)
        return;

    let id = lastOrderId() + 1;

    //ToDo submit button check

    orders.insertAdjacentHTML("beforeend", `<div id="order${id}" class="row">
    <div class="input-field col s6">
        <input id="sandwich${id}" type="text" name="sandwiches[${id}]" value="${sandwich.value}" readonly required>
        <label for="sandwich${id}">${locals.sandwich}</label>
    </div>
    <div class="input-field col s6">
        <input id="date${id}" type="date" name="dates[${id}]" value="${day.value}" readonly required>
        <label for="date${id}">${locals.day}</label>
    </div>
    <a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">remove</i></a>
</div>`);

    sandwich.selectedIndex = 0;
    day.value = "";

    let order = document.getElementById("order"+id);
    order.querySelector("a").addEventListener("click", () => {
        order.remove();
        if (lastOrderId() === 0) {
            sandwich.required = true;
            day.required = true;
        }
    });

    document.getElementById("order"+id).scrollIntoView({behavior: "smooth"});
});

document.querySelector("form").addEventListener("submit", () => {
    return lastOrderId();
});
