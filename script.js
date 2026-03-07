// Pi Network Configuration
const PI_CONFIG = {
    appId: '68a6fed62cb50254172b6593',
    apiKey: '5inedspkbqoa4bz4tljrimau6rl7yvwnwkeinebxrgy2jwtiryyuh3g15jxyqjqj',
    walletAddress: 'GDLROKVSDNERQXEOOOSLKFBZGFJZEM4WEY3V66E4UAT7UPHWF72XCKTL',
    sandbox: false,
    network: 'pi_mainnet'
};

// Global variables
let piUser = null;
let isConnected = false;

// Initialize Pi SDK
async function initializePi() {
    try {
        if (typeof window.Pi === 'undefined') {
            throw new Error('Pi SDK bulunamadı!');
        }

        console.log('Pi SDK başlatılıyor...');
        
        await window.Pi.init({
            version: "2.0",
            sandbox: PI_CONFIG.sandbox,
            appId: PI_CONFIG.appId
        });

        console.log('Pi SDK başarıyla başlatıldı');
        updateConnectionStatus(true);
        
    } catch (error) {
        console.error('Pi SDK başlatma hatası:', error);
        showStatus('Pi SDK başlatılamadı: ' + error.message, 'error');
        updateConnectionStatus(false);
    }
}

// Connect to Pi Network
async function connectPi() {
    const btn = document.getElementById('connectBtn');
    const status = document.getElementById('connectionStatus');
    
    btn.disabled = true;
    btn.textContent = 'Bağlanıyor...';
    
    try {
        if (!window.Pi) {
            await initializePi();
        }

        const authResult = await window.Pi.authenticate(['payments', 'username'], {
            network: PI_CONFIG.network,
            onIncompletePaymentFound: (payment) => {
                console.log('Tamamlanmamış ödeme:', payment);
                showStatus('Tamamlanmamış ödeme bulundu: ' + payment.identifier, 'warning');
            }
        });

        piUser = authResult.user;
        isConnected = true;
        
        btn.style.display = 'none';
        status.textContent = `Hoş geldin, ${piUser.username}!`;
        status.className = 'status-indicator status-online';
        
        showStatus(`Pi Network'e başarıyla bağlandınız! Hoş geldin, ${piUser.username}!`, 'success');
        
        console.log('Pi kullanıcısı:', piUser);
        
    } catch (error) {
        console.error('Pi bağlantı hatası:', error);
        showStatus('Bağlantı hatası: ' + error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Pi Network ile Bağlan';
        updateConnectionStatus(false);
    }
}

// Buy product with Pi
async function buyProduct(amount, planName) {
    if (!piUser || !isConnected) {
        showStatus('Önce Pi Network ile bağlanmalısınız!', 'error');
        return;
    }

    const statusDiv = document.getElementById('statusMessage');
    statusDiv.classList.remove('hidden');
    statusDiv.innerHTML = `<div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Ödeme işleniyor...</p>
        <p class="text-sm text-muted-foreground">${planName} planı için ${amount} π ödemeniz alınıyor...</p>
    </div>`;

    try {
        const paymentData = {
            amount: amount,
            memo: `AgroPi ${planName} Plan Satın Alma`,
            metadata: {
                userId: piUser.uid,
                username: piUser.username,
                product: `AgroPi ${planName}`,
                plan: planName,
                timestamp: new Date().toISOString(),
                apiKey: PI_CONFIG.apiKey
            },
            payment: {
                to_address: PI_CONFIG.walletAddress,
                amount: amount,
                memo: `AgroPi ${planName} - ${piUser.username}`
            }
        };

        console.log('Ödeme verileri:', paymentData);

        // Create payment with Pi Network
        const payment = await window.Pi.createPayment(paymentData);

        console.log('Ödeme başarılı:', payment);
        
        statusDiv.innerHTML = `<div class="text-center">
            <div class="text-green-500 text-4xl mb-4">✅</div>
            <h3 class="text-xl font-bold text-green-600 mb-2">Ödeme Başarılı!</h3>
            <p>${planName} planı başarıyla satın alındı.</p>
            <p class="text-sm text-muted-foreground mt-2">Ödeme ID: ${payment.identifier}</p>
        </div>`;

        // Save payment to backend
        await savePaymentToBackend(payment, planName);
        
        // Update UI
        updatePaymentButtons();
        
    } catch (error) {
        console.error('Ödeme hatası:', error);
        
        let errorMessage = error.message;
        if (error.code === 'INSUFFICIENT_FUNDS') {
            errorMessage = 'Yetersiz bakiye. Lütfen cüzdanınızı doldurun.';
        } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Ağ hatası. Lütfen tekrar deneyin.';
        }
        
        statusDiv.innerHTML = `<div class="text-center">
            <div class="text-red-500 text-4xl mb-4">❌</div>
            <h3 class="text-xl font-bold text-red-600 mb-2">Ödeme Başarısız</h3>
            <p>${errorMessage}</p>
            <button class="payment-button mt-4" onclick="buyProduct(${amount}, '${planName}')">
                Tekrar Dene
            </button>
        </div>`;
    }
}

// Save payment to backend
async function savePaymentToBackend(payment, planName) {
    try {
        const response = await fetch('https://api.pi.network/v2/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                payment_id: payment.identifier,
                user_id: piUser.uid,
                username: piUser.username,
                amount: payment.amount,
                plan: planName,
                status: 'completed',
                timestamp: new Date().toISOString(),
                metadata: payment.metadata
            })
        });

        if (response.ok) {
            console.log('Ödeme backend\'e kaydedildi');
        } else {
            console.error('Backend kayıt hatası:', response.status);
        }
    } catch (error) {
        console.error('Backend bağlantı hatası:', error);
    }
}

// Update connection status
function updateConnectionStatus(connected) {
    const status = document.getElementById('connectionStatus');
    if (connected) {
        status.textContent = 'Çevrimiçi';
        status.className = 'status-indicator status-online';
    } else {
        status.textContent = 'Çevrimdışı';
        status.className = 'status-indicator status-offline';
    }
}

// Show status message
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.classList.remove('hidden');
    
    let bgColor = 'bg-blue-100 text-blue-800';
    if (type === 'error') bgColor = 'bg-red-100 text-red-800';
    if (type === 'success') bgColor = 'bg-green-100 text-green-800';
    if (type === 'warning') bgColor = 'bg-yellow-100 text-yellow-800';
    
    statusDiv.className = `${bgColor} border border-border rounded-lg p-4 mb-6 text-center`;
    statusDiv.innerHTML = `<p>${message}</p>`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 5000);
}

// Update payment buttons after successful purchase
function updatePaymentButtons() {
    const buttons = document.querySelectorAll('[onclick^="buyProduct"]');
    buttons.forEach(button => {
        if (button.textContent.includes('Satın Al')) {
            const planName = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            button.innerHTML = `✅ ${planName} Satın Alındı`;
            button.disabled = true;
            button.className = 'bg-gray-400 text-gray-200 px-6 py-3 rounded-lg font-semibold cursor-not-allowed w-full';
        }
    });
}

// Simulate sensor data updates (for demo purposes)
function updateSensorData() {
    const sensors = [
        { id: 'ph', min: 5.5, max: 6.5, current: 6.8 },
        { id: 'ec', min: 1.0, max: 1.5, current: 1.2 },
        { id: 'temp', min: 22, max: 26, current: 24 },
        { id: 'humidity', min: 60, max: 70, current: 65 },
        { id: 'light', min: 6000, max: 10000, current: 8000 },
        { id: 'water', min: 80, max: 90, current: 85 }
    ];

    sensors.forEach(sensor => {
        const variation = (Math.random() - 0.5) * 0.2;
        const newValue = sensor.current + variation;
        
        // Keep within realistic bounds
        const boundedValue = Math.max(sensor.min * 0.8, Math.min(sensor.max * 1.2, newValue));
        
        // Update display if element exists
        const valueElement = document.querySelector(`.sensor-value`);
        if (valueElement && valueElement.textContent.includes(sensor.current.toString())) {
            valueElement.textContent = sensor.id === 'temp' ? 
                `${boundedValue.toFixed(1)}°C` : 
                sensor.id === 'humidity' || sensor.id === 'water' ? 
                    `${Math.round(boundedValue)}%` : 
                    boundedValue.toFixed(1);
        }
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    console.log('AgroPi Marketplace yüklendi');
    
    // Initialize Pi SDK
    initializePi();
    
    // Start sensor simulation
    setInterval(updateSensorData, 5000);
    
    // Check if already connected
    if (window.Pi && window.Pi.getUser) {
        const user = window.Pi.getUser();
        if (user) {
            piUser = user;
            isConnected = true;
            updateConnectionStatus(true);
            document.getElementById('connectBtn').style.display = 'none';
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isConnected) {
        console.log('Sayfa tekrar aktif, Pi bağlantısı kontrol ediliyor...');
        updateConnectionStatus(true);
    }
});
