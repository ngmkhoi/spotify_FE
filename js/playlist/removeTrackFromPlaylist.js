import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";
import checkAuth from "../middlewares/checkAuth.js";
import fetchSidebarItems from "../sidebar/fetchSidebarItems.js";
import { renderLibrary } from "../sidebar/renderLibrary.js";
import fetchPlaylistData from "../playlist/fetchPlaylistData.js";
import renderPlaylistData from "../playlist/renderPlaylistData.js";

async function removeTrackFromPlaylist(trackId, playlistId) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để xóa track!', 'error');
        return;
    }

    try {
        await httpRequest.delete(`playlists/${playlistId}/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        showToast('Đã xóa track khỏi playlist!', 'success');
    } catch (error) {
        console.error('Lỗi khi xóa track:', error);
        showToast('Không thể xóa track! Vui lòng thử lại.', 'error');
        if (error.status === 401) {
            showToast('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.', 'error');
        } else if (error.status === 403) {
            showToast('Bạn không có quyền xóa track khỏi playlist này!', 'error');
        } else if (error.status === 404) {
            showToast('Track hoặc playlist không tồn tại!', 'error');
        }
    }
}

async function showRemoveTrackConfirmModal(trackId, playlistId, trackTitle) {
    const modal = document.createElement('div');
    modal.className = 'remove-track-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Xóa bài hát?</h2>
            <p>Bạn có chắc muốn xóa "${trackTitle}" khỏi playlist? Hành động này không thể hoàn tác.</p>
            <div class="form-actions">
                <button class="confirm-remove-btn">Xóa</button>
                <button class="cancel-btn">Hủy</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const confirmBtn = modal.querySelector('.confirm-remove-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    confirmBtn.addEventListener('click', async () => {
        await removeTrackFromPlaylist(trackId, playlistId);
        // Refresh danh sách track
        const updatedData = await fetchPlaylistData(playlistId);
        if (updatedData) {
            renderPlaylistData(updatedData.playlist, updatedData.tracks);
        } else {
            showToast('Không thể làm mới danh sách track!', 'error');
        }
        // Refresh sidebar
        await fetchSidebarItems();
        renderLibrary('playlists');
        // Đóng modal
        modal.remove();
        // Đóng menu dropdown
        const menu = document.querySelector('.track-menu');
        if (menu) {
            menu.remove();
        }
    });

    cancelBtn.addEventListener('click', () => {
        modal.remove();
        // Đóng menu dropdown khi hủy
        const menu = document.querySelector('.track-menu');
        if (menu) {
            menu.remove();
        }
    });
}

export  {removeTrackFromPlaylist, showRemoveTrackConfirmModal};
