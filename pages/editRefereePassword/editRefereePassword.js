
import {refereeUrl, refereeUrlChangePassword} from "../../settings.js";

import {handleHttpErrors, createErrorMessage,checkIfEmptyObject, validateAllObjectWhiteSpaces, token} from "../../utils.js";


export function initEditRefereePassword() {
    window.addEventListener("load", editReferee())
}

async function editReferee() {
    getUserInfo();
    document.querySelector("#btn-user-add").onclick = changeRefereePassword;

    async function changeRefereePassword() {
        const refereeUpdates = inputFields()


        const passwordCheckVar = passwordCheck(refereeUpdates.password, refereeUpdates.passwordVerify)

        if(checkIfEmptyObject(refereeUpdates)){
            createErrorMessage("Venligst udfyld alle felter")
        }
        else if (validateAllObjectWhiteSpaces(refereeUpdates)) {
            createErrorMessage("Password må ikke indeholde mellemrum")
        }
        else if (!passwordCheckVar) {
            createErrorMessage("Password matcher ikke")
        } 
        else {
            createPatchRequest(refereeUpdates)
        }
    }

    function inputFields(){
        const refereeUpdates = {}
        refereeUpdates.password = document.querySelector("#input-user-password").value
        refereeUpdates.passwordVerify = document.querySelector("#input-user-password-verify").value
        return refereeUpdates
    }


    async function getUserInfo() {

        const options = {}
        options.method = "GET"
        options.headers = {"Authorization": token}

        const refereeInfo = await fetch(refereeUrl, options).then(handleHttpErrors)

        document.querySelector("#input-user-username").value = (refereeInfo.username)
    }
}

function passwordCheck(password, passwordCheck) {
    if (password == passwordCheck && !password == "") {
        return true
    } else {
        return false
    }
}

async function createPatchRequest(refreeUpdates){
    const options = {}

    const myHeaders = new Headers();
    myHeaders.append('Content-type', 'application/json');
    myHeaders.append('Authorization', token);


    options.method = "PATCH"
    options.headers = myHeaders
    options.body = JSON.stringify(refreeUpdates)
    const addUser = await fetch(refereeUrlChangePassword, options)
    location.replace("/#/myProfile")
}

