import { refereeUrl, myMatchesAccepted } from "../../settings.js";
import { handleHttpErrors, capitalizeFirstLetter } from "../../utils.js";

export function initMySignups() {
    setup();
}

let matches;

async function setup() {
    matches = await getAllMatches();
    displayMatches(matches);
}

async function getAllMatches() {
    const username = await getUserName();
    const matchesUrl = myMatchesAccepted + username;
    const matches = await fetch(matchesUrl).then(handleHttpErrors);
    return matches;
}

async function getUserName() {
    const token = "Bearer " + localStorage.getItem("token");
    const options = {};
    options.method = "GET";
    options.headers = { Authorization: token };
    const response = await fetch(refereeUrl, options).then(handleHttpErrors);
    return response.username;
}

function displayMatches(matchesData) {
    document.querySelector("#match-content").innerHTML = "";
    matchesData.forEach((m) => {
        displayMatch(m);
    });

    const nodes = document.querySelectorAll(".match");
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("mouseup", (e) => {
            const matchId = nodes[i].id;
            matchButtons(matchId);
        });
    }
}

function matchButtons(matchId) {
    const matchSplit = matchId.split("id");
    matchId = matchSplit[1];
    const link = "#/match?matchId=" + matchId;
    location.href = link;
}

function displayMatch(m) {
    const date = new Date(m.startTime);
    const dateOptions = {
        dateStyle: "long",
    };
    const dateFormatted = date.toLocaleDateString("da-DK", dateOptions);
    const matchTemplate = document.querySelector("template");
    const clone = matchTemplate.cloneNode(true).content;
    const matchContent = document.querySelector("#match-content");
    const match = document.createElement("div");
    match.classList.add("match");

    clone.querySelector(".match-time").textContent = dateFormatted;
    clone.querySelector(".hometeam-h2").textContent = capitalizeFirstLetter(m.homeTeamName) + " " + m.divisionName;
    clone.querySelector(".hometeam-img").src = "./images/logos/" + m.homeTeamImg + ".png";
    clone.querySelector(".awayteam-h2").textContent = capitalizeFirstLetter(m.awayTeamName) + " " + m.divisionName;
    clone.querySelector(".awayteam-img").src = "./images/logos/" + m.awayTeamImg + ".png";
    clone.querySelector(".refereeteam-img").src = "./images/logos/" + m.refereeTeamImg + ".png";
    clone.querySelector(".referee-team").textContent = capitalizeFirstLetter(m.refereeTeamName);

    match.id = "match-id" + m.id;

    const amountOfAcceptedReferees = m.acceptedReferees;
    const refereeNodes = clone.querySelectorAll(".referees");
    if (amountOfAcceptedReferees != 0) {
        for (let i = 0; i < amountOfAcceptedReferees.length; i++) {
            refereeNodes[0].children[i].style.color = "Green";
        }
    }

    match.appendChild(clone);
    matchContent.append(match);
}
