// Variables for listeners
const upload = document.getElementById("upload");

// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// localstorage in variables
let isImage = JSON.parse(localStorage.getItem("names"));
let prev = JSON.parse(localStorage.getItem("prev"));

// when the upload button is clicked
upload.addEventListener("click", e => {

    e.preventDefault();

    let myImage = document.getElementById("myImage").value;

    if (!myImage) {
        sendFeedback("No Image uploaded")
    } else {
        localStorage.setItem("prev", JSON.stringify(true));
    }

})

// Making sure the names variable is not null and always an array
function declareStuff() {
    if (JSON.parse(localStorage.getItem("names")) === null) {
        localStorage.setItem("names", JSON.stringify([]));
    } else if (JSON.parse(localStorage.getItem("prev")) === null) {
        localStorage.setItem("prev", JSON.stringify(false));
    }
}

console.log(isImage);
console.log(prev);

checkImages()

// checking the storage
function checkImages() {
    // Refreshing the page if names is null
    if (isImage === null || prev === null) {
        declareStuff();
        window.location.reload();
    }
    // If an image is uploaded so it gets added to the localstorage
    if (prev === true) {
        getFileNames()
    }
    // if there is images in LS it will render them
    if (isImage.length > 0) {
        renderImages();
    }
}

// Runs if prev is true
function getFileNames() {
    $.get("/finished", name => {
        let all = JSON.parse(localStorage.getItem("names"));

        if (!all){
            // Pushing current name to LS list then back to LS
            all.push(name.first);
            localStorage.setItem("names", JSON.stringify(all));
            // Making prev false
            localStorage.setItem("prev", JSON.stringify(false));
    
            renderImages()
        } else {
            localStorage.setItem("prev", JSON.stringify(false));
            sendFeedback("Image files only");
        }
    })
}

// Rendering Images
function renderImages() {
    let allImages = document.getElementById("allImages");
    let names = JSON.parse(localStorage.getItem("names"));

    allImages.innerHTML = "";
    let num = (names.length > 3) ? 3 : names.length;

    for (let i = 0; i < num; i++) {
        let img = document.createElement("img");
        img.setAttribute("src", `/uploads/${names[i]}`)
        img.setAttribute("alt", 'Image')
        img.setAttribute("class", 'img')
        img.setAttribute("onclick", `confirmDelete('${names[i]}')`);

        allImages.append(img)
    }

    let hr = document.createElement("hr");
    hr.setAttribute("class", "little mt-3");

    allImages.parentNode.childNodes[11].prepend(hr)
}

function confirmDelete(id) {
    let yesDelete = document.getElementById("yesDelete");
    let noDelete = document.getElementById("noDelete");

    yesDelete.setAttribute("onclick", `DeleteImage('${id}')`)
    noDelete.setAttribute("onclick", `modal.style.display = "none";`)
    modal.style.display = "block";

}

function DeleteImage(id) {
    $.ajax({
        url: `/delete/${id}`,
        method: "DELETE"
    }).then(res => {
        console.log(res);
        if (res.deleted){
            RemoveFromLocal(res.id)
        } else {
            sendFeedback("Error deleting image, please try again.")
        }
    })
}

function RemoveFromLocal(id){
    let current = JSON.parse(localStorage.getItem("names"));
    let newList = [];

    for ( let i = 0; i < current.length; i++ ){
        if (current[i] !== id){
            newList.push(current[i]);
        }
    }

    localStorage.setItem("names", JSON.stringify(newList));
    window.location.reload();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function resetList() {
    localStorage.setItem("names", JSON.stringify([]));
    localStorage.setItem("prev", JSON.stringify(false));
    let allImages = document.getElementById("allImages");
    allImages.innerHTML = "";
    window.location.reload();
}

let sendEmail = document.getElementById("sendEmail");

sendEmail.addEventListener("submit", e => {
    e.preventDefault();
    let names = JSON.parse(localStorage.getItem("names"))

    let message = document.getElementById("message").value;
    let email = document.getElementById("email").value;
    let ob = {};

    if (message) {
        ob = {
            images: names,
            message,
            email
        };
    } else {
        ob = {
            images: names,
            message: "No Message",
            email
        };
    }

    if (!message && names.length === 0) {
        sendFeedback("A message or Image is needed.")
    } else {
        $.post("/send/email", ob)
            .then(res => {
                console.log(res)
                if (res.send) {
                    console.log("Email send")
                    secondPart()
                } else {
                    sendFeedback("Error occured, please try again")
                }
            })
    }
})

function secondPart() {
    let ob = { names: JSON.parse(localStorage.getItem("names")) };

    $.post("/clear/list", ob)
        .then(res => {
            console.log(res)
            resetList();
        })
}

// For chaning HTML pages
let service = document.getElementById("service");
let about = document.getElementById("about");

service.addEventListener("click", () => {
    window.location.href = "services.html"
})
about.addEventListener("click", () => {
    window.location.href = "about.html"
})

function sendFeedback(message) {

    let feedback = document.getElementById("feedback");
    let forFeedback = document.getElementById("forFeedback");
    let count = 0;
    
    let intra = setInterval(() => {
        forFeedback.innerText = message;
        feedback.style.display = "block";
        count++;

        if (count === 4) {
            feedback.style.display = "none";
            forFeedback.innerText = "";
            clearInterval(intra);
        }
    }, 900)


}