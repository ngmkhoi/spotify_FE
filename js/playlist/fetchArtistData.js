import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";

async function fetchArtistData(artistId) {
    try {
        const artistResponse = await httpRequest.get(`artists/${artistId}`);
        const artist = artistResponse || {};
        console.log('Artist data:', artist);

        const tracksResponse = await httpRequest.get(`artists/${artistId}/tracks/popular?limit=10`);
        const tracks = tracksResponse.tracks || [];
        console.log('Tracks data:', tracks);

        if (!artist || tracks.length === 0) {
            showToast('Không tìm thấy dữ liệu artist hoặc tracks!', 'error');
            return null;
        }

        tracks.forEach(track => {
            track.artist_name = artist.name;
        });

        return { artist, tracks };
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu artist:', error.message);
        showToast('Không thể tải thông tin artist!', 'error');
        return null;
    }
}

export default fetchArtistData;