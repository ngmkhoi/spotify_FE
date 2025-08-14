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
        await updateHeader();
        showToast('Đăng xuất thành công!', 'success');
    });

    // Khởi tạo header
    updateHeader();
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {

    // Get DOM elements
    const biggestHitsContainer = document.querySelector(".hits-grid");
    const popularArtistsContainer = document.querySelector(".artists-grid");

    if(!biggestHitsContainer || !popularArtistsContainer) {
        console.error('Không tìm thấy các phần tử cần thiết trong DOM');
        return;
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
            return tracks

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu trending tracks:', error.message);
            showToast('Không thể tải Today’s biggest hits!', 'error');
            return [];
        }
    }

    // Render biggest hits
    function renderBiggestHits(tracks) {
        biggestHitsContainer.innerHTML = ''; // Xóa nội dung cũ

        if(tracks.length === 0) {
            biggestHitsContainer.innerHTML = '<p class="no-data">Không có dữ liệu tracks!</p>';
            return;
        }

        tracks.forEach(track => {
            const hitItem = document.createElement('div');
            hitItem.className = 'hit-card';

            //Tạo div hit-card-cover
            const hitCardCover = document.createElement('div');
            hitCardCover.className = 'hit-card-cover';

            // Tạo thẻ img
            const img = document.createElement('img');
            img.src = track.image_url;
            img.alt = track.title;
            hitCardCover.appendChild(img);

            // Tạo button hit-play-btn
            const playButton = document.createElement('button');
            playButton.className = 'hit-play-btn';
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            hitCardCover.appendChild(playButton);

            // Tạo div hit-card-info
            const hitCardInfo = document.createElement('div');
            hitCardInfo.className = 'hit-card-info';

            // Tạo h3 hit-card-title
            const hitCardTitle = document.createElement('h3');
            hitCardTitle.className = 'hit-card-title';
            hitCardTitle.textContent = track.title || 'Unknown Track';

            // Tạo p hit-card-artist
            const hitCardArtist = document.createElement('p');
            hitCardArtist.className = 'hit-card-artist';
            hitCardArtist.textContent = track.artist_name || 'Unknown Artist';

            // Gắn title và artist vào hit-card-info
            hitCardInfo.appendChild(hitCardTitle);
            hitCardInfo.appendChild(hitCardArtist);

            // Gắn hit-card-cover và hit-card-info vào hit-card
            hitItem.appendChild(hitCardCover);
            hitItem.appendChild(hitCardInfo);

            //Gắn hitItem vào biggestHitsContainer
            biggestHitsContainer.appendChild(hitItem);
        })
    }

    fetchBiggestHits().then(tracks => {
        renderBiggestHits(tracks.slice(0, 6)); // Hiển thị 10 track đầu tiên
    })

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
        popularArtistsContainer.innerHTML = ''; // Xóa nội dung cũ

        if(artists.length === 0){
            popularArtistsContainer.innerHTML = '<p class="no-data">Không có dữ liệu artists!</p>';
            return; 
        }

        artists.forEach(artist => {
            // Tạo div artist-card
            const artistCard = document.createElement('div');
            artistCard.className = 'artist-card';

            //Tạo div artist-cover
            const artistCardCover = document.createElement('div');
            artistCardCover.className = 'artist-card-cover';

            // Tạo thẻ img
            const img = document.createElement('img');
            img.src = artist.image_url;
            img.alt = artist.name || 'Unknown Artist';
            artistCardCover.appendChild(img);

            // Tạo button artist-play-btn
            const playButton = document.createElement('button');
            playButton.className = 'artist-play-btn';
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            artistCardCover.appendChild(playButton);

            // Tạo div artist-card-info
            const artistCardInfo = document.createElement('div');
            artistCardInfo.className = 'artist-card-info';

            // Tạo h3 artist-card-name
            const artistCardName = document.createElement('h3');
            artistCardName.className = 'artist-card-name';
            artistCardName.textContent = artist.name || 'Unknown Artist';

            // Tạo p artist-card-artist
            const artistCardType = document.createElement('p');
            artistCardType.className = 'artist-card-type';
            artistCardType.textContent = artist.type || 'Artist';

            // Gắn title và artist vào hit-card-info
            artistCardInfo.appendChild(artistCardName);
            artistCardInfo.appendChild(artistCardType);

            // Gắn hit-card-cover và hit-card-info vào hit-card
            artistCard.appendChild(artistCardCover);
            artistCard.appendChild(artistCardInfo);

            //Gắn hitItem vào biggestHitsContainer
            popularArtistsContainer.appendChild(artistCard);
        })
    }

    fetchPopularArtists().then(artists => {
         renderPopularArtists(artists.slice(0, 6));
    })
});