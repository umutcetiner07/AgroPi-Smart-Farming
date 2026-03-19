import { Metadata } from 'next'
import { getTranslation, getAlternateUrls, type Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: { locale?: Locale } }): Promise<Metadata> {
  const locale = params?.locale || 'tr'
  const baseUrl = 'https://agropi-marketplace.vercel.app'
  const path = locale === 'tr' ? '' : `/${locale}`
  
  const title = getTranslation(locale, 'site.title')
  const description = getTranslation(locale, 'site.description')
  const alternates = getAlternateUrls(locale === 'tr' ? '' : `/${locale}`)

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        'tr': `${baseUrl}`,
        'en': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: title,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

'use client'

import { useState, useEffect } from 'react'
import { PiConfig, PiAuthResult } from '@/types/pi'

// Pi Network Configuration
const PI_CONFIG: PiConfig = {
    version: "2.0",
    sandbox: false,
    appId: '68a6fed62cb50254172b6593'
}

export default function Home() {
    const [piUser, setPiUser] = useState<PiAuthResult['user'] | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Initialize Pi SDK
    useEffect(() => {
        initializePi()
    }, [])

    async function initializePi() {
        try {
            if (typeof window !== 'undefined' && window.Pi) {
                await window.Pi.init({
                    version: "2.0",
                    sandbox: PI_CONFIG.sandbox,
                    appId: PI_CONFIG.appId
                })
                console.log('Pi SDK başarıyla başlatıldı')
            }
        } catch (error) {
            console.error('Pi SDK başlatma hatası:', error)
            setStatusMessage('Pi SDK başlatılamadı: ' + error.message)
        }
    }

    // Connect to Pi Network
    async function connectPi() {
        setIsLoading(true)
        try {
            if (!window.Pi) {
                throw new Error('Pi SDK bulunamadı!')
            }

            const authResult = await window.Pi.authenticate(['payments', 'username'], {
                network: PI_CONFIG.network,
                onIncompletePaymentFound: (payment: any) => {
                    console.log('Tamamlanmamış ödeme:', payment)
                    setStatusMessage('Tamamlanmamış ödeme bulundu: ' + payment.identifier)
                }
            })

            setPiUser(authResult.user)
            setIsConnected(true)
            setStatusMessage(`Pi Network'e başarıyla bağlandınız! Hoş geldin, ${authResult.user.username}!`)
            
        } catch (error: any) {
            console.error('Pi bağlantı hatası:', error)
            setStatusMessage('Bağlantı hatası: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Buy product with Pi
    async function buyProduct(amount: number, planName: string) {
        if (!piUser || !isConnected) {
            setStatusMessage('Önce Pi Network ile bağlanmalısınız!')
            return
        }

        setIsLoading(true)
        setStatusMessage(`Ödeme işleniyor... ${planName} planı için ${amount} π ödemeniz alınıyor...`)

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
            }

            const payment = await window.Pi.createPayment(paymentData)
            
            setStatusMessage(`Ödeme başarılı! ${planName} planı satın alındı. Ödeme ID: ${payment.identifier}`)
            
        } catch (error: any) {
            console.error('Ödeme hatası:', error)
            setStatusMessage('Ödeme hatası: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-bold text-white">🌾π</h1>
                            <span className="text-lg font-semibold text-white">AgroPi Marketplace</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {isConnected ? 'Çevrimiçi' : 'Çevrimdışı'}
                            </span>
                            {!isConnected && (
                                <button 
                                    onClick={connectPi}
                                    disabled={isLoading}
                                    className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Bağlanıyor...' : 'Pi Network ile Bağlan'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Dashboard Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">AI Destekli Tarım Kontrol Paneli</h2>
                    
                    {/* Sensor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* pH Sensor */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">pH Seviyesi</h3>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">6.8</div>
                            <div className="text-sm text-gray-300 mt-2">İdeal Değer: 5.5 - 6.5</div>
                        </div>

                        {/* EC Sensor */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">EC Değeri</h3>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">1.2</div>
                            <div className="text-sm text-gray-300 mt-2">İdeal Değer: 1.0 - 1.5</div>
                        </div>

                        {/* Temperature Sensor */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Sıcaklık</h3>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">24°C</div>
                            <div className="text-sm text-gray-300 mt-2">İdeal Değer: 22-26°C</div>
                        </div>

                        {/* Humidity Sensor */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Nem</h3>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">65%</div>
                            <div className="text-sm text-gray-300 mt-2">İdeal Değer: 60-70%</div>
                        </div>

                        {/* Light Sensor */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Işık Seviyesi</h3>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">8000 lux</div>
                            <div className="text-sm text-gray-300 mt-2">İdeal Değer: 6000-10000 lux</div>
                        </div>

                        {/* Water Level */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Su Seviyesi</h3>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">85%</div>
                            <div className="text-sm text-gray-300 mt-2">İdeal Değer: 80-90%</div>
                        </div>
                    </div>
                </section>

                {/* Payment Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">Premium Özellikler</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {/* Basic Plan */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center">
                            <h3 className="text-xl font-bold mb-4 text-white">Temel</h3>
                            <div className="text-3xl font-bold text-yellow-400 mb-4">0.1 π</div>
                            <ul className="text-left mb-6 space-y-2 text-gray-300">
                                <li>✅ Sensör izleme</li>
                                <li>✅ Temel analiz</li>
                                <li>✅ 7 gün veri saklama</li>
                            </ul>
                            <button 
                                onClick={() => buyProduct(0.1, 'Temel')}
                                disabled={!isConnected || isLoading}
                                className="w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Satın Al
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border-2 border-yellow-500 text-center">
                            <div className="bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                                EN POPÜLER
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Profesyonel</h3>
                            <div className="text-3xl font-bold text-yellow-400 mb-4">0.5 π</div>
                            <ul className="text-left mb-6 space-y-2 text-gray-300">
                                <li>✅ Tüm sensörler</li>
                                <li>✅ AI analiz</li>
                                <li>✅ 30 gün veri saklama</li>
                                <li>✅ Mobil uygulama</li>
                            </ul>
                            <button 
                                onClick={() => buyProduct(0.5, 'Profesyonel')}
                                disabled={!isConnected || isLoading}
                                className="w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Satın Al
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 text-center">
                            <h3 className="text-xl font-bold mb-4 text-white">Kurumsal</h3>
                            <div className="text-3xl font-bold text-yellow-400 mb-4">1.0 π</div>
                            <ul className="text-left mb-6 space-y-2 text-gray-300">
                                <li>✅ Her şey dahil</li>
                                <li>✅ Sınırsız veri</li>
                                <li>✅ API erişimi</li>
                                <li>✅ 7/24 destek</li>
                            </ul>
                            <button 
                                onClick={() => buyProduct(1.0, 'Kurumsal')}
                                disabled={!isConnected || isLoading}
                                className="w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Satın Al
                            </button>
                        </div>
                    </div>
                </section>

                {/* Status Display */}
                {statusMessage && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 mb-6 text-center">
                        <p className="text-white">{statusMessage}</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 mt-12">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-gray-300">
                        <p>&copy; 2024 AgroPi Marketplace. Tüm hakları saklıdır.</p>
                        <p className="text-sm mt-2">AI destekli topraksız tarım çözümleri</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
