function renderPopularArtists(artists) {
    const popularArtistsContainer = document.querySelector(".artists-grid");
    popularArtistsContainer.innerHTML = '';
    if (artists.length === 0) {
        popularArtistsContainer.innerHTML = '<p class="no-data">Không có dữ liệu artists!</p>';
        return;
    }
    artists.forEach(artist => {
        const artistCard = document.createElement('div');
        artistCard.className = 'artist-card';
        artistCard.dataset.artistId = artist.id || 'default-artist-id';
        const artistCardCover = document.createElement('div');
        artistCardCover.className = 'artist-card-cover';
        const img = document.createElement('img');
        img.src = artist.image_url;
        img.alt = artist.name || 'Unknown Artist';
        artistCardCover.appendChild(img);
        const playButton = document.createElement('button');
        playButton.className = 'artist-play-btn';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        artistCardCover.appendChild(playButton);
        const artistCardInfo = document.createElement('div');
        artistCardInfo.className = 'artist-card-info';
        const artistCardName = document.createElement('h3');
        artistCardName.className = 'artist-card-name';
        artistCardName.textContent = artist.name || 'Unknown Artist';
        const artistCardType = document.createElement('p');
        artistCardType.className = 'artist-card-type';
        artistCardType.textContent = artist.type || 'Artist';
        artistCardInfo.appendChild(artistCardName);
        artistCardInfo.appendChild(artistCardType);
        artistCard.appendChild(artistCardCover);
        artistCard.appendChild(artistCardInfo);
        popularArtistsContainer.appendChild(artistCard);
    });
}

export default renderPopularArtists;