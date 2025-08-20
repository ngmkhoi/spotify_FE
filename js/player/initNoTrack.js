function initNoTrack() {
    const player = document.querySelector('.player');
    const playerTitle = document.querySelector('.player-title');
    const playerArtist = document.querySelector('.player-artist');
    const playerImage = document.querySelector('.player-image');
    const progressContainer = document.querySelector('.progress-container');
    const controlButtons = document.querySelectorAll('.player-controls .control-btn');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const currentTimeEl = document.querySelector('.time:first-child');
    const totalTimeEl = document.querySelector('.time:last-child');
    const audio = document.getElementById('audio-player');

    playerTitle.textContent = 'Chưa có bài hát được chọn';
    playerArtist.textContent = '';
    playerImage.style.display = 'none';
    progressContainer.style.opacity = '0.5';
    progressContainer.style.pointerEvents = 'none';
    controlButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
    });
    player.classList.add('no-track');
    audio.src = '';
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = '0:00';
}

export default initNoTrack;