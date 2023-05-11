function goback() {
    location.href = "/";
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const value = urlParams.get('error')

document.getElementById("errdescr").innerHTML = value;