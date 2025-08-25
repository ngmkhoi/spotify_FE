import  getUserPlaylists  from "../playlist/getUserPlaylist.js";
import  addTrackToPlaylist  from "../playlist/addTrackToPlaylist.js";
import showToast from "../utils/showToast.js";

function setupPlayerAddEvent() {
    const addBtn = document.querySelector('.player-left .add-btn');
    if (!addBtn) {
        console.warn('Không tìm thấy .add-btn trong .player-left');
        return;
    }

    addBtn.addEventListener('click', async () => {
        const playerLeft = document.querySelector('.player-left');
        const trackId = playerLeft.dataset.trackId;
        if (!trackId) {
            showToast('Không có track đang phát!', 'error');
            return;
        }

        const playlists = await getUserPlaylists();
        if (playlists.length === 0) {
            showToast('Bạn chưa có playlist nào để thêm!', 'info');
            return;
        }

        // Tạo modal
        const modal = document.createElement('div');
        modal.className = 'add-to-playlist-modal';
        let html = `
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
        modal.innerHTML = html;
        document.body.appendChild(modal);

        // Event cho các button playlist
        modal.querySelectorAll('button[data-playlist-id]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const playlistId = btn.dataset.playlistId;
                await addTrackToPlaylist(trackId, playlistId);
                modal.remove();
            });
        });

        // Event hủy
        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
    });
}

export default setupPlayerAddEvent;