import httpRequest from "../utils/httpRequest.js";
import checkAuth from "../auth/checkAuth.js";
import showToast from "../utils/showToast.js";

async function handlePlayTrack(trackId) {
    const access_token = checkAuth();
    if (!access_token) return;

    const audio = document.getElementById('audio-player');
    const player = document.querySelector('.player');
    const playerImage = document.querySelector('.player-image');
    const progressContainer = document.querySelector('.progress-container');
    const controlButtons = document.querySelectorAll('.player-controls .control-btn');
    const playerTitle = document.querySelector('.player-title');
    const playerArtist = document.querySelector('.player-artist');

    try {
        const response = await httpRequest.post(`tracks/${trackId}/play`, {}, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const track = response.track || {};
        if (track.id && track.audio_url) {
            player.classList.remove('no-track');
            playerImage.style.display = 'block';
            progressContainer.style.opacity = '1';
            progressContainer.style.pointerEvents = 'auto';
            controlButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });

            playerTitle.textContent = track.title || 'Unknown Track';
            playerArtist.textContent = track.artist_name || 'Unknown Artist';
            playerImage.src = track.image_url || './default-track.jpg';
            audio.src = track.audio_url;
            await audio.play();
            document.querySelector('.control-btn.play-btn').innerHTML = '<i class="fas fa-pause"></i>';
            showToast(`Đang phát: ${track.title}`, 'success');
        } else {
            showToast('Không có thông tin bài hát hoặc audio_url!', 'error');
        }
    } catch (error) {
        console.error('Lỗi khi phát bài hát:', error.message);
        showToast('Không thể phát bài hát!', 'error');
    }
}

export default handlePlayTrack;