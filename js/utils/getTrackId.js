function getTrackId(track) {
    if (track.track_id) {
        return track.track_id;
    } else if (track.id) {
        return track.id;
    }
    console.error('Track ID not found:', track);
    return null;
}

export default getTrackId;