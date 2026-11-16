/* MY WAY guest features: habits, tasks and local financial-literacy mini-games.
   Uses existing DATA/saveData() and does not call authenticated API endpoints. */
(() => {
  "use strict";
  if (typeof DATA === "undefined" || typeof TABS === "undefined") return;

  DATA.habits = Array.isArray(DATA.habits) ? DATA.habits : [];
  DATA.tasks = Array.isArray(DATA.tasks) ? DATA.tasks : [];
  DATA.coins = Number(DATA.coins) || 0;
  DATA.guestGameResults = Array.isArray(DATA.guestGameResults) ? DATA.guestGameResults : [];

  const labels = {
    ru: {habits:"Привычки",tasks:"Задачи",games:"Мини-игры",learning:"Обучение"},
    kz: {habits:"Әдеттер",tasks:"Тапсырмалар",games:"Шағын ойындар",learning:"Оқу"},
    en: {habits:"Habits",tasks:"Tasks",games:"Mini games",learning:"Learning"}
  };
  ["ru","kz","en"].forEach(lang => {
    if (L[lang] && L[lang].nav) Object.assign(L[lang].nav, labels[lang]);
  });

  [
    {id:"habits",icon:"fa-calendar-check"},
    {id:"tasks",icon:"fa-list-check"},
    {id:"games",icon:"fa-puzzle-piece"},
    {id:"learning",icon:"fa-book-open"}
  ].forEach(tab => {
    if (!TABS.some(item => item.id === tab.id)) TABS.push(tab);
  });

  const escText = value => typeof esc === "function"
    ? esc(String(value == null ? "" : value))
    : String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const today = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  };
  const reward = (xp, coins, message) => {
    DATA.xp = (Number(DATA.xp)||0) + xp;
    DATA.coins = (Number(DATA.coins)||0) + coins;
    if (DATA.xp >= 100) {
      DATA.level = (Number(DATA.level)||1) + Math.floor(DATA.xp/100);
      DATA.xp %= 100;
      if (typeof updateRank === "function") updateRank();
    }
    saveData();
    if (typeof renderHeader === "function") renderHeader();
    if (typeof renderSBUser === "function") renderSBUser();
    if (typeof notify === "function") notify(message + ": +" + xp + " XP · +" + coins + " ✦", "success");
  };
  const renderItemButton = (label, action, id, cls) =>
    '<button type="button" class="btn ' + cls + ' btn-sm" data-gf-action="' + action + '" data-gf-id="' + escText(id) + '">' + label + '</button>';

  function renderHabitsTab() {
    const date = today();
    const done = DATA.habits.filter(h => (h.completedDates||[]).includes(date)).length;
    let html = '<div class="gf-intro"><div><div class="gf-eyebrow">MY WAY · DAILY ROUTINE</div><h2>Мои привычки</h2><p>Небольшие регулярные действия создают большие изменения.</p></div><div class="gf-stat"><strong>' + done + '/' + DATA.habits.length + '</strong><span>выполнено сегодня</span></div></div>';
    html += '<section class="card gf-form-card"><form id="gfHabitForm" class="gf-inline-form"><input class="finput" id="gfHabitTitle" maxlength="80" placeholder="Например: читать 15 минут" required><button class="btn btn-primary" type="submit"><i class="fas fa-plus"></i> Добавить привычку</button></form></section>';
    if (!DATA.habits.length) html += '<div class="card gf-empty"><div>🌱</div><strong>Пока нет привычек</strong><span>Добавь первую привычку выше.</span></div>';
    DATA.habits.forEach(h => {
      const dates = h.completedDates || [];
      const isDone = dates.includes(date);
      html += '<article class="card gf-item"><div class="gf-item-main"><div class="gf-icon">✦</div><div><strong>' + escText(h.title) + '</strong><small>' + dates.length + ' отметок</small></div></div><div class="gf-item-actions">' +
        renderItemButton(isDone ? "✓ Сегодня готово" : "Отметить", isDone ? "noop" : "habit-done", h.id, isDone ? "btn-ghost" : "btn-primary") +
        '<button type="button" class="gf-delete" data-gf-action="habit-delete" data-gf-id="' + escText(h.id) + '" aria-label="Удалить">×</button></div></article>';
    });
    document.getElementById("content").innerHTML = html;
    document.getElementById("gfHabitForm").addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("gfHabitTitle").value.trim();
      if (!title) return;
      DATA.habits.push({id:Date.now(),title:title.slice(0,80),createdAt:Date.now(),completedDates:[]});
      saveData(); renderHabitsTab();
    });
    document.querySelectorAll("[data-gf-action]").forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.gfId;
      if (btn.dataset.gfAction === "habit-done") {
        const habit = DATA.habits.find(x => String(x.id) === String(id));
        if (!habit) return;
        habit.completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
        if (!habit.completedDates.includes(date)) {
          habit.completedDates.push(date); reward(10,1,"Привычка выполнена");
        }
        renderHabitsTab();
      }
      if (btn.dataset.gfAction === "habit-delete" && confirm("Удалить привычку?")) {
        DATA.habits = DATA.habits.filter(x => String(x.id) !== String(id)); saveData(); renderHabitsTab();
      }
    }));
  }

  function renderTasksTab() {
    const pending = DATA.tasks.filter(t => !t.completed);
    const done = DATA.tasks.filter(t => t.completed);
    let html = '<div class="gf-intro"><div><div class="gf-eyebrow">MY WAY · FOCUS</div><h2>Мои задачи</h2><p>Записывай важное и отмечай выполненное.</p></div><div class="gf-stat"><strong>' + pending.length + '</strong><span>активных задач</span></div></div>';
    html += '<section class="card gf-form-card"><form id="gfTaskForm" class="gf-task-form"><input class="finput" id="gfTaskTitle" maxlength="120" placeholder="Что нужно сделать?" required><input class="finput" id="gfTaskDate" type="date" aria-label="Срок"><select class="sel" id="gfTaskPriority"><option value="normal">Обычный приоритет</option><option value="high">Высокий приоритет</option><option value="low">Низкий приоритет</option></select><button class="btn btn-primary" type="submit"><i class="fas fa-plus"></i> Добавить</button></form></section>';
    if (!pending.length) html += '<div class="card gf-empty"><div>✓</div><strong>Нет активных задач</strong><span>Добавь новую задачу выше.</span></div>';
    pending.forEach(t => {
      html += '<article class="card gf-item"><div class="gf-item-main"><span class="gf-priority gf-priority-' + escText(t.priority||"normal") + '"></span><div><strong>' + escText(t.title) + '</strong><small>' + (t.dueDate ? "Срок: " + escText(t.dueDate) : "Без срока") + '</small></div></div><div class="gf-item-actions">' + renderItemButton("Готово","task-done",t.id,"btn-primary") + '<button type="button" class="gf-delete" data-gf-action="task-delete" data-gf-id="' + escText(t.id) + '">×</button></div></article>';
    });
    if (done.length) {
      html += '<div class="gf-completed-label">Выполнено · ' + done.length + '</div>';
      done.forEach(t => { html += '<article class="card gf-item gf-item-done"><div class="gf-item-main"><div class="gf-icon">✓</div><div><strong>' + escText(t.title) + '</strong><small>Готово</small></div></div><button type="button" class="gf-delete" data-gf-action="task-delete" data-gf-id="' + escText(t.id) + '">×</button></article>'; });
    }
    document.getElementById("content").innerHTML = html;
    document.getElementById("gfTaskForm").addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("gfTaskTitle").value.trim();
      if (!title) return;
      DATA.tasks.push({id:Date.now(),title:title.slice(0,120),dueDate:document.getElementById("gfTaskDate").value,priority:document.getElementById("gfTaskPriority").value,completed:false,createdAt:Date.now()});
      saveData(); renderTasksTab();
    });
    document.querySelectorAll("[data-gf-action]").forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.gfId;
      if (btn.dataset.gfAction === "task-done") {
        const task = DATA.tasks.find(x => String(x.id) === String(id));
        if (task && !task.completed) { task.completed = true; task.completedAt = Date.now(); reward(5,1,"Задача выполнена"); }
        renderTasksTab();
      }
      if (btn.dataset.gfAction === "task-delete" && confirm("Удалить задачу?")) {
        DATA.tasks = DATA.tasks.filter(x => String(x.id) !== String(id)); saveData(); renderTasksTab();
      }
    }));
  }

  const difficultyLevels = [
    {id:1,name:"Лёгкий",stars:5,questions:4},
    {id:2,name:"Средний",stars:8,questions:4},
    {id:3,name:"Сложный",stars:12,questions:5},
    {id:4,name:"Эксперт",stars:16,questions:6}
  ];
  let selectedDifficulty = 1;
  const dailySeed = key => {
    const s = today() + "|" + key;
    let n = 2166136261;
    for (let i=0;i<s.length;i++) { n ^= s.charCodeAt(i); n = Math.imul(n,16777619); }
    return n >>> 0;
  };
  const seededRandom = seed => {
    let x = seed >>> 0;
    return () => { x = (Math.imul(1664525,x)+1013904223)>>>0; return x/4294967296; };
  };
  const shuffled = (list, random) => {
    const out=list.slice();
    for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  };
  const quizBanks = [
    [
      ["Что лучше сделать после получения дохода?",["Потратить всё","Сначала отложить запланированную сумму","Взять кредит"],1],
      ["Для чего нужен резервный фонд?",["Для непредвиденных расходов","Для ежедневных покупок","Для подписок"],0],
      ["Что показывает бюджет?",["Только доходы","План доходов и расходов","Только долги"],1],
      ["Как сравнить цены похожих товаров?",["По стоимости за одинаковую единицу","По цвету упаковки","Выбрать самый дорогой"],0],
      ["Что такое обязательный расход?",["Покупка по желанию","Платёж, который необходим регулярно","Случайный подарок"],1],
      ["Как безопаснее хранить PIN-код?",["Записать на карте","Не сообщать и не пересылать его","Отправить знакомому"],1],
      ["Что делать перед крупной покупкой?",["Сравнить варианты и проверить бюджет","Купить сразу","Взять первый кредит"],0],
      ["Какой расход относится к переменным?",["Ежемесячная фиксированная аренда","Покупка продуктов","Фиксированный тариф"],1]
    ],
    [
      ["Доход — 200 000 ₸, расходы — 170 000 ₸. Сколько можно отложить?",["10 000 ₸","30 000 ₸","40 000 ₸"],1],
      ["Что означает диверсификация?",["Вложить всё в один актив","Распределить вложения между разными активами","Потратить прибыль"],1],
      ["Почему минимальный платёж по кредиту может быть невыгоден?",["Долг может дольше оставаться и дорожать","Он всегда отменяет проценты","Он уменьшает цену товара"],0],
      ["Как оценить подписку?",["Проверить пользу и регулярную стоимость","Смотреть только на рекламу","Не учитывать её в бюджете"],0],
      ["Инфляция — это...",["Общее повышение цен","Снижение доходов компании","Бонус по карте"],0],
      ["Что лучше сравнивать при выборе вклада?",["Только название банка","Ставку, срок и условия снятия","Цвет приложения"],1],
      ["Какой фонд подходит для непредвиденных событий?",["Резервный","Развлекательный","Подарочный"],0],
      ["Если доход нестабилен, бюджет лучше строить...",["На максимально возможном доходе","На осторожной оценке минимального дохода","Без учёта расходов"],1]
    ],
    [
      ["Номинальная ставка 12% годовых, инфляция 8%. Реальная доходность приблизительно...",["20%","4%","8%"],1],
      ["Актив вырос на 10%, затем упал на 10%. Итог относительно старта...",["Без изменений","Ниже примерно на 1%","Выше на 1%"],1],
      ["Почему кредитная нагрузка важна?",["Она показывает долю дохода на выплаты по долгам","Она равна сумме накоплений","Она не влияет на бюджет"],0],
      ["Что такое альтернативная стоимость?",["Цена только со скидкой","Ценность лучшего из вариантов, от которого отказались","Комиссия банка"],1],
      ["Какой риск несёт концентрация всех вложений в одной компании?",["Риск полностью зависит от одной компании","Риск исчезает","Доход гарантирован"],0],
      ["При досрочном погашении кредита важно проверить...",["Условия и порядок перерасчёта процентов","Только цвет карты","Лимит переводов"],0],
      ["Что показывает денежный поток?",["Движение поступлений и платежей за период","Только стоимость имущества","Количество покупок"],0],
      ["Если цена выросла с 8 000 до 10 000 ₸, рост составляет...",["20%","25%","เพ 30%"],1]
    ],
    [
      ["Почему доходность выше рыночной обычно связана с большим риском?",["Потому что высокая доходность часто компенсирует неопределённость","Потому что риск всегда нулевой","Потому что цена не меняется"],0],
      ["Эффективная годовая ставка учитывает...",["Только рекламный процент","Капитализацию и периодичность начислений","Только срок карты"],1],
      ["Что точнее описывает ликвидность?",["Насколько быстро актив можно превратить в деньги без большой потери стоимости","Размер ежемесячного дохода","Количество банков"],0],
      ["Портфель упал на 20%. Какой рост нужен, чтобы вернуться к исходной сумме?",["20%","25%","40%"],1],
      ["Что такое риск реинвестирования?",["Риск того, что будущие средства придётся вложить под менее выгодную ставку","Риск потерять PIN","Риск роста зарплаты"],0],
      ["Почему важно учитывать налоги и комиссии при оценке инвестиций?",["Они уменьшают фактическую чистую доходность","Они всегда повышают доход","Они не влияют на результат"],0],
      ["Что означает отрицательная реальная доходность?",["Покупательная способность денег снизилась","Номинальная сумма обязательно стала нулевой","Доходность гарантирована"],0],
      ["Как корректно оценивать финансовую цель?",["Учитывать срок, инфляцию, риск и регулярность взносов","Учитывать только желаемую сумму","Ориентироваться на чужой результат"],0]
    ]
  ];
  const goalBanks = [
    ["Записать сумму цели","Определить срок","Рассчитать посильный регулярный взнос","Проверять прогресс","Сравнить цены перед покупкой","Учитывать резерв"],
    ["Разделить цель на этапы","Учесть нерегулярные доходы","Автоматизировать накопления","Пересматривать план при изменении дохода","Сначала проверить обязательные расходы","Не тратить резерв на развлечения"],
    ["Рассчитать инфляцию за срок цели","Сопоставить риск и срок хранения денег","Проверять комиссии и условия","Задать контрольные точки","Оценить альтернативную стоимость","Сравнить только рекламные проценты"],
    ["Учесть налоги и реальную доходность","Проверить сценарии снижения дохода","Разделить ликвидный резерв и долгосрочные накопления","Пересчитывать план при изменении предположений","Оценить концентрацию рисков","Считать доходность гарантированной"]
  ];
  const goalDistractors = [
    ["Взять любой доступный кредит","Не записывать расходы","Потратить резерв"],
    ["Ориентироваться только на максимальный доход","Игнорировать комиссии","Не проверять план"],
    ["Вложить все деньги в один актив","Игнорировать инфляцию","Считать прошлую доходность гарантией"],
    ["Не учитывать налоги","Игнорировать риск потери ликвидности","Считать прогноз точным обещанием"]
  ];
  function renderDifficultyPicker() {
    return '<div class="gf-difficulty"><strong>Сложность</strong><div class="gf-difficulty-options">' +
      difficultyLevels.map(d=>'<button type="button" class="btn btn-sm '+(selectedDifficulty===d.id?'btn-primary':'btn-ghost')+'" data-gf-difficulty="'+d.id+'">'+d.name+' · до '+d.stars+' ✦</button>').join("") +
      '</div></div>';
  }
  function bindDifficultyPicker() {
    document.querySelectorAll("[data-gf-difficulty]").forEach(btn=>btn.addEventListener("click",()=>{
      selectedDifficulty=Number(btn.dataset.gfDifficulty)||1;
      renderGamesTab();
    }));
  }
  function renderGamesTab() {
    let html = '<div class="gf-intro"><div><div class="gf-eyebrow">MY WAY · LEARN BY DOING</div><h2>Финансовые мини-игры</h2><p>Каждый день — новый набор заданий. Чем выше сложность, тем больше можно заработать.</p></div><div class="gf-stat"><strong>' + DATA.guestGameResults.length + '</strong><span>завершено игр</span></div></div>';
    html += renderDifficultyPicker();
    html += '<div class="gf-game-grid"><article class="card gf-game-card"><div class="gf-game-icon">🧠</div><h3>Финансовый квиз</h3><p>Новые вопросы каждый день.</p><button class="btn btn-primary" id="gfStartQuiz">Начать · '+difficultyLevels[selectedDifficulty-1].questions+' вопросов</button></article><article class="card gf-game-card"><div class="gf-game-icon">💰</div><h3>Собери бюджет</h3><p>Новый доход и условия каждый день. Поля без готовых ответов.</p><button class="btn btn-primary" id="gfStartBudget">Начать игру</button></article><article class="card gf-game-card"><div class="gf-game-icon">🎯</div><h3>План цели</h3><p>Разные правильные шаги и ловушки на каждом уровне.</p><button class="btn btn-primary" id="gfStartGoal">Начать игру</button></article><article class="card gf-game-card"><div class="gf-game-icon">🕵️</div><h3>Финансовый детектив</h3><p>Ежедневные ситуации для проверки финансовой безопасности.</p><button class="btn btn-primary" id="gfStartDetective">Начать игру</button></article></div><div id="gfGameArea"></div>';
    if (DATA.guestGameResults.length) {
      html += '<section class="card gf-game-history"><strong>Последние результаты</strong>';
      DATA.guestGameResults.slice(-5).reverse().forEach(r => { html += '<div><span>' + escText(r.name) + (r.difficulty?' · '+escText(r.difficulty):'') + '</span><b>+' + r.xp + ' XP · +' + (r.stars==null?r.coins:r.stars) + ' ✦</b></div>'; });
      html += '</section>';
    }
    document.getElementById("content").innerHTML = html;
    bindDifficultyPicker();
    document.getElementById("gfStartQuiz").addEventListener("click", startQuiz);
    document.getElementById("gfStartBudget").addEventListener("click", startBudget);
    document.getElementById("gfStartGoal").addEventListener("click", startGoal);
    document.getElementById("gfStartDetective").addEventListener("click",()=>{
      if(window.MYWAY_REWARDS&&typeof window.MYWAY_REWARDS.startDetective==="function") {
        window.MYWAY_REWARDS.startDetective(selectedDifficulty, (mistakes,total)=>recordGame("Финансовый детектив","detective",mistakes,total));
      }
    });
  }
  function recordGame(name, gameKey, mistakes, total) {
    const day = today();
    if (DATA.guestGameResults.some(r => r.gameKey === gameKey && r.day === day)) {
      if (typeof notify === "function") notify("Награда за эту игру уже получена сегодня. Можно пройти новый вариант ради практики!","info");
      return;
    }
    const level=difficultyLevels[selectedDifficulty-1];
    const errors=Math.max(0,Number(mistakes)||0);
    const stars=Math.max(0,level.stars-errors);
    const xp=Math.max(5,30-(errors*3)+(selectedDifficulty-1)*3);
    DATA.guestGameResults.push({name:name,gameKey:gameKey,day:day,xp:xp,coins:stars,stars:stars,mistakes:errors,difficulty:level.name,date:Date.now()});
    DATA.guestGameResults=DATA.guestGameResults.slice(-40);
    reward(xp,stars,"Игра завершена · "+level.name+" · ошибок: "+errors);
    renderGamesTab();
  }
  function startQuiz() {
    const level=difficultyLevels[selectedDifficulty-1];
    const random=seededRandom(dailySeed("quiz:"+selectedDifficulty));
    const bank=quizBanks[selectedDifficulty-1];
    const questions=shuffled(bank,random).slice(0,level.questions).map(q=>{
      const order=shuffled(q[1].map((answer,index)=>({answer:answer,index:index})),random);
      return [q[0],order.map(x=>x.answer),order.findIndex(x=>x.index===q[2])];
    });
    const area=document.getElementById("gfGameArea");
    area.innerHTML='<section class="card gf-game-play"><h3>Финансовый квиз · '+level.name+'</h3><p>Ошибки уменьшают награду: максимум '+level.stars+' ✦.</p><form id="gfQuizForm">'+
      questions.map((q,i)=>'<fieldset><legend>'+(i+1)+'. '+escText(q[0])+'</legend>'+q[1].map((answer,j)=>'<label class="gf-answer"><input type="radio" name="q'+i+'" value="'+j+'" required><span>'+escText(answer)+'</span></label>').join("")+'</fieldset>').join("")+
      '<button class="btn btn-primary" type="submit">Проверить ответы</button></form></section>';
    area.scrollIntoView({behavior:"smooth",block:"start"});
    document.getElementById("gfQuizForm").addEventListener("submit",e=>{
      e.preventDefault();const data=new FormData(e.currentTarget);
      const score=questions.reduce((sum,q,i)=>sum+(Number(data.get("q"+i))===q[2]?1:0),0);
      recordGame("Финансовый квиз","quiz",questions.length-score,questions.length);
      if(typeof notify==="function")notify("Результат: "+score+"/"+questions.length+" правильных. Ошибок: "+(questions.length-score)+".","info");
    });
  }
  function startBudget() {
    const level=difficultyLevels[selectedDifficulty-1];
    const random=seededRandom(dailySeed("budget:"+selectedDifficulty));
    const totals=[80000,120000,180000,250000];
    const total=totals[selectedDifficulty-1]+Math.floor(random()*10)*5000;
    const categories=[
      ["Необходимые расходы","needs"],["Накопления","savings"],["Обучение","learning"],["Развлечения","fun"],
      ["Транспорт","transport"],["Здоровье","health"],["Подарки и другое","other"]
    ].slice(0,[4,5,6,7][selectedDifficulty-1]);
    const savingsMin=[10,15,18,20][selectedDifficulty-1];
    const needsMax=[65,55,50,45][selectedDifficulty-1];
    const learningMin=[0,5,7,8][selectedDifficulty-1];
    const area=document.getElementById("gfGameArea");
    area.innerHTML='<section class="card gf-game-play"><h3>Собери бюджет · '+level.name+'</h3><p>Доход на этот день: <strong>'+total.toLocaleString("ru-RU")+' ₸</strong>. Распредели всю сумму по категориям. Накопления — не менее '+savingsMin+'%, необходимые расходы — не более '+needsMax+'%'+(learningMin?' , обучение — не менее '+learningMin+'%':'')+'. Неиспользованный остаток тоже нужно распределить.</p><form id="gfBudgetForm" class="gf-budget-form">'+
      categories.map(c=>'<label>'+c[0]+'<input class="finput" name="'+c[1]+'" type="number" min="0" step="100" placeholder="Введи сумму в ₸" required></label>').join("")+
      '<button class="btn btn-primary" type="submit">Проверить бюджет</button></form></section>';
    document.getElementById("gfBudgetForm").addEventListener("submit",e=>{
      e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget).entries());
      const amounts=categories.map(c=>Number(values[c[1]]));
      let mistakes=0;
      if(amounts.some(v=>!Number.isFinite(v)||v<0))mistakes++;
      if(amounts.reduce((sum,v)=>sum+v,0)!==total)mistakes++;
      if((Number(values.savings)||0)<total*savingsMin/100)mistakes++;
      if((Number(values.needs)||0)>total*needsMax/100)mistakes++;
      if(learningMin&&(Number(values.learning)||0)<total*learningMin/100)mistakes++;
      if(mistakes===0){
        recordGame("Собери бюджет","budget",0,5);
        if(typeof notify==="function")notify("Бюджет сбалансирован! Все условия выполнены.","success");
      } else {
        recordGame("Собери бюджет","budget",mistakes,5);
        if(typeof notify==="function")notify("Есть "+mistakes+" ошибки в проверке бюджета. Награда уменьшена за каждое нарушенное условие.","info");
      }
    });
    area.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function startGoal() {
    const level=difficultyLevels[selectedDifficulty-1];
    const random=seededRandom(dailySeed("goal:"+selectedDifficulty));
    const correct=shuffled(goalBanks[selectedDifficulty-1],random).slice(0,[3,4,5,6][selectedDifficulty-1]);
    const wrong=shuffled(goalDistractors[selectedDifficulty-1],random).slice(0,2);
    const options=shuffled(correct.map(x=>({text:x,correct:true})).concat(wrong.map(x=>({text:x,correct:false}))),random);
    const area=document.getElementById("gfGameArea");
    area.innerHTML='<section class="card gf-game-play"><h3>План финансовой цели · '+level.name+'</h3><p>Выбери все правильные действия. Каждая ошибка уменьшает награду.</p><form id="gfGoalForm">'+
      options.map((x,i)=>'<label class="gf-answer"><input type="checkbox" name="s'+i+'"><span>'+escText(x.text)+'</span></label>').join("")+
      '<button class="btn btn-primary" type="submit">Проверить план</button></form></section>';
    document.getElementById("gfGoalForm").addEventListener("submit",e=>{
      e.preventDefault();const data=new FormData(e.currentTarget);
      let mistakes=0;
      options.forEach((x,i)=>{if(data.has("s"+i)!==x.correct)mistakes++;});
      recordGame("План финансовой цели","goal",mistakes,options.length);
    });
    area.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function renderLearningTab() {
    document.getElementById("content").innerHTML =
      '<div class="gf-intro"><div><div class="gf-eyebrow">MY WAY · LEVEL UP YOURSELF</div><h2>Обучение</h2><p>Знания — твой главный ресурс.</p></div></div>' +
      '<div class="gf-game-grid">' +
      '<article class="card gf-game-card"><div class="gf-game-icon">₸</div><h3>Финансовая грамотность</h3><p>Доходы, расходы, бюджет и накопления.</p><span class="gf-coming">СКОРО</span></article>' +
      '<article class="card gf-game-card"><div class="gf-game-icon">◎</div><h3>Постановка целей</h3><p>Планирование и достижение целей.</p><span class="gf-coming">СКОРО</span></article>' +
      '<article class="card gf-game-card"><div class="gf-game-icon">✧</div><h3>Саморазвитие</h3><p>Привычки, дисциплина и продуктивность.</p><span class="gf-coming">СКОРО</span></article>' +
      '</div>';
  }

  const originalRenderHeader = renderHeader;
  renderHeader = function renderHeaderWithGuestCoins() {
    originalRenderHeader();
    const right = document.querySelector("#header .topbar-r");
    if (!right) return;
    let badge = document.getElementById("gfCoins");
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "gfCoins";
      badge.className = "badge b-gold";
      const themeButton = right.querySelector("#themeBtn");
      right.insertBefore(badge, themeButton || null);
    }
    badge.textContent = "✦ " + (Number(DATA.coins) || 0);
  };

  // Expose tab renderers explicitly; app.js routes navigation to these methods.
  window.MYWAY_GUEST_TABS = {
    habits: renderHabitsTab,
    tasks: renderTasksTab,
    games: renderGamesTab,
    learning: renderLearningTab
  };
})();