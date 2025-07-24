class CryptoVisionApp {
    constructor() {
        this.elements = {};
        this.uploadedImageBase64 = null;
        this.userPlanLevel = 'basic';
        this.currentSubscriptionType = 'monthly';

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

        this.initTelegramWebApp();
        this.createDynamicPages();
        this.elements = { ...this.elements, ...this.getDOMElements() }; 
        this.addEventListeners();
    }

    getDOMElements() {
        const elements = {};
        const idsToCollect = [
            'chartImageUpload', 'imageUploadArea', 'imagePreview', 'uploadImagePlaceholder',
            'chartImageUploadHome', 'imageUploadAreaHome', 'imagePreviewHome', 'uploadImagePlaceholderHome',
            'getAnalysisBtn', 'buttonText', 'analysisResult', 'errorMessage', 'errorText', 'clearAnalysisBtn',
            'outputAction', 'outputEntryPrice', 'outputTargetPrice', 'outputStopLoss', 'outputTakeProfit',
            'outputTrend', 'outputVolatility', 'outputVolume', 'outputSentiment',
            'homePage', 'analysisPage', 'instructionModal', 'loadingModal', 'splashScreen',
            'tokenCounter', 'headerTokens', 'currentTokens', 'subscriptionEndDate',
            'monthlyToggle', 'yearlyToggle', 'payAsYouGoSection', 'subscriptionSection',
            'creditAmountSelect', 'currentCreditPrice', 'planSelect', 'currentPlanCredits', 'currentSubscriptionPrice',
            'uploadAndAnalyzeBtn', 'disclaimerText'
        ];

        idsToCollect.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                elements[id] = element;
            }
        });
        elements.navItems = document.querySelectorAll('.nav-item');
        return elements;
    }

    initTelegramWebApp() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            if (Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
            }
        }
    }

    addEventListeners() {
        if (this.elements.imageUploadArea) {
            this.elements.imageUploadArea.addEventListener('click', () => this.elements.chartImageUpload.click());
        }
        if (this.elements.chartImageUpload) {
            this.elements.chartImageUpload.addEventListener('change', (event) => this.handleImageUpload(event, 'analysis'));
        }

        if (this.elements.imageUploadAreaHome) {
            this.elements.imageUploadAreaHome.addEventListener('click', () => this.elements.chartImageUploadHome.click());
        }
        if (this.elements.chartImageUploadHome) {
            this.elements.chartImageUploadHome.addEventListener('change', (event) => this.handleImageUpload(event, 'home'));
        }

        if (this.elements.getAnalysisBtn) {
            this.elements.getAnalysisBtn.addEventListener('click', () => this.getAnalysis());
        }
        if (this.elements.uploadAndAnalyzeBtn) {
            this.elements.uploadAndAnalyzeBtn.addEventListener('click', () => {
                this.showPage('analysisPage');
                const analysisNavItem = document.querySelector('.nav-item[data-page="analysisPage"]');
                if (analysisNavItem) {
                    this.activateNav(analysisNavItem);
                }
            });
        }
        if (this.elements.clearAnalysisBtn) {
            this.elements.clearAnalysisBtn.addEventListener('click', () => this.clearAnalysis());
        }

        if (this.elements.creditAmountSelect) {
            this.elements.creditAmountSelect.addEventListener('change', this.updateCreditPrice.bind(this));
        }
        if (this.elements.planSelect) {
            this.elements.planSelect.addEventListener('change', this.updateSubscriptionPrice.bind(this));
        }
        if (this.elements.monthlyToggle) {
            this.elements.monthlyToggle.addEventListener('click', this.toggleSubscriptionView.bind(this, 'monthly'));
        }
        if (this.elements.yearlyToggle) {
            this.elements.yearlyToggle.addEventListener('click', this.toggleSubscriptionView.bind(this, 'yearly'));
        }
    }

    createDynamicPages() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            return;
        }

        const createPage = (id, title, contentHTML = `<h2 class="text-xl font-semibold text-center mb-4 text-white">${title}</h2><p class="text-white text-center">Эта страница находится в разработке.</p>`) => {
            let page = document.getElementById(id);
            if (!page) {
                page = document.createElement('section');
                page.id = id;
                page.className = 'page';
                page.innerHTML = contentHTML;
                mainContent.appendChild(page);
                this.elements[id] = page; 
            }
            return page;
        };

        this.elements.searchPage = createPage('searchPage', 'Поиск Информации');
        this.elements.chatPage = createPage('chatPage', 'AI Чат');
        this.elements.coursePage = createPage('coursePage', 'Курс');
        this.elements.profilePage = createPage('profilePage', 'Профиль', `
            <p class="text-lg font-bold mb-2 text-white text-center">Текущий план: Базовый</p>
            <p class="mb-2 text-white text-center">Остаток токенов: <span class="font-bold text-white" id="currentTokens">100</span></p>
            <p class="mb-4 text-white text-center">Подписка кончается: <span class="font-bold text-white" id="subscriptionEndDate">15.08.2025</span></p>
            <h2 class="text-xl font-semibold text-center mt-6 mb-4 text-white">Выберите опцию:</h2>

            <div class="subscription-options-container">
                <div class="card" id="payAsYouGoSection">
                    <h3 class="text-xl font-bold text-center mb-4 text-white">Покупка токенов</h3>
                    <label for="creditAmountSelect" class="block text-sm font-medium text-white mb-2">Количество:</label>
                    <select id="creditAmountSelect" class="credit-select-box mb-4">
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
                    <select id="planSelect" class="credit-select-box mb-4">
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
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            this.resetImageUpload();
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target.result;
            this.uploadedImageBase64 = base64Image.split(',')[1];

            if (this.elements.imagePreview) {
                this.elements.imagePreview.src = base64Image;
                this.elements.imagePreview.classList.add('is-active');
            }
            if (this.elements.uploadImagePlaceholder) {
                this.elements.uploadImagePlaceholder.classList.add('is-hidden');
            }

            if (this.elements.imagePreviewHome) {
                this.elements.imagePreviewHome.src = base64Image;
                this.elements.imagePreviewHome.classList.add('is-active');
            }
            if (this.elements.uploadImagePlaceholderHome) {
                this.elements.uploadImagePlaceholderHome.classList.add('is-hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    resetImageUpload() {
        this.uploadedImageBase64 = null;

        if (this.elements.imagePreview) {
            this.elements.imagePreview.src = '#';
            this.elements.imagePreview.classList.remove('is-active');
        }
        if (this.elements.uploadImagePlaceholder) {
            this.elements.uploadImagePlaceholder.classList.remove('is-hidden');
        }

        if (this.elements.imagePreviewHome) {
            this.elements.imagePreviewHome.src = '#';
            this.elements.imagePreviewHome.classList.remove('is-active');
        }
        if (this.elements.uploadImagePlaceholderHome) {
            this.elements.uploadImagePlaceholderHome.classList.remove('is-hidden');
        }
    }

    async getAnalysis() {
        if (!this.uploadedImageBase64) {
            this.showErrorMessage('Пожалуйста, загрузите изображение графика для анализа.');
            return;
        }

        this.hideErrorMessage();
        this.hideAnalysisResult();

        if (this.elements.imageUploadArea && this.elements.imageUploadArea.closest('.glow-wrapper')) {
            this.elements.imageUploadArea.closest('.glow-wrapper').classList.add('glow-active');
        }
        if (this.elements.imageUploadAreaHome && this.elements.imageUploadAreaHome.closest('.glow-wrapper')) {
            this.elements.imageUploadAreaHome.closest('.glow-wrapper').classList.add('glow-active');
        }

        if (this.elements.buttonText) {
            this.elements.buttonText.textContent = 'Идёт анализ...';
        }
        if (this.elements.loadingSpinner) {
            this.elements.loadingSpinner.classList.remove('hidden');
        }
        if (this.elements.getAnalysisBtn) {
            this.elements.getAnalysisBtn.disabled = true;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

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

            if (this.elements.outputAction) this.elements.outputAction.textContent = dummyAnalysisData.action;
            if (this.elements.outputEntryPrice) this.elements.outputEntryPrice.textContent = dummyAnalysisData.entryPrice;
            if (this.elements.outputTargetPrice) this.elements.outputTargetPrice.textContent = dummyAnalysisData.targetPrice;
            if (this.elements.outputStopLoss) this.elements.outputStopLoss.textContent = dummyAnalysisData.stopLoss;
            if (this.elements.outputTakeProfit) this.elements.outputTakeProfit.textContent = dummyAnalysisData.targetPrice;
            if (this.elements.outputTrend) this.elements.outputTrend.textContent = dummyAnalysisData.trend;
            if (this.elements.outputVolatility) this.elements.outputVolatility.textContent = dummyAnalysisData.volatility;
            if (this.elements.outputVolume) this.elements.outputVolume.textContent = dummyAnalysisData.volume;
            if (this.elements.outputSentiment) this.elements.outputSentiment.textContent = dummyAnalysisData.sentiment;

            if (this.elements.outputAction) {
                this.elements.outputAction.style.color = '#FFF';
                if (dummyAnalysisData.action === 'КУПИТЬ' || dummyAnalysisData.action === 'LONG') {
                    this.elements.outputAction.style.color = '#22c55e';
                } else if (dummyAnalysisData.action === 'ПРОДАТЬ' || dummyAnalysisData.action === 'SHORT') {
                    this.elements.outputAction.style.color = '#ef4444';
                }
            }

            this.userPlanLevel = dummyAnalysisData.planLevel;

            this.showAnalysisResult();
            this.updateTokenCounter(-1);

        } catch (error) {
            this.showErrorMessage('Произошла непредвиденная ошибка при получении анализа. Пожалуйста, попробуйте позже.');
        } finally {
            if (this.elements.imageUploadArea && this.elements.imageUploadArea.closest('.glow-wrapper')) {
                this.elements.imageUploadArea.closest('.glow-wrapper').classList.remove('glow-active');
            }
            if (this.elements.imageUploadAreaHome && this.elements.imageUploadAreaHome.closest('.glow-wrapper')) {
                this.elements.imageUploadAreaHome.closest('.glow-wrapper').classList.remove('glow-active');
            }
            
            if (this.elements.buttonText) {
                this.elements.buttonText.textContent = 'Получить анализ';
            }
            if (this.elements.loadingSpinner) {
                this.elements.loadingSpinner.classList.add('hidden');
            }
            if (this.elements.getAnalysisBtn) {
                this.elements.getAnalysisBtn.disabled = false;
                // Скрываем кнопку "Получить анализ"
                this.elements.getAnalysisBtn.classList.add('hidden'); 
            }
            // Показываем кнопку "Очистить"
            if (this.elements.clearAnalysisBtn) {
                this.elements.clearAnalysisBtn.classList.remove('hidden');
            }
        }
    }
    
    clearAnalysis() {
        this.hideAnalysisResult(); 
        this.resetImageUpload();

        if (this.elements.outputAction) this.elements.outputAction.textContent = '';
        if (this.elements.outputEntryPrice) this.elements.outputEntryPrice.textContent = '';
        if (this.elements.outputTargetPrice) this.elements.outputTargetPrice.textContent = '';
        if (this.elements.outputStopLoss) this.elements.outputStopLoss.textContent = '';
        if (this.elements.outputTakeProfit) this.elements.outputTakeProfit.textContent = '';
        if (this.elements.outputTrend) this.elements.outputTrend.textContent = '';
        if (this.elements.outputVolatility) this.elements.outputVolatility.textContent = '';
        if (this.elements.outputVolume) this.elements.outputVolume.textContent = '';
        if (this.elements.outputSentiment) this.elements.outputSentiment.textContent = '';

        this.showPage('analysisPage');
        const analysisNavItem = document.querySelector('.nav-item[data-page="analysisPage"]');
        if (analysisNavItem) {
            this.activateNav(analysisNavItem);
        }

        if (this.elements.imageUploadArea && this.elements.imageUploadArea.closest('.glow-wrapper')) {
            this.elements.imageUploadArea.closest('.glow-wrapper').classList.remove('glow-active');
        }
        if (this.elements.imageUploadAreaHome && this.elements.imageUploadAreaHome.closest('.glow-wrapper')) {
            this.elements.imageUploadAreaHome.closest('.glow-wrapper').classList.remove('glow-active');
        }

        // Показываем кнопку "Получить анализ"
        if (this.elements.getAnalysisBtn) {
            this.elements.getAnalysisBtn.classList.remove('hidden');
        }
        // Скрываем кнопку "Очистить"
        if (this.elements.clearAnalysisBtn) {
            this.elements.clearAnalysisBtn.classList.add('hidden');
        }
    }

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
                        this.userPlanLevel = 'premium';
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

    updateCreditPrice() {
        const selectedCredits = this.elements.creditAmountSelect.value;
        const price = this.creditPrices[selectedCredits];
        if (this.elements.currentCreditPrice) {
            this.elements.currentCreditPrice.textContent = `$${price.toFixed(2)}`;
        }
    }

    updateSubscriptionPrice() {
        let selectedPlanValue = this.elements.planSelect.value;
        let details;
        let displayedCredits;

        if (this.currentSubscriptionType === 'monthly') {
            if (selectedPlanValue.includes('_yearly')) {
                selectedPlanValue = selectedPlanValue.replace('_yearly', '_monthly');
            }
            if (this.elements.planSelect) { 
                 this.elements.planSelect.innerHTML = `
                    <option value="starter_monthly">200 кредитов - Starter Plan</option>
                    <option value="pro_monthly">650 кредитов - Pro Plan</option>
                    <option value="vip_monthly">1500 кредитов - VIP Plan</option>
                `;
                this.elements.planSelect.value = selectedPlanValue;
            }
            details = this.monthlyPlanDetails[selectedPlanValue];
            displayedCredits = details ? details.credits : 0;
        } else {
            if (selectedPlanValue.includes('_monthly')) {
                selectedPlanValue = selectedPlanValue.replace('_monthly', '_yearly');
            }
            if (this.elements.planSelect) { 
                this.elements.planSelect.innerHTML = `
                    <option value="starter_yearly">200 кредитов/мес. - Starter Plan</option>
                    <option value="pro_yearly">650 кредитов/мес. - Pro Plan</option>
                    <option value="vip_yearly">1500 кредитов/мес. - VIP Plan</option>
                `;
                this.elements.planSelect.value = selectedPlanValue;
            }
            details = this.yearlyPlanDetails[selectedPlanValue];
            displayedCredits = this.monthlyPlanDetails[selectedPlanValue.replace('_yearly', '_monthly')].credits;
        }

        if (!details) {
            if (this.elements.planSelect) { 
                this.elements.planSelect.value = this.elements.planSelect.options[0].value;
                selectedPlanValue = this.elements.planSelect.value;
                if (this.currentSubscriptionType === 'monthly') {
                    details = this.monthlyPlanDetails[selectedPlanValue];
                } else {
                    details = this.yearlyPlanDetails[selectedPlanValue];
                }
            }
            displayedCredits = this.monthlyPlanDetails[selectedPlanValue.replace('_yearly', '_monthly')].credits;
        }

        if (this.elements.currentPlanCredits) {
            this.elements.currentPlanCredits.textContent = displayedCredits;
        }
        if (this.elements.currentSubscriptionPrice) {
            this.elements.currentSubscriptionPrice.textContent = `$${details.price.toFixed(2)}/${this.currentSubscriptionType === 'monthly' ? 'месяц' : 'год'}`;
        }
    }

    purchaseCredits() {
        const selectedCredits = this.elements.creditAmountSelect.value;
        const priceInUSD = this.creditPrices[selectedCredits];
        const starsAmount = Math.round(priceInUSD * 100);
        this.requestSubscriptionPayment(starsAmount, `purchase_credits_${selectedCredits}`);
    }

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

    updateTokenCounter(change) {
        let currentHeaderTokens = parseInt(this.elements.headerTokens.textContent);
        let currentProfileTokens = parseInt(this.elements.currentTokens.textContent);

        currentHeaderTokens += change;
        currentProfileTokens += change;

        if (this.elements.headerTokens) this.elements.headerTokens.textContent = currentHeaderTokens;
        if (this.elements.currentTokens) this.elements.currentTokens.textContent = currentProfileTokens;
    }

    showPage(pageId) {
        this.elements.navItems.forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);
            const targetNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
            if (targetNavItem) {
                this.activateNav(targetNavItem);
            }
        }
    }

    activateNav(element) {
        if (element) {
            this.elements.navItems.forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }
    }

    toggleCollapsible(headerElement, contentId) {
        const content = document.getElementById(contentId);
        if (headerElement) headerElement.classList.toggle('active');
        if (content) content.classList.toggle('active');
    }

    showInstructionModal() {
        if (this.elements.instructionModal) {
            this.elements.instructionModal.classList.remove('hidden');
        }
    }

    hideInstructionModal() {
        if (this.elements.instructionModal) {
            this.elements.instructionModal.classList.add('hidden');
        }
    }

    showAnalysisResult() {
        if (this.elements.analysisResult) {
            this.elements.analysisResult.classList.remove('hidden');
        }
        if (this.elements.disclaimerText) {
            this.elements.disclaimerText.classList.remove('hidden');
        }
    }

    hideAnalysisResult() {
        if (this.elements.analysisResult) {
            this.elements.analysisResult.classList.add('hidden');
        }
        if (this.elements.disclaimerText) {
            this.elements.disclaimerText.classList.add('hidden');
        }
    }

    showErrorMessage(message) {
        if (this.elements.errorText) {
            this.elements.errorText.textContent = message;
        }
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.remove('hidden');
        }
    }

    hideErrorMessage() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.add('hidden');
        }
    }

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

    init() {
        if (this.elements.splashScreen) {
            this.elements.splashScreen.classList.remove('hidden');
            setTimeout(() => {
                this.elements.splashScreen.classList.add('hidden');
                if (this.showPage) {
                    this.showPage('homePage');
                }
                const homeNavItem = document.querySelector('.nav-item[data-page="homePage"]');
                if (homeNavItem) {
                    if (this.activateNav) {
                        this.activateNav(homeNavItem);
                    }
                }
            }, 2000);
        } else {
            if (this.showPage) {
                this.showPage('homePage');
            }
            const homeNavItem = document.querySelector('.nav-item[data-page="homePage"]');
            if (homeNavItem) {
                if (this.activateNav) {
                    this.activateNav(homeNavItem);
                }
            }
        }

        if (this.elements.headerTokens) this.elements.headerTokens.textContent = '100';
        if (this.elements.currentTokens) this.elements.currentTokens.textContent = '100';
        if (this.elements.subscriptionEndDate) this.elements.subscriptionEndDate.textContent = '15.08.2025';

        if (this.updateCreditPrice) {
            this.updateCreditPrice();
        }
        if (this.updateSubscriptionPrice) {
            this.updateSubscriptionPrice();
        }
    }
}

const app = new CryptoVisionApp();
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});