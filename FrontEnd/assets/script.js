// Global variables *****************************************
let worksJson = null
let categoriesJson = null
let works = ""
let categories = ""
let filterId = 0



// Functions ***********************************************

// Recovery of works
async function worksRecovery () {
    worksJson = window.localStorage.getItem("works");

    if (worksJson === null) {
        const worksresponse = await fetch("http://localhost:5678/api/works")
        works = await worksresponse.json()

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
    categoriesJson = window.localStorage.getItem("categories");

    if (categoriesJson === null) {
        const categoriesresponse = await fetch("http://localhost:5678/api/categories")
        categories = await categoriesresponse.json()

        // Local storage of categories
        categoriesJson = JSON.stringify(categories);
        window.localStorage.setItem("categories", categoriesJson);
    }
    else {
        categories = JSON.parse(categoriesJson);
    }

    // Creation of filters
    let filtersContener = document.querySelector(".filters-contener")

    for (let i = 0; i < categories.length+1; i++) {
        let filter = document.createElement("button")
        filter.setAttribute("id", "filter_"+i)
        filter.classList.add("filter")
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



// Main ****************************************************

// Recovery of works
worksRecovery()

// Display of works in HTML page
worksDisplay(filterId)

// Display of category filters
filtersDisplay()