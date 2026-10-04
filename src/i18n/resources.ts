const en = {
  'brand.subtitle': 'Investment workspace',
  'nav.label': 'Main navigation',
  'nav.workspace': 'WORKSPACE',
  'nav.overview': 'Overview',
  'nav.system': 'Connection',
  'nav.upNext': 'UP NEXT',
  'nav.portfolios': 'Portfolios',
  'nav.trades': 'Trade history',
  'nav.reports': 'Tax reports',
  'nav.soon': 'Later',
  'nav.note': 'One step at a time.',
  'nav.noteBody':
    'A private place for your investments, built on clear records.',
  'common.language': 'Language',
  'common.skip': 'Skip to content',
  'common.preview': 'Development preview',
  'common.footer': 'No financial data is loaded in this preview.',
  'common.back': 'Back to overview',
  'home.eyebrow': 'YOUR INVESTMENT WORKSPACE',
  'home.title': 'Clarity for every investment.',
  'home.subtitle':
    'Your portfolios, trades and yearly reports — together in one private workspace.',
  'home.badge': 'The foundation is ready',
  'home.cardTitle': 'A fresh start for your portfolios',
  'home.cardBody':
    'This is the first working version of the interface. Sign-in comes next; your accounts and investment records are not connected yet.',
  'home.action': 'Check the connection',
  'home.empty': 'Your portfolios will live here',
  'home.emptyNote': 'No sample balances. No invented returns.',
  'home.details': 'DESIGNED AROUND YOUR RECORDS',
  'home.portfoliosTitle': 'Your portfolios, organized',
  'home.portfoliosBody':
    'Separate portfolios for different investment goals, with private access to your records.',
  'home.tradesTitle': 'Every trade accounted for',
  'home.tradesBody':
    'Keep purchases, sales and fees together, with FIFO matching and recorded broker dates.',
  'home.reportsTitle': 'Reports that keep the detail',
  'home.reportsBody':
    'Year-specific rates, UAH results and visible losses — even when the calculated tax is zero.',
  'home.roadmap': 'What comes next',
  'home.roadmapNote': 'A step-by-step build, with checks at every stage.',
  'home.step1': 'App foundation',
  'home.step1Body': 'Navigation, languages and connection checks',
  'home.step2': 'Secure sign-in',
  'home.step2Body': 'Access provided by your administrator',
  'home.step3': 'Portfolio workspace',
  'home.step3Body': 'Your portfolios and transaction history',
  'home.step4': 'Reporting screens',
  'home.step4Body': 'Yearly settings, saved results and exports',
  'home.ready': 'Ready',
  'home.next': 'Next',
  'system.eyebrow': 'WORKSPACE CONNECTION',
  'system.title': 'Check what is connected.',
  'system.subtitle':
    'A read-only check of the API and its database connection. It does not load your investments or change any records.',
  'system.action': 'Check connection',
  'system.checking': 'Checking…',
  'system.retry': 'Check again',
  'system.api': 'Application API',
  'system.apiBody': 'Can the browser reach the backend?',
  'system.database': 'Database readiness',
  'system.databaseBody': 'Can the API reach PostgreSQL?',
  'system.unchecked': 'Not checked',
  'system.healthy': 'Available',
  'system.unavailable': 'Unavailable',
  'system.ok':
    'Both checks passed. Sign-in and account access will be verified in the next stage.',
  'system.offline':
    'The API could not be reached or did not return a healthy response. Start the backend and try again.',
  'system.dbOffline':
    'The API is available, but database readiness failed. Check PostgreSQL and the API connection settings.',
  'system.before': 'Start a check to see the current connection status.',
  'system.localTitle': 'Local development',
  'system.localBody':
    'The browser uses the same-origin development proxy. The API target defaults to http://localhost:5050 and can be changed in your local environment settings.',
  'system.limitTitle': 'A connection check, not a sign-in',
  'system.limitBody':
    'A healthy response does not confirm your session, database migrations or access to a portfolio. No account information is requested here.',
  'notFound.title': 'This page is not here yet.',
  'notFound.body':
    'The address may be incorrect, or this part of the workspace has not been built yet.',
  'error.title': 'The workspace could not be displayed.',
  'error.body':
    'Reload the page to try again. No investment records have been changed.',
  'error.reload': 'Reload page',
} as const
export type TranslationKey = keyof typeof en
type Translation = Record<TranslationKey, string>
const uk: Translation = {
  'brand.subtitle': 'Інвестиційний простір',
  'nav.label': 'Головна навігація',
  'nav.workspace': 'РОБОЧИЙ ПРОСТІР',
  'nav.overview': 'Огляд',
  'nav.system': 'З’єднання',
  'nav.upNext': 'ДАЛІ',
  'nav.portfolios': 'Портфелі',
  'nav.trades': 'Історія угод',
  'nav.reports': 'Податкові звіти',
  'nav.soon': 'Згодом',
  'nav.note': 'Крок за кроком.',
  'nav.noteBody':
    'Приватний простір для інвестицій на основі прозорого обліку.',
  'common.language': 'Мова',
  'common.skip': 'Перейти до вмісту',
  'common.preview': 'Версія в розробці',
  'common.footer': 'У цій версії фінансові дані не завантажуються.',
  'common.back': 'Повернутися до огляду',
  'home.eyebrow': 'ВАШ ІНВЕСТИЦІЙНИЙ ПРОСТІР',
  'home.title': 'Ясність у кожній інвестиції.',
  'home.subtitle':
    'Портфелі, угоди та річні звіти — разом в одному приватному просторі.',
  'home.badge': 'Основа вже готова',
  'home.cardTitle': 'Новий початок для ваших портфелів',
  'home.cardBody':
    'Це перша робоча версія інтерфейсу. Далі — вхід до облікового запису; ваші рахунки та інвестиційні записи ще не підключені.',
  'home.action': 'Перевірити з’єднання',
  'home.empty': 'Тут будуть ваші портфелі',
  'home.emptyNote': 'Без вигаданих балансів і дохідності.',
  'home.details': 'НА ОСНОВІ ВАШИХ ЗАПИСІВ',
  'home.portfoliosTitle': 'Портфелі під контролем',
  'home.portfoliosBody':
    'Окремі портфелі для різних інвестиційних цілей із приватним доступом до записів.',
  'home.tradesTitle': 'Кожну угоду враховано',
  'home.tradesBody':
    'Купівлі, продажі та комісії разом, із розрахунком FIFO та збереженням дат брокера.',
  'home.reportsTitle': 'Звіти з усіма деталями',
  'home.reportsBody':
    'Ставки за обраний рік, результати в гривні та видимі збитки — навіть коли податок дорівнює нулю.',
  'home.roadmap': 'Що далі',
  'home.roadmapNote': 'Покрокова розробка з перевірками на кожному етапі.',
  'home.step1': 'Основа застосунку',
  'home.step1Body': 'Навігація, мови та перевірка з’єднання',
  'home.step2': 'Безпечний вхід',
  'home.step2Body': 'Доступ надає адміністратор',
  'home.step3': 'Робота з портфелями',
  'home.step3Body': 'Ваші портфелі та історія операцій',
  'home.step4': 'Екрани звітності',
  'home.step4Body': 'Річні налаштування, збережені результати та експорт',
  'home.ready': 'Готово',
  'home.next': 'Далі',
  'system.eyebrow': 'З’ЄДНАННЯ РОБОЧОГО ПРОСТОРУ',
  'system.title': 'Перевірте підключення.',
  'system.subtitle':
    'Перевірка API та його з’єднання з базою даних лише для читання. Інвестиції не завантажуються, записи не змінюються.',
  'system.action': 'Перевірити з’єднання',
  'system.checking': 'Перевіряємо…',
  'system.retry': 'Перевірити ще раз',
  'system.api': 'API застосунку',
  'system.apiBody': 'Чи може браузер підключитися до сервера?',
  'system.database': 'Готовність бази даних',
  'system.databaseBody': 'Чи може API підключитися до PostgreSQL?',
  'system.unchecked': 'Не перевірено',
  'system.healthy': 'Доступно',
  'system.unavailable': 'Недоступно',
  'system.ok':
    'Обидві перевірки пройдено. Вхід і доступ до облікового запису перевіримо на наступному етапі.',
  'system.offline':
    'API недоступний або не повернув успішну відповідь. Запустіть сервер і повторіть перевірку.',
  'system.dbOffline':
    'API доступний, але база даних не готова. Перевірте PostgreSQL і налаштування з’єднання API.',
  'system.before': 'Запустіть перевірку, щоб побачити поточний стан з’єднання.',
  'system.localTitle': 'Локальна розробка',
  'system.localBody':
    'Браузер використовує локальний проксі зі спільним джерелом. Типова адреса API — http://localhost:5050; її можна змінити в локальних налаштуваннях середовища.',
  'system.limitTitle': 'Перевірка з’єднання, а не вхід',
  'system.limitBody':
    'Успішна відповідь не підтверджує сеанс, міграції бази даних чи доступ до портфеля. Дані облікового запису тут не запитуються.',
  'notFound.title': 'Цієї сторінки поки немає.',
  'notFound.body':
    'Можливо, адреса неправильна або цей розділ ще не розроблено.',
  'error.title': 'Не вдалося показати робочий простір.',
  'error.body':
    'Оновіть сторінку й повторіть спробу. Інвестиційні записи не змінено.',
  'error.reload': 'Оновити сторінку',
}
const ru: Translation = {
  'brand.subtitle': 'Инвестиционное пространство',
  'nav.label': 'Основная навигация',
  'nav.workspace': 'РАБОЧЕЕ ПРОСТРАНСТВО',
  'nav.overview': 'Обзор',
  'nav.system': 'Соединение',
  'nav.upNext': 'ДАЛЕЕ',
  'nav.portfolios': 'Портфели',
  'nav.trades': 'История сделок',
  'nav.reports': 'Налоговые отчёты',
  'nav.soon': 'Позже',
  'nav.note': 'Шаг за шагом.',
  'nav.noteBody':
    'Личное пространство для инвестиций на основе прозрачного учёта.',
  'common.language': 'Язык',
  'common.skip': 'Перейти к содержимому',
  'common.preview': 'Версия в разработке',
  'common.footer': 'В этой версии финансовые данные не загружаются.',
  'common.back': 'Вернуться к обзору',
  'home.eyebrow': 'ВАШЕ ИНВЕСТИЦИОННОЕ ПРОСТРАНСТВО',
  'home.title': 'Ясность в каждой инвестиции.',
  'home.subtitle':
    'Портфели, сделки и годовые отчёты — вместе в одном личном пространстве.',
  'home.badge': 'Основа уже готова',
  'home.cardTitle': 'Новое начало для ваших портфелей',
  'home.cardBody':
    'Это первая рабочая версия интерфейса. Далее — вход в учётную запись; ваши счета и инвестиционные записи ещё не подключены.',
  'home.action': 'Проверить соединение',
  'home.empty': 'Здесь будут ваши портфели',
  'home.emptyNote': 'Без выдуманных балансов и доходности.',
  'home.details': 'НА ОСНОВЕ ВАШИХ ЗАПИСЕЙ',
  'home.portfoliosTitle': 'Портфели под контролем',
  'home.portfoliosBody':
    'Отдельные портфели для разных инвестиционных целей с личным доступом к записям.',
  'home.tradesTitle': 'Каждая сделка учтена',
  'home.tradesBody':
    'Покупки, продажи и комиссии вместе, с расчётом FIFO и сохранением дат брокера.',
  'home.reportsTitle': 'Отчёты со всеми деталями',
  'home.reportsBody':
    'Ставки за выбранный год, результаты в гривнах и видимые убытки — даже когда налог равен нулю.',
  'home.roadmap': 'Что дальше',
  'home.roadmapNote': 'Пошаговая разработка с проверками на каждом этапе.',
  'home.step1': 'Основа приложения',
  'home.step1Body': 'Навигация, языки и проверка соединения',
  'home.step2': 'Безопасный вход',
  'home.step2Body': 'Доступ предоставляет администратор',
  'home.step3': 'Работа с портфелями',
  'home.step3Body': 'Ваши портфели и история операций',
  'home.step4': 'Экраны отчётности',
  'home.step4Body': 'Годовые настройки, сохранённые результаты и экспорт',
  'home.ready': 'Готово',
  'home.next': 'Далее',
  'system.eyebrow': 'СОЕДИНЕНИЕ РАБОЧЕГО ПРОСТРАНСТВА',
  'system.title': 'Проверьте подключение.',
  'system.subtitle':
    'Проверка API и его соединения с базой данных только для чтения. Инвестиции не загружаются, записи не изменяются.',
  'system.action': 'Проверить соединение',
  'system.checking': 'Проверяем…',
  'system.retry': 'Проверить ещё раз',
  'system.api': 'API приложения',
  'system.apiBody': 'Может ли браузер подключиться к серверу?',
  'system.database': 'Готовность базы данных',
  'system.databaseBody': 'Может ли API подключиться к PostgreSQL?',
  'system.unchecked': 'Не проверено',
  'system.healthy': 'Доступно',
  'system.unavailable': 'Недоступно',
  'system.ok':
    'Обе проверки пройдены. Вход и доступ к учётной записи проверим на следующем этапе.',
  'system.offline':
    'API недоступен или не вернул успешный ответ. Запустите сервер и повторите проверку.',
  'system.dbOffline':
    'API доступен, но база данных не готова. Проверьте PostgreSQL и настройки соединения API.',
  'system.before':
    'Запустите проверку, чтобы увидеть текущий статус соединения.',
  'system.localTitle': 'Локальная разработка',
  'system.localBody':
    'Браузер использует локальный прокси с общим источником. Адрес API по умолчанию — http://localhost:5050; его можно изменить в локальных настройках окружения.',
  'system.limitTitle': 'Проверка соединения, а не вход',
  'system.limitBody':
    'Успешный ответ не подтверждает сеанс, миграции базы данных или доступ к портфелю. Данные учётной записи здесь не запрашиваются.',
  'notFound.title': 'Этой страницы пока нет.',
  'notFound.body':
    'Возможно, адрес неверный или этот раздел ещё не разработан.',
  'error.title': 'Не удалось показать рабочее пространство.',
  'error.body':
    'Обновите страницу и попробуйте снова. Инвестиционные записи не изменены.',
  'error.reload': 'Обновить страницу',
}
export const resources = {
  en: { translation: en },
  uk: { translation: uk },
  ru: { translation: ru },
}
