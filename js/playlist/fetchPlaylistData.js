import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";
import checkAuth from "../middlewares/checkAuth.js";

async function fetchPlaylistData(playlistId) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để xem playlist!', 'error');
        return null;
    }

    try {
        const playlistResponse = await httpRequest.get(`playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const playlist = playlistResponse || {};
        console.log('Playlist data:', playlist);

        const tracksResponse = await httpRequest.get(`playlists/${playlistId}/tracks?limit=10`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const tracks = tracksResponse.tracks || [];
        console.log('Tracks data:', tracks);

        return { playlist, tracks };
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu playlist:', error.message);
        showToast('Không thể tải thông tin playlist!', 'error');
        if (error.status === 401) {
            showToast('Token hết hạn, vui lòng đăng nhập lại!', 'error');
        }
        return null;
    }
}

export default fetchPlaylistData;