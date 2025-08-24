document.addEventListener("DOMContentLoaded", () => {
  const newsFeed = document.querySelector(".news-feed");
  const currentlyWatchingSection = document.querySelector(
    ".currently-watching .anime-list"
  );
  const recommendationsSection = document.querySelector(
    ".recommendations .anime-list"
  );
  const recentActivitySection = document.querySelector(
    ".recent-activity .activity-feed"
  );
  const themeToggle = document.getElementById("theme-toggle");
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const closeSidebar = document.getElementById("close-sidebar");
  const overlay = document.getElementById("overlay");
  const logoutButton = document.getElementById("logout-button");

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Redirect to login if not authenticated
  if (!userInfo || !userInfo.token) {
    
    window.location.href = "login.html";
    return;
  }

  const authToken = `Bearer ${userInfo.token}`;

  // Function to fetch and display currently watching anime
  const fetchCurrentlyWatching = async () => {
    try {
      const response = await fetch("/api/watchprogress", {
        headers: {
          Authorization: authToken,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const animeList = await response.json();

      if (currentlyWatchingSection) {
        currentlyWatchingSection.innerHTML = ""; // Clear existing content

        if (animeList.length === 0) {
          currentlyWatchingSection.innerHTML =
            "<p>No anime in your currently watching list.</p>";
          return;
        }

        animeList.forEach((anime) => {
          const animeItem = document.createElement("div");
          animeItem.classList.add("anime-item", "card");
          // For now, let's assume vertical cards for currently watching

          animeItem.innerHTML = `
                        <img src="${
                          anime.imageUrl || "assets/placeholder.png"
                        }" alt="${anime.title}">
                        <div class="content">
                            <h3>${anime.title}</h3>
                            <p>Episode: ${anime.currentEpisode || "N/A"} / ${
            anime.totalEpisodes || "N/A"
          }</p>
                            <p>Status: ${anime.status || "Watching"}</p>
                        </div>
                    `;
          currentlyWatchingSection.appendChild(animeItem);
        });
      }
    } catch (error) {
      console.error("Error fetching currently watching anime:", error);
      if (currentlyWatchingSection) {
        currentlyWatchingSection.innerHTML =
          "<p>Failed to load currently watching list. Please try again later.</p>";
      }
    }
  };

  // Function to fetch and display recommendations
  
  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/shows/recommendations", {
        headers: {
          Authorization: authToken,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const recommendedList = await response.json();

      if (recommendationsSection) {
        recommendationsSection.innerHTML = ""; // Clear existing content

        if (recommendedList.length === 0) {
          recommendationsSection.innerHTML =
            "<p>No recommendations available at the moment.</p>";
          return;
        }

        recommendedList.forEach((anime) => {
          const animeItem = document.createElement("div");
          animeItem.classList.add("anime-item", "card");
          // For recommendations, let's make them horizontal by default for variety
          animeItem.classList.add("horizontal");

          animeItem.innerHTML = `
                        <img src="${
                          anime.imageUrl || "assets/placeholder.png"
                        }" alt="${anime.title}">
                        <div class="content">
                            <h3>${anime.title}</h3>
                            <p>${anime.genre || "N/A"}</p>
                            <p>Score: ${anime.score || "N/A"}</p>
                        </div>
                    `;
          recommendationsSection.appendChild(animeItem);
        });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      if (recommendationsSection) {
        recommendationsSection.innerHTML =
          "<p>Failed to load recommendations. Please try again later.</p>";
      }
    }
  };

  // Function to fetch and display recent activity
  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/activity", {
        headers: {
          Authorization: authToken,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const activityList = await response.json();

      if (recentActivitySection) {
        recentActivitySection.innerHTML = ""; // Clear existing content

        if (activityList.length === 0) {
          recentActivitySection.innerHTML = "<p>No recent activity.</p>";
          return;
        }

        activityList.forEach((activity) => {
          const activityItem = document.createElement("li");
          activityItem.classList.add("activity-item", "card");
          activityItem.innerHTML = `
                        <img src="${
                          activity.userAvatar || "assets/logo.png"
                        }" alt="User Avatar" class="avatar">
                        <div class="activity-content">
                            <p>${activity.message}</p>
                            <span class="timestamp">${new Date(
                              activity.timestamp
                            ).toLocaleString()}</span>
                        </div>
                    `;
          recentActivitySection.appendChild(activityItem);
        });
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      if (recentActivitySection) {
        recentActivitySection.innerHTML =
          "<p>Failed to load recent activity. Please try again later.</p>";
      }
    }
  };

  // Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      // You might want to save this preference in localStorage
    });
  }

  // Sidebar Toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active");
      overlay.classList.add("active");
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userInfo"); // Clear user info
      window.location.href = "login.html"; // Redirect to login page
    });
  }

  // Initial fetches when the page loads
  fetchCurrentlyWatching();
  fetchRecommendations();
  fetchRecentActivity();
});
