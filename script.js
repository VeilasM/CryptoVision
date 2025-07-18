const chartImageUpload = document.getElementById('chartImageUpload');
const imageUploadArea = document.getElementById('imageUploadArea');
const imagePreview = document.getElementById('imagePreview'); // Возвращаем эту переменную
const uploadText = document.getElementById('uploadText');
const getAnalysisBtn = document.getElementById('getAnalysisBtn');
const buttonText = document.getElementById('buttonText');
const analysisResult = document.getElementById('analysisResult');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const outputAction = document.getElementById('outputAction');
const outputEntryPrice = document.getElementById('outputEntryPrice');
const outputTargetPrice = document.getElementById('outputTargetPrice');
const outputStopLoss = document.getElementById('outputStopLoss');
const outputTakeProfit = document.getElementById('outputTakeProfit');
const outputTrend = document.getElementById('outputTrend');
const outputVolatility = document.getElementById('outputVolatility');
const outputVolume = document.getElementById('outputVolume');
const outputSentiment = document.getElementById('outputSentiment');
const detailedAnalysis1 = document.getElementById('detailedAnalysis1');
const detailedAnalysis2 = document.getElementById('detailedAnalysis2');
const detailedAnalysis3 = document.getElementById('detailedAnalysis3');
const detailedAnalysis4 = document.getElementById('detailedAnalysis4');
const detailedAnalysis5 = document.getElementById('detailedAnalysis5');
const homePage = document.getElementById('homePage');
const analysisPage = document.getElementById('analysisPage');
const paymentPage = document.getElementById('paymentPage');
const searchPage = document.createElement('div');
searchPage.id = 'searchPage';
searchPage.className = 'page';
searchPage.innerHTML = '<h2 class="text-xl font-semibold text-center mb-4">Поиск Информации</h2><p class="text-gray-300 text-center">Эта страница находится в разработке.</p>';
document.querySelector('.container').appendChild(searchPage);
const profilePage = document.createElement('div');
profilePage.id = 'profilePage';
profilePage.className = 'page';
profilePage.innerHTML = '<h2 class="text-xl font-semibold text-center mb-4">Профиль Пользователя</h2><p class="text-gray-300 text-center">Здесь будет ваша информация, рефералы и настройки.</p>';
document.querySelector('.container').appendChild(profilePage);
const instructionModal = document.getElementById('instructionModal');
const loadingModal = document.getElementById('loadingModal');
const splashScreen = document.getElementById('splashScreen');
const navItems = document.querySelectorAll('.nav-item');
const tokenCounter = document.getElementById('tokenCounter');
const headerTokens = document.getElementById('headerTokens');
const currentTokens = document.getElementById('currentTokens');
const subscriptionEndDate = document.getElementById('subscriptionEndDate');
const monthlyToggle = document.getElementById('monthlyToggle');
const yearlyToggle = document.getElementById('yearlyToggle');
const payAsYouGoSection = document.getElementById('payAsYouGoSection');
const subscriptionSection = document.getElementById('subscriptionSection');
const creditAmountSelect = document.getElementById('creditAmountSelect');
const currentCreditPrice = document.getElementById('currentCreditPrice');
const planSelect = document.getElementById('planSelect');
const currentPlanCredits = document.getElementById('currentPlanCredits');
const currentSubscriptionPrice = document.getElementById('currentSubscriptionPrice');
const uploadAndAnalyzeBtn = document.getElementById('uploadAndAnalyzeBtn');
const uploadImagePlaceholder = document.getElementById('uploadImagePlaceholder'); // Возвращаем эту переменную
const detailedAnalysisLockOverlay = document.getElementById('detailedAnalysisLockOverlay');

let uploadedImageBase64 = null;
let userPlanLevel = 'basic';

const disclaimerTextElement = document.getElementById('disclaimerText');

if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    if (Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
        const user = Telegram.WebApp.initDataUnsafe.user;
    }
} else {
    console.warn('Telegram Web App API not available. Running in standalone mode. Real payments and camera will not work.');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function activateNav(element) {
    if (element) {
        navItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }
}

function toggleCollapsible(headerElement, contentId) {
    const content = document.getElementById(contentId);
    headerElement.classList.toggle('active');
    content.classList.toggle('active');
}

function showInstructionModal() {
    instructionModal.classList.remove('hidden');
}

function hideInstructionModal() {
    instructionModal.classList.add('hidden');
}

function showLoadingModal() {
    loadingModal.classList.add('active');
}

function hideLoadingModal() {
    loadingModal.classList.remove('active');
}

imageUploadArea.addEventListener('click', () => {
    chartImageUpload.click();
});

chartImageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // imagePreview теперь снова тег <img>
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            if (uploadImagePlaceholder) {
                uploadImagePlaceholder.style.display = 'none'; // Скрываем плейсхолдер
            }
            uploadedImageBase64 = e.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        uploadText.style.display = 'block';
        if (uploadImagePlaceholder) {
                uploadImagePlaceholder.style.display = 'block'; // Показываем плейсхолдер
        }
        uploadedImageBase64 = null;
    }
});

getAnalysisBtn.addEventListener('click', async () => {
    if (!uploadedImageBase64) {
        uploadedImageBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }

    showLoadingModal();
    hideErrorMessage();
    hideAnalysisResult();

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
            detailedAnalysis: [
                'Внутридневная волатильность: Высокая, что предоставляет возможности для краткосрочной торговли.',
                'Всплески объема во время разворотов: Наблюдаются значительные объемы при смене тренда, подтверждая силу движения.',
                'Отсутствие всеобъемлющего тренда: Рынок демонстрирует боковое движение с частыми коррекциями.',
                'Доминирование разворотных свечей: Формируются паттерны, указывающие на смену направления цены.',
                'Поддержка и сопротивление: Ключевые уровни $95,000 (поддержка) и $105,000 (сопротивление) остаются важными.'
            ],
            planLevel: 'basic'
        };

        outputAction.textContent = dummyAnalysisData.action;
        outputEntryPrice.textContent = dummyAnalysisData.entryPrice;
        outputTargetPrice.textContent = dummyAnalysisData.targetPrice;
        outputStopLoss.textContent = dummyAnalysisData.stopLoss;
        outputTakeProfit.textContent = dummyAnalysisData.targetPrice;
        outputTrend.textContent = dummyAnalysisData.trend;
        outputVolatility.textContent = dummyAnalysisData.volatility;
        outputVolume.textContent = dummyAnalysisData.volume;
        outputSentiment.textContent = dummyAnalysisData.sentiment;
        if (detailedAnalysis1) detailedAnalysis1.textContent = dummyAnalysisData.detailedAnalysis[0];
        if (detailedAnalysis2) detailedAnalysis2.textContent = dummyAnalysisData.detailedAnalysis[1];
        if (detailedAnalysis3) detailedAnalysis3.textContent = dummyAnalysisData.detailedAnalysis[2];
        if (detailedAnalysis4) detailedAnalysis4.textContent = dummyAnalysisData.detailedAnalysis[3];
        if (detailedAnalysis5) detailedAnalysis5.textContent = dummyAnalysisData.detailedAnalysis[4];

        if (dummyAnalysisData.action === 'КУПИТЬ' || dummyAnalysisData.action === 'LONG') {
            outputAction.className = 'font-bold text-green-600';
        } else if (dummyAnalysisData.action === 'ПРОДАТЬ' || dummyAnalysisData.action === 'SHORT') {
            outputAction.className = 'font-bold text-red-600';
        } else {
            outputAction.className = 'font-bold text-gray-400';
        }

        userPlanLevel = dummyAnalysisData.planLevel;
        applyPremiumLocks();

        showAnalysisResult();
        updateTokenCounter(-1);

    } catch (error) {
        console.error("Ошибка при получении анализа:", error);
        showErrorMessage('Произошла непредвиденная ошибка при получении анализа. Пожалуйста, попробуйте позже.');
    } finally {
        hideLoadingModal();
    }
});

uploadAndAnalyzeBtn.addEventListener('click', () => {
    showPage('analysisPage');
    activateNav(document.querySelector('.nav-item[data-page="analysisPage"]'));
});

function requestSubscriptionPayment(starsAmount, payloadType) {
    const invoicePayload = `${payloadType}_${starsAmount}`;
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        Telegram.WebApp.requestPayment({ amount: starsAmount, asset: 'stars', payload: invoicePayload }, (status) => {
            if (status.status === 'succeeded') {
                Telegram.WebApp.showAlert(`Покупка успешно оплачена!`);
                if (payloadType.startsWith('purchase_credits')) {
                    const credits = parseInt(payloadType.split('_')[2]);
                    updateTokenCounter(credits);
                } else if (payloadType.startsWith('upgrade_plan')) {
                    userPlanLevel = 'premium';
                    applyPremiumLocks();
                    showCustomMessage('Ваша подписка успешно обновлена до Премиум!');
                }
            } else {
                Telegram.WebApp.showAlert(`Ошибка оплаты или отмена: ${status.status}`);
            }
        });
    } else {
        showCustomMessage(`Демо: Запрос платежа на ${starsAmount / 100} Stars. В реальном приложении откроется платежный интерфейс Telegram Stars.`);
        if (payloadType.startsWith('purchase_credits')) {
            const credits = parseInt(payloadType.split('_')[2]);
            updateTokenCounter(credits);
        } else if (payloadType.startsWith('upgrade_plan')) {
            userPlanLevel = 'premium';
            applyPremiumLocks();
            showCustomMessage('Ваша подписка успешно обновлена до Премиум!');
        }
    }
}

function showCustomMessage(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
        z-index: 10000;
    `;
    modal.innerHTML = `
        <div style="background-color: #0F0F1A; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 80%; box-shadow: 0 0 20px rgba(75, 0, 130, 0.5);">
            <p style="color: #E2E8F0; font-size: 1.1rem; margin-bottom: 1.5rem;">${message}</p>
            <button onclick="this.parentNode.parentNode.remove()" style="background-image: linear-gradient(to right, #4B0082 0%, #8A2BE2 100%); color: white; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: bold; border: none; cursor: pointer;">ОК</button>
        </div>
    `;
    document.body.appendChild(modal);
}

const creditPrices = {
    '5': 1.30, '10': 2.50, '75': 15.00, '200': 30.00, '500': 60.00, '1200': 100.00, '4000': 250.00, '8000': 400.00
};
const monthlyPlanDetails = {
    'starter_monthly': { credits: 200, price: 18 },
    'pro_monthly': { credits: 650, price: 45 },
    'vip_monthly': { credits: 1500, price: 90 }
};
const yearlyPlanDetails = {
    'starter_yearly': { credits: 200, price: 18 * 12 * 0.7, save: '30%' },
    'pro_yearly': { credits: 650, price: 45 * 12 * 0.7, save: '30%' },
    'vip_yearly': { credits: 1500, price: 90 * 12 * 0.7, save: '30%' }
};
let currentSubscriptionType = 'monthly';

function updateCreditPrice() {
    const selectedCredits = creditAmountSelect.value;
    const price = creditPrices[selectedCredits];
    currentCreditPrice.textContent = `$${price.toFixed(2)}`;
}

function updateSubscriptionPrice() {
    let selectedPlanValue = planSelect.value;
    let details;
    let displayedCredits;
    if (currentSubscriptionType === 'monthly') {
        if (selectedPlanValue.includes('_yearly')) {
            selectedPlanValue = selectedPlanValue.replace('_yearly', '_monthly');
        }
        planSelect.innerHTML = `
            <option value="starter_monthly">200 кредитов - Starter Plan</option>
            <option value="pro_monthly">650 кредитов - Pro Plan</option>
            <option value="vip_monthly">1500 кредитов - VIP Plan</option>
        `;
        planSelect.value = selectedPlanValue;
        details = monthlyPlanDetails[selectedPlanValue];
        displayedCredits = details ? details.credits : 0;
    } else {
        if (selectedPlanValue.includes('_monthly')) {
            selectedPlanValue = selectedPlanValue.replace('_monthly', '_yearly');
        }
        planSelect.innerHTML = `
            <option value="starter_yearly">200 кредитов/мес. - Starter Plan <span class="save-badge">Скидка 30%</span></option>
            <option value="pro_yearly">650 кредитов/мес. - Pro Plan <span class="save-badge">Скидка 30%</span></option>
            <option value="vip_yearly">1500 кредитов/мес. - VIP Plan <span class="save-badge">Скидка 30%</span></option>
        `;
        planSelect.value = selectedPlanValue;
        details = yearlyPlanDetails[selectedPlanValue];
        displayedCredits = monthlyPlanDetails[selectedPlanValue.replace('_yearly', '_monthly')].credits;
    }
    if (!details) {
        planSelect.value = planSelect.options[0].value;
        selectedPlanValue = planSelect.value;
        if (currentSubscriptionType === 'monthly') {
            details = monthlyPlanDetails[selectedPlanValue];
        } else {
            details = yearlyPlanDetails[selectedPlanValue];
        }
        displayedCredits = monthlyPlanDetails[selectedPlanValue.replace('_yearly', '_monthly')].credits;
    }
    currentPlanCredits.textContent = displayedCredits;
    currentSubscriptionPrice.textContent = `$${details.price.toFixed(2)}/${currentSubscriptionType === 'monthly' ? 'месяц' : 'год'}`;
}

function toggleSubscriptionView(type) {
    currentSubscriptionType = type;
    if (type === 'monthly') {
        monthlyToggle.classList.add('active');
        yearlyToggle.classList.remove('active');
    } else {
        monthlyToggle.classList.remove('active');
        yearlyToggle.classList.add('active');
    }
    updateSubscriptionPrice();
}

function purchaseCredits() {
    const selectedCredits = creditAmountSelect.value;
    const priceInUSD = creditPrices[selectedCredits];
    const starsAmount = Math.round(priceInUSD * 100);
    requestSubscriptionPayment(starsAmount, `purchase_credits_${selectedCredits}`);
}

function upgradeSubscription() {
    const selectedPlan = planSelect.value;
    let details;
    if (currentSubscriptionType === 'monthly') {
        details = monthlyPlanDetails[selectedPlan];
    } else {
        details = yearlyPlanDetails[selectedPlan];
    }
    const priceInUSD = details.price;
    const starsAmount = Math.round(priceInUSD * 100);
    requestSubscriptionPayment(starsAmount, `upgrade_plan_${selectedPlan}`);
}

function updateTokenCounter(change) {
    let current = parseInt(headerTokens.textContent);
    current += change;
    headerTokens.textContent = current;
    currentTokens.textContent = current;
}

function showAnalysisResult() {
    analysisResult.classList.remove('hidden');
    if (disclaimerTextElement) {
        disclaimerTextElement.style.display = 'block';
    }
}

function hideAnalysisResult() {
    analysisResult.classList.add('hidden');
    if (disclaimerTextElement) {
        disclaimerTextElement.style.display = 'none';
    }
}

function showErrorMessage(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideErrorMessage() {
    errorMessage.classList.add('hidden');
}

function handleCameraClick() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.isVersionAtLeast('6.9') && Telegram.WebApp.showScanQrPopup) {
        Telegram.WebApp.showScanQrPopup((data) => {
            console.log('QR Scanned:', data);
            showPage('analysisPage');
            activateNav(document.querySelector('.nav-item[data-page="analysisPage"]'));
            getAnalysisBtn.click();
        });
    } else {
        showCustomMessage('Функция камеры доступна только в Telegram Web App. Откройте диалог загрузки файла.');
        showPage('analysisPage');
        activateNav(document.querySelector('.nav-item[data-page="analysisPage"]'));
        chartImageUpload.click();
    }
}

function applyPremiumLocks() {
    const detailedAnalysisSection = document.querySelector('.analysis-section-card ul.detailed-analysis-list');

    if (detailedAnalysisSection) {
        if (userPlanLevel === 'basic') {
            detailedAnalysisSection.classList.add('locked-content');
            detailedAnalysisLockOverlay.classList.remove('hidden');
        } else {
            detailedAnalysisSection.classList.remove('locked-content');
            detailedAnalysisLockOverlay.classList.add('hidden');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    splashScreen.classList.remove('hidden');
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        showPage('homePage');
        activateNav(document.querySelector('.nav-item[data-page="analysisPage"]'));
    }, 2000);

    headerTokens.textContent = '100';
    currentTokens.textContent = '50';
    subscriptionEndDate.textContent = '15.08.2025';
    updateCreditPrice();
    updateSubscriptionPrice();
    toggleSubscriptionView('monthly');
    applyPremiumLocks();
});