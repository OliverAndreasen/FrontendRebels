import {handleHttpErrors, sanitizeStringWithTableRows, token} from "../../utils.js";
import {makeAdminUrl, refereesUrl} from "../../settings.js";

export function initGetReferees(){
    setupReferees()
}

async function setupReferees(){
    const referees = await getAllReferees()
    displayMatches(referees)
}

async function getAllReferees(){
    const options = {}
    options.method = "GET"
    options.headers = {"Authorization": token}
    return await fetch(refereesUrl, options).then(handleHttpErrors)
}


function displayMatches(referees){
    let tableData = referees.map(r =>
        `
        <tr>
            <td>${r.username}</td>
            <td>${r.firstname}</td>
            <td>${r.lastname}</td>
            <td>${r.email}</td>
            <td>${r.license}</td>
            <td>${r.roles}</td>
            <td><a href="#/makeAdmin?username=${r.username}">Make Admin</a></td>
        </tr>
        `
    )
    const tableString = tableData.join("\n");
    document.querySelector("#tbody").innerHTML = sanitizeStringWithTableRows(tableString);
}