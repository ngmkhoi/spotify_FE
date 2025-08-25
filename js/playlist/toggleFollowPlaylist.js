import checkAuth from "../middlewares/checkAuth.js";
import httpRequest from "../services/httpRequest.js";
import fetchSidebarItems from "../sidebar/fetchSidebarItems.js";
import showToast from "../utils/showToast.js";
import { renderLibrary } from "../sidebar/renderLibrary.js";

async function toggleFollowPlaylist(playlistId, button) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để theo dõi playlist!', 'error');
        return;
    }

    playlistId = String(playlistId);
    console.log('Toggling follow for playlist:', playlistId);

    try {
        const playlistData = await httpRequest.get(`playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const isFollowed = playlistData.is_following || false;
        console.log('isFollowed from API:', isFollowed);

        if (isFollowed) {
            await httpRequest.delete(`playlists/${playlistId}/follow`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            button.textContent = 'Follow';
            showToast('Đã bỏ theo dõi playlist!', 'success');
        } else {
            await httpRequest.post(`playlists/${playlistId}/follow`, {}, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            button.textContent = 'Unfollow';
            showToast('Đã theo dõi playlist!', 'success');
        }

        await fetchSidebarItems();
        renderLibrary('playlists');
    } catch (error) {
        console.error('Error toggling follow:', error);
        showToast('Lỗi khi theo dõi/bỏ theo dõi playlist!', 'error');
        if (error.status === 401) {
            showToast('Unauthorized: Vui lòng đăng nhập lại!', 'error');
        }
    }
}

async function setupFollowButton(playlistId) {
    if (!playlistId) {
        console.error('Error: playlistId is undefined in setupFollowButton');
        return;
    }
    playlistId = String(playlistId);
    const button = document.querySelector(`.follow-btn[data-playlist-id="${playlistId}"]`);

    if(!button)return

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

        button.addEventListener('click', () => toggleFollowPlaylist(playlistId, button));
    } catch (error) {
        //console.error('Error setting up follow button:', error);
        button.textContent = 'Follow';
        if (error.status === 401) {
            showToast('Token hết hạn, vui lòng đăng nhập lại!', 'error');
        }
    }
}

export { toggleFollowPlaylist, setupFollowButton };