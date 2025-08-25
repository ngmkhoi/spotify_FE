import httpRequest from "../services/httpRequest.js";
import checkAuth from "../middlewares/checkAuth.js";
import showToast from "../utils/showToast.js";
import { setCurrentTracks } from "../queue/trackState.js";
import updatePlayerUI from "../player/updatePlayerUI.js";
import handlePlayPause from "../player/handlePlayPause.js";

const BASE_URL = 'http://spotify.f8team.dev';

async function addTracksToQueue(tracks) {
    const access_token = checkAuth();
    if (!access_token) {
        showToast('Vui lòng đăng nhập để play playlist!', 'error');
        return false;
    }

    try {
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            await httpRequest.post('me/player/queue', {
                track_id: track.track_id, // Dùng track_id
                position: i
            }, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
        }
        return true;
    } catch (error) {
        console.error('Lỗi add tracks to queue:', error);
        showToast('Không thể add tracks vào queue!', 'error');
        if (error.status === 404) {
            console.error('Endpoint không tồn tại:', error.url);
        }
        return false;
    }
}

function setupPlaylistPlayEvents() {
    const playBtnLarge = document.querySelector('.play-btn-large');
    if (!playBtnLarge) return;

    playBtnLarge.addEventListener('click', async () => {
        const tracks = window.currentTracks || [];
        if (tracks.length === 0) {
            showToast('Playlist rỗng, không thể play!', 'error');
            return;
        }

        const added = await addTracksToQueue(tracks);
        if (added) {
            const firstTrack = tracks[0];
            const imageUrl = firstTrack.track_image_url.startsWith('http') 
                ? firstTrack.track_image_url 
                : `${BASE_URL}${firstTrack.track_image_url}`;
            setCurrentTracks({
                id: firstTrack.track_id,
                title: firstTrack.track_title,
                artist: firstTrack.artist_name,
                audio_url: firstTrack.track_audio_url,
                image_url: imageUrl
            });
            updatePlayerUI();
            handlePlayPause();
            showToast('Đã add playlist vào queue và play!', 'success');
        }
    });
}

export default setupPlaylistPlayEvents;