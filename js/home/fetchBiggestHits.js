import httpRequest from "../utils/httpRequest.js";
import showToast from "../utils/showToast.js";

async function fetchBiggestHits() {
    try {
        const response = await httpRequest.get('tracks/trending?limit=20');
        const tracks = response.tracks || [];
        if (tracks.length === 0) {
            showToast('Không có tracks trending nào!', 'error');
            return [];
        }
        return tracks;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu trending tracks:', error.message);
        showToast('Không thể tải Today’s biggest hits!', 'error');
        return [];
    }
}

export default fetchBiggestHits;