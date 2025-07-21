const chartImageUpload = document.getElementById('chartImageUpload');
const imageUploadArea = document.getElementById('imageUploadArea');
const imagePreview = document.getElementById('imagePreview');
const uploadText = document.getElementById('uploadText');

const chartImageUploadHome = document.getElementById('chartImageUploadHome');
const imageUploadAreaHome = document.getElementById('imageUploadAreaHome');
const imagePreviewHome = document.getElementById('imagePreviewHome');
const uploadTextHome = document.getElementById('uploadTextHome');

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
const homePage = document.getElementById('homePage');
const analysisPage = document.getElementById('analysisPage');

const searchPage = document.createElement('div');
searchPage.id = 'searchPage';
searchPage.className = 'page';
searchPage.innerHTML = '<h2 class="text-xl font-semibold text-center mb-4 text-white">Поиск Информации</h2><p class="text-white text-center">Эта страница находится в разработке.</p>';
document.querySelector('.container').appendChild(searchPage);

const chatPage = document.createElement('div');
chatPage.id = 'chatPage';
chatPage.className = 'page';
chatPage.innerHTML = '<h2 class="text-xl font-semibold text-center mb-4 text-white">AI Чат</h2><p class="text-white text-center">Эта страница находится в разработке.</p>';
document.querySelector('.container').appendChild(chatPage);

const profilePage = document.createElement('div');
profilePage.id = 'profilePage';
profilePage.className = 'page';
profilePage.innerHTML = `
    <p class="text-lg font-bold mb-2 text-white text-center">Текущий план: Базовый</p>
    <p class="mb-2 text-white text-center">Остаток токенов: <span class="font-bold text-white" id="currentTokens">50</span></p>
    <p class="mb-4 text-white text-center">Подписка кончается: <span class="font-bold text-white" id="subscriptionEndDate">--.--.----</span></p>
    <h2 class="text-xl font-semibold text-center mt-6 mb-4 text-white">Выберите опцию:</h2>

    <div class="subscription-options-container">
        <div class="card" id="payAsYouGoSection">
            <h3 class="text-xl font-bold text-center mb-4 text-white">Покупка токенов</h3>
            <label for="creditAmountSelect" class="block text-sm font-medium text-white mb-2">Количество:</label>
            <select id="creditAmountSelect" class="credit-select-box mb-4" onchange="updateCreditPrice()">
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
            <button class="btn-primary w-full" onclick="purchaseCredits()">Купить токены</button>
        </div>

        <div class="card" id="subscriptionSection">
            <div class="relative mb-4">
                <h3 class="text-xl font-bold text-center m-0 text-white">Подписка</h3>
                <div class="toggle-switch absolute top-0 right-0">
                    <div class="toggle-button active" id="monthlyToggle" onclick="toggleSubscriptionView('monthly')">Месячная</div>
                    <div class="toggle-button" id="yearlyToggle" onclick="toggleSubscriptionView('yearly')">Годовая</div>
                </div>
            </div>
            <label for="planSelect" class="block text-sm font-medium text-white mb-2">План:</label>
            <select id="planSelect" class="credit-select-box mb-4" onchange="updateSubscriptionPrice()">
                <option value="starter_monthly">200 кредитов - Starter Plan</option>
                <option value="pro_monthly">650 кредитов - Pro Plan</option>
                <option value="vip_monthly">1500 кредитов - VIP Plan</option>
            </select>
            <p class="text-sm text-white text-center mb-2">Используйте до <span id="currentPlanCredits">200</span> кредитов в месяц</p>
            <p class="text-xl font-bold text-center mb-4 text-white"><span id="currentSubscriptionPrice">$18</span>/месяц</p>
            <button class="btn-primary w-full" onclick="upgradeSubscription()">Купить подписку</button>
        </div>
    </div>
`;
document.querySelector('.container').appendChild(profilePage);

const instructionModal = document.getElementById('instructionModal');
const loadingModal = document.getElementById('loadingModal');
const splashScreen = document.getElementById('splashScreen');
const navItems = document.querySelectorAll('.nav-item');
const tokenCounter = document.getElementById('tokenCounter');
const headerTokens = document.getElementById('headerTokens');
// Удалено: const profileTokens = document.getElementById('profileTokens');
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
const uploadImagePlaceholder = document.getElementById('uploadImagePlaceholder');

let uploadedImageBase64 = null;
let uploadedImageBase64Home = null;
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
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            if (uploadImagePlaceholder) {
                uploadImagePlaceholder.style.display = 'none';
            }
            uploadedImageBase64 = e.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        uploadText.style.display = 'block';
        if (uploadImagePlaceholder) {
                uploadImagePlaceholder.style.display = 'block';
        }
        uploadedImageBase64 = null;
    }
});

imageUploadAreaHome.addEventListener('click', () => {
    chartImageUploadHome.click();
});

chartImageUploadHome.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviewHome.src = e.target.result;
            imagePreviewHome.style.display = 'block';
            uploadTextHome.style.display = 'none';
            if (uploadImagePlaceholderHome) {
                uploadImagePlaceholderHome.style.display = 'none';
            }
            uploadedImageBase64Home = e.target.result.split(',')[1];
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            if (uploadImagePlaceholder) {
                uploadImagePlaceholder.style.display = 'none';
            }
            uploadedImageBase64 = e.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    } else {
        imagePreviewHome.src = '#';
        imagePreviewHome.style.display = 'none';
        uploadTextHome.style.display = 'block';
        if (uploadImagePlaceholderHome) {
            uploadImagePlaceholderHome.style.display = 'block';
        }
        uploadedImageBase64Home = null;
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        uploadText.style.display = 'block';
        if (uploadImagePlaceholder) {
            uploadImagePlaceholder.style.display = 'block';
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

        if (dummyAnalysisData.action === 'КУПИТЬ' || dummyAnalysisData.action === 'LONG') {
            outputAction.className = 'font-bold text-white';
        } else if (dummyAnalysisData.action === 'ПРОДАТЬ' || dummyAnalysisData.action === 'SHORT') {
            outputAction.className = 'font-bold text-white';
        } else {
            outputAction.className = 'font-bold text-white';
        }

        userPlanLevel = dummyAnalysisData.planLevel;

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
        <div style="background-color: #000; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 80%; box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);">
            <p style="color: #FFF; font-size: 1.1rem; margin-bottom: 1.5rem;">${message}</p>
            <button onclick="this.parentNode.parentNode.remove()" style="background-color: #FFF; color: black; padding: 0.75rem 1.5rem; border-radius: 2rem; font-weight: bold; border: none; cursor: pointer;">ОК</button>
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
    let currentHeaderTokens = parseInt(headerTokens.textContent);
    let currentProfileTokens = parseInt(currentTokens.textContent);

    currentHeaderTokens += change;
    currentProfileTokens += change;

    headerTokens.textContent = currentHeaderTokens;
    currentTokens.textContent = currentProfileTokens;
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

document.addEventListener('DOMContentLoaded', () => {
    splashScreen.classList.remove('hidden');
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        showPage('homePage');
        activateNav(document.querySelector('.nav-item[data-page="homePage"]'));
    }, 2000);

    headerTokens.textContent = '100';
    currentTokens.textContent = '100';
    subscriptionEndDate.textContent = '15.08.2025';
    updateCreditPrice();
    updateSubscriptionPrice();
});