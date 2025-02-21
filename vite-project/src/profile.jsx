import { useState, useEffect } from 'react';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const WEATHER_API_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/";

const handleError = (error) => {
  console.error("Error:", error);
  return 'データの取得に失敗しました';
};

const fetchWeatherData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
};

const WeatherComponent = ({ cityCode }) => {
  const [data, setData] = useState({ weatherData: null, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchWeatherData(`${WEATHER_API_URL}${cityCode}.json`);
        console.log(weatherData); // データ構造を確認するためにコンソールに出力
        setData({ weatherData, error: null });
      } catch (error) {
        setData({ weatherData: null, error: handleError(error) });
      }
    };
    fetchData();
  }, [cityCode]);

  if (data.weatherData) {
    const timeSeries = data.weatherData[0].timeSeries;

    const getWeatherAndWind = (index) => {
      const area = timeSeries[0].areas[index];
      const wind = timeSeries[1].areas[index];
      console.log(`Area ${index}:`, area); // デバッグ用ログ
      console.log(`Wind ${index}:`, wind); // デバッグ用ログ

      return {
        weather: area.weathers[0], // 'weatherCodes' から 'weathers' へ修正
        windSpeed: wind.winds[0]
      };
    };

    const tokyoWeather = getWeatherAndWind(0);
    const osakaWeather = getWeatherAndWind(1);
    const sapporoWeather = getWeatherAndWind(2);

    return (
      <div className="container">
        <h1>天気データ</h1>
        <Tabs>
          <TabList>
            <Tab>東京</Tab>
            <Tab>大阪</Tab>
            <Tab>札幌</Tab>
          </TabList>

          <TabPanel>
            <h2>東京の天気</h2>
            <p>天気: {tokyoWeather.weather}</p>
            <p>風速: {tokyoWeather.windSpeed} m/s</p>
          </TabPanel>
          <TabPanel>
            <h2>大阪の天気</h2>
            <p>天気: {osakaWeather.weather}</p>
            <p>風速: {osakaWeather.windSpeed} m/s</p>
          </TabPanel>
          <TabPanel>
            <h2>札幌の天気</h2>
            <p>天気: {sapporoWeather.weather}</p>
            <p>風速: {sapporoWeather.windSpeed} m/s</p>
          </TabPanel>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>天気データ</h1>
      {data.error ? (
        <div className="error">{data.error}</div>
      ) : (
        <p>データを読み込んでいます...</p>
      )}
    </div>
  );
};

function App() {
  const [city, setCity] = useState('130000'); // 東京の初期コード
  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <>
      <select value={city} onChange={handleChange}>
        <option value="130000">東京</option>
        <option value="270000">大阪</option>
        <option value="016000">札幌</option>
      </select>
      <WeatherComponent cityCode={city} />
    </>
  );
}

export default App;
