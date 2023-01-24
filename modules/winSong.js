export default function winSong(listOfSongs) {
    const numOfSong = getRandomInt(0, listOfSongs.length);
    const winner = listOfSongs[numOfSong].title + ' — ' + listOfSongs[numOfSong].song;
    return [winner, numOfSong];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}