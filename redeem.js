function redeem(){

let code =
document.getElementById("codeInput").value;

if(code === "C0S7umAr7!"){
    document.getElementById("result").innerHTML =
    "Success! 30% Off Applied";
}
else{
    document.getElementById("result").innerHTML =
    "Invalid Code";
}

}
