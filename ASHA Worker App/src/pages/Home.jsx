import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { db } from '../db/localDB';
import {
  Scan, Users, Pill, RefreshCw, CheckCircle,
  ArrowUpRight, ArrowDownRight, Activity, Calendar, Clock, AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function Home() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { pendingCount, isSyncing, triggerSync } = useSync();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    screenedToday: 0,
    highRisk: 0,
    totalPatients: 0,
    screendTodayTrend: 'up', // mock trend
    highRiskTrend: 'down'
  });

  const [chartData, setChartData] = useState([]);
  const [upcomingAppts, setUpcomingAppts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time-based greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadDashboardData = async () => {
    try {
      // 1. Screened today
      const todayStr = new Date().toISOString().split('T')[0];
      const todayScreenings = await db.screenings
        .filter(s => s.date.startsWith(todayStr))
        .count();

      // 2. High risk count
      const highRiskCount = await db.patients
        .where('currentRiskLevel')
        .equals('RED')
        .count();

      // 3. Total registered patients
      const totalCount = await db.patients.count();

      setStats({
        screenedToday: todayScreenings,
        highRisk: highRiskCount,
        totalPatients: totalCount,
        screendTodayTrend: todayScreenings > 1 ? 'up' : 'down',
        highRiskTrend: highRiskCount > 2 ? 'up' : 'down'
      });

      // 4. Load 7 days chart data
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        last7Days.push({
          dateStr,
          label: d.toLocaleDateString(undefined, { weekday: 'short' }),
          count: 0
        });
      }

      const allScreenings = await db.screenings.toArray();
      allScreenings.forEach(s => {
        const sDate = s.date.split('T')[0];
        const dayObj = last7Days.find(d => d.dateStr === sDate);
        if (dayObj) {
          dayObj.count++;
        }
      });
      setChartData(last7Days.map(d => ({ name: d.label, Screenings: d.count })));

      // 5. Fetch upcoming checkups (flow timeline)
      const ptsWithAppt = await db.patients
        .filter(p => !!p.nextApptDate)
        .toArray();
      const sortedPts = ptsWithAppt
        .sort((a, b) => new Date(a.nextApptDate) - new Date(b.nextApptDate))
        .slice(0, 3);
      setUpcomingAppts(sortedPts);

      // 6. Fetch recent activity (last 3 screenings)
      const recentScr = await db.screenings
        .orderBy('date')
        .reverse()
        .limit(3)
        .toArray();

      const activities = await Promise.all(recentScr.map(async (s) => {
        const pat = await db.patients.where('uid').equals(s.uid).first();
        return {
          id: s.id,
          patientName: pat ? pat.name : 'Unknown Patient',
          risk: s.overallRisk,
          time: new Date(s.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        };
      }));
      setRecentActivity(activities);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(loadDashboardData, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 animate-slide-in">

      {/* 1. TOP HERO GREETING BANNER */}
      <div className="bg-gradient-to-r from-primary-teal to-[#3ea393] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all">
        <div>
          <span className="text-[9px] text-teal-100 font-extrabold uppercase tracking-widest block opacity-90">
            {getGreeting()} 🌅
          </span>
          <h2 className="text-lg font-black tracking-tight mt-0.5 text-white truncate max-w-[240px]">
            Namaste, {profile?.name || 'ASHA Worker'}
          </h2>
          <span className="text-[10px] text-teal-50/80 font-medium block mt-0.5 truncate max-w-[240px]">
            📍 Subcentre: {profile?.subcentre || 'Rural Health Subcentre'}
          </span>
        </div>

        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-base text-white backdrop-blur shadow-inner shrink-0">
          {profile?.name?.charAt(0) || 'A'}
        </div>
      </div>

      {/* 2. STATS & SUMMARY DASHBOARD */}
      <div className="flex flex-col gap-3">
        {/* Hero Stat: Screened Today */}
        <div className="glass-panel bg-[#2D7A6E] text-white p-5 rounded-2xl relative overflow-hidden group border-0 shadow-md">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-teal-100 font-extrabold uppercase tracking-widest">
                Screened Today
              </span>
              <span className="text-3xl font-black mt-1.5 tracking-tight">
                {stats.screenedToday}
              </span>
              <p className="text-[9px] text-teal-50 mt-1.5 font-bold flex items-center gap-1">
                {stats.screendTodayTrend === 'up' ? '📈 Active Screening Day' : '📉 Screenings Pending'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center backdrop-blur shadow-inner shrink-0">
              <Activity size={24} />
            </div>
          </div>
        </div>

        {/* Mini Stats row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Stat 1: Total Patients */}
          <div className="glass-panel bg-bg-card border-border-color p-3 rounded-xl flex items-center justify-between gap-2 relative overflow-hidden group">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-text-secondary font-black uppercase tracking-wider truncate">Total Index</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{stats.totalPatients}</span>
              <span className="text-[8px] text-primary-teal font-bold mt-0.5 truncate">Registered</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary-teal/10 text-primary-teal flex items-center justify-center shrink-0">
              <Users size={14} />
            </div>
          </div>

          {/* Stat 2: High Risk Alerts */}
          <div className="glass-panel bg-bg-card border-border-color p-3 rounded-xl flex items-center justify-between gap-2 relative overflow-hidden group">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-text-secondary font-black uppercase tracking-wider truncate text-secondary-coral">High Risk</span>
              <span className="text-lg font-black text-secondary-coral mt-0.5">{stats.highRisk}</span>
              <span className="text-[8px] text-secondary-coral font-bold mt-0.5 truncate">Requires Visit</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-secondary-coral/10 text-secondary-coral flex items-center justify-center shrink-0">
              <AlertTriangle size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SCREENING PERFORMANCE CHART */}
      <div className="glass-panel bg-bg-card border-border-color p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-color pb-2">
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Screening Performance (7-Days)
          </h3>
          <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">
            Local DB
          </span>
        </div>

        <div className="w-full h-[150px] pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D7A6E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2D7A6E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#8ca39f" fontSize={9} tickLine={false} />
              <YAxis stroke="#8ca39f" fontSize={9} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '4px 8px'
                }}
              />
              <Area type="monotone" dataKey="Screenings" stroke="#2D7A6E" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. SYNC STATUS */}
      <div className="glass-panel bg-white border border-border-color p-3.5 flex items-center justify-between gap-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pendingCount > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
            }`}>
            {pendingCount > 0 ? (
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            ) : (
              <CheckCircle size={16} />
            )}
          </div>
          <div>
            <h4 className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Sync Status</h4>
            <p className="text-[10px] text-text-secondary mt-0.5 font-bold leading-relaxed">
              {pendingCount > 0 ? `${pendingCount} screenings pending sync` : 'Synced with Cloud'}
            </p>
          </div>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="py-1.5 px-3 bg-primary-teal text-white rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer hover:bg-primary-teal-hover transition-colors"
          >
            Sync
          </button>
        )}
      </div>

      {/* 5. QUICK ACTIONS */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
          Quick Action Shortcuts
        </h3>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/scan')}
            className="p-3.5 rounded-xl border border-border-color bg-bg-card hover:border-primary-teal flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-sm text-left"
          >
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Scan Health Card</h4>
              <p className="text-[9px] text-text-secondary mt-0.5 leading-normal truncate">Use QR, NFC or manual ID</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary-teal/10 text-primary-teal flex items-center justify-center shrink-0">
              <Scan size={14} />
            </div>
          </button>

          <button
            onClick={() => navigate('/patients')}
            className="p-3.5 rounded-xl border border-border-color bg-bg-card hover:border-primary-teal flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-sm text-left"
          >
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Patient Directory</h4>
              <p className="text-[9px] text-text-secondary mt-0.5 leading-normal truncate">Browse and check records</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={14} />
            </div>
          </button>

          <button
            onClick={() => navigate('/medicine')}
            className="p-3.5 rounded-xl border border-border-color bg-bg-card hover:border-primary-teal flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-sm text-left"
          >
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Distribute Meds</h4>
              <p className="text-[9px] text-text-secondary mt-0.5 leading-normal truncate">Log stock outputs locally</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Pill size={14} />
            </div>
          </button>
        </div>
      </div>

      {/* 6. UPCOMING CHECKUPS */}
      <div className="glass-panel bg-bg-card border-border-color p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border-color pb-1.5 flex items-center gap-1.5">
          <Calendar size={12} className="text-primary-teal" />
          Upcoming checkups
        </h3>

        {upcomingAppts.length === 0 ? (
          <p className="text-xs text-text-muted py-4 text-center italic font-semibold">No checkups scheduled.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {upcomingAppts.map((pat) => {
              let rBg = 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/10';
              if (pat.currentRiskLevel === 'RED') rBg = 'bg-red-500/10 text-red-700 border border-red-500/10';
              else if (pat.currentRiskLevel === 'YELLOW') rBg = 'bg-amber-500/10 text-amber-700 border border-amber-500/10';

              return (
                <div
                  key={pat.id}
                  onClick={() => navigate(`/patient/${pat.uid}`)}
                  className="p-3 bg-bg-secondary/40 border border-border-color rounded-xl flex items-center justify-between text-xs cursor-pointer hover:border-primary-teal transition-all group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <strong className="text-slate-800 dark:text-white block group-hover:text-primary-teal transition-colors font-extrabold truncate">{pat.name}</strong>
                    <span className="text-[9px] text-text-secondary mt-0.5 block font-semibold truncate">UID: {pat.uid} | {pat.village}</span>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="font-extrabold text-slate-700 dark:text-white block">
                      {new Date(pat.nextApptDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`text-[8px] font-black uppercase py-0.5 px-1.5 rounded-full mt-1 ${rBg}`}>
                      {pat.currentRiskLevel || 'GREEN'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. RECENT ACTIVITIES */}
      <div className="glass-panel bg-bg-card border-border-color p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border-color pb-1.5 flex items-center gap-1.5">
          <Clock size={12} className="text-primary-teal" />
          Recent activities
        </h3>

        {recentActivity.length === 0 ? (
          <p className="text-xs text-text-muted py-4 text-center italic font-semibold">No recent logs found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentActivity.map((act) => {
              let badge = 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/10';
              if (act.risk === 'RED') badge = 'bg-red-500/10 text-red-700 border border-red-500/10';
              else if (act.risk === 'YELLOW') badge = 'bg-amber-500/10 text-amber-700 border border-amber-500/10';

              return (
                <div key={act.id} className="flex gap-2.5 text-xs leading-relaxed font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-teal mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-text-secondary font-bold">Screened </span>
                    <strong className="text-slate-800 dark:text-white font-extrabold truncate block">{act.patientName}</strong>
                    <div className="flex items-center gap-2 mt-1 shrink-0">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${badge}`}>
                        {act.risk}
                      </span>
                      <span className="text-[9px] text-text-muted flex items-center gap-0.5 font-bold">
                        {act.date} at {act.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;
