let currentResultCount = 0;

const getTranscripts = async() => {
  let startDate = rangeDate.start;
  let endDate = rangeDate.endIncluded;
  startDate = '&startDate=' + startDate.getTime();
  endDate = '&endDate=' + endDate.getTime();
  
  let sortType = '&sorttype=' + currentSort.type;
  let sortAsc = '&sortasc=' + (currentSort.asc ? 1 : 0);
  
  let search = document.getElementById('searchBox').value;
  search = search ? '&search=' + encodeURIComponent(search) : '';
  let pageParams = '';
  if(page)
    page.forEach(p => pageParams += '&page=' + p);
  const url = 'https://api.sardflix.com/transcripts?wow=ok' + search + pageParams + startDate + endDate + sortAsc;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const showTranscripts = async(isNewRequest) => {
  let loadingDiv = document.getElementById('loading');
  loadingDiv.innerHTML = '<img src="assets/prankex.gif"/>';
  
  const transcriptsDiv = document.getElementById('transcripts');
  let info = document.getElementById('info');
  if(isNewRequest) {
    transcriptsDiv.innerHTML = '';
    info.innerText = '';
    page = null;
    currentResultCount = 0;
  }
  let res = await getTranscripts();
  count = res.total.value;
  let transcripts = res.hits;
  if(transcripts && transcripts.length > 0) {
    page = transcripts && transcripts.length > 0 ? transcripts[transcripts.length - 1].sort : null;
    currentResultCount += transcripts.length;
  }
  if(count === currentResultCount) {
    isMore = false;
    loadingDiv.innerHTML = '<img src="assets/sardsad.webp"/>';
  } else {
    isMore = true;
    loadingDiv.innerHTML = '';
  }
  transcripts.forEach(item => {
    const d = new Date(item._source.date);
    const date = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ', ' + twoDigits(d.getHours()) + ':' + twoDigits(d.getMinutes());
    const thumbnail = item._source.thumbnail.replace('%{width}', '405').replace('%{height}', '228');
    
    let newText = item._source.transcript;
    if(item.highlight && item.highlight.transcript.length === 1) {
      newText = item.highlight.transcript[0].replaceAll(/<em>(.+?)<\/em>/g, `<mark>$1</mark>`);
    } else if(item.highlight) {
      let match = item.highlight.transcript[0].match(/<em>(.+?)<\/em>/);
      if(match) {
        newText = newText.replaceAll(match[1], `<mark>${match[1]}</mark>`)
      }
    }
    
    const card = document.createElement('div');
    card.className = 'cardTranscript';
    card.addEventListener('click', () => openVideo(item));
    card.innerHTML = `
      <div class="thumbnailTranscript">
        <img class="image" src="${thumbnail}">
        <div class="innerThumbnail">
          <div class="length shadowbox">${secToString2(item._source.timestamp_seconds)} / ${secToString2(item._source.total_duration)}</div>
          <div class="title shadowbox">${item._source.vod_name}</div>
          <div class="date shadowbox">${date}</div>
        </div>
      </div>
      <div class="description">
        <span class="nameTranscript">${newText}</span>
      </div>
    `;
    transcriptsDiv.appendChild(card);
  });
  
  info.innerHTML = count + ' Results in total';
  isLoading = false;
};

const openVideo = (item) => {
  const time = secToString(item._source.timestamp_seconds);
  const url = `https://player.twitch.tv/?video=${item._source.vod_id}&parent=www.sardflix.com&time=${time}`;
  const player = document.getElementById('player');
  const text = document.getElementById('text');
  player.src = url;
  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;
  if(innerWidth / 16 > innerHeight / 9) {
    let height = innerHeight * 90 / 100;
    player.width = height * 16 / 9;
    player.height = height;
    text.style.width = height * 16 / 9 + 'px';
  } else {
    let width = innerWidth * 90 / 100;
    player.width = width;
    player.height = width * 9 / 16;
    text.style.width = width + 'px';
  }
  let newText = item._source.transcript;
  let match = item.highlight ? item.highlight.transcript[0].match(/<em>(.+?)<\/em>/) : null;
  if(match) {
    newText = newText.replaceAll(match[1], `<mark>${match[1]}</mark>`)
  }
  text.innerHTML = newText;
  document.getElementById('modal').style.display = 'flex';
};

const secToString = (sec) => {
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec % 3600) / 60);
  let seconds = Math.floor(sec % 60);
  return `${hours}h${minutes}m${seconds}s`;
};

const secToString2 = (sec) => {
  let hours = Math.floor(sec / 3600) + '';
  let minutes = Math.floor((sec % 3600) / 60) + '';
  let seconds = Math.floor(sec % 60) + '';
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};
