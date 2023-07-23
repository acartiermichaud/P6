// Functions *********************************************************************************************

// Display and filtering of works in HTML page ***********************************************************
async function worksDisplay (id) {

    try {
        // Recovery of works from API
        const worksResponse = await fetch("http://localhost:5678/api/works")
        
        if (worksResponse.status === 200){
            const works = await worksResponse.json()
            const gallery = document.querySelector(".gallery")

            for (let i = 0; i < works.length; i++) {

                // Display of works
                if ((id === 0) || (id === works[i].category.id)) {
                    const figure = document.createElement("figure")
                    figure.classList.add("page-figure")
                    gallery.appendChild(figure)

                    const img = document.createElement("img")
                    img.src = works[i].imageUrl
                    img.alt = works[i].title
                    figure.appendChild(img)

                    const figcaption = document.createElement("figcaption")
                    figure.appendChild(figcaption)
                    const textFigure = document.createTextNode(works[i].title)
                    figcaption.appendChild(textFigure)
                }
            }
        }
    }

    catch (error) {
        console.error("Une erreur est survenue : ", error);
    }
}


// Deletion of all works in HTML page ********************************************************************
function worksPageHTMLDelete () {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
}


// Display of category filters ***************************************************************************
async function filtersDisplay () {

    try {
        // Recovery of categories from API
        const categoriesResponse = await fetch("http://localhost:5678/api/categories")

        if (categoriesResponse.status === 200){
            const categories = await categoriesResponse.json()
            const filtersContener = document.querySelector(".filters-contener")

            // Display of filters
            for (let i = 0; i < categories.length+1; i++) {
                const filter = document.createElement("button")
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

                const filterText = document.createTextNode(text)
                filter.appendChild(filterText)

                filter.addEventListener ("click", (event) => {
                    event.preventDefault()
                    worksPageHTMLDelete()
                    worksDisplay(id)
                    filtersStyleUpdate(id)
                })
            }
        }
    }
    
    catch (error) {
        console.error("Une erreur est survenue : ", error);
    }
}


// Update of filters' style ******************************************************************************
function filtersStyleUpdate(id) {
    const oldSelectedFilter = document.querySelector(".selected-filter")
	oldSelectedFilter.classList.remove("selected-filter")
	
	const newSelectedFilter = document.getElementById("filter_"+id)
	newSelectedFilter.classList.add("selected-filter")
}


// Display of the edition mode ***************************************************************************
function editionModeDisplay () {

    // Recovery of token
    const tokenJson = window.localStorage.getItem("token")

    if (tokenJson !== null) {

        // Display of the edition mode bar
        const editionBar = document.querySelector(".edition-bar")
        editionBar.classList.add("edition-bar-display")
        editionBar.innerHTML = `
            <p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>
            <button class="edition-bar-button">publier les changements</button>`

        // Display of the introduction edition button
        const introButtonContener = document.querySelector(".edition-intro-button-contener")
        introButtonContener.classList.add("edition-intro-button-contener-display")
        introButtonContener.innerHTML = `
            <button id="intro-edition" class="edition-button pointer"><i class="fa-regular fa-pen-to-square"></i>modifier</button>`

        // Display of the portfolio edition button
        const portfolioButtonContener = document.querySelector(".edition-portfolio-button-contener")
        portfolioButtonContener.classList.add("edition-portfolio-button-contener-display")
        portfolioButtonContener.innerHTML = `
            <a id="portfolio-edition" class="edition-button pointer" href="#modal"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`

        // Adding the listener event to display modal
        const portfolioButton = document.getElementById("portfolio-edition")
        portfolioButton.addEventListener ("click", (event) => {
            event.preventDefault()
            openModal()
        })

        // Hidden of the login link
        const loginLink = document.querySelector(".login-link")
        loginLink.classList.add("login-link-hidden")

        // Display of the logout link
        const logoutLink = document.querySelector(".logout-link")
        logoutLink.classList.add("logout-link-display")
        logoutLink.addEventListener ("click", () => {
            window.localStorage.removeItem("token")
            window.location.href="./index.html"
        })

        return true
    }

    else {
        return false
    }
}


// Open the modal ****************************************************************************************
async function openModal() {
    const modal = document.getElementById("modal")
    modal.classList.remove("modal-hidden")
    modal.classList.add("modal-display")
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.setAttribute("aria-labelledby", "modal-title")
    modal.innerHTML = `
        <div class="modal-contener">
            <div class="button-contener">
                <button class="modal-close-button pointer"><i class="fa-solid fa-xmark fa-xl"></i></button>
            </div>
			<h3 class="modal-title">Galerie photo</h3>
            <div id="images-contener"></div>
            <button type="submit" id="add-image-button" class="modal-button">Ajouter une photo</button>
            <a class="gallery-delete-link pointer">Supprimer la galerie</a>
		</div>`
    
    try {
        // API request
        const worksResponse = await fetch("http://localhost:5678/api/works")

        if (worksResponse.status === 200) {
            const works = await worksResponse.json()
            const imagesContener = document.getElementById("images-contener")
        
            // Recovery of works' images
            for (let i = 0; i < works.length; i++) {
                const figure = document.createElement("figure")
                figure.classList.add("modal-figure")
                imagesContener.appendChild(figure)

                const img = document.createElement("img")
                img.src = works[i].imageUrl
                img.alt = works[i].title
                img.classList.add("modal-image")
                figure.appendChild(img)

                const figcaption = document.createElement("figcaption")
                figcaption.classList.add("modal-text-image")
                figure.appendChild(figcaption)
                const textFigure = document.createTextNode("éditer")
                figcaption.appendChild(textFigure)

                const iconsContener = document.createElement("div")
                iconsContener.classList.add("icons-contener")
                figure.appendChild(iconsContener)
                iconsContener.innerHTML = `
                    <i class="pointer move-icon fa-solid fa-arrows-up-down-left-right fa-xs"></i>
                    <i id="delete-icon_${i}" class="pointer fa-solid fa-trash-can fa-xs"></i>`

                // Adding the listener event to delete one project
                const deleteIcon = document.getElementById("delete-icon_"+i)
                deleteIcon.addEventListener ("click", (event) => {
                    event.preventDefault()
                    deleteProject(event)
                })
            }
        
            // Adding the listener event to close the modal if user clicks outside the modal
            modal.addEventListener ("click", (event) => {
                event.preventDefault()
                closeModal()
            })

            // Adding the listener event to not close the modal if user clicks inside the modal
            const modalContener = document.querySelector(".modal-contener")
            modalContener.addEventListener ("click", (event) => {
                event.stopPropagation()
            })

            // Adding the listener event to close the modal if user clicks on the close button
            const closeButton = document.querySelector(".modal-close-button")
            closeButton.addEventListener ("click", (event) => {
                event.preventDefault()
                closeModal()
            })

            // Adding the listener event to open the form if user clicks on the add button
            const addImageButton = document.getElementById("add-image-button")
            addImageButton.addEventListener ("click", (event) => {
                event.preventDefault()
                openForm()
            })

            // Adding the listener event to delete all the works if user clicks on delete link
            const deleteGallery = document.querySelector(".gallery-delete-link")
            deleteGallery.addEventListener ("click", (event) => {
                event.preventDefault()
                deleteAllProjects()
            })
        }
    } 
    catch (error) {
        console.error("Une erreur est survenue : ", error);
    }
} 


// Close the modal ***************************************************************************************
function closeModal() {
    const modal = document.getElementById("modal")
    modal.classList.remove("modal-display")
    modal.classList.add("modal-hidden")
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click",(event))
    modal.innerHTML = ``
}


// Delete one project ************************************************************************************
async function deleteProject(e) {
    // Recovery of the selected project
    const selectedFigure = e.target.parentNode.parentNode
    const selectedImage = selectedFigure.childNodes[0]
    const selectedSrc = selectedImage.src

    try {
        // Recovery of works
        const worksResponse = await fetch("http://localhost:5678/api/works")

        if (worksResponse.status === 200) {
            const works = await worksResponse.json()
        
            let indexBD = null
            let indexHTML = null
            for (let i = 0; i < works.length; i++) {
                if (selectedSrc === works[i].imageUrl) {
                    indexHTML = i
                    indexBD = works[i].id
                }
            }
            
            // Recovery of token
            const tokenJson = window.localStorage.getItem("token");

            if (tokenJson !== null) {
                const token = JSON.parse(tokenJson);

                try {
                    // Delete in data base
                    const deleteResponse = await fetch("http://localhost:5678/api/works/"+indexBD, {
                        method: "DELETE",
                        headers: {"Authorization": `Bearer ${token}`}
                    })

                    if ((deleteResponse.status === 200) || (deleteResponse.status === 204)) {
                        // Delete in modal
                        selectedFigure.remove()

                        // Delete in HYML page
                        const pageFigures = document.querySelectorAll(".page-figure")
                        pageFigures[indexHTML].remove()

                        // Display success message
                        successMessageDisplay("delete")
                    }
                }

                catch (error) {
                    console.error("Une erreur est survenue : ", error);
                }
            }
        }
    }

    catch (error) {
        console.error("Une erreur est survenue : ", error);
    }
}


// Delete all projects ***********************************************************************************
async function deleteAllProjects() {

    try {
        // Recovery of works
        const worksResponse = await fetch("http://localhost:5678/api/works")

        if (worksResponse.status === 200) {
            const works = await worksResponse.json()

            // Recovery of token
            const tokenJson = window.localStorage.getItem("token");

            if (tokenJson !== null) {
                const token = JSON.parse(tokenJson);

                // Delete in data base
                let deletion = false
                for (let i = 0; i < works.length; i++) {
                    const indexBD = works[i].id
                    
                    try {
                        const deleteResponse = await fetch("http://localhost:5678/api/works/"+indexBD, {
                            method: "DELETE",
                            headers: {"Authorization": `Bearer ${token}`}
                        })

                        if ((deleteResponse.status === 200) || (deleteResponse.status === 204)) {
                            deletion = true
                        }
                    }

                    catch (error) {
                        console.error("Une erreur est survenue : ", error);
                    }
                }

                if (deletion) {
                    // Delete in modal
                    const imagesContener = document.getElementById("images-contener")
                    imagesContener.innerHTML = ``

                    // Delete in HTML page
                    worksPageHTMLDelete()

                    // Display success message
                    successMessageDisplay("deleteAll")
                }
            }
        }
    }

    catch (error) {
        console.error("Une erreur est survenue : ", error);
    }
}


// Open modal form to add image **************************************************************************
async function openForm() {
    const formContener = document.getElementById("images-contener")
    formContener.innerHTML = ``

    // Add back icon
    const buttonsContener = document.querySelector(".button-contener")
    buttonsContener.classList.remove("button-contener")
    buttonsContener.classList.add("form-button-contener")

    const backButton = document.createElement("button")
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
    const title = document.querySelector(".modal-title")
    title.firstChild.nodeValue = "Ajout photo"

    // Display form
    const form = document.createElement("form")
    form.setAttribute("id", "modal-form")
    form.method = "post"
    form.action = "#"
    form.enctype = "multipart/form-data"
    formContener.appendChild(form)

    // Download file button
    const downloadButtonContener = document.createElement("div")
    downloadButtonContener.classList.add("download-button-contener")
    form.appendChild(downloadButtonContener)
    downloadButtonContener.innerHTML = `
        <img class="download-image-icon" src="./assets/icons/fa-image.png" alt="Image icon">
        <label class="download-image-button-label pointer" for="download-image-button">+ Ajouter photo</label>
        <input type="file" id="download-image-button" name="download-image-button" accept="image/png, image/jpeg">
        <p>jpg, png : 4mo max</p>`


    // Saving new file
    const baliseNewFile = document.getElementById("download-image-button")
    let selectedFile = null
    baliseNewFile.addEventListener ("change", (event) => {
        event.preventDefault()
        selectedFile = baliseNewFile.files[0];

        // Image preview in form
        if (selectedFile !== null) {
            downloadButtonContener.innerHTML = ``
            const newImage = document.createElement("img")
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
    const newImageTitleLabel = document.createElement("label")
    newImageTitleLabel.setAttribute("for","new-image-title")
    newImageTitleLabel.innerHTML = "Titre"
    form.appendChild(newImageTitleLabel)

    const newImageTitleInput = document.createElement("input")
    newImageTitleInput.type = "text"
    newImageTitleInput.id = "new-image-title"
    newImageTitleInput.name = "new-image-title"
    form.appendChild(newImageTitleInput)
    newImageTitleInput.addEventListener ("change", (event) => {
        event.preventDefault()
        if((newImageTitleInput.value !== "") && (document.querySelector(".title-text-error-position"))) {
            document.querySelector(".title-text-error-position").remove()
        }
    })

    try {
        // Recovery of categories
        const categoriesResponse = await fetch("http://localhost:5678/api/categories")

        if (categoriesResponse.status === 200) {
            categories = await categoriesResponse.json()

            // Categories list input
            const categoriesLabel = document.createElement("label")
            categoriesLabel.setAttribute("for","categories-list")
            categoriesLabel.innerHTML = "Catégories"
            form.appendChild(categoriesLabel)

            const categoriesInput = document.createElement("select")
            categoriesInput.id = "categories-list"
            categoriesInput.name = "categories-list"
            form.appendChild(categoriesInput)

            for (let i = 0; i < categories.length; i++) {
                const category = document.createElement("option")
                category.value = categories[i].id
                category.innerHTML = categories[i].name
                categoriesInput.appendChild(category)
            }

            // Saving new category
            const newCategory = categories[0].id
            categoriesInput.addEventListener ("change", (event) => {
                event.preventDefault()
                newCategory = event.target.value
            })
            
            // Validate button
            const modalButton = document.querySelector(".modal-button")
            modalButton.remove()
            const modalFormButton = document.createElement("button") 
            modalFormButton.setAttribute("type","submit")
            modalFormButton.setAttribute("id","form-button")
            modalFormButton.classList.add("modal-form-button")
            modalFormButton.classList.add("grey-modal-form-button")
            modalFormButton.innerHTML = "Valider"
            const modalContener = document.querySelector(".modal-contener")
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
            const previousLink = document.querySelector(".gallery-delete-link")
            previousLink.remove()

            // Form checking
            modalFormButton.removeEventListener("click", event)
            modalFormButton.addEventListener ("click", async (event) => {
                event.preventDefault()

                // Checking file
                if (selectedFile === null) {
                    if(!document.querySelector(".file-text-error-position")) {
                        const fileErrorText = document.createElement("p")
                        fileErrorText.classList.add("file-text-error")
                        fileErrorText.classList.add("file-text-error-position")
                        fileErrorText.innerHTML = "Veuillez choisir un fichier."
                        downloadButtonContener.appendChild(fileErrorText)
                    }             
                }

                // Checking title
                if (newImageTitleInput.value === "") {
                    if(!document.querySelector(".title-text-error-position")) {
                        const TitleErrorText = document.createElement("p")
                        TitleErrorText.classList.add("title-text-error")
                        TitleErrorText.classList.add("title-text-error-position")
                        TitleErrorText.innerHTML = "Veuillez saisir un titre."
                        form.appendChild(TitleErrorText)
                    }
                }

                if ((selectedFile !== null) && (newImageTitleInput.value !== "") ) {
                    // Save new project
                    const formData = new FormData();
                    formData.append("image", selectedFile)
                    formData.append("title", newImageTitleInput.value)
                    formData.append("category", newCategory)

                    // Recovery of token
                    const tokenJson = window.localStorage.getItem("token");

                    if (tokenJson !== null) {
                        const token = JSON.parse(tokenJson);

                        try {
                            // Save the new work in data base
                            const newProjectResponse = await fetch("http://localhost:5678/api/works", {
                                method: "POST",
                                headers: {"Authorization": `Bearer ${token}`},
                                body: formData
                            })
                            
                            if (newProjectResponse.status === 201) {
                                try {
                                    // Recovery of last added project
                                    const worksResponse = await fetch("http://localhost:5678/api/works")
        
                                    if (worksResponse.status === 200) {
                                        const works = await worksResponse.json()
        
                                        // Adding in HTML page
                                        const gallery = document.querySelector(".gallery")
        
                                        const figure = document.createElement("figure")
                                        figure.classList.add("page-figure")
                                        gallery.appendChild(figure)
        
                                        const img = document.createElement("img")
                                        img.src = works[works.length-1].imageUrl
                                        img.alt = works[works.length-1].title
                                        figure.appendChild(img)
        
                                        const figcaption = document.createElement("figcaption")
                                        figure.appendChild(figcaption)
                                        const textFigure = document.createTextNode(works[works.length-1].title)
                                        figcaption.appendChild(textFigure)
        
                                        // Back to the first modal with success message
                                        closeModal()
                                        openModal()
                                        successMessageDisplay("add")
                                    }                       
                                }
        
                                catch (error) {
                                    console.error("Une erreur est survenue :", error);
                                } 
                            }
                        }
        
                        catch (error) {
                            console.error("Une erreur est survenue :", error);
                        } 
                    }
                }        
            })
        }
    }

    catch (error) {
        console.error("Une erreur est survenue :", error);
    }
}


// Display success messages *******************************************************************************
function successMessageDisplay (action) {
    const imagesContener = document.getElementById("images-contener")

    const messageText = document.createElement("p")
    messageText.classList.add("text-message")
    messageText.classList.add("text-message-position")

    if (action === "add") {
        messageText.innerHTML = "Projet créé avec succès."
    }
    if ( action === "delete") {
        messageText.innerHTML = "Projet supprimé avec succès."
    }
    if ( action === "deleteAll") {
        messageText.innerHTML = "Projets supprimés avec succès."
    }
    
    imagesContener.appendChild(messageText)
}




// Main **************************************************************************************************

// Display of the edition mode
const editionMode = editionModeDisplay ()

// Display of category filters
if (!editionMode){
    filtersDisplay()
}

// Display of works in HTML page
worksDisplay(0)