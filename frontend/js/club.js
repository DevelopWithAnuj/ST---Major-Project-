document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    const clubList = document.getElementById('clubList');
    const createClubBtn = document.getElementById('createClubBtn');
    const createClubModal = document.getElementById('createClubModal');
    let closeButton = null;
    if (createClubModal) {
        closeButton = createClubModal.querySelector('.close-button');
    }
    const createClubForm = document.getElementById('createClubForm');
    const clubNameInput = document.getElementById('clubName');
    const clubDescriptionInput = document.getElementById('clubDescription');
    const clubDetailView = document.getElementById('clubDetailView');

    // Function to fetch and display clubs
    const fetchClubs = async () => {
        try {
            const response = await fetch('/api/clubs');
            const clubs = await response.json();
            clubList.innerHTML = ''; // Clear existing clubs
            clubs.forEach(club => {
                const clubCard = `
                    <div class="club-card" data-club-id="${club._id}">
                        <div class="club-card-header">
                            <img src="${club.coverImage}" alt="${club.name}">
                            <div class="club-name-overlay">${club.name}</div>
                        </div>
                        <div class="club-card-body">
                            <p>${club.description}</p>
                        </div>
                        <div class="club-card-footer">
                            <span class="member-count"><i class="fas fa-users"></i> ${club.members.length} Members</span>
                            <div class="club-card-actions">
                                <button class="btn btn-join">Join</button>
                                <button class="btn btn-view">View</button>
                            </div>
                        </div>
                    </div>
                `;
                clubList.innerHTML += clubCard;
            });
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    // Function to fetch and display club details
    const fetchClubDetails = async (clubId) => {
        try {
            const response = await fetch(`/api/clubs/${clubId}`);
            const club = await response.json();
            renderClubDetails(club);
            clubList.style.display = 'none';
            clubDetailView.style.display = 'block';
        } catch (error) {
            console.error('Error fetching club details:', error);
        }
    };

    // Function to render club details
    const renderClubDetails = (club) => {
        const clubDetailContent = `
            <div class="club-detail-header">
                <button class="header-icon" id="backToClubList"><i class="fas fa-arrow-left"></i></button>
                <h2>${club.name}</h2>
                <div class="header-icons">
                    <button class="header-icon"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            </div>
            <div class="club-banner-container">
                <img src="${club.coverImage}" alt="${club.name}" class="club-banner-image">
                <button class="join-club-button" data-club-id="${club._id}">Join Club</button>
            </div>
            <div class="club-info-section">
                <h3>${club.name}</h3>
                <p>${club.description}</p>
                <p class="member-count">${club.members.length} Members</p>
            </div>
            <div class="club-nav">
                <a href="#" class="club-nav-item active">Posts</a>
                <a href="#" class="club-nav-item">Members</a>
                <a href="#" class="club-nav-item">About</a>
            </div>
            <div class="club-content-sections">
                <div class="club-content-section active">
                    <!-- Posts will be loaded here -->
                </div>
            </div>
        `;
        clubDetailView.innerHTML = clubDetailContent;

        document.getElementById('backToClubList').addEventListener('click', () => {
            clubDetailView.style.display = 'none';
            clubList.style.display = 'grid';
        });
    };

    // Event listener for club clicks
    if (clubList) {
        clubList.addEventListener('click', (event) => {
            const clubCard = event.target.closest('.club-card');
            if (clubCard) {
                const clubId = clubCard.dataset.clubId;
                fetchClubDetails(clubId);
            }
        });
    }
    

    // Show create club modal
    createClubBtn.addEventListener('click', () => {
        createClubModal.style.display = 'block';
    });

    // Hide create club modal
    closeButton.addEventListener('click', () => {
        createClubModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == createClubModal) {
            createClubModal.style.display = 'none';
        }
    });

    // Handle create club form submission
    createClubForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = clubNameInput.value;
        const description = clubDescriptionInput.value;
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please log in to create a club.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('/api/clubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                alert('Club created successfully!');
                createClubModal.style.display = 'none';
                createClubForm.reset();
                fetchClubs(); // Refresh the list
            } else {
                const errorData = await response.json();
                alert(errorData.msg || 'Failed to create club.');
            }
        } catch (error) {
            console.error('Error creating club:', error);
            alert('An error occurred while trying to create the club.');
        }
    });

    // Initial fetch of clubs
    fetchClubs();
    
    });
