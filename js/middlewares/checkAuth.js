import showToast from "../utils/showToast.js";

function checkAuth() {
    const access_token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');
    if (!access_token || !user) {
        showToast('Vui lòng đăng nhập!', 'error');
        return false;
    }
    return access_token;
}

export default checkAuth;