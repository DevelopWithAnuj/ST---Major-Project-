document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    const themeSelect = document.getElementById('theme-select');

    // Set initial theme value
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;
    document.body.dataset.theme = savedTheme;

    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        document.body.dataset.theme = selectedTheme;
        localStorage.setItem('theme', selectedTheme);
    });

    // TODO: Implement change password and delete account functionality
});
