function renderBiggestHits(tracks) {
    const biggestHitsContainer = document.querySelector(".hits-grid");
    biggestHitsContainer.innerHTML = '';
    if (tracks.length === 0) {
        biggestHitsContainer.innerHTML = '<p class="no-data">Không có dữ liệu tracks!</p>';
        return;
    }
    tracks.forEach(track => {
        const hitItem = document.createElement('div');
        hitItem.className = 'hit-card';
        hitItem.dataset.trackId = track.id;
        const hitCardCover = document.createElement('div');
        hitCardCover.className = 'hit-card-cover';
        const img = document.createElement('img');
        img.src = track.image_url;
        img.alt = track.title;
        hitCardCover.appendChild(img);
        const playButton = document.createElement('button');
        playButton.className = 'hit-play-btn';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        hitCardCover.appendChild(playButton);
        const hitCardInfo = document.createElement('div');
        hitCardInfo.className = 'hit-card-info';
        const hitCardTitle = document.createElement('h3');
        hitCardTitle.className = 'hit-card-title';
        hitCardTitle.textContent = track.title || 'Unknown Track';
        const hitCardArtist = document.createElement('p');
        hitCardArtist.className = 'hit-card-artist';
        hitCardArtist.textContent = track.artist_name || 'Unknown Artist';
        hitCardInfo.appendChild(hitCardTitle);
        hitCardInfo.appendChild(hitCardArtist);
        hitItem.appendChild(hitCardCover);
        hitItem.appendChild(hitCardInfo);
        biggestHitsContainer.appendChild(hitItem);
    });
}

export default renderBiggestHits;