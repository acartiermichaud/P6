// Global variables *****************************************
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
const authorizedEmail = "sophie.bluel@test.tld"
const authorizedPwd = "S0phie"



// Functions ***********************************************

// Adding EventListener in login form
async function loginFormSetting () {
    let form = document.getElementById("login-form")
    form.addEventListener("submit", async function(event) {
        event.preventDefault()

        const emailContener = document.getElementById("e-mail")
        const loginEmail = emailContener.value

        const pwdContener = document.getElementById("pwd")
        const loginPwd = pwdContener.value

        const login = {
            email: loginEmail,
            password: loginPwd
        }
        const loginJson = JSON.stringify(login)

        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: loginJson
        })

        let result = await response.json();

        if (result.message === "user not found") {
            let errorContener = document.getElementById("error-message")
            let errorMessage = document.createTextNode("Erreur dans l’identifiant ou le mot de passe.")
            errorContener.appendChild(errorMessage)
            errorContener.classList.remove("hidden-error-message")
            errorContener.classList.add("display-error-message")
        }
        else {
            window.location.href="./index.html"
        }
    })
}




// Main ****************************************************

// Adding EventListener in login form
loginFormSetting () 