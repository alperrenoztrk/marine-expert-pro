# ⚓ Maritime Calculator - Denizcilik Hesaplayıcısı

> **🚀 Professional maritime calculations app with AI assistant, multilingual support, and Google Cloud integration**

## 🌟 **Features / Özellikler**

### 🧮 **13 Maritime Calculation Categories:**
- ⚖️ **Stability Calculations** - Ship stability analysis
- 🧭 **Navigation** - Course, distance, speed calculations  
- 🌊 **Hydrodynamics** - Resistance, powering, waves
- ⚙️ **Engine Performance** - Power, fuel consumption
- 📦 **Cargo Operations** - Loading, stowage planning
- 💧 **Ballast Management** - Tank calculations
- 📐 **Trim & List** - Ship attitude analysis
- 🏗️ **Structural** - Strength, stress analysis
- 🛡️ **Safety** - Life rafts, fire systems
- 🍃 **Emissions** - Environmental compliance
- 🌤️ **Weather** - Routing, conditions
- 💰 **Economic** - Cost analysis, efficiency
- 🚢 **Special Ships** - Specialized vessel calculations

### 🤖 **AI Assistant:**
- **Gemini AI** explanations
- **Wolfram Alpha** calculations  
- **Hybrid AI system** for accuracy
- **25+ languages** support

### 🌍 **Multilingual Support:**
- **Microsoft Translator API** integration
- **Automatic language detection**
- **25+ supported languages**
- **Real-time translation**

### 🔐 **User Management:**
- **Google OAuth 2.0** authentication
- **Supabase backend** integration
- **Calculation history** tracking
- **Favorites system**
- **User statistics & levels**

### 💰 **Monetization:**
- **Google AdSense** web ads
- **AdMob** mobile ads  
- **Native advertising** system
- **Smart ad placement** algorithm

### 📱 **Mobile-First Design:**
- **Android app** via Capacitor
- **Progressive Web App (PWA)**
- **Responsive design** for all devices
- **Offline calculations** support

## 🚀 **Lovable Deployment**

### **📋 Quick Start:**
```bash
# 1. Clone and install
git clone https://github.com/alperrenoztrk/maritime-calculator-kopya-612fb10a
cd maritime-calculator-kopya-612fb10a
npm install

# 2. Build for Lovable
npm run build

# 3. Deploy to Lovable
# 🔗 URL: https://c91ef2fa-0890-438a-8151-84cda6639f91.lovableproject.com
```

### **🔧 Environment Setup:**
Copy `.env.example` to `.env` and configure:
```env
# 🔐 Required for Lovable deployment
VITE_SUPABASE_URL=https://cpwtwlriwmwgfqgrmfso.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_key
MICROSOFT_TRANSLATOR_KEY=your_translator_key
VITE_FIREBASE_API_KEY=your_firebase_key
```

## 🏗️ **Architecture**

### **🎯 Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + Shadcn/ui components
- **Backend:** Supabase (Auth + Database + Edge Functions)
- **AI:** Gemini AI + Wolfram Alpha
- **Translation:** Microsoft Translator API
- **Mobile:** Capacitor + Android
- **Analytics:** Google Analytics + Firebase
- **Ads:** Google AdSense + AdMob

### **📁 Project Structure:**
```
maritime-calculator/
├── src/
│   ├── components/
│   │   ├── ads/              # Ad components
│   │   ├── auth/             # Authentication
│   │   ├── calculations/     # Maritime calculations
│   │   └── ui/               # UI components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Main pages
│   ├── utils/                # Utilities
│   └── integrations/         # API integrations
├── supabase/
│   └── functions/            # Edge Functions
├── android/                  # Capacitor Android
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔐 **API Integration**

### **🤖 AI Assistant (Supabase Edge Functions):**
```typescript
// Ask AI endpoint
POST /functions/v1/ask-ai
{
  "question": "How to calculate ship stability?",
  "language": "en"
}
```

### **🌍 Translation (Microsoft Translator):**
```typescript
// Translate text
POST /functions/v1/translate
{
  "text": "Hello world",
  "from": "en",
  "to": "tr"
}
```

### **🔐 Authentication (Supabase Auth):**
```typescript
// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback'
  }
})
```

## 📱 **Mobile Development**

### **🔧 Android Build:**
```bash
# Install dependencies
npm run cap:add:firebase

# Sync and build
npm run cap:sync
npm run android:build

# Open in Android Studio
npm run cap:open:android
```

### **📦 Google Play Deployment:**
1. **Generate signed APK/AAB**
2. **Upload to Play Console**
3. **Configure AdMob ads**
4. **Setup Firebase Analytics**

## 💰 **Monetization Strategy**

### **📊 Ad Placement:**
- **Banner ads** on top/bottom
- **Interstitial ads** between calculations
- **Native ads** in content feed
- **Reward ads** for premium features

### **💎 Revenue Streams:**
- **Google AdSense** (web)
- **AdMob** (mobile)
- **Premium subscriptions**
- **Enterprise licensing**

## 🌐 **Internationalization**

### **🗣️ Supported Languages:**
🇹🇷 Turkish | 🇺🇸 English | 🇪🇸 Spanish | 🇩🇪 German | 🇫🇷 French | 🇮🇹 Italian | 🇵🇹 Portuguese | 🇷🇺 Russian | 🇯🇵 Japanese | 🇰🇷 Korean | 🇨🇳 Chinese | 🇸🇦 Arabic | 🇮🇳 Hindi | 🇳🇱 Dutch | 🇸🇪 Swedish | 🇳🇴 Norwegian | 🇩🇰 Danish | 🇫🇮 Finnish | 🇵🇱 Polish | 🇨🇿 Czech | 🇭🇺 Hungarian | 🇷🇴 Romanian | 🇬🇷 Greek | 🇧🇬 Bulgarian | 🇭🇷 Croatian | 🇺🇦 Ukrainian

### **🔄 Auto Translation:**
- **Browser language detection**
- **Real-time content translation**
- **Fallback dictionaries**
- **Context-aware translations**

## 🛡️ **Security & Privacy**

### **🔐 Data Protection:**
- **Row Level Security (RLS)** on Supabase
- **HTTPS everywhere**
- **API key protection**
- **User data encryption**

### **📋 Compliance:**
- **GDPR compliant**
- **Cookie consent**
- **Privacy policy**
- **Terms of service**

## 📈 **Analytics & Performance**

### **📊 Tracking:**
- **User interactions**
- **Calculation usage**
- **Ad performance**
- **Revenue metrics**

### **⚡ Performance:**
- **Code splitting**
- **Lazy loading**
- **Service workers**
- **CDN optimization**

## 🔧 **Development**

### **🛠️ Local Development:**
```bash
# Start dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

### **🧪 Testing:**
```bash
# Run tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 📚 **Documentation**

- **📖 [Firebase Setup](./FIREBASE_SETUP.md)** - Firebase integration guide
- **🔐 [Google Auth Setup](./GOOGLE_AUTH_SETUP.md)** - Authentication setup
- **🌍 [Translation Setup](./TRANSLATION_SETUP.md)** - Microsoft Translator setup
- **💰 [Advertisement Setup](./ADVERTISEMENT_SETUP.md)** - Ad integration guide
- **📱 [Google Play Deployment](./GOOGLE_PLAY_DEPLOYMENT.md)** - Mobile deployment
- **🗄️ [Database Schema](./DATABASE_SCHEMA.sql)** - Database structure

## 🎯 **Roadmap**

### **🚀 Upcoming Features:**
- [ ] **iOS app** development
- [ ] **Offline mode** for calculations
- [ ] **Advanced 3D visualizations**
- [ ] **Real-time collaboration**
- [ ] **API marketplace**
- [ ] **White-label solutions**

### **💡 Enhancement Ideas:**
- [ ] **Voice input** for calculations
- [ ] **AR visualizations** for ship data
- [ ] **ML-powered** predictions
- [ ] **IoT sensor** integration

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Maritime Industry** professionals for requirements
- **Supabase** for backend infrastructure
- **Google Cloud** for AI and translation services
- **Lovable** for deployment platform
- **Open source community** for amazing tools

---

## 📞 **Support & Contact**

- **🌐 Website:** [Maritime Calculator](https://dfc3279a-089d-4d25-bff1-ff197bc24769.lovableproject.com)
- **📧 Email:** support@maritimecalculator.com
- **💬 Discord:** [Join our community](https://discord.gg/maritime-calculator)
- **📱 Mobile App:** [Google Play Store](https://play.google.com/store/apps/details?id=com.maritime.calculator)

---

**⚓ Built with ❤️ for the maritime industry 🌊**
