import toggleView from "../utils/toggleView.js";

function setupHomeClickEvents() {
    const homeBtn = document.querySelector('.home-btn');
    const spotifyLogo = document.querySelector('.logo');

    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            console.log('đã click home');
            toggleView('home');
        });
    } else {
        console.error('Home button not found');
    }

    if (spotifyLogo) {
        spotifyLogo.addEventListener('click', () => {
            console.log('đã click logo');
            toggleView('home');
        });
    } else {
        console.error('Spotify logo not found');
    }
}

export default setupHomeClickEvents;