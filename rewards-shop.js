/* MY WAY reward shop + bonus mini-game. Loaded after habits-tasks.js. */
(() => {
  "use strict";
  if (typeof DATA === "undefined" || typeof TABS === "undefined") return;

  DATA.coins = Number(DATA.coins) || 0;
  DATA.ownedThemes = Array.isArray(DATA.ownedThemes) ? DATA.ownedThemes : ["default"];
  DATA.activeTheme = DATA.activeTheme || "default";
  DATA.activeBadge = DATA.activeBadge || "✦";
  DATA.ownedBadges = Array.isArray(DATA.ownedBadges) ? DATA.ownedBadges : [];
  DATA.rewardedGames = DATA.rewardedGames && typeof DATA.rewardedGames === "object" ? DATA.rewardedGames : {};

  const items = [
    {id:"aurora",name:"Северное сияние",type:"theme",price:45,desc:"Холодные сине-фиолетовые оттенки"},
    {id:"ocean",name:"Океан",type:"theme",price:60,desc:"Глубокие бирюзовые и синие оттенки"},
    {id:"sunset",name:"Закат",type:"theme",price:60,desc:"Тёплые персиковые и золотые оттенки"},
    {id:"rose",name:"Розовый кварц",type:"theme",price:75,desc:"Мягкие розово-лиловые акценты"},
    {id:"star",name:"Значок звезды",type:"badge",price:25,emoji:"⭐",desc:"Значок профиля"},
    {id:"comet",name:"Значок кометы",type:"badge",price:35,emoji:"☄️",desc:"Значок профиля"},
    {id:"crown",name:"Значок короны",type:"badge",price:50,emoji:"👑",desc:"Значок профиля"}
  ];
  const todayKey = () => { const d=new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); };
  const notifyUser = (message) => { if (typeof notify === "function") notify(message,"info"); else alert(message); };
  function applyCosmetics() {
    document.documentElement.dataset.gfSkin = DATA.activeTheme || "default";
    const avatar=document.querySelector("#sbUser .su-av");
    if(avatar) avatar.textContent=DATA.activeBadge||"✦";
  }
  function renderShop() {
    const coins=Number(DATA.coins)||0;
    const cards=items.map(item=>{
      const owned=item.type==="theme" ? DATA.ownedThemes.includes(item.id) : DATA.ownedBadges.includes(item.emoji);
      const active=item.type==="theme" && DATA.activeTheme===item.id;
      const action=active?"Выбрано":owned?(item.type==="theme"?"Применить":"Выбрать"):"Купить · "+item.price+" ✦";
      return '<article class="card gf-shop-card"><div class="gf-shop-preview gf-preview-'+item.id+'">'+(item.emoji||"✦")+'</div><div class="gf-shop-info"><strong>'+item.name+'</strong><p>'+item.desc+'</p><small>'+(item.type==="theme"?"Тема оформления":"Значок профиля")+'</small></div><button class="btn '+(active?"btn-ghost":"btn-primary")+' btn-sm" data-shop-item="'+item.id+'" '+(active?"disabled":"")+'>'+action+'</button></article>';
    }).join("");
    document.getElementById("content").innerHTML='<div class="gf-intro"><div><div class="gf-eyebrow">MY WAY · REWARDS</div><h2>Магазин наград</h2><p>Обменивай монеты за победы на темы и значки профиля.</p></div><div class="gf-stat"><strong>'+coins+'</strong><span>✦ монет</span></div></div><div class="gf-shop-grid">'+cards+'</div>';
    document.querySelectorAll("[data-shop-item]").forEach(button=>button.addEventListener("click",()=>{
      const item=items.find(x=>x.id===button.dataset.shopItem); if(!item)return;
      const owned=item.type==="theme"?DATA.ownedThemes.includes(item.id):DATA.ownedBadges.includes(item.emoji);
      if(!owned){
        if((Number(DATA.coins)||0)<item.price){notifyUser("Не хватает монет. Побеждай в играх, чтобы заработать ещё.");return;}
        DATA.coins-=item.price;
        if(item.type==="theme") DATA.ownedThemes.push(item.id); else DATA.ownedBadges.push(item.emoji);
      }
      if(item.type==="theme") DATA.activeTheme=item.id;
      else DATA.activeBadge=item.emoji;
      saveData(); applyCosmetics(); renderSBUser(); renderHeader(); renderShop();
      if(typeof notify==="function")notifyUser("Награда применена!");
    }));
  }
  function renderDetective() {
    const cases=[
      {q:"Тебе обещают гарантированную прибыль 40% за неделю, если перевести деньги сегодня. Что делать?",a:["Сразу перевести","Проверить компанию и не верить обещаниям гарантированной высокой доходности","Попросить друга перевести"],c:1},
      {q:"Незнакомец просит код из SMS, чтобы «подтвердить перевод».",a:["Отправить код","Не сообщать код никому","Сфотографировать карту"],c:1},
      {q:"Магазин предлагает товар намного дешевле рынка, но требует оплатить переводом на личную карту.",a:["Проверить продавца и безопасные способы оплаты","Оплатить немедленно","Отправить данные карты в чат"],c:0}
    ];
    const area=document.getElementById("gfGameArea");
    area.innerHTML='<section class="card gf-game-play"><h3>Финансовый детектив</h3><p>Найди три подозрительных ситуации.</p><form id="gfDetectiveForm">'+cases.map((x,i)=>'<fieldset><legend>'+(i+1)+'. '+x.q+'</legend>'+x.a.map((a,j)=>'<label class="gf-answer"><input type="radio" name="case'+i+'" value="'+j+'" required><span>'+a+'</span></label>').join("")+'</fieldset>').join("")+'<button class="btn btn-primary" type="submit">Проверить решения</button></form></section>';
    document.getElementById("gfDetectiveForm").addEventListener("submit",e=>{
      e.preventDefault();const data=new FormData(e.currentTarget);
      const score=cases.reduce((sum,x,i)=>sum+(Number(data.get("case"+i))===x.c?1:0),0);
      if(score!==3){notifyUser("Правильных решений: "+score+"/3. Попробуй ещё раз.");return;}
      const key="detective:"+todayKey();
      if(DATA.rewardedGames[key]){notifyUser("Награда за эту игру уже получена сегодня.");return;}
      DATA.rewardedGames[key]=true;DATA.xp=(Number(DATA.xp)||0)+25;DATA.coins=(Number(DATA.coins)||0)+8;
      if(DATA.xp>=100){DATA.level=(Number(DATA.level)||1)+Math.floor(DATA.xp/100);DATA.xp%=100;if(typeof updateRank==="function")updateRank();}
      saveData();renderHeader();renderSBUser();
      notifyUser("Победа! +25 XP и +8 монет. Загляни в магазин наград.");
    });
  }

  const labels={ru:"Магазин",kz:"Дүкен",en:"Shop"};
  ["ru","kz","en"].forEach(lang=>{if(L[lang]&&L[lang].nav)L[lang].nav.shop=labels[lang];});
  if(!TABS.some(x=>x.id==="shop"))TABS.push({id:"shop",icon:"fa-store"});
  const originalRenderActiveTab=renderActiveTab;
  renderActiveTab=function(tab){
    if(tab==="shop")return renderShop();
    return originalRenderActiveTab(tab);
  };
  const originalRenderGamesTab=window.renderGamesTab;
  // Existing mini-games stay intact; append a fourth game card when their screen renders.
  document.addEventListener("click",e=>{
    if(e.target&&e.target.id==="gfStartDetective")renderDetective();
  });
  const observer=new MutationObserver(()=>{
    const grid=document.querySelector("#content .gf-game-grid");
    if(!grid||!document.getElementById("gfStartQuiz")||document.getElementById("gfStartDetective"))return;
    const card=document.createElement("article");
    card.className="card gf-game-card";
    card.innerHTML='<div class="gf-game-icon">🕵️</div><h3>Финансовый детектив</h3><p>Находи подозрительные предложения и защищай свои деньги.</p><button class="btn btn-primary" id="gfStartDetective" type="button">Начать игру</button>';
    grid.appendChild(card);
  });
  observer.observe(document.getElementById("content"),{childList:true,subtree:true});
  const oldHeader=renderHeader;
  renderHeader=function(){oldHeader();applyCosmetics();};
  applyCosmetics();
})();