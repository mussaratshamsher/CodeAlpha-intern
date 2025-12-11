const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const prevBtn = document.getElementById('prev-btn');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volume-control');
const playlistEl = document.getElementById('playlist');

const audio = new Audio();
let currentSong = 0;

const songs = [
    'music/track 1 (1).mp3',
    'music/track 1 (2).mp3',
    'music/track 1 (3).mp3',
    'music/track 1 (4).mp3',
    'music/track 1 (5).mp3',
    'music/track 1 (6).mp3',
    'music/track 1 (7).mp3',
    'music/track 1 (8).mp3',
    'music/track 1 (9).mp3',
    'music/track 1 (10).mp3',
    'music/track 1 (11).mp3',
    'music/track 1 (12).mp3',
    'music/track 1 (13).mp3',
    'music/track 1 (14).mp3',
    'music/track 1 (15).mp3',
    'music/track 1 (16).mp3',
    'music/track 1 (17).mp3',
    'music/track 1 (18).mp3',
    'music/track 1 (19).mp3',
    'music/track 1 (20).mp3',
    'music/track 1 (21).mp3',
    'music/track 1 (22).mp3',
    'music/track 1 (23).mp3',
    'music/track 1 (24).mp3',
    'music/track 1 (25).mp3',
    'music/track 1 (26).mp3',
    'music/track 1 (27).mp3'
];

function loadSong(songIndex) {
    audio.src = songs[songIndex];
    const songName = songs[songIndex].split('/').pop().replace('.mp3', '');
    songTitle.textContent = songName;
    songArtist.textContent = 'Unknown Artist'; // You can modify this if you have artist info
    audio.load();
}

function playSong() {
    audio.play();
    const playBtnIcon = playBtn.querySelector('i');
    playBtnIcon.classList.remove('fa-play');
    playBtnIcon.classList.add('fa-pause');
}

function pauseSong() {
    audio.pause();
    const playBtnIcon = playBtn.querySelector('i');
    playBtnIcon.classList.remove('fa-pause');
    playBtnIcon.classList.add('fa-play');
}

function updateProgressBar() {
    const {
        currentTime,
        duration
    } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    if (duration) {
        const durationSpans = durationEl.querySelectorAll('span');
        durationSpans[0].textContent = formatTime(currentTime);
        durationSpans[1].textContent = formatTime(duration);
    }
}

function setProgress() {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
    updatePlaylist();
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
    updatePlaylist();
}

function setVolume() {
    audio.volume = volumeControl.value;
}

function createPlaylist() {
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.split('/').pop().replace('.mp3', '');
        li.addEventListener('click', () => {
            currentSong = index;
            loadSong(currentSong);
            playSong();
            updatePlaylist();
        });
        playlistEl.appendChild(li);
    });
}

function updatePlaylist() {
    const playlistItems = playlistEl.querySelectorAll('li');
    playlistItems.forEach((item, index) => {
        if (index === currentSong) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners
playBtn.addEventListener('click', () => {
    const isPlaying = audio.paused;
    const playBtnIcon = playBtn.querySelector('i');
    if (isPlaying) {
        playSong();
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    } else {
        pauseSong();
        playBtnIcon.classList.remove('fa-pause');
        playBtnIcon.classList.add('fa-play');
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgressBar);
progressBar.addEventListener('input', setProgress);
volumeControl.addEventListener('input', setVolume);
audio.addEventListener('ended', nextSong);

// Initial Load
loadSong(currentSong);
createPlaylist();
updatePlaylist();