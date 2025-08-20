/**
 * 天气应用
 */
class WeatherApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.currentWeather = {
            location: '北京',
            temperature: 23,
            description: '多云',
            high: 28,
            low: 18,
            icon: '☁️'
        };
        this.forecast = [
            { day: '今天', icon: '☁️', high: 28, low: 18 },
            { day: '明天', icon: '☀️', high: 30, low: 20 },
            { day: '后天', icon: '🌧️', high: 25, low: 16 },
            { day: '周四', icon: '⛅', high: 27, low: 19 },
            { day: '周五', icon: '☀️', high: 29, low: 21 }
        ];
    }

    render() {
        return `
            <div class="weather-app">
                <div class="weather-current">
                    <div class="weather-location">${this.currentWeather.location}</div>
                    <div class="weather-temp">${this.currentWeather.temperature}°</div>
                    <div class="weather-desc">${this.currentWeather.description}</div>
                    <div class="weather-range">最高 ${this.currentWeather.high}° 最低 ${this.currentWeather.low}°</div>
                </div>
                
                <div class="weather-details">
                    <div class="weather-detail-item">
                        <span class="detail-label">体感温度</span>
                        <span class="detail-value">25°</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">湿度</span>
                        <span class="detail-value">65%</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">风速</span>
                        <span class="detail-value">12 km/h</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="detail-label">紫外线</span>
                        <span class="detail-value">中等</span>
                    </div>
                </div>
                
                <div class="weather-forecast">
                    <h4>7天预报</h4>
                    ${this.renderForecast()}
                </div>
            </div>
        `;
    }

    renderForecast() {
        return this.forecast.map(day => `
            <div class="forecast-item">
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-icon">${day.icon}</div>
                <div class="forecast-temp">${day.high}°/${day.low}°</div>
            </div>
        `).join('');
    }

    async init() {
        await super.init();
        this.updateWeatherData();
    }

    updateWeatherData() {
        // 模拟天气数据更新
        const temperatures = [20, 21, 22, 23, 24, 25, 26];
        const descriptions = ['晴朗', '多云', '阴天', '小雨', '阵雨'];
        const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
        
        const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        this.currentWeather.temperature = randomTemp;
        this.currentWeather.description = randomDesc;
        this.currentWeather.icon = randomIcon;
        
        console.log('天气数据已更新');
    }
}