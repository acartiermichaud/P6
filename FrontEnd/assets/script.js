// Functions ***********************************************

// Recovery of works and display in HTML page
async function worksRecovery () {
    const worksJson = await fetch("http://localhost:5678/api/works")
    const works = await worksJson.json()

    let gallery = document.querySelector(".gallery")

    for (let i = 0; i < works.length; i++) {

        let figure = document.createElement("figure")
        gallery.appendChild(figure)

        let img = document.createElement("img")
        img.src = works[i].imageUrl
        img.alt = works[i].title
        figure.appendChild(img)

        let figcaption = document.createElement("figcaption")
        figure.appendChild(figcaption)
        let text = document.createTextNode(works[i].title)
        figcaption.appendChild(text)
    }
}





// Main ****************************************************

// Recovery of works and display in HTML page
worksRecovery()