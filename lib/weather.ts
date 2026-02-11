export async function getWeatherData(lat: number, lng: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
  const response = await fetch(url, { next: { revalidate: 3600 } })
  const data = await response.json()

  return {
    temperature: data.main.temp as number,
    humidity: data.main.humidity as number,
    rainfall: ((data.rain?.['1h'] ?? 0) * 30) as number,
  }
}
