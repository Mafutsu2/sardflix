const gameColors = ['#0066FF', '#3366FF', '#6666FF', '#9966FF', '#CC66FF', '#FF66FF'];
const authorColors = ['#006666', '#336666', '#666666', '#996666', '#CC6666', '#FF6666'];
let gameAutocomplete = [], authorAutocomplete = [];
let gameTags = [], authorTags = [];
let games = [];
let typingTimer = null;

const onGameKeyPressed = (e) => {
  if(e.keyCode === 13 && e.target.value !== '' && gameAutocomplete.length !== 0) {
    addTag(gameAutocomplete[0], 'game');
    e.target.value = '';
    closeAllAutocomplete();
  }
};

const onAuthorKeyPressed = (e) => {
  if(e.keyCode === 13 && e.target.value !== '' && authorAutocomplete.length !== 0) {
    addTag(authorAutocomplete[0], 'author');
    e.target.value = '';
    closeAllAutocomplete();
  }
};

const onSearchGameTag = (e) => {
  let autocomplete = document.getElementById('gameAutocomplete');
  autocomplete.innerHTML = '';
  gameAutocomplete = [];
  if(e.target.value === '') {
    autocomplete.classList.add("autocompleteHide");
    return;
  }
  let hasOne = false;
  games.forEach(g => {
    if(g.id !== null && toLowerNoAccents(g.name).includes(toLowerNoAccents(e.target.value))) {
      hasOne = true;
      const game = document.createElement('div');
      game.className = 'autocompleteItem';
      game.innerText = g.name;
      game.addEventListener('click', () => {
        addTag(g, 'game');
        e.target.value = '';
      });
      autocomplete.appendChild(game);
      gameAutocomplete.push(g);
    }
  });
  
  if(hasOne)
    autocomplete.classList.remove("autocompleteHide");
};

const onSearchAuthorTag = async (e) => {
  let autocomplete = document.getElementById('authorAutocomplete');
  autocomplete.classList.add("autocompleteHide");
  autocomplete.innerHTML = '';
  authorAutocomplete = [];
  const tagPrankex = document.getElementById('tagPrankex');
  tagPrankex.style.visibility = 'visible';
  if(typingTimer !== null) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  if(e.target.value === '') {
    tagPrankex.style.visibility = 'hidden';
    return;
  }
  typingTimer = setTimeout(async () => {
    const search = '?search=' + escape(e.target.value);
    const url = 'https://api.sardflix.com/users' + search;
    const response = await fetch(url);
    const json = await response.json();
    
    json.forEach(j => {
      const author = document.createElement('div');
      author.className = 'autocompleteItem';
      author.innerText = j.author;
      author.addEventListener('click', () => {
        addTag(j.author, 'author');
        e.target.value = '';
      });
      autocomplete.appendChild(author);
      authorAutocomplete.push(j.author);
    });
    if(authorAutocomplete.length > 0)
      autocomplete.classList.remove("autocompleteHide");
    tagPrankex.style.visibility = 'hidden';
  }, 500);
};

const addTag = (item, which) => {
  /* Should look like this
  <div class="tag">
    <div class="tagText">League of Legends</div>
    <span class="material-symbols-outlined tagRemove">close_small</span>
  </div>
  */
  clipId = null;
  let tags;
  if(which === 'game') {
    gameTags.push(item);
    tags = document.getElementById('gameTags');
  } else if(which === 'author') {
    authorTags.push(item);
    tags = document.getElementById('authorTags');
  }
  
  const tag = document.createElement('div');
  tag.className = 'tag';
  if(which === 'game')
    tag.style.backgroundColor = gameColors[Math.floor(Math.random() * gameColors.length)];
  else if(which === 'author')
    tag.style.backgroundColor = authorColors[Math.floor(Math.random() * authorColors.length)];
  
  
  const tagText = document.createElement('div');
  tagText.className = 'tagText';
  tagText.innerText = which === 'game' ? item.name : item;
  tag.appendChild(tagText);
  
  const tagRemove = document.createElement('span');
  tagRemove.className = 'material-symbols-rounded tagRemove';
  tagRemove.innerText = 'close_small';
  tag.addEventListener('click', () => {
    clipId = null;
    if(which === 'game')
      gameTags = gameTags.filter(t => t.id !== item.id);
    else if(which === 'author')
      authorTags = authorTags.filter(t => t !== item);
    tag.remove();
    showClips(true);
  });
  tag.appendChild(tagRemove);
  
  tags.appendChild(tag);
  showClips(true);
};