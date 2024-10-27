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
  master: '#9D48E0',//#A4584E
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
  master: 'text-[#9D48E0]',//#A4584E
  grandmaster: 'text-[#CD4545]',//#756572
  challenger: 'text-[#F4C874]',//#3FBFDD
};
const curvesColors = [
  {name: 'green', colorLight: '#68e35b', colorDark: '#4b8545', colorHover: '#b0f5a9'},
  {name: 'red', colorLight: '#e85f5f', colorDark: '#964a4a', colorHover: '#f79e9e'},
  {name: 'blue', colorLight: '#579feb', colorDark: '#506d8c', colorHover: '#a6cdf7'},
  {name: 'orange', colorLight: '#f0a85b', colorDark: '#917454', colorHover: '#f5d8ba'},
  {name: 'purple', colorLight: '#7757eb', colorDark: '#4d3d8f', colorHover: '#b4a2f5'},
  {name: 'teal', colorLight: '#57ebd2', colorDark: '#4d877d', colorHover: '#b0f5e9'},
  {name: 'pink', colorLight: '#eb57df', colorDark: '#804b7b', colorHover: '#f5a9ef'},
  {name: 'green', colorLight: '#68e35b', colorDark: '#4b8545', colorHover: '#b0f5a9'},
  {name: 'red', colorLight: '#e85f5f', colorDark: '#964a4a', colorHover: '#f79e9e'},
  {name: 'blue', colorLight: '#579feb', colorDark: '#506d8c', colorHover: '#a6cdf7'},
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
let isScrolling = false;
let matches = [];
let lps = [];
let sessions = [];
let userDatasets = [];
let allData = [];
let champInfo = [];
let maxLength = 1;
let maxLengthIndex = 0;
let openedStats = '';

let summoners_graph = []
let ladder = [];
let counter = 0;
let uniqueCounter = 0;

tiers.forEach(t => {
  if(isApexTier(t.name)) {
    ladder.push({min: counter, max: counter + 600, tier: t.name, division: '', color: t.color, color2: t.color2, colorText: t.colorText, colorGrid: t.colorGrid});
    counter += 600;
  } else {
    divisions.forEach(d => {
      ladder.push({min: counter, max: counter + 100, tier: t.name, division: d, color: t.color, colorText: t.colorText, colorGrid: t.colorGrid});
      counter += 100;
    });
  }
});

const getUniqueCounter = () => {
  return "" + uniqueCounter++;
};

window.onload = () => {
  getMatches();
  getLps();
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
  });
};

const openOPGG = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
  return false;
};

let minY = ladder[ladder.length - 1].max, maxY = 0;
const getMatches = async() => {
  const response = await fetch('https://api.sardflix.com/matches');
  if(response.status !== 200) {
    document.getElementById('container').innerHTML = 'Error';
  } else {
    matches = await response.json();
    start();
  }
};

const getLps = async() => {
  const response = await fetch('https://api.sardflix.com/lps');
  if(response.status !== 200) {
    document.getElementById('container').innerHTML = 'Error';
  } else {
    lps = await response.json();
    start();
  }
};

const start = async() => {
  if(matches.length > 0 && lps.length > 0){
    allData = formatData1();
    userDatasets = formatData2(allData);
    userDatasets.forEach((u, i) => {
      if(u.data.length > maxLength) {
        maxLength = u.data.length;
        maxLengthIndex = i;
      }
    });
    initChart();
    allData.sort((a, b) => b.timestamp - a.timestamp);
    let response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    let versions = await response.json();
    initCards(allData, champInfo, versions);
    initCurrentGameCards(versions);
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

const initCurrentGameCards = async(versions) => {
  const responseChampions = await fetch(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion.json`);
  const champions = await responseChampions.json();
  const responseQueues = await fetch(`https://static.developer.riotgames.com/docs/lol/queues.json`);
  const queues = await responseQueues.json();
  
  const response = await fetch('https://api.sardflix.com/current-match');
  if(response.status === 200) {
    let innerHTML = '';
    let currentMatches = await response.json();
    currentMatches.forEach(m => {
      let champion = '';
      for(let key in champions.data) {
        if(champions.data[key].key === m.champion_id + '')
          champion = key;
      }
      let gamemode = queues.find(q => q.queueId === m.queue_id);
      let date = new Date(m.game_start);
      setInterval(() => updateTimer(m.game_id, m.game_start), 1000);
      let escapedName = encodeURIComponent(m.name.replace('#', '-'));
      innerHTML += `
        <div class="card bg-[#f5d74226] border-[1px] border-[#f5d742]">
          <div class="flex justify-between text-[12px] opacity-80">
            <div class="cursor-pointer transition-colors duration-200 ease-out hover:text-white" onclick="openOPGG('https://www.op.gg/summoners/euw/${escapedName}')">${m.name}</div>
            <div id="current_${m.game_id}"></div>
          </div>
          <div class="flex grow text-[14px]">
            <div class="flex flex-col">
              <div class="flex items-center grow text-[25px] font-semibold">
                <div class="inline-flex items-center">In Game</div>
              </div>
            </div>
            <div class="flex flex-col justify-center items-end grow mr-[10px]">
              <div class="max-w-[100px] text-right opacity-60">${gamemode ? gamemode.description : 'Unknown gamemode'}</div>
            </div>
            <div class="flex justify-end items-center">
              <div class="flex justify-center items-center">
                <div class="flex justify-center items-center w-[40px] h-[40px] overflow-hidden rounded-[6px]">
                  <img class="w-[50px] h-[50px] max-w-none" src="https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${champion}.png" alt="${champion}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById('currentGameCards').innerHTML = innerHTML;
  }
};

const initCards = (allData, champInfo, versions) => {
  let currentSession = -1;
  let gameCards = document.getElementById('gameCards');
  allData.forEach(d => {
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
    } else if (d.outcome === 2) {
      newEl.id = d.match_id;
      newEl.className = 'card remake';
      hoverClassName = 'remakeHover';
      position = 'bg-[#303030]';
    } else {
      newEl.className = 'card remake';
      hoverClassName = 'remakeHover';
      lpDiff = `(${d.lpDiff})`;
    }
    if(d.lpDiff === null)
      lpDiff = '';
    let date = new Date(d.timestamp);
    
    let kda = 'Dodge';
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
    if(currentSession !== d.session) {
      currentSession = d.session;
      let session = sessions.find(s => s.id === d.session);
      let newSessionEl = document.createElement('div');
      newSessionEl.innerHTML += `
        <div class="flex items-center mb-[4px] mt-[10px] p-[6px] text-[20px] font-semibold">
          <div class="inline-flex items-center">
            <span>SESSION: ${session.wins}</span>
            <span class="my-0 mx-[1px] text-[16px] font-normal opacity-40">/</span>
            <span>${session.loses}</span>
            <span class="my-0 mx-[6px] text-[16px] font-normal opacity-40">&mdash;</span>
            <span>${(session.wins / session.games * 100).toFixed(1)}%</span>
          </div>
        </div>
      `;
      gameCards.append(newSessionEl);
    }
    
    let escapedName = encodeURIComponent(d.name.replace('#', '-'));
    newEl.innerHTML += `
      <div class="flex justify-between text-[12px] opacity-80">
        <div class="cursor-pointer transition-colors duration-200 ease-out hover:text-white" onclick="openOPGG('https://www.op.gg/summoners/euw/${escapedName}')">${d.name}</div>
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
    newEl.addEventListener('mouseover', event => {
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
      });
      stackedLine.update();
    });
    newEl.addEventListener('mouseenter', event => {
      newEl.classList.add(hoverClassName);
    });
    newEl.addEventListener('mouseleave', event => {
      newEl.classList.remove(hoverClassName);
    });
    gameCards.append(newEl);
    d.element = newEl;
  });
  
  champInfo.sort((a, b) => b.games - a.games);
  champInfo.forEach(c => {
    let champInfoDiv = document.createElement('div');
    champInfoDiv.className = 'flex items-center mr-[8px] text-[14px] rounded-[6px] bg-[#3c3c3c] cursor-pointer';
    let champTxt = `
      <div class="flex justify-center items-center w-[25px] h-[25px] rounded-[6px] overflow-hidden">
        <img class="w-[30px] h-[30px] max-w-none" src="https://ddragon.leagueoflegends.com/cdn/${versions[0]}/img/champion/${c.name}.png" alt="${c.name}" />
      </div>
      <div class="flex justify-center items-center w-[25px] h-[25px] rounded-[6px] overflow-hidden">${c.games}</div>
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
};

const findSummonerNextGame = (game, index) => {
  let nextGame = matches[index + 1];
  if(nextGame && nextGame.name !== game.name)
    nextGame = matches.find((m, i) => i > index && m.name == game.name);
  return nextGame;
};

const formatData1 = () => {
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
    let gameLps = lps.find(l => g.name === l.name && l.timestamp > g.end_timestamp - fakeSecond && (!nextGame || nextGame.end_timestamp > l.timestamp || placements[placementsIndex].counter <= 5));
    if(!gameLps || g.is_victory === 2) {
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
    let y = ladder.find(l => l.tier.toLowerCase() === gameLps.tier.toLowerCase() && l.division === gameLps.division).min + gameLps.lp;
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
      if(l.timestamp > g.end_timestamp - fakeSecond && l.timestamp !== gameLps.timestamp && (matches[i+1] === undefined || l.timestamp < matches[i+1].end_timestamp - fakeSecond) && l.name === g.name) {
        y = ladder.find(l2 => l2.tier.toLowerCase() === l.tier.toLowerCase() && l2.division === l.division).min + l.lp;
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
          session: sessionCounter,
        });
        summoners[g.name] = y;
      }
    });

    let summoner_graph = summoners_graph.find(p => p.name === g.name);
    if (!summoner_graph){
      let index_new_sum = summoners_graph.push({name: g.name, minY:999999,maxY:0, nbGame:0, hidden:false})
      summoner_graph = summoners_graph[index_new_sum -1]
    }
    else{
      summoner_graph.nbGame+=1
    }
    if(y < summoner_graph.minY)
      summoner_graph.minY = y;
    if(y > summoner_graph.maxY)
      summoner_graph.maxY = y;
    
    if(y < minY)
      minY = y;
    if(y > maxY)
      maxY = y;
    
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
    }
    sessionCounter += (matches[i + 1] && matches[i + 1].end_timestamp > g.end_timestamp + 14400000) ? 1 : 0;//4 hours
  });
  
  allData.forEach(d => {
    let session = sessions.find(s => s.id === d.session);
    if(!session) {
      let sIndex = sessions.push({
        id: d.session,
        games: 0,
        wins: 0,
        loses: 0,
      });
      session = sessions[sIndex - 1];
    }
    session.games += d.outcome < 2 ? 1 : 0;
    session.wins += d.outcome === 1 ? 1 : 0;
    session.loses += d.outcome === 0 ? 1 : 0;
  });
  return allData;
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
  
  summoners.forEach((s, sIndex) => {
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
    });
  });
  return newUserDatasets;
};

let stackedLine;
const initChart = () => {

  let tierDatasets = [];
  ladder.forEach(o => {
    if(o.division === "I" || isApexTier(o.tier)) {
      tierDatasets.push(
        {
          label: o.tier,
          data: [
            {x: 0, y: o.max},
            {x: maxLength - 1, y: o.max},
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
        }
      );
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
            min: Math.floor((minY - 100) / 100) * 100,
            max: Math.ceil((maxY + 100) / 100) * 100,//ladder[ladder.length - 1].max,
            display: true,
            ticks: {
              offset: false,
              stepSize: 100,
              autoSkip: false,
              includeBounds: false,
              color: (tick) => {
                let found = ladder.find(l => tick.tick.value >= l.min && tick.tick.value < l.max);
                return found && found.colorText ? found.colorText : 'rgb(200, 200, 200)';
              },
              callback: function(value, index, ticks) {
                let l = ladder.find(o => value === o.min);
                return l ? l.tier + ' ' + l.division : undefined;
              },
            },
            grid: {
              color: (tick) => {
                let found = ladder.find(l => tick.tick.value >= l.min && tick.tick.value < l.max);
                return found && found.colorGrid ? found.colorGrid : 'rgba(200, 200, 200, 0.08)';
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
            max: maxLength,
            ticks: {
              offset: true,
              stepSize: 1,
              autoSkip: true,
              includeBounds: false,
              callback: function(value, index, ticks) {
                if(value % 5 === 0 || value === maxLength - 1) {
                  //let d = userDatasets[maxLengthIndex].data.find(o => value === o.x);
                  //return d ? d.x : '';
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
        onHover: function(event, elements) {
          if (elements.length && elements[0].element.raw) {
            var index = elements[0].index;
            var datasetIndex = elements[0].datasetIndex;
            data.datasets[datasetIndex].segment.borderColor = ctx => ctx.p1DataIndex === index ? data.datasets[datasetIndex].data[ctx.p1DataIndex].colorHover : data.datasets[datasetIndex].data[ctx.p1DataIndex].color;
            
            let raw = elements[0].element.raw;
            allData.forEach(currentGame => {
              if(currentGame.match_id === raw.match_id) {
                if(!isScrolling) {
                  currentGame.element.scrollIntoView({behavior: "smooth", block: "center"});
                  switch(currentGame.outcome) {
                    case 1: currentGame.element.className = 'card winHover'; break;
                    case 0: currentGame.element.className = 'card loseHover'; break;
                    default: currentGame.element.className = 'card remakeHover';
                  }
                }
              } else {
                switch(currentGame.outcome) {
                  case 1: currentGame.element.className = 'card win'; break;
                  case 0: currentGame.element.className = 'card lose'; break;
                  default: currentGame.element.className = 'card remake';
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
                  case 1: d.element.className = 'card win'; break;
                  case 0: d.element.className = 'card lose'; break;
                  default: d.element.className = 'card remake';
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
              usePointStyle: true,
              pointStyle: 'rectRounded'
            }
            ,onClick: (e, legendItem, legend) => {

              let summoner_graph = summoners_graph.find(p => p.name === legendItem.text);
              const index = legendItem.datasetIndex;
              const ci = legend.chart;
              
              // Base on click action, need because overdrive
              if (ci.isDatasetVisible(index)) {
                summoner_graph.hidden = true;
                ci.hide(index);
                legendItem.hidden = true;
              } else {
                ci.show(index);
                legendItem.hidden = false;
                summoner_graph.hidden = false;
             }

            const visibleData = summoners_graph.filter(item => !item.hidden);

            const new_minY = Math.min(...visibleData.map(item => item.minY));
            const new_maxY = Math.max(...visibleData.map(item => item.maxY));
            const new_maxX = Math.max(...visibleData.map(item => item.nbGame));

            stackedLine.options.scales.y.min= Math.floor((new_minY - 100) / 100) * 100
            stackedLine.options.scales.y.max = Math.ceil((new_maxY + 100) / 100) * 100
            stackedLine.options.scales.x.max = new_maxX
            stackedLine.update();
            }
          },
          tooltip: {
            enabled: false
          },
          //zoom: zoomOptions,
        },
      }
  });

};
