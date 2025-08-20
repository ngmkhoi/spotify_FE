function updatePlayerUI() {
    const audio = document.getElementById('audio-player');
    const playBtn = document.querySelector('.control-btn.play-btn');
    if (audio.src) {
        playBtn.innerHTML = audio.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

export default updatePlayerUI;