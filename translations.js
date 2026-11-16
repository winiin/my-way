/* MY WAY interface translations for Russian, Kazakh and English.
   The core app already translates dictionary-backed labels; this layer covers
   remaining static text in dynamically rendered screens and feature modules. */
(() => {
  "use strict";
  const rows = [
    ["Расход","Шығыс","Expense"],["Доход","Кіріс","Income"],
    ["Название (необязательно)","Атауы (міндетті емес)","Name (optional)"],
    ["Сумма","Сома","Amount"],["Категория","Санат","Category"],
    ["Карта","Карта","Card"],["Без карты","Картасыз","No card"],
    ["Добавить","Қосу","Add"],["Очистить все","Барлығын тазарту","Clear all"],
    ["Быстрый выбор","Жылдам таңдау","Quick select"],
    ["— Расходы —","— Шығыстар —","— Expenses —"],["— Доходы —","— Кірістер —","— Income —"],
    ["Введите сумму больше 0","0-ден үлкен соманы енгізіңіз","Enter an amount greater than 0"],
    ["Название","Атауы","Name"],["Например: Обед в кафе","Мысалы: Кафедегі түскі ас","Example: Lunch at a cafe"],
    ["Мои привычки","Менің әдеттерім","My habits"],
    ["Небольшие регулярные действия создают большие изменения.","Күнделікті шағын әрекеттер үлкен өзгерістерге әкеледі.","Small consistent actions create big changes."],
    ["выполнено сегодня","бүгін орындалды","completed today"],
    ["Например: читать 15 минут","Мысалы: 15 минут оқу","Example: read for 15 minutes"],
    ["Добавить привычку","Әдет қосу","Add habit"],["Пока нет привычек","Әзірге әдеттер жоқ","No habits yet"],
    ["Добавь первую привычку выше.","Алғашқы әдетіңді жоғарыда қос.","Add your first habit above."],
    ["отметок","белгі","check-ins"],["✓ Сегодня готово","✓ Бүгін орындалды","✓ Done today"],
    ["Отметить","Белгілеу","Mark done"],["Удалить привычку?","Әдетті жоясыз ба?","Delete this habit?"],
    ["Мои задачи","Менің тапсырмаларым","My tasks"],
    ["Записывай важное и отмечай выполненное.","Маңызды істерді жазып, орындалғанын белгіле.","Write down what matters and track completion."],
    ["активных задач","белсенді тапсырма","active tasks"],
    ["Что нужно сделать?","Не істеу керек?","What needs to be done?"],
    ["Срок","Мерзімі","Due date"],["Обычный приоритет","Қалыпты басымдық","Normal priority"],
    ["Высокий приоритет","Жоғары басымдық","High priority"],["Низкий приоритет","Төмен басымдық","Low priority"],
    ["Нет активных задач","Белсенді тапсырмалар жоқ","No active tasks"],
    ["Добавь новую задачу выше.","Жаңа тапсырманы жоғарыда қос.","Add a new task above."],
    ["Готово","Дайын","Done"],["Удалить задачу?","Тапсырманы жоясыз ба?","Delete this task?"],
    ["Выполнено","Орындалды","Completed"],["Без срока","Мерзімсіз","No due date"],["Срок: ","Мерзімі: ","Due: "],
    ["Магазин наград","Марапаттар дүкені","Rewards shop"],
    ["Обменивай монеты за победы на темы и значки профиля.","Жеңістер үшін алған тиындарыңды тақырыптар мен профиль белгілеріне айырбаста.","Exchange coins earned from wins for themes and profile badges."],
    ["монет","тиын","coins"],["Северное сияние","Солтүстік шұғыласы","Northern Lights"],
    ["Холодные сине-фиолетовые оттенки","Салқын көк-күлгін реңктер","Cool blue and purple tones"],
    ["Океан","Мұхит","Ocean"],["Глубокие бирюзовые и синие оттенки","Қанық көгілдір және көк реңктер","Deep teal and blue tones"],
    ["Закат","Күн батуы","Sunset"],["Тёплые персиковые и золотые оттенки","Жылы шабдалы және алтын реңктер","Warm peach and golden tones"],
    ["Розовый кварц","Қызғылт кварц","Rose Quartz"],["Мягкие розово-лиловые акценты","Нәзік қызғылт-күлгін түстер","Soft pink and lilac accents"],
    ["Значок звезды","Жұлдыз белгісі","Star badge"],["Значок кометы","Құйрықты жұлдыз белгісі","Comet badge"],
    ["Значок короны","Тәж белгісі","Crown badge"],["Значок профиля","Профиль белгісі","Profile badge"],
    ["Тема оформления","Безендіру тақырыбы","Theme"],["Выбрано","Таңдалды","Selected"],
    ["Применить","Қолдану","Apply"],["Выбрать","Таңдау","Select"],["Купить · ","Сатып алу · ","Buy · "],
    ["Не хватает монет. Побеждай в играх, чтобы заработать ещё.","Тиын жеткіліксіз. Қосымша тиын алу үшін ойындарда жең.","Not enough coins. Win games to earn more."],
    ["Награда применена!","Марапат қолданылды!","Reward applied!"],
    ["Финансовый детектив","Қаржылық детектив","Financial Detective"],
    ["Найди три подозрительных ситуации.","Үш күмәнді жағдайды тап.","Find the three suspicious situations."],
    ["Проверить решения","Жауаптарды тексеру","Check answers"],
    ["Правильных решений: ","Дұрыс жауаптар: ","Correct answers: "],
    ["Попробуй ещё раз.","Қайталап көр.","Try again."],
    ["Награда за эту игру уже получена сегодня.","Бұл ойынның сыйлығы бүгін алынды.","You have already earned today's reward for this game."],
    ["Победа! +25 XP и +8 монет. Загляни в магазин наград.","Жеңіс! +25 XP және +8 тиын. Марапаттар дүкеніне кір.","You won! +25 XP and +8 coins. Visit the rewards shop."],
    ["Привычка выполнена","Әдет орындалды","Habit completed"],["Задача выполнена","Тапсырма орындалды","Task completed"],
    ["Всего на депозитах","Депозиттердегі жалпы сома","Total in deposits"],
    ["Ожидаемый доход","Күтілетін табыс","Expected income"],["Депозитов","Депозиттер","Deposits"],
    ["Текущий баланс","Ағымдағы баланс","Current balance"],["Ожид. доход","Күтілетін табыс","Expected income"],
    ["Preview","Алдын ала қарау","Preview"],["Перевод между счетами","Шоттар арасында аудару","Transfer between accounts"],
    ["Откуда","Қайдан","From"],["Куда","Қайда","To"],["Комментарий (необязательно)","Түсініктеме (міндетті емес)","Note (optional)"],
    ["Перевести","Аудару","Transfer"],["Отмена","Болдырмау","Cancel"],
    ["Сумма (₸)","Сома (₸)","Amount (₸)"],["Забыли пароль?","Құпия сөзді ұмыттыңыз ба?","Forgot password?"],
    ["Ваше имя","Атыңыз","Your name"],["Создать аккаунт","Аккаунт жасау","Create account"],
    ["Имя","Аты","Name"],["Купить","Сатып алу","Buy"],["Удалить","Жою","Delete"]
  ];

  const phraseMap = { kz: new Map(), en: new Map() };
  rows.forEach(([ru,kz,en]) => { phraseMap.kz.set(ru,kz); phraseMap.en.set(ru,en); });
  const ordered = {
    kz: [...phraseMap.kz.entries()].sort((a,b)=>b[0].length-a[0].length),
    en: [...phraseMap.en.entries()].sort((a,b)=>b[0].length-a[0].length)
  };

  function translate(value, lang) {
    if (!value || !ordered[lang]) return value;
    let result = value;
    for (const [from,to] of ordered[lang]) {
      if (result.includes(from)) result = result.split(from).join(to);
    }
    return result;
  }

  function apply() {
    const lang = typeof LANG === "string" ? LANG : "ru";
    if (lang === "ru") return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.nodeValue.trim()) return;
      const next = translate(node.nodeValue, lang);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
    document.querySelectorAll("[placeholder],[title],[aria-label]").forEach(el => {
      ["placeholder","title","aria-label"].forEach(attr => {
        const value = el.getAttribute(attr);
        if (value) {
          const next = translate(value, lang);
          if (next !== value) el.setAttribute(attr,next);
        }
      });
    });
  }

  let running = false;
  const observer = new MutationObserver(() => {
    if (running) return;
    running = true;
    apply();
    running = false;
  });
  document.addEventListener("DOMContentLoaded", () => {
    apply();
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  });
  document.addEventListener("change", event => {
    if (event.target && event.target.id === "langSel") queueMicrotask(apply);
  });
  document.addEventListener("click", event => {
    if (event.target.closest && event.target.closest(".lang-pill")) queueMicrotask(apply);
  });
  window.MYWAY_TRANSLATIONS = { apply };
})();