const loader = document.querySelector('.loader');
const bio_and_location = document.querySelector(".bio_and_location");
const user_profile_image = document.querySelector(".user_profile_image");
const github_links = document.getElementById("github_links");
const repo_details = document.getElementById("repo_details");
const page_navigation = document.getElementById("page_navigation");
const user_repo_details = document.querySelector(".user_repo_details");
let currentPage = 1;
let totalPages = 1;
const no_user = document.getElementById("no_user");



const searchUser = async () => {
    try {
        const user_input = document.querySelector('#user_input').value;
        loader.style.display = "block";

        let userData = await fetch(`https://api.github.com/users/${user_input}`);
        if(!userData){
            throw error;
        }
        userData = await userData.json();
        

        bio_and_location.childNodes[1].innerHTML = userData.name;
        bio_and_location.childNodes[3].innerHTML = userData.bio;
        bio_and_location.childNodes[5].innerHTML = userData.location;
        user_profile_image.src = userData.avatar_url;
        no_user.innerText="";
        loader.style.display = "none";
        github_links.href = `https://github.com/${user_input}`;
        github_links.innerText = `https://github.com/${user_input}`;

        // Repo fetching with pagination
        const repoUrl = `${userData.repos_url}?per_page=10&page=${currentPage}`;
        let repodata = await fetch(repoUrl);
        repodata = await repodata.json();

        // Calculate total pages based on the number of repositories
        totalPages = Math.ceil(userData.public_repos / 10); // Assuming 10 items per page, adjust as needed

        // Display repo details
        repo_details.innerHTML = ""; // Clear previous content
        for (const repo of repodata) {
            const repoContainer = document.createElement("div");
            repoContainer.className="repo_container"

            const repoName = document.createElement("div");
            repoName.innerHTML = ` ${repo.name}`;
            repoContainer.appendChild(repoName);

            const repoLanguages = await fetch(repo.languages_url);
            const languagesData = await repoLanguages.json();

           // console.log(languagesData);
           for (const [language, value] of Object.entries(languagesData)) {
            const repousedlanguage = document.createElement('button');
            repousedlanguage.className="repo_btn"
            repousedlanguage.innerText = language;
            repoContainer.appendChild(repousedlanguage)
            // console.log(language, value);
        }

           // const repoLanguage = document.createElement("div");
           // repoLanguage.className = "language_used"
           



            //repoLanguage.innerHTML = `${Object.keys(languagesData).join(', ') || "Not specified"}`;
            //repoContainer.appendChild(repoLanguage);

            repo_details.appendChild(repoContainer);
        }

        // Add page navigation buttons
        const paginationContainer = document.createElement("div");
        paginationContainer.classList.add("pagination");

        const prevButton = document.createElement("button");
        prevButton.innerText = "Prev";
        const nextButton = document.createElement("button");
        nextButton.innerText = "Next";
        nextButton.addEventListener("click", () => {
            currentPage++;
            searchUser();
        });

        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                searchUser();
            }
        });

        // Disable buttons based on currentPage
        if (currentPage === 1) {
            prevButton.disabled = true;
        }
        if (currentPage >= totalPages) {
            nextButton.disabled = true;
        }

        

        page_navigation.innerHTML = "";
        page_navigation.appendChild(prevButton);
        // Display page numbers
        const maxDisplayedPages = 6; // Adjust as needed
        const startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        const endPage = Math.min(startPage + maxDisplayedPages - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement("button");
            pageButton.className="page_btn"
            pageButton.innerText = i;
            pageButton.addEventListener("click", () => {
                currentPage = i;
                searchUser();
            });

            // Highlight the current page
            if (i === currentPage) {
                pageButton.classList.add("current-page");
                pageButton.style.background="green";
            }

            page_navigation.appendChild(pageButton);
        }

        page_navigation.appendChild(nextButton);
        page_navigation.appendChild(paginationContainer);

    } catch (error) {
        loader.style.display = "none";
        const user_input = document.querySelector('#user_input').value;
        user_repo_details.innerHTML="";
        user_repo_details.innerHTML=`No User Find with the username ${user_input} or TOKEN EXPIRE WAIT FOR SOME TIME`;
        console.log("error");
    }
};
