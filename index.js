import "https://unpkg.com/navigo";
import {
  adjustForMissingHash,
  loadHtml,
  renderTemplate,
  setActiveLink,
  checkAccess
} from "./utils.js";

import { initAllMatches } from "./pages/allMatches/allMatches.js";
import {initLogin} from "./pages/login/login.js";
import {initCreateReferee} from "./pages/createReferee/createReferee.js";
import {initEditReferee} from "./pages/editReferee/editReferee.js"
import {initEditRefereePassword} from "./pages/editRefereePassword/editRefereePassword.js"
import {initMatch} from "./pages/match/match.js"
import {initGetReferees} from "./pages/getReferees/getReferees.js"
import {initMakeAdmin} from "./pages/makeAdmin/makeAdmin.js"
import {initMyProfile} from "./pages/myProfile/myProfile.js"
import {initLogout} from "./pages/logout/logout.js"
import {initCreateClub} from "./pages/createClub/createClub.js"
import {initClub} from "./pages/club/club.js";
import {initTeam} from "./pages/team/team.js";
import {initMyMatches} from "./pages/myMatches/myMatches.js";
import {initMySignups} from "./pages/mySignups/mySignups.js";


window.addEventListener("load", async () => {
  const templateMatches = await loadHtml("./pages/allMatches/allMatches.html");
  const templateMatch = await loadHtml("./pages/match/match.html")
  const templateHome = await loadHtml("./pages/home/home.html");
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateCreateReferee = await loadHtml("./pages/createReferee/createReferee.html")
  const templateEditReferee = await loadHtml("./pages/editReferee/editReferee.html")
  const templateEditRefereePassword = await loadHtml("./pages/editRefereePassword/editRefereePassword.html")
  const templateGetReferees = await loadHtml("./pages/getReferees/getReferees.html")
  const templateMakeAdmin = await loadHtml("./pages/makeAdmin/makeAdmin.html")
  const templateMyProfile = await loadHtml("./pages/myProfile/myProfile.html")
  const templateLogout = await loadHtml("./pages/logout/logout.html")
  const templateCreateClub = await loadHtml("./pages/createClub/createClub.html")
  const templateClub = await loadHtml("./pages/club/club.html")
  const templateTeam = await loadHtml("./pages/team/team.html")
  const templateMyMatches = await loadHtml("./pages/myMatches/myMatches.html")
  const templateMySignups = await loadHtml("./pages/mySignups/mySignups.html")

  adjustForMissingHash();

  const router = new Navigo("/", { hash: true });
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      "/": () => {
        renderTemplate(templateHome, "content");
      },
      "/matches": () => {
        renderTemplate(templateMatches, "content");
        initAllMatches();
      },
      "/club": () => {
        renderTemplate(templateClub, "content");
        initClub();
      },
      "/match": () => {
        renderTemplate(templateMatch, "content")
        initMatch();
      },
      "/team": () => {
        renderTemplate(templateTeam, "content")
        initTeam();
      },
      "/myMatches": () => {
      renderTemplate(templateMyMatches, "content")
      initMyMatches();

      },
      "/login": () => {
        renderTemplate(templateLogin, "content");
        initLogin();
      },
      "/createReferee": () => {
        renderTemplate(templateCreateReferee, "content");
        initCreateReferee();
      },
      "editReferee": () => {
        renderTemplate(templateEditReferee, "content")
        initEditReferee();
      },
      "editRefereePassword" : () => {
        renderTemplate(templateEditRefereePassword, "content")
        initEditRefereePassword();
      },
      "/getReferees" : () =>{
        checkAccess("admin").then(result => {
            if(result){
                renderTemplate(templateGetReferees, "content")
                initGetReferees();
            }else {
                router.navigate("/#/")
            }
        })
      },
        "/makeAdmin" : () => {
        renderTemplate(templateMakeAdmin, "content")
        initMakeAdmin();
      },
      "/createClub" : () => {
        renderTemplate(templateCreateClub, "content")
        initCreateClub();
      },
      "/logout": () => {
        renderTemplate(templateLogout, "content");
        initLogout();
      },
      "/mySignups": () =>{
    renderTemplate(templateMySignups, "content");
    initMySignups()
      },
      "/myProfile": () => {
        renderTemplate(templateMyProfile, "content");
        initMyProfile();
      },
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content");
    })
    .resolve();
});
