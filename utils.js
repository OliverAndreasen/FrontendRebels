export const token = "Bearer " + localStorage.getItem("token")

export function renderTemplate(template, contentId) {
  const content = document.getElementById(contentId);
  if (!content) {
    throw Error("No Element found for provided content id");
  }
  content.innerHTML = "";
  content.append(template);
}

export async function loadHtml(page) {
  const resHtml = await fetch(page).then((r) => {
    if (!r.ok) {
      throw new Error(`Failed to load the page: '${page}' `);
    }
    return r.text();
  });
  const parser = new DOMParser();
  const content = parser.parseFromString(resHtml, "text/html");
  const div = content.querySelector(".template");
  if (!div) {
    throw new Error(
      `No outer div with class 'template' found in file '${page}'`
    );
  }
  return div;
}

/**
 * Only meant for when Navigo is set to use Hash based routing (Always this semester)
 * If users try to enter your site with only "/", it will change this to "/#/" as required
 * for Hash based routing
 * Call it before you start using the router (add the specific routes)
 */
export function adjustForMissingHash() {
  let path = window.location.hash;
  if (path == "") {
    //Do this only for hash
    path = "#/";
    window.history.pushState({}, path, window.location.href + path);
  }
}

/**
 * Sets active element on a div (or similar) containing a-tags (with data-navigo attributes ) used as a "menu"
 * Meant to be called in a before-hook with Navigo
 * @param topnav - Id for the element that contains the "navigation structure"
 * @param activeUrl - The URL which are the "active" one
 */
export function setActiveLink(topnav, activeUrl) {
  const topNav = document.getElementById(topnav);
  if (!topNav) {
    console.error(
      `No element with id "${topnav}" found - can not set active element`
    );
    return;
  }
  const links = topNav.querySelectorAll("a");
  links.forEach((child) => {
    // child.parentElement.classList.remove("active")
    child.classList.remove("active");
    //remove leading '/' if any
    if (child?.getAttribute("href").replace(/\//, "") === activeUrl) {
      child.classList.add("active");
    }
  });
}

export async function handleHttpErrors(res) {
  if (!res.ok) {
    const errorResponse = await res.json();
    const error = new Error(errorResponse.message);
    error.apiError = errorResponse;
    throw error;
  }
  return res.json();
}

/**
 * Tablerows are required to be inside a table tag, so use this small utility function to santitize a string with TableRows only
 * (made from data with map)
 */
export function sanitizeStringWithTableRows(tableRows) {
  let secureRows = DOMPurify.sanitize("<table>" + tableRows + "</table>");
  secureRows = secureRows.replace("<table>", "").replace("</table>", "");
  return secureRows;
}

/**
 * HINT --> USE DOMPurify.santitize(..) instead, to sanitize a full string of tags to be inserted via innerHTLM
 * The encoder method we have used when inserting untrusted data via the innerHTML property
 * Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
 * @param str --> the string to encode
 * @returns the encoded string
 */
export function encode(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}


export async function checkAccess(role){
  const loginUrl = "https://eksamenoliver.azurewebsites.net/api/login/" + role;
  const token = "Bearer " + localStorage.getItem("token")

  const options = {}
  options.method = "GET"
  options.headers = {"Content-type": "application/json"}
  options.headers = {"Authorization": token}
  
  try{
  const response = await fetch(loginUrl, options).then(handleHttpErrors)
  return true;
  }
  catch(e){
     return false;
  }

}

export function hasWhiteSpace(s) {
  return s.includes(" ")
}

export function validateAllObjectWhiteSpaces(object){
  for (const field in object){
    var input = object[field]
    if(hasWhiteSpace(input)) {
      return true
    }
  }
  return false
}

export function checkIfEmptyObject(object) {
  for (const field in object) {
    if (object[field] === "") {
      return true
    }
  }
  return false;
}


export function createErrorMessage(message){

  const errorDiv = document.querySelector("#error")
  errorDiv.innerHTML = message
  errorDiv.removeAttribute("hidden")
}

export function capitalizeFirstLetter(string){
  const firstLetter = string.charAt(0)
  const firstLetterCap = firstLetter.toUpperCase()
  const remainingLetters = string.slice(1)

  return  firstLetterCap + remainingLetters  
}

