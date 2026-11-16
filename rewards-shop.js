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
    if(typeof renderSBUser==="function") renderSBUser();
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
  function startDetective(difficulty,onComplete) {
    const level=Math.max(1,Math.min(4,Number(difficulty)||1));
    const today=new Date();
    const day=today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    let seed=2166136261;const seedText=day+"|detective|"+level;
    for(let i=0;i<seedText.length;i++){seed^=seedText.charCodeAt(i);seed=Math.imul(seed,16777619);}
    let state=seed>>>0;const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
    const banks=[
      [
        ["Обещают гарантированную прибыль 40% за неделю, если перевести деньги сегодня.",["Сразу перевести","Проверить компанию и не верить обещаниям гарантированной высокой доходности","Попросить друга перевести"],1],
        ["Незнакомец просит код из SMS для подтверждения перевода.",["Отправить код","Не сообщать код никому","Сфотографировать карту"],1],
        ["Продавец просит оплатить товар переводом на личную карту.",["Проверить продавца и безопасный способ оплаты","Оплатить немедленно","Отправить данные карты"],0],
        ["Вам звонят якобы из банка и просят установить приложение по ссылке.",["Установить сразу","Прервать разговор и связаться с банком по официальному номеру","Назвать пароль"],1],
        ["В сообщении обещают подарок, но просят оплатить небольшую комиссию.",["Проверить источник и не платить за сомнительный приз","Оплатить","Отправить код"],0]
      ],
      [
        ["Инвестиционный проект показывает доходность 5% в день и просит привести друзей.",["Проверить документы и риски, не считать доход гарантированным","Вложить все накопления","Взять кредит"],0],
        ["Вам прислали ссылку на вход в банк с похожим, но странным адресом.",["Ввести пароль","Открыть официальный сайт или приложение самостоятельно","Переслать ссылку"],1],
        ["Знакомый просит оформить на вас кредит для него.",["Согласиться без документов","Оценить юридическую ответственность и отказаться от сомнительной схемы","Передать доступ к банку"],1],
        ["В выписке появилась незнакомая операция.",["Игнорировать","Сразу обратиться в банк через официальный канал и проверить карту","Написать данные карты в общий чат"],1],
        ["Сервис предлагает кредит без проверки условий и скрывает полную стоимость.",["Сравнить полную стоимость и договор до решения","Подписать сразу","Ориентироваться на рекламный платёж"],0]
      ],
      [
        ["Платформа обещает доход выше рынка, но не раскрывает модель заработка.",["Проверить лицензии, документы и независимые сведения; не переводить до проверки","Вложить больше ради бонуса","Попросить знакомого внести деньги"],0],
        ["Вам предлагают стать посредником и принимать чужие переводы на свою карту.",["Согласиться за комиссию","Отказаться: это может быть частью мошеннической схемы","Передать данные карты"],1],
        ["Письмо о блокировке счёта содержит вложенный файл и срочное требование войти.",["Открыть файл","Проверить сообщение в официальном приложении банка, не открывая вложение","Переслать коллегам"],1],
        ["В договоре ставка привлекательная, но есть комиссии и штрафы мелким шрифтом.",["Оценить полную стоимость и все условия до подписания","Смотреть только на ставку","Подписать, не читая"],0],
        ["Вас просят сообщить одноразовый код для отмены якобы подозрительной операции.",["Сообщить код","Самостоятельно позвонить в банк по официальному номеру; код не сообщать","Отправить фото карты"],1],
        ["Проект показывает отзывы, но не даёт проверить юридическое лицо.",["Считать отзывы достаточным доказательством","Проверить регистрацию, лицензии и независимые источники","Внести минимальную сумму"],1]
      ],
      [
        ["Сложная инвестиционная схема обещает фиксированную высокую доходность, но не объясняет источник выплат.",["Проверить структуру, регуляторный статус, контрагентов и риски; не переводить средства до независимой проверки","Оценить только отзывы","Вложить резерв ради диверсификации"],0],
        ["Контрагент просит провести платёж через ваш счёт, чтобы обойти лимиты.",["Согласиться, если платят комиссию","Отказаться и не участвовать в обходе контроля","Передать данные доступа"],1],
        ["В уведомлении о налоговом возврате требуют ввести банковские данные на стороннем домене.",["Проверить право на возврат через официальный государственный сервис","Заполнить форму сразу","Отправить данные отправителю"],0],
        ["Финансовый продукт сложен, а продавец торопит подписать договор сегодня.",["Попросить документы, изучить риски и при необходимости получить независимую консультацию","Подписать из-за срока акции","Ориентироваться на устные обещания"],0],
        ["Вам предлагают гарантировать чужой долг, не раскрывая финансовое положение заёмщика.",["Подписать ради доверия","Оценить возможную ответственность и не соглашаться без полного понимания договора","Передать копию карты"],1],
        ["Отчёт показывает высокую прошлую доходность, но не раскрывает просадки и комиссии.",["Считать прошлый результат гарантией","Изучить методику расчёта, риски, просадки и чистую доходность","Сравнить только лучший месяц"],1]
      ]
    ];
    const bank=banks[level-1].slice();for(let i=bank.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bank[i],bank[j]]=[bank[j],bank[i]];}
    const count=[3,4,5,6][level-1],cases=bank.slice(0,count),area=document.getElementById("gfGameArea");
    area.innerHTML='<section class="card gf-game-play"><h3>Финансовый детектив · '+["Лёгкий","Средний","Сложный","Эксперт"][level-1]+'</h3><p>Найди безопасное решение. Максимальная награда за этот уровень — '+[5,8,12,16][level-1]+' ✦.</p><form id="gfDetectiveForm">'+
      cases.map((x,i)=>'<fieldset><legend>'+(i+1)+'. '+x[0]+'</legend>'+x[1].map((answer,j)=>'<label class="gf-answer"><input type="radio" name="case'+i+'" value="'+j+'" required><span>'+answer+'</span></label>').join("")+'</fieldset>').join("")+
      '<button class="btn btn-primary" type="submit">Проверить решения</button></form></section>';
    area.scrollIntoView({behavior:"smooth",block:"start"});
    document.getElementById("gfDetectiveForm").addEventListener("submit",e=>{
      e.preventDefault();const data=new FormData(e.currentTarget);
      const score=cases.reduce((sum,x,i)=>sum+(Number(data.get("case"+i))===x[2]?1:0),0);
      const mistakes=cases.length-score;
      const feedback=cases.map((item,i)=>{
        const chosen=Number(data.get("case"+i)),ok=chosen===item[2];
        return {ok,title:(i+1)+". "+item[0],detail:ok?"Верное решение: "+item[1][item[2]]+". Оно снижает риск и защищает твои данные.":"Твой выбор: "+item[1][chosen]+". Правильное решение: "+item[1][item[2]]+". Не торопись, проверь источник и используй только официальные каналы."};
      });
      if(typeof onComplete==="function")onComplete(mistakes,cases.length,feedback);
      const result=document.createElement("section");result.className="card gf-game-feedback";result.innerHTML='<h3>Результат: '+score+'/'+cases.length+'</h3>'+feedback.map(row=>'<div class="gf-feedback-row '+(row.ok?'is-correct':'is-wrong')+'"><strong>'+(row.ok?'✓ ':'✕ ')+row.title+'</strong><p>'+row.detail+'</p></div>').join("");
      e.currentTarget.parentElement.appendChild(result);result.scrollIntoView({behavior:"smooth",block:"nearest"});
      notifyUser("Правильных решений: "+score+"/"+cases.length+". Ошибок: "+mistakes+".");
    });
  }

  const labels={ru:"Магазин",kz:"Дүкен",en:"Shop"};
  ["ru","kz","en"].forEach(lang=>{if(L[lang]&&L[lang].nav)L[lang].nav.shop=labels[lang];});
  if(!TABS.some(x=>x.id==="shop"))TABS.push({id:"shop",icon:"fa-store"});
  // Expose the shop renderer to the main navigation router.
  window.MYWAY_REWARDS = { renderShop, startDetective };
  const oldHeader=renderHeader;
  renderHeader=function(){oldHeader();applyCosmetics();};
  applyCosmetics();
})();