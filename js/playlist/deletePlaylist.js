import checkAuth from "../middlewares/checkAuth.js";
import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";
import fetchSidebarItems from "../sidebar/fetchSidebarItems.js";
import { renderLibrary } from "../sidebar/renderLibrary.js";

async function showDeleteConfirmModal(playlistId) {
    const modal = document.createElement('div');
    modal.className = 'delete-playlist-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Xóa playlist?</h2>
            <p>Bạn có chắc muốn xóa playlist này? Hành động này không thể hoàn tác.</p>
            <div class="form-actions">
                <button class="confirm-delete-btn">Xóa</button>
                <button class="cancel-btn">Hủy</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const confirmBtn = modal.querySelector('.confirm-delete-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    confirmBtn.addEventListener('click', async () => {
        await deletePlaylist(playlistId);
        modal.remove();
    });

    cancelBtn.addEventListener('click', () => modal.remove());
}

async function deletePlaylist(playlistId) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập lại!', 'error');
        return;
    }

    try {
        console.log('DEBUG: Sending DELETE /playlists:', playlistId);
        await httpRequest.delete(`playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        console.log('DEBUG: Playlist deleted successfully');

        showToast('Xóa playlist thành công!', 'success');

        await fetchSidebarItems();
        renderLibrary('playlists');

        window.location.hash = '#library';
    } catch (error) {
        console.error('Lỗi khi xóa playlist:', error);
        showToast('Không thể xóa playlist! Vui lòng thử lại.', 'error');
        if (error.status === 401) {
            showToast('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.', 'error');
        } else if (error.status === 403) {
            showToast('Bạn không có quyền xóa playlist này!', 'error');
        } else if (error.status === 404) {
            showToast('Playlist không tồn tại!', 'error');
        }
    }
}

export { showDeleteConfirmModal ,deletePlaylist};
//