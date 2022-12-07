import {refereeUrl} from "../../settings.js";
import { handleHttpErrors, createErrorMessage, validateAllObjectWhiteSpaces, checkIfEmptyObject, token} from "../../utils.js";



export function initEditReferee(){
    window.addEventListener("load", editReferee())
}

async function editReferee(){
    await getUserInfo(token);
    document.querySelector("#btn-user-add").onclick = changeReferee;

    async function changeReferee(){
        const refereeUpdate = inputFields()
        if(checkIfEmptyObject(refereeUpdate)){
            createErrorMessage("Venligst udfyld alle felter")
        }else if(validateAllObjectWhiteSpaces(refereeUpdate)){
            createErrorMessage("Du må ikke bruge mellemrum")
        }else {
            await createPatchRequest(refereeUpdate, token)
        }
    }

    async function getUserInfo(token){

        const options = {}
        options.method = "GET"
        options.headers = {"Authorization": token}
        const refereeInfo = await fetch(refereeUrl,options).then(handleHttpErrors)
        setFields(refereeInfo)
    }

    function setFields(refereeInfo){
        document.querySelector("#input-user-username").value = (refereeInfo.username)
        document.querySelector("#input-user-email").value = refereeInfo.email
        document.querySelector("#input-user-firstname").value = refereeInfo.firstname
        document.querySelector("#input-user-lastname").value = refereeInfo.lastname
        document.querySelector("#input-user-bankinformation").value = refereeInfo.bankInformation
        document.querySelector("#input-user-license").value = refereeInfo.license
    }

    function inputFields(){
        const refereeUpdate = {}
        refereeUpdate.email = document.querySelector("#input-user-email").value
        refereeUpdate.firstname = document.querySelector("#input-user-firstname").value
        refereeUpdate.lastname = document.querySelector("#input-user-lastname").value
        refereeUpdate.bankInformation = document.querySelector("#input-user-bankinformation").value
        refereeUpdate.license = document.querySelector("#input-user-license").value
        return refereeUpdate
    }

    async function createPatchRequest(refereeUpdate, token){


        const options = {}
        const myHeaders = new Headers();
        myHeaders.append('Content-type', 'application/json');
        myHeaders.append('Authorization', token);

        options.method = "PATCH"
        options.headers = myHeaders
        options.body = JSON.stringify(refereeUpdate)
        await fetch(refereeUrl, options).then(handleHttpErrors).then(data => {
            location.replace("/#/myProfile")
        }).catch(err => {
            createErrorMessage(err.message)
        })
    }
}
