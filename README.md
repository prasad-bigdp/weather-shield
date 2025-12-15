# San Jose Environmental Dashboard MVP

![San Jose Environmental Dashboard](https://img.shields.io/badge/Status-MVP-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)

Real-time environmental monitoring dashboard for San Jose with smart outdoor activity recommendations.

## 🌟 Features

### Dashboard Tab
- **6 Environmental Metrics** with color-coded cards:
  - Air Quality Index (AQI)
  - PM2.5 (Fine particles)
  - Temperature & Feels Like
  - Humidity
  - UV Index
  - Pollen Level
- **Top 3 Park Recommendations** based on real-time air quality
- **Smart Exercise Time** recommendations

### Charts Tab
- **PM2.5 Trend** - Last 12 hours with live updates
- **AQI 24-Hour Forecast** - Color-coded by safety levels
- Smooth animations and interactive tooltips

### Alerts Tab
- **Three Alert Scenarios**:
  - ✅ Normal (All clear)
  - ⚠️ Pollen Alert (Orange background)
  - 🔥 Wildfire Alert (Full-screen RED)
- Demo controls to test all scenarios
- Alert history tracking

### Profile Tab
- Guest mode with account benefits
- Future: Save preferences, custom alerts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎨 Design Highlights

- **Premium Aesthetics**: Glassmorphism, gradients, smooth animations
- **Color Psychology**: AQI-based color coding (green=safe, red=danger)
- **Responsive**: Mobile-first design, works on all devices
- **Accessibility**: Semantic HTML, proper contrast ratios

## 🔌 API Integration

### Open-Meteo API (100% FREE!)
- **No API key required** ✨
- Air quality data (PM2.5, PM10, AQI)
- Weather data (temperature, humidity, UV)
- Pollen forecast
- Global coverage including San Jose

### Endpoints Used
```
Air Quality: https://air-quality-api.open-meteo.com/v1/air-quality
Weather: https://api.open-meteo.com/v1/forecast
```

## 📊 Data Flow

1. **Initial Load**: Fetch current environmental data, trends, and park AQI
2. **Auto-Refresh**: Updates every 5 minutes
3. **Manual Refresh**: Click refresh button anytime
4. **Alert Generation**: Automatic based on AQI thresholds

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/          # Navigation, Header
│   ├── Dashboard/       # Metrics, Parks, Exercise Time
│   ├── Charts/          # PM2.5 & AQI Charts
│   ├── Alerts/          # Alert Display, History, Demo
│   └── Profile/         # User Profile (Guest Mode)
├── services/            # Open-Meteo API integration
├── store/               # Zustand state management
├── utils/               # AQI calculations, formatters
├── data/                # San Jose parks database
├── types/               # TypeScript definitions
└── App.tsx              # Main application
```

## 🎯 AQI Color Coding

| AQI Range | Category | Color | Meaning |
|-----------|----------|-------|---------|
| 0-50 | Good | 🟢 Green | Safe for everyone |
| 51-100 | Moderate | 🟡 Yellow | Generally safe |
| 101-150 | Sensitive | 🟠 Orange | Sensitive groups affected |
| 151-200 | Unhealthy | 🔴 Red | Everyone affected |
| 201-300 | Very Unhealthy | 🟣 Purple | Health alert |
| 301+ | Hazardous | 🔴 Maroon | Emergency conditions |

## 🏞️ San Jose Parks Database

12 real parks with coordinates:
- Guadalupe River Trail
- Almaden Quicksilver Park
- Kelley Park
- Communications Hill Park
- Los Gatos Creek Trail
- Alum Rock Park
- Hellyer County Park
- Coyote Creek Trail
- Overfelt Gardens
- Penitencia Creek Park
- Martial Cottle Park
- Lake Cunningham Park

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + Custom CSS
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios
- **Dates**: date-fns

## 📦 Build for Production

```bash
npm run build
```

Output in `dist/` folder, ready for deployment to:
- Vercel
- Netlify
- Firebase Hosting
- Any static hosting service

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🎨 Customization

### Change Location
Edit `src/services/openMeteoService.ts`:
```typescript
const SAN_JOSE_LAT = 37.3382;  // Your latitude
const SAN_JOSE_LON = -121.8863; // Your longitude
```

### Add More Parks
Edit `src/data/parks.ts` and add your parks with coordinates.

### Customize Colors
Edit `tailwind.config.js` and `src/index.css`.

## 📝 License

MIT License - Feel free to use for any purpose!

## 🙏 Credits

- **Air Quality Data**: [Open-Meteo](https://open-meteo.com)
- **Icons**: [Lucide Icons](https://lucide.dev)
- **Design Inspiration**: Modern environmental dashboards

## 🐛 Known Issues

- Pollen data is currently simulated (Open-Meteo has limited pollen coverage)
- Profile tab is placeholder (no backend authentication)

## 🔮 Future Enhancements

- [ ] User authentication (Firebase Auth)
- [ ] Save user preferences
- [ ] Email/SMS alerts
- [ ] Historical data comparison
- [ ] Multiple city support
- [ ] Air quality predictions (ML)
- [ ] Share park recommendations

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for San Jose residents**

Stay safe, breathe easy! 🌬️
