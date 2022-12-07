import {teamsUrl} from "../../settings.js";
import {handleHttpErrors, capitalizeFirstLetter} from "../../utils.js";

export function initTeam() {
  window.addEventListener("load", getTeam());
}

async function getTeam() {
    const teamName = teamsUrl + getTeamFromUrl();
    await fetch(teamName)
        .then(handleHttpErrors)
        .then(data => {
        document.querySelector("#input-team-name").innerHTML = DOMPurify.sanitize(data.name);
        document.querySelector("#input-team-club").innerHTML = DOMPurify.sanitize(capitalizeFirstLetter(data.club));
        document.querySelector("#team-name-header").innerHTML = DOMPurify.sanitize(data.name)
        });
}

function getTeamFromUrl() {
    const splitUrl = window.location.href.split("=");
    const teamName = splitUrl[1];
    return teamName;
}