const btn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

btn.onclick = function() {
    if(menu.style.display === "block"){
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
};
