import { createErrorMessage, handleHttpErrors } from "../../utils.js";
import {loginUrl, refereeUrl} from "../../settings.js";

export function initLogin(){
    window.addEventListener("load",login())
}


async function login() {
    document.querySelector("#btn-user-login").onclick = checkLogin

    async function checkLogin() {
        const userDetails = inputFields()
        createPostRequest(userDetails)
    }
}

function inputFields(){
    const userDetails = {}
    userDetails.username = document.querySelector("#input-user-username").value
    userDetails.password = document.querySelector("#input-user-password").value
    return userDetails
}

async function createPostRequest(userDetails){
    const options = {}
    options.method = "POST"
    options.headers = {"Content-type": "application/json"}
    options.body = JSON.stringify(userDetails)

    const login = await fetch(loginUrl, options).then(handleHttpErrors).then(data => {
            localStorage.setItem("token", data.token)
            location.replace("/")
        }).catch(err => {
            createErrorMessage("Forkerte login oplysninger")
        })
}