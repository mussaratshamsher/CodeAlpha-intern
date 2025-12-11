document.addEventListener("DOMContentLoaded", function () {

const songs = [
'music/track1.mp3',
'music/track2.mp3',
'music/track3.mp3',
'music/track4.mp3',
'music/track5.mp3',
'music/track6.mp3',
'music/track7.mp3',
'music/track8.mp3',
'music/track9.mp3',
'music/track10.mp3',
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('song-artist');
const playlistEl = document.getElementById('playlist');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const volumeEl = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const autoplayToggle = document.getElementById('autoplayToggle');

let index = 0;
let isPlaying = false;

function buildPlaylist(){
playlistEl.innerHTML='';
songs.forEach((s,i)=>{
let div=document.createElement('div');
div.className='track'; 
div.dataset.index=i;
div.textContent=`Track ${i+1}`;
div.onclick=()=>{ loadTrack(i); playAudio(); };
playlistEl.appendChild(div);
});
}

function highlight(){ 
document.querySelectorAll('.track').forEach(el=>el.classList.remove('active')); 
document.querySelector(`.track[data-index="${index}"]`)?.classList.add('active'); 
}

function loadTrack(i){ 
index=i; 
audio.src=songs[index]; 
titleEl.textContent=`Track ${index+1}`; 
artistEl.textContent='Unknown Artist'; 
highlight(); 
}
// Add debugging listeners
audio.onplay = () => console.log("Audio started playing");
audio.onerror = () => console.log("Audio failed to load", audio.src);

// Optional: log current track path for debugging
console.log("Audio element:", audio);
console.log("Current song path:", songs[index]);

function playAudio(){ 
audio.play(); 
isPlaying=true; 
playBtn.textContent='⏸'; 
}

function pauseAudio(){ 
audio.pause(); 
isPlaying=false; 
playBtn.textContent='▶'; 
}

playBtn.onclick=()=>{ isPlaying ? pauseAudio() : playAudio(); };
prevBtn.onclick=()=>{ index=(index-1+songs.length)%songs.length; loadTrack(index); playAudio(); };
nextBtn.onclick=()=>{ index=(index+1)%songs.length; loadTrack(index); playAudio(); };

audio.addEventListener('loadedmetadata',()=> totalTimeEl.textContent=format(audio.duration));
audio.addEventListener('timeupdate',()=>{ 
progress.style.width=(audio.currentTime/audio.duration)*100+'%'; 
currentTimeEl.textContent=format(audio.currentTime); 
});

progressBar.onclick=(e)=>{
let pct = e.offsetX / progressBar.offsetWidth;
audio.currentTime = pct * audio.duration;
};

volumeEl.oninput=()=> audio.volume=volumeEl.value;
muteBtn.onclick=()=>{ audio.volume=audio.volume>0?0:0.8; volumeEl.value=audio.volume; };

audio.addEventListener('ended',()=>{ 
if(autoplayToggle.checked){ nextBtn.click(); } 
else pauseAudio(); 
});

function format(sec){
sec=Math.floor(sec);
return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}

buildPlaylist(); 
loadTrack(0);

});
