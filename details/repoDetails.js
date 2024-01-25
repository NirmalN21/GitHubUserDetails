document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem("username");
    const perPage = localStorage.getItem("repoCount") || 10;

    fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=${perPage}`)
        .then(response => response.json())
        .then(data => {
            displayRepoDetails(data, 1);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function displayRepoDetails(repos, currentPage) {
    const repoDetailsContainer = document.getElementById('repoDetailsContainer');
    repoDetailsContainer.innerHTML = "";

    repos.forEach(repo => {

        const repoColumn = document.createElement('div');
        repoColumn.className = 'col-md-6 repository';

        const repoElement = document.createElement('div');
        repoElement.className = 'repo-details';

        const titleElement = document.createElement('h2');
        titleElement.textContent = repo.name;

        const descriptionElement = document.createElement('h5');
        descriptionElement.textContent = repo.description || 'No description available';

        const languageContainer = document.createElement('div');

        fetch(repo.languages_url)
            .then(response => response.json())
            .then(languages => {
                if (Object.keys(languages).length > 0) {
                    Object.keys(languages).forEach(language => {
                        const languageBadge = document.createElement('span');
                        languageBadge.className = 'language-badge';
                        languageBadge.textContent = `${language}`;
                        languageContainer.appendChild(languageBadge);
                    });
                } else {
                    const languageBadge = document.createElement('span');
                    languageBadge.className = 'language-badge';
                    languageBadge.textContent = `Language info N/A`;
                    languageContainer.appendChild(languageBadge);
                }

            })
            .catch(error => {
                console.error('Error fetching language information:', error);
                const errorBadge = document.createElement('span');
                errorBadge.className = 'language-badge';
                errorBadge.textContent = 'Error fetching language information';
                languageContainer.appendChild(errorBadge);
            });

        repoElement.appendChild(titleElement);
        repoElement.appendChild(descriptionElement);
        repoElement.appendChild(languageContainer);

        repoColumn.appendChild(repoElement);

        repoDetailsContainer.appendChild(repoColumn);
    });

    updatePagination(currentPage);
}

function updatePagination(currentPage) {
    const username = localStorage.getItem("username");

    fetch(`https://api.github.com/users/${username}`)
        .then(userDataResponse => userDataResponse.json())
        .then(userData => {
            const totalRepos = userData.public_repos;

            const perPage = localStorage.getItem("repoCount") || 10;
            const totalPages = Math.ceil(totalRepos / perPage);

            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = "";

            // Adding Previous Button
            const previousLi = document.createElement('li');
            previousLi.classList.add('page-item');

            const previousLink = document.createElement('a');
            previousLink.classList.add('page-link');
            previousLink.href = "#";
            previousLink.setAttribute('aria-label', 'Previous');

            const previousSpan = document.createElement('span');
            previousSpan.setAttribute('aria-hidden', 'true');
            previousSpan.textContent = '«';

            previousLink.appendChild(previousSpan);
            previousLi.appendChild(previousLink);
            paginationContainer.appendChild(previousLi);

            const numAdjacentPages = 2;
            const startPage = Math.max(1, currentPage - numAdjacentPages);
            const endPage = Math.min(totalPages, currentPage + numAdjacentPages);


            for (let page = startPage; page <= endPage; page++) {
                const li = document.createElement('li');
                li.classList.add('page-item');

                const a = document.createElement('a');
                a.classList.add('page-link');
                a.href = "#";
                a.textContent = page;
                a.onclick = function () {
                    pageClick(page);
                }

                li.appendChild(a);
                paginationContainer.appendChild(li);
            }

            // Adding Next Button
            const nextLi = document.createElement('li');
            nextLi.classList.add('page-item');

            const nextLink = document.createElement('a');
            nextLink.classList.add('page-link');
            nextLink.href = "#";
            nextLink.setAttribute('aria-label', 'Next');

            const nextSpan = document.createElement('span');
            nextSpan.setAttribute('aria-hidden', 'true');
            nextSpan.textContent = '»';

            nextLink.appendChild(nextSpan);
            nextLi.appendChild(nextLink);
            paginationContainer.appendChild(nextLi);

        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}


function pageClick(pageNo) {
    const username = localStorage.getItem("username");
    const perPage = localStorage.getItem("repoCount") || 10;

    fetch(`https://api.github.com/users/${username}/repos?page=${pageNo}&per_page=${perPage}`)
        .then(response => response.json())
        .then(data => {
            displayRepoDetails(data, pageNo);
        })
        .catch(error => console.error('Error fetching data:', error));

    updatePagination(pageNo);

}