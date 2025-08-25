// playlist/addTrackToPlaylist.js
import checkAuth from "../middlewares/checkAuth.js";
import showToast from "../utils/showToast.js";
import fetchSidebarItems, { userPlaylist } from "../sidebar/fetchSidebarItems.js";

async function getUserPlaylists() {
    if (userPlaylist.length > 0) {
        return userPlaylist; // Tận dụng cache từ fetchSidebarItems
    }

    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để thêm track vào playlist!', 'error');
        return [];
    }

    try {
        await fetchSidebarItems(); // Gọi API để lấy userPlaylist
        return userPlaylist; // Chỉ return playlist có is_owner = true
    } catch (error) {
        console.error('Lỗi khi lấy playlists:', error);
        showToast('Không thể lấy danh sách playlist! Vui lòng thử lại.', 'error');
        return [];
    }
}

export default getUserPlaylists;