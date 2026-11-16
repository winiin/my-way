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

  const quiz = [
    ["Что лучше сделать после получения дохода?",["Потратить всё","Сначала отложить запланированную сумму","Взять кредит"],1],
    ["Для чего нужен резервный фонд?",["Для непредвиденных расходов","Для ежедневных покупок","Для подписок"],0],
    ["Что показывает бюджет?",["Только доходы","План доходов и расходов","Только долги"],1],
    ["Как корректно сравнить цены похожих товаров?",["По стоимости за одинаковую единицу","По цвету упаковки","Выбрать самый дорогой"],0]
  ];

  function renderGamesTab() {
    let html = '<div class="gf-intro"><div><div class="gf-eyebrow">MY WAY · LEARN BY DOING</div><h2>Финансовые мини-игры</h2><p>Короткие задания для тренировки финансовых навыков.</p></div><div class="gf-stat"><strong>' + DATA.guestGameResults.length + '</strong><span>завершено игр</span></div></div>';
    html += '<div class="gf-game-grid"><article class="card gf-game-card"><div class="gf-game-icon">🧠</div><h3>Финансовый квиз</h3><p>Проверь знания о бюджете и накоплениях.</p><button class="btn btn-primary" id="gfStartQuiz">Начать · 4 вопроса</button></article><article class="card gf-game-card"><div class="gf-game-icon">💰</div><h3>Собери бюджет</h3><p>Распредели условные 100 000 ₸.</p><button class="btn btn-primary" id="gfStartBudget">Начать игру</button></article><article class="card gf-game-card"><div class="gf-game-icon">🎯</div><h3>План цели</h3><p>Выбери правильные шаги к финансовой цели.</p><button class="btn btn-primary" id="gfStartGoal">Начать игру</button></article></div><div id="gfGameArea"></div>';
    if (DATA.guestGameResults.length) {
      html += '<section class="card gf-game-history"><strong>Последние результаты</strong>';
      DATA.guestGameResults.slice(-5).reverse().forEach(r => { html += '<div><span>' + escText(r.name) + '</span><b>+' + r.xp + ' XP · +' + r.coins + ' ✦</b></div>'; });
      html += '</section>';
    }
    document.getElementById("content").innerHTML = html;
    document.getElementById("gfStartQuiz").addEventListener("click", startQuiz);
    document.getElementById("gfStartBudget").addEventListener("click", startBudget);
    document.getElementById("gfStartGoal").addEventListener("click", startGoal);
  }

  function recordGame(name) {
    DATA.guestGameResults.push({name:name,xp:30,coins:5,date:Date.now()});
    DATA.guestGameResults = DATA.guestGameResults.slice(-20);
    reward(30,5,"Игра завершена");
    renderGamesTab();
  }

  function startQuiz() {
    const area = document.getElementById("gfGameArea");
    area.innerHTML = '<section class="card gf-game-play"><h3>Финансовый квиз</h3><form id="gfQuizForm">' +
      quiz.map((q,i) => '<fieldset><legend>' + (i+1) + '. ' + escText(q[0]) + '</legend>' +
        q[1].map((a,j) => '<label class="gf-answer"><input type="radio" name="q' + i + '" value="' + j + '" required><span>' + escText(a) + '</span></label>').join("") +
      '</fieldset>').join("") + '<button class="btn btn-primary" type="submit">Проверить ответы</button></form></section>';
    area.scrollIntoView({behavior:"smooth",block:"start"});
    document.getElementById("gfQuizForm").addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const score = quiz.reduce((sum,q,i) => sum + (Number(data.get("q"+i)) === q[2] ? 1 : 0),0);
      if (score >= 3) recordGame("Финансовый квиз");
      else if (typeof notify === "function") notify("Правильных ответов: " + score + "/4. Попробуй ещё раз.", "info");
    });
  }

  function startBudget() {
    const area = document.getElementById("gfGameArea");
    area.innerHTML = '<section class="card gf-game-play"><h3>Собери бюджет · 100 000 ₸</h3><p>Распредели сумму. На накопления оставь не менее 10 000 ₸.</p><form id="gfBudgetForm" class="gf-budget-form">' +
      '<label>Необходимые расходы<input class="finput" name="needs" type="number" min="0" value="50000" required></label>' +
      '<label>Накопления<input class="finput" name="savings" type="number" min="0" value="20000" required></label>' +
      '<label>Обучение<input class="finput" name="learning" type="number" min="0" value="20000" required></label>' +
      '<label>Развлечения<input class="finput" name="fun" type="number" min="0" value="10000" required></label>' +
      '<button class="btn btn-primary" type="submit">Проверить бюджет</button></form></section>';
    document.getElementById("gfBudgetForm").addEventListener("submit", e => {
      e.preventDefault();
      const values = Object.values(Object.fromEntries(new FormData(e.currentTarget).entries())).map(Number);
      if (values.some(v => !Number.isFinite(v) || v < 0) || values.reduce((a,b)=>a+b,0) !== 100000 || values[1] < 10000) {
        if (typeof notify === "function") notify("Сумма должна быть ровно 100 000 ₸, накопления — не меньше 10 000 ₸.", "error");
        return;
      }
      recordGame("Собери бюджет");
    });
    area.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function startGoal() {
    const area = document.getElementById("gfGameArea");
    const steps = ["Определить точную сумму и срок цели","Рассчитать регулярный взнос","Проверять прогресс и корректировать план"];
    area.innerHTML = '<section class="card gf-game-play"><h3>План финансовой цели</h3><p>Отметь все разумные шаги для достижения цели.</p><form id="gfGoalForm">' +
      steps.map((s,i)=>'<label class="gf-answer"><input type="checkbox" name="s'+i+'"><span>'+escText(s)+'</span></label>').join("") +
      '<button class="btn btn-primary" type="submit">Завершить</button></form></section>';
    document.getElementById("gfGoalForm").addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      if (steps.some((_,i)=>!data.has("s"+i))) {
        if (typeof notify === "function") notify("Отметь все три шага.", "info");
        return;
      }
      recordGame("План финансовой цели");
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

  const originalRenderActiveTab = renderActiveTab;
  renderActiveTab = function(tab) {
    if (tab === "habits") return renderHabitsTab();
    if (tab === "tasks") return renderTasksTab();
    if (tab === "games") return renderGamesTab();
    if (tab === "learning") return renderLearningTab();
    return originalRenderActiveTab(tab);
  };
})();