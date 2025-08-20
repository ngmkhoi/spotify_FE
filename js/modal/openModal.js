function openModal() {
    const authModal = document.getElementById("authModal");
    authModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

export default openModal;