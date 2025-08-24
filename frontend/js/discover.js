document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        
        window.location.href = 'login.html';
        return;
    }

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsSection = document.getElementById('search-results-section');
    const searchResultsList = document.getElementById('search-results-list');

    const nowWatchingSection = document.getElementById('now-watching-carousel').closest('.anime-section');
    const trendingSection = document.getElementById('trending-carousel').closest('.anime-section');
    const justAddedSection = document.getElementById('just-added-carousel').closest('.anime-section');
    const clubList = document.getElementById('club-list');

    fetchNowWatching();
    fetchTrending();
    fetchJustAdded();
    fetchClubs();

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            renderedAnimeIds.clear(); // Clear the set when search input is empty
            searchResultsSection.style.display = 'none';
            nowWatchingSection.style.display = 'block';
            trendingSection.style.display = 'block';
            justAddedSection.style.display = 'block';
        }
    });

    async function performSearch() {
        renderedAnimeIds.clear(); // Clear the set for new search
        const query = searchInput.value.trim();
        if (query.length < 3) {
            alert('Please enter at least 3 characters for search.');
            return;
        }

        // Hide other sections and show search results section
        nowWatchingSection.style.display = 'none';
        trendingSection.style.display = 'none';
        justAddedSection.style.display = 'none';
        searchResultsSection.style.display = 'block';
        searchResultsList.innerHTML = '<p>Searching...</p>';

        try {
            const animeList = await fetchFromJikan(`anime?q=${query}&limit=20`);
            if (animeList.length === 0) {
                searchResultsList.innerHTML = '<p>No results found for your search.</p>';
            } else {
                renderAnime(animeList, 'search-results-list');
            }
        } catch (error) {
            console.error('Error during search:', error);
            searchResultsList.innerHTML = '<p>Failed to perform search. Please try again later.</p>';
        }
    }
});

async function fetchFromJikan(endpoint) {
    const response = await fetch(`https://api.jikan.moe/v4/${endpoint}`);
    if (!response.ok) {
        throw new Error(`Jikan API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
}

async function fetchNowWatching() {
    try {
        const animeList = await fetchFromJikan('seasons/now?filter=tv&sort=desc&limit=10');
        renderAnime(animeList, 'now-watching-carousel');
    } catch (error) {
        console.error('Error fetching now watching anime:', error);
        document.getElementById('now-watching-carousel').innerHTML = '<p>Failed to load now watching anime.</p>';
    }
}

async function fetchTrending() {
    try {
        const animeList = await fetchFromJikan('top/anime?filter=airing&limit=10');
        renderAnime(animeList, 'trending-carousel');
    } catch (error) {
        console.error('Error fetching trending anime:', error);
        document.getElementById('trending-carousel').innerHTML = '<p>Failed to load trending anime.</p>';
    }
}

async function fetchJustAdded() {
    try {
        const animeList = await fetchFromJikan('top/anime?filter=upcoming&limit=10');
        renderAnime(animeList, 'just-added-carousel');
    } catch (error) {
        console.error('Error fetching just added anime:', error);
        document.getElementById('just-added-carousel').innerHTML = '<p>Failed to load just added anime.</p>';
    }
}

const renderedAnimeIds = new Set();

function renderAnime(animeList, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    targetElement.innerHTML = ''; // Clear existing content

    animeList.forEach(anime => {
        // Check if this anime has already been rendered in any carousel
        if (!renderedAnimeIds.has(anime.mal_id)) {
            targetElement.appendChild(createAnimeCard(anime));
            renderedAnimeIds.add(anime.mal_id); // Add to the set after rendering
        }
    });
}

function createAnimeCard(anime) {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');
    animeCard.dataset.id = anime.mal_id; // Use mal_id for Jikan data

    const imageUrl = anime.images.jpg.image_url || 'assets/logo.png';
    const isBookmarked = getBookmarkedAnime().includes(anime.mal_id.toString());

    animeCard.innerHTML = `
        <img src="${imageUrl}" alt="${anime.title}">
        <div class="anime-card-info">
            <h3>${anime.title}</h3>
            <p class="anime-stats">
                <span><i class="fas fa-star"></i> ${anime.score ? anime.score.toFixed(2) : 'N/A'}</span>
                <span><i class="fas fa-users"></i> ${anime.members ? (anime.members / 1000).toFixed(1) + 'K' : 'N/A'}</span>
            </p>
        </div>
        <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark bookmark-icon"></i>
    `;

    // Handle bookmarking
    const bookmarkIcon = animeCard.querySelector('.bookmark-icon');
    bookmarkIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent card click event
        toggleBookmark(anime);
        bookmarkIcon.classList.toggle('fas');
        bookmarkIcon.classList.toggle('far');
        bookmarkIcon.classList.toggle('bookmarked');
    });

    // Handle card click to navigate to detail page
    animeCard.addEventListener('click', () => {
        window.location.href = `anime-detail.html?id=${anime.mal_id}`;
    });

    return animeCard;
}

function getBookmarkedAnime() {
    const myList = JSON.parse(localStorage.getItem('myAnimeList')) || {};
    return myList['plan-to-watch'] ? myList['plan-to-watch'].map(anime => anime.id.toString()) : [];
}

function toggleBookmark(anime) {
    let myList = JSON.parse(localStorage.getItem('myAnimeList')) || {
        watching: [],
        completed: [],
        'on-hold': [],
        dropped: [],
        'plan-to-watch': [],
    };

    // Ensure 'plan-to-watch' exists and is an array
    if (!Array.isArray(myList['plan-to-watch'])) {
        myList['plan-to-watch'] = [];
    }

    const planToWatch = myList['plan-to-watch'];
    const existingAnimeIndex = planToWatch.findIndex(item => item.id.toString() === anime.mal_id.toString());

    if (existingAnimeIndex > -1) {
        // Anime is already bookmarked, remove it
        planToWatch.splice(existingAnimeIndex, 1);
    } else {
        // Anime is not bookmarked, add it
        const newAnimeEntry = {
            id: anime.mal_id.toString(),
            title: anime.title,
            imageUrl: anime.images.jpg.image_url || 'assets/logo.png',
            score: anime.score || null,
            members: anime.members || null,
            progress: '0/??',
        };
        planToWatch.push(newAnimeEntry);
    }
    myList['plan-to-watch'] = planToWatch;
    localStorage.setItem('myAnimeList', JSON.stringify(myList));
}

async function fetchClubs() {
    try {
        const res = await fetch('/api/clubs/recent');
        if (!res.ok) {
            throw new Error('Failed to fetch clubs');
        }
        const clubs = await res.json();
        renderClubs(clubs);
    } catch (error) {
        console.error('Error fetching clubs:', error);
        document.getElementById('club-list').innerHTML = '<p>Failed to load clubs.</p>';
    }
}

function renderClubs(clubs) {
    const clubList = document.getElementById('club-list');
    clubList.innerHTML = '';
    clubs.forEach(club => {
        const clubCard = document.createElement('div');
        clubCard.classList.add('club-card');
        clubCard.dataset.id = club._id;

        clubCard.innerHTML = `
            <img src="${club.bannerImage || 'assets/logo.png'}" alt="${club.name}">
            <div class="club-card-info">
                <h3>${club.name}</h3>
                <p>${club.members.length} Members</p>
            </div>
        `;

        clubCard.addEventListener('click', () => {
            window.location.href = `club-detail.html?id=${club._id}`;
        });

        clubList.appendChild(clubCard);
    });
}
