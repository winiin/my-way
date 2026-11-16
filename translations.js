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
    ["Имя","Аты","Name"],["Купить","Сатып алу","Buy"],["Удалить","Жою","Delete"],
    ["Собери бюджет","Бюджетті құрастыр","Build a budget"],
    ["Проверить бюджет","Бюджетті тексеру","Check budget"],
    ["Сумма должна быть ровно 100 000 ₸, накопления — не меньше 10 000 ₸.","Жалпы сома дәл 100 000 ₸ болуы керек, жинақ кемінде 10 000 ₸ болуы тиіс.","The total must be exactly 100,000 KZT, with at least 10,000 KZT in savings."],
    ["Накопления","Жинақ","Savings"],["Обучение","Оқу","Learning"],["Развлечения","Ойын-сауық","Entertainment"],
    ["Определить точную сумму и срок цели","Мақсаттың нақты сомасы мен мерзімін анықтау","Set an exact target amount and deadline"],
    ["Рассчитать регулярный взнос","Тұрақты жарнаны есептеу","Calculate a regular contribution"],
    ["Проверять прогресс и корректировать план","Прогресті бақылап, жоспарды түзету","Track progress and adjust the plan"],
    ["Завершить","Аяқтау","Finish"],
    ["Что лучше сделать после получения дохода?","Табыс алғаннан кейін не істеген дұрыс?","What is best to do after receiving income?"],
    ["Потратить всё","Барлығын жұмсау","Spend it all"],
    ["Сначала отложить запланированную сумму","Алдымен жоспарланған соманы жинаққа салу","Set aside the planned amount first"],
    ["Взять кредит","Несие алу","Take a loan"],
    ["Для чего нужен резервный фонд?","Қаржылық резерв не үшін қажет?","What is an emergency fund for?"],
    ["Для непредвиденных расходов","Күтпеген шығындарға","Unexpected expenses"],
    ["Для ежедневных покупок","Күнделікті сатып алуларға","Daily purchases"],
    ["Для подписок","Жазылымдарға","Subscriptions"],
    ["Что показывает бюджет?","Бюджет нені көрсетеді?","What does a budget show?"],
    ["Только доходы","Тек кірістерді","Income only"],
    ["План доходов и расходов","Кірістер мен шығыстар жоспарын","A plan for income and expenses"],
    ["Только долги","Тек қарыздарды","Debts only"],
    ["Как корректно сравнить цены похожих товаров?","Ұқсас тауарлардың бағасын қалай дұрыс салыстыруға болады?","How should you compare prices of similar products?"],
    ["По стоимости за одинаковую единицу","Бірдей өлшем бірлігінің бағасы бойынша","By price per same unit"],
    ["По цвету упаковки","Қаптамасының түсі бойынша","By package color"],
    ["Выбрать самый дорогой","Ең қымбатын таңдау","Choose the most expensive"],
    ["Правильных ответов: ","Дұрыс жауаптар: ","Correct answers: "],
    ["Игра завершена","Ойын аяқталды","Game completed"],
    ["Перевод","Аударым","Transfer"],
    ["Всего на депозитах","Депозиттердегі жалпы сома","Total in deposits"],
    ["Ожидаемый доход","Күтілетін табыс","Expected income"],
    ["Сколько внести? (₸)","Қанша салу керек? (₸)","How much to contribute? (₸)"],
    ["Сумма ₸","Сома ₸","Amount ₸"],
    ["Новый депозит","Жаңа депозит","New deposit"],
    ["Ставка % год.","Жылдық мөлшерлеме %","Annual rate %"],
    ["Срок (мес.)","Мерзімі (ай)","Term (months)"],
    ["Добавить карту","Карта қосу","Add card"],
    ["Номер карты","Карта нөмірі","Card number"],
    ["Держатель","Карта иесі","Cardholder"],
    ["Платёжная система","Төлем жүйесі","Payment system"],
    ["По дням (7 дней)","Күндер бойынша (7 күн)","By day (7 days)"],
    ["По категориям","Санаттар бойынша","By category"],
    ["Советы мудрецов","Данышпандар кеңесі","Wisdom tips"],
    ["Принципы накопления от великих инвесторов и предпринимателей","Ұлы инвесторлар мен кәсіпкерлердің жинақтау қағидалары","Saving principles from great investors and entrepreneurs"],
    ["Анализ PDF выписки","PDF үзіндісін талдау","PDF statement analysis"],
    ["Загрузите PDF-выписку из банка — ИИ автоматически распознает и проанализирует все операции","Банктен PDF үзіндісін жүктеңіз — ЖИ барлық операцияларды автоматты түрде танып, талдайды","Upload a bank PDF statement — AI will recognize and analyze the transactions"],
    ["Загрузить PDF","PDF жүктеу","Upload PDF"],
    ["ИИ анализирует файл...","ЖИ файлды талдап жатыр...","AI is analyzing the file..."],
    ["Не удалось распознать PDF файл","PDF файлын тану мүмкін болмады","Could not read the PDF file"],
    ["Норма сбережений","Жинақтау мөлшерлемесі","Savings rate"],
    ["Курсы валют","Валюта бағамдары","Exchange rates"],
    ["Сравнение месяцев — плюс или минус?","Айларды салыстыру — өсім бе, әлде төмендеу ме?","Monthly comparison — up or down?"],
    ["Еда","Тамақ","Food"],["Транспорт","Көлік","Transport"],
    ["Кафе/Доставка","Кафе/Жеткізу","Cafe/Delivery"],["Здоровье","Денсаулық","Health"],
    ["Одежда/обувь","Киім/аяқ киім","Clothing/Shoes"],["Связь/подписки","Байланыс/жазылымдар","Phone/Subscriptions"],
    ["Красота/уход","Сұлулық/күтім","Beauty/Care"],["Учёба","Оқу","Education"],
    ["Жильё","Тұрғын үй","Housing"],["Большая покупка","Ірі сатып алу","Major purchase"],
    ["Путешествие","Саяхат","Travel"],["Подарки","Сыйлықтар","Gifts"],
    ["Инвестиции","Инвестициялар","Investments"],["Другое","Басқа","Other"],
    ["Зарплата","Жалақы","Salary"],["Стипендия","Шәкіртақы","Scholarship"],
    ["Перевод от семьи","Отбасынан аударым","Family transfer"],["Кешбэк","Кэшбэк","Cashback"],
    ["Другой доход","Басқа кіріс","Other income"],
    ["Тебе обещают гарантированную прибыль 40% за неделю, если перевести деньги сегодня. Что делать?","Бүгін ақша аударсаң, бір аптада 40% кепілді пайда уәде етеді. Не істеу керек?","You are promised a guaranteed 40% profit in a week if you transfer money today. What should you do?"],
    ["Сразу перевести","Бірден аудару","Transfer immediately"],
    ["Проверить компанию и не верить обещаниям гарантированной высокой доходности","Компанияны тексеріп, жоғары кепілді табыс уәдесіне сенбеу","Verify the company and distrust guaranteed high-return promises"],
    ["Попросить друга перевести","Досыңнан аударуды сұрау","Ask a friend to transfer"],
    ["Незнакомец просит код из SMS, чтобы «подтвердить перевод».","Бейтаныс адам «аударымды растау» үшін SMS кодын сұрайды.","A stranger asks for your SMS code to “confirm a transfer.”"],
    ["Отправить код","Кодты жіберу","Send the code"],["Не сообщать код никому","Кодты ешкімге айтпау","Never share the code"],
    ["Сфотографировать карту","Картаны суретке түсіру","Take a photo of the card"],
    ["Магазин предлагает товар намного дешевле рынка, но требует оплатить переводом на личную карту.","Дүкен тауарды нарықтан әлдеқайда арзан ұсынады, бірақ жеке картаға аударым жасауды талап етеді.","A shop offers an item far below market price but asks for payment to a personal card."],
    ["Проверить продавца и безопасные способы оплаты","Сатушыны және қауіпсіз төлем тәсілдерін тексеру","Verify the seller and use a safe payment method"],
    ["Оплатить немедленно","Дереу төлеу","Pay immediately"],
    ["Отправить данные карты в чат","Карта деректерін чатқа жіберу","Send card details in chat"],
    ["Финансовый детектив","Қаржылық детектив","Financial Detective"],
    ["Добавить операцию","Операция қосу","Add transaction"],
    ["Название (необязательно)","Атауы (міндетті емес)","Name (optional)"],
    ["Сумма (₸)","Сома (₸)","Amount (₸)"],
    ["— Расходы —","— Шығыстар —","— Expenses —"],["— Доходы —","— Кірістер —","— Income —"],
    ["Все операции","Барлық операциялар","All transactions"],
    ["Нет операций","Операциялар жоқ","No transactions"],
    ["Мои цели","Менің мақсаттарым","My goals"],["Нет целей","Мақсаттар жоқ","No goals"],
    ["Новый депозит","Жаңа депозит","New deposit"],["Мои депозиты","Менің депозиттерім","My deposits"],
    ["Нет депозитов","Депозиттер жоқ","No deposits"],["Новый депозит","Жаңа депозит","New deposit"]
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
      if (node.parentElement && node.parentElement.closest("script,style,noscript,textarea,input,pre,code")) return;
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