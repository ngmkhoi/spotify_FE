import checkAuth from "../middlewares/checkAuth.js";
import showToast from "../utils/showToast.js";
import httpRequest from '../services/httpRequest.js';
import fetchSidebarItems from "../sidebar/fetchSidebarItems.js";
import { renderLibrary } from "../sidebar/renderLibrary.js";


async function createPlaylist(){
    const access_token = checkAuth();
    if (!access_token) return;

    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser){
        showToast('Vui lòng đăng nhập để tạo playlist!', 'error');
        return;
    }

    const defaultName = `Playlist của ${currentUser.display_name}`;
    try {
        const myPlaylistsResponse = await httpRequest.get('me/playlists', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const playlists = myPlaylistsResponse.playlists || [];


        // Kiểm tra trùng tên
        const matchingPlaylists = playlists.filter(pl => pl.name.startsWith(defaultName));
        const newName = matchingPlaylists.length > 0 
            ? `${defaultName} #${matchingPlaylists.length + 1}`
            : defaultName;

        // Tạo playlist mới
        await httpRequest.post('playlists', {
            name: newName,
            description: '',
            is_public: true  // Có thể đổi thành false nếu muốn private
        }, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        // Cập nhật sidebar
        await fetchSidebarItems();
        renderLibrary('playlists');
        showToast('Tạo playlist thành công!', 'success');
    } catch (error) {
        console.error('Lỗi khi tạo playlist:', error);
        showToast('Không thể tạo playlist! Vui lòng thử lại.', 'error');
        if (error.status === 401) {
            showToast('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.', 'error');
        }
    }
}

export default createPlaylist;