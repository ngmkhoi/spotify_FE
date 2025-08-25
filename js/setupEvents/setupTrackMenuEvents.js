import getUserPlaylists from "../playlist/getUserPlaylist.js";
import addTrackToPlaylist from "../playlist/addTrackToPlaylist.js"; 
import showToast from "../utils/showToast.js";
import fetchPlaylistData from "../playlist/fetchPlaylistData.js";
import { showRemoveTrackConfirmModal } from "../playlist/removeTrackFromPlaylist.js";


function setupTrackMenuEvents() {
    getUserPlaylists()
    const menuButtons = document.querySelectorAll('.track-menu-btn');
    menuButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const trackItem = e.target.closest('.track-item');
            const trackId = trackItem.dataset.trackId;
            const trackTitle = trackItem.querySelector('.track-name').textContent;
            const playlistId = document.querySelector('.artist-hero').dataset.playlistId;

            // console.log(playlistId);
            
            // if(!playlistId){
            //     showToast('Không tìm thấy playlist!', 'error');
            //     return;
            // }

            // Lấy thông tin playlist để kiểm tra is_owner
            const { playlist } = await fetchPlaylistData(playlistId);
            if (!playlist) {
                showToast('Không thể tải thông tin playlist!', 'error');
                return;
            }

            // Tạo menu dropdown
            const menu = document.createElement('div');
            menu.className = 'track-menu';
            let html = `
                <ul>
                    <li><button class="add-to-playlist-btn">Thêm vào playlist</button></li>
                    ${playlist.is_owner ? `<li><button class="remove-from-playlist-btn">Xóa khỏi playlist</button></li>` : ''}
                </ul>
            `;
            menu.innerHTML = html;
            document.body.appendChild(menu);

            // Định vị menu gần button
            const rect = button.getBoundingClientRect();
            menu.style.position = 'absolute';
            menu.style.top = `${rect.bottom + window.scrollY}px`;
            menu.style.left = `${rect.left}px`;

            // Thêm vào playlist
            const addBtn = menu.querySelector('.add-to-playlist-btn');
            addBtn.addEventListener('click', async () => {
                const playlists = await getUserPlaylists();
                if (playlists.length === 0) {
                    showToast('Bạn chưa có playlist nào để thêm!', 'info');
                    menu.remove();
                    return;
                }

                const addModal = document.createElement('div');
                addModal.className = 'add-to-playlist-modal';
                addModal.innerHTML = `
                    <div class="modal-content">
                        <h2>Thêm vào playlist</h2>
                        <ul class="playlist-list">
                            ${playlists.map(pl => `
                                <li>
                                    <button data-playlist-id="${pl.id}">${pl.name}</button>
                                </li>
                            `).join('')}
                        </ul>
                        <button class="cancel-btn">Hủy</button>
                    </div>
                `;
                document.body.appendChild(addModal);

                addModal.querySelectorAll('button[data-playlist-id]').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const playlistId = btn.dataset.playlistId;
                        await addTrackToPlaylist(trackId, playlistId);
                        addModal.remove();
                        menu.remove();
                    });
                });

                addModal.querySelector('.cancel-btn').addEventListener('click', () => {
                    addModal.remove();
                    menu.remove();
                });
            });

            // Xóa khỏi playlist
            if (playlist.is_owner) {
                const removeBtn = menu.querySelector('.remove-from-playlist-btn');
                removeBtn.addEventListener('click', () => {
                    showRemoveTrackConfirmModal(trackId, playlistId, trackTitle);
                    menu.remove();
                });
            }

            // Đóng menu khi click ra ngoài
            document.addEventListener('click', function closeMenu(event) {
                if (!menu.contains(event.target) && event.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            }, { once: true });
        });
    });
}

export default setupTrackMenuEvents;