import { handleHttpErrors, capitalizeFirstLetter } from "../../utils.js";
import { matchesUrl, teamsUrl, refereeUrl, signupsUrl, addSignUpUrl } from "../../settings.js";

let user;
let matchId;
let globalMatch;

export function initMatch() {
    setup();
}

async function setup() {
    matchId = getMatchIdFromUrl();
    const match = await fetch(matchesUrl + matchId).then(handleHttpErrors);
    globalMatch = match;
    const signups = await fetch(signupsUrl + matchId).then(handleHttpErrors);
    displayMatch(match);
    displaySignups(signups);
    displayAccepted(match);
    user = await getUser();
    document.querySelector(".error").innerHTML = "";
}

async function displaySignups(signups) {
    const signupList = document.querySelector("#signup-list");
    const signupListClone = signupList.cloneNode(true);
    signupList.parentNode.replaceChild(signupListClone, signupList);

    signupListClone.innerHTML = "";
    let listData = signups
        .map(
            (s) =>
                `
                <div class = "list-item">
                <li id="${s.id}">${s.refereeUsername}</li> 
                <button class = "btn">+</button>
                </div>
            `
        )
        .join("\n");
    signupListClone.innerHTML = DOMPurify.sanitize(listData);

    signupListClone.addEventListener("mouseup", (e) => {
        const refereeUsername = e.target.previousElementSibling.innerHTML;
        const signupId = e.target.previousElementSibling.id;
        addAccepted(refereeUsername, signupId);
    });
    document.querySelector("#signup-button").onclick = addSignUp;
}

function displayAccepted(match) {
    const acceptedList = document.querySelector("#accepted-list");
    acceptedList.innerHTML = "";
    const listData = match.acceptedReferees
        .map(
            (a) =>
                `
        <li>${a}</li>
        `
        )
        .join("\n");
    acceptedList.innerHTML = DOMPurify.sanitize(listData);
    document.querySelector("#number-of-accepted-referees").innerText = match.acceptedReferees.length + " / " + match.numberOfReferees;
}

function getMatchIdFromUrl() {
    const splitUrl = window.location.href.split("=");
    const matchId = splitUrl[1];
    return matchId;
}

function displayMatch(matchData) {
    const homeTeam = capitalizeFirstLetter(matchData.homeTeamName);
    const awayteam = capitalizeFirstLetter(matchData.awayTeamName);
    document.querySelector("#hometeam").innerHTML = homeTeam + " " + matchData.divisionName;
    document.querySelector("#awayteam").innerHTML = awayteam + " " + matchData.divisionName;
    document.querySelector("#address").innerHTML = matchData.address;
    document.querySelector(".hometeam-img").src = "./images/logos/" + matchData.homeTeamImg + ".png";
    document.querySelector(".awayteam-img").src = "./images/logos/" + matchData.awayTeamImg + ".png";

    const matchDateTime = matchData.startTime.split("T");
    document.querySelector("#starttime").innerHTML = matchDateTime[1];
    document.querySelector("#match-date").innerHTML = matchDateTime[0];
}

async function addSignUp() {
    const signUpObject = {};
    signUpObject.matchId = matchId;
    signUpObject.refereeUsername = "";
    if (user != undefined) {
        signUpObject.refereeUsername = user.username;
    }
    signUpObject.position = "ref";

    const options = {};
    options.method = "POST";
    options.headers = { "Content-type": "application/json" };
    options.body = JSON.stringify(signUpObject);

    await fetch(addSignUpUrl, options)
        .then(handleHttpErrors)
        .catch((err) => {
            displayError(err.message);
        });

    const newSignups = await fetch(signupsUrl + matchId).then(handleHttpErrors);
    displaySignups(newSignups);
}

async function addAccepted(refereeUsername, signupId) {
    if (!(await checkUserEligibility())) return;

    const acceptedObject = {};
    acceptedObject.matchId = matchId;
    acceptedObject.username = refereeUsername;
    acceptedObject.signupId = signupId;

    const options = {};
    options.method = "PATCH";
    options.headers = { "Content-type": "application/json" };
    options.body = JSON.stringify(acceptedObject);

    await fetch(matchesUrl, options)
        .then(handleHttpErrors)
        .catch((err) => {
            displayError(err.message);
        });

    const signups = await fetch(signupsUrl + matchId).then(handleHttpErrors);
    const accepted = await fetch(matchesUrl + matchId).then(handleHttpErrors);
    displaySignups(signups);
    displayAccepted(accepted);
}

async function getUser() {
    const token = "Bearer " + localStorage.getItem("token");
    const options = {};
    options.method = "GET";
    options.headers = { Authorization: token };
    return await fetch(refereeUrl, options).then(handleHttpErrors);
}

async function checkUserEligibility() {
    if (user == undefined) {
        displayError("Du er ikke logget ind.");
        return false;
    }
    if (!user.roles.includes("REFEREEMANAGER")) {
        displayError("Du er ikke dommeransvarlig");
        return false;
    }
    const refereeTeam = await fetch(teamsUrl + globalMatch.refereeTeamId).then(handleHttpErrors);
    if (user.clubName != refereeTeam.club) {
        displayError("Du er ikke medlem af denne klub");
        return;
    }
    return true;
}

function displayError(msg) {
    document.querySelector(".error").textContent = msg;
}
