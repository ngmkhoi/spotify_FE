import checkAuth from "../middlewares/checkAuth.js";
import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";

async function addTrackToPlaylist(trackId, playlistId) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để thêm track!', 'error');
        return;
    }

    try {
        await httpRequest.post(`playlists/${playlistId}/tracks`, { track_id: trackId }, {
            headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' }
        });
        showToast('Đã thêm track vào playlist!', 'success');
        // Optional: await fetchSidebarItems(); renderLibrary('playlists'); // Nếu cần refresh sidebar
    } catch (error) {
        console.error('Lỗi khi thêm track:', error);
        showToast('Không thể thêm track! Vui lòng thử lại.', 'error');
        if (error.status === 401) {
            showToast('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.', 'error');
        } else if (error.status === 409) {
            showToast('Track đã tồn tại trong playlist!', 'info');
        }
    }
}

export default addTrackToPlaylist;