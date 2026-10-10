import { useEffect, useState } from 'react';
import BarChartOne from '../components/chart/BarChartOne';
import LineChartOne from '../components/chart/LineChartOne';
import MainLayout from '../components/layout/MainLayout';
import {
  DashboardRounded,
  People,
  AdminPanelSettings,
  Article,
  Movie,
  Person,
  Block,
} from '@mui/icons-material';
import axiosInstance from '../services/axios.config';
import { useWebSocket } from '../socket/WebSocketProvider';

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



  const statCards = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: People,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Moderators',
      value: totalModerators,
      icon: AdminPanelSettings,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total Posts',
      value: totalPosts,
      icon: Article,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Total Reels',
      value: totalReels,
      icon: Movie,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
    },
    {
      label: 'Active Users',
      value: totalActiveUsers,
      icon: Person,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Banned Users',
      value: totalBannedUsers,
      icon: Block,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ];

  return (
    <MainLayout>
      <div className="mx-auto flex min-h-screen w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-5xl justify-center p-4">
          <div className="hide-scrollbar my-0 flex w-full flex-col items-center overflow-y-auto rounded-xl border border-border bg-card px-4 py-8 shadow-sm sm:px-8 md:my-4">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                <DashboardRounded fontSize="large" />
              </div>
              <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Admin Dashboard
              </h2>
              <p className="mt-2 text-center text-lg text-muted-foreground">
                Get insights on user activity and engagement trends.
              </p>
            </div>

            <div className="mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {statCards.map((item, index) => (
                <div
                  key={index}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">{item.label}</h3>
                    <div className={`rounded-md p-2 ${item.bg}`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col gap-8">
              {/* User Growth Chart */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      User Growth
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Platform user acquisition trends
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-md border border-border bg-muted/50 p-1">
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeUserGrowthTimeType === 'day' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setChartTypeUserGrowthTimeType('day')}
                      >
                        Day
                      </button>
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeUserGrowthTimeType === 'month' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setChartTypeUserGrowthTimeType('month')}
                      >
                        Month
                      </button>
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeUserGrowthTimeType === 'year' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setChartTypeUserGrowthTimeType('year')}
                      >
                        Year
                      </button>
                    </div>

                    <div className="flex items-center rounded-md border border-border bg-muted/50 p-1">
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeUserGrowth === 'bar' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setChartTypeUserGrowth('bar')}
                      >
                        Bar
                      </button>
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeUserGrowth === 'line' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setChartTypeUserGrowth('line')}
                      >
                        Line
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  {chartTypeUserGrowth === 'bar' ? (
                    <BarChartOne name="Users" fileName="UserGrowth" seriesData={userGrowthData} />
                  ) : (
                    <LineChartOne name="Users" fileName="UserGrowth" seriesData={userGrowthData} />
                  )}
                </div>
              </div>

              {/* Content Engagement Chart */}
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      Content Engagement
                    </h3>
                    <p className="text-sm text-muted-foreground">Overall interactions over time</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-md border border-border bg-muted/50 p-1">
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeEngagementGrowthTimeType === 'day' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setchartTypeEngagementGrowthTimeType('day')}
                      >
                        Day
                      </button>
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeEngagementGrowthTimeType === 'month' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setchartTypeEngagementGrowthTimeType('month')}
                      >
                        Month
                      </button>
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeEngagementGrowthTimeType === 'year' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setchartTypeEngagementGrowthTimeType('year')}
                      >
                        Year
                      </button>
                    </div>

                    <div className="flex items-center rounded-md border border-border bg-muted/50 p-1">
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeEngagementGrowth === 'bar' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setchartTypeEngagementGrowth('bar')}
                      >
                        Bar
                      </button>
                      <button
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${chartTypeEngagementGrowth === 'line' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        onClick={() => setchartTypeEngagementGrowth('line')}
                      >
                        Line
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
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
      </div>
    </MainLayout>
  );
}
