import {clubUrl, refereeUrl, teamsUrl} from "../../settings.js";
import {handleHttpErrors,capitalizeFirstLetter } from "../../utils.js";

const teamLink = "/#/team?teamId=";

export function initClub() {
    window.addEventListener("load", getClub());
}

async function getClub() {
    const clubName = clubUrl + getClubFromUrl();
    await fetch(clubName)
        .then(handleHttpErrors)
        .then((club) => {
            createClubData(club);
            createTeams(club.teams);
            createReferees(club.referees);
        });
}

function createClubData(club){
    
    document.querySelector(".club-img").src = "./images/logos/" + club.imageString + ".png";
    document.querySelector("#input-club-name").innerHTML = DOMPurify.sanitize(capitalizeFirstLetter(club.name));
    document.querySelector("#input-club-address").innerHTML = DOMPurify.sanitize(club.address);
    document.querySelector("#input-club-email").innerHTML = DOMPurify.sanitize(club.email);
    document.querySelector("#club-name-header").innerHTML = DOMPurify.sanitize(capitalizeFirstLetter(club.name));
    document.querySelector("#team-name-header").innerHTML = DOMPurify.sanitize(capitalizeFirstLetter(club.name)) + " hold";
}

function getClubFromUrl() {
    const splitUrl = window.location.href.split("=");
    return splitUrl[1];
}

async function createTeams(teams) {
    if (document.querySelector(".teamsCreated") == null) {
        for (let count = 0; count < teams.length; count++) {
            await createTeam(teams[count], teams.length, count);
        }
    }
}

async function createTeam(team, size, count) {
    let constTeamURL = teamsUrl + team;
    const teamInfo = await fetch(constTeamURL).then(handleHttpErrors);
    let getTeamLink = teamLink + team;
    createTeamInfo(teamInfo, getTeamLink, size, count);
}

function createTeamInfo(teamInfo, teamLink, size, count) {
    const row = document.createElement("div");
    row.className = "row teamsCreated";
    row.style.cursor = "pointer";
    row.onclick = function () {
        location.replace(teamLink);
    };

    const nameDiv = document.createElement("div");
    nameDiv.className = "col-sm-3";

    const teamName = document.createElement("p");
    teamName.className = "mb-0";
    teamName.innerText = "Hold navn";

    const nameInputDiv = document.createElement("div");
    nameInputDiv.className = "col-sm-9";

    const nameInputP = document.createElement("p");
    nameInputDiv.className = "col-sm-9";
    nameInputDiv.id = "input-club-name";
    nameInputDiv.innerText = teamInfo.name;

    const hr = document.createElement("hr");

    nameDiv.appendChild(teamName);
    nameInputDiv.appendChild(nameInputP);

    row.appendChild(nameDiv);
    row.appendChild(nameInputDiv);

    if (count < size - 1) {
        row.appendChild(hr);
    }
    document.querySelector("#teams").appendChild(row);
}

async function createReferees(referees) {
    if (document.querySelector(".refereesCreated") == null) {
        for (let count = 0; count < referees.length; count++) {
            await createReferee(referees[count], referees.length, count);
        }
    }
}

async function createReferee(refereeName, size, count) {
    const refereeUrlGet = refereeUrl + refereeName;
    const referee = await fetch(refereeUrlGet).then(handleHttpErrors);
    createRefereeInfo(referee, size, count)
}

function createRefereeInfo(referee, size, count) {
    let refereeManager = false;
    for (let i = 0; i < referee.roles.length; i++) {
        if (referee.roles[i] === "REFEREEMANAGER") {
            refereeManager = true;
        }
    }
    const row = document.createElement("div");
    row.className = "row refereesCreated";

    const nameDiv = document.createElement("div");
    nameDiv.className = "col-sm-3";

    const refereeNameP = document.createElement("p");
    refereeNameP.className = "mb-0";
    if (refereeManager === true) {
        refereeNameP.innerText = "Dommer Ansvarlig";
    } else {
        refereeNameP.innerText = "Dommer";
    }

    const nameInputDiv = document.createElement("div");
    nameInputDiv.className = "col-sm-9";

    const nameInputP = document.createElement("p");
    nameInputDiv.className = "col-sm-9";
    nameInputDiv.id = "input-club-name";
    const name = referee.firstname + " " + referee.lastname;

    nameInputDiv.innerText = name;

    const hr = document.createElement("hr");

    nameDiv.appendChild(refereeNameP);
    nameInputDiv.appendChild(nameInputP);

    row.appendChild(nameDiv);
    row.appendChild(nameInputDiv);

    //only add hr if not last element in list of referees
    if (count < size - 1) {
        row.appendChild(hr);
    }
    document.querySelector("#referees").appendChild(row);
}
