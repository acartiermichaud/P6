// Functions *********************************************************************************************

async function loginFormSetting () {

    // Adding EvenListener on email input
    const emailContener = document.getElementById("e-mail")
    emailContener.addEventListener ("change", (event) => {
        event.preventDefault()

        if((emailContener.value !== "") && (document.querySelector(".email-text-error"))) {
            document.querySelector(".email-text-error").remove()
        }

        const errorContener = document.getElementById("error-message")
        if(errorContener.firstChild) {
            errorContener.removeChild(errorContener.firstChild)
        }
    })

    // Adding EvenListener on pwd input
    const pwdContener = document.getElementById("pwd")
    pwdContener.addEventListener ("change", (event) => {
        event.preventDefault()

        if((pwdContener.value !== "") && (document.querySelector(".pwd-text-error"))) {
            document.querySelector(".pwd-text-error").remove()
        }

        const errorContener = document.getElementById("error-message")
        if(errorContener.firstChild) {
            errorContener.removeChild(errorContener.firstChild)
        }
    })

    // Adding EventListener on submit button
    const form = document.getElementById("login-form")
    form.addEventListener("submit", async function(event) {
        event.preventDefault()

        // Recovery of values
        const loginEmail = emailContener.value
        const loginPwd = pwdContener.value

        // E-mail check
        if (loginEmail === "") {
            if(!document.querySelector(".email-text-error-position")) {
                const emailErrorText = document.createElement("p")
                emailErrorText.classList.add("email-text-error")
                emailErrorText.classList.add("email-text-error-position")
                emailErrorText.innerHTML = "Veuillez saisir un e-mail."
                form.appendChild(emailErrorText)
            }
        }

        // Password check
        if (loginPwd === "") {
            if(!document.querySelector(".pwd-text-error-position")) {
                const pwdErrorText = document.createElement("p")
                pwdErrorText.classList.add("pwd-text-error")
                pwdErrorText.classList.add("pwd-text-error-position")
                pwdErrorText.innerHTML = "Veuillez saisir un mot de passe."
                form.appendChild(pwdErrorText)
            }
        }

        // Login try
        if ((loginEmail !== "") && (loginPwd !== "")) {

            const login = {
                email: loginEmail,
                password: loginPwd
            }
            const loginJson = JSON.stringify(login)
    
            try {
                // API request
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: loginJson
                })
    
                // Success login
                if (response.status === 200) {
                    const result = await response.json();
                    const token = result.token
    
                    // Local storage of token
                    tokenJson = JSON.stringify(token);
                    window.localStorage.setItem("token", tokenJson);
    
                    window.location.href="./index.html"
                }

                // Error login
                else {
                    const errorContener = document.getElementById("error-message")
    
                    if (errorContener.firstChild) {
                        errorContener.removeChild(errorContener.firstChild)
                    }
                    
                    const errorMessage = document.createTextNode("Erreur dans l’identifiant ou le mot de passe.")
                    errorContener.appendChild(errorMessage)
                    errorContener.classList.remove("error-message-hidden")
                    errorContener.classList.add("error-message-display")
                }
            }
    
            catch (error) {
                console.error("Une erreur est survenue : ", error);
            }
        }
    })
}




// Main **************************************************************************************************

loginFormSetting () 