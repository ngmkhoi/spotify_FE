import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";

async function fetchPopularArtists() {
    try {
        const response = await httpRequest.get('artists/trending?limit=20');
        const artists = response.artists || [];
        if (artists.length === 0) {
            showToast('Không có artists trending nào!', 'error');
            return [];
        }
        return artists;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu artists:', error.message);
        showToast('Không thể tải Popular artists!', 'error');
        return [];
    }
}

export default fetchPopularArtists;