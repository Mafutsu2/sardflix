let songList = [];
let progressIsAvailable = true;

const showSongs = async() => {
  let loadingDiv = document.getElementById('loading');
  loadingDiv.innerHTML = '<img src="assets/prankex.gif"/>';
  
  let res = await getSongs();
  
  let songs = document.getElementById('songs');
  
  document.getElementById('play').addEventListener('click', playSong);
  document.getElementById('previous').addEventListener('click', previousSong);
  document.getElementById('next').addEventListener('click', nextSong);
  
  const progressBar = document.getElementById('progressBar');
  progressBar.addEventListener('input', e => {
    if(progressIsAvailable)
      progressIsAvailable = false;
  });
  progressBar.addEventListener('change', e => {
    songList.forEach(s => {
      if(s.isCurrentSong) {
        s.audio.currentTime = progressBar.value;
        progressIsAvailable = true;
      }
    });
  });
  
  const timeCurrent = document.getElementById('timeCurrent');
  res.forEach((s, index) => {
    
    const player = document.createElement('div');
    player.className = 'player';
    player.addEventListener('click', e => playNewSong(player, true));
    
    const audio = document.createElement('audio');
    audio.controls = false;
    audio.addEventListener('ended', nextSong);
    if(index === 0) {
      audio.addEventListener('loadeddata', e => {
        playNewSong(songList[0].player, false);
      });
    }
    
    audio.addEventListener('timeupdate', e => {
      if(progressIsAvailable)
        progressBar.value = Math.floor(audio.currentTime);
      timeCurrent.innerText = formatSeconds(audio.currentTime);
    });
    player.appendChild(audio);
    
    const source = document.createElement('source');
    source.src = s.url;
    source.type = "audio/mp3";
    audio.appendChild(source);
    
    
    
    
    
    const voteNb = document.createElement('span');
    voteNb.className = 'voteNb';
    voteNb.innerText = s.votes;
    
    const userVote = document.createElement('div');
    userVote.style.display = 'none';
    userVote.innerText = s.userVote;
    player.appendChild(userVote);
    
    const votes = document.createElement('span');
    votes.className = s.userVote ? 'votes userVote' : 'votes';
    let isBlocked = false;
    votes.addEventListener('click', e => {
      e.stopPropagation();
      if(!isBlocked) {
        isBlocked = true;
        toggleSongVote(s.id, userVote, voteNb, votes);
        setTimeout(() => isBlocked = false, 500);
      }
    });
    
    votes.appendChild(voteNb);
    
    const voteIcon = document.createElement('span');
    voteIcon.className = 'voteIcon material-symbols-rounded';
    voteIcon.innerText = 'arrow_drop_up';
    votes.appendChild(voteIcon);
    player.appendChild(votes);
    
    
    
    
    
    const name = document.createElement('div');
    name.className = 'name';
    name.innerText = s.name;
    player.appendChild(name);
    
    const download = document.createElement('a');
    download.className = 'download';
    download.innerHTML = '<span class="material-symbols-rounded">download</span>';
    player.appendChild(download);
    download.onclick = e => {
      e.stopPropagation();
      fetch(s.url)
       // check to make sure you didn't have an unexpected failure (may need to check other things here depending on use case / backend)
      .then(resp => resp.status === 200 ? resp.blob() : Promise.reject('something went wrong'))
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = s.name + '.' + s.url.split('.').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('oh no!'));
    };
    
    
    
    
    
    
    
    
    songs.appendChild(player);
    
    songList.push({isCurrentSong: index === 0, player, audio});
    
    
    
    
  });
  
  loadingDiv.innerHTML = '';
};



const toggleSongVote = async(id, userVote, voteNbEl, votesEl) => {
  if(votesLoading.includes(id))
    return;
  
  const token = localStorage.getItem('sardflix-token');
  if(token === null || token === '') {
    alert('Faut d\'abord se connecter avec discord pour voter\n(pour que les votes soient uniques)');
    return;
  }
  
  votesLoading.push(id);
  updateSongVote(userVote, voteNbEl, votesEl);
  
  let body = {token, song_id: id};
  const url = 'https://api.sardflix.com/votes/song';
  const response = await fetch(url, {method: 'post', body: JSON.stringify(body)});
  const json = await response.json();
  if(userVote.innerText === 'false' && json.has_voted === 1)
    updateSongVote(userVote, voteNbEl, votesEl);
  else if(userVote.innerText === 'true' && json.has_voted === 0)
    updateSongVote(userVote, voteNbEl, votesEl);
  votesLoading = votesLoading.filter(e => e !== id);
};

const updateSongVote = (userVote, voteNbEl, votesEl) => {
  if(userVote.innerText === 'true') {
    voteNbEl.innerText = (+voteNbEl.innerText) - 1;
    votesEl.className = 'votes';
  } else {
    voteNbEl.innerText = (+voteNbEl.innerText) + 1;
    votesEl.className = 'votes userVote';
  }
  userVote.innerText = '' + !(userVote.innerText === 'true');
};



const previousSong = () => {
  let currentIndex = songList.findIndex(sl => sl.isCurrentSong);
  let nextIndex = currentIndex === 0 ? songList.length - 1 : currentIndex - 1;
  playNewSong(songList[nextIndex].player, true);
};

const nextSong = () => {
  let currentIndex = songList.findIndex(sl => sl.isCurrentSong);
  let nextIndex = currentIndex === songList.length - 1 ? 0 : currentIndex + 1;
  playNewSong(songList[nextIndex].player, true);
};

const playSong = () => {
  songList.forEach(s => {
    if(s.isCurrentSong) {
      if(s.audio.duration > 0 && !s.audio.paused) {
        s.audio.pause();
        document.getElementById('play').innerHTML = '<span class="material-symbols-rounded">play_arrow</span>';
      } else {
        s.audio.play();
        document.getElementById('play').innerHTML = '<span class="material-symbols-rounded">pause</span>';
      }
    }
  });
};

const playNewSong = (player, isPlay) => {
  songList.forEach(sl => {
    if(sl.audio.duration > 0 && !sl.paused) {
      sl.audio.pause();
    }
    sl.audio.currentTime = 0;
    sl.isCurrentSong = false;
    if(sl.player === player) {
      sl.isCurrentSong = true;
      
      document.getElementById('progressBar').max = sl.audio.duration;
      document.getElementById('timeTotal').innerText = formatSeconds(sl.audio.duration);
      sl.player.className = 'player activeSong';
    } else {
      sl.player.className = 'player';
    }
  });
  
  if(isPlay)
    playSong();
};

const formatSeconds = (seconds) => {
  let min =  Math.floor(seconds/60);
  let sec = Math.floor(seconds%60)
  return min + ':' + (sec < 10 ? '0' + sec : sec);
};

const getSongs = async() => {
  let token = localStorage.getItem('sardflix-token');
  token = token ? '?token=' + token : '';
  
  const url = 'https://api.sardflix.com/songs' + token;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};