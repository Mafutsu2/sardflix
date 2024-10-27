const sorts = [
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
let currentSort;

const onSort = (e) => {
  let sortOptions = document.getElementById('sortOptions');
  sortOptions.innerHTML = '';
  
  /*
  <div id="sortOptions">
    <div class="option">views</div>
    <div class="option">rank</div>
    <div class="option">date</div>
  </div>
  */
  sorts.forEach(s => {
    if(s !== currentSort) {
      const sort = document.createElement('div');
      sort.className = 'option';
      sort.innerText = s.name;
      sort.addEventListener('click', () => {
        selectSort(s);
        showClips(true);
      });
      sortOptions.appendChild(sort);
    }
  });
  
  sortOptions.classList.remove("autocompleteHide");
};

const selectSort = (s) => {
  clipId = null;
  currentSort = s;
  document.getElementById('selectedSort').innerText = 'Sort: ' + s.name;
};