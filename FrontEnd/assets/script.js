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


// Update of filters' style
function filtersStyleUpdate(id) {
    let oldSelectedFilter = document.querySelector(".selected-filter")
	oldSelectedFilter.classList.remove("selected-filter")
	
	let newSelectedFilter = document.getElementById("filter_"+id)
	newSelectedFilter.classList.add("selected-filter")
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
            <button type="submit" id="add-image-button" class="modal-button">Ajouter une photo</button>
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
                <i class="pointer move-icon fa-solid fa-arrows-up-down-left-right fa-xs"></i>
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

    let addImageButton = document.getElementById("add-image-button")
    addImageButton.addEventListener ("click", (event) => {
        event.preventDefault()
        openForm()
    })

    let deleteGallery = document.querySelector(".gallery-delete-link")
    deleteGallery.addEventListener ("click", (event) => {
        event.preventDefault()
        deleteAllProjects()
    })
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
    }

    // Delete in modal
    let imagesContener = document.getElementById("images-contener")
    imagesContener.innerHTML = ``

    // Delete in HTML page
    worksPageHTMLDelete()
}


// Open modal form to add image
async function openForm() {
    let formContener = document.getElementById("images-contener")
    formContener.innerHTML = ``

    // Add back icon
    let buttonsContener = document.querySelector(".contener-button")
    buttonsContener.classList.remove("contener-button")
    buttonsContener.classList.add("form-contener-button")

    let backButton = document.createElement("button")
    backButton.classList.add("modal-back-button")
    backButton.classList.add("pointer")
    backButton.innerHTML = `<i class="fa-solid fa-arrow-left fa-xl"></i>`
    buttonsContener.appendChild(backButton)
    backButton.addEventListener ("click", (event) => {
        event.preventDefault()
        closeModal()
        openModal()
    })
    
    // Display title
    let title = document.querySelector(".modal-title")
    title.firstChild.nodeValue = "Ajout photo"

    // Display form
    let form = document.createElement("form")
    form.setAttribute("id", "modal-form")
    form.method = "post"
    form.action = "#"
    formContener.appendChild(form)

    // Download file button
    let downloadButtonContener = document.createElement("div")
    downloadButtonContener.classList.add("download-button-contener")
    form.appendChild(downloadButtonContener)
    downloadButtonContener.innerHTML = `
        <img class="download-image-icon" src="./assets/icons/fa-image.png" alt="Image icon">
        <label class="download-image-button-label pointer" for="download-image-button">+ Ajouter photo</label>
        <input type="file" id="download-image-button" name="download-image-button" accept="image/png, image/jpeg">
        <p>jpg, png : 4mo max</p>`


    // Storage new file src
    let baliseNewFile = document.getElementById("download-image-button")
    let selectedFile = null
    baliseNewFile.addEventListener ("change", (event) => {
        event.preventDefault()
        selectedFile = baliseNewFile.files[0];

        // Image preview in form
        if (selectedFile !== null) {
            downloadButtonContener.innerHTML = ``
            let newImage = document.createElement("img")
            downloadButtonContener.appendChild(newImage)
            newImage.classList.add("new-image")
            newImage.src = URL.createObjectURL(selectedFile);
            newImage.alt = selectedFile.name
            newImage.onload = () => {
                 URL.revokeObjectURL(newImage.src);
            };

            if(document.querySelector(".file-text-error-position")) {
                document.querySelector(".file-text-error-position").remove()
            }
        }
    })

    // Title input
    let newImageTitleLabel = document.createElement("label")
    newImageTitleLabel.setAttribute("for","new-image-title")
    newImageTitleLabel.innerHTML = "Titre"
    form.appendChild(newImageTitleLabel)

    let newImageTitleInput = document.createElement("input")
    newImageTitleInput.type = "text"
    newImageTitleInput.id = "new-image-title"
    newImageTitleInput.name = "new-image-title"
    form.appendChild(newImageTitleInput)
    newImageTitleInput.addEventListener ("change", (event) => {
        event.preventDefault()
        if((newImageTitleInput.value !== "") && (document.querySelector(".file-text-error-position"))) {
            document.querySelector(".title-text-error-position").remove()
        }
    })

    // Recovery of categories
    const categoriesResponse = await fetch("http://localhost:5678/api/categories")
    categories = await categoriesResponse.json()

    // Categories list input
    let categoriesLabel = document.createElement("label")
    categoriesLabel.setAttribute("for","categories-list")
    categoriesLabel.innerHTML = "Catégories"
    form.appendChild(categoriesLabel)

    let categoriesInput = document.createElement("select")
    categoriesInput.id = "categories-list"
    categoriesInput.name = "categories-list"
    form.appendChild(categoriesInput)

    for (let i = 0; i < categories.length; i++) {
        let category = document.createElement("option")
        category.value = categories[i].id
        category.innerHTML = categories[i].name
        categoriesInput.appendChild(category)
    }

    // Storage new category
    let newCategory = categories[0].id
    categoriesInput.addEventListener ("change", (event) => {
        event.preventDefault()
        newCategory = event.target.value
    })
    
    // Style update of form button
    let modalButton = document.querySelector(".modal-button")
    modalButton.remove()
    let modalFormButton = document.createElement("button") 
    modalFormButton.setAttribute("type","submit")
    modalFormButton.setAttribute("id","form-button")
    modalFormButton.classList.add("modal-form-button")
    modalFormButton.classList.add("grey-modal-form-button")
    modalFormButton.innerHTML = "Valider"
    let modalContener = document.querySelector(".modal-contener")
    modalContener.appendChild(modalFormButton)

    // Update button color if new image
    baliseNewFile.addEventListener ("change", (event) => {
        event.preventDefault()
        selectedFile = baliseNewFile.files[0];

        if ((selectedFile !== null) && (newImageTitleInput.value !== "")){
            modalFormButton.classList.remove("grey-modal-form-button")
            modalFormButton.classList.add("green-modal-form-button")
        }
        else {
            modalFormButton.classList.remove("green-modal-form-button")
            modalFormButton.classList.add("grey-modal-form-button")
        }
    })

    // Update button color if new title
    newImageTitleInput.addEventListener ("change", (event) => {
        event.preventDefault()
        if ((event.target.value !== "") && (selectedFile !== null)){
            modalFormButton.classList.remove("grey-modal-form-button")
            modalFormButton.classList.add("green-modal-form-button")
        }
        else {
            modalFormButton.classList.remove("green-modal-form-button")
            modalFormButton.classList.add("grey-modal-form-button")
        }
    })

    // Delete previous link
    let previousLink = document.querySelector(".gallery-delete-link")
    previousLink.remove()

    // Resize modal
    modalContener.classList.remove("modal-contener")
    modalContener.classList.add("form-modal-contener")

    // Recovery project last id
    const worksResponse = await fetch("http://localhost:5678/api/works")
    let works = await worksResponse.json()
    lastId = works[works.length-1].id

    // Form checking
    modalFormButton.removeEventListener("click", event)
    modalFormButton.addEventListener ("click", async (event) => {
        event.preventDefault()

        // Checking file
        if (selectedFile === null) {
            let fileErrorText = document.createElement("p")
            fileErrorText.classList.add("file-text-error")
            fileErrorText.classList.add("file-text-error-position")
            fileErrorText.innerHTML = "Veuillez choisir un fichier."
            downloadButtonContener.appendChild(fileErrorText)
        }

        // Checking title
        if (newImageTitleInput.value === "") {
            let TitleErrorText = document.createElement("p")
            TitleErrorText.classList.add("title-text-error")
            TitleErrorText.classList.add("title-text-error-position")
            TitleErrorText.innerHTML = "Veuillez saisir un titre."
            form.appendChild(TitleErrorText)
        }
    
        // Save new project


        // let formData = new FormData();
        // formData.append("image", URL.createObjectURL(selectedFile))
        // formData.append("type", selectedFile.type)
        // formData.append("title", newImageTitleInput.value)
        // formData.append("category", newCategory)
        
        // ////////////////////////////
        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
        // ///////////////////////////
        
        // let request = new XMLHttpRequest();
        // request.open("POST", "http://localhost:5678/api/works");
        // request.setRequestHeader("Content-Type", "multipart/form-data");
        // request.send(formData);


        jsonFormData = {
            "image" : URL.createObjectURL(selectedFile),
            "type" : selectedFile.type,
            "title" : newImageTitleInput.value,
            "category" : newCategory
        }

        const newProjectResponse = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"},
            body: jsonFormData
        })
        console.log(newProjectResponse.status)

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