const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let isLoading = true, isMore = true;
let page, count;
let votesLoading = [];
let clipId;

window.onload = async() => {
  loadFavicon();
  document.getElementById('discord').addEventListener('click', () => {
    const token = localStorage.getItem('sardflix-token');
    if(token !== null && token !== '')
      disconnect();
    else
      window.location.pathname = '/auth.html';
  });
  connect();
  
  const isTranscriptsPage = window.location.href.includes('sardflix.com/transcripts');
  if(isTranscriptsPage) {
    sorts = [
      {type: 'date', name: 'Date - newest', asc: false},
      {type: 'date', name: 'Date - oldest', asc: true},
    ];
    
    document.getElementById('tabS').addEventListener('click', () => {window.location.pathname = '/'});
  } else {
    sorts = [
      {type: 'date', name: 'Date - newest', asc: false},
      {type: 'date', name: 'Date - oldest', asc: true},
      {type: 'name', name: 'A - Z', asc: true},
      {type: 'name', name: 'Z - A', asc: false},
      {type: 'views', name: 'Views - most', asc: false},
      {type: 'views', name: 'Views - least', asc: true},
      {type: 'votes', name: 'Votes - most', asc: false},
      {type: 'votes', name: 'Votes - least', asc: true},
      {type: 'random', name: 'Randomize', asc: true},
    ];
    
    document.getElementById('tabTranscripts').addEventListener('click', () => {window.location.pathname = '/transcripts.html'});
    
    document.getElementById('searchGame').addEventListener('keypress', onGameKeyPressed);
    document.getElementById('searchAuthor').addEventListener('keypress', onAuthorKeyPressed);
    "input click".split(" ").forEach((event) => {
      document.getElementById('searchGame').addEventListener(event, onSearchGameTag);
    });
    "input click".split(" ").forEach((event) => {
      document.getElementById('searchAuthor').addEventListener(event, onSearchAuthorTag);
    });
  }
  
  document.getElementById('tabElo').addEventListener('click', () => {window.location.pathname = '/elo.html'});
  document.getElementById('tabSF6').addEventListener('click', () => {window.location.pathname = '/sf6.html'});
  
  document.getElementById('window').addEventListener('click', (e) => e.stopPropagation());
  document.getElementById('modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('player').src = '';
  });
  
  selectSort();
  document.getElementById('selectedSort').addEventListener('click', (e) => {
    e.stopPropagation();
    onSort(!isTranscriptsPage);
  });
  
  document.getElementById('searchButton').addEventListener('click', () => show(isTranscriptsPage, true));
  document.getElementById('searchBox').addEventListener('keypress', (e) => {
    clipId = null;
    if(e.keyCode === 13)
      show(isTranscriptsPage, true);
  });
  
  window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 90 && !isLoading && isMore) {
      isLoading = true;
      show(isTranscriptsPage, false);
    }
  });
  closeAllAutocomplete();
  document.addEventListener("click", (e) => {
    if(e.target.className !== 'searchTag')
      closeAllAutocomplete();
  });
  
  if(isTranscriptsPage) {
    rangeDate.start = new Date(1719748800000);
    rangeDate.min = new Date(1719748800000);
    initCalendar(false);
    
    showTranscripts(true);
  } else {
    rangeDate.start = new Date('2016-05-26T18:37:16Z');
    rangeDate.min = new Date('2016-05-26T18:37:16Z');
    await initQueryString();
    initCalendar(true);
    
    showClips(true);
  }
};

const show = (isTranscriptsPage, isNewRequest) => {
  if(isTranscriptsPage)
    showTranscripts(isNewRequest);
  else
    showClips(isNewRequest);
};

const initQueryString = async() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  page = isNaN(urlParams.get('page')) ? 0 : +urlParams.get('page');
  document.getElementById('searchBox').value = urlParams.get('search');
  rangeDate.start = urlParams.get('startDate') ? new Date(urlParams.get('startDate')) : rangeDate.start;
  rangeDate.end = urlParams.get('endDate') ? new Date(urlParams.get('endDate')) : rangeDate.end;
  rangeDate.endIncluded = urlParams.get('endDate') ? new Date(urlParams.get('endDate')) : rangeDate.end;
  let queryGames = urlParams.get('gameTags');
  if(queryGames) {
    await getGames();
    queryGames = JSON.parse(queryGames);
    queryGames.forEach(q => {
      let gameFound = games.find(g => toLowerNoAccents(g.name) === toLowerNoAccents(q));
      if(gameFound) {
        gameTags.push(gameFound);
        addTag(gameFound, 'game');
      }
    });
  } else
    getGames();
  authorTags = urlParams.get('authorTags') ? JSON.parse(urlParams.get('authorTags')) : [];
  authorTags.forEach(a => addTag(a, 'author'));
  const sortType = urlParams.get('sortType');
  const sortAsc = urlParams.get('sortAsc') ? urlParams.get('sortAsc') === 'true' : false;
  if(sortType != null && sortAsc != null)
    selectSort(sorts.find(s => s.type === sortType && s.asc === sortAsc));
  clipId = urlParams.get('clipId');
};

const connect = async() => {
  const session = sessionStorage.getItem('session');
  const token = localStorage.getItem('sardflix-token');
  if(session !== 'true') {
    if(token !== null && token !== '') {
      const url = 'https://api.sardflix.com/auth?token=' + token;
      const response = await fetch(url);
      const json = await response.json();
      if(json.token)
        localStorage.setItem('sardflix-token', json.token);
      else
        localStorage.setItem('sardflix-token', '');
      changeAvatar(json.token, json.avatar);
    } else {
      changeAvatar(false, null);
    }
    sessionStorage.setItem('session', 'true');
  } else {
    const avatar = sessionStorage.getItem('avatar');
    changeAvatar(token !== null && token !== '', avatar);
  }
};

const disconnect = async() => {
  localStorage.setItem('sardflix-token', '');
  changeAvatar(false, null);
};

const changeAvatar = (isConnected, avatar) => {
  if(isConnected) {
    sessionStorage.setItem('avatar', avatar);
    const image = document.createElement('img');
    image.src = avatar + '?size=28';
    document.getElementById('avatar').innerHTML = '';
    document.getElementById('avatar').appendChild(image);
    document.getElementById('linkIcon').innerText = 'link_off';
  } else {
    sessionStorage.setItem('avatar', '');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36"><path fill="#5865f2" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>';
    document.getElementById('avatar').innerHTML = svg;
    document.getElementById('linkIcon').innerText = 'link';
  }
};

const getGames = async() => {
  const url = 'https://api.sardflix.com/games';
  const response = await fetch(url);
  const json = await response.json();
  json.forEach(j => {
    if(j.name === null && j.game_id === '') {
      j.id = '-1';
      j.name = '<unknown>';
    }
  });
  games = json;
};

const showClips = async(isNewRequest) => {
  let loadingDiv = document.getElementById('loading');
  loadingDiv.innerHTML = '<img src="assets/prankex.gif"/>';
  
  let clips = document.getElementById('clips');
  let info = document.getElementById('info');
  if(isNewRequest) {
    clips.innerHTML = '';
    info.innerText = '';
    page = 0;
  } else
    page++;
  let res = await getClips();
  
  if(!isMore) {
    loadingDiv.innerHTML = '<img src="assets/sardsad.webp"/>';
  } else {
    loadingDiv.innerHTML = '';
  }
  res.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => openClip(item));
    
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    card.appendChild(thumbnail);
    
    const image = document.createElement('img');
    image.className = 'image';
    image.src = item.thumbnail_url.indexOf('clips-media-assets2') === -1 ? item.thumbnail_url.replace('preview-480x272', 'preview-270x153') : item.thumbnail_url;
    thumbnail.appendChild(image);
    
    const innerThumbnail = document.createElement('div');
    innerThumbnail.className = 'innerThumbnail';
    thumbnail.appendChild(innerThumbnail);
    
    const length = document.createElement('div');
    length.className = 'length shadowbox';
    length.innerText = (+item.length).toFixed(1) + 's';
    innerThumbnail.appendChild(length);
    
    const game = document.createElement('div');
    game.className = 'game shadowbox';
    game.innerText = item.game_name;
    innerThumbnail.appendChild(game);
    
    const date = document.createElement('div');
    date.className = 'date shadowbox';
    const d = new Date(item.date);
    date.innerText = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ', ' + twoDigits(d.getHours()) + ':' + twoDigits(d.getMinutes());
    innerThumbnail.appendChild(date);
    
    const description = document.createElement('div');
    description.className = 'description';
    card.appendChild(description);
    
    const voteNb = document.createElement('span');
    voteNb.className = 'voteNb';
    voteNb.innerText = item.votes;
    
    const userVote = document.createElement('div');
    userVote.style.display = 'none';
    userVote.innerText = item.userVote;
    card.appendChild(userVote);
    
    const votes = document.createElement('span');
    votes.className = item.userVote ? 'votes userVote' : 'votes';
    let isBlocked = false;
    votes.addEventListener('click', e => {
      e.stopPropagation();
      if(!isBlocked) {
        isBlocked = true;
        toggleVote(item.clip_id, userVote, voteNb, votes);
        setTimeout(() => isBlocked = false, 500);
      }
    });
    
    votes.appendChild(voteNb);
    
    const voteIcon = document.createElement('span');
    voteIcon.className = 'voteIcon material-symbols-rounded';
    voteIcon.innerText = 'arrow_drop_up';
    votes.appendChild(voteIcon);
    description.appendChild(votes);
    
    const name = document.createElement('span');
    name.className = 'name';
    name.innerHTML = item.name;
    description.appendChild(name);
    
    const author = document.createElement('span');
    author.className = 'author';
    author.innerText = ' — ' + item.author;
    description.appendChild(author);
    
    clips.appendChild(card);
  });
  
  info.innerHTML = count + ' Results in total';
  isLoading = false;
};

const toggleVote = async(id, userVote, voteNbEl, votesEl) => {
  if(votesLoading.includes(id))
    return;
  
  const token = localStorage.getItem('sardflix-token');
  if(token === null || token === '') {
    alert('Faut d\'abord se connecter avec discord pour voter\n(pour que les votes soient uniques)');
    return;
  }
  
  votesLoading.push(id);
  updateVote(userVote, voteNbEl, votesEl);
  
  let body = {token, clip_id: id};
  const url = 'https://api.sardflix.com/votes';
  const response = await fetch(url, {method: 'post', body: JSON.stringify(body)});
  const json = await response.json();
  if(userVote.innerText === 'false' && json.has_voted === 1)
    updateVote(userVote, voteNbEl, votesEl);
  else if(userVote.innerText === 'true' && json.has_voted === 0)
    updateVote(userVote, voteNbEl, votesEl);
  votesLoading = votesLoading.filter(e => e !== id);
};

const updateVote = (userVote, voteNbEl, votesEl) => {
  if(userVote.innerText === 'true') {
    voteNbEl.innerText = (+voteNbEl.innerText) - 1;
    votesEl.className = 'votes';
  } else {
    voteNbEl.innerText = (+voteNbEl.innerText) + 1;
    votesEl.className = 'votes userVote';
  }
  userVote.innerText = '' + !(userVote.innerText === 'true');
};

const getClips = async() => {
  let startDate = rangeDate.start;
  let endDate = rangeDate.endIncluded;
  startDate = '&startDate=' + startDate.getTime();
  endDate = '&endDate=' + endDate.getTime();
  
  let clipIdStr = clipId ? '&clip_id=' + encodeURIComponent(clipId) : '';
  
  let search = document.getElementById('searchBox').value;
  search = search ? '&search=' + encodeURIComponent(search) : '';
  
  let gameTagsStr = '&games=' + encodeURIComponent(JSON.stringify(gameTags.map(g => g.game_id)));
  let authorTagsStr = '&authors=' + encodeURIComponent(JSON.stringify(authorTags));
  
  let sortType = '&sorttype=' + currentSort.type;
  let sortAsc = '&sortasc=' + (currentSort.asc ? 1 : 0);
  
  let token = localStorage.getItem('sardflix-token');
  token = token ? '&token=' + token : '';
  
  const url = 'https://api.sardflix.com/clips?wow=ok&page=' + page + clipIdStr + search + startDate + endDate + gameTagsStr + authorTagsStr + sortType + sortAsc + token;
  const response = await fetch(url);
  const json = await response.json();
  page = json.page;
  isMore = json.isMore;
  count = json.count;
  return json.results;
};

const openClip = (item) => {
  let url = item.url.replace('https://clips.twitch.tv/', 'https://clips.twitch.tv/embed?parent=sardflix.com&parent=sardflix.com&autoplay=true&clip=');
  const player = document.getElementById('player');
  player.src = url;
  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;
  if(innerWidth / 16 > innerHeight / 9) {
    let height = innerHeight * 90 / 100;
    player.width = height * 16 / 9;
    player.height = height;
  } else {
    let width = innerWidth * 90 / 100;
    player.width = width;
    player.height = width * 9 / 16;
  }
  document.getElementById('modal').style.display = 'flex';
};

const twoDigits = (nb) => {
  return nb < 10 ?  '0' + nb : nb;
};

const toLowerNoAccents = (text) => {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
};

const closeAllAutocomplete = () => {
  document.querySelectorAll('.autocomplete > div').forEach(e => {
    e.classList.add("autocompleteHide");
  });
};