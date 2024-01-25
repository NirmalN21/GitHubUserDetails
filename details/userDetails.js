document.addEventListener("DOMContentLoaded", function () {

    var repoCountInput = document.getElementById("repoCount");

    repoCountInput.addEventListener("input", function (event) {

        localStorage.setItem("repoCount", event.target.value);

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");

    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(userData => {

            document.getElementById("userAvatar").src = userData.avatar_url || "../assets/git.png";

            document.querySelector(".user-details h1").textContent = userData.name || "Username";

            document.querySelector(".user-details h5").textContent = userData.bio || "Bio goes here";

            document.querySelector(".user-details h5:nth-child(3)").innerHTML = `<img src="../assets/location.svg" alt=""> ${userData.location || "N/A"}`;

            document.querySelector(".user-details h5:last-child").innerHTML = `Twitter username: ${userData.twitter_username || "N/A"}`;

            document.querySelector(".profile-link").innerHTML = `<a href="${userData.html_url}" class="profile-link" target="_blank">${userData.html_url || "Loading..."}</a>`;
        })
        .catch(error => console.error("Error fetching user data:", error));
});

