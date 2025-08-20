import checkAuth from "../middlewares/checkAuth.js";
import showToast from "../utils/showToast.js";

async function handlePlayPause() {
    const access_token = checkAuth();
    if (!access_token) return;

    const audio = document.getElementById('audio-player');

    if (!audio.src) {
        showToast('Vui lòng chọn một bài hát để phát!', 'error');
        return;
    }

    try {
        if (audio.paused) {
            await audio.play();
            document.querySelector('.control-btn.play-btn').innerHTML = '<i class="fas fa-pause"></i>';
            showToast('Đang phát bài hát!', 'success');
        } else {
            audio.pause();
            document.querySelector('.control-btn.play-btn').innerHTML = '<i class="fas fa-play"></i>';
            showToast('Đã tạm dừng bài hát!', 'success');
        }
    } catch (error) {
        console.error('Lỗi khi play/pause:', error.message);
        showToast('Không thể thực hiện hành động play/pause!', 'error');
    }
}

export default handlePlayPause;