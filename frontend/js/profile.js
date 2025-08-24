document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo || !userInfo.token) {
    window.location.href = "login.html"; // Redirect to login if not logged in
    return;
  }

  const token = userInfo.token;
  const userId = userInfo._id; // Assuming _id is available in userInfo

  // Views
  const displayView = document.getElementById("profile-display-view");
  const editView = document.getElementById("profile-edit-view");

  // Buttons
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  // Form
  const editProfileForm = document.getElementById("edit-profile-form");

  // Display Elements
  const profileAvatar = document.querySelector(".profile-avatar");
  const profileUsername = document.querySelector(".profile-username");
  const profileEmail = document.querySelector(".profile-email");

  // Populate display with userInfo from localStorage immediately
  if (userInfo) {
    profileUsername.textContent = userInfo.name;
    profileEmail.textContent = userInfo.email;
    // Only set avatar if it exists in userInfo, otherwise keep default from HTML or CSS
    if (userInfo.avatar) {
      profileAvatar.src = userInfo.avatar;
    }
  }

  // Form Input Elements
  const editAvatarInput = document.getElementById("edit-avatar");
  const editUsernameInput = document.getElementById("edit-username");
  const editEmailInput = document.getElementById("edit-email");

  // --- Joined Clubs Functions --- //
  const fetchJoinedClubs = async () => {
    try {
      console.log("Fetching joined clubs...");
      const res = await fetch("/api/clubs/myclubs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response from /api/clubs/myclubs:", res);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          "Failed to fetch joined clubs. Response text:",
          errorText
        );
        throw new Error(
          `Failed to fetch joined clubs: ${res.status} ${res.statusText}`
        );
      }

      const clubs = await res.json();
      console.log("Joined clubs data received:", clubs);
      renderJoinedClubs(clubs);
    } catch (error) {
      console.error("Error fetching joined clubs in fetchJoinedClubs:", error);
      document.getElementById(
        "joined-clubs-grid"
      ).innerHTML = `<p>Failed to load joined clubs.</p>`;
    }
  };

  const renderJoinedClubs = (clubs) => {
    const joinedClubsGrid = document.getElementById("joined-clubs-grid");
    joinedClubsGrid.innerHTML = ""; // Clear existing content

    if (clubs.length === 0) {
      joinedClubsGrid.innerHTML = `<p>You haven't joined any clubs yet.</p>`;
      return;
    }

    clubs.forEach((club) => {
      const clubCard = document.createElement("div");
      clubCard.classList.add("club-card");
      clubCard.innerHTML = `
                <img src="${club.bannerImage || "assets/logo.png"}" alt="${
        club.name
      }">
                <div class="club-card-info">
                    <h3>${club.name}</h3>
                    <p>${club.description.substring(0, 70)}...</p>
                    <div class="club-actions">
                        <button class="btn-primary view-club-btn" data-id="${
                          club._id
                        }">View Club</button>
                        <button class="btn-secondary leave-club-btn" data-id="${
                          club._id
                        }">Leave Club</button>
                    </div>
                </div>
            `;
      joinedClubsGrid.appendChild(clubCard);

      clubCard.querySelector(".view-club-btn").addEventListener("click", () => {
        window.location.href = `club-detail.html?id=${club._id}`;
      });

      clubCard
        .querySelector(".leave-club-btn")
        .addEventListener("click", async (e) => {
          const clubId = e.target.dataset.id;
          if (confirm("Are you sure you want to leave this club?")) {
            try {
              const res = await fetch(`/api/clubs/${clubId}/leave`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!res.ok) {
                throw new Error("Failed to leave club");
              }
              alert("Successfully left the club!");
              fetchJoinedClubs(); // Re-fetch clubs to update the list
            } catch (error) {
              console.error("Error leaving club:", error);
              alert("Failed to leave club. Please try again.");
            }
          }
        });
    });
  };

  // --- Bookmarked Anime Functions --- //
  const fetchBookmarkedAnime = () => {
    const bookmarkedAnimeGrid = document.getElementById(
      "bookmarked-anime-grid"
    );
    bookmarkedAnimeGrid.innerHTML = ""; // Clear existing content

    const myList = JSON.parse(localStorage.getItem("myAnimeList")) || {};
    const planToWatch = myList["plan-to-watch"] || [];

    if (planToWatch.length === 0) {
      bookmarkedAnimeGrid.innerHTML = `<p>You haven't bookmarked any anime yet.</p>`;
      return;
    }

    planToWatch.forEach((anime) => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("bookmarked-anime-card"); // Changed class
      animeCard.innerHTML = `
                <img src="${anime.imageUrl}" alt="${anime.title}">
                <div class="bookmarked-anime-card-info">
                    <h4>${anime.title}</h4> <!-- Changed h3 to h4 -->
                    <button class="btn-secondary remove-bookmark-btn" data-id="${anime.id}">Remove</button>
                </div>
            `;
      bookmarkedAnimeGrid.appendChild(animeCard);

      animeCard
        .querySelector(".remove-bookmark-btn")
        .addEventListener("click", (e) => {
          const animeId = e.target.dataset.id;
          removeBookmark(animeId);
          fetchBookmarkedAnime(); // Re-render bookmarked anime
        });
    });
  };

  const removeBookmark = (animeId) => {
    let myList = JSON.parse(localStorage.getItem("myAnimeList")) || {};
    let planToWatch = myList["plan-to-watch"] || [];

    myList["plan-to-watch"] = planToWatch.filter(
      (anime) => anime.id !== animeId
    );
    localStorage.setItem("myAnimeList", JSON.stringify(myList));
  };

  let userData = {};

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile...");
      const res = await fetch("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response from /api/users/profile:", res);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          "Failed to fetch profile data. Response text:",
          errorText
        );
        throw new Error(
          `Failed to fetch profile data: ${res.status} ${res.statusText}`
        );
      }

      userData = await res.json();
      console.log("User data received:", userData);
      updateProfileDisplay(userData);
    } catch (error) {
      console.error("Error fetching profile data in fetchUserProfile:", error);
    }
  };

  const updateProfileDisplay = (user) => {
    profileAvatar.src = user.avatar || "assets/logo.png";
    profileUsername.textContent = user.name;
    profileEmail.textContent = user.email;
  };

  const showEditView = () => {
    editAvatarInput.value = userData.avatar || "";
    editUsernameInput.value = userData.name;
    editEmailInput.value = userData.email;

    displayView.style.display = "none";
    editView.style.display = "block";
  };

  const showDisplayView = () => {
    displayView.style.display = "block";
    editView.style.display = "none";
  };

  editProfileBtn.addEventListener("click", showEditView);
  cancelEditBtn.addEventListener("click", showDisplayView);

  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: editUsernameInput.value,
      email: editEmailInput.value,
      avatar: editAvatarInput.value,
    };

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      userData = await res.json();
      updateProfileDisplay(userData);
      showDisplayView();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  });

  // Initial fetch
  fetchUserProfile();
  fetchJoinedClubs();
  fetchBookmarkedAnime();

  // --- Tabs --- //
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;

      tabLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");

      tabContents.forEach((content) => content.classList.remove("active"));
      document.getElementById(tab).classList.add("active");
    });
  });
});
