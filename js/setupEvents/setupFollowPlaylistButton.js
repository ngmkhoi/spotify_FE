import checkAuth from "../middlewares/checkAuth.js";
import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";
import {toggleFollowPlaylist} from "../playlist/toggleFollowPlaylist.js";

async function setupFollowButton(playlistId) {
    if (!playlistId) {
        console.error('Error: playlistId is undefined in setupFollowButton');
        return;
    }
    playlistId = String(playlistId);
    const button = document.querySelector(`.follow-btn[data-playlist-id="${playlistId}"]`);
    if (!button) {
        console.warn('Follow button not found for playlist:', playlistId);
        return;
    }

    try {
        const access_token = checkAuth();
        if (!access_token) {
            button.textContent = 'Follow';
            return;
        }

        const playlistData = await httpRequest.get(`playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const isFollowed = playlistData.is_following || false;
        button.textContent = isFollowed ? 'Unfollow' : 'Follow';
        console.log('Follow button setup for playlist:', playlistId, 'isFollowed:', isFollowed);

        button.addEventListener('click', () => toggleFollowPlaylist(playlistId, button));
    } catch (error) {
        console.error('Error setting up follow button:', error);
        button.textContent = 'Follow';
        if (error.status === 401) {
            showToast('Token hết hạn, vui lòng đăng nhập lại!', 'error');
        }
    }
}

export default setupFollowButton;