import checkAuth from "../middlewares/checkAuth.js";
import httpRequest from "../services/httpRequest.js";
import fetchSidebarItems, { followedArtistsPlaylist } from "../sidebar/fetchSidebarItems.js";
import showToast from "../utils/showToast.js";
import { renderLibrary } from "../sidebar/renderLibrary.js";


async function toggleFollowArtist(artistId, button) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để theo dõi artist!', 'error');
        return;
    }

    artistId = String(artistId);
    console.log('Toggling follow for artist:', artistId);
    console.log('Access token:', access_token);

    try {
        // Kiểm tra trạng thái follow với auth (thêm header để fix đồng bộ và 401)
        const artistData = await httpRequest.get(`artists/${artistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const isFollowed = artistData.is_following;
        console.log('isFollowed from API:', isFollowed);

        if (isFollowed) {
            const response = await httpRequest.delete(`artists/${artistId}/follow`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            console.log('Unfollow API response:', response);
            button.textContent = 'Follow';
            showToast('Đã bỏ theo dõi artist!', 'success');
        } else {
            const response = await httpRequest.post(`artists/${artistId}/follow`, {}, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            console.log('Follow API response:', response);
            button.textContent = 'Unfollow';
            showToast('Đã theo dõi artist!', 'success');
        }

        // Update sidebar sau toggle
        await fetchSidebarItems(); // Thêm () và await để chờ update data
        console.log('Updated followedArtists:', followedArtistsPlaylist);
        renderLibrary('artists'); // Chỉ render artists để sidebar update
    } catch (error) {
        console.error('Error toggling follow:', error);
        showToast('Lỗi khi theo dõi/bỏ theo dõi artist!', 'error');
        if (error.status === 401) {
            showToast('Unauthorized: Vui lòng đăng nhập lại!', 'error');
        }
    }
}

async function setupFollowButton(artistId) {
    if (!artistId) {
        console.error('Error: artistId is undefined in setupFollowButton');
        return;
    }
    artistId = String(artistId);
    const button = document.querySelector(`.follow-btn[data-artist-id="${artistId}"]`);
    if (!button) {
        console.warn('Follow button not found for artist:', artistId);
        return;
    }

    try {
        const access_token = checkAuth(); // Lấy token từ middleware
        if (!access_token) {
            button.textContent = 'Follow'; // Default nếu chưa login
            return;
        }

        // Lấy trạng thái ban đầu từ API với auth (đã có trong code cũ, giữ nguyên)
        const artistData = await httpRequest.get(`artists/${artistId}`, {
            headers: { Authorization: `Bearer ${access_token}` } // Sửa để dùng access_token
        });
        const isFollowed = artistData.is_following || false;
        button.textContent = isFollowed ? 'Unfollow' : 'Follow';
        console.log('Follow button setup for artist:', artistId, 'isFollowed:', isFollowed);
    } catch (error) {
        console.error('Error setting up follow button:', error);
        button.textContent = 'Follow'; // Default nếu lỗi
        if (error.status === 401) {
            showToast('Token hết hạn, vui lòng đăng nhập lại!', 'error');
            // Có thể redirect login ở đây
        }
    }

    button.addEventListener('click', () => toggleFollowArtist(artistId, button));
}

export { setupFollowButton };

