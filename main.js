import httpRequest from "./utils/httpRequest.js";
import { validateSignup, validateEmail, validateField } from './utils/validation.js';

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");
    const authButtons = document.querySelector('.auth-buttons');
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const userGreeting = document.getElementById("userGreeting");

    const signupFormElement = signupForm?.querySelector('.auth-form-content');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupConfirmPasswordInput = document.getElementById('signupConfirmPassword');
    const signupEmailFormGroup = signupEmailInput?.closest('.form-group');
    const signupPasswordFormGroup = signupPasswordInput?.closest('.form-group');
    const signupConfirmPasswordFormGroup = signupConfirmPasswordInput?.closest('.form-group');

    const loginFormElement = loginForm?.querySelector('.auth-form-content');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginEmailFormGroup = loginEmailInput?.closest('.form-group');
    const loginPasswordFormGroup = loginPasswordInput?.closest('.form-group');

    const audio = document.getElementById('audio-player');
    const playBtn = document.querySelector('.control-btn.play-btn');

    // Function to sanitize input
    function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    
    // Function to show Toast message
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
            background: ${type === 'success' ? '#1db954' : '#f87171'};
            color: white; border-radius: 8px; z-index: 100;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Function to update header UI
    async function updateHeader() {
    const token = localStorage.getItem('access_token');
    let user = JSON.parse(localStorage.getItem('current_user')); // Kiểm tra user trong localStorage trước

    if (token && !user) {
        try {
            const response = await httpRequest.get('users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            user = response.user || response;
            // Sanitize trước khi lưu
            user.email = sanitizeInput(user.email || 'User');
            user.avatar_url = sanitizeInput(user.avatar_url || './icon/person-circle.svg');
            localStorage.setItem('current_user', JSON.stringify(user));
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error.message);
            localStorage.removeItem('current_user');
        }
    }

    if (token && user) {
        const displayName = sanitizeInput(user.email || 'User');
        const avatarUrl = sanitizeInput(user.avatar_url || './icon/person-circle.svg');

        authButtons.style.display = 'none';
        userAvatar.style.display = 'block';

        // Tạo img thay vì innerHTML
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = displayName;
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.borderRadius = '50%';
        userAvatar.innerHTML = '';
        userAvatar.appendChild(img);

        userAvatar.title = `Xin chào ${displayName}`;
            if (userGreeting) {
                userGreeting.textContent = `Xin chào ${displayName}`;
                userGreeting.classList.remove('hidden');
            }
        } else {
            authButtons.style.display = 'flex';
            userAvatar.style.display = 'none';
            if (userGreeting) userGreeting.classList.add('hidden');
        }
    }

    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto";
    }

    //Clear forms
    function clearForm(formElement) {
        // Xóa giá trị các input
        const inputs = formElement.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });

        // Xóa trạng thái lỗi
        const formGroups = formElement.querySelectorAll('.form-group');
        formGroups.forEach(formGroup => {
            formGroup.classList.remove('invalid');
            const errorSpan = formGroup.querySelector('.error-message span');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
    }

    // Open modal with Sign Up form
    signupBtn?.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form
    loginBtn?.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Close modal when clicking close button
    modalClose?.addEventListener("click", closeModal);

    // Close modal when clicking overlay
    authModal?.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal?.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn?.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn?.addEventListener("click", function () {
        showSignupForm();
    });

    // Signup Form Validation
    // Xóa class invalid ban đầu
    signupEmailFormGroup.classList.remove('invalid');
    signupPasswordFormGroup.classList.remove('invalid');
    signupConfirmPasswordFormGroup.classList.remove('invalid');

    // Validate thời gian thực khi blur
    signupEmailInput.addEventListener('blur', () => validateField(signupEmailInput, 'signup'));
    signupPasswordInput.addEventListener('blur', () => validateField(signupPasswordInput, 'signup'));
    signupConfirmPasswordInput.addEventListener('blur', () => validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value));

    // Xử lý submit signup
    signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isEmailValid = validateField(signupEmailInput, 'signup');
        const isPasswordValid = validateField(signupPasswordInput, 'signup');
        const isConfirmPasswordValid = validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value);

        if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        const credential = {
            email: signupEmailInput.value,
            password: signupPasswordInput.value,
        };

        try {
            const { user, access_token } = await httpRequest.post('auth/register', credential);
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('current_user', JSON.stringify(user));

            // Tự động đăng nhập
            const loginResponse = await httpRequest.post('auth/login', {
                email: credential.email,
                password: credential.password
            });
            
            localStorage.setItem('access_token', loginResponse.access_token);
            localStorage.setItem('current_user', JSON.stringify(loginResponse.user || user));

            // Cập nhật header UI
            await updateHeader();

            // Xóa form và trạng thái lỗi
            clearForm(signupFormElement);

            // Hiển thị Toast và đóng modal
            showToast('Đăng ký thành công!', 'success');
            closeModal();
        } catch (error) {
            const errorMessage = error.response?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            signupEmailFormGroup.classList.add('invalid');
            signupEmailFormGroup.querySelector('.error-message span').textContent = errorMessage;
        }
    });

    // Login Form Validation
    // Xóa class invalid ban đầu
    loginEmailFormGroup.classList.remove('invalid');
    loginPasswordFormGroup.classList.remove('invalid');

    // Validate thời gian thực khi blur
    loginEmailInput.addEventListener('blur', () => validateField(loginEmailInput, 'login'));
    loginPasswordInput.addEventListener('blur', () => validateField(loginPasswordInput, 'login'));

    // Xử lý submit login
    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isEmailValid = validateField(loginEmailInput, 'login');
        const isPasswordValid = validateField(loginPasswordInput, 'login');

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const credential = {
            email: loginEmailInput.value,
            password: loginPasswordInput.value
        };

        try{
            const loginResponse = await httpRequest.post('auth/login', credential);
            localStorage.setItem('access_token', loginResponse.access_token);

            const userRespone = await httpRequest.get('users/me', {
                headers: { Authorization: `Bearer ${loginResponse.access_token}` }
            })
            const user = userRespone.user || userRespone;
            localStorage.setItem('current_user', JSON.stringify(user));

            await updateHeader();

            // Xóa form và trạng thái lỗi
            clearForm(loginFormElement);

            showToast('Đăng nhập thành công!', 'success');
            
            closeModal();
        }catch (error) {
            const errorMessage = error.response?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        // Hiển thị lỗi cụ thể, giả sử API trả về message chứa 'email' hoặc 'password'
        if (errorMessage.toLowerCase().includes('email')) {
            loginEmailFormGroup.classList.add('invalid');
            loginEmailFormGroup.querySelector('.error-message span').textContent = 'Email không tồn tại';
        } else if (errorMessage.toLowerCase().includes('password')) {
            loginPasswordFormGroup.classList.add('invalid');
            loginPasswordFormGroup.querySelector('.error-message span').textContent = 'Mật khẩu không đúng';
        } else {
            // Lỗi chung, hiển thị ở cả hai
            loginEmailFormGroup.classList.add('invalid');
            loginPasswordFormGroup.classList.add('invalid');
            loginEmailFormGroup.querySelector('.error-message span').textContent = errorMessage;
        }
        }
    })

    // User Menu Dropdown Functionality
    userAvatar?.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
        if (!userAvatar?.contains(e.target) && !userDropdown?.contains(e.target)) {
            userDropdown.classList.remove("show");
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown?.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    //Logout Button Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", async function () {
        userDropdown.classList.remove("show");
        localStorage.clear();
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>'; 
        await updateHeader();
        showToast('Đăng xuất thành công!', 'success');
    });

    // Khởi tạo header
    updateHeader();
});

    // Artists & Songs Functionality
document.addEventListener("DOMContentLoaded", async function () {
    // Hàm showToast
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
            background: ${type === 'success' ? '#1db954' : '#f87171'};
            color: white; border-radius: 8px; z-index: 100;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Hàm kiểm tra trạng thái verified
    function checkVerified(isVerified) {
        if (isVerified) {
            return `<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Artist</span>`;
        }
        return '';
    }

    //Hàm kiểm tra đăng nhập
    function checkAuth(){
        const access_token = localStorage.getItem('access_token')
        const user = localStorage.getItem('current_user')
        if(!access_token || !user){
            showToast('Vui lòng đăng nhập để phát nhạc!', 'error');
            return false;
        }
        return access_token 
    }

    let currentView = 'home'; // Biến để theo dõi view hiện tại
    let currentTracks = []; // Biến để lưu trữ tracks hiện tại

    // Get DOM elements
    const biggestHitsContainer = document.querySelector(".hits-grid");
    const popularArtistsContainer = document.querySelector(".artists-grid");
    const homeView = document.getElementById("home-view");
    const detailView = document.getElementById("detail-view");
    const artistHero = document.querySelector('.artist-hero');
    const popularTracksContainer = document.querySelector('.popular-section');
    const homeBtn = document.querySelector('.home-btn');
    const spotifyLogo = document.querySelector('.logo');

    // Hàm toggleView để chuyển đổi giữa home và artist
    function toggleView(targetView) {
        if (currentView === targetView) return;
        if (targetView === 'home') {
            homeView.classList.remove('hidden');
            detailView.classList.add('hidden');
            currentView = 'home';
        } else if (targetView === 'artist') {
            homeView.classList.add('hidden');
            detailView.classList.remove('hidden');
            currentView = 'artist';
        }
    }

    // Fetch biggest hits
    async function fetchBiggestHits() {
        try {
            const response = await httpRequest.get('tracks/trending?limit=20');
            const tracks = response.tracks || [];
            if (tracks.length === 0) {
                showToast('Không có tracks trending nào!', 'error');
                return [];
            }
            return tracks;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu trending tracks:', error.message);
            showToast('Không thể tải Today’s biggest hits!', 'error');
            return [];
        }
    }

    // Render biggest hits
    function renderBiggestHits(tracks) {
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

    // Fetch artists
    async function fetchPopularArtists() {
        try {
            const response = await httpRequest.get('artists/trending?limit=20');
            const artists = response.artists || [];
            if (artists.length === 0) {
                showToast('Không có artists trending nào!', 'error');
                return [];
            }
            return artists;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu artists:', error.message);
            showToast('Không thể tải Popular artists!', 'error');
            return [];
        }
    }

    // Render artists
    function renderPopularArtists(artists) {
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

    async function fetchArtistData(artistId) {
        try {
            // Lấy thông tin artist
            const artistResponse = await httpRequest.get(`artists/${artistId}`);
            const artist = artistResponse || {};
            console.log('Artist data:', artist);

            // Lấy tracks phổ biến của artist
            const tracksResponse = await httpRequest.get(`artists/${artistId}/tracks/popular?limit=10`);
            const tracks = tracksResponse.tracks || [];
            console.log('Tracks data:', tracks);

            if (!artist|| tracks.length === 0) {
                showToast('Không tìm thấy dữ liệu artist hoặc tracks!', 'error');
                return null;
            }

            // Thêm artist_name vào mỗi track
            tracks.forEach(track => {
                track.artist_name = artist.name; // Gán artist_name từ artist.name
            });

            return { artist, tracks };
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu artist:', error.message);
            showToast('Không thể tải thông tin artist!', 'error');
            return null;
        }
    }

    function renderArtistData(artist, tracks) {
        if (!artist || !tracks) {
            artistHero.innerHTML = '<p class="no-data">Không có dữ liệu artist!</p>';
            popularTracksContainer.innerHTML = '<p class="no-data">Không có dữ liệu tracks!</p>';
            return;
        }

        currentTracks = tracks;

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
        artistHero.dataset.firstTrackId = tracks[0]?.id || ''; //set ID track đầu tiên

        const artistControls = document.querySelector('.artist-controls');
        artistControls.innerHTML = `
            <button class="play-btn-large">
                <i class="fas fa-play"></i>
            </button>
        `;

        popularTracksContainer.innerHTML = '';
        tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.dataset.trackId = track.id || ''; // Đảm bảo gán trackId
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
        setupTrackPlayEvents(); // Gắn sự kiện sau khi render
    }

    async function addToQueue(trackId) {
        const access_token = checkAuth();
        if (!access_token) return;

        try {
            await httpRequest.post(`me/player/queue`, {
                track_id: trackId
            }, {
                headers: { Authorization: `Bearer ${access_token}` }
            })
        } catch (error) {
            console.error('Lỗi khi thêm vào queue:', error.message);
            showToast('Không thể thêm vào queue!', 'error');
        }
    }

    function setupArtistClickEvents() {
        const artistCards = document.querySelectorAll('.artist-card');
        console.log('Setting up artist click events:', artistCards);
        artistCards.forEach(card => {
            const artistId = card.dataset.artistId || 'default-artist-id';
            card.addEventListener('click', async () => {
                console.log('Clicked artist, toggling to artist view:', artistId);
                toggleView('artist');
                const data = await fetchArtistData(artistId);
                if (data) {
                    renderArtistData(data.artist, data.tracks);
                }
            });
        });
    }

    function setupHomeClickEvents() {
        if(homeBtn){
            homeBtn.addEventListener('click', () => {
                toggleView('home');
            });
        }

        if(spotifyLogo){
            spotifyLogo.addEventListener('click', () => {
                toggleView('home');
            });
        }
    }

    toggleView('home');
    setupHomeClickEvents();

    //Get DOM cho player
    // Tìm DOM elements cho player
    const player = document.querySelector('.player');
    const playBtn = player.querySelector('.control-btn.play-btn');
    const nextBtn = player.querySelector('.control-btn:has(.fa-step-forward)');
    const previousBtn = player.querySelector('.control-btn:has(.fa-step-backward)');
    const shuffleBtn = player.querySelector('.control-btn:has(.fa-random)');
    const repeatBtn = player.querySelector('.control-btn:has(.fa-redo)');
    const volumeBar = player.querySelector('.volume-bar');
    const progressBar = player.querySelector('.progress-bar');
    const progressFill = player.querySelector('.progress-fill');
    const progressHandle = player.querySelector('.progress-handle');
    const currentTimeEl = document.querySelector('.time:first-child');
    const totalTimeEl = document.querySelector('.time:last-child')
    const playerTitle = player.querySelector('.player-title');
    const playerArtist = player.querySelector('.player-artist');
    const playerImage = player.querySelector('.player-image');
    const audio = document.getElementById('audio-player');
    const controlButtons = document.querySelectorAll('.player-controls .control-btn');
    const progressContainer = document.querySelector('.progress-container');

    initNoTrack();

    // Hàm cập nhật UI cho player
    function updatePlayerUI() {
        const audio = document.getElementById('audio-player');
        if (audio.src) {
            playBtn.innerHTML = audio.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    function formatTime(seconds){
        if(isNaN(seconds)) return '0:00'
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    //Cập nhật total time
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    })

    //Cập nhật progressBar
    function updateProgressBar() {
         const audio = document.getElementById('audio-player');
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

    //Xử lý click để tua
    progressBar.addEventListener('click', (event) => {
        const audio = document.getElementById('audio-player');
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        const newTime = (offsetX / width) * audio.duration;
        audio.currentTime = newTime;
        updateProgressBar();
    })

    //Mặc định chưa kéo
    let isDragging = false;

    //Khi đè chuột thì mới đang kéo
    progressHandle.addEventListener('mousedown', () => {
        isDragging = true;
    })

    document.addEventListener('mousemove', (event) => {
        if(isDragging){
            const audio = document.getElementById('audio-player');
            const rect = progressBar.getBoundingClientRect();
            let offsetX = event.clientX - rect.left;
            // Giới hạn offsetX trong [0, width]
            offsetX = Math.max(0, Math.min(offsetX, rect.width));
            const newTime = (offsetX / rect.width) * audio.duration;
            audio.currentTime = newTime;
            // Cập nhật UI ngay lập tức
            const progressPercent = (offsetX / rect.width) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressHandle.style.left = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(newTime);
        }
    })

    //Ngưng đè thì dừng tua
    document.addEventListener('mouseup', () => {
        isDragging = false;
    })

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
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                showToast('Đang phát bài hát!', 'success');
            } else {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                showToast('Đã tạm dừng bài hát!', 'success');
            }
        } catch (error) {
            console.error('Lỗi khi play/pause:', error.message);
            showToast('Không thể thực hiện hành động play/pause!', 'error');
        }
    }

    async function handlePlayTrack(trackId) {
        const access_token = checkAuth();
        if (!access_token) return;

        const audio = document.getElementById('audio-player');

        try {
            console.log('Phát bài hát với trackId:', trackId); // Debug
            const response = await httpRequest.post(`tracks/${trackId}/play`, {}, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            console.log('Response từ POST /tracks/:trackId/play:', response); // Debug
            const track = response.track || {};
            if (track.id && track.audio_url) {
                // Xóa trạng thái No Track
                player.classList.remove('no-track');
                playerImage.style.display = 'block';
                progressContainer.style.opacity = '1';
                progressContainer.style.pointerEvents = 'auto';
                controlButtons.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                });

                // Cập nhật bottom player
                playerTitle.textContent = track.title || 'Unknown Track';
                playerArtist.textContent = track.artist_name || 'Unknown Artist';
                playerImage.src = track.image_url || './default-track.jpg';
                // Cập nhật audio
                audio.src = track.audio_url;
                await audio.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                showToast(`Đang phát: ${track.title}`, 'success');
            } else {
                showToast('Không có thông tin bài hát hoặc audio_url!', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi phát bài hát:', error.message);
            showToast('Không thể phát bài hát!', 'error');
        }
    }

    //Hàm setup phát nhạc
    function setupTrackPlayEvents() {
        const hitPlayButtons = document.querySelectorAll('.hit-play-btn');
        const trackPlayButtons = document.querySelectorAll('.track-play-btn');
         const artistPlayBtn = document.querySelector('.play-btn-large');

        hitPlayButtons.forEach(button => {
            const hitCard = button.closest('.hit-card');
            const trackId = hitCard.dataset.trackId || '';
            button.addEventListener('click', () => {
                handlePlayTrack(trackId);
            });
        });

        trackPlayButtons.forEach(button => {
            const trackItem = button.closest('.track-item');
            const trackId = trackItem.dataset.trackId || '';
            button.addEventListener('click', () => {
                handlePlayTrack(trackId);
            });
        });

        artistPlayBtn.addEventListener('click', async () => {
            const access_token = checkAuth();
            if (!access_token) return;

            if (currentTracks.length === 0) {
                showToast('Không có tracks để phát!', 'error');
                return;
            }

            // Phát track đầu tiên
            const firstTrackId = currentTracks[0].id;
            await handlePlayTrack(firstTrackId);

            // Thêm các tracks còn lại vào queue
            const remainingTracks = currentTracks.slice(1);
            for (const track of remainingTracks) {
                await addToQueue(track.id);
            }

            showToast('Đang phát playlist của artist!', 'success');
        });
    }

    // Gọi updatePlayerUI ban đầu
    updatePlayerUI();

    if (playBtn) {
        playBtn.addEventListener('click', handlePlayPause);
    } else {
        console.error('Không tìm thấy playBtn để gắn sự kiện!');
    }

     //Hàm set trạng thái no track
    function initNoTrack() {
        playerTitle.textContent = 'Chưa có bài hát được chọn'
        playerArtist.textContent = ''
        playerImage.style.display = 'none'
        progressContainer.style.opacity = '0.5';
        progressContainer.style.pointerEvents = 'none';
        controlButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        })
        player.classList.add('no-track');
        const audio = document.getElementById('audio-player');
        audio.src = '';
        progressFill.style.width = '0%';
        progressHandle.style.left = '0%';
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '0:00';
    }

    fetchBiggestHits().then(tracks => {
        renderBiggestHits(tracks.slice(0, 10));
        setupTrackPlayEvents(); // Gắn sự kiện sau khi render
    });

    fetchPopularArtists().then(artists => {
        renderPopularArtists(artists.slice(0, 10));
        setupArtistClickEvents();
    });

    //Luôn luôn cập nhật
    audio.addEventListener('timeupdate', updateProgressBar);    
});

