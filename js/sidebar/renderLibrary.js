import setupLibraryClickEvents from '../setupEvents/setupLibraryClickEvents.js';
import checkAuth from '../middlewares/checkAuth.js';
import fetchSidebarItems, { followedArtistsPlaylist, allPlaylist} from './fetchSidebarItems.js';

function renderLibrary(type = 'playlists') {  // Default là playlists

    const access_token = checkAuth();
    if (!access_token) return

    const libraryContent = document.querySelector('.library-content');
    if (!libraryContent) return;  // Phòng thủ nếu element chưa tồn tại

    libraryContent.innerHTML = '';  // Xóa nội dung cũ để render mới

    let items = [];
    if (type === 'playlists') {
        items = allPlaylist;  // Mảng playlists từ fetch
    } else if (type === 'artists') {
        items = followedArtistsPlaylist;  // Mảng artists từ fetch
    }

    // Duyệt mảng và render từng item (sử dụng map() để tạo array HTML strings, rồi join)
    const htmlItems = items.map(item => `
        <div class="library-item" data-id="${item.id}"> 
            <img src="${item.image_url || 'placeholder.svg?height=48&width=48'}" alt="${item.name}" class="item-image" />
            <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div class="item-subtitle">${type === 'playlists' ? `Playlist • ${item.name || 'You'}` : 'Artist'}</div>
            </div>
        </div>
    `).join('');

    libraryContent.innerHTML += htmlItems;

    setupLibraryClickEvents()
}
function setupLibraryTabs(){
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            fetchSidebarItems()
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.textContent.toLowerCase();
            renderLibrary(type);
        })
    })
}

export {renderLibrary, setupLibraryTabs};