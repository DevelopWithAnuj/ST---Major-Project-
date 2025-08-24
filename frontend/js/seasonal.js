let displayedAnimeIds = new Set();

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        
        window.location.href = 'login.html';
        return;
    }

    populateYearFilter();
    addEventListeners();
    fetchSeasonalAnime('current', 'all', new Date().getFullYear()); // Initial fetch
    fetchTopUpcoming();
    fetchPopularThisSeason();
});

async function fetchFromJikan(endpoint) {
    const response = await fetch(`https://api.jikan.moe/v4/${endpoint}`);
    if (!response.ok) {
        throw new Error(`Jikan API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
}

async function fetchTopUpcoming() {
    try {
        const animeList = await fetchFromJikan('seasons/upcoming?filter=tv&sort=desc&limit=20');
        renderAnime(animeList, 'top-upcoming-list');
    } catch (error) {
        console.error('Error fetching top upcoming anime:', error);
        document.getElementById('top-upcoming-list').innerHTML = '<p>Failed to load top upcoming anime.</p>';
    }
}

async function fetchPopularThisSeason() {
    try {
        const animeList = await fetchFromJikan('seasons/now?filter=tv&sort=desc&limit=20');
        renderAnime(animeList, 'popular-this-season-list');
    } catch (error) {
        console.error('Error fetching popular anime this season:', error);
        document.getElementById('popular-this-season-list').innerHTML = '<p>Failed to load popular anime this season.</p>';
    }
}

function populateYearFilter() {
    const yearFilter = document.getElementById('year-filter');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear + 1; i >= 1980; i--) { // Jikan API data starts from 1980
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearFilter.appendChild(option);
    }
    yearFilter.value = currentYear; // Set current year as default
}

function addEventListeners() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            navTabs.forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            const seasonFilter = event.target.dataset.seasonFilter;
            document.getElementById('season-filter-container').style.display = seasonFilter === 'archive' ? 'block' : 'none';
            applyFilters();
        });
    });

    document.getElementById('year-filter').addEventListener('change', applyFilters);
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('season-filter').addEventListener('change', applyFilters);
}

function applyFilters() {
    const activeNavTab = document.querySelector('.nav-tab.active');
    const seasonFilter = activeNavTab ? activeNavTab.dataset.seasonFilter : 'current';
    const typeFilter = document.getElementById('type-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const specificSeason = document.getElementById('season-filter').value;

    fetchSeasonalAnime(seasonFilter, typeFilter, yearFilter, specificSeason);
}

async function fetchSeasonalAnime(season, type, year, specificSeason) {
    let url = '';
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let currentSeason = '';

    if (currentMonth >= 0 && currentMonth <= 2) currentSeason = 'winter';
    else if (currentMonth >= 3 && currentMonth <= 5) currentSeason = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) currentSeason = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) currentSeason = 'fall';

    try {
        if (season === 'current') {
            url = `https://api.jikan.moe/v4/seasons/${currentYear}/${currentSeason}`;
        } else if (season === 'next') {
            let nextYear = currentYear;
            let nextSeason = '';
            if (currentSeason === 'winter') { nextSeason = 'spring'; }
            else if (currentSeason === 'spring') { nextSeason = 'summer'; }
            else if (currentSeason === 'summer') { nextSeason = 'fall'; }
            else if (currentSeason === 'fall') { nextSeason = 'winter'; nextYear++; }
            url = `https://api.jikan.moe/v4/seasons/${nextYear}/${nextSeason}`;
        } else if (season === 'last') {
            let lastYear = currentYear;
            let lastSeason = '';
            if (currentSeason === 'winter') { lastSeason = 'fall'; lastYear--; }
            else if (currentSeason === 'spring') { lastSeason = 'winter'; }
            else if (currentSeason === 'summer') { lastSeason = 'spring'; }
            else if (currentSeason === 'fall') { lastSeason = 'summer'; }
            url = `https://api.jikan.moe/v4/seasons/${lastYear}/${lastSeason}`;
        } else if (season === 'archive') {
            url = `https://api.jikan.moe/v4/seasons/${year}/${specificSeason}`;
        }

        const response = await fetch(url);
        let data = await response.json();

        let filteredAnime = data.data;

        if (type !== 'all') {
            filteredAnime = filteredAnime.filter(anime => {
                switch (type) {
                    case 'tv_new':
                        return anime.type === 'TV' && !anime.continuing;
                    case 'tv_continuing':
                        return anime.type === 'TV' && anime.continuing;
                    case 'ona':
                        return anime.type === 'ONA';
                    case 'ova':
                        return anime.type === 'OVA';
                    case 'movie':
                        return anime.type === 'Movie';
                    case 'special':
                        return anime.type === 'Special';
                    case 'tv_special':
                        return anime.type === 'TV Special';
                    default:
                        return true;
                }
            });
        }

        renderAnime(filteredAnime, 'seasonal-results-list');

        if (filteredAnime.length === 0) {
            document.getElementById('seasonal-results-list').innerHTML = '<p>No anime found for the selected filters.</p>';
        }

    } catch (error) {
        console.error('Error fetching seasonal anime:', error);
        document.getElementById('seasonal-results-list').innerHTML = '<p>Failed to load seasonal anime. Please try again later.</p>';
    }
}

function renderAnime(animeList, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    if (targetElementId === 'seasonal-results-list') {
        targetElement.innerHTML = ''; // Clear only for the main seasonal list
        displayedAnimeIds.clear();
    }

    animeList.forEach(anime => {
        if (!displayedAnimeIds.has(anime.mal_id)) {
            targetElement.appendChild(createSeasonalAnimeCard(anime));
            displayedAnimeIds.add(anime.mal_id);
        }
    });
}

function createSeasonalAnimeCard(anime) {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');
    animeCard.dataset.id = anime.mal_id;

    const imageUrl = anime.images.jpg.image_url || 'assets/logo.png';
    const isBookmarked = getBookmarkedAnime().includes(anime.mal_id.toString());
    const genres = anime.genres.map(genre => genre.name).join(', ');

    animeCard.innerHTML = `
        <img src="${imageUrl}" alt="${anime.title}" class="anime-card-image">
        <div class="anime-card-info">
            <h3>${anime.title}</h3>
            <p class="anime-card-details">
                <span class="rating"><i class="fas fa-star"></i> ${anime.score ? anime.score.toFixed(2) : 'N/A'}</span>
                <span class="members"><i class="fas fa-users"></i> ${anime.members ? anime.members.toLocaleString() : 'N/A'}</span>
            </p>
            <p class="anime-genres">${genres}</p>
        </div>
        <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark bookmark-icon"></i>
    `;

    const bookmarkIcon = animeCard.querySelector('.bookmark-icon');
    bookmarkIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleBookmark(anime); // Pass the full anime object
        bookmarkIcon.classList.toggle('fas');
        bookmarkIcon.classList.toggle('far');
    });

    animeCard.addEventListener('click', () => {
        window.location.href = `anime-detail.html?id=${anime.mal_id}`;
    });

    return animeCard;
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
            id: anime.mal_id.toString(), // Store as string
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

function getBookmarkedAnime() {
    const myList = JSON.parse(localStorage.getItem('myAnimeList')) || {};
    const bookmarkedIds = myList['plan-to-watch'] ? myList['plan-to-watch'].map(anime => anime.id.toString()) : [];
    
    return bookmarkedIds;
}
