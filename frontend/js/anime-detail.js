document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        document.getElementById('anime-details-container').innerHTML = '<p>Anime ID not found.</p>';
        return;
    }

    const animeTitleHeader = document.getElementById('anime-title-header');
    const animeDetailsContainer = document.getElementById('anime-details-container');

    animeDetailsContainer.innerHTML = '<p>Loading details for anime ID: ${animeId}...</p>';

    try {
        const animeData = await fetchFromJikan(`anime/${animeId}/full`);
        console.log('Fetched anime data:', animeData);

        if (!animeData) {
            animeDetailsContainer.innerHTML = '<p>Anime details not found.</p>';
            return;
        }

        animeTitleHeader.textContent = animeData.title;
        renderAnimeDetails(animeData);

    } catch (error) {
        console.error('Error fetching anime details:', error);
        animeDetailsContainer.innerHTML = '<p>Failed to load anime details. Please try again later.</p>';
    }

    async function fetchFromJikan(endpoint) {
        const response = await fetch(`https://api.jikan.moe/v4/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Jikan API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }

    function renderAnimeDetails(anime) {
        const genres = anime.genres.map(g => g.name).join(', ');
        const studios = anime.studios.map(s => s.name).join(', ');
        const producers = anime.producers.map(p => p.name).join(', ');
        const licensors = anime.licensors.map(l => l.name).join(', ');

        animeDetailsContainer.innerHTML = `
            <div class="anime-header">
                <img src="${anime.images.jpg.large_image_url || 'assets/logo.png'}" alt="${anime.title}" class="anime-poster">
                <div class="anime-info">
                    <h1>${anime.title}</h1>
                    <p><strong>Type:</strong> ${anime.type} (${anime.episodes || '??'} episodes)</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                    <p><strong>Aired:</strong> ${anime.aired.string}</p>
                    <p><strong>Premiered:</strong> ${anime.season ? `${anime.season} ${anime.year}` : 'N/A'}</p>
                    <p><strong>Genres:</strong> ${genres || 'N/A'}</p>
                    <p><strong>Studios:</strong> ${studios || 'N/A'}</p>
                </div>
            </div>

            <div class="anime-stats-grid">
                <div class="stat-item"><span class="value">${anime.score || 'N/A'}</span><span class="label">Score</span></div>
                <div class="stat-item"><span class="value">${anime.rank || 'N/A'}</span><span class="label">Rank</span></div>
                <div class="stat-item"><span class="value">${anime.popularity || 'N/A'}</span><span class="label">Popularity</span></div>
                <div class="stat-item"><span class="value">${anime.members || 'N/A'}</span><span class="label">Members</span></div>
                <div class="stat-item"><span class="value">${anime.favorites || 'N/A'}</span><span class="label">Favorites</span></div>
            </div>

            <div class="anime-section">
                <h2>Synopsis</h2>
                <p>${anime.synopsis || 'No synopsis available.'}</p>
            </div>

            ${anime.trailer && anime.trailer.embed_url ? `
            <div class="anime-trailer">
                <h2>Trailer</h2>
                <div class="video-container">
                    <iframe src="${anime.trailer.embed_url.replace('autoplay=1', 'autoplay=0')}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            ` : ''}

            <div class="anime-section">
                <h2>More Information</h2>
                <p><strong>Source:</strong> ${anime.source || 'N/A'}</p>
                <p><strong>Producers:</strong> ${producers || 'N/A'}</p>
                <p><strong>Licensors:</strong> ${licensors || 'N/A'}</p>
                <p><strong>Rating:</strong> ${anime.rating || 'N/A'}</p>
            </div>

            <div class="anime-section" id="characters-section">
                <h2>Characters</h2>
                <div class="character-grid">
                    <!-- Characters will be loaded here -->
                </div>
            </div>

            <div class="anime-section" id="staff-section">
                <h2>Staff</h2>
                <ul class="staff-list">
                    <!-- Staff will be loaded here -->
                </ul>
            </div>

            <div class="anime-section" id="reviews-section">
                <h2>Reviews</h2>
                <ul class="reviews-list">
                    <!-- Reviews will be loaded here -->
                </ul>
            </div>

            <div class="anime-section" id="news-section">
                <h2>News</h2>
                <ul class="news-list">
                    <!-- News will be loaded here -->
                </ul>
            </div>

            <div class="anime-section" id="discussions-section">
                <h2>Discussions</h2>
                <!-- Discussions will be loaded here -->
            </div>

            <div class="watch-progress-section">
                <h2>My Watch Progress</h2>
                <div class="watch-progress-options">
                    <button data-status="watching">Watching</button>
                    <button data-status="completed">Completed</button>
                    <button data-status="on-hold">On Hold</button>
                    <button data-status="dropped">Dropped</button>
                    <button data-status="plan-to-watch">Plan to Watch</button>
                    <input type="number" id="episode-progress" placeholder="Episode" min="0">
                    <button id="save-progress-btn">Save Progress</button>
                </div>
            </div>
        `;

        // Fetch and render characters
        fetchFromJikan(`anime/${anime.mal_id}/characters`).then(data => {
            const charactersGrid = document.getElementById('characters-section').querySelector('.character-grid');
            if (data && data.length > 0) {
                data.slice(0, 10).forEach(charData => { // Limit to 10 characters
                    const character = charData.character;
                    const voiceActors = charData.voice_actors.filter(va => va.language === 'Japanese');
                    const characterCard = document.createElement('div');
                    characterCard.classList.add('character-card');
                    characterCard.innerHTML = `
                        <img src="${character.images.jpg.image_url || 'assets/logo.png'}" alt="${character.name}">
                        <div class="character-card-info">
                            <h4>${character.name}</h4>
                            ${voiceActors.length > 0 ? `<p>${voiceActors[0].person.name}</p>` : ''}
                        </div>
                    `;
                    charactersGrid.appendChild(characterCard);
                });
            } else {
                charactersGrid.innerHTML = '<p>No characters found.</p>';
            }
        }).catch(error => console.error('Error fetching characters:', error));

        // Fetch and render staff
        fetchFromJikan(`anime/${anime.mal_id}/staff`).then(data => {
            const staffList = document.getElementById('staff-section').querySelector('.staff-list');
            if (data && data.length > 0) {
                data.slice(0, 5).forEach(staff => { // Limit to 5 staff members
                    const staffItem = document.createElement('li');
                    staffItem.innerHTML = `<strong>${staff.person.name}</strong> - ${staff.positions.join(', ')}`;
                    staffList.appendChild(staffItem);
                });
            } else {
                staffList.innerHTML = '<p>No staff found.</p>';
            }
        }).catch(error => console.error('Error fetching staff:', error));

        // Fetch and render reviews
        fetchFromJikan(`anime/${anime.mal_id}/reviews`).then(data => {
            const reviewsList = document.getElementById('reviews-section').querySelector('.reviews-list');
            if (data && data.length > 0) {
                data.slice(0, 3).forEach(review => { // Limit to 3 reviews
                    const reviewItem = document.createElement('li');
                    reviewItem.innerHTML = `
                        <strong>${review.user.username}</strong> - Score: ${review.score}<br>
                        ${review.review.substring(0, 200)}...
                    `;
                    reviewsList.appendChild(reviewItem);
                });
            } else {
                reviewsList.innerHTML = '<p>No reviews found.</p>';
            }
        }).catch(error => console.error('Error fetching reviews:', error));

        // Fetch and render news
        fetchFromJikan(`anime/${anime.mal_id}/news`).then(data => {
            const newsList = document.getElementById('news-section').querySelector('.news-list');
            if (data && data.length > 0) {
                data.slice(0, 3).forEach(newsItem => { // Limit to 3 news items
                    const newsLi = document.createElement('li');
                    newsLi.innerHTML = `
                        <a href="${newsItem.url}" target="_blank"><strong>${newsItem.title}</strong></a><br>
                        ${newsItem.excerpt.substring(0, 150)}...
                    `;
                    newsList.appendChild(newsLi);
                });
            } else {
                newsList.innerHTML = '<p>No news found.</p>';
            }
        }).catch(error => console.error('Error fetching news:', error));

        // Watch progress functionality
        const watchProgressOptions = document.querySelector('.watch-progress-options');
        const episodeProgressInput = document.getElementById('episode-progress');
        const saveProgressBtn = document.getElementById('save-progress-btn');

        let currentStatus = 'plan-to-watch'; // Default status

        // Load saved progress
        const savedProgress = JSON.parse(localStorage.getItem(`animeProgress_${anime.mal_id}`)) || {};
        if (savedProgress.status) {
            currentStatus = savedProgress.status;
            watchProgressOptions.querySelectorAll('button').forEach(btn => {
                if (btn.dataset.status === currentStatus) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        if (savedProgress.episode) {
            episodeProgressInput.value = savedProgress.episode;
        }

        watchProgressOptions.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                watchProgressOptions.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentStatus = button.dataset.status;
            });
        });

        saveProgressBtn.addEventListener('click', () => {
            const progress = {
                status: currentStatus,
                episode: episodeProgressInput.value,
            };
            localStorage.setItem(`animeProgress_${anime.mal_id}`, JSON.stringify(progress));
            alert('Progress saved!');
        });

        // My List Modal Functionality
        const myListFab = document.getElementById('my-list-fab');
        const myListModal = document.getElementById('my-list-modal');
        const closeModalBtn = myListModal.querySelector('.close-button');
        const listStatusSelect = document.getElementById('list-status');
        const listProgressInput = document.getElementById('list-progress');
        const listScoreInput = document.getElementById('list-score');
        const listDateInput = document.getElementById('list-date');
        const saveListEntryBtn = document.getElementById('save-list-entry');
        const removeFromListBtn = document.getElementById('remove-from-list');

        // Function to get anime from a specific list
        const getAnimeFromList = (listName) => {
            const myList = JSON.parse(localStorage.getItem('myAnimeList')) || {};
            return myList[listName] ? myList[listName].find(item => item.id === anime.mal_id) : null;
        };

        // Function to update or add anime to a list
        const updateAnimeList = (status, progress, score, date) => {
            let myList = JSON.parse(localStorage.getItem('myAnimeList')) || {};
            // Ensure all status categories exist as arrays
            ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'].forEach(cat => {
                if (!myList[cat]) myList[cat] = [];
            });

            // Remove from all lists first to prevent duplicates
            for (const key in myList) {
                if (Array.isArray(myList[key])) {
                    myList[key] = myList[key].filter(item => item.id !== anime.mal_id);
                }
            }

            const newEntry = {
                id: anime.mal_id,
                title: anime.title,
                imageUrl: anime.images.jpg.image_url || 'assets/logo.png',
                status: status,
                progress: String(progress), // Ensure progress is a string
                score: score,
                date: date,
                members: anime.members || 0, // Ensure members is saved
            };

            myList[status].push(newEntry);
            localStorage.setItem('myAnimeList', JSON.stringify(myList));
            alert('Anime list updated!');
            myListModal.style.display = 'none';
        };

        // Function to remove anime from all lists
        const removeAnimeFromList = () => {
            let myList = JSON.parse(localStorage.getItem('myAnimeList')) || {};
            for (const key in myList) {
                if (Array.isArray(myList[key])) {
                    myList[key] = myList[key].filter(item => item.id !== anime.mal_id);
                }
            }
            localStorage.setItem('myAnimeList', JSON.stringify(myList));
            alert('Anime removed from list!');
            myListModal.style.display = 'none';
        };

        myListFab.addEventListener('click', () => {
            // Populate modal with current data if anime is in any list
            let currentAnimeEntry = null;
            for (const key in JSON.parse(localStorage.getItem('myAnimeList')) || {}) {
                if (Array.isArray(JSON.parse(localStorage.getItem('myAnimeList'))[key])) {
                    currentAnimeEntry = JSON.parse(localStorage.getItem('myAnimeList'))[key].find(item => item.id === anime.mal_id);
                    if (currentAnimeEntry) break;
                }
            }

            if (currentAnimeEntry) {
                listStatusSelect.value = currentAnimeEntry.status || 'plan-to-watch';
                listProgressInput.value = currentAnimeEntry.progress || '';
                listScoreInput.value = currentAnimeEntry.score || '';
                listDateInput.value = currentAnimeEntry.date || '';
                removeFromListBtn.style.display = 'block';
            } else {
                // Reset form for new entry
                listStatusSelect.value = 'plan-to-watch';
                listProgressInput.value = '';
                listScoreInput.value = '';
                listDateInput.value = '';
                removeFromListBtn.style.display = 'none';
            }
            myListModal.style.display = 'flex'; // Use flex to center modal
        });

        closeModalBtn.addEventListener('click', () => {
            myListModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === myListModal) {
                myListModal.style.display = 'none';
            }
        });

        saveListEntryBtn.addEventListener('click', () => {
            const status = listStatusSelect.value;
            const progress = listProgressInput.value;
            const score = listScoreInput.value;
            const date = listDateInput.value;
            updateAnimeList(status, progress, score, date);
        });

        removeFromListBtn.addEventListener('click', () => {
            removeAnimeFromList();
        });
    }
});
