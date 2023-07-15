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

        if (response.status !== 200) {
            let errorContener = document.getElementById("error-message")

            if (errorContener.firstChild) {
                errorContener.removeChild(errorContener.firstChild)
            }
            
            let errorMessage = document.createTextNode("Erreur dans l’identifiant ou le mot de passe.")
            errorContener.appendChild(errorMessage)
            errorContener.classList.remove("hidden-error-message")
            errorContener.classList.add("display-error-message")
        }
        else {
            let result = await response.json();
            const token = result.token

            // Local storage of token
            tokenJson = JSON.stringify(token);
            window.localStorage.setItem("token", tokenJson);

            window.location.href="./index.html"
        }
    })
}




// Main ****************************************************

// Adding EventListener in login form
loginFormSetting () 