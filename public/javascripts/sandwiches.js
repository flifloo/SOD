const date = document.getElementById("date");


date.addEventListener("change", () => window.location.href = "?date="+date.value);
