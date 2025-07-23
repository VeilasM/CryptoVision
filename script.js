// script.js
class CryptoVisionApp {
    constructor() {
        // Получаем все DOM-элементы один раз при инициализации приложения
        this.elements = this.getDOMElements();
        // Глобальные переменные состояния
        this.uploadedImageBase64 = null;
        this.userPlanLevel = 'basic';
        this.currentSubscriptionType = 'monthly'; // Тип подписки по умолчанию

        // Хардкодные данные (в реальном приложении должны приходить с бэкенда)
        this.creditPrices = {
            '5': 1.30, '10': 2.50, '75': 15.00, '200': 30.00, '500': 60.00, '1200': 100.00, '4000': 250.00, '8000': 400.00
        };
        this.monthlyPlanDetails = {
            'starter_monthly': { credits: 200, price: 18 },
            'pro_monthly': { credits: 650, price: 45 },
            'vip_monthly': { credits: 1500, price: 90 }
        };
        this.yearlyPlanDetails = {
            'starter_yearly': { credits: 200, price: 18 * 12 * 0.7, save: '30%' },
            'pro_yearly': { credits: 650, price: 45 * 12 * 0.7, save: '30%' },
            'vip_yearly': { credits: 1500, price: 90 * 12 * 0.7, save: '30%' }
        };

        // Инициализация Telegram Web App и добавление слушателей событий
        this.initTelegramWebApp();
        this.createDynamicPages(); // Создаем страницы, которых нет в HTML
        this.addEventListeners();
    }

    // Метод для получения всех необходимых DOM-элементов
    getDOMElements() {
        const elements = {};
        [
            'chartImageUpload', 'imageUploadArea', 'imagePreview', 'uploadText', 'uploadImagePlaceholder',
            'chartImageUploadHome', 'imageUploadAreaHome', 'imagePreviewHome', 'uploadTextHome', 'uploadImagePlaceholderHome',
            'getAnalysisBtn', 'buttonText', 'analysisResult', 'errorMessage', 'errorText',
            'outputAction', 'outputEntryPrice', 'outputTargetPrice', 'outputStopLoss', 'outputTakeProfit',
            'outputTrend', 'outputVolatility', 'outputVolume', 'outputSentiment',
            'homePage', 'analysisPage', 'instructionModal', 'loadingModal', 'splashScreen',
            'tokenCounter', 'headerTokens', 'currentTokens', 'subscriptionEndDate',
            'monthlyToggle', 'yearlyToggle', 'payAsYouGoSection', 'subscriptionSection',
            'creditAmountSelect', 'currentCreditPrice', 'planSelect', 'currentPlanCredits', 'currentSubscriptionPrice',
            'uploadAndAnalyzeBtn', 'disclaimerTextElement'
        ].forEach(id => {
            elements[id] = document.getElementById(id);
        });
        elements.navItems = document.querySelectorAll('.nav-item');
        return elements;
    }

    // Инициализация Telegram Web App
    initTelegramWebApp() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            if (Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
                const user = Telegram.WebApp.initDataUnsafe.user;
                // console.log('Telegram User:', user); // Для отладки
            }
        } else {
            console.warn('Telegram Web App API not available. Running in standalone mode. Real payments and camera will not work.');
        }
    }

    // Добавление всех слушателей событий
    addEventListeners() {
        this.elements.imageUploadArea.addEventListener('click', () => this.elements.chartImageUpload.click());
        this.elements.chartImageUpload.addEventListener('change', (event) => this.handleImageUpload(event, 'analysis'));

        this.elements.imageUploadAreaHome.addEventListener('click', () => this.elements.chartImageUploadHome.click());
        this.elements.chartImageUploadHome.addEventListener('change', (event) => this.handleImageUpload(event, 'home'));

        this.elements.getAnalysisBtn.addEventListener('click', () => this.getAnalysis());
        this.elements.uploadAndAnalyzeBtn.addEventListener('click', () => {
            this.showPage('analysisPage');
            this.activateNav(document.querySelector('.nav-item[data-page="analysisPage"]'));
        });

        if (this.elements.creditAmountSelect) {
            this.elements.creditAmountSelect.addEventListener('change', () => this.updateCreditPrice());
        }
        if (this.elements.planSelect) {
            this.elements.planSelect.addEventListener('change', () => this.updateSubscriptionPrice());
        }
        if (this.elements.monthlyToggle) {
            this.elements.monthlyToggle.addEventListener('click', () => this.toggleSubscriptionView('monthly'));
        }
        if (this.elements.yearlyToggle) {
            this.elements.yearlyToggle.addEventListener('click', () => this.toggleSubscriptionView('yearly'));
        }
    }

    // Создание страниц, которые отсутствуют в index.html (для гибкости)
    createDynamicPages() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            console.error('Main content container not found!');
            return;
        }

        const createPage = (id, title, contentHTML = `<h2 class="text-xl font-semibold text-center mb-4 text-white">${title}</h2><p class="text-white text-center">Эта страница находится в разработке.</p>`) => {
            let page = document.getElementById(id);
            if (!page) { // Создаем, только если страницы нет
                page = document.createElement('section'); // Используем <section> для семантики
                page.id = id;
                page.className = 'page';
                page.innerHTML = contentHTML;
                mainContent.appendChild(page);
            }
            return page;
        };

        // Создаем страницы "Поиск" и "Чат"
        this.elements.searchPage = createPage('searchPage', 'Поиск Информации');
        this.elements.chatPage = createPage('chatPage', 'AI Чат');
        this.elements.coursePage = createPage('coursePage', 'Курс');

        // Для страницы "Профиль" используем более сложный HTML
        this.elements.profilePage = createPage('profilePage', 'Профиль', `
            <p class="text-lg font-bold mb-2 text-white text-center">Текущий план: Базовый</p>
            <p class="mb-2 text-white text-center">Остаток токенов: <span class="font-bold text-white" id="currentTokens">100</span></p>
            <p class="mb-4 text-white text-center">Подписка кончается: <span class="font-bold text-white" id="subscriptionEndDate">15.08.2025</span></p>
            <h2 class="text-xl font-semibold text-center mt-6 mb-4 text-white">Выберите опцию:</h2>

            <div class="subscription-options-container">
                <div class="card" id="payAsYouGoSection">
                    <h3 class="text-xl font-bold text-center mb-4 text-white">Покупка токенов</h3>
                    <label for="creditAmountSelect" class="block text-sm font-medium text-white mb-2">Количество:</label>
                    <select id="creditAmountSelect" class="credit-select-box mb-4" onchange="app.updateCreditPrice()">
                        <option value="5">5 кредитов</option>
                        <option value="10">10 кредитов</option>
                        <option value="75">75 кредитов</option>
                        <option value="200">200 кредитов</option>
                        <option value="500">500 кредитов</option>
                        <option value="1200">1200 кредитов</option>
                        <option value="4000">4000 кредитов</option>
                        <option value="8000">8000 кредитов</option>
                    </select>
                    <p class="text-xl font-bold text-center mb-4 text-white"><span id="currentCreditPrice">$1.30</span></p>
                    <p class="text-sm text-white text-center mb-4">Нужно больше? Пополняйте токены в любое время, сверх вашего текущего плана.</p>
                    <button class="btn-primary w-full" onclick="app.purchaseCredits()">Купить токены</button>
                </div>

                <div class="card" id="subscriptionSection">
                    <div class="relative mb-4">
                        <h3 class="text-xl font-bold text-center m-0 text-white">Подписка</h3>
                        <div class="toggle-switch absolute top-0 right-0">
                            <div class="toggle-button active" id="monthlyToggle" onclick="app.toggleSubscriptionView('monthly')">Месяц</div>
                            <div class="toggle-button" id="yearlyToggle" onclick="app.toggleSubscriptionView('yearly')">Год</div>
                        </div>
                    </div>
                    <label for="planSelect" class="block text-sm font-medium text-white mb-2">План:</label>
                    <select id="planSelect" class="credit-select-box mb-4" onchange="app.updateSubscriptionPrice()">
                        <option value="starter_monthly">200 кредитов - Starter Plan</option>
                        <option value="pro_monthly">650 кредитов - Pro Plan</option>
                        <option value="vip_monthly">1500 кредитов - VIP Plan</option>
                    </select>
                    <p class="text-sm text-white text-center mb-2">Используйте до <span id="currentPlanCredits">200</span> кредитов в месяц</p>
                    <p class="text-xl font-bold text-center mb-4 text-white"><span id="currentSubscriptionPrice">$18</span></p>
                    <button class="btn-primary w-full" onclick="app.upgradeSubscription()">Купить подписку</button>
                </div>
            </div>
        `);
        // После создания динамических элементов, обновим ссылки в this.elements
        this.elements = { ...this.elements, ...this.getDOMElements() };
    }

    // Обработка загрузки изображения
    handleImageUpload(event, pageType) {
        const file = event.target.files[0];
        if (!file) {
            this.resetImageUpload();
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target.result;
            this.uploadedImageBase64 = base64Image.split(',')[1];

            // Обновляем превью на текущей странице и на всех связанных
            this.elements.imagePreview.src = base64Image;
            this.elements.imagePreview.classList.add('is-active');
            this.elements.uploadText.classList.add('is-hidden');
            this.elements.uploadImagePlaceholder.classList.add('is-hidden');

            this.elements.imagePreviewHome.src = base64Image;
            this.elements.imagePreviewHome.classList.add('is-active');
            this.elements.uploadTextHome.classList.add('is-hidden');
            this.elements.uploadImagePlaceholderHome.classList.add('is-hidden');
        };
        reader.readAsDataURL(file);
    }

    // Сброс загруженного изображения
    resetImageUpload() {
        this.uploadedImageBase64 = null;

        this.elements.imagePreview.src = '#';
        this.elements.imagePreview.classList.remove('is-active');
        this.elements.uploadText.classList.remove('is-hidden');
        this.elements.uploadImagePlaceholder.classList.remove('is-hidden');

        this.elements.imagePreviewHome.src = '#';
        this.elements.imagePreviewHome.classList.remove('is-active');
        this.elements.uploadTextHome.classList.remove('is-hidden');
        this.elements.uploadImagePlaceholderHome.classList.remove('is-hidden');
    }

    // Получение анализа (имитация запроса к AI)
    async getAnalysis() {
        if (!this.uploadedImageBase64) {
            this.showErrorMessage('Пожалуйста, загрузите изображение графика для анализа.');
            return;
        }

        this.showLoadingModal();
        this.hideErrorMessage();
        this.hideAnalysisResult();

        try {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Имитация задержки API

            // Имитация данных анализа (должны приходить с бэкенда)
            const dummyAnalysisData = {
                action: 'LONG',
                entryPrice: '122,000',
                targetPrice: '123,800',
                stopLoss: '116,500',
                trend: 'Устойчивый восходящий',
                volatility: '⭐⭐⭐⭐⬜',
                volume: 'Высокий',
                sentiment: 'Позитивное',
                planLevel: 'basic'
            };

            // Обновление UI с данными анализа
            this.elements.outputAction.textContent = dummyAnalysisData.action;
            this.elements.outputEntryPrice.textContent = dummyAnalysisData.entryPrice;
            this.elements.outputTargetPrice.textContent = dummyAnalysisData.targetPrice;
            this.elements.outputStopLoss.textContent = dummyAnalysisData.stopLoss;
            this.elements.outputTakeProfit.textContent = dummyAnalysisData.targetPrice;
            this.elements.outputTrend.textContent = dummyAnalysisData.trend;
            this.elements.outputVolatility.textContent = dummyAnalysisData.volatility;
            this.elements.outputVolume.textContent = dummyAnalysisData.volume;
            this.elements.outputSentiment.textContent = dummyAnalysisData.sentiment;

            // Пример динамического изменения цвета действия
            if (dummyAnalysisData.action === 'КУПИТЬ' || dummyAnalysisData.action === 'LONG') {
                this.elements.outputAction.style.color = '#22c55e'; // Tailwind green-500
            } else if (dummyAnalysisData.action === 'ПРОДАТЬ' || dummyAnalysisData.action === 'SHORT') {
                this.elements.outputAction.style.color = '#ef4444'; // Tailwind red-500
            } else {
                this.elements.outputAction.style.color = '#FFF';
            }

            this.userPlanLevel = dummyAnalysisData.planLevel; // Обновляем уровень плана пользователя

            this.showAnalysisResult();
            this.updateTokenCounter(-1); // Вычитаем 1 токен за анализ

        } catch (error) {
            console.error("Ошибка при получении анализа:", error);
            this.showErrorMessage('Произошла непредвиденная ошибка при получении анализа. Пожалуйста, попробуйте позже.');
        } finally {
            this.hideLoadingModal();
        }
    }

    // Запрос платежа через Telegram Stars
    requestSubscriptionPayment(starsAmount, payloadType) {
        const invoicePayload = `${payloadType}_${starsAmount}`;
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.requestPayment({ amount: starsAmount, asset: 'stars', payload: invoicePayload }, (status) => {
                if (status.status === 'succeeded') {
                    Telegram.WebApp.showAlert(`Покупка успешно оплачена!`);
                    if (payloadType.startsWith('purchase_credits')) {
                        const credits = parseInt(payloadType.split('_')[2]);
                        this.updateTokenCounter(credits);
                    } else if (payloadType.startsWith('upgrade_plan')) {
                        this.userPlanLevel = 'premium'; // Обновляем уровень плана для демо
                        this.showCustomMessage('Ваша подписка успешно обновлена до Премиум!');
                        const today = new Date();
                        const futureDate = new Date(today.setMonth(today.getMonth() + (this.currentSubscriptionType === 'monthly' ? 1 : 12)));
                        this.elements.subscriptionEndDate.textContent = futureDate.toLocaleDateString('ru-RU');
                    }
                } else {
                    Telegram.WebApp.showAlert(`Ошибка оплаты или отмена: ${status.status}`);
                }
            });
        } else {
            this.showCustomMessage(`Демо: Запрос платежа на ${starsAmount / 100} Stars. В реальном приложении откроется платежный интерфейс Telegram Stars.`);
            if (payloadType.startsWith('purchase_credits')) {
                const credits = parseInt(payloadType.split('_')[2]);
                this.updateTokenCounter(credits);
            } else if (payloadType.startsWith('upgrade_plan')) {
                this.userPlanLevel = 'premium';
                this.showCustomMessage('Ваша подписка успешно обновлена до Премиум!');
                const today = new Date();
                const futureDate = new Date(today.setMonth(today.getMonth() + (this.currentSubscriptionType === 'monthly' ? 1 : 12)));
                this.elements.subscriptionEndDate.textContent = futureDate.toLocaleDateString('ru-RU');
            }
        }
    }

    // Показ кастомного сообщения (заменяет alert)
    showCustomMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'custom-message-modal';
        modal.innerHTML = `
            <div class="custom-message-content">
                <p>${message}</p>
                <button onclick="this.parentNode.parentNode.remove()">ОК</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Обновление цены за токены
    updateCreditPrice() {
        const selectedCredits = this.elements.creditAmountSelect.value;
        const price = this.creditPrices[selectedCredits];
        this.elements.currentCreditPrice.textContent = `$${price.toFixed(2)}`;
    }

    // Обновление цены подписки
    updateSubscriptionPrice() {
        let selectedPlanValue = this.elements.planSelect.value;
        let details;
        let displayedCredits;

        if (this.currentSubscriptionType === 'monthly') {
            if (selectedPlanValue.includes('_yearly')) {
                selectedPlanValue = selectedPlanValue.replace('_yearly', '_monthly');
            }
            this.elements.planSelect.innerHTML = `
                <option value="starter_monthly">200 кредитов - Starter Plan</option>
                <option value="pro_monthly">650 кредитов - Pro Plan</option>
                <option value="vip_monthly">1500 кредитов - VIP Plan</option>
            `;
            this.elements.planSelect.value = selectedPlanValue;
            details = this.monthlyPlanDetails[selectedPlanValue];
            displayedCredits = details ? details.credits : 0;
        } else { // yearly
            if (selectedPlanValue.includes('_monthly')) {
                selectedPlanValue = selectedPlanValue.replace('_monthly', '_yearly');
            }
            this.elements.planSelect.innerHTML = `
                <option value="starter_yearly">200 кредитов/мес. - Starter Plan</option>
                <option value="pro_yearly">650 кредитов/мес. - Pro Plan</option>
                <option value="vip_yearly">1500 кредитов/мес. - VIP Plan</option>
            `;
            this.elements.planSelect.value = selectedPlanValue;
            details = this.yearlyPlanDetails[selectedPlanValue];
            displayedCredits = this.monthlyPlanDetails[selectedPlanValue.replace('_yearly', '_monthly')].credits;
        }

        if (!details) {
            this.elements.planSelect.value = this.elements.planSelect.options[0].value;
            selectedPlanValue = this.elements.planSelect.value;
            if (this.currentSubscriptionType === 'monthly') {
                details = this.monthlyPlanDetails[selectedPlanValue];
            } else {
                details = this.yearlyPlanDetails[selectedPlanValue];
            }
            displayedCredits = this.monthlyPlanDetails[selectedPlanValue.replace('_yearly', '_monthly')].credits;
        }

        this.elements.currentPlanCredits.textContent = displayedCredits;
        this.elements.currentSubscriptionPrice.textContent = `$${details.price.toFixed(2)}/${this.currentSubscriptionType === 'monthly' ? 'месяц' : 'год'}`;
    }

    // Покупка токенов
    purchaseCredits() {
        const selectedCredits = this.elements.creditAmountSelect.value;
        const priceInUSD = this.creditPrices[selectedCredits];
        const starsAmount = Math.round(priceInUSD * 100);
        this.requestSubscriptionPayment(starsAmount, `purchase_credits_${selectedCredits}`);
    }

    // Обновление подписки
    upgradeSubscription() {
        const selectedPlan = this.elements.planSelect.value;
        let details;
        if (this.currentSubscriptionType === 'monthly') {
            details = this.monthlyPlanDetails[selectedPlan];
        } else {
            details = this.yearlyPlanDetails[selectedPlan];
        }
        const priceInUSD = details.price;
        const starsAmount = Math.round(priceInUSD * 100);
        this.requestSubscriptionPayment(starsAmount, `upgrade_plan_${selectedPlan}`);
    }

    // Обновление счетчика токенов
    updateTokenCounter(change) {
        let currentHeaderTokens = parseInt(this.elements.headerTokens.textContent);
        let currentProfileTokens = parseInt(this.elements.currentTokens.textContent);

        currentHeaderTokens += change;
        currentProfileTokens += change;

        this.elements.headerTokens.textContent = currentHeaderTokens;
        this.elements.currentTokens.textContent = currentProfileTokens;
    }

    // Показ страницы
    showPage(pageId) {
        this.elements.navItems.forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        window.scrollTo(0, 0);
        const targetNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (targetNavItem) {
            this.activateNav(targetNavItem);
        }
    }

    // Активация элемента навигации
    activateNav(element) {
        if (element) {
            this.elements.navItems.forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }
    }

    // Переключение сворачиваемых секций
    toggleCollapsible(headerElement, contentId) {
        const content = document.getElementById(contentId);
        headerElement.classList.toggle('active');
        content.classList.toggle('active');
    }

    // Показ/скрытие модального окна инструкции
    showInstructionModal() {
        this.elements.instructionModal.classList.remove('hidden');
    }

    hideInstructionModal() {
        this.elements.instructionModal.classList.add('hidden');
    }

    // Показ/скрытие модального окна загрузки
    showLoadingModal() {
        this.elements.loadingModal.classList.add('active');
    }

    hideLoadingModal() {
        this.elements.loadingModal.classList.remove('active');
    }

    // Показ/скрытие результатов анализа
    showAnalysisResult() {
        this.elements.analysisResult.classList.remove('hidden');
        if (this.elements.disclaimerTextElement) {
            this.elements.disclaimerTextElement.classList.remove('hidden');
        }
    }

    hideAnalysisResult() {
        this.elements.analysisResult.classList.add('hidden');
        if (this.elements.disclaimerTextElement) {
            this.elements.disclaimerTextElement.classList.add('hidden');
        }
    }

    // Показ/скрытие сообщения об ошибке
    showErrorMessage(message) {
        this.elements.errorText.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
    }

    hideErrorMessage() {
        this.elements.errorMessage.classList.add('hidden');
    }

    // Переключение вида подписки (месячная/годовая)
    toggleSubscriptionView(type) {
        this.currentSubscriptionType = type;

        if (this.elements.monthlyToggle && this.elements.yearlyToggle) {
            if (type === 'monthly') {
                this.elements.monthlyToggle.classList.add('active');
                this.elements.yearlyToggle.classList.remove('active');
            } else {
                this.elements.monthlyToggle.classList.remove('active');
                this.elements.yearlyToggle.classList.add('active');
            }
        }
        this.updateSubscriptionPrice();
    }

    // Инициализация приложения при загрузке DOM
    init() {
        this.elements.splashScreen.classList.remove('hidden');
        setTimeout(() => {
            this.elements.splashScreen.classList.add('hidden');
            this.showPage('homePage');
            this.activateNav(document.querySelector('.nav-item[data-page="homePage"]'));
        }, 2000);

        // Устанавливаем начальные значения токенов и даты подписки
        this.elements.headerTokens.textContent = '100';
        this.elements.currentTokens.textContent = '100';
        this.elements.subscriptionEndDate.textContent = '15.08.2025';

        // Обновляем цены в UI при загрузке
        this.updateCreditPrice();
        this.updateSubscriptionPrice();
    }
}

// Создаем экземпляр приложения и запускаем его после загрузки DOM
const app = new CryptoVisionApp();
document.addEventListener('DOMContentLoaded', () => app.init());