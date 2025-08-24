document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();
    let currentUserId; // Declare currentUserId here

    if (!token || !userId) {
        
        window.location.href = 'login.html';
        return;
    }

    const dummyClubs = [
        {
            _id: '1',
            name: 'One Piece Theorists',
            description: 'Discuss theories, plot twists, and manga predictions every week',
            coverImage: 'assets/One Piece.png',
            members: ['user1', 'user2', 'user3']
        },
        {
            _id: '2',
            name: 'Romance & Slice of Life Fans',
            description: 'Chill vibes only. Let\'s talk about wholesome anime',
            coverImage: 'assets/frieren.png',
            members: ['user1', 'user4']
        },
        {
            _id: '3',
            name: 'Jujutsu Kaisen Fan Club',
            description: 'Join us to discuss all things Jujutsu Kaisen!',
            coverImage: 'assets/JujutsuKaisen.png',
            members: ['user5']
        },
        {
            _id: '4',
            name: 'Attack on Titan Fans',
            description: 'For fans of Attack on Titan. Spoilers ahead!',
            coverImage: 'assets/attack_on_titan.png',
            members: []
        },
        {
            _id: '5',
            name: 'Demon Slayer Corps',
            description: 'Protect humanity from demons!',
            coverImage: 'assets/demon_slayer.png',
            members: []
        },
        {
            _id: '6',
            name: 'My Hero Academia Guild',
            description: 'Go beyond, Plus Ultra!',
            coverImage: 'assets/my_hero_academia.png',
            members: []
        },
        {
            _id: '7',
            name: 'Spy x Family Agency',
            description: 'Forger family adventures and discussions.',
            coverImage: 'assets/spyxfamily.png',
            members: []
        },
        {
            _id: '8',
            name: 'Chainsaw Man Fanatics',
            description: 'Chainsaw Man manga and anime discussions.',
            coverImage: 'assets/chainsaw_man.png',
            members: []
        },
        {
            _id: '9',
            name: 'Solo Leveling Guild',
            description: 'Level up with us!',
            coverImage: 'assets/solo_leveling.png',
            members: []
        },
        {
            _id: '10',
            name: 'Blue Lock Strikers',
            description: 'The ultimate egoist club.',
            coverImage: 'assets/blue-lock.png',
            members: []
        },
        {
            _id: '11',
            name: 'Dr. Stone\'s Science Kingdom',
            description: 'Science is power!',
            coverImage: 'assets/dr-stone.png',
            members: []
        },
        {
            _id: '12',
            name: 'Fire Force Company 8',
            description: 'Protecting the world from Infernals.',
            coverImage: 'assets/fire-force.png',
            members: []
        },
        {
            _id: '13',
            name: 'Mashle: Magic and Muscles',
            description: 'A club for the strongest!',
            coverImage: 'assets/mashle.png',
            members: []
        },
        {
            _id: '14',
            name: 'Kaiju No. 8 Defense Force',
            description: 'Defending against Kaiju threats.',
            coverImage: 'assets/kaiju-no-8.png',
            members: []
        },
        {
            _id: '15',
            name: 'Dandadan Occult Club',
            description: 'Exploring the supernatural.',
            coverImage: 'assets/dandadan.png',
            members: []
        },
        {
            _id: '16',
            name: 'Bleach: Thousand-Year Blood War',
            description: 'The final arc discussions.',
            coverImage: 'assets/BleachTYBW.png',
            members: []
        }
    ];

    const clubSearchInput = document.getElementById('club-search');
    const myClubsList = document.getElementById('my-clubs-list');
    const noMyClubsMessage = document.querySelector('.no-clubs-message');
    const recentlyActiveClubsList = document.getElementById('recently-active-clubs-list');

    const createClubIcon = document.getElementById('create-club-icon');
    const toggleMyClubsIcon = document.getElementById('toggle-my-clubs-icon');
    const myClubsListDiv = document.getElementById('my-clubs-list');

    // --- API CALLS --- //
    const fetchClubs = async () => {
        // Return dummy data instead of fetching from API
        return dummyClubs;
    };

    const joinClub = async (clubId) => {
        // For dummy data, simulate join by adding current user to members array
        const clubToJoin = dummyClubs.find(club => club._id === clubId);
        if (clubToJoin && !clubToJoin.members.includes(currentUserId)) {
            clubToJoin.members.push(currentUserId);
            alert('Successfully joined the club!');
            init(); // Re-initialize the page to update the lists
        } else if (clubToJoin.members.includes(currentUserId)) {
            alert('You are already a member of this club!');
        } else {
            alert('Club not found.');
        }
    };

    // --- RENDER FUNCTIONS --- //
    const renderCard = (club) => {
        const isMember = club.members.includes(currentUserId); // currentUserId will be available in init scope

        return `<div class=\"club-card\" data-club-id=\"${club._id}\">
                <img src=\"${club.coverImage}\" alt=\"${club.name}\" class=\"club-image\">
                <div class=\"club-info-content\">
                    <h3>${club.name}</h3>
                    <p>${club.description}</p>
                    <div class=\"club-actions\">
                        <button class=\"btn join-club-btn\" ${isMember ? 'disabled' : ''}>${isMember ? 'Joined' : 'Join'}</button>
                        <button class=\"btn view-club-btn\">View</button>
                    </div>
                </div>
            </div>`
    };

    const renderClubs = (clubListElement, clubs, noClubsMessageElement) => {
        
        if (clubs.length === 0) {
            if (noClubsMessageElement) noClubsMessageElement.classList.remove('hidden');
            clubListElement.innerHTML = '';
        } else {
            if (noClubsMessageElement) noClubsMessageElement.classList.add('hidden'); // Corrected
            clubListElement.innerHTML = clubs.map(renderCard).join('');
        }
    };

    // --- EVENT LISTENERS --- //
    clubSearchInput.addEventListener('keyup', async (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const allClubs = await fetchClubs(); // Fetch all clubs once

        // Filter My Clubs
        const myClubs = allClubs.filter(club => club.members.includes(currentUserId)); // currentUserId is from init scope
        const filteredMyClubs = myClubs.filter(club =>
            club.name.toLowerCase().includes(searchTerm) ||
            club.description.toLowerCase().includes(searchTerm)
        );
        renderClubs(myClubsList, filteredMyClubs, noMyClubsMessage);

        // Filter Recently Active Clubs
        const filteredRecentlyActiveClubs = allClubs.filter(club =>
            club.name.toLowerCase().includes(searchTerm) ||
            club.description.toLowerCase().includes(searchTerm)
        );
        renderClubs(recentlyActiveClubsList, filteredRecentlyActiveClubs);
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('join-club-btn')) {
            const clubId = event.target.closest('.club-card').dataset.clubId;
            joinClub(clubId);
        } else if (event.target.classList.contains('view-club-btn')) {
            const clubId = event.target.closest('.club-card').dataset.clubId;
            window.location.href = `club.html?id=${clubId}`;
        }
    });

    // --- INITIALIZATION --- //
    const init = async () => {
        const clubs = await fetchClubs(); // This now returns dummyClubs
        
        currentUserId = 'user1'; // Hardcode for dummy data

        // const token = localStorage.getItem('token'); // No longer needed for dummy data

        // if (token) {
        //     try {
        //         const response = await fetch('/api/users/profile', {
        //             headers: {
        //                 'x-auth-token': token,
        //             },
        //         });
        //         if (response.ok) {
        //             const userData = await response.json();
        //             currentUserId = userData._id;
        //         } else {
        //             console.error('Failed to fetch user profile:', response.statusText);
        //             // Optionally, handle token expiration or invalid token here (e.g., redirect to login)
        //         }
        //     } catch (error) {
        //         console.error('Error fetching user profile:', error);
        //     }
        // }

        const myClubs = clubs.filter(club => club.members.includes(currentUserId));
        

        renderClubs(myClubsList, myClubs, noMyClubsMessage);
        renderClubs(recentlyActiveClubsList, clubs);
    };

    init();

    if (createClubIcon) {
        createClubIcon.addEventListener('click', () => {
            alert('Create New Club functionality will be implemented here!');
            // Or: window.location.href = 'createClub.html';
        });
    }

    if (toggleMyClubsIcon && myClubsListDiv) {
        toggleMyClubsIcon.addEventListener('click', () => {
            if (myClubsListDiv.style.display === 'none') {
                myClubsListDiv.style.display = 'grid'; // Assuming it's a grid layout
                toggleMyClubsIcon.classList.remove('fa-chevron-down');
                toggleMyClubsIcon.classList.add('fa-chevron-up');
            } else {
                myClubsListDiv.style.display = 'none';
                toggleMyClubsIcon.classList.remove('fa-chevron-up');
                toggleMyClubsIcon.classList.add('fa-chevron-down');
            }
        });
    }
});
