import checkVerified from "./checkVerified.js";
import setupTrackPlayEvents from "../setupEvents/setupTrackPlayEvents.js";
import {setCurrentTracks} from "../queue/trackState.js";
import { setupFollowButton } from "./toggleFollowArtists.js";
import setupTrackMenuEvents from "../setupEvents/setupTrackMenuEvents.js";

function renderArtistData(artist, tracks) {
    const artistHero = document.querySelector('.artist-hero');
    const popularTracksContainer = document.querySelector('.popular-section');

    if (tracks.length === 0) {
        popularTracksContainer.innerHTML = '<p class="no-data">Không có dữ liệu tracks!</p>';
    }

    setCurrentTracks(tracks); // Set currentTracks in shared module
    artistHero.innerHTML = `
        <div class="hero-background">
            <img
                src="${artist.background_image_url || './default-artist.jpg'}"
                alt="${artist.name || 'Unknown Artist'}"
                class="hero-image"
            />
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            <h1 class="artist-name">${artist.name || 'Unknown Artist'}</h1>
            ${checkVerified(artist.is_verified)}
            <p class="monthly-listeners">${artist.monthly_listeners?.toLocaleString() || 0} monthly listeners</p>
        </div>
    `;
    artistHero.dataset.artistId = artist.id || '';
    artistHero.dataset.firstTrackId = tracks[0]?.id || '';

    const artistControls = document.querySelector('.artist-controls');
    artistControls.innerHTML = `
        <button class="play-btn-large">
            <i class="fas fa-play"></i>
        </button>
        <button class="follow-btn" data-artist-id="${artist.id || ''}">Follow</button>
    `;

    popularTracksContainer.innerHTML = '';
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.dataset.trackId = track.id || '';
        const minutes = Math.floor(track.duration / 60);
        const seconds = track.duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        trackItem.innerHTML = `
            <div class="track-position">
                <span class="track-number">${index + 1}</span>
                <button class="track-play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="track-image">
                <img src="${track.image_url || './default-track.jpg'}" alt="${track.title || 'Unknown Track'}">
            </div>
            <div class="track-info">
                <h3 class="track-name">${track.title || 'Unknown Track'}</h3>
                <p class="track-artist">${track.artist_name || 'Unknown Artist'}</p>
            </div>
            <span class="track-plays">${track.play_count?.toLocaleString() || 0}</span>
            <span class="track-duration">${formattedDuration || '0:00'}</span>
            <button class="track-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        `;
        popularTracksContainer.appendChild(trackItem);
    });
    setupTrackMenuEvents();
    setupTrackPlayEvents();
    setupFollowButton(artist.id);
}

export default renderArtistData;