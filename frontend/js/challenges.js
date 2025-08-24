document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        console.log('Redirecting to login. Token:', token, 'UserId:', userId);
        window.location.href = 'login.html';
        return;
    }

    const dailyChallengeBtn = document.querySelector('.challenge-card .challenge-btn');
    const streakInfo = document.querySelector('.streak-info p');

    // Daily Challenge Logic
    if (dailyChallengeBtn) {
        const lastChallengeDate = localStorage.getItem('lastChallengeDate');
        const today = new Date().toDateString();

        if (lastChallengeDate === today) {
            dailyChallengeBtn.textContent = 'Completed Today!';
            dailyChallengeBtn.disabled = true;
            dailyChallengeBtn.classList.add('completed');
        } else {
            dailyChallengeBtn.textContent = 'Complete';
            dailyChallengeBtn.disabled = false;
            dailyChallengeBtn.classList.remove('completed');
        }

        dailyChallengeBtn.addEventListener('click', () => {
            localStorage.setItem('lastChallengeDate', today);
            dailyChallengeBtn.textContent = 'Completed Today!';
            dailyChallengeBtn.disabled = true;
            dailyChallengeBtn.classList.add('completed');
            updateStreak();
        });
    }

    // Streak Logic
    function updateStreak() {
        const lastStreakDate = localStorage.getItem('lastStreakDate');
        let streak = parseInt(localStorage.getItem('streak')) || 0;
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (lastStreakDate === today) {
            // Already updated today, do nothing
        } else if (lastStreakDate === yesterdayString) {
            // Continue streak
            streak++;
            localStorage.setItem('streak', streak);
            localStorage.setItem('lastStreakDate', today);
        } else {
            // Reset streak if not consecutive
            streak = 1;
            localStorage.setItem('streak', streak);
            localStorage.setItem('lastStreakDate', today);
        }
        streakInfo.innerHTML = `You are on a <strong>${streak}-day</strong> streak!`;
    }

    // Initialize streak display on page load
    updateStreak();

    // Badge Logic (Static for now, can be expanded with dynamic unlocking)
    // Example: Unlock a badge after 5 challenges completed
    // This would require tracking completed challenges, similar to streak.
});
