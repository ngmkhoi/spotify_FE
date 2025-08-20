import httpRequest from "../services/httpRequest.js";
import checkAuth from "../middlewares/checkAuth.js";
import showToast from "../utils/showToast.js";

async function addToQueue(trackId) {
    const access_token = checkAuth();
    if (!access_token) return;

    try {
        await httpRequest.post(`me/player/queue`, {
            track_id: trackId
        }, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
    } catch (error) {
        console.error('Lỗi khi thêm vào queue:', error.message);
        showToast('Không thể thêm vào queue!', 'error');
    }
}

export default addToQueue;