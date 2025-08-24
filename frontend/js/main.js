document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const overlay = document.getElementById('overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const loadingOverlay = document.getElementById('loading-overlay');

    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }

    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
    }

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:'))) {
                return;
            }
            e.preventDefault();
            document.body.classList.add('fade-out');
            showLoading();
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userInfo');
            document.body.classList.add('fade-out');
            showLoading();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        });
    }

    // Sidebar functionality
    if (menuToggle && sidebar && closeSidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.style.width = '250px';
            overlay.style.display = 'block';
        });

        closeSidebar.addEventListener('click', () => {
            sidebar.style.width = '0';
            overlay.style.display = 'none';
        });

        overlay.addEventListener('click', () => {
            sidebar.style.width = '0';
            overlay.style.display = 'none';
        });
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', document.body.dataset.theme);
        });

        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.dataset.theme = savedTheme;
        } else {
            // Default to light theme if no theme is saved
            document.body.dataset.theme = 'light';
        }
    }

    // Basic authentication check for admin dashboard link
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const adminDashboardLink = document.getElementById('admin-dashboard-link');

    if (adminDashboardLink) {
        if (userInfo && userInfo.isAdmin) {
            adminDashboardLink.style.display = 'block';
        } else {
            adminDashboardLink.style.display = 'none';
        }
    }
});

// Function to get user info from local storage
function getUserInfo() {
    const userInfoString = localStorage.getItem('userInfo');
    return userInfoString ? JSON.parse(userInfoString) : null;
}

// Function to get user ID from local storage
function getUserIdFromToken() {
    const userInfo = getUserInfo();
    return userInfo ? userInfo._id : null;
}
