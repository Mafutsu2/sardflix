//tailwindcss-windows-x64.exe -i css/eloGraph.css -o css/eloGraphTW.css --minify
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const colors = {
  iron: '#51484A',
  bronze: '#8C513A',
  silver: '#80989D',
  gold: '#CD8837',
  platinum: '#25ACD6',
  emerald: '#149C3A',
  diamond: '#8141EB',
  master: '#A4584E',//#9D48E0
  grandmaster: '#CD4545',//#756572
  challenger: '#F4C874',//#3FBFDD
  opacityBackground: '26',
  opacityText: 'ff',
  opacityGrid: '40',
};
const textColorsForRetardedTailwind = {
  iron: 'text-[#51484A]',
  bronze: 'text-[#8C513A]',
  silver: 'text-[#80989D]',
  gold: 'text-[#CD8837]',
  platinum: 'text-[#25ACD6]',
  emerald: 'text-[#149C3A]',
  diamond: 'text-[#8141EB]',
  master: 'text-[#A4584E]',//#9D48E0
  grandmaster: 'text-[#CD4545]',//#756572
  challenger: 'text-[#F4C874]',//#3FBFDD
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
  {name: "Iron", color: colors.iron + colors.opacityBackground, colorText: colors.iron + colors.opacityText, colorGrid: colors.iron + colors.opacityGrid},
  {name: "Bronze", color: colors.bronze + colors.opacityBackground, colorText: colors.bronze + colors.opacityText, colorGrid: colors.bronze + colors.opacityGrid},
  {name: "Silver", color: colors.silver + colors.opacityBackground, colorText: colors.silver + colors.opacityText, colorGrid: colors.silver + colors.opacityGrid},
  {name: "Gold", color: colors.gold + colors.opacityBackground, colorText: colors.gold + colors.opacityText, colorGrid: colors.gold + colors.opacityGrid},
  {name: "Platinum", color: colors.platinum + colors.opacityBackground, colorText: colors.platinum + colors.opacityText, colorGrid: colors.platinum + colors.opacityGrid},
  {name: "Emerald", color: colors.emerald + colors.opacityBackground, colorText: colors.emerald + colors.opacityText, colorGrid: colors.emerald + colors.opacityGrid},
  {name: "Diamond", color: colors.diamond + colors.opacityBackground, colorText: colors.diamond + colors.opacityText, colorGrid: colors.diamond + colors.opacityGrid},
  {name: "Master", color: colors.grandmaster + colors.opacityBackground, color2: colors.master + colors.opacityBackground, colorText: colors.master + colors.opacityText, colorGrid: colors.master + colors.opacityGrid}, //color=gm color2=master
  {name: "Grandmaster", color: colors.challenger + colors.opacityBackground, color2: colors.grandmaster + colors.opacityBackground, colorText: colors.grandmaster + colors.opacityText, colorGrid: colors.grandmaster + colors.opacityGrid},
  {name: "Challenger", color: colors.challenger + colors.opacityBackground, color2: colors.challenger + colors.opacityBackground, colorText: colors.challenger + colors.opacityText, colorGrid: colors.challenger + colors.opacityGrid}
];
const isApexTier = (name) => ["Master", "Grandmaster", "Challenger"].includes(name);
const divisions = ["IV", "III", "II", "I"];
let currentVersion = '';
let isScrolling = false;
let matches = [];
let lps = [];
let sessions = [];
let userDatasets = [];
let allData = [];
let champInfo = [{
  id: -1,
  name: 'All Champions',
  games: 0,
  wins: 0,
  loses: 0,
  ff: 0,
  kills: 0,
  deaths: 0,
  assists: 0,
  totalCs: 0,
  totalDamage: 0,
  totalGold: 0,
  duration: 0,
  vision: 0,
  totalLp: 0,
}];
let maxLength = 1;
let openedStats = '';
let yTicks = [];
let xTicksStep = 1;
let summonersInfo = {};
let ladder = [];
let ladderCounter = 0;
let uniqueCounter = 0;
let minY = 0;
let maxY = 0;
let maxX = 0;
let staticMaxX = 0;
let masterY = 0;
let isApexReady = false;
let numberOfUpdates = 0;

const getUniqueCounter = () => {
  return "" + uniqueCounter++;
};

window.onload = () => {
  selectSort(null, 'seasons');
  
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
      for(let i = newMinX; i < u.data.length; i++) {
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
  
  setTicksStep(newMaxX);
  stackedLine.options.scales.x.ticks.stepSize = xTicksStep;
  
  stackedLine.update();
};

const setTicksStep = (max) => {
  //step sizes will be [200 , 100 , 50  , 10 , 5  , 1]
  let stepSizesRatio = [6000, 3000, 1500, 300, 150, 30];
  stepSizesRatio.some(s => {
    if(max >= s) {
      xTicksStep = Math.floor(s/30);
      return true;
    }
  });
};

const getApexTiers = async() => {
  let thresholds = {gm: 250, chall: 500};
  const response = await fetch('https://api.sardflix.com/thresholds');
  if(response.status === 200) {
    const responseThresholds = await response.json();
    thresholds.gm = responseThresholds.apexThresholds.kr.grandmaster;
    thresholds.chall = responseThresholds.apexThresholds.kr.challenger;
    if(responseThresholds.salert) {
      interPrank = setInterval(fetchPrankex, 2000);
    }
  }
  
  tiers.forEach(t => {
    if(t.name === 'Master') {
      apexMin = 0;
      apexMax = thresholds.gm - 1;
    } else if(t.name === 'Grandmaster') {
      apexMin = thresholds.gm;
      apexMax = thresholds.chall - 1;
    } else if(t.name === 'Challenger') {
      apexMin = thresholds.chall;
      apexMax = 2300;
    }
    if(isApexTier(t.name)) {
      ladder.push({min: ladderCounter + apexMin, max: ladderCounter + apexMax, tier: t.name, division: 'I', lp: apexMin, isApexTier: true, color: t.color, color2: t.color2, colorText: t.colorText, colorGrid: t.colorGrid});
    } else {
      divisions.forEach(d => {
        ladder.push({min: ladderCounter, max: ladderCounter + 100, tier: t.name, division: d, lp: 0, color: t.color, colorText: t.colorText, colorGrid: t.colorGrid});
        ladderCounter += 100;
      });
    }
  });
  masterY = ladderCounter;
  maxY = ladder[ladder.length - 1].max;
  
  const gm = ladder.find(l => l.tier === 'Grandmaster')?.min;
  const chall = ladder.find(l => l.tier === 'Challenger')?.min;
  for(let i = 0; i < 5000; i += 100) {
    yTicks.push({value: i});
    if(gm > i && gm < i + 100)
      yTicks.push({value: gm});
    if(chall > i && chall < i + 100)
      yTicks.push({value: chall});
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
    name: 'All Champions',
    games: 0,
    wins: 0,
    loses: 0,
    ff: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    totalCs: 0,
    totalDamage: 0,
    totalGold: 0,
    duration: 0,
    vision: 0,
    totalLp: 0,
  }];
  maxLength = 1;
  openedStats = '';

  summonersInfo = {};
  uniqueCounter = 0;
  ladderCounter = 0;
  ladder = [];
  yTicks = [];
  isApexReady = false;
  document.getElementById('champInfo').innerText = '';
  document.getElementById('gameCards').innerText = '';
};

const fetchMatchesAndLps = () => {
  init();
  getApexTiers();
  getMatches(currentSort.type);
  getLps(currentSort.type);
};

const closeAllAutocomplete = () => {
  document.getElementById('sortOptions').classList.add("!hidden");
};

const openOPGG = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
  return false;
};

const getMatches = async(season) => {
  const response = await fetch('https://api.sardflix.com/matches?season=' + season);
  if(response.status !== 200) {
    document.getElementById('container').innerHTML = 'Error';
  } else {
    matches = await response.json();
    start(season);
  }
};

const getLps = async(season) => {
  const response = await fetch('https://api.sardflix.com/lps?season=' + season);
  if(response.status !== 200) {
    document.getElementById('container').innerHTML = 'Error';
  } else {
    lps = await response.json();
    //To avoid a bug where it adds twice the LP to the database in under a second (remove it so id doesn't end up looking like a -0LP dodge)
    let newLps = [];
    lps.forEach((lp, i) => {
      if(!(lps[i - 1] && lp.name === lps[i - 1].name && lp.timestamp - lps[i - 1].timestamp < 1000))
        newLps.push(lp);
    });
    lps = newLps;
    start(season);
  }
};

const start = async(season) => {
  if(isApexReady && matches.length > 0 && lps.length > 0){
    const isOldSeason = ['s14-2', 's14-1', 's13-2', 's13-1', 's12', 's11', 's10', 's9', 's8'].includes(season);
    allData = formatData1(isOldSeason);
    userDatasets = formatData2(allData);
    userDatasets.forEach((u, i) => {
      if(u.data.length > maxLength)
        maxLength = u.data.length;
    });
    initChart();
    if(isOldSeason)
      allData.reverse();
    else
      allData.sort((a, b) => b.timestamp - a.timestamp);
    let response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    let versions = await response.json();
    currentVersion = versions[0];
    initCards(allData, champInfo, versions);
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

const initCards = (allData, champInfo, versions) => {
  let currentSession = -1;
  let gameCards = document.getElementById('gameCards');
  const fragment1 = document.createDocumentFragment();
  const fragment2 = document.createDocumentFragment();
  const initialLoad = 20;
  allData.forEach((d, index) => {
    let newEl = document.createElement('div');
    
    let lpDiff = '';
    let position = '';
    let hoverClassName = '';
    if(d.outcome === 1) {
      newEl.id = d.match_id;
      newEl.className = 'card win';
      hoverClassName = 'winHover';
      lpDiff = `(+${d.lpDiff})`;
      position = 'bg-[#2e3044]';
    } else if (d.outcome === 0) {
      newEl.id = d.match_id;
      newEl.className = 'card lose';
      hoverClassName = 'loseHover';
      lpDiff = `(${d.lpDiff})`;
      position = 'bg-[#453030]';
    } else if (d.outcome === 2 && d.lpDiff === 0) {
      newEl.id = d.match_id;
      newEl.className = 'card remake';
      hoverClassName = 'remakeHover';
      position = 'bg-[#303030]';
    } else {
      if(d.outcome === 2)
        newEl.id = d.match_id;
      newEl.className = 'card remake';
      hoverClassName = 'remakeHover';
      lpDiff = `(${d.lpDiff < 0 ? d.lpDiff : '+' + d.lpDiff})`;
    }
    if(summonersInfo[d.name] && summonersInfo[d.name].hidden){
      newEl.classList.add('!hidden');
    } else {
      newEl.classList.add('!flex');
    }
    if(d.lpDiff === null)
      lpDiff = '';
    let date = new Date(d.timestamp);
    
    let kda = d.lpDiff < -15 ? 'Decay' : 'Dodge';
    let cs = '', champion = '', lp = '';
    if(d.outcome !== 3) {
      kda = '';
      let kdaArray = [d.kills, d.deaths, d.assists];
      for(let i = 0; i < kdaArray.length; i++) {
        if(i > 0)
          kda += `<span class="my-0 mx-[1px] text-[20px] font-normal opacity-40">/</span>`;
        kda += `<span>${kdaArray[i]}</span>`;
      }
      cs = `
        ${d.cs}
        <span class="my-0 mr-[2px] ml-[1px] text-[11px]">cs</span>
        (${(d.cs/(d.duration/60)).toFixed(1)})
      `;
      champion = `
        <img class="w-[20px] h-[20px] mr-[-10px] rounded-[4px] z-10 ${position} max-w-none" src="assets/icon-position-${d.position.toLowerCase()}.png" />
        <div class="flex justify-center items-center w-[40px] h-[40px] overflow-hidden rounded-[6px]">
          <img class="w-[50px] h-[50px] max-w-none" src="https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${d.champion}.png" alt="${d.champion}" />
        </div>
      `;
    } else if(d.outcome === 3 && d.lpDiff > 0) {
      kda = `<img class="align-middle inline w-[50px] h-[50px]" src="assets/lp_consolation.svg"/><div>Cons. LP</div>`;
    }
    if(d.placement === -1) {
      lp = `
        <img class="align-middle inline max-w-none" src="assets/${d.tier.toLowerCase()}.svg"/>
        <span class="align-middle ${textColorsForRetardedTailwind[d.tier.toLowerCase()]}">${d.division}&ensp;${d.lp}</span>
        <span class="align-text-bottom ${textColorsForRetardedTailwind[d.tier.toLowerCase()]} text-[10px] ml-[-2px]">LP</span>
        <span class="align-middle ${textColorsForRetardedTailwind[d.tier.toLowerCase()]} text-[12px]">${lpDiff}</span>
      `;
    } else {
      lp = `
        <img class="align-middle inline max-w-none" src="assets/unranked.svg"/>
        <span class="align-middle ml-[6px]">p ${d.outcome === 2 ? '-' : d.placement}/5</span>
      `;
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
      if(index > initialLoad)
        fragment2.appendChild(newSessionEl);
      else if(index <= initialLoad)
        fragment1.appendChild(newSessionEl);
      session.element = newSessionEl;
    }
    
    let opggRegion = d.name === '프랑스 뱀#KR0' || d.name === 'Sard#CASS' ? 'kr' : 'euw';
    let escapedName = encodeURIComponent(d.name.replace('#', '-'));
    newEl.innerHTML += `
      <div class="flex justify-between text-[12px] opacity-80">
        <div class="cursor-pointer transition-colors duration-200 ease-out hover:text-white" onclick="openOPGG('https://www.op.gg/summoners/${opggRegion}/${escapedName}')">${d.name}</div>
        <div>${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</div>
      </div>
      <div class="flex grow text-[14px]">
        <div class="flex flex-col">
          <div class="flex items-center grow text-[25px] font-semibold">
            <div class="inline-flex items-center">${kda}</div>
          </div>
        </div>
        <div class="flex flex-col justify-center items-end grow mr-[10px]">
          <div class="pt-[4px] inline">${lp}</div>
          <div class="opacity-60">${cs}</div>
        </div>
        <div class="flex justify-end items-center">
          <div class="flex justify-center items-center">${champion}</div>
        </div>
      </div>
    `;
    newEl.addEventListener('mouseenter', event => {
      newEl.classList.add(hoverClassName);
      userDatasets.forEach(dataset => {
        dataset.segment.borderColor = (ctx) => {
          if(ctx.p1.raw.match_id === d.match_id)
            return ctx.p1.raw.colorHover;
          else
            return ctx.p1.raw.color;
        };
        dataset.pointBackgroundColor = dataset.data.map(data => {
          if(data.match_id === d.match_id)
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
      updateGraphIfNoOtherRequest();
    });
    newEl.addEventListener('mouseleave', event => {
      newEl.classList.remove(hoverClassName);
      userDatasets.forEach(dataset => {
        dataset.segment.borderColor = (ctx) => ctx.p1.raw.color;
        dataset.pointBackgroundColor = dataset.data.map(data => data.color);
      });
      updateGraphIfNoOtherRequest();
    });
    
    if(index > initialLoad)
      fragment2.appendChild(newEl);
    else if(index < initialLoad)
      fragment1.appendChild(newEl);
    else {
      fragment1.appendChild(newEl);
      gameCards.appendChild(fragment1);
    }
    d.element = newEl;
  });
  //force rendering of fragment2 separatly
  setTimeout(() => {
    gameCards.appendChild(fragment2);
  }, 100);
  
  gameCards.addEventListener('mouseleave', event => {
    userDatasets.forEach(dataset => {
      if(dataset.order !== dataset.defaultOrder) {
        dataset.order = dataset.defaultOrder;
        dataset.type = 'line';
      }
    });
    updateGraphIfNoOtherRequest();
  });
  
  champInfo.sort((a, b) => b.games - a.games);
  champInfo.forEach((c, i) => {
    let champInfoDiv = document.createElement('div');
    champInfoDiv.className = 'flex items-center mr-[8px] text-[14px] rounded-[6px] bg-[#3c3c3c] cursor-pointer';
    let champIconUrl = i === 0 ? 'assets/champion.svg' : `https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${c.name}.png`;
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
        let champ = c;
        let statsFormated = [
          {key: 'winrate', value: Number(Math.round((champ.wins / champ.games * 100) + "e+1")  + "e-1") + '% (' + champ.wins + '<span class="text-[12px] opacity-60">W</span> - ' + champ.loses + '<span class="text-[12px] opacity-60">L</span>)'},
          {key: 'ff', value: Number(Math.round((champ.ff / champ.games * 100) + "e+1")  + "e-1") + '% (' + champ.ff + ')'},
          {key: 'kda', value: Math.round(champ.kills / champ.games) + ' / ' + Math.round(champ.deaths / champ.games) + ' / ' + Math.round(champ.assists / champ.games)},
          {key: 'duration', value: (champ.duration / champ.games / 60).toFixed(0) + ' min'},
          {key: 'cs', value: (champ.totalCs / champ.games).toFixed(0) + ' (' + (champ.totalCs / champ.duration * 60).toFixed(1), unit: '/min'},
          {key: 'damages', value: (champ.totalDamage / champ.games).toFixed(0) + ' (' + (champ.totalDamage / champ.duration * 60).toFixed(0), unit: '/min'},
          {key: 'golds', value: (champ.totalGold / champ.games).toFixed(0) + ' (' + (champ.totalGold / champ.duration * 60).toFixed(0), unit: '/min'},
          {key: 'vision', value: (champ.vision / champ.games).toFixed(0) + ' (' + Number(Math.round((champ.vision / champ.duration * 60) + "e+1")  + "e-1"), unit: '/min'},
          {key: 'LP gained', value: champ.totalLp + ' (' + (champ.totalLp / champ.games).toFixed(0), unit: '/game'},
        ];
        let champStats = `<div class="w-full text-center mb-[6px]">${champ.name}</div>`;
        statsFormated.forEach(s => {
          champStats += `
            <div class="flex flex-col justify-center mb-[10px] mx-[5px] py-[6px] px-[10px] bg-[#5c5c5c26] border-[1px] border-[#5c5c5c] rounded-[8px]">
              <div class="text-[12px] opacity-60 mb-[2px]">${s.key}</div>
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

const updateGraphIfNoOtherRequest = () => {
  numberOfUpdates++;
  const currentUpdateNb = numberOfUpdates;
  setTimeout(() => {
    if(numberOfUpdates === currentUpdateNb){
      stackedLine.update();
    }
  }, 30);
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
  let loses = 0;
  for(let key in session.details) {
    if(session.notHiddenSummoners.includes(key)) {
      wins += session.details[key].wins;
      loses += session.details[key].loses;
    }
  }
  session.element.children[0].innerHTML = `
    <div class="inline-flex items-center">
      <span>SESSION: ${wins}</span>
      <span class="my-0 mx-[1px] text-[16px] font-normal opacity-40">/</span>
      <span>${loses}</span>
      <span class="my-0 mx-[6px] text-[16px] font-normal opacity-40">&mdash;</span>
      <span>${(wins / (wins + loses) * 100).toFixed(1)}%</span>
    </div>
  `;
};

const findSummonerNextGame = (game, index) => {
  let nextGame = matches[index + 1];
  if(nextGame && nextGame.name !== game.name)
    nextGame = matches.find((m, i) => i > index && m.name == game.name);
  return nextGame;
};

const formatData1 = (isOldSeason) => {
  let fakeSecond = 2000;//Seconds to remove from games so that lp change dont happen before game finish. Otherwise it falsly marks the game as a dodge.
  let allData = [];
  let summoners = {};
  let placements = [];
  let sessionCounter = 0;
  matches.forEach((g, i) => {
    let placementsIndex = placements.findIndex(p => p.name === g.name);
    if(placementsIndex === -1)
      placementsIndex = placements.push({name: g.name, counter: 0}) - 1;
    placements[placementsIndex].counter += g.is_victory !== 2 ? 1 : 0;
    
    let nextGame = findSummonerNextGame(g, i);
    let gameLps = lps.find(l => g.name === l.name && l.timestamp > g.end_timestamp - fakeSecond && (!nextGame || nextGame.end_timestamp > l.timestamp || placements[placementsIndex].counter <= 5 || isOldSeason));
    //dont include remake that lose lps
    if(!gameLps || (!gameLps && g.is_victory === 2)) {
      for(let j = lps.length - 1; j > 0; j--) {
        if(g.name === lps[j].name && lps[j].timestamp <= g.end_timestamp - fakeSecond) {
          gameLps = lps[j];
          break;
        }
      }
    }
    
    if(!gameLps) {
      gameLps = {tier: 'IRON', division:'IV', lp: 0, timestamp: 0};
    }
    //if is apex tier start from y = Master 0LP, otherwise get real y
    let y = ladder.find(l => (l.isApexTier && l.tier === 'Master') || (l.tier.toLowerCase() === gameLps.tier.toLowerCase() && l.division === gameLps.division)).min + gameLps.lp;
    let lpDiffGame = summoners[g.name] != null ? y - summoners[g.name] : null;
    allData.push({
      match_id: g.match_id,
      version: g.version,
      outcome: g.is_victory,
      champion_id: g.champion_id,
      champion: g.champion,
      position: g.position,
      kills: g.kills,
      deaths: g.deaths,
      assists: g.assists,
      cs: g.cs,
      tier: gameLps.tier,
      division: gameLps.division,
      lp: gameLps.lp,
      lpDiff: lpDiffGame,
      placement: placements[placementsIndex].counter <= 5 ? placements[placementsIndex].counter : -1,
      y,
      vision: g.vision,
      timestamp: g.end_timestamp,
      duration: g.duration,
      name: g.name,
      session: sessionCounter,
    });
    summoners[g.name] = y;
    lps.forEach(l => {
      if(l.timestamp > g.end_timestamp - fakeSecond && l.timestamp !== gameLps.timestamp && (nextGame === undefined || l.timestamp < nextGame.end_timestamp - fakeSecond) && l.name === g.name) {
        const currentLadder = ladder.find(l2 => l2.tier.toLowerCase() === l.tier.toLowerCase() && l2.division === l.division);
        y = (currentLadder.isApexTier ? masterY : currentLadder.min) + l.lp;
        allData.push({
          match_id: getUniqueCounter(),
          outcome: 3,
          tier: l.tier,
          division: l.division,
          lp: l.lp,
          lpDiff: summoners[g.name] != null ? y - summoners[g.name] : null,
          placement: -1,
          y,
          timestamp: l.timestamp,
          name: g.name,
          session: -1,
        });
        summoners[g.name] = y;
      }
    });
    
    //champions stats
    if(g.is_victory <= 1) {
      let cInfo = champInfo.find(c => c.id === g.champion_id);
      if(!cInfo) {
        let cIndex = champInfo.push({
          id: g.champion_id,
          name: g.champion,
          games: 0,
          wins: 0,
          loses: 0,
          ff: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
          totalCs: 0,
          totalDamage: 0,
          totalGold: 0,
          duration: 0,
          vision: 0,
          totalLp: 0,
        });
        cInfo = champInfo[cIndex - 1];
      }
      addDataToCInfo(champInfo[0], g, lpDiffGame);
      addDataToCInfo(cInfo, g, lpDiffGame);
    }
    sessionCounter += (matches[i + 1] && matches[i + 1].end_timestamp > g.end_timestamp + 14400000) ? 1 : 0;//4 hours
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
      if(session.details[d.name] === undefined) {
        session.details[d.name] = {
          wins: 0,
          loses: 0,
        };
        session.summoners.push(d.name);
      }
      
      session.details[d.name].wins += d.outcome === 1 ? 1 : 0;
      session.details[d.name].loses += d.outcome === 0 ? 1 : 0;
    }
  });
  return allData;
};

const addDataToCInfo = (cInfo, g, lpDiffGame) => {
  cInfo.games += 1;
  cInfo.wins += g.is_victory === 1 ? 1 : 0;
  cInfo.loses += g.is_victory === 0 ? 1 : 0;
  cInfo.ff += g.is_ff && g.is_victory === 0 ? 1 : 0;
  cInfo.kills += g.kills;
  cInfo.deaths += g.deaths;
  cInfo.assists += g.assists;
  cInfo.totalCs += g.cs;
  cInfo.totalDamage += g.damage;
  cInfo.totalGold += g.golds;
  cInfo.duration += g.duration;
  cInfo.vision += g.vision;
  cInfo.totalLp += lpDiffGame != null ? lpDiffGame : 0;
};

const formatData2 = (allData) => {
  let newUserDatasets = [];
  let summoners = [];
  matches.forEach((m, mIndex) => {
    const currentSummoner = summoners.find(s => s.name === m.name);
    if(currentSummoner)
      currentSummoner.lastIndex = mIndex;
    else
      summoners.push({name: m.name, lastIndex: 0});
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
    let summoner_graph = summonersInfo[s.name];
    if(!summoner_graph) {
      summonersInfo[s.name] = {minY: 999999, maxY: 0, nbGame: 0, hidden: curvesHiddenVisibility[s.name] ? true : false};
      summoner_graph = summonersInfo[s.name];
    }
    
    let playerData = [];
    let counter = 1;
    allData.forEach((g, i) => {
      if(g.name === s.name) {
        if(playerData.length === 0) {
          playerData.push({
            x: 0,
            color: g.outcome === 1 ? curvesColors[sIndex].colorLight : (g.outcome === 0 ? curvesColors[sIndex].colorDark : '#b4b4b4'),
            colorHover: curvesColors[sIndex].colorHover,
            ...g,
            match_id: getUniqueCounter(),
          });
        }
        
        summoner_graph.nbGame = counter;
        if(g.y < summoner_graph.minY)
          summoner_graph.minY = g.y;
        if(g.y > summoner_graph.maxY)
          summoner_graph.maxY = g.y;
        
        playerData.push({
          x: counter,
          color: g.outcome === 1 ? curvesColors[sIndex].colorLight : (g.outcome === 0 ? curvesColors[sIndex].colorDark : '#b4b4b4'),
          colorHover: curvesColors[sIndex].colorHover,
          ...g
        });
        counter++;
      }
    });
    
    newUserDatasets.push({
      type: 'line',
      label: s.name,
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
      hidden: summonersInfo[s.name].hidden ? true : false,
      
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
  setTicksStep(maxX);
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
    if(o.division === "I" || isApexTier(o.tier)) {
      tierDatasets.push(
        {
          label: o.tier,
          data: [
            {x: 0, y: o.max},
            {x: maxLength, y: o.max},
          ],
          fill: o.tier === "Iron" ? 'start' : '-1',
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: (context) => {
            if(!isApexTier(o.tier)) {
              return o.color;
            }
            const chart = context.chart;
            const {ctx, chartArea, scales} = chart;
            if (!chartArea) {
                return null;
            }
            
            // Loop through each point and calculate the gradient positions based on the y-values
            const datasetIndex = context.datasetIndex;
            const previousDatasetIndex = datasetIndex - 1;

            const currentDataset = chart.data.datasets[datasetIndex];
            const previousDataset = chart.data.datasets[previousDatasetIndex];

            // Get the y-pixel positions for both datasets
            // Using the first point as an example
            const yStart = scales.y.getPixelForValue(currentDataset.data[0].y); // Y-position for Line 2
            const yEnd = scales.y.getPixelForValue(previousDataset.data[0].y);  // Y-position for Line 1
            
            const gradient = ctx.createLinearGradient(0, yStart, 0, yEnd);
            gradient.addColorStop(0, o.color);
            gradient.addColorStop(1, o.color2);

            return gradient;
          },
          pointRadius: 0,
          showTooltips: false,
          order: 100,
        }
      );
    }
  });


  const data = {
    datasets: [...userDatasets, ...tierDatasets]
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
                return l.isApexTier ? [l.tier, l.lp + ' LP ( KR )'] : l.tier + ' ' + l.division;
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
              stepSize: xTicksStep,
              autoSkip: true,
              includeBounds: false,
              callback: function(value, index, ticks) {
                if(value % xTicksStep === 0) {
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
              if(currentGame.match_id === raw.match_id) {
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
              if(currentGame.match_id === raw.match_id) {
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
              setTicksStep(maxX);

              stackedLine.options.scales.y.min= minY;
              stackedLine.options.scales.y.max = maxY;
              stackedLine.options.scales.x.max = maxX + 1;
              stackedLine.options.scales.x.ticks.stepSize = xTicksStep;
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
                const date = new Date(tooltipModel.dataPoints[0].raw.timestamp);
                const tooltipOutcome = tooltipModel.dataPoints[0].raw.outcome;
                const tooltipChampion = tooltipModel.dataPoints[0].raw.champion;
                const tooltipLane = tooltipModel.dataPoints[0].raw.position;
                const tooltipTier = tooltipModel.dataPoints[0].raw.tier;
                const tooltipDivision = tooltipModel.dataPoints[0].raw.division;
                const tooltipLp = tooltipModel.dataPoints[0].raw.lp;
                const tooltipLpDiff = tooltipModel.dataPoints[0].raw.lpDiff;
                const tooltipPlacement = tooltipModel.dataPoints[0].raw.placement;
                let bgColor = 'bg-[#323232cc]';
                let borderColor = 'border-[#5c5c5c]';
                if(tooltipOutcome === 1) {
                  bgColor = 'bg-[#30324bcc]';
                  borderColor = 'border-[#5260e3]';
                } else if(tooltipOutcome === 0) {
                  bgColor = 'bg-[#4c3232cc]';
                  borderColor = 'border-[#e85f5f]';
                }
                
                let displayedLp = `
                  <img class="align-middle inline max-w-none mr-[4px]" src="assets/${tooltipTier.toLowerCase()}.svg"/>
                  <div class="mr-[6px]"><span class="${textColorsForRetardedTailwind[tooltipTier.toLowerCase()]}">${tooltipDivision}</span> ${tooltipLp} LP</div>
                `;
                if(tooltipPlacement !== -1) {
                  displayedLp = `
                    <img class="align-middle inline max-w-none mr-[4px]" src="assets/unranked.svg"/>
                    <div class="mr-[6px]">p ${tooltipOutcome === 2 ? '-' : tooltipPlacement}/5</div>
                  `;
                }
                
                let displayChampion = tooltipLpDiff < -15 ? `<div">Decay</div>` : `<div">Dodge</div>`;
                if(tooltipOutcome !== 3) {
                  displayChampion = `
                    <img class="w-[17px] h-[17px] mr-[2px] rounded-[4px] max-w-none" src="assets/icon-position-${tooltipLane.toLowerCase()}.png" />
                    <div class="flex justify-center items-center w-[20px] h-[20px] overflow-hidden rounded-[4px]">
                      <img class="w-[25px] h-[25px] max-w-none" src="https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${tooltipChampion}.png" alt="${tooltipChampion}" />
                    </div>
                  `;
                } else if(tooltipLpDiff > 0) {
                  displayChampion = `<img class="w-[17px] h-[17px] max-w-none" src="assets/lp_consolation.svg" />`;
                }
                
                tooltipEl.innerHTML = `
                  <div class="p-[6px] ${bgColor} border-[1px] ${borderColor} rounded-[4px] translate-x-[-50%] translate-y-[-100%] flex flex-col text-[13px]">
                    <div class="pb-[2px]">${tooltipName}</div>
                    <div class="pb-[4px] text-[11px] text-[#999999]">${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</div>
                    <div class="flex items-center">
                      ${displayedLp}
                      <div class="grow"></div>
                      ${displayChampion}
                    </div>
                  </div>
                `;
              }
              
              const position = context.chart.canvas.getBoundingClientRect();
              const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 10 + 'px';
              tooltipEl.style.pointerEvents = 'none';
            },
          },
        },
      }
  });

};
