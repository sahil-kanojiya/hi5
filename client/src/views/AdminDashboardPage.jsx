import { useEffect, useState } from 'react';
import BarChartOne from '../components/chart/BarChartOne';
import LineChartOne from '../components/chart/LineChartOne';
import MainLayout from '../components/layout/MainLayout';
import { DashboardRounded } from '@mui/icons-material';
import axiosInstance from '../services/axios.config';
import { useWebSocket } from '../socket/WebSocketProvider';
import { useSelector } from 'react-redux';

export default function SocialMediaDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalModerators, setTotalModerators] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalReels, setTotalReels] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalBannedUsers, setTotalBannedUsers] = useState(0);

  const [userGrowthDayStats, setUserGrowthDayStats] = useState({ x: [], y: [] });
  const [userGrowthMonthStats, setUserGrowthMonthStats] = useState({ x: [], y: [] });
  const [userGrowthYearStats, setUserGrowthYearStats] = useState({ x: [], y: [] });

  const [contentEngagementGrowthDayStats, setContentEngagementGrowthDayStats] = useState({
    x: [],
    y: [],
  });
  const [contentEngagementGrowthMonthStats, setContentEngagementGrowthMonthStats] = useState({
    x: [],
    y: [],
  });
  const [contentEngagementGrowthYearStats, setContentEngagementGrowthYearStats] = useState({
    x: [],
    y: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get('/analytics');
        const {
          totalUsers,
          totalModerators,
          totalPosts,
          totalReels,
          activeUsers,
          bannedUsers,
          userGrowthDayStatsResponse,
          userGrowthMonthStatsResponse,
          userGrowthYearStatsResponse,
          contentEngagementGrowthDayStatsResponse,
          contentEngagementGrowthMonthStatsResponse,
          contentEngagementGrowthYearStatsResponse,
        } = response.data;
        setTotalUsers(totalUsers);
        setTotalModerators(totalModerators);
        setTotalPosts(totalPosts);
        setTotalReels(totalReels);
        setTotalActiveUsers(activeUsers);
        setTotalBannedUsers(bannedUsers);
        setUserGrowthDayStats(userGrowthDayStatsResponse);
        setUserGrowthMonthStats(userGrowthMonthStatsResponse);
        setUserGrowthYearStats(userGrowthYearStatsResponse);
        setContentEngagementGrowthDayStats(contentEngagementGrowthDayStatsResponse);
        setContentEngagementGrowthMonthStats(contentEngagementGrowthMonthStatsResponse);
        setContentEngagementGrowthYearStats(contentEngagementGrowthYearStatsResponse);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();
  useEffect(() => {
    if (isConnected) {
      let analyticsSubscription;
      try {
        analyticsSubscription = subscribeTopic(`/analytics`, (message) => {
          const msg = JSON.parse(message);
          console.log(msg);
          const {
            totalUsers,
            totalModerators,
            totalPosts,
            totalReels,
            activeUsers,
            bannedUsers,
            userGrowthDayStatsResponse,
            userGrowthMonthStatsResponse,
            userGrowthYearStatsResponse,
            contentEngagementGrowthDayStatsResponse,
            contentEngagementGrowthMonthStatsResponse,
            contentEngagementGrowthYearStatsResponse,
          } = msg;
          setTotalUsers(totalUsers);
          setTotalModerators(totalModerators);
          setTotalPosts(totalPosts);
          setTotalReels(totalReels);
          setTotalActiveUsers(activeUsers);
          setTotalBannedUsers(bannedUsers);
          setUserGrowthDayStats(userGrowthDayStatsResponse);
          setUserGrowthMonthStats(userGrowthMonthStatsResponse);
          setUserGrowthYearStats(userGrowthYearStatsResponse);
          setContentEngagementGrowthDayStats(contentEngagementGrowthDayStatsResponse);
          setContentEngagementGrowthMonthStats(contentEngagementGrowthMonthStatsResponse);
          setContentEngagementGrowthYearStats(contentEngagementGrowthYearStatsResponse);
        });
      } catch (e) {
        console.log('error:' + e);
      }
      return () => {
        unsubscribeTopic(analyticsSubscription);
      };
    }
  }, [isConnected, subscribeTopic, unsubscribeTopic]);

  const [userGrowthData, setUserGrowthData] = useState({ x: [], y: [] });
  const [chartTypeUserGrowth, setChartTypeUserGrowth] = useState('bar');
  const [chartTypeUserGrowthTimeType, setChartTypeUserGrowthTimeType] = useState('day');

  const [engagementGrowthData, setEngagementGrowthData] = useState({ x: [], y: [] });
  const [chartTypeEngagementGrowth, setchartTypeEngagementGrowth] = useState('line');
  const [chartTypeEngagementGrowthTimeType, setchartTypeEngagementGrowthTimeType] = useState('day');

  useEffect(() => {
    if (chartTypeUserGrowthTimeType === 'day') {
      setUserGrowthData(userGrowthDayStats);
    } else if (chartTypeUserGrowthTimeType === 'month') {
      setUserGrowthData(userGrowthMonthStats);
    } else if (chartTypeUserGrowthTimeType === 'year') {
      setUserGrowthData(userGrowthYearStats);
    } else {
      console.log('error undefined time type');
    }
  }, [chartTypeUserGrowthTimeType, userGrowthDayStats, userGrowthMonthStats, userGrowthYearStats]);

  useEffect(() => {
    if (chartTypeEngagementGrowthTimeType === 'day') {
      setEngagementGrowthData(contentEngagementGrowthDayStats);
    } else if (chartTypeEngagementGrowthTimeType === 'month') {
      setEngagementGrowthData(contentEngagementGrowthMonthStats);
    } else if (chartTypeEngagementGrowthTimeType === 'year') {
      setEngagementGrowthData(contentEngagementGrowthYearStats);
    } else {
      console.log('error undefined time type');
    }
  }, [
    chartTypeEngagementGrowthTimeType,
    contentEngagementGrowthDayStats,
    contentEngagementGrowthMonthStats,
    contentEngagementGrowthYearStats,
  ]);

  const mode = useSelector((state) => state.theme.theme);

  return (
    <MainLayout>
      <div className="mx-auto flex h-full w-full justify-center pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-5xl justify-center">
          <div className="hide-scrollbar my-0 flex w-full flex-col items-center overflow-y-auto rounded-lg bg-white px-3 py-10 shadow-md dark:bg-black sm:px-6 md:my-4">
            <div className="flex flex-col items-center">
              <h2 className="mb-6 flex flex-wrap items-center gap-2 rounded-lg bg-gray-200 px-4 py-3 text-xl font-bold text-gray-800 dark:bg-gray-800 dark:text-gray-200 sm:text-2xl md:text-4xl">
                <DashboardRounded sx={{ fontSize: { xs: 20, sm: 35, md: 40 } }} />
                Admin Dashboard
              </h2>
              <p className="mb-8 text-center text-lg text-gray-600">
                Get insights on user activity and engagement trends.
              </p>
            </div>

            <div className="xs:grid-cols-4 mb-8 grid w-full grid-cols-1 gap-4 rounded-3xl bg-gray-100 p-4 shadow-md dark:bg-gray-900 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4">
              {[
                { label: 'Total Users', value: totalUsers },
                { label: 'Total Moderators', value: totalModerators },
                { label: 'Total Posts', value: totalPosts },
                { label: 'Total Reels', value: totalReels },
                { label: 'Active Users', value: totalActiveUsers },
                { label: 'Banned Users', value: totalBannedUsers },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex transform flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-500 p-6 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <h3 className="mb-2 text-center text-xl font-semibold text-gray-700">
                    {item.label}
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col gap-3 sm:gap-6">
              <div className="flex flex-col gap-3 rounded-xl p-2 shadow-md hover:shadow-lg sm:p-4">
                <div className="flex flex-wrap items-center justify-between">
                  <h3 className="p-2 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    User Growth
                  </h3>

                  <div className="flex flex-wrap gap-2 p-3 sm:p-0">
                    <div
                      className="bg-blue flex gap-2 rounded-md bg-gray-200 p-1 transition duration-300 dark:bg-gray-800"
                      style={{
                        backgroundColor: mode === 'dark' ? '#121212' : '#F4F4F5',
                      }}
                    >
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeUserGrowthTimeType === 'day' && 'bg-blue-500 text-white'} `}
                        onClick={() => setChartTypeUserGrowthTimeType('day')}
                      >
                        Day
                      </button>
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeUserGrowthTimeType === 'month' && 'bg-blue-500 text-white'} `}
                        onClick={() => setChartTypeUserGrowthTimeType('month')}
                      >
                        Month
                      </button>
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeUserGrowthTimeType === 'year' && 'bg-blue-500 text-white'} `}
                        onClick={() => setChartTypeUserGrowthTimeType('year')}
                      >
                        Year
                      </button>
                    </div>

                    <div
                      className="bg-blue flex gap-2 rounded-md bg-gray-200 p-1 transition duration-300 dark:bg-gray-800"
                      style={{
                        backgroundColor: mode === 'dark' ? '#121212' : '#F4F4F5',
                      }}
                    >
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeUserGrowth === 'bar' && 'bg-blue-500 text-white'} `}
                        onClick={() => setChartTypeUserGrowth('bar')}
                      >
                        Bar Chart
                      </button>
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeUserGrowth === 'line' && 'bg-blue-500 text-white'} `}
                        onClick={() => setChartTypeUserGrowth('line')}
                      >
                        Line Chart
                      </button>
                    </div>
                  </div>
                </div>
                {chartTypeUserGrowth === 'bar' ? (
                  <BarChartOne name="Users" fileName="UserGrowth" seriesData={userGrowthData} />
                ) : (
                  <LineChartOne name="Users" fileName="UserGrowth" seriesData={userGrowthData} />
                )}
              </div>

              <div className="flex flex-col gap-3 rounded-xl p-2 shadow-md hover:shadow-lg sm:p-4">
                <div className="flex flex-wrap items-center justify-between">
                  <h3 className="p-2 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    Content Engagement Growth
                  </h3>

                  <div className="flex flex-wrap gap-2 p-3 sm:p-0">
                    <div
                      className="bg-blue flex gap-2 rounded-md bg-gray-200 p-1 transition duration-300 dark:bg-gray-800"
                      style={{
                        backgroundColor: mode === 'dark' ? '#121212' : '#F4F4F5',
                      }}
                    >
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeEngagementGrowthTimeType === 'day' && 'bg-blue-500 text-white'} `}
                        onClick={() => setchartTypeEngagementGrowthTimeType('day')}
                      >
                        Day
                      </button>
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeEngagementGrowthTimeType === 'month' && 'bg-blue-500 text-white'} `}
                        onClick={() => setchartTypeEngagementGrowthTimeType('month')}
                      >
                        Month
                      </button>
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeEngagementGrowthTimeType === 'year' && 'bg-blue-500 text-white'} `}
                        onClick={() => setchartTypeEngagementGrowthTimeType('year')}
                      >
                        Year
                      </button>
                    </div>

                    <div
                      className="bg-blue flex gap-2 rounded-md bg-gray-200 p-1 transition duration-300 dark:bg-gray-800"
                      style={{
                        backgroundColor: mode === 'dark' ? '#121212' : '#F4F4F5',
                      }}
                    >
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeEngagementGrowth === 'bar' && 'bg-blue-500 text-white'} `}
                        onClick={() => setchartTypeEngagementGrowth('bar')}
                      >
                        Bar Chart
                      </button>
                      <button
                        className={`rounded px-4 py-2 text-sm font-medium transition ${chartTypeEngagementGrowth === 'line' && 'bg-blue-500 text-white'} `}
                        onClick={() => setchartTypeEngagementGrowth('line')}
                      >
                        Line Chart
                      </button>
                    </div>
                  </div>
                </div>
                {chartTypeEngagementGrowth === 'bar' ? (
                  <BarChartOne
                    name="Impressions"
                    fileName="ContentEngagementGrowth"
                    seriesData={engagementGrowthData}
                  />
                ) : (
                  <LineChartOne
                    name="Impressions"
                    fileName="ContentEngagementGrowth"
                    seriesData={engagementGrowthData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
