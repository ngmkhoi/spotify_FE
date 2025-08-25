import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";
import checkAuth from "../middlewares/checkAuth.js";
import fetchPlaylistData from "./fetchPlaylistData.js";
import renderPlaylistData from "./renderPlaylistData.js";
import fetchSidebarItems from "../sidebar/fetchSidebarItems.js";
import { renderLibrary } from "../sidebar/renderLibrary.js";


async function showEditForm(playlist) {
    const modal = document.createElement('div');
    modal.className = 'edit-playlist-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Chỉnh sửa playlist</h2>
            <form id="editPlaylistForm">
                <div class="form-group">
                    <label for="editName">Tên playlist</label>
                    <input type="text" id="editName" value="${playlist.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editDesc">Mô tả</label>
                    <textarea id="editDesc">${playlist.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editImage">Ảnh playlist</label>
                    <input type="file" id="editImage" accept="image/jpeg,image/png">
                </div>
                <div class="form-actions">
                    <button type="submit">Lưu</button>
                    <button type="button" class="cancel-btn">Hủy</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const form = modal.querySelector('#editPlaylistForm');
    const cancelBtn = modal.querySelector('.cancel-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('editName').value;
        const newDesc = document.getElementById('editDesc').value;
        const newImage = document.getElementById('editImage').files[0];

        // Kiểm tra nếu người dùng cố upload ảnh nhưng không chọn file
        if (!newName) {
            showToast('Tên playlist không được để trống!', 'error');
            return;
        }

        // Validation cho ảnh
        if (newImage) {
            const validTypes = ['image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (!validTypes.includes(newImage.type)) {
                showToast('Chỉ hỗ trợ định dạng JPG hoặc PNG!', 'error');
                return;
            }
            if (newImage.size > maxSize) {
                showToast('Kích thước ảnh không được vượt quá 5MB!', 'error');
                return;
            }
        }

        try {
            const access_token = checkAuth();
            if (!access_token) {
                showToast('Vui lòng đăng nhập lại!', 'error');
                modal.remove();
                return;
            }

            // console.log('DEBUG: Submitting update for playlist:', playlist.id);
            // console.log('DEBUG: New data:', { name: newName, description: newDesc, hasImage: !!newImage });
            // if (newImage) {
            //     console.log('DEBUG: File selected:', newImage.name, newImage.size, newImage.type);
            // }

            let imageUrl = playlist.image_url;
            if (newImage) {
                const formData = new FormData();
                formData.append('cover', newImage); 
                //console.log('DEBUG: Sending POST /api/upload/playlist/cover');
                const uploadResponse = await httpRequest.post(`upload/playlist/${playlist.id}/cover`, formData, {
                    headers: { Authorization: `Bearer ${access_token}` }
                });
                //console.log('DEBUG: Upload response:', uploadResponse);
                if (!uploadResponse.file?.url) {
                    throw new Error('No file URL returned from upload API');
                }
                imageUrl = uploadResponse.file.url;
            }

            const data = { name: newName, description: newDesc, image_url: imageUrl };
            //console.log('DEBUG: Sending PUT /playlists with data:', data);
            const response = await httpRequest.put(`playlists/${playlist.id}`, data, {
                headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' }
            });
            //console.log('DEBUG: PUT response:', response);

            showToast('Cập nhật playlist thành công!', 'success');

            // Fetch lại dữ liệu playlist và refresh UI
            const updatedData = await fetchPlaylistData(playlist.id);
            if (updatedData) {
                renderPlaylistData(updatedData.playlist, updatedData.tracks);
            }

            // Cập nhật sidebar
            await fetchSidebarItems();
            renderLibrary('playlists');

            modal.remove();
        } catch (error) {
            console.error('Lỗi khi cập nhật playlist:', error);
            showToast('Không thể cập nhật playlist! Vui lòng thử lại.', 'error');
            if (error.status === 401) {
                showToast('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.', 'error');
            } else if (error.status === 400 && error.response?.error?.code === 'NO_FILE_UPLOADED') {
                showToast('Vui lòng chọn một file ảnh hợp lệ!', 'error');
            } else if (error.status === 400) {
                showToast('Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.', 'error');
            } else if (error.status === 415) {
                showToast('API không hỗ trợ định dạng ảnh này!', 'error');
            }
        }
    });

    cancelBtn.addEventListener('click', () => modal.remove());
}

export default showEditForm;