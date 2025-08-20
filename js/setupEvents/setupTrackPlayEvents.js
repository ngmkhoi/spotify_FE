import  checkAuth  from "../auth/checkAuth.js";
import  handlePlayTrack  from "../player/handlePlayTrack.js";
import  addToQueue  from "../queue/addToQueue.js";
import  showToast  from "../utils/showToast.js";
import  {getCurrentTracks}  from "../queue/trackState.js";

function setupTrackPlayEvents() {
    const hitPlayButtons = document.querySelectorAll('.hit-play-btn');
    const trackPlayButtons = document.querySelectorAll('.track-play-btn');
    const artistPlayBtn = document.querySelector('.play-btn-large');

    hitPlayButtons.forEach(button => {
        const hitCard = button.closest('.hit-card');
        const trackId = hitCard.dataset.trackId || '';
        button.addEventListener('click', () => {
            handlePlayTrack(trackId);
        });
    });

    trackPlayButtons.forEach(button => {
        const trackItem = button.closest('.track-item');
        const trackId = trackItem.dataset.trackId || '';
        button.addEventListener('click', () => {
            handlePlayTrack(trackId);
        });
    });

    artistPlayBtn?.addEventListener('click', async () => {
        const access_token = checkAuth();
        if (!access_token) return;

        const currentTracks = getCurrentTracks();
        if (currentTracks.length === 0) {
            showToast('Không có tracks để phát!', 'error');
            return;
        }

        const firstTrackId = currentTracks[0].id;
        await handlePlayTrack(firstTrackId);

        const remainingTracks = currentTracks.slice(1);
        for (const track of remainingTracks) {
            await addToQueue(track.id);
        }

        showToast('Đang phát playlist của artist!', 'success');
    });
}

export default setupTrackPlayEvents;