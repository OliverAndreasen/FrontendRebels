import {checkAccess, handleHttpErrors, token} from "./utils.js";

const userUrl = "http://localhost:8080/api/login/user-fromtoken";
window.addEventListener("load", checkLoginStatusAndCreateNavBar())

async function checkLoginStatusAndCreateNavBar() {
    const accessOptions = ["admin", "user", "referee"]
    let alreadyRan = 0;

    for (let i = 0; i < accessOptions.length; i++) {
        checkAccess(accessOptions[i]).then(result => {
            if (result) {
                if (accessOptions[i] === "admin") {
                    createAdminNavBar()
                }
                if (alreadyRan === 0) {
                    createNavBar(true)

                    i = accessOptions.length;
                    alreadyRan = 1;
                }
            } else if (i === accessOptions.length - 1 && alreadyRan === 0) {
                createNavBar(false)
            }
        })
    }
}


async function getUserFromUrl() {
    const options = {}
    options.method = "GET"
    options.headers = {"Authorization": token}
    return await fetch(userUrl, options).then(handleHttpErrors)
}

export function createNavBar(isLoggedIn) {
    if (isLoggedIn) {
        createMyMatches()
        createMySignups()
        createNavMyProfile()
    } else {
        createLoginButton()
    }
}

function createMyMatches() {
    const li = document.createElement("li")
    li.setAttribute("class", "nav-item nav-my-matches")

    const a = document.createElement("a")
    a.className = "nav-link"
    a.setAttribute("href", "/myMatches")
    a.setAttribute("data-navigo", true)
    a.textContent = "Mine Tilmeldte Kampe"

    li.append(a)
    document.querySelector("#menu").append(li)
}

function createMySignups() {
    const li = document.createElement("li")
    li.setAttribute("class", "nav-item nav-my-signups")

    const a = document.createElement("a")
    a.className = "nav-link"
    a.setAttribute("href", "/mySignups")
    a.setAttribute("data-navigo", "true")
    a.textContent = "Mine Godkendte Kampe"

    li.append(a)
    document.querySelector("#menu").append(li)
}

function createNavMyProfile() {
    const div = document.createElement("div")
    div.className = "dropdown"
    div.id = "dropdown-logged-in"

    const button = document.createElement("button")
    button.className = "btn btn-primary dropdown-toggle"
    button.type = "button"
    button.setAttribute("data-bs-toggle", "dropdown")
    button.setAttribute("aria-expanded", "false")

    getUserFromUrl().then(user => {
        button.textContent = user.username
    })

    div.append(button)
    const ul = document.createElement("ul")
    ul.className = "dropdown-menu"

    const li = document.createElement("li")
    const a = document.createElement("a")
    a.setAttribute("href", "/#/myProfile")
    a.className = "dropdown-item"

    a.textContent = "Se profil"
    li.append(a)
    ul.append(li)

    const li2 = document.createElement("li")
    const a2 = document.createElement("a")
    a2.setAttribute("href", "/#/logout")
    a2.className = "dropdown-item"
    a2.textContent = "Log ud"
    li2.append(a2)
    ul.append(li2)

    div.append(ul)

    document.querySelector("#top-menu-container").appendChild(div)
}

function createLoginButton() {
    if (document.querySelector("#dropdown-logged-in")) {
        document.querySelector("#dropdown-logged-in").remove()
    }
    if (document.querySelector(".nav-admin")) {
        document.querySelector(".nav-admin").remove()
    }
    if (document.querySelector(".nav-my-matches")) {
        document.querySelector(".nav-my-matches").remove()
    }
    if (document.querySelector(".nav-my-signups")) {
        document.querySelector(".nav-my-signups").remove()
    }
     if (document.querySelector(".create-club")) {
        document.querySelector(".create-club").remove()
    }
    const a = document.createElement("a")
    a.setAttribute("href", "/#/login")
    a.setAttribute("data-navigo", "true")
    a.textContent = "Login"
    a.setAttribute("class", "nav-link")
    document.querySelector("#top-menu-container").appendChild(a)
}

function createAdminNavBar() {
    const li = document.createElement("li")
    li.setAttribute("class", "nav-item nav-admin")

    const a = document.createElement("a")
    a.className = "nav-link"
    a.setAttribute("href", "/getReferees")
    a.setAttribute("data-navigo", "true")
    a.textContent = "Alle dommere"

    li.append(a)
    document.querySelector("#menu").append(li)

    const li2 = document.createElement("li")
    li2.setAttribute("class", "nav-item create-club")

    const a2 = document.createElement("a")
    a2.className = "nav-link"
    a2.setAttribute("href", "/createClub")
    a2.setAttribute("data-navigo", "true")
    a2.textContent = "Opret Klub"

    li2.append(a2)
    document.querySelector("#menu").append(li2)
}

