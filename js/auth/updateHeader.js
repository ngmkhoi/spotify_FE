import httpRequest from "../utils/httpRequest.js";
import sanitizeInput from "../utils/sanitizeInput.js";

async function updateHeader() {
    const token = localStorage.getItem('access_token');
    let user = JSON.parse(localStorage.getItem('current_user'));

    if (token && !user) {
        try {
            const response = await httpRequest.get('users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            user = response.user || response;
            user.email = sanitizeInput(user.email || 'User');
            user.avatar_url = sanitizeInput(user.avatar_url || './icon/person-circle.svg');
            localStorage.setItem('current_user', JSON.stringify(user));
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error.message);
            localStorage.removeItem('current_user');
        }
    }

    const authButtons = document.querySelector('.auth-buttons');
    const userAvatar = document.getElementById("userAvatar");
    const userGreeting = document.getElementById("userGreeting");

    if (token && user) {
        const displayName = sanitizeInput(user.email || 'User');
        const avatarUrl = sanitizeInput(user.avatar_url || './icon/person-circle.svg');

        authButtons.style.display = 'none';
        userAvatar.style.display = 'block';

        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = displayName;
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.borderRadius = '50%';
        userAvatar.innerHTML = '';
        userAvatar.appendChild(img);

        userAvatar.title = `Xin chào ${displayName}`;
        if (userGreeting) {
            userGreeting.textContent = `Xin chào ${displayName}`;
            userGreeting.classList.remove('hidden');
        }
    } else {
        authButtons.style.display = 'flex';
        userAvatar.style.display = 'none';
        if (userGreeting) userGreeting.classList.add('hidden');
    }
}

export default updateHeader;