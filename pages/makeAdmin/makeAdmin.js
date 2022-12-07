import {handleHttpErrors, sanitizeStringWithTableRows, token} from "../../utils.js";
import {makeAdminUrl} from "../../settings.js";

export function initMakeAdmin(){
    window.onload = getUserInfo()
}

async function getUserInfo(){
    const url = window.location.href.split("=");
    const username = url[1];
    await makeAdmin(username)
}

async function makeAdmin(username){
    let adminUrl = makeAdminUrl + username

    const options = {}
    const myHeaders = new Headers();
    myHeaders.append('Authorization', token);
    options.method = "PATCH"
    options.headers = myHeaders
    await fetch(adminUrl, options)
    location.replace("/#/getReferees")


}

