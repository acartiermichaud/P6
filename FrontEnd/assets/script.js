// Global variables *****************************************
let worksJson = null
let works = ""

let categories = ""

let filterId = 0

let token = null



// Functions ***********************************************

// Recovery of works
async function worksRecovery () {
    worksJson = window.localStorage.getItem("works");

    if (worksJson === null) {
        const worksResponse = await fetch("http://localhost:5678/api/works")
        works = await worksResponse.json()

        // Local storage of works
        worksJson = JSON.stringify(works);
        window.localStorage.setItem("works", worksJson);
    }
    else {
        works = JSON.parse(worksJson);
    }
}



// Display of works in HTML page
function worksDisplay (id) {
    let gallery = document.querySelector(".gallery")

    for (let i = 0; i < works.length; i++) {

        if ((id === 0) || (id === works[i].category.id)) {
            let figure = document.createElement("figure")
            gallery.appendChild(figure)

            let img = document.createElement("img")
            img.src = works[i].imageUrl
            img.alt = works[i].title
            figure.appendChild(img)

            let figcaption = document.createElement("figcaption")
            figure.appendChild(figcaption)
            let textFigure = document.createTextNode(works[i].title)
            figcaption.appendChild(textFigure)
        }
    }
}



// Deletion of all works in HTML page
function worksDelete () {
    let gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
}



// Update of filters' style
function filtersStyleUpdate(id) {
    let oldSelectedFilter = document.querySelector(".selected-filter")
	oldSelectedFilter.classList.remove("selected-filter")
	
	let newSelectedFilter = document.getElementById("filter_"+id)
	newSelectedFilter.classList.add("selected-filter")
}



// Display of category filters
async function filtersDisplay () {

    // Recovery of categories
    const categoriesResponse = await fetch("http://localhost:5678/api/categories")
    categories = await categoriesResponse.json()

    // Creation of filters
    let filtersContener = document.querySelector(".filters-contener")

    for (let i = 0; i < categories.length+1; i++) {
        let filter = document.createElement("button")
        filter.setAttribute("id", "filter_"+i)
        filter.classList.add("filter")
        filter.classList.add("pointer")
        filtersContener.appendChild(filter)

        // Default values for the 1st filter
        let text = "Tous"
        let id = 0

        if (i === 0) {
            filter.classList.add("selected-filter")
        }
        else {
            text = categories[i-1].name
            id = categories[i-1].id
        }

        let filterText = document.createTextNode(text)
        filter.appendChild(filterText)

        filter.addEventListener ("click", () => {
            worksDelete()
            worksDisplay(id)
            filtersStyleUpdate(id)
        })
    }
}



// Recovery of token
function tokenRecovery () {
    const tokenJson = window.localStorage.getItem("token");
    console.log(tokenJson)

    if (tokenJson !== null) {
        token = JSON.parse(tokenJson);
    }
    // else {
    //     token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
    // }
}



// Clear token
function clearToken() {
    window.localStorage.removeItem("token")
}



// Display of the edition mode
function editionModeDisplay () {

    // Display of the edition mode bar
    let editionBar = document.querySelector(".edition-bar")
    editionBar.classList.add("edition-bar-display")
    editionBar.innerHTML = `
        <p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>
		<button class="edition-bar-button">publier les changements</button>`

    // Display of the introduction edition button
    let introButtonContener = document.querySelector(".button-intro-edition-contener")
    introButtonContener.classList.add("button-intro-edition-contener-display")
    introButtonContener.innerHTML = `
        <button id="intro-edition" class="edition-button pointer"><i class="fa-regular fa-pen-to-square"></i>modifier</button>`

    // Display of the portfolio edition button
    let portfolioButtonContener = document.querySelector(".button-portfolio-edition-contener")
    portfolioButtonContener.classList.add("button-portfolio-edition-contener-display")
    portfolioButtonContener.innerHTML = `
        <button id="portfolio-edition" class="edition-button pointer"><i class="fa-regular fa-pen-to-square"></i>modifier</button>`

    // Hidden of the login link
    let loginLink = document.querySelector(".login-link")
    loginLink.classList.add("login-link-hidden")

    // Display of the logout link
    let logoutLink = document.querySelector(".logout-link")
    logoutLink.classList.add("logout-link-display")
    logoutLink.addEventListener ("click", () => {
        console.log("clear token")
        clearToken()
    })
}



// Main ****************************************************

// Recovery of token
tokenRecovery () 

if (token === null) {
    // Display of category filters
    filtersDisplay()
}
else {
    // Display of the edition mode
    editionModeDisplay ()
}

// Recovery of works
worksRecovery()

// Display of works in HTML page
worksDisplay(filterId)
