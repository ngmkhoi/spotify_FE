function checkVerified(isVerified) {
    if (isVerified) {
        return `<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Artist</span>`;
    }
    return '';
}

export default checkVerified;