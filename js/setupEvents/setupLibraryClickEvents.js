import fetchPlaylistData from "../playlist/fetchPlaylistData.js";
import renderPlaylistData from "../playlist/renderPlaylistData.js";
import fetchArtistData from "../artist/fetchArtistData.js";
import renderArtistData from "../artist/renderArtistData.js";
import toggleView from "../utils/toggleView.js";


function setupLibraryClickEvents() {
    const libraryItems = document.querySelectorAll('.library-item');
    libraryItems.forEach(item => {
        item.addEventListener('click', async () => {
            const id = item.dataset.id;
            const currentType = document.querySelector('.nav-tab.active').textContent.toLowerCase();
            toggleView('artist');
            if (currentType === 'playlists') {
                const data = await fetchPlaylistData(id);
                if (data) {
                    renderPlaylistData(data.playlist, data.tracks);
                }
            } else if (currentType === 'artists') {
                const data = await fetchArtistData(id);
                if (data) {
                    renderArtistData(data.artist, data.tracks);
                }
            }
        });
    });
}

export default setupLibraryClickEvents;