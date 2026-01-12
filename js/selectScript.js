let sorts = [];
const sortsSeasons = [
  {type: 's15', name: 'Season 15'},
  {type: 's14-3', name: 'Season 14 - Split 3'},
];
const sf6SortsSeasons = [
  {type: 's10', name: 'Season 10'},
];
let currentSort;
let currentSortType;

const onSort = (isClips) => {
  let sortOptions = document.getElementById('sortOptions');
  sortOptions.innerHTML = '';
  
  /*
  <div id="sortOptions">
    <div class="option">views</div>
    <div class="option">rank</div>
    <div class="option">date</div>
  </div>
  */
  (currentSortType === 'seasons' ? sortsSeasons : (currentSortType === 'sf6_seasons' ? sf6SortsSeasons : sorts)).forEach(s => {
    if(s !== currentSort) {
      const sort = document.createElement('div');
      if(currentSortType === 'seasons' || currentSortType === 'sf6_seasons')
        sort.className = 'p-[4px] text-[14px] rounded-[6px] cursor-pointer transition-[background-color] duration-200 ease-out hover:bg-[#505050]';
      else
        sort.className = 'option';
      sort.innerText = s.name;
      sort.addEventListener('click', () => {
        selectSort(s, currentSortType);
        if(currentSortType === 'seasons' || currentSortType === 'sf6_seasons')
          fetchMatchesAndLps();
        else if(isClips)
          showClips(true);
        else
          showTranscripts(true);
      });
      sortOptions.appendChild(sort);
    }
  });
  
  if(currentSortType === 'seasons' || currentSortType === 'sf6_seasons')
    sortOptions.classList.toggle('!hidden');
  else
    sortOptions.classList.toggle("autocompleteHide");
};

const selectSort = (s = null, type = null) => {
  currentSortType = type;
  clipId = null;
  currentSort = s;
  if(s === null)
    currentSort = type === 'seasons'  ? sortsSeasons[0] : (type === 'sf6_seasons' ? sf6SortsSeasons[0] : sorts[0]);
  document.getElementById('selectedSort').innerText = (type === 'seasons' || type === 'sf6_seasons' ? '' : 'Sort: ') + currentSort.name;
};