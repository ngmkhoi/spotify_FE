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

    const signupFormElement = signupForm?.querySelector('.auth-form-content');
    const signupUsernameInput = document.getElementById('signupUsername');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupConfirmPasswordInput = document.getElementById('signupConfirmPassword');
    const signupUsernameFormGroup = signupUsernameInput?.closest('.form-group');
    const signupEmailFormGroup = signupEmailInput?.closest('.form-group');
    const signupPasswordFormGroup = signupPasswordInput?.closest('.form-group');
    const signupConfirmPasswordFormGroup = signupConfirmPasswordInput?.closest('.form-group');

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
        if (token) {
            try {
                const response = await httpRequest.get('users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = response.user || response;
                authButtons.style.display = 'none';
                userAvatar.style.display = 'block';
                userAvatar.innerHTML = `<img src="${user.avatar_url || 'default-avatar.png'}" alt="${user.display_name || 'User'}" style="width: 32px; height: 32px; border-radius: 50%;">`;
                userAvatar.title = user.display_name || 'User';
            } catch (error) {
                authButtons.style.display = 'flex';
                userAvatar.style.display = 'none';
            }
        } else {
            authButtons.style.display = 'flex';
            userAvatar.style.display = 'none';
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
    if (signupUsernameInput && signupEmailInput && signupPasswordInput && signupConfirmPasswordInput &&
        signupUsernameFormGroup && signupEmailFormGroup && signupPasswordFormGroup && signupConfirmPasswordFormGroup) {
        // Xóa class invalid ban đầu
        signupUsernameFormGroup.classList.remove('invalid');
        signupEmailFormGroup.classList.remove('invalid');
        signupPasswordFormGroup.classList.remove('invalid');
        signupConfirmPasswordFormGroup.classList.remove('invalid');

        // Validate thời gian thực khi blur
        signupUsernameInput.addEventListener('blur', () => validateField(signupUsernameInput, 'signup'));
        signupEmailInput.addEventListener('blur', () => validateField(signupEmailInput, 'signup'));
        signupPasswordInput.addEventListener('blur', () => validateField(signupPasswordInput, 'signup'));
        signupConfirmPasswordInput.addEventListener('blur', () => validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value));

        // Xử lý submit signup
        signupFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isUsernameValid = validateField(signupUsernameInput, 'signup');
            const isEmailValid = validateField(signupEmailInput, 'signup');
            const isPasswordValid = validateField(signupPasswordInput, 'signup');
            const isConfirmPasswordValid = validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value);

            if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
                return;
            }

            const credential = {
                email: signupEmailInput.value,
                password: signupPasswordInput.value
            };

            try {
                const { user, access_token } = await httpRequest.post('auth/register', credential);
                localStorage.setItem('access_token', access_token);

                // Tự động đăng nhập
                const loginResponse = await httpRequest.post('auth/login', credential);
                localStorage.setItem('access_token', loginResponse.access_token);

                // Cập nhật header UI
                await updateHeader();

                // Hiển thị Toast và đóng modal
                showToast('Đăng ký thành công!', 'success');
                closeModal();
            } catch (error) {
                const errorMessage = error.response?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
                signupEmailFormGroup.classList.add('invalid');
                signupEmailFormGroup.querySelector('.error-message span').textContent = 
                    errorMessage.toLowerCase().includes('email') ? 'Email đã tồn tại' : errorMessage;
            }
        });
    }

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

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", function () {
        userDropdown.classList.remove("show");
        localStorage.removeItem('access_token');
        authButtons.style.display = 'flex';
        userAvatar.style.display = 'none';
    });

    // Khởi tạo header
    updateHeader();
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const { artists } = await httpRequest.get('artists');
        console.log(artists);
    } catch (error) {
        console.error('Error fetching artists:', error.message);
        alert('Không thể lấy danh sách nghệ sĩ!');
    }
});