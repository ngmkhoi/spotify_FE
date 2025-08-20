import showToast from "../utils/showToast.js";

function checkAuth() {
    const access_token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');
    if (!access_token || !user) {
        showToast('Vui lòng đăng nhập để phát nhạc!', 'error');
        return false;
    }
    return access_token;
}

export default checkAuth;