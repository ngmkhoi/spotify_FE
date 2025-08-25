import checkAuth from "../middlewares/checkAuth.js";
import httpRequest from "../services/httpRequest.js";
import showToast from "../utils/showToast.js";

let followedArtistsPlaylist = [];
let userPlaylist = [];
let followedPlaylists = [];
let allPlaylist = [];

async function fetchSidebarItems() {
    const access_token = checkAuth();
    if (!access_token) return;

    try {
        const artistsResponse = await httpRequest.get('me/following?limit=20&offset=0', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        followedArtistsPlaylist = artistsResponse.artists || [];

        const playlistsResponse = await httpRequest.get('me/playlists/followed?limit=20&offset=0', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        followedPlaylists = playlistsResponse.playlists || [];

        const myPlaylist = await httpRequest.get('me/playlists', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        userPlaylist = myPlaylist.playlists || [];

        allPlaylist = followedPlaylists.concat(userPlaylist);

        console.log('Fetched followed items:', followedArtistsPlaylist, allPlaylist);
    } catch (error) {
        console.error('Lỗi fetch followed items:', error);
        showToast('Không thể tải thư viện của bạn!', 'error');
    }
}

export { followedArtistsPlaylist, allPlaylist, userPlaylist};
export default fetchSidebarItems;