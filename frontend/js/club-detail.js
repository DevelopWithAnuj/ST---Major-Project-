document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get('id');

    const clubNameElement = document.getElementById('club-name');
    const clubDescriptionElement = document.getElementById('club-description');
    const clubBannerElement = document.getElementById('club-banner');
    const joinLeaveClubBtn = document.getElementById('join-leave-club-btn');
    const clubMembersElement = document.getElementById('club-members');
    const clubActivityElement = document.getElementById('club-activity');
    const clubDiscussionsElement = document.getElementById('club-discussions');

    let currentClubData = null; // To store the fetched club data

    // Correctly retrieve userInfo and token from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? userInfo.token : null;

    if (!clubId) {
        // Handle case where no club ID is provided (e.g., redirect to clubs list)
        console.error('No club ID found in URL.');
        // window.location.href = 'club.html'; // Redirect to general clubs page
        return;
    }

    const fetchClubDetails = async () => {
        try {
            const response = await fetch(`/api/clubs/${clubId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch club details');
            }
            const club = await response.json();
            currentClubData = club; // Store fetched data

            clubNameElement.textContent = club.name;
            clubDescriptionElement.textContent = club.description;
            clubBannerElement.src = club.bannerImage || 'assets/logo.png'; // Use a default banner if none

            // Update join/leave button state
            updateJoinLeaveButton(club.isMember);

            // Populate members (assuming club.members is an array of user objects)
            renderMembers(club.members);

            // Populate activity (assuming club.activity is an array of activity objects)
            renderActivity(club.activity);

            // Populate discussions (assuming club.discussions is an array of discussion objects)
            renderDiscussions(club.discussions);

        } catch (error) {
            console.error('Error fetching club details:', error);
            // Display an error message to the user
            clubNameElement.textContent = 'Error loading club';
            clubDescriptionElement.textContent = 'Could not load club details. Please try again.';
        }
    };

    const updateJoinLeaveButton = (isMember) => {
        if (isMember) {
            joinLeaveClubBtn.textContent = 'Leave Club';
            joinLeaveClubBtn.classList.remove('btn-primary');
            joinLeaveClubBtn.classList.add('btn-secondary');
        } else {
            joinLeaveClubBtn.textContent = 'Join Club';
            joinLeaveClubBtn.classList.remove('btn-secondary');
            joinLeaveClubBtn.classList.add('btn-primary');
        }
    };

    const handleJoinLeaveClub = async () => {
        if (!token) {
            alert('Please log in to join or leave clubs.');
            window.location.href = 'login.html';
            return;
        }

        const endpoint = currentClubData.isMember ? `/api/clubs/${clubId}/leave` : `/api/clubs/${clubId}/join`;
        const method = 'PUT';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to ${currentClubData.isMember ? 'leave' : 'join'} club`);
            }

            // Re-fetch club details to update the UI
            await fetchClubDetails();
            alert(`Successfully ${currentClubData.isMember ? 'left' : 'joined'} the club!`);

        } catch (error) {
            console.error('Error joining/leaving club:', error);
            alert(`Failed to ${currentClubData.isMember ? 'leave' : 'join'} club. Please try again.`);
        }
    };

    joinLeaveClubBtn.addEventListener('click', handleJoinLeaveClub);

    // Helper functions to render dynamic content (can be expanded later)
    const renderMembers = (members) => {
        if (!members || members.length === 0) {
            clubMembersElement.innerHTML = '<p>No members yet.</p>';
            return;
        }
        clubMembersElement.innerHTML = members.map(member => `
            <div class="member-card">
                <img src="${member.avatar || 'assets/logo.png'}" alt="${member.name}">
                <span>${member.name}</span>
            </div>
        `).join('');
    };

    const renderActivity = (activity) => {
        if (!activity || activity.length === 0) {
            clubActivityElement.innerHTML = '<p>No recent activity.</p>';
            return;
        }
        clubActivityElement.innerHTML = activity.map(item => `
            <li class="activity-item">
                <div class="activity-content">
                    <p>${item.description}</p>
                    <span class="timestamp">${new Date(item.timestamp).toLocaleString()}</span>
                </div>
            </li>
        `).join('');
    };

    const renderDiscussions = (discussions) => {
        if (!discussions || discussions.length === 0) {
            clubDiscussionsElement.innerHTML = '<p>No discussions yet.</p>';
            return;
        }
        clubDiscussionsElement.innerHTML = discussions.map(discussion => `
            <div class="discussion-item card">
                <h4>${discussion.title}</h4>
                <p>${discussion.description.substring(0, 100)}...</p>
                <a href="discussion-detail.html?id=${discussion._id}" class="btn-link">Read More</a>
            </div>
        `).join('');
    };


    // Initial fetch of club details
    fetchClubDetails();
});