import sun from "../icons/sun.svg";
import cloud from "../icons/cloud.svg";
import rain from "../icons/rain.svg";
import snow from "../icons/snow.svg";
import lightning from "../icons/lightning.svg";

export function getWeatherIcon(weatherCode) {

    if (weatherCode === 0) return sun;

    if (weatherCode === 1 || weatherCode === 2) return cloud;
    if (weatherCode === 3) return cloud;

    if (weatherCode >= 51 && weatherCode <= 67) return rain;
    if (weatherCode >= 80 && weatherCode <= 82) return rain;

    if (weatherCode >= 71 && weatherCode <= 77) return snow;
    if (weatherCode === 85 || weatherCode === 86) return snow;

    if (weatherCode >= 95 && weatherCode <= 99) return lightning;

    return sun;
}