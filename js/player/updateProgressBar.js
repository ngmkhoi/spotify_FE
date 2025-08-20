import formatTime from "../utils/formatTime.js";


function updateProgressBar() {
    const audio = document.getElementById('audio-player');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const currentTimeEl = document.querySelector('.time:first-child');
    if (!audio.src || audio.src === '') {
        return;
    }
    if (audio.duration > 0) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressHandle.style.left = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

export default updateProgressBar;