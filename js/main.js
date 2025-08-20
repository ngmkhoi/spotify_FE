import httpRequest from "./services/httpRequest.js";
import { validateField } from './middlewares/validation.js';
import updateHeader from "./authForm/updateHeader.js";
import showSignupForm from "./authForm/showSignupForm.js";
import showLoginForm from "./authForm/showLoginForm.js";
import openModal from "./modal/openModal.js";
import closeModal from "./modal/closeModal.js";
import clearForm from "./modal/clearForm.js";
import showToast from "./utils/showToast.js";
import initNoTrack from "./player/initNoTrack.js";
import updatePlayerUI from "./player/updatePlayerUI.js";
import formatTime from "./utils/formatTime.js";
import updateProgressBar from "./player/updateProgressBar.js";
import handlePlayPause from "./player/handlePlayPause.js";
import fetchBiggestHits from "./home/fetchBiggestHits.js";
import renderBiggestHits from "./home/renderBiggestHits.js";
import fetchPopularArtists from "./home/fetchPopularArtists.js";
import renderPopularArtists from "./home/renderPopularArtists.js";
import setupArtistClickEvents from "./setupEvents/setupArtistClickEvents.js";
import setupHomeClickEvents from "./setupEvents/setupHomeClickEvents.js";
import setupTrackPlayEvents from "./setupEvents/setupTrackPlayEvents.js";
import toggleView from "./utils/toggleView.js";


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
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
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
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const currentTimeEl = document.querySelector('.time:first-child');
    const totalTimeEl = document.querySelector('.time:last-child');
    const homeBtn = document.querySelector('.home-btn');
    const spotifyLogo = document.querySelector('.logo');



    // Auth Modal Event Listeners
    signupBtn?.addEventListener("click", () => {
        showSignupForm();
        openModal();
    });

    loginBtn?.addEventListener("click", () => {
        showLoginForm();
        openModal();
    });

    modalClose?.addEventListener("click", closeModal);

    authModal?.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal?.classList.contains("show")) {
            closeModal();
        }
    });

    showLoginBtn?.addEventListener("click", showLoginForm);
    showSignupBtn?.addEventListener("click", showSignupForm);

    // Signup Form Validation
    signupEmailFormGroup.classList.remove('invalid');
    signupPasswordFormGroup.classList.remove('invalid');
    signupConfirmPasswordFormGroup.classList.remove('invalid');

    signupEmailInput.addEventListener('blur', () => validateField(signupEmailInput, 'signup'));
    signupPasswordInput.addEventListener('blur', () => validateField(signupPasswordInput, 'signup'));
    signupConfirmPasswordInput.addEventListener('blur', () => validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value));

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

            const loginResponse = await httpRequest.post('auth/login', {
                email: credential.email,
                password: credential.password
            });

            localStorage.setItem('access_token', loginResponse.access_token);
            localStorage.setItem('current_user', JSON.stringify(loginResponse.user || user));

            await updateHeader();
            clearForm(signupFormElement);
            showToast('Đăng ký thành công!', 'success');
            closeModal();
        } catch (error) {
            const errorMessage = error.response?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            signupEmailFormGroup.classList.add('invalid');
            signupEmailFormGroup.querySelector('.error-message span').textContent = errorMessage;
        }
    });

    // Login Form Validation
    loginEmailFormGroup.classList.remove('invalid');
    loginPasswordFormGroup.classList.remove('invalid');

    loginEmailInput.addEventListener('blur', () => validateField(loginEmailInput, 'login'));
    loginPasswordInput.addEventListener('blur', () => validateField(loginPasswordInput, 'login'));

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

        try {
            const loginResponse = await httpRequest.post('auth/login', credential);
            localStorage.setItem('access_token', loginResponse.access_token);

            const userResponse = await httpRequest.get('users/me', {
                headers: { Authorization: `Bearer ${loginResponse.access_token}` }
            });
            const user = userResponse.user || userResponse;
            localStorage.setItem('current_user', JSON.stringify(user));

            await updateHeader();
            clearForm(loginFormElement);
            showToast('Đăng nhập thành công!', 'success');
            closeModal();
        } catch (error) {
            const errorMessage = error.response?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            if (errorMessage.toLowerCase().includes('email')) {
                loginEmailFormGroup.classList.add('invalid');
                loginEmailFormGroup.querySelector('.error-message span').textContent = 'Email không tồn tại';
            } else if (errorMessage.toLowerCase().includes('password')) {
                loginPasswordFormGroup.classList.add('invalid');
                loginPasswordFormGroup.querySelector('.error-message span').textContent = 'Mật khẩu không đúng';
            } else {
                loginEmailFormGroup.classList.add('invalid');
                loginPasswordFormGroup.classList.add('invalid');
                loginEmailFormGroup.querySelector('.error-message span').textContent = errorMessage;
            }
        }
    });

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

    // Logout Button Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", async function () {
        userDropdown.classList.remove("show");
        localStorage.clear();
        audio.pause();
        audio.src = '';
        initNoTrack();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        await updateHeader();
        showToast('Đăng xuất thành công!', 'success');
    });

    // Player Event Listeners
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    let isDragging = false;

    progressHandle.addEventListener('mousedown', () => {
        isDragging = true;
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const rect = progressBar.getBoundingClientRect();
            let offsetX = event.clientX - rect.left;
            offsetX = Math.max(0, Math.min(offsetX, rect.width));
            const newTime = (offsetX / rect.width) * audio.duration;
            audio.currentTime = newTime;
            const progressPercent = (offsetX / rect.width) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressHandle.style.left = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(newTime);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    progressBar.addEventListener('click', (event) => {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        const newTime = (offsetX / width) * audio.duration;
        audio.currentTime = newTime;
        updateProgressBar();
    });

    playBtn.addEventListener('click', handlePlayPause);

    // Initialize
    initNoTrack();
    updatePlayerUI();
    updateHeader();
    setupHomeClickEvents();
    fetchBiggestHits().then(tracks => {
        renderBiggestHits(tracks.slice(0, 10));
        setupTrackPlayEvents();
    });
    fetchPopularArtists().then(artists => {
        renderPopularArtists(artists.slice(0, 10));
        setupArtistClickEvents();
    });
    audio.addEventListener('timeupdate', updateProgressBar);
});