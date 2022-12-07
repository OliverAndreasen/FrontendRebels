import {refereeUrl} from "../../settings.js";
import {handleHttpErrors, validateAllObjectWhiteSpaces, checkIfEmptyObject, createErrorMessage} from "../../utils.js";


export function initCreateReferee() {

    window.addEventListener("load", createReferee())
}

async function createReferee() {
    document.querySelector("#btn-user-add").onclick = makeNewReferee;

    async function makeNewReferee() {

        const newReferee = inputFields()

        if (checkIfEmptyObject(newReferee)) {
                createErrorMessage("Venligst udfyld alle felter")
        } else if (validateAllObjectWhiteSpaces(newReferee)) {
                createErrorMessage("Du må ikke bruge mellemrum")
        } else {
           sendPostRequest(newReferee)
        }
    }
}

function inputFields() {
    const newReferee = {}

    newReferee.username = document.querySelector("#input-user-username").value
    newReferee.email = document.querySelector("#input-user-email").value
    newReferee.password = document.querySelector("#input-user-password").value
    newReferee.firstname = document.querySelector("#input-user-firstname").value
    newReferee.lastname = document.querySelector("#input-user-lastname").value
    newReferee.bankInformation = document.querySelector("#input-user-bankinformation").value
    newReferee.license = document.querySelector("#input-user-license").value

    return newReferee
}


async function sendPostRequest(newReferee){
    const options = {}
    options.method = "POST"
    options.headers = {"Content-type": "application/json"}
    options.body = JSON.stringify(newReferee)
    //if user is added to database, then redirect to login page
    await fetch(refereeUrl, options).then(handleHttpErrors).then(data => {
        location.replace("/#/login")
    }).catch(err => {
        createErrorMessage(err.message  )
    })
}
