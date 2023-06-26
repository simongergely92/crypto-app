import axios from "axios";
import CoinsPercentageBar from "../../components/CoinsTablePercentageBar";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext, useState, useEffect } from "react";
import {
  CoinsPageWrapper,
  HeaderDiv,
  CoinsTableContainer,
  CoinsTable,
  TableHeader,
  NumeroHeader,
  TableHeader2,
  TableHeader3,
  NameHeader,
  TableHeaderRow,
  CoinsRowsContainer,
  TableRow,
  TableData,
  TableData2,
  TableData3,
  CoinName,
  CoinNameInnerDiv,
  CoinLogo,
  CoinNameLink,
  PercentageChangeDiv,
  ChartsWrapper,
  ChartsWrapperInner,
  TopChartHeaderRow,
  TopChartHeader,
  ChartContainer,
  TopChartDiv,
  ArrowUp,
  ArrowDown,
  SmallChartWrapper,
} from "./Coins.styles";
import {
  formatNumber,
  formatDate,
  getRandomColor,
  formatSupply,
  formatVolumeMarketCap,
  getDate,
} from "../../utilities";
import { LineChart, SmallLineChart } from "../../components/LineChart";
import { BarChart } from "../../components/BarChart";
import { CurrencyContext } from "../../contexts/CurrencyContext";

export const Coins = () => {
  const { currency } = useContext(CurrencyContext);
  const [page, setPage] = useState(20);
  const [activeCoins, setActiveCoins] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [coinsData, setCoinsData] = useState([]);
  const [btcCurrentPrice, setBtcCurrentPrice] = useState(0);
  const [btcCurrentVolume, setBtcCurrentVolume] = useState(0);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [chartHours, setChartHours] = useState([]);
  const [btcPricesHourly, setBtcPricesHourly] = useState([]);
  const [btcVolumesHourly, setBtcVolumesHourly] = useState([]);

  const getCoinsData = async () => {
    try {
      const base =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=";
      const search = `&order=market_cap_desc&per_page=${page}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;
      const fullURL = `${base}${currency}${search}`;
      const { data } = await axios(fullURL);
      const globalData = await axios("https://api.coingecko.com/api/v3/global");
      setCoinsData(data);
      setBtcCurrentPrice(data[0].current_price);
      setBtcCurrentVolume(data[0].total_volume);
      setDay(getDate().toString().slice(8, 10));
      setMonth(getDate().toString().slice(4, 7));
      setYear(getDate().toString().slice(11, 15));
      setActiveCoins(globalData.data.data.active_cryptocurrencies);
      if (coinsData.length >= activeCoins) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getChartsData = async () => {
    try {
      const base =
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=";
      const search = "&days=1&interval=hourly";
      const fullURL = `${base}${currency}${search}`;
      const { data } = await axios(fullURL);
      setBtcPricesHourly(data.prices.map((el) => el[1]));
      setBtcVolumesHourly(data.total_volumes.map((el) => el[1]));
      setChartHours(data.prices.map((el) => el[0]));
    } catch (error) {
      console.log(error);
    }
  };
  const increasePage = () => {
    setTimeout(() => {
      setPage(page + 1);
    }, 500);
  };
  const getOneWeekDays = () => {
    let days = [];
    for (let i = 0; i < 8; i++) {
      days.push("");
    }
    return days;
  };
  const getThemeColors = () => {
    const theme = localStorage.getItem("theme");
    return JSON.parse(theme);
  };

  useEffect(() => {
    getCoinsData();
    getChartsData();
  }, [currency, page]);

  const theme = getThemeColors();
  const btcCurrentVolumeFormatted = parseInt(btcCurrentVolume);
  const chartHoursFormatted = chartHours
    .map((el) => formatDate(el))
    .slice(0, 24);
  const btcPricesData = {
    labels: chartHoursFormatted,
    datasets: [
      {
        label: "BTC Price",
        data: btcPricesHourly.slice(0, 24),
        borderColor:
          btcPricesHourly[0] < btcPricesHourly[24]
            ? theme.btcPriceChartBorderColorGain
            : btcPricesHourly[0] > btcPricesHourly[24]
            ? theme.btcPriceChartBorderColorLoss
            : theme.btcPriceChartBorderColorGain,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          btcPricesHourly[0] < btcPricesHourly[24]
            ? gradient.addColorStop(0, theme.btcPriceChartGradienColorGain)
            : btcPricesHourly[0] > btcPricesHourly[24]
            ? gradient.addColorStop(0, theme.btcPriceChartGradienColorLoss)
            : gradient.addColorStop(0, theme.btcPriceChartGradienColorGain);
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
          return gradient;
        },
        pointRadius: 0,
        borderWidth: 3,
        fill: true,
      },
    ],
  };
  const btcVolumesData = {
    labels: chartHoursFormatted,
    datasets: [
      {
        label: "BTC Volume",
        data: btcVolumesHourly.slice(0, 24),
        borderColor: "#e76f51",
        backgroundColor: theme.btcVolumeChartBackgroundColor,
      },
    ],
  };
  return (
    <CoinsPageWrapper>
      <HeaderDiv>
        <h2>Overview</h2>
      </HeaderDiv>
      <ChartsWrapper>
        <TopChartHeaderRow>
          <TopChartHeader>
            <h3>BTC</h3>
            <h2>{formatNumber(btcCurrentPrice)}</h2>
            <h3>
              {day} {month},{year}
            </h3>
          </TopChartHeader>
          <TopChartHeader>
            <h3>Volume 24h</h3>
            <h2>{formatVolumeMarketCap(btcCurrentVolumeFormatted)}</h2>
            <h3>
              {day} {month},{year}
            </h3>
          </TopChartHeader>
        </TopChartHeaderRow>
        <ChartsWrapperInner>
          <ChartContainer>
            <TopChartDiv>
              <LineChart data={btcPricesData} />
            </TopChartDiv>
          </ChartContainer>
          <ChartContainer>
            <TopChartDiv>
              <BarChart data={btcVolumesData} />
            </TopChartDiv>
          </ChartContainer>
        </ChartsWrapperInner>
      </ChartsWrapper>
      <HeaderDiv>
        <h2>TOP 50 by Market Cap</h2>
      </HeaderDiv>
      <CoinsTableContainer>
        <CoinsTable>
          <TableHeaderRow>
            <NumeroHeader>#</NumeroHeader>
            <NameHeader>Name</NameHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>1h%</TableHeader>
            <TableHeader>24h%</TableHeader>
            <TableHeader>7d%</TableHeader>
            <TableHeader2>24h Volume/Market Cap</TableHeader2>
            <TableHeader2>Circulating/Total Supply</TableHeader2>
            <TableHeader3>Last 7d</TableHeader3>
          </TableHeaderRow>
          <CoinsRowsContainer>
            <InfiniteScroll
              dataLength={coinsData.length}
              next={increasePage}
              hasMore={hasMore}
              loader={<h3>Loading...</h3>}
              endMessage={<p>No more coins left</p>}
            >
              {coinsData.map((obj, index) => {
                const percentageChange1h =
                  obj.price_change_percentage_1h_in_currency.toFixed(2);
                const percentageChange24h =
                  obj.price_change_percentage_24h.toFixed(2);
                const percentageChange7d =
                  obj.price_change_percentage_7d_in_currency.toFixed(2);
                const percentageVolume24h = (
                  (obj.total_volume / obj.market_cap) *
                  100
                ).toFixed(2);
                const percentageCirculating = (
                  (obj.circulating_supply / obj.total_supply) *
                  100
                ).toFixed(2);
                const circulatingSupply = formatSupply(obj.circulating_supply);
                const totalSupply = formatSupply(obj.total_supply);
                const totalVolume = formatVolumeMarketCap(
                  obj.total_volume,
                  currency
                );
                const marketCap = formatVolumeMarketCap(
                  obj.market_cap,
                  currency
                );
                let color1 = getRandomColor();
                let color2 = theme.coinsPercentageBarColor;
                const sparklineData = [
                  obj.sparkline_in_7d.price[0],
                  obj.sparkline_in_7d.price[24],
                  obj.sparkline_in_7d.price[48],
                  obj.sparkline_in_7d.price[72],
                  obj.sparkline_in_7d.price[96],
                  obj.sparkline_in_7d.price[120],
                  obj.sparkline_in_7d.price[144],
                  obj.sparkline_in_7d.price[167],
                ];
                const coinPricesData = {
                  labels: getOneWeekDays(),
                  datasets: [
                    {
                      label: "",
                      data: sparklineData,
                      borderColor:
                        sparklineData[0] < sparklineData[7] ? "#00FF5F" : "red",
                      pointRadius: 0,
                      borderWidth: 3,
                    },
                  ],
                };
                return (
                  <TableRow key={obj.name}>
                    <NumeroHeader>{index + 1}</NumeroHeader>
                    <CoinName>
                      <CoinNameInnerDiv>
                        <CoinLogo src={obj.image} />
                        <CoinNameLink
                          name={obj.name}
                          key={obj.name}
                          to={`/coin/${obj.name.toLowerCase()}`}
                        >
                          {obj.name} ({obj.symbol.toUpperCase()})
                        </CoinNameLink>
                      </CoinNameInnerDiv>
                    </CoinName>
                    <TableData>{formatNumber(obj.current_price)}</TableData>
                    <TableData
                      style={{
                        color: percentageChange1h > 0 ? "#00FC2A" : "#FE1040",
                      }}
                    >
                      <PercentageChangeDiv>
                        {percentageChange1h > 0 ? <ArrowUp /> : <ArrowDown />}
                        {percentageChange1h}%
                      </PercentageChangeDiv>
                    </TableData>
                    <TableData
                      style={{
                        color: percentageChange24h > 0 ? "#00FC2A" : "#FE1040",
                      }}
                    >
                      <PercentageChangeDiv>
                        {percentageChange24h > 0 ? <ArrowUp /> : <ArrowDown />}
                        {percentageChange24h}%
                      </PercentageChangeDiv>
                    </TableData>
                    <TableData
                      style={{
                        color: percentageChange7d > 0 ? "#00FC2A" : "#FE1040",
                      }}
                    >
                      <PercentageChangeDiv>
                        {percentageChange7d > 0 ? <ArrowUp /> : <ArrowDown />}
                        {percentageChange7d}%
                      </PercentageChangeDiv>
                    </TableData>
                    <TableData2>
                      <CoinsPercentageBar
                        num1={totalVolume}
                        num2={marketCap}
                        width={percentageVolume24h.toString() + "%"}
                        color1={color1}
                        color2={color2}
                        background1={color1}
                        background2={color2}
                      />
                    </TableData2>
                    <TableData2>
                      <CoinsPercentageBar
                        num1={circulatingSupply}
                        num2={totalSupply}
                        width={percentageCirculating.toString() + "%"}
                        color1={color1}
                        color2={color2}
                        background1={color1}
                        background2={color2}
                      />
                    </TableData2>
                    <TableData3>
                      <SmallChartWrapper>
                        <SmallLineChart data={coinPricesData} />
                      </SmallChartWrapper>
                    </TableData3>
                  </TableRow>
                );
              })}
            </InfiniteScroll>
          </CoinsRowsContainer>
        </CoinsTable>
      </CoinsTableContainer>
    </CoinsPageWrapper>
  );
};
