document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    const notificationsList = document.getElementById('notifications-list');
    const noNotificationsMessage = document.getElementById('no-notifications-message');

    async function fetchNotifications() {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                console.error('User not authenticated. Redirecting to login.');
                // Optionally redirect to login page
                // window.location.href = 'login.html';
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const response = await fetch('/api/notifications', config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notifications = await response.json();
            renderNotifications(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            noNotificationsMessage.style.display = 'block';
            noNotificationsMessage.textContent = 'Failed to load notifications. Please try again later.';
        }
    }

    async function markNotificationAsRead(notificationId) {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                console.error('User not authenticated.');
                return;
            }

            const config = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await fetch(`/api/notifications/${notificationId}/read`, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // After marking as read, re-fetch notifications to update the UI
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    function renderNotifications(notifications) {
        notificationsList.innerHTML = '';
        if (notifications.length === 0) {
            noNotificationsMessage.style.display = 'block';
            noNotificationsMessage.textContent = 'No new notifications.';
            return;
        }
        noNotificationsMessage.style.display = 'none';

        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification-item');
            if (!notification.read) {
                notificationItem.classList.add('unread');
            }
            notificationItem.dataset.id = notification._id; // Store notification ID

            let iconClass = '';
            switch (notification.type) {
                case 'episode':
                    iconClass = 'fas fa-tv';
                    break;
                case 'club':
                    iconClass = 'fas fa-users';
                    break;
                case 'challenge':
                    iconClass = 'fas fa-trophy';
                    break;
                default:
                    iconClass = 'fas fa-info-circle';
            }

            notificationItem.innerHTML = `
                <i class="notification-icon ${iconClass}"></i>
                <div class="notification-content">
                    <h4>${notification.message}</h4>
                    <p class="notification-time">${new Date(notification.createdAt).toLocaleString()}</p>
                </div>
            `;
            notificationsList.appendChild(notificationItem);

            // Add event listener to mark as read when clicked
            if (!notification.read) {
                notificationItem.addEventListener('click', () => {
                    markNotificationAsRead(notification._id);
                });
            }
        });
    }

    // Initial fetch of notifications
    fetchNotifications();
});
