import toggleView from "../utils/toggleView.js";
import fetchArtistData from "../playlist/fetchArtistData.js";
import renderArtistData from "../playlist/renderArtistData.js";

function setupArtistClickEvents() {
    const artistCards = document.querySelectorAll('.artist-card');
    console.log('Setting up artist click events:', artistCards);
    artistCards.forEach(card => {
        const artistId = card.dataset.artistId || 'default-artist-id';
        card.addEventListener('click', async () => {
            console.log('Clicked artist, toggling to artist view:', artistId);
            toggleView('artist');
            const data = await fetchArtistData(artistId);
            if (data) {
                renderArtistData(data.artist, data.tracks);
            }
        });
    });
}

export default setupArtistClickEvents;