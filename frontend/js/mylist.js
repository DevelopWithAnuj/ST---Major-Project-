document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        
        window.location.href = 'login.html';
        return;
    }

    const tabs = document.querySelectorAll('.tab-link');
    const mylistContent = document.getElementById('mylist-content');

    let currentStatus = 'watching'; // Default tab

    function getMyList() {
        return JSON.parse(localStorage.getItem('myAnimeList')) || {
            watching: [],
            completed: [],
            'on-hold': [],
            dropped: [],
            'plan-to-watch': [],
        };
    }

    function saveMyList(myList) {
        localStorage.setItem('myAnimeList', JSON.stringify(myList));
    }

    function renderAnimeList(status) {
        const myList = getMyList();
        const animeList = myList[status] || [];
        mylistContent.innerHTML = '';

        if (animeList.length === 0) {
            mylistContent.innerHTML = '<p>No anime in this list.</p>';
            return;
        }

        animeList.forEach(anime => {
            const animeCard = createAnimeCard(anime);
            mylistContent.appendChild(animeCard);
        });
    }

    function createAnimeCard(anime) {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        card.dataset.id = anime.id;

        const scoreDisplay = typeof anime.score === 'number' ? anime.score.toFixed(2) : 'N/A';

        card.innerHTML = `
            <img src="${anime.imageUrl}" alt="${anime.title}" class="anime-card-image">
            <div class="anime-card-info">
                <h3>${anime.title}</h3>
                <p class="anime-card-details">
                    <span class="rating"><i class="fas fa-star"></i> ${scoreDisplay}</span>
                    <span class="members"><i class="fas fa-users"></i> ${anime.members ? anime.members.toLocaleString() : 'N/A'}</span>
                </p>
                <div class="watch-progress">
                    <span>Progress: </span>
                    <input type="text" class="progress-input" value="${anime.progress}">
                </div>
                <div class="anime-card-actions">
                    <button class="action-btn move-btn">Move</button>
                    <button class="action-btn remove-btn">Remove</button>
                </div>
            </div>
        `;

        const removeBtn = card.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            removeAnime(anime.id, currentStatus);
        });

        const moveBtn = card.querySelector('.move-btn');
        moveBtn.addEventListener('click', () => {
            openMoveModal(anime.id, anime.title, currentStatus);
        });

        return card;
    }

    function removeAnime(animeId, status) {
        const myList = getMyList();
        myList[status] = myList[status].filter(anime => anime.id.toString() !== animeId.toString());
        saveMyList(myList);
        renderAnimeList(status);
    }

    // Modal elements
    const moveModal = document.getElementById('move-modal');
    const closeButton = moveModal.querySelector('.close-button');
    const animeTitleModal = document.getElementById('anime-title-modal');
    const moveStatusSelect = document.getElementById('move-status-select');
    const confirmMoveBtn = document.getElementById('confirm-move-btn');
    const cancelMoveBtn = document.getElementById('cancel-move-btn');

    let animeToMoveId = null;
    let animeToMoveCurrentStatus = null;

    function openMoveModal(animeId, animeTitle, currentStatus) {
        animeToMoveId = animeId;
        animeToMoveCurrentStatus = currentStatus;
        animeTitleModal.textContent = animeTitle;
        moveStatusSelect.value = currentStatus; // Set default selected option
        moveModal.style.display = 'block';
    }

    function closeMoveModal() {
        moveModal.style.display = 'none';
        animeToMoveId = null;
        animeToMoveCurrentStatus = null;
    }

    closeButton.addEventListener('click', closeMoveModal);
    cancelMoveBtn.addEventListener('click', closeMoveModal);

    confirmMoveBtn.addEventListener('click', () => {
        const newStatus = moveStatusSelect.value;
        if (animeToMoveId && animeToMoveCurrentStatus && newStatus) {
            moveAnime(animeToMoveId, animeToMoveCurrentStatus, newStatus);
            closeMoveModal();
        }
    });

    function moveAnime(animeId, oldStatus, newStatus) {
        if (oldStatus === newStatus) return; // No change needed

        const myList = getMyList();
        const animeIndex = myList[oldStatus].findIndex(anime => anime.id.toString() === animeId.toString());

        if (animeIndex > -1) {
            const [anime] = myList[oldStatus].splice(animeIndex, 1);
            myList[newStatus].push(anime);
            saveMyList(myList);
            renderAnimeList(oldStatus); // Re-render old list
            renderAnimeList(newStatus); // Re-render new list
            // Re-render the current active tab to reflect changes
            renderAnimeList(currentStatus);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentStatus = tab.dataset.status;
            renderAnimeList(currentStatus);
        });
    });

    // Initial render
    renderAnimeList(currentStatus);
});
