function sendData() {

    console.log("clcl");

    const username = document.getElementById("username").value;

    localStorage.setItem("username", username);
    localStorage.setItem("repoCount", "10");
    window.location.href = "/details/details.html";
}