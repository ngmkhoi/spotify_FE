import formatTime from "../utils/formatTime.js";
import setupTrackPlayEvents from "../setupEvents/setupTrackPlayEvents.js";
import { setupFollowButton } from "./toggleFollowPlaylist.js";
import { setCurrentTracks } from "../queue/trackState.js";
import showEditForm from "./showEditForm.js";
import {showDeleteConfirmModal} from "./deletePlaylist.js";
import setupTrackMenuEvents from "../setupEvents/setupTrackMenuEvents.js";

const BASE_URL = 'http://spotify.f8team.dev';

function renderPlaylistData(playlist, tracks) {
    const playlistHero = document.querySelector('.artist-hero');
    const popularTracksContainer = document.querySelector('.popular-section');

    setCurrentTracks(tracks);

    playlistHero.innerHTML = `
        <div class="hero-background">
            <img src="${playlist.image_url || 'https://chrt.org/wp-content/uploads/2023/03/shutterstock_2220431045-300x300.jpg'}" alt="${playlist.name}" class="hero-image" />
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            <h1 class="playlist-name">${playlist.name || 'Unknown Playlist'}</h1>
            <p class="playlist-description">Playlist by ${playlist.user_display_name || playlist.description || 'You'}</p>
            <p class="track-count">${tracks.length} tracks</p>
        </div>
    `;
    playlistHero.dataset.playlistId = playlist.id || '';

    const controls = document.querySelector('.artist-controls');
    const followButtonHTML = playlist.is_owner
        ? ''
        : `<button class="follow-btn" data-playlist-id="${playlist.id || ''}">${playlist.is_following ? 'Unfollow' : 'Follow'}</button>`;

    const deleteButtonHTML = playlist.is_owner
        ? `<button class="delete-playlist-btn" data-playlist-id="${playlist.id || ''}"><i class="fas fa-trash"></i> Xóa</button>`
        : '';
    
    controls.innerHTML = `
        <button class="play-btn-large">
            <i class="fas fa-play"></i>
        </button>
        ${followButtonHTML}
        ${deleteButtonHTML}
    `;

    if (playlist.is_owner) {
        const playlistName = playlistHero.querySelector('.playlist-name');
        const heroOverlay = playlistHero.querySelector('.hero-overlay');
        const deleteBtn = controls.querySelector('.delete-playlist-btn');
        playlistName.addEventListener('click', () => showEditForm(playlist));
        heroOverlay.addEventListener('click', () => showEditForm(playlist));
        deleteBtn?.addEventListener('click', () => showDeleteConfirmModal(playlist.id));
        console.log('DEBUG: Edit listeners added for playlist:', playlist.id);
    }

    popularTracksContainer.innerHTML = '';
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.dataset.trackId = track.track_id || '';
        const formattedDuration = formatTime(track.track_duration);
        const imageUrl = track.track_image_url.startsWith('http') 
            ? track.track_image_url 
            : `${BASE_URL}${track.track_image_url}`;
        trackItem.innerHTML = `
            <div class="track-position">
                <span class="track-number">${index + 1}</span>
                <button class="track-play-btn">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="track-image">
                <img src="${imageUrl || './default-track.jpg'}" alt="${track.track_title}">
            </div>
            <div class="track-info">
                <h3 class="track-name">${track.track_title || 'Unknown Track'}</h3>
                <p class="track-artist">${track.artist_name || 'Unknown Artist'}</p>
            </div>
            <span class="track-plays">${track.track_play_count?.toLocaleString() || 0}</span>
            <span class="track-duration">${formattedDuration || '0:00'}</span>
            <button class="track-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        `;
        popularTracksContainer.appendChild(trackItem);
    });

    setupTrackPlayEvents();
    setupTrackMenuEvents();
    if (!playlist.is_owner) {
        console.log('DEBUG: Setting up follow button for playlist:', playlist.id);
        setupFollowButton(playlist.id);
    }
}

export default renderPlaylistData;