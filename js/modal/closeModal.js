function closeModal() {
    const authModal = document.getElementById("authModal");
    authModal.classList.remove("show");
    document.body.style.overflow = "auto";
}

export default closeModal;