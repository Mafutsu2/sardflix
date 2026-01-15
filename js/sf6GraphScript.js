//tailwindcss-windows-x64.exe -i css/eloGraph.css -o css/eloGraphTW.css --minify
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const colors = {
  rookie: '#FFFFFF',
  iron: '#7A7977',
  bronze: '#916C4F',
  silver: '#B4BABA',
  gold: '#D8B65F',
  platinum: '#70C1C5',
  diamond: '#BC6FA8',
  master: '#51E1A6',//#9D48E0
  grandmaster: '#CD4545',//#756572
  challenger: '#F4C874',//#3FBFDD
  opacityBackground: '26',
  opacityText: 'ff',
  opacityGrid: '40',
};
const textColorsForRetardedTailwind = {
  rookie: 'text-[#FFFFFF]',
  iron: 'text-[#7A7977]',
  bronze: 'text-[#916C4F]',
  silver: 'text-[#B4BABA]',
  gold: 'text-[#D8B65F]',
  platinum: 'text-[#70C1C5]',
  diamond: 'text-[#BC6FA8]',
  master: 'text-[#51E1A6]',//#9D48E0
  highmaster: 'text-[#CD4545]',//#756572
  grandmaster: 'text-[#F4C874]',//#3FBFDD
  ultimatemaster: 'text-[#F4C874]',//#3FBFDD
  legend: 'text-[#F4C874]',//#3FBFDD
  'undefined': '',
};
const curvesColors = [
  {name: 'green', colorLight: '#68e35b', colorDark: '#4b8545', colorHover: '#b0f5a9'},
  {name: 'red', colorLight: '#e85f5f', colorDark: '#964a4a', colorHover: '#f79e9e'},
  {name: 'blue', colorLight: '#579feb', colorDark: '#506d8c', colorHover: '#a6cdf7'},
  {name: 'lightorange', colorLight: '#f0a85b', colorDark: '#917454', colorHover: '#f5d8ba'},
  {name: 'purple', colorLight: '#7757eb', colorDark: '#4d3d8f', colorHover: '#b4a2f5'},
  {name: 'teal', colorLight: '#57ebd2', colorDark: '#4d877d', colorHover: '#b0f5e9'},
  {name: 'pink', colorLight: '#eb57df', colorDark: '#804b7b', colorHover: '#f5a9ef'},
  {name: 'orange', colorLight: '#ff9900', colorDark: '#bd842f', colorHover: '#ffd494'},
  {name: 'lime', colorLight: '#c2d94e', colorDark: '#97ad24', colorHover: '#f2ffb0'},
  {name: 'skyblue', colorLight: '#6dd3f2', colorDark: '#337b91', colorHover: '#cff4ff'},
  {name: 'orange', colorLight: '#f0a85b', colorDark: '#917454', colorHover: '#f5d8ba'},
  {name: 'purple', colorLight: '#7757eb', colorDark: '#4d3d8f', colorHover: '#b4a2f5'},
  {name: 'teal', colorLight: '#57ebd2', colorDark: '#4d877d', colorHover: '#b0f5e9'},
  {name: 'pink', colorLight: '#eb57df', colorDark: '#804b7b', colorHover: '#f5a9ef'},
];
const tiers = [
  {name: "Rookie", color: colors.rookie + colors.opacityBackground, colorText: colors.rookie + colors.opacityText, colorGrid: colors.rookie + colors.opacityGrid},
  {name: "Iron", color: colors.iron + colors.opacityBackground, colorText: colors.iron + colors.opacityText, colorGrid: colors.iron + colors.opacityGrid},
  {name: "Bronze", color: colors.bronze + colors.opacityBackground, colorText: colors.bronze + colors.opacityText, colorGrid: colors.bronze + colors.opacityGrid},
  {name: "Silver", color: colors.silver + colors.opacityBackground, colorText: colors.silver + colors.opacityText, colorGrid: colors.silver + colors.opacityGrid},
  {name: "Gold", color: colors.gold + colors.opacityBackground, colorText: colors.gold + colors.opacityText, colorGrid: colors.gold + colors.opacityGrid},
  {name: "Platinum", color: colors.platinum + colors.opacityBackground, colorText: colors.platinum + colors.opacityText, colorGrid: colors.platinum + colors.opacityGrid},
  {name: "Diamond", color: colors.diamond + colors.opacityBackground, colorText: colors.diamond + colors.opacityText, colorGrid: colors.diamond + colors.opacityGrid},
  {name: "Master", color: colors.highmaster + colors.opacityBackground, color2: colors.master + colors.opacityBackground, colorText: colors.master + colors.opacityText, colorGrid: colors.master + colors.opacityGrid}, //color=gm color2=master
  {name: "High Master", color: colors.grandmaster + colors.opacityBackground, color2: colors.highmaster + colors.opacityBackground, colorText: colors.highmaster + colors.opacityText, colorGrid: colors.highmaster + colors.opacityGrid},
  {name: "Grand Master", color: colors.ultimatemaster + colors.opacityBackground, color2: colors.grandmaster + colors.opacityBackground, colorText: colors.grandmaster + colors.opacityText, colorGrid: colors.grandmaster + colors.opacityGrid},
  {name: "Ultimate Master", color: colors.legend + colors.opacityBackground, color2: colors.ultimatemaster + colors.opacityBackground, colorText: colors.ultimatemaster + colors.opacityText, colorGrid: colors.ultimatemaster + colors.opacityGrid},
  {name: "Legend", color: colors.legend + colors.opacityBackground, color2: colors.legend + colors.opacityBackground, colorText: colors.legend + colors.opacityText, colorGrid: colors.legend + colors.opacityGrid},
];

const isApexTier = (name) => ["Master", "High Master", "Grand Master", "Ultimate Master", "Legend"].includes(name);
const divisions = ["I", "II", "III", "IV", "V"];
let currentVersion = '';
let isScrolling = false;
let matches = [];
let lps = [];
let sessions = [];
let userDatasets = [];
let allData = [];
let champInfo = [];
let maxLength = 1;
let openedStats = '';
let yTicks = [];

let summonersInfo = {};
let ladder = [];
let ladderMaster = [];
let ladderCounter = 0;
let uniqueCounter = 0;
let minY = 0;
let maxY = 0;
let maxX = 0;
let staticMaxX = 0;
let masterY = 0;
let isApexReady = false;

const getUniqueCounter = () => {
  return "" + uniqueCounter++;
};

window.onload = () => {
  selectSort(null, 'sf6_seasons');
  
  closeAllAutocomplete();
  document.addEventListener("click", (e) => {
    closeAllAutocomplete();
  });
  document.getElementById('selectedSort').addEventListener('click', (e) => {
    e.stopPropagation();
    onSort();
  });
  
  fetchMatchesAndLps();
  document.addEventListener("scroll", (event) => {
    if(!isScrolling) {
      isScrolling = true;
    }
  });
  document.addEventListener("scrollend", (event) => {
    isScrolling = false;
  });
  
  let champInfoDiv = document.getElementById('champInfo');
  champInfoDiv.addEventListener('wheel', (event) => {
    event.preventDefault();
    champInfoDiv.scrollBy({
      left: event.deltaY < 0 ? -30 : 30,
    });
  }, {passive: false});
  
  document.getElementById('minXButton').addEventListener("click", (event) => {
    changeMinX();
  });
  document.getElementById('minX').addEventListener('keypress', (e) => {
    if(e.keyCode === 13)
      changeMinX();
  });
  document.getElementById('maxX').addEventListener('keypress', (e) => {
    if(e.keyCode === 13)
      changeMinX();
  });
};

const getNumber = (value, defaultValue) => {
  const num = parseInt(value);
  return isNaN(num) || num === 0 ? defaultValue : num;
}

const changeMinX = () => {
  let newMinX2 = getNumber(document.getElementById('minX').value, 0);
  let newMaxX = getNumber(document.getElementById('maxX').value, staticMaxX);
  let newMinX = newMinX2 > 0 && newMinX2 < newMaxX ? newMinX2 : 0;
  newMaxX = newMaxX < staticMaxX && newMaxX > newMinX2 ? newMaxX : staticMaxX;
  stackedLine.options.scales.x.min = newMinX;
  stackedLine.options.scales.x.max = newMaxX;
  
  let newMinY = 99999;
  let newMaxY = 0;
  userDatasets.forEach(u => {
    if(!u.hidden && u.data.length > newMinX) {
      for(let i = newMinX; i < u.data.length && i < newMaxX; i++) {
        newMinY = u.data[i].y < newMinY ? u.data[i].y : newMinY;
        newMaxY = u.data[i].y > newMaxY ? u.data[i].y : newMaxY;
      }
    }
  });
  newMinY = Math.floor((newMinY - 100) / 100) * 100;
  newMaxY = Math.ceil((newMaxY + 100) / 100) * 100;
  stackedLine.options.scales.y.min = newMinY;
  stackedLine.options.scales.y.max = newMaxY;
  minY = newMinY;
  maxY = newMaxY;
  
  stackedLine.update();
};

const getApexTiers = async() => {
  ladder.forEach((l, i) => {
    l.max = ladder[i + 1]?.min;
    const tier = tiers.find(t => t.name === l.tier);
    l.color = tier.color;
    l.colorText = tier.colorText;
    colorGrid = tier.colorGrid;
  });
  masterY = ladder[ladder.length - 1].min;
  maxY = 30000;
  
  for(let i = 0; i < 30000; i += 200) {
    yTicks.push({value: i});
  }
  isApexReady = true;
  start();
};

const init = () => {
  matches = [];
  lps = [];
  sessions = [];
  userDatasets = [];
  allData = [];
  champInfo = [{
    id: -1,
    name: 'All Fighters',
    games: 0,
    wins: 0,
    losses: 0,
    totalLp: 0,
    totalMrLp: 0,
    vsCharacters: [],
  }];
  maxLength = 1;
  openedStats = '';

  summonersInfo = {};
  uniqueCounter = 0;
  ladderCounter = 0;
  ladder = [
    {id: 1, tier: 'Rookie', symbol: 'R', division: '1', min: 0},
    {id: 2, tier: 'Rookie', symbol: 'R', division: '2', min: 200},
    {id: 3, tier: 'Rookie', symbol: 'R', division: '3', min: 400},
    {id: 4, tier: 'Rookie', symbol: 'R', division: '4', min: 600},
    {id: 5, tier: 'Rookie', symbol: 'R', division: '5', min: 800},
    {id: 6, tier: 'Iron', symbol: 'I', division: '1', min: 1000},
    {id: 7, tier: 'Iron', symbol: 'I', division: '2', min: 1400},
    {id: 8, tier: 'Iron', symbol: 'I', division: '3', min: 1800},
    {id: 9, tier: 'Iron', symbol: 'I', division: '4', min: 2200},
    {id: 10, tier: 'Iron', symbol: 'I', division: '5', min: 2600},
    {id: 11, tier: 'Bronze', symbol: 'B', division: '1', min: 3000},
    {id: 12, tier: 'Bronze', symbol: 'B', division: '2', min: 3400},
    {id: 13, tier: 'Bronze', symbol: 'B', division: '3', min: 3800},
    {id: 14, tier: 'Bronze', symbol: 'B', division: '4', min: 4200},
    {id: 15, tier: 'Bronze', symbol: 'B', division: '5', min: 4600},
    {id: 16, tier: 'Silver', symbol: 'S', division: '1', min: 5000},
    {id: 17, tier: 'Silver', symbol: 'S', division: '2', min: 5800},
    {id: 18, tier: 'Silver', symbol: 'S', division: '3', min: 6600},
    {id: 19, tier: 'Silver', symbol: 'S', division: '4', min: 7400},
    {id: 20, tier: 'Silver', symbol: 'S', division: '5', min: 8200},
    {id: 21, tier: 'Gold', symbol: 'G', division: '1', min: 9000},
    {id: 22, tier: 'Gold', symbol: 'G', division: '2', min: 9800},
    {id: 23, tier: 'Gold', symbol: 'G', division: '3', min: 10600},
    {id: 24, tier: 'Gold', symbol: 'G', division: '4', min: 11400},
    {id: 25, tier: 'Gold', symbol: 'G', division: '5', min: 12200},
    {id: 26, tier: 'Platinum', symbol: 'P', division: '1', min: 13000},
    {id: 27, tier: 'Platinum', symbol: 'P', division: '2', min: 14200},
    {id: 28, tier: 'Platinum', symbol: 'P', division: '3', min: 15400},
    {id: 29, tier: 'Platinum', symbol: 'P', division: '4', min: 16600},
    {id: 30, tier: 'Platinum', symbol: 'P', division: '5', min: 17800},
    {id: 31, tier: 'Diamond', symbol: 'D', division: '1', min: 19000},
    {id: 32, tier: 'Diamond', symbol: 'D', division: '2', min: 20200},
    {id: 33, tier: 'Diamond', symbol: 'D', division: '3', min: 21400},
    {id: 34, tier: 'Diamond', symbol: 'D', division: '4', min: 22600},
    {id: 35, tier: 'Diamond', symbol: 'D', division: '5', min: 23800},
    {id: 36, tier: 'Master', symbol: 'M', division: '', min: 25000},
  ];
  ladderMaster = [
    {id: 36, tier: 'Master', symbol: 'M', min: 1500},
    {id: 40, tier: 'High Master', symbol: 'HM', min: 1600},
    {id: 41, tier: 'Grand Master', symbol: 'GM', min: 1700},
    {id: 42, tier: 'Ultimate Master', symbol: 'UM', min: 1800},
    {id: 37, tier: 'Legend', symbol: 'L', min: 0},
  ];
  yTicks = [];
  isApexReady = false;
  document.getElementById('champInfo').innerText = '';
  document.getElementById('gameCards').innerText = '';
};

const fetchMatchesAndLps = () => {
  init();
  getApexTiers();
  getMatches(currentSort.type);
};

const closeAllAutocomplete = () => {
  document.getElementById('sortOptions').classList.add("!hidden");
};

const getMatches = async(season) => {
  const response = await fetch('https://api.sardflix.com/sf6_matches?season=' + season);
  if(response.status !== 200) {
    document.getElementById('container').innerHTML = 'Error';
  } else {
    const allMatches = await response.json();
    matches = Array.isArray(allMatches) ? allMatches : allMatches.matches;
    lp = allMatches?.lp;
    start();
  }
};

const start = async() => {
  if(isApexReady && matches.length > 0){
    allData = formatData1();
    userDatasets = formatData2(allData);
    userDatasets.forEach((u, i) => {
      if(u.data.length > maxLength)
        maxLength = u.data.length;
    });
    initChart();
    allData.sort((a, b) => b.timestamp - a.timestamp);
    //let response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    //let versions = await response.json();
    //currentVersion = versions[0];
    initCards(allData);
  }
};

const updateTimer = (gameId, startTimestamp) => {
  let seconds = Math.floor(((new Date()).getTime() - startTimestamp) / 1000);
  let minutes = Math.floor(seconds / 60);
  let sec = seconds % 60;
  let element = document.getElementById('current_' + gameId);
  if(element)
    element.textContent = `~ ${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const initCards = (allData) => {
  let currentSession = -1;
  let gameCards = document.getElementById('gameCards');
  allData.forEach(d => {
    
    let newEl = document.createElement('div');
    newEl.id = d.replayId;
    
    let lpDiff = '';
    let mrLpDiff = '';
    let hoverClassName = '';
    if(d.outcome === 1) {
      newEl.className = 'card win !h-[90px]';
      hoverClassName = 'winHover';
      lpDiff = `(+${d.lpDiff})`;
      mrLpDiff = `(+${d.mrLpDiff})`;
    } else if (d.outcome === 0) {
      newEl.className = 'card lose !h-[90px]';
      hoverClassName = 'loseHover';
      lpDiff = d.lpDiff === 0 ? `(-${d.lpDiff})` : `(${d.lpDiff})`;
      mrLpDiff = d.mrLpDiff === 0 ? `(-${d.mrLpDiff})` : `(${d.mrLpDiff})`;
    } else {
      newEl.className = 'card remake !h-[90px]';
      hoverClassName = 'remakeHover';
    }
    if(summonersInfo[d.character] && summonersInfo[d.character].hidden){
      newEl.classList.add('!hidden');
    } else {
      newEl.classList.add('!flex');
    }
    if(d.lpDiff == null || d.lp === -1)
      lpDiff = '';
    if(d.mrLpDiff == null)
      mrLpDiff = '';
    
    let character = `
      <img class="w-[18px] h-[18px] mb-[-10px] rounded-[4px] z-10" src="assets/icon_controltype${d.battleInputType}.png">
      <div class="flex justify-center items-center w-[50px] h-[50px] max-w-none relative tooltipPopupCharacter">
        <img class="w-[50px] h-[50px] max-w-none" src="assets/characters/character_${d.characterId}_l.png" alt="${d.character}">
        <span class="tooltipPopupCharacterText">${d.character}</span>
      </div>
    `;
    let vsCharacter = `
      <img class="w-[18px] h-[18px] mb-[-10px] rounded-[4px] z-10" src="assets/icon_controltype${d.vsBattleInputType}.png">
      <div class="flex justify-center items-center w-[50px] h-[50px] max-w-none relative tooltipPopupCharacter">
        <img class="w-[50px] h-[50px] max-w-none" src="assets/characters/character_${d.vsCharacterId}_r.png" alt="${d.vsCharacter}">
        <span class="tooltipPopupCharacterText">${d.vsCharacter}</span>
      </div>
    `;
    let twTierColor = textColorsForRetardedTailwind[d.newTier?.toLowerCase()];
    let twVsTierColor = textColorsForRetardedTailwind[d.vsTier?.toLowerCase()];
    let lp = `
      <span class="text-[10px] mr-[2px] ${twTierColor}">${d.newSymbol ? d.newSymbol : ''}${d.newDivision ? d.newDivision : ''}</span>
      <span class="mr-[2px] ${twTierColor}">${d.newLp ? d.newLp : '?'}</span>
      <span class="text-[10px] mr-[3px] ${twTierColor}">LP</span>
      <span class="text-[12px] ${twTierColor}">${lpDiff}</span>
    `;
    let mr = `
      <span class="text-[10px] mr-[2px]">${d.newMrSymbol ? d.newMrSymbol : ''}${d.newMrDivision ? d.newMrDivision : ''}</span>
      <span class="mr-[2px]">${d.newMrLp != null ? d.newMrLp : '?'}</span>
      <span class="text-[10px] mr-[3px]">MR</span>
      <span class="text-[12px]">${mrLpDiff}</span>
    `;
    let vsLp = `
      <span class="text-[10px] ${twVsTierColor}">${d.vsSymbol ? d.vsSymbol : ''}${d.vsDivision ? d.vsDivision : ''}</span>
      <span class="ml-[2px] ${twVsTierColor}">${d.vsLp ? d.vsLp : '?'}</span>
      <span class="text-[10px] ml-[2px] ${twVsTierColor}">LP</span>
    `;
    let vsMr = `
      <span class="text-[10px]">${d.vsMrSymbol ? d.vsMrSymbol : ''}${d.vsMrDivision ? d.vsMrDivision : ''}</span>
      <span class="ml-[2px]">${d.vsMrLp != null ? d.vsMrLp : '?'}</span>
      <span class="text-[10px] ml-[2px]">MR</span>
    `;
    let rounds = '';
    for(let i = 0; i < d.rounds.length; i++) {
      rounds += `<img class="w-[31px] h-[16px]${i > 0 ? ' ml-[-6px]' : ''}" src="assets/outcomes/icon_result${d.rounds[i]}_l.png">`;
    }
    let vsRounds = '';
    for(let i = 0; i < d.vsRounds.length; i++) {
      vsRounds += `<img class="w-[31px] h-[16px]${i > 0 ? ' ml-[-6px]' : ''}" src="assets/outcomes/icon_result${d.vsRounds[i]}_r.png">`;
    }
    
    if(d.session !== -1 && d.session !== currentSession) {
      currentSession = d.session;
      let session = sessions.find(s => s.id === d.session);
      let newSessionEl = document.createElement('div');
      let notHiddenSummoners = [];
      
      session.summoners.forEach(summoner => {
        if(!summonersInfo[summoner].hidden && !notHiddenSummoners.includes(summoner))
          notHiddenSummoners.push(summoner);
      });
      session.notHiddenSummoners = notHiddenSummoners;
      session.isHidden = false;
      
      newSessionEl.innerHTML = `<div class="flex items-center mb-[4px] mt-[10px] p-[6px] text-[20px] font-semibold !block"></div>`;
      gameCards.append(newSessionEl);
      session.element = newSessionEl;
    }
    
    let date = new Date(d.timestamp * 1000);
    newEl.innerHTML += `
      <div class="flex justify-between text-[12px] opacity-80">
        <a class="cursor-pointer transition-colors duration-200 ease-out hover:text-white overflow-hidden whitespace-nowrap text-ellipsis" href="https://www.streetfighter.com/6/buckler/profile/${d.fighterId}" rel="noopener noreferrer" target="_blank">Sardoche VS ${d.vsFighter}</a>
        <div class="pl-[6px] shrink-0">${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</div>
      </div>
      <div class="flex grow text-[14px]">
        <div class="flex justify-end items-center">
          <div class="flex flex-col justify-center items-center">${character}</div>
        </div>
        <div class="flex flex-col justify-center items-start grow ml-[4px]">
          <div class="pt-[4px] flex items-baseline">${lp}</div>
          <div class=" flex items-baseline">${mr}</div>
          <div class=" flex mt-[4px]">${rounds}</div>
        </div>
        <div class="flex flex-col justify-center items-end grow mr-[4px]">
          <div class="pt-[4px] flex items-baseline">${vsLp}</div>
          <div class=" flex items-baseline">${vsMr}</div>
          <div class="flex mt-[4px]">${vsRounds}</div>
        </div>
        <div class="flex justify-end items-center">
          <div class="flex flex-col justify-center items-center">${vsCharacter}</div>
        </div>
      </div>
    `;
    newEl.addEventListener('mouseenter', event => {
      newEl.classList.add(hoverClassName);
      userDatasets.forEach(dataset => {
        dataset.segment.borderColor = (ctx) => {
          if(ctx.p1.raw.replayId === d.replayId)
            return ctx.p1.raw.colorHover;
          else
            return ctx.p1.raw.color;
        };
        dataset.pointBackgroundColor = dataset.data.map(data => {
          if(data.replayId === d.replayId)
            return data.colorHover;
          else
            return data.color;
        });
        //make curve appear in front when hovered
        if(dataset.label === d.name) {
          dataset.order = -1;
          dataset.type = 'shadowLine';
        } else if(dataset.order !== dataset.defaultOrder) {
          dataset.order = dataset.defaultOrder;
          dataset.type = 'line';
        }
      });
      stackedLine.update();
    });
    newEl.addEventListener('mouseleave', event => {
      newEl.classList.remove(hoverClassName);
      userDatasets.forEach(dataset => {
        dataset.segment.borderColor = (ctx) => {
          if(ctx.p1.raw.replayId === d.replayId)
            return ctx.p1.raw.colorHover;
          else
            return ctx.p1.raw.color;
        };
        dataset.pointBackgroundColor = dataset.data.map(data => {
          if(data.replayId === d.replayId)
            return data.colorHover;
          else
            return data.color;
        });
      });
      stackedLine.update();
    });
    gameCards.append(newEl);
    d.element = newEl;
  });
  
  gameCards.addEventListener('mouseleave', event => {
    userDatasets.forEach(dataset => {
      if(dataset.order !== dataset.defaultOrder) {
        dataset.order = dataset.defaultOrder;
        dataset.type = 'line';
      }
    });
    stackedLine.update();
  });
  
  champInfo.sort((a, b) => b.games - a.games);
  champInfo.forEach((c, i) => {
    c.vsCharacters.sort((a, b) => b.games - a.games);
    let champInfoDiv = document.createElement('div');
    champInfoDiv.className = 'flex items-center mr-[8px] text-[14px] rounded-[6px] bg-[#3c3c3c] cursor-pointer';
    let champIconUrl = i === 0 ? 'assets/champion.svg' : `assets/characters/character_${c.id}_l.png`;
    let champTxt = `
      <div class="flex justify-center items-center w-[25px] h-[25px] rounded-[6px] overflow-hidden">
        <img class="w-[30px] h-[30px] max-w-none" src="${champIconUrl}" alt="${c.name}" />
      </div>
      <div class="flex justify-center items-center p-[4px] h-[25px] rounded-[6px] overflow-hidden">${c.games}</div>
    `;
    champInfoDiv.innerHTML = champTxt;
    champInfoDiv.addEventListener('click', (e) => {
      if(c.name !== openedStats) {
        openedStats = c.name;
        let statsFormated = [
          {key: 'Winrate', value: Number(Math.round((c.wins / c.games * 100) + "e+1")  + "e-1") + '% (' + c.wins + '<span class="text-[12px] opacity-60">W</span> - ' + c.losses + '<span class="text-[12px] opacity-60">L</span>)'},
          {key: 'LP gained', value: c.totalLp + ' (' + (c.totalLp / c.games).toFixed(0), unit: '/game'},
          {key: 'MR gained', value: c.totalMrLp + ' (' + (c.totalMrLp / c.games).toFixed(0), unit: '/game'},
        ];
        c.vsCharacters.forEach(v => statsFormated.push({key: `<img class="w-[20px] h-[20px] mr-[4px] max-w-none" src="assets/characters/character_${v.id}_l.png" alt="${v.name}" />` + v.name, value: Number(Math.round((v.wins / v.games * 100) + "e+1")  + "e-1") + '% (' + v.wins + '<span class="text-[12px] opacity-60">W</span> - ' + v.losses + '<span class="text-[12px] opacity-60">L</span>)'}));
        let champStats = `<div class="w-full text-center mb-[6px]">${c.name}</div>`;
        statsFormated.forEach(s => {
          champStats += `
            <div class="flex flex-col justify-center mb-[10px] mx-[5px] py-[6px] px-[10px] bg-[#5c5c5c26] border-[1px] border-[#5c5c5c] rounded-[8px]">
              <div class="text-[12px] opacity-60 mb-[2px] flex items-center">${s.key}</div>
              <div class="text-[14px] opacity-100">${s.value}${s.unit ? '<span class="text-[12px] opacity-60">' + s.unit + '</span>)' : ''}</div>
            </div>
          `;
        });
        document.getElementById('champDetails').innerHTML = champStats;
      } else {
        openedStats = '';
        document.getElementById('champDetails').innerHTML = '';
      }
    });
    document.getElementById('champInfo').appendChild(champInfoDiv);
  });
  
  refreshSessions(null);
};

const refreshSessions = (summoner) => {
  sessions.forEach(s => {
    if(!s.isHidden && s.notHiddenSummoners.length === 0) {
      s.element.children[0].classList.remove('!block');
      s.element.children[0].classList.add('!hidden');
      s.isHidden = true;
    } else if(s.isHidden && s.notHiddenSummoners.length > 0) {
      s.element.children[0].classList.remove('!hidden');
      s.element.children[0].classList.add('!block');
      s.isHidden = false;
    }
    
    if(summoner === null || (s.notHiddenSummoners.length > 0 && s.summoners.includes(summoner))) {
      setSessionDiv(s);
    }
  });
};
const setSessionDiv = (session) => {
  let wins = 0;
  let losses = 0;
  for(let key in session.details) {
    if(session.notHiddenSummoners.includes(key)) {
      wins += session.details[key].wins;
      losses += session.details[key].losses;
    }
  }
  session.element.children[0].innerHTML = `
    <div class="inline-flex items-center">
      <span>SESSION: ${wins}</span>
      <span class="my-0 mx-[1px] text-[16px] font-normal opacity-40">/</span>
      <span>${losses}</span>
      <span class="my-0 mx-[6px] text-[16px] font-normal opacity-40">&mdash;</span>
      <span>${(wins / (wins + losses) * 100).toFixed(1)}%</span>
    </div>
  `;
};

const findNextGame = (game, index, type = 'none') => {
  let nextGame = matches[index + 1];
  if(nextGame && (nextGame.fighter_id !== game.fighter_id || nextGame.character_id !== game.character_id || (type === 'none' || (type === 'lp' && nextGame.league_point === -1) || (type === 'mr' && nextGame.master_rating === 0))))
    nextGame = matches.find((m, i) => i > index && m.fighter_id === game.fighter_id && m.character_id === game.character_id && (type === 'none' || (type === 'lp' && m.league_point !== -1) || (type === 'mr' && m.master_rating !== 0)));
  return nextGame;
};

const formatData1 = () => {
  let allData = [];
  let sessionCounter = 0;
  matches.forEach((g, i) => {
    let nextGame = findNextGame(g, i);
    if(!nextGame)
      nextGame = lp.find(l => l.fighter_id === g.fighter_id && l.character_id === g.character_id);
    
    let newTier = ladder.find(l => l.id === nextGame.league_rank);
    let newMrTier = ladderMaster.find(l => l.id === nextGame.master_rank);
    let vsTier = ladder.find(l => l.id === g.vs_league_rank);
    let vsMrTier = ladderMaster.find(l => l.id === g.vs_master_rank);
    let lpDiff = nextGame.league_point - g.league_point;
    let mrLpDiff = nextGame.master_rating - g.master_rating;
    allData.push({
      id: g.id,
      replayId: g.replay_id,
      version: g.version,
      timestamp: g.timestamp,
      outcome: g.is_victory,
      fighterId: g.fighter_id,
      character: g.character,
      characterId: g.character_id,
      battleInputType: g.battle_input_type,
      rounds: g.rounds.split(';'),
      lp: g.league_point,
      newLp: nextGame.league_point,
      placementLp: nextGame.league_point === -1 ? findNextGame(g, i, 'lp')?.league_point : null,
      lpDiff: lpDiff,
      newTier: newTier?.tier,
      newDivision: newTier?.division,
      newSymbol: newTier?.symbol,
      mrLp: g.master_rating,
      newMrLp: nextGame.master_rating,
      placementMrLp: nextGame.master_rating === 0 ? findNextGame(g, i, 'mr')?.master_rating : null,
      mrLpDiff: mrLpDiff,
      mrRank: g.master_ranking,
      mrTier: g.master_rank,
      newMrTier: newMrTier?.tier,
      newMrDivision: newMrTier?.division,
      newMrSymbol: newMrTier?.symbol,
      vsFighter: g.vs_fighter,
      vsFighterId: g.vs_fighter_id,
      vsCharacter: g.vs_character,
      vsCharacterId: g.vs_character_id,
      vsBattleInputType: g.vs_battle_input_type,
      vsRounds: g.vs_rounds.split(';'),
      vsLp: g.vs_league_point,
      vsTier: vsTier?.tier,
      vsDivision: vsTier?.division,
      vsSymbol: vsTier?.symbol,
      vsMrLp: g.vs_master_rating,
      vsMrRank: g.vs_master_ranking,
      vsMrTier: vsMrTier?.tier,
      vsMrDivision: vsMrTier?.division,
      vsMrSymbol: vsMrTier?.symbol,
      y: nextGame.league_point,
      session: sessionCounter,
    });
    
    //champions stats
    if(g.is_victory <= 1) {
      let cInfo = champInfo.find(c => c.id === g.character_id);
      if(!cInfo) {
        let cIndex = champInfo.push({
          id: g.character_id,
          name: g.character,
          games: 0,
          wins: 0,
          losses: 0,
          totalLp: 0,
          totalMrLp: 0,
          vsCharacters: [],
        });
        cInfo = champInfo[cIndex - 1];
      }
      addDataToCInfo(champInfo[0], g, lpDiff, mrLpDiff);
      addDataToCInfo(cInfo, g, lpDiff, mrLpDiff);
    }
    
    sessionCounter += (matches[i + 1] && matches[i + 1].timestamp > g.timestamp + 14400) ? 1 : 0;//4 hours
  });
  
  //sessions stats
  allData.forEach(d => {
    if(d.session !== -1) {
      let session = sessions.find(s => s.id === d.session);
      if(!session) {
        let sIndex = sessions.push({
          id: d.session,
          details: {},
          summoners: [],
        });
        session = sessions[sIndex - 1];
      }
      if(session.details[d.character] === undefined) {
        session.details[d.character] = {
          wins: 0,
          losses: 0,
        };
        session.summoners.push(d.character);
      }
      
      session.details[d.character].wins += d.outcome === 1 ? 1 : 0;
      session.details[d.character].losses += d.outcome === 0 ? 1 : 0;
    }
  });
  return allData;
};

const addDataToCInfo = (cInfo, g, lpDiff, mrLpDiff) => {
  let vsCharacter = cInfo.vsCharacters.find(c => c.id === g.vs_character_id);
  if(!vsCharacter) {
    let characterCount = cInfo.vsCharacters.push({
      id: g.vs_character_id,
      name: g.vs_character,
      games: 0,
      wins: 0,
      losses: 0,
    });
    vsCharacter = cInfo.vsCharacters[characterCount - 1];
  }
    
  cInfo.games += 1;
  vsCharacter.games += 1;
  if(g.is_victory) {
    cInfo.wins += 1;
    vsCharacter.wins += 1;
  } else {
    cInfo.losses += 1;
    vsCharacter.losses += 1;
  }
  cInfo.totalLp += lpDiff;
  cInfo.totalMrLp += mrLpDiff;
};

const formatData2 = (allData) => {
  let newUserDatasets = [];
  let summoners = [];
  matches.forEach((m, mIndex) => {
    const currentSummoner = summoners.find(s => s.character === m.character);
    if(currentSummoner)
      currentSummoner.lastIndex = mIndex;
    else
      summoners.push({character: m.character, lastIndex: 0});
  });
  
  //find the order accounts were last played on to not have an old curve overlaping a new one
  summoners.forEach(s1 => {
    let count = 1;
    summoners.forEach(s2 => {
      if(s1.lastIndex < s2.lastIndex)
        count++;
    });
    s1.order = count;
  });
  
  let curvesHiddenVisibility = localStorage.getItem("curves-hidden-visibility");
  curvesHiddenVisibility = curvesHiddenVisibility ? JSON.parse(curvesHiddenVisibility) : {};
  
  summoners.forEach((s, sIndex) => {
    let summoner_graph = summonersInfo[s.character];
    if(!summoner_graph) {
      summonersInfo[s.character] = {minY: 999999, maxY: 0, nbGame: 0, hidden: curvesHiddenVisibility[s.character] ? true : false};
      summoner_graph = summonersInfo[s.character];
    }
    
    let playerData = [];
    let counter = 1;
    allData.forEach((g, i) => {
      if(g.character === s.character) {
        let lpWithoutPlacement = g.newLp === -1 ? g.placementLp : g.newLp;
        
        if(playerData.length === 0) {
          playerData.push({
            x: 0,
            color: g.outcome === 1 ? curvesColors[sIndex].colorLight : (g.outcome === 0 ? curvesColors[sIndex].colorDark : '#b4b4b4'),
            colorHover: curvesColors[sIndex].colorHover,
            ...g,
            y: lpWithoutPlacement,
            replayId: getUniqueCounter(),
          });
        }
        
        summoner_graph.nbGame = counter;
        if(lpWithoutPlacement < summoner_graph.minY)
          summoner_graph.minY = lpWithoutPlacement;
        if(lpWithoutPlacement > summoner_graph.maxY)
          summoner_graph.maxY = lpWithoutPlacement;
        
        playerData.push({
          x: counter,
          color: g.outcome === 1 ? curvesColors[sIndex].colorLight : (g.outcome === 0 ? curvesColors[sIndex].colorDark : '#b4b4b4'),
          colorHover: curvesColors[sIndex].colorHover,
          ...g,
          y: lpWithoutPlacement,
        });
        counter++;
      }
    });
    
    newUserDatasets.push({
      type: 'line',
      label: s.character,
      data: playerData,
      fill: false,
      pointRadius: playerData.map((p, i) => i === 0 ? 0 : 4),
      pointHoverRadius: playerData.map((p, i) => i === 0 ? 0 : 6),
      pointHitRadius: 5,
      pointBorderWidth: 0,
      pointHoverBackgroundColor: curvesColors[sIndex].colorHover,
      pointHoverBorderWidth: 0,
      pointBackgroundColor: playerData.map((p, i) => p.color),
      segment: {
        borderColor: ctx => playerData[ctx.p1DataIndex].color,
        borderDash: ctx => playerData[ctx.p1DataIndex].outcome >= 2 ? [2, 1] : undefined,
      },
      order: s.order,
      hidden: summonersInfo[s.character].hidden ? true : false,
      
      //custom prop
      defaultOrder: s.order,
      defaultColor: curvesColors[sIndex].colorLight,
    });
  });
  
  const visibleData = filterHidden(summonersInfo);

  minY = Math.min(...visibleData.map(item => item[1].minY));
  maxY = Math.max(...visibleData.map(item => item[1].maxY));
  maxX = Math.max(...visibleData.map(item => item[1].nbGame));
  staticMaxX = maxX;
  minY = Math.floor((minY - 100) / 100) * 100;
  maxY = Math.ceil((maxY + 100) / 100) * 100;
  return newUserDatasets;
};

const filterHidden = (obj) => Object.entries(obj).filter(([key, value]) => !value.hidden);

class ShadowLine extends Chart.LineController {
  draw() {
    const ctx = this.chart.ctx;
    const _stroke = ctx.stroke;
    const meta = this.getMeta();
    const color = meta._dataset.defaultColor;
    ctx.stroke = function() {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      _stroke.apply(this, arguments);
    };
    super.draw(arguments);
    ctx.stroke = _stroke;
  }
};
ShadowLine.id = 'shadowLine';
ShadowLine.defaults = Chart.LineController.defaults;
Chart.register(ShadowLine);

let stackedLine;
const initChart = () => {
  if(stackedLine) {
    stackedLine?.destroy();
  }
  
  let tierDatasets = [];
  ladder.forEach(o => {
    if(o.division === "5") {
      tierDatasets.push({
        label: o.tier,
        data: [
          {x: 0, y: o.max},
          {x: maxLength, y: o.max},
        ],
        fill: o.tier === "Rookie" ? 'start' : '-1',
        borderColor: 'rgba(0, 0, 0, 0)',
        backgroundColor: (context) => {
          return o.color;
        },
        pointRadius: 0,
        showTooltips: false,
        order: 100,
      });
    }
  });


  const data = {
    //labels: labels,
    datasets: [...userDatasets, ...tierDatasets]
  };

  const zoomOptions = {
    limits: {
      //x: {min: 0, max: maxLength},
      //y: {min: 0, max: ladder[ladder.length - 1].max + 1}
      //x: {min: 'original', max: 'original'},
      //y: {min: 'original', max: 'original'},
    },
    pan: {
      enabled: true,
      mode: 'xy',
      scaleMode: 'xy',
      //onPanComplete({chart}) {
      //  chart.update('none');
      //}
    },
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: true
      },
      mode: 'xy',
      scaleMode: 'xy',
      onZoomComplete({chart}) {
        chart.update();
      }
    }
  };
  
  Chart.defaults.color = 'rgb(200, 200, 200)';
  stackedLine = new Chart(document.getElementById('eloGraph'), {
      type: 'line',
      data: data,
      options: {
        animation: {
          duration: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            axis: 'y',
            type: 'linear',
            beginAtZero: false,
            min: minY,
            max: maxY,
            display: true,
            afterBuildTicks: (axis) => {
              axis.ticks = yTicks;
            },
            ticks: {
              offset: false,
              autoSkip: false,
              includeBounds: false,
              color: (tick) => {
                let found = ladder.find(l => tick.tick.value >= l.min && tick.tick.value < l.max);
                return found && found.colorText ? found.colorText : 'rgb(200, 200, 200)';
              },
              callback: function(value, index, ticks) {
                let l = ladder.find(o => value === o.min);
                if(!l || value < minY || value > maxY)
                  return '';
                return l.tier + ' ' + l.division;
              },
            },
            grid: {
              color: (tick) => {
                let found = ladder.find(l => tick.tick.value >= l.min && tick.tick.value < l.max);
                let color = found && found.colorGrid ? found.colorGrid : 'rgba(200, 200, 200, 0.08)';
                return tick.tick.value >= minY && tick.tick.value <= maxY ? color : '';
              },
              tickBorderDash: [5, 5],
              z: 1
            },
            border: {
              width: 0,
              dash: [5, 5],
            },
          },
          x: {
            axis: 'x',
            type: 'linear',
            beginAtZero: true,
            min: 0,
            max: maxX + 1,
            ticks: {
              offset: true,
              stepSize: 1,
              autoSkip: true,
              includeBounds: false,
              callback: function(value, index, ticks) {
                if(value % 5 === 0 || value === maxLength - 1) {
                  return value;
                }
              },
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.08)',
              tickBorderDash: [5, 5],
            },
            border: {
              width: 0,
              dash: [5, 5],
            },
          }
        },
        onClick: function(event, elements) {
          if (elements.length && elements[0].element.raw) {
            let raw = elements[0].element.raw;
            allData.forEach(currentGame => {
              if(currentGame.replayId === raw.replayId) {
                currentGame.element.scrollIntoView({behavior: "smooth", block: "center"});
              }
            });
          }
        },
        onHover: function(event, elements) {
          const canvas = event.native.target;
          canvas.style.cursor = elements.length ? 'pointer' : 'default';
          
          if (elements.length && elements[0].element.raw) {
            var index = elements[0].index;
            var datasetIndex = elements[0].datasetIndex;
            data.datasets[datasetIndex].segment.borderColor = ctx => ctx.p1DataIndex === index ? data.datasets[datasetIndex].data[ctx.p1DataIndex].colorHover : data.datasets[datasetIndex].data[ctx.p1DataIndex].color;
            
            let raw = elements[0].element.raw;
            allData.forEach(currentGame => {
              if(currentGame.replayId === raw.replayId) {
                if(!isScrolling) {
                  switch(currentGame.outcome) {
                    case 1:
                      currentGame.element.classList.remove('win');
                      currentGame.element.classList.add('winHover');
                      break;
                    case 0:
                      currentGame.element.classList.remove('lose');
                      currentGame.element.classList.add('loseHover');
                      break;
                    default:
                      currentGame.element.classList.remove('remake');
                      currentGame.element.classList.add('remakeHover');
                  }
                }
              } else {
                switch(currentGame.outcome) {
                  case 1:
                    currentGame.element.classList.remove('winHover');
                    currentGame.element.classList.add('win');
                    break;
                  case 0:
                    currentGame.element.classList.remove('loseHover');
                    currentGame.element.classList.add('lose');
                    break;
                  default:
                    currentGame.element.classList.remove('remakeHover');
                    currentGame.element.classList.add('remake');
                }
              }
            });
            
          } else {
            data.datasets.forEach((dataset, i) => {
              if(dataset.segment)
                dataset.segment.borderColor = ctx => dataset.data[ctx.p1DataIndex].color;
            });
            
            allData.forEach(d => {
              if(d.element) {
                switch(d.outcome) {
                  case 1:
                    d.element.classList.remove('winHover');
                    d.element.classList.add('win');
                    break;
                  case 0:
                    d.element.classList.remove('loseHover');
                    d.element.classList.add('lose');
                    break;
                  default:
                    d.element.classList.remove('remakeHover');
                    d.element.classList.add('remake');
                }
              }
            });
          }
          stackedLine.update();
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
        plugins: {
          legend: {
            labels: {
              generateLabels: function(chart) {
                let labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                labels.forEach(label => label.datasetIndex < userDatasets.length ? label.fillStyle = curvesColors[label.datasetIndex].colorLight : null);
                return labels;
              },
              filter: (item, chartData) => !tiers.some(t => t.name === item.text),
              sort: (a, b, chartData) =>  chartData.datasets.find(d => d.label === a.text).defaultOrder - chartData.datasets.find(d => d.label === b.text).defaultOrder,
              usePointStyle: true,
              pointStyle: 'rectRounded'
            },
            onHover: (event, legendItem, legend) => {
              event.native.target.style.cursor = 'pointer';
            },
            onLeave: (event, legendItem, legend) => {
              event.native.target.style.cursor = 'default';
            },
            onClick: (event, legendItem, legend) => {
              let summoner_graph = summonersInfo[legendItem.text];
              const index = legendItem.datasetIndex;
              const ci = legend.chart;
              
              // Base on click action, need because overdrive
              if (ci.isDatasetVisible(index)) {
                legendItem.hidden = true;
                summoner_graph.hidden = true;
              } else {
                legendItem.hidden = false;
                summoner_graph.hidden = false;
              }
              
              userDatasets.forEach(dataset => {
                if(dataset.label === legendItem.text) {
                  dataset.hidden = ci.isDatasetVisible(index);
                }
              });
              
              const visibleData = filterHidden(summonersInfo);

              minY = Math.min(...visibleData.map(item => item[1].minY));
              maxY = Math.max(...visibleData.map(item => item[1].maxY));
              maxX = Math.max(...visibleData.map(item => item[1].nbGame));
              minY = Math.floor((minY - 100) / 100) * 100;
              maxY = Math.ceil((maxY + 100) / 100) * 100;

              stackedLine.options.scales.y.min= minY;
              stackedLine.options.scales.y.max = maxY;
              stackedLine.options.scales.x.max = maxX + 1;
              stackedLine.update();

              allData.forEach(d => {
                if(d.name === legendItem.text) {
                  if(legendItem.hidden){
                    d.element.classList.remove('!flex');
                    d.element.classList.add('!hidden');
                  } else {
                    d.element.classList.remove('!hidden');
                    d.element.classList.add('!flex');
                  }
                }
              });
              
              sessions.forEach(s => {
                if(s.summoners.includes(legendItem.text)) {
                  if(legendItem.hidden)
                    s.notHiddenSummoners.splice(s.notHiddenSummoners.indexOf(legendItem.text), 1);
                  else
                    s.notHiddenSummoners.push(legendItem.text);
                }
              });
              refreshSessions(legendItem.text);
              
              let curvesHiddenVisibility = localStorage.getItem("curves-hidden-visibility");
              let newCurvesHiddenVisibility = curvesHiddenVisibility ? {...JSON.parse(curvesHiddenVisibility), [legendItem.text]: legendItem.hidden} : {[legendItem.text]: legendItem.hidden};
              localStorage.setItem("curves-hidden-visibility", JSON.stringify(newCurvesHiddenVisibility));
            }
          },
          tooltip: {
            enabled: false,
            external: (context) => {
              let tooltipEl = document.getElementById('chartjs-tooltip');

              if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                document.body.appendChild(tooltipEl);
              }

              // Hide if no tooltip
              const tooltipModel = context.tooltip;
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }

              // Set Text
              if (tooltipModel.body) {
                const tooltipName = tooltipModel.dataPoints[0].raw.name;
                const date = new Date(tooltipModel.dataPoints[0].raw.timestamp * 1000);
                const tooltipOutcome = tooltipModel.dataPoints[0].raw.outcome;
                
                const tooltipChampion = tooltipModel.dataPoints[0].raw.character;
                const tooltipChampionId = tooltipModel.dataPoints[0].raw.characterId;
                const tooltipLane = tooltipModel.dataPoints[0].raw.battleInputType;
                const tooltipTier = tooltipModel.dataPoints[0].raw.newTier;
                const tooltipSymbol = tooltipModel.dataPoints[0].raw.newSymbol;
                const tooltipDivision = tooltipModel.dataPoints[0].raw.newDivision;
                const tooltipLp = tooltipModel.dataPoints[0].raw.newLp;
                const tooltipLpDiff = tooltipModel.dataPoints[0].raw.lpDiff;
                
                const tooltipVsChampion = tooltipModel.dataPoints[0].raw.vsCharacter;
                const tooltipVsChampionId = tooltipModel.dataPoints[0].raw.vsCharacterId;
                const tooltipVsLane = tooltipModel.dataPoints[0].raw.vsBattleInputType;
                const tooltipVsTier = tooltipModel.dataPoints[0].raw.vsTier;
                const tooltipVsSymbol = tooltipModel.dataPoints[0].raw.vsSymbol;
                const tooltipVsDivision = tooltipModel.dataPoints[0].raw.vsDivision;
                const tooltipVsLp = tooltipModel.dataPoints[0].raw.vsLp;
                
                let bgColor = 'bg-[#323232cc]';
                let borderColor = 'border-[#5c5c5c]';
                if(tooltipOutcome === 1) {
                  bgColor = 'bg-[#30324bcc]';
                  borderColor = 'border-[#5260e3]';
                } else if(tooltipOutcome === 0) {
                  bgColor = 'bg-[#4c3232cc]';
                  borderColor = 'border-[#e85f5f]';
                }
                
                const tooltipR = tooltipModel.dataPoints[0].raw.rounds;
                let TooltipRounds = '';
                for(let i = 0; i < tooltipR.length; i++) {
                  TooltipRounds += `<img class="h-[15px]${i > 0 ? ' ml-[-6px]' : ''}" src="assets/outcomes/icon_result${tooltipR[i]}_l.png">`;
                }
                const tooltipVsR = tooltipModel.dataPoints[0].raw.vsRounds;
                let TooltipVsRounds = '';
                for(let i = 0; i < tooltipVsR.length; i++) {
                  TooltipVsRounds += `<img class="h-[15px]${i > 0 ? ' ml-[-6px]' : ''}" src="assets/outcomes/icon_result${tooltipVsR[i]}_r.png">`;
                }
                
                let displayedLp = `
                  <div class="mr-[20px] ${textColorsForRetardedTailwind[tooltipTier?.toLowerCase()]}"><span>${tooltipSymbol || ''}${tooltipDivision || ''}</span> ${tooltipLp || '?'} LP</div>
                `;
                let displayChampion = `
                  <img class="h-[20px] max-w-none" src="assets/characters/character_${tooltipChampionId}_l.png" alt="${tooltipChampion}" />
                  <img class="h-[17px] ml-[2px] rounded-[4px] max-w-none" src="assets/icon_controltype${tooltipLane}.png" />
                `;
                
                let displayedVsLp = `
                  <div class="mr-[20px] ${textColorsForRetardedTailwind[tooltipVsTier?.toLowerCase()]}"><span>${tooltipVsSymbol || ''}${tooltipVsDivision || ''}</span> ${tooltipVsLp || '?'} LP</div>
                `;
                let displayVsChampion = `
                  <img class="h-[20px] max-w-none" src="assets/characters/character_${tooltipVsChampionId}_r.png" alt="${tooltipVsChampion}" />
                  <img class="h-[17px] ml-[2px] rounded-[4px] max-w-none" src="assets/icon_controltype${tooltipVsLane}.png" />
                `;
                
                tooltipEl.innerHTML = `
                  <div class="p-[6px] ${bgColor} border-[1px] ${borderColor} rounded-[4px] translate-x-[-50%] translate-y-[-100%] flex flex-col text-[13px]">
                    <div class="pb-[2px] text-[12px] text-[#999999]">${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</div>
                    <div class="pb-[4px] flex flex-nowrap">${TooltipRounds}<div class="grow mx-[6px]"></div>${TooltipVsRounds}</div>
                    <div class="flex items-center px-[3px]">
                      ${displayedLp}
                      <div class="grow"></div>
                      ${displayChampion}
                    </div>
                    <div class="flex items-center px-[3px]">
                      ${displayedVsLp}
                      <div class="grow"></div>
                      ${displayVsChampion}
                    </div>
                  </div>
                `;
              }
              
              const position = context.chart.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 10 + (tooltipModel.caretY < 100 ? 130 : 0) + 'px';
              tooltipEl.style.pointerEvents = 'none';
            },
          },
          //zoom: zoomOptions,
        },
      }
  });

};
