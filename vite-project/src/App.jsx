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
        setData({ weatherData, error: null });
      } catch (error) {
        setData({ weatherData: null, error: handleError(error) });
      }
    };
    fetchData();
  }, [cityCode]);

  if (data.weatherData) {
    const timeSeries = data.weatherData[0].timeSeries[0].areas[0];

    return (
      <div className="container">
        <h1>天気データ</h1>
        <Tabs>
          <TabList>
            <Tab>今日</Tab>
            <Tab>明日</Tab>
            <Tab>明後日</Tab>
          </TabList>

          <TabPanel>
            <h2>今日の天気</h2>
            <p>{timeSeries.weathers[0]}</p>
          </TabPanel>
          <TabPanel>
            <h2>明日の天気</h2>
            <p>{timeSeries.weathers[1]}</p>
          </TabPanel>
          <TabPanel>
            <h2>明後日の天気</h2>
            <p>{timeSeries.weathers[2]}</p>
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
      <select onChange={handleChange}>
        <option value="130000" selected>東京</option>
        <option value="270000">大阪</option>
        <option value="016000">札幌</option>
      </select>
      <WeatherComponent cityCode={city} />
    </>
  );
}

export default App;
