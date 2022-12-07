const clubUrlLink = "/#/club?clubName="
import {refereeUrl} from "../../settings.js";
import { handleHttpErrors, token, capitalizeFirstLetter } from "../../utils.js";

export async function initMyProfile() {
    await myProfileButtons()
}

async function myProfileButtons(){
    await setProfileInfo()
    document.querySelector("#profile-change-information").onclick = goToEditProfile
    document.querySelector("#profile-change-password").onclick = goToEditPassword
}

function goToEditProfile(){
    location.replace("/#/editReferee")
}

function goToEditPassword(){
    location.replace("/#/editRefereePassword")
}

async function setProfileInfo(){
    const referee = await getUserInfo()
    setUserInfo(referee)
    createClubLink(referee)
}

async function getUserInfo(){
    const options = {}
    options.method = "GET"
    options.headers = {"Authorization": token}
    return await fetch(refereeUrl,options).then(handleHttpErrors)
}

function setUserInfo(referee){
    document.querySelector("#input-user-username").innerHTML = DOMPurify.sanitize(referee.username)
    document.querySelector("#input-user-email").innerHTML =DOMPurify.sanitize(referee.email)
    document.querySelector("#input-user-firstname").innerHTML = DOMPurify.sanitize(referee.firstname)
    document.querySelector("#input-user-lastname").innerHTML = DOMPurify.sanitize(referee.lastname)
    document.querySelector("#input-user-bankinformation").innerHTML = DOMPurify.sanitize(referee.bankInformation)
    document.querySelector("#input-user-license").innerHTML = DOMPurify.sanitize(referee.license)
}

function createClubLink(referee){
    let clubName = referee.clubName
    const clubLink = clubUrlLink + clubName;
    const clubCol = document.querySelector("#club-col")

    clubCol.style.cursor = "pointer"
    clubCol.onclick = function() {
        location.replace(clubLink)
    }
    clubName = capitalizeFirstLetter(clubName)

    document.querySelector("#club-name").innerHTML = DOMPurify.sanitize(clubName)
}