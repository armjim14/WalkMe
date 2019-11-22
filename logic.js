let count = 1;

let zero = document.getElementById("zero");
let first = document.getElementById("first");
let second = document.getElementById("second");
let third = document.getElementById("third");
let fourth = document.getElementById("fourth");

let next = document.getElementsByClassName("next");
let spec = document.getElementById("spec")

for (let i = 0; i < next.length; i++){
    next[i].addEventListener("click", () => {
        if (count === 1){
            zero.style.visibility = "hidden";
            first.style.visibility = "visible";
            count++;
        } else if (count === 2){
            first.style.visibility = "hidden";
            second.style.visibility = "visible";
            count++;
        } else if (count === 3){
            second.style.visibility = "hidden";
            third.style.visibility = "visible";
            count++;
        } else {
            third.style.visibility = "hidden";
            fourth.style.visibility = "visible";
            spec.style.visibility = "visible";
            count++;
        }
    })
}