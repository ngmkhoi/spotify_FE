let currentView = 'home'; // Move currentView to module scope to persist state

function toggleView(targetView) {
    const homeView = document.getElementById("home-view");
    const detailView = document.getElementById("detail-view");

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

export default toggleView;