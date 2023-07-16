// Functions ***********************************************

// Display and filtering of works in HTML page
async function worksDisplay (id) {

    // Recovery of works
    const worksResponse = await fetch("http://localhost:5678/api/works")
    let works = await worksResponse.json()
    
    let gallery = document.querySelector(".gallery")

    for (let i = 0; i < works.length; i++) {

        if ((id === 0) || (id === works[i].category.id)) {
            let figure = document.createElement("figure")
            figure.classList.add("page-figure")
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
function worksPageHTMLDelete () {
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

        filter.addEventListener ("click", (event) => {
            event.preventDefault()
            worksPageHTMLDelete()
            worksDisplay(id)
            filtersStyleUpdate(id)
        })
    }
}


// Recovery of token
function tokenRecovery () {
    const tokenJson = window.localStorage.getItem("token");

    if (tokenJson !== null) {
        return JSON.parse(tokenJson);
    }
    else {
        return null
    }
}


// Clear token
function clearToken() {
    window.localStorage.removeItem("token")
    token = null
}


// Close the modal
function closeModal() {
    let modal = document.getElementById("modal")
    modal.classList.remove("modal-display")
    modal.classList.add("modal-hidden")
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click",(event))
    modal.innerHTML = ``
}


// Delete one project
async function deleteProject(e) {
    // Recovery of the selected project
    let selectedFigure = e.target.parentNode.parentNode
    let selectedImage = selectedFigure.childNodes[0]
    let selectedSrc = selectedImage.src

    // Recovery of works
    const worksResponse = await fetch("http://localhost:5678/api/works")
    let works = await worksResponse.json()
    
    let indexBD = null
    let indexHTML = null
    for (let i = 0; i < works.length; i++) {
        if (selectedSrc === works[i].imageUrl) {
            indexHTML = i
            indexBD = works[i].id
        }
    }

    // Delete in data base
    const deleteResponse = await fetch("http://localhost:5678/api/works/"+indexBD, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`}
    })
    console.log(deleteResponse.status)

    // Delete in modal
    selectedFigure.remove()

    // Delete in HYML page
    let pageFigures = document.querySelectorAll(".page-figure")
    pageFigures[indexHTML].remove()
}


// Delete all projects
async function deleteAllProjects() {
    // Recovery of works
    const worksResponse = await fetch("http://localhost:5678/api/works")
    let works = await worksResponse.json()

    // Delete in data base
    for (let i = 0; i < works.length; i++) {
        let indexBD = works[i].id
        const deleteResponse = await fetch("http://localhost:5678/api/works/"+indexBD, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        })
        console.log(deleteResponse.status)
    }

    // Delete in modal
    let imagesContener = document.getElementById("images-contener")
    imagesContener.innerHTML = ``

    // Delete in HTML page
    worksPageHTMLDelete()
}


// Open the modal
async function openModal() {
    let modal = document.getElementById("modal")
    modal.classList.remove("modal-hidden")
    modal.classList.add("modal-display")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.innerHTML = `
        <div class="modal-contener">
            <div class="contener-button">
                <button class="modal-close-button pointer"><i class="fa-solid fa-xmark fa-xl"></i></button>
            </div>
			<h3 class="modal-title">Galerie photo</h3>
            <div id="images-contener"></div>
            <button type="submit" class="modal-button">Ajouter une photo</button>
            <a class="gallery-delete-link pointer">Supprimer la galerie</a>
		</div>`
    
    // Recovery of works' images
    const worksResponse = await fetch("http://localhost:5678/api/works")
    let works = await worksResponse.json()

    let imagesContener = document.getElementById("images-contener")
    if (works !== null) {
        for (let i = 0; i < works.length; i++) {
            let figure = document.createElement("figure")
            figure.classList.add("modal-figure")
            imagesContener.appendChild(figure)

            let img = document.createElement("img")
            img.src = works[i].imageUrl
            img.alt = works[i].title
            img.classList.add("modal-image")
            figure.appendChild(img)

            let figcaption = document.createElement("figcaption")
            figcaption.classList.add("modal-text-image")
            figure.appendChild(figcaption)
            let textFigure = document.createTextNode("éditer")
            figcaption.appendChild(textFigure)

            let iconsContener = document.createElement("div")
            iconsContener.classList.add("icons-contener")
            figure.appendChild(iconsContener)
            iconsContener.innerHTML = `
                <i class="pointer fa-solid fa-arrows-up-down-left-right fa-xs"></i>
                <i id="delete-icon_${i}" class="pointer fa-solid fa-trash-can fa-xs"></i>`

            let deleteIcon = document.getElementById("delete-icon_"+i)
            deleteIcon.addEventListener ("click", (event) => {
                event.preventDefault()
                deleteProject(event)
            })
        }
    }

    modal.addEventListener ("click", (event) => {
        event.preventDefault()
        closeModal()
    })

    let modalContener = document.querySelector(".modal-contener")
    modalContener.addEventListener ("click", (event) => {
        event.stopPropagation()
    })

    let closeButton = document.querySelector(".modal-close-button")
    closeButton.addEventListener ("click", (event) => {
        event.preventDefault()
        closeModal()
    })

    let deleteGallery = document.querySelector(".gallery-delete-link")
    deleteGallery.addEventListener ("click", (event) => {
        event.preventDefault()
        deleteAllProjects()
    })
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

    // Display of the portfolio edition button and modal
    let portfolioButtonContener = document.querySelector(".button-portfolio-edition-contener")
    portfolioButtonContener.classList.add("button-portfolio-edition-contener-display")
    portfolioButtonContener.innerHTML = `
        <a id="portfolio-edition" class="edition-button pointer" href="#modal"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`

    // Adding the listener event to display modal
    let portfolioButton = document.getElementById("portfolio-edition")
    portfolioButton.addEventListener ("click", (event) => {
        event.preventDefault()
        openModal()
    })

    // Hidden of the login link
    let loginLink = document.querySelector(".login-link")
    loginLink.classList.add("login-link-hidden")

    // Display of the logout link
    let logoutLink = document.querySelector(".logout-link")
    logoutLink.classList.add("logout-link-display")
    logoutLink.addEventListener ("click", () => {
        clearToken()
        window.location.href="./index.html"
    })
}



// Main ****************************************************

// Display of works in HTML page
worksDisplay(0)

// Recovery of token
let token = tokenRecovery () 

if (token === null) {
    // Display of category filters
    filtersDisplay()
}
else {
    // Display of the edition mode
    editionModeDisplay ()
}