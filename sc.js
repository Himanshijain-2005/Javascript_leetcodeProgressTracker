document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  function validateUserName(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
      return false;
    }
    return true;
  }

  async function fetchuserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch data");
      }

      const data = await response.json();
      console.log("Logging data", data);

      updateProgress(easyProgressCircle, easyLabel, data.easySolved, data.totalEasy);
      updateProgress(mediumProgressCircle, mediumLabel, data.mediumSolved, data.totalMedium);
      updateProgress(hardProgressCircle, hardLabel, data.hardSolved, data.totalHard);

      cardStatsContainer.innerHTML = `
        <div class="card">Total Solved: ${data.totalSolved} / ${data.totalQuestions}</div>
        <div class="card">Acceptance Rate: ${data.acceptanceRate}%</div>
        <div class="card">Ranking: ${data.ranking}</div>
        <div class="card">Reputation: ${data.reputation}</div>
      `;
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to fetch data. Please check the username.");
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(circleEl, labelEl, solved, total) {
    const percent = Math.round((solved / total) * 100);
    labelEl.textContent = `${percent}%`;
    circleEl.style.setProperty('--progress-degree', `${percent}%`);
  }

  searchButton.addEventListener('click', function () {
    const username = usernameInput.value;
    if (validateUserName(username)) {
      fetchuserDetails(username);
    }
  });
});
