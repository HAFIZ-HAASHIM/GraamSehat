import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../db/localDB';
import { PatientCard } from '../components/PatientCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  ArrowLeft, Search, PlusCircle, 
  Users, ArrowUpDown, XCircle, ChevronDown, Check
} from 'lucide-react';

export function MyPatients() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [matchingSuggestions, setMatchingSuggestions] = useState([]);
  const [riskFilter, setRiskFilter] = useState('ALL'); // 'ALL' | 'GREEN' | 'YELLOW' | 'RED'
  const [sortBy, setSortBy] = useState('lastScreened'); // 'lastScreened' | 'riskLevel' | 'name'
  const [visibleCount, setVisibleCount] = useState(9);

  // Fetch from Dexie
  const loadPatients = async () => {
    try {
      const records = await db.patients.toArray();
      setPatients(records);
    } catch (err) {
      console.error('Failed to load local patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // 250ms search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Autocomplete matching lists
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const matches = patients.filter(p => 
        p.name.toLowerCase().includes(query) || p.uid.includes(query)
      ).slice(0, 5);
      setMatchingSuggestions(matches);
    } else {
      setMatchingSuggestions([]);
    }
  }, [searchQuery, patients]);

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...patients];

    // 1. Search Query (Name, UID, or Village)
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(
        (p) => 
          p.name.toLowerCase().includes(query) || 
          p.uid.includes(query) || 
          p.village.toLowerCase().includes(query)
      );
    }

    // 2. Risk Level Filter
    if (riskFilter !== 'ALL') {
      result = result.filter((p) => (p.currentRiskLevel || 'GREEN') === riskFilter);
    }

    // 3. Sort logic
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      
      if (sortBy === 'riskLevel') {
        const riskWeights = { RED: 3, YELLOW: 2, GREEN: 1 };
        const wA = riskWeights[a.currentRiskLevel] || 1;
        const wB = riskWeights[b.currentRiskLevel] || 1;
        return wB - wA; // Highest risk first
      }

      // Default: lastScreened (newest first)
      const dateA = a.lastScreenedAt ? new Date(a.lastScreenedAt) : new Date(0);
      const dateB = b.lastScreenedAt ? new Date(b.lastScreenedAt) : new Date(0);
      return dateB - dateA;
    });

    setFilteredPatients(result);
    setVisibleCount(9); // Reset paging on filter change
  }, [patients, debouncedQuery, riskFilter, sortBy]);

  const handlePatientSelect = (pat) => {
    navigate(`/patient/${pat.uid}`);
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-bg-primary overflow-hidden animate-slide-in">
      
      {/* Header Row (Teal gradient back banner) */}
      <div className="bg-gradient-to-r from-primary-teal to-[#3ea393] text-white px-5 py-5 rounded-2xl shadow flex items-center justify-between shrink-0 mb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-sm font-black tracking-widest uppercase">{t('patients.title') || 'Patient Index'}</h2>
        </div>

        <button
          onClick={() => navigate('/register')}
          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <PlusCircle size={15} />
          New Profile
        </button>
      </div>

      {/* Main search and filtering panel */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
        
        {/* Search Bar Input Container with Autocomplete */}
        <div className="relative shrink-0 w-full max-w-xl mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, 6-digit ID, or village..."
            className="pl-11 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <XCircle size={16} />
            </button>
          )}

          {/* Autocomplete Dropdown List */}
          {searchQuery.trim() && matchingSuggestions.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-bg-card border border-border-color rounded-2xl shadow-xl z-40 max-h-48 overflow-y-auto p-2">
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider px-2 py-1">
                Suggested Profiles
              </div>
              {matchingSuggestions.map(pat => (
                <button
                  key={pat.id}
                  onClick={() => {
                    setSearchQuery(pat.name);
                    setMatchingSuggestions([]);
                  }}
                  className="w-full text-left p-2.5 hover:bg-bg-secondary text-xs font-semibold rounded-lg truncate text-text-primary flex items-center justify-between"
                >
                  <span>{pat.name}</span>
                  <span className="text-[10px] text-text-secondary font-black">ID: {pat.uid}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters and Sorting control panel */}
        <div className="glass-panel bg-bg-card border border-border-color p-4 flex flex-col gap-4 rounded-2xl shrink-0 max-w-xl mx-auto w-full">
          {/* Risk Level Filter Chips */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
              Filter by Health Risk:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', 'GREEN', 'YELLOW', 'RED'].map((risk) => {
                const isActive = riskFilter === risk;
                let btnStyle = 'border-border-color text-text-secondary bg-bg-secondary hover:bg-bg-secondary/70';
                
                if (isActive) {
                  if (risk === 'ALL') btnStyle = 'bg-primary-teal text-white border-primary-teal font-extrabold shadow-sm';
                  else if (risk === 'GREEN') btnStyle = 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-500 font-extrabold shadow-sm';
                  else if (risk === 'YELLOW') btnStyle = 'bg-amber-600 dark:bg-amber-500 text-white border-amber-500 font-extrabold shadow-sm';
                  else if (risk === 'RED') btnStyle = 'bg-secondary-coral text-white border-secondary-coral font-extrabold shadow-sm';
                }
                
                return (
                  <button
                    key={risk}
                    onClick={() => setRiskFilter(risk)}
                    className={`py-1.5 px-3 rounded-lg text-[9px] font-black border transition-colors shrink-0 uppercase tracking-widest cursor-pointer ${btnStyle}`}
                  >
                    {risk === 'ALL' ? 'All Risks' : risk + ' Risk'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorting picker */}
          <div className="flex items-center gap-3 border-t border-border-color pt-3.5 text-xs font-semibold text-text-secondary">
            <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0">
              <ArrowUpDown size={12} className="text-text-muted" />
              Order By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 bg-bg-card border border-border-color rounded-xl text-text-primary text-xs font-bold w-auto cursor-pointer"
            >
              <option value="lastScreened">Last Checkup Date</option>
              <option value="riskLevel">Risk Severity (High first)</option>
              <option value="name">Patient Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Directory List Area (Initial Loader or Results) */}
        {isLoading ? (
          <div className="w-full max-w-5xl mx-auto px-1 mt-2">
            <SkeletonLoader type="list-item" count={4} />
          </div>
        ) : filteredPatients.length === 0 ? (
          /* Premium Empty State Illustration */
          <div className="text-center py-16 px-6 bg-bg-card rounded-2xl border border-border-color flex flex-col items-center gap-4 shadow-sm max-w-xl mx-auto w-full animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary-teal/10 text-primary-teal flex items-center justify-center animate-pulse">
              <Users size={32} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-text-primary uppercase tracking-wide">
                No Patients Found
              </h4>
              <p className="text-text-secondary text-xs mt-1.5 leading-relaxed font-semibold max-w-[280px]">
                No local profiles match your search criteria. Register a new patient profile or clear your search input.
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setRiskFilter('ALL'); }}
              className="py-2 px-4 rounded-xl bg-bg-secondary hover:bg-bg-secondary/80 border border-border-color text-xs font-bold text-text-primary cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="w-full mx-auto pb-12 px-1">
            <div className="flex flex-col gap-3">
              {filteredPatients.slice(0, visibleCount).map((pat) => (
                <PatientCard
                  key={pat.id}
                  patient={pat}
                  onClick={handlePatientSelect}
                />
              ))}
            </div>

            {/* Pagination Load More trigger */}
            {filteredPatients.length > visibleCount && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="py-3 px-6 rounded-xl bg-primary-teal hover:bg-[#225c53] text-white text-xs font-black uppercase tracking-widest transition-colors shadow-md cursor-pointer active:scale-98"
                >
                  Load More Patients ({filteredPatients.length - visibleCount} Left)
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyPatients;
