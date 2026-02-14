import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Search, X, PlusCircle, MapPin, Filter, Star, Eye, Phone, LayoutDashboard,
  CheckCircle2, Trash2, ImageIcon, RefreshCcw, ChevronLeft, Menu,
  Edit2, MessageSquare, ArrowUpRight, ShieldCheck, UserIcon,
  LogOut, Send, ArrowLeft, Bell, AlertTriangle, Zap, XCircle, Loader2, Rocket, Heart,
  ChevronRight as ChevronRightIcon, StarHalf, MessageCircle, SlidersHorizontal, Camera,
  Instagram, Facebook, Trash, Settings2, Info, Calendar, UserCheck, ChevronRight, Share2, Award, SearchX,
  Plus, ChevronDown, Check, Upload
} from 'lucide-react';

import { 
  User, Ad, AdStatus, FuelType, CarDetails, MotorcycleDetails, MotorcycleType,
  TransmissionType, DriveType, BodyType, Message, Conversation,
  Notification, SecurityEvent, Rating
} from './types';
import { 
  DEMO_ADS as INITIAL_ADS, CATEGORIES, 
  LOCATIONS, INITIAL_NOTIFICATIONS, MOTO_CATALOG, VEHICLE_FIELDS_CONFIG, STANJE_OPTIONS
} from './constants';
import { AUTOMOTIVE_CATALOG } from './automotiveCatalog';

const API_BASE = "/api";

// Define default filters used for marketplace search and filtering
const DEFAULT_FILTERS = {
  lokacija: '',
  priceMin: '',
  priceMax: '',
  marka: '',
  model: '',
  yearMin: '',
  yearMax: '',
  mileageMin: '',
  mileageMax: '',
  gorivo: '',
  mjenjac: '',
  karoserija: '',
  pogon: '',
  stanje: '',
  kubikazaMin: '',
  kubikazaMax: '',
  snagaMin: '',
  snagaMax: '',
  tip: ''
};

const timeAgo = (date: number) => {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return 'Upravo sada';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `pre ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `pre ${hours}h`;
  return new Date(date).toLocaleDateString();
};

const LogoSymbol = ({ type = 1, className = "w-8 h-8 sm:w-10 sm:h-10" }: { type?: 1 | 2 | 3, className?: string }) => {
  if (type === 1) {
    return (
      <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="20" r="9" stroke="#4F6DFF" strokeWidth="2.5" />
        <circle cx="25" cy="20" r="9" stroke="#7C8CFF" strokeWidth="2.5" />
        <path d="M20 13.5C21.5 15.2 22.4 17.5 22.4 20C22.4 22.5 21.5 24.8 20 26.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
};

const Logo = ({ variant = 'horizontal' }: { variant?: 'horizontal' | 'vertical' }) => {
  if (variant === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-2">
        <LogoSymbol type={1} className="w-12 h-12" />
        <div className="text-center">
          <div className="text-2xl font-bold tracking-tighter text-[#F3F4F6]">Poveži.ME</div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#9CA3AF] mt-0.5">Premium Marketplace</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 group">
      <LogoSymbol type={1} />
      <div className="flex flex-col justify-center">
        <div className="text-lg sm:text-xl font-bold tracking-tighter text-[#F3F4F6] leading-none mb-1">Poveži.ME</div>
        <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-[#9CA3AF] leading-none">Premium Marketplace</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user-0', ime: 'Marko Marković', email: 'marko@Poveži.ME', telefon: '+38267000000',
    datumRegistracije: Date.now() - 31536000000, omiljeniOglasi: [], role: 'admin'
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [ratings, setRatings] = useState<Rating[]>([]);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/ads`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((a: any) => ({
            ...a,
            slike: a.images?.map((img: any) => img.url) || a.slike || [],
            createdAt: new Date(a.createdAt).getTime(),
            cijena: Number(a.cijena),
            potkategorija: a.potkategorija || 'Basic',
            kontaktIme: a.vlasnik?.ime || 'Prodavac',
            kontaktTelefon: a.vlasnik?.telefon || '',
            glavnaSlikaIndex: 0,
            pogledi: a.pogledi || 0
          }));
          setAds(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFavorites(currentUser.omiljeniOglasi);
    }
  }, [currentUser?.id]);

  const toggleFavorite = (adId: string) => {
    if (!currentUser) { window.location.hash = '#/prijava'; return; }
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;
    
    const isAdding = !favorites.includes(adId);
    const newFavorites = isAdding ? [...favorites, adId] : favorites.filter(id => id !== adId);
    
    if (isAdding && currentUser.id !== ad.vlasnikId) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        korisnikId: ad.vlasnikId,
        tip: 'listing_liked',
        naslov: 'Oglas sačuvan',
        poruka: `${currentUser.ime} je sačuvao vaš oglas: ${ad.naslov}`,
        link: `/oglas/${ad.slug}`,
        procitano: false,
        createdAt: Date.now()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    setFavorites(newFavorites);
    setCurrentUser({ ...currentUser, omiljeniOglasi: newFavorites });
  };

  const addRating = (sellerId: string, score: number) => {
    if (!currentUser) return;
    const newRating: Rating = {
      id: `r-${Date.now()}`, sellerId, buyerId: currentUser.id, score, createdAt: Date.now()
    };
    setRatings(prev => [...prev.filter(r => !(r.sellerId === sellerId && r.buyerId === currentUser.id)), newRating]);
  };

  const getSellerMetrics = (sellerId: string) => {
    const sellerRatings = ratings.filter(r => r.sellerId === sellerId);
    const avg = sellerRatings.length > 0 
      ? sellerRatings.reduce((sum, r) => sum + r.score, 0) / sellerRatings.length 
      : 5.0;
    return { avg: avg.toFixed(1), count: sellerRatings.length };
  };

  return (
    <Router>
      <div className="min-h-[100dvh] flex flex-col bg-[#0B1220] text-slate-200 overflow-x-hidden font-inter">
        <Header user={currentUser} notifications={notifications} favoritesCount={favorites.length} />
        <main className="flex-grow pt-16 lg:pt-24 pb-20 lg:pb-0">
          <Routes>
            <Route path="/" element={<Marketplace ads={ads} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/marketplace" element={<Marketplace ads={ads} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/kategorija/:categorySlug" element={<Marketplace ads={ads} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/oglas/:slug" element={<AdDetail ads={ads} user={currentUser} onToggleFavorite={toggleFavorite} favorites={favorites} ratings={ratings} onAddRating={addRating} getSellerMetrics={getSellerMetrics} />} />
            <Route path="/prodavac/:userId" element={<PublicProfile ads={ads} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/poruke" element={<Chat user={currentUser} ads={ads} conversations={conversations} setConversations={setConversations} messages={messages} setMessages={setMessages} setNotifications={setNotifications} />} />
            <Route path="/obavjestenja" element={<Notifications notifications={notifications} setNotifications={setNotifications} />} />
            <Route path="/prijava" element={<Auth onLogin={setCurrentUser} />} />
            <Route path="/moji-oglasi" element={<MyAds ads={ads} user={currentUser} />} />
            <Route path="/moji-favoriti" element={<MyFavorites ads={ads} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/objavi" element={<AddAd user={currentUser} onAddAd={(ad) => setAds([ad, ...ads])} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-[rgba(255,255,255,0.08)] z-[1000] px-2 py-2 flex justify-around items-end pb-safe shadow-2xl">
          <NavLink to="/" icon={<Search className="w-5 h-5" />} label="Traži" />
          <NavLink to="/poruke" icon={<MessageCircle className="w-5 h-5" />} label="Poruke" />
          <Link to="/objavi" className="w-14 h-14 bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] rounded-full flex items-center justify-center -translate-y-4 shadow-[0_0_20px_rgba(79,109,255,0.6)] border-4 border-[#0B1220] active:scale-90 transition-transform">
            <PlusCircle className="w-7 h-7 text-white" />
          </Link>
          <NavLink to="/moji-favoriti" icon={<Heart className="w-5 h-5" />} label="Sačuvano" />
          <NavLink to="/moji-oglasi" icon={<UserIcon className="w-5 h-5" />} label="Profil" />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

const Header: React.FC<{ user: User | null, notifications: Notification[], favoritesCount: number }> = ({ user, notifications, favoritesCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const unreadCount = notifications.filter(n => !n.procitano).length;

  useEffect(() => { setSearchValue(searchParams.get('q') || ""); }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) navigate(`/marketplace?q=${encodeURIComponent(searchValue.trim())}`);
    else navigate('/marketplace');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0B1220] lg:bg-[#0f172a]/95 lg:backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] z-[1000] h-16 lg:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        <Link to="/"><Logo /></Link>
        <div className="flex-grow max-w-xl mx-4 lg:mx-8">
           <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 h-4 text-slate-500" />
                <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Pretraži..." className="w-full h-10 lg:h-12 bg-slate-900 border border-slate-800 rounded-xl pl-10 lg:pl-12 pr-4 text-xs lg:text-sm focus:border-indigo-500 outline-none" />
              </div>
              <button type="submit" className="hidden sm:block h-10 lg:h-12 px-4 lg:px-6 bg-[#4F6DFF] text-white rounded-xl font-bold text-[10px] lg:text-xs uppercase hover:bg-[#3D56D6] transition-colors shadow-lg shadow-[#4F6DFF]/10">Pretraži</button>
           </form>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <Link to="/objavi" className="hidden lg:flex h-11 bg-indigo-600 text-white px-5 rounded-xl items-center gap-2 font-black uppercase text-[10px]"><PlusCircle className="w-4 h-4" /> Objavi Oglas</Link>
          <Link to="/poruke" className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl hidden lg:block" title="Poruke"><MessageCircle className="w-5 h-5" /></Link>
          <Link to="/moji-favoriti" className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl relative" title="Sačuvano"><Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />{favoritesCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}</Link>
          <Link to="/obavjestenja" className="p-2 relative text-slate-300 hover:bg-slate-800 rounded-xl" title="Obavještenja"><Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-xl bg-[#131C2B] border border-[rgba(255,255,255,0.06)] overflow-hidden transition-all active:scale-95">{user ? <span className="font-bold text-[#7C8CFF] text-[10px] lg:text-xs">{user.ime[0]}</span> : <UserIcon className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />}</button>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-[2000]">
          <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#111827] border-l border-[rgba(255,255,255,0.06)] p-6 shadow-2xl animate-slide-in-right">
            <div className="flex justify-between items-center mb-8"><span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Meni</span><button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-[#162235] rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-2">
              <MenuLink to="/moji-oglasi" icon={<LayoutDashboard className="w-4 h-4" />} label="Moji Oglasi" onClick={() => setMenuOpen(false)} />
              <MenuLink to="/moji-favoriti" icon={<Heart className="w-4 h-4" />} label="Sačuvano" onClick={() => setMenuOpen(false)} />
              <MenuLink to="/poruke" icon={<MessageSquare className="w-4 h-4" />} label="Poruke" onClick={() => setMenuOpen(false)} />
              <div className="h-px bg-[rgba(255,255,255,0.06)] my-4" />
              <button className="w-full flex items-center gap-3 p-3 font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><LogOut className="w-4 h-4" /> Odjavi se</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const MenuLink = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-3 p-3 font-bold text-[#F3F4F6] hover:bg-[#162235] rounded-xl transition-all"><span className="text-[#4F6DFF]">{icon}</span> {label}</Link>
);

const NavLink = ({ to, icon, label, count }: { to: string, icon: React.ReactNode, label: string, count?: number }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 py-1 w-16 transition-colors ${isActive ? 'text-[#4F6DFF]' : 'text-white/50'}`}>
      <div className="relative">{icon}{count ? count > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" /> : null}</div>
      <span className="text-[9px] font-bold uppercase tracking-tight">{label}</span>
    </Link>
  );
};

const Marketplace: React.FC<{ ads: Ad[], favorites: string[], onToggleFavorite: (id: string) => void }> = ({ ads, favorites, onToggleFavorite }) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const filtersFromURL = useMemo(() => {
    const f: any = {};
    Object.keys(DEFAULT_FILTERS).forEach(key => {
      const val = searchParams.get(key);
      f[key] = val || '';
    });
    return f;
  }, [searchParams]);

  const [filters, setFilters] = useState<any>(filtersFromURL);
  const searchQuery = searchParams.get('q') || "";

  const activeCategory = useMemo(() => CATEGORIES.find(c => c.slug === categorySlug) || null, [categorySlug]);

  useEffect(() => {
    if (activeCategory?.id === 'automobili' || activeCategory?.id === 'motocikli') {
      setIsFilterOpen(true);
    }
  }, [activeCategory?.id]);

  useEffect(() => {
    setFilters(filtersFromURL);
  }, [filtersFromURL]);

  const filtered = useMemo(() => {
    let result = activeCategory ? ads.filter(ad => ad.kategorija === activeCategory.id) : ads;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(ad => ad.naslov.toLowerCase().includes(q) || ad.opis.toLowerCase().includes(q));
    }
    
    if (filters.lokacija) result = result.filter(ad => ad.lokacija === filters.lokacija);
    if (filters.priceMin) result = result.filter(ad => ad.cijena >= Number(filters.priceMin));
    if (filters.priceMax) result = result.filter(ad => ad.cijena <= Number(filters.priceMax));
    
    if (activeCategory?.id === 'automobili') {
      if (filters.marka) result = result.filter(ad => ad.carDetails?.marka === filters.marka);
      if (filters.model) result = result.filter(ad => ad.carDetails?.model === filters.model);
      if (filters.yearMin) result = result.filter(ad => (ad.carDetails?.godiste || 0) >= Number(filters.yearMin));
      if (filters.yearMax) result = result.filter(ad => (ad.carDetails?.godiste || 0) <= Number(filters.yearMax));
      if (filters.mileageMin) result = result.filter(ad => (ad.carDetails?.kilometraza || 0) >= Number(filters.mileageMin));
      if (filters.mileageMax) result = result.filter(ad => (ad.carDetails?.kilometraza || 0) <= Number(filters.mileageMax));
      if (filters.gorivo) result = result.filter(ad => ad.carDetails?.gorivo === filters.gorivo);
      if (filters.mjenjac) result = result.filter(ad => ad.carDetails?.mjenjac === filters.mjenjac);
      if (filters.karoserija) result = result.filter(ad => ad.carDetails?.karoserija === filters.karoserija);
      if (filters.pogon) result = result.filter(ad => ad.carDetails?.pogon === filters.pogon);
      if (filters.stanje) result = result.filter(ad => ad.carDetails?.stanje === filters.stanje);
      if (filters.kubikazaMin) result = result.filter(ad => (ad.carDetails?.kubikaza || 0) >= Number(filters.kubikazaMin));
      if (filters.kubikazaMax) result = result.filter(ad => (ad.carDetails?.kubikaza || 0) <= Number(filters.kubikazaMax));
      if (filters.snagaMin) result = result.filter(ad => (ad.carDetails?.snaga || 0) >= Number(filters.snagaMin));
      if (filters.snagaMax) result = result.filter(ad => (ad.carDetails?.snaga || 0) <= Number(filters.snagaMax));
    }

    if (activeCategory?.id === 'motocikli') {
      if (filters.marka) result = result.filter(ad => ad.motorcycleDetails?.marka === filters.marka);
      if (filters.model) result = result.filter(ad => ad.motorcycleDetails?.model === filters.model);
      if (filters.yearMin) result = result.filter(ad => (ad.motorcycleDetails?.godiste || 0) >= Number(filters.yearMin));
      if (filters.yearMax) result = result.filter(ad => (ad.motorcycleDetails?.godiste || 0) <= Number(filters.yearMax));
      if (filters.mileageMin) result = result.filter(ad => (ad.motorcycleDetails?.kilometraza || 0) >= Number(filters.mileageMin));
      if (filters.mileageMax) result = result.filter(ad => (ad.motorcycleDetails?.kilometraza || 0) <= Number(filters.mileageMax));
      if (filters.gorivo) result = result.filter(ad => ad.motorcycleDetails?.gorivo === filters.gorivo);
      if (filters.mjenjac) result = result.filter(ad => ad.motorcycleDetails?.mjenjac === filters.mjenjac);
      if (filters.tip) result = result.filter(ad => ad.motorcycleDetails?.tip === filters.tip);
      if (filters.stanje) result = result.filter(ad => ad.motorcycleDetails?.stanje === filters.stanje);
      if (filters.kubikazaMin) result = result.filter(ad => (ad.motorcycleDetails?.kubikaza || 0) >= Number(filters.kubikazaMin));
      if (filters.kubikazaMax) result = result.filter(ad => (ad.motorcycleDetails?.kubikaza || 0) <= Number(filters.kubikazaMax));
      if (filters.snagaMin) result = result.filter(ad => (ad.motorcycleDetails?.snagaKW || 0) >= Number(filters.snagaMin));
      if (filters.snagaMax) result = result.filter(ad => (ad.motorcycleDetails?.snagaKW || 0) <= Number(filters.snagaMax));
    }

    const now = Date.now();
    return [...result].sort((a, b) => {
      const aIsPremium = a.isPaid && a.promotionStatus === "active" && a.promotedUntil !== null && a.promotedUntil > now;
      const bIsPremium = b.isPaid && b.promotionStatus === "active" && b.promotedUntil !== null && b.promotedUntil > now;
      
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [ads, activeCategory, searchQuery, filters]);

  const handleApplyFilters = (newFilters: any) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) next.set(key, String(val));
      else next.delete(key);
    });
    setSearchParams(next);
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const next = new URLSearchParams();
    if (searchQuery) next.set('q', searchQuery);
    setSearchParams(next);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2">
        <Link to="/marketplace" className={`flex-shrink-0 px-5 py-2.5 rounded-full font-black uppercase text-[9px] border transition-all ${!activeCategory ? 'bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] border-none text-white shadow-lg shadow-indigo-500/20' : 'bg-[#131C2B] border-[rgba(255,255,255,0.06)] text-[#9CA3AF]'}`}>Sve</Link>
        {CATEGORIES.map(cat => (
          <Link key={cat.id} to={`/kategorija/${cat.slug}`} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-black uppercase text-[9px] border transition-all flex items-center gap-2 ${activeCategory?.id === cat.id ? 'bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] border-none text-white shadow-lg shadow-indigo-500/20' : 'bg-[#131C2B] border-[rgba(255,255,255,0.06)] text-[#9CA3AF]'}`}>{cat.icon} {cat.name}</Link>
        ))}
      </div>

      <div className="px-4">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full lg:w-auto h-12 px-6 bg-[#131C2B] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase text-[#7C8CFF] hover:border-[#4F6DFF] transition-all">
          <Filter className="w-4 h-4" /> Filteri {isFilterOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isFilterOpen && (
          <div className="mt-4 animate-slide-up">
            <FilterPanel category={activeCategory?.id || 'all'} initialFilters={filters} onApply={handleApplyFilters} onReset={handleResetFilters} />
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4 lg:gap-6">
          {filtered.map(ad => (<AdCard key={ad.id} ad={ad} isFavorite={favorites.includes(ad.id)} onToggleFavorite={onToggleFavorite} />))}
        </div>
      ) : (
        <div className="px-4 py-20 flex flex-col items-center justify-center text-center space-y-4">
           <SearchX className="w-16 h-16 text-[#9CA3AF]/20" />
           <p className="text-sm text-[#9CA3AF] uppercase font-black tracking-widest">Nema rezultata za zadate filtere</p>
           <button onClick={handleResetFilters} className="text-[10px] font-black uppercase text-[#4F6DFF] border-b border-[#4F6DFF]">Poništi sve filtere</button>
        </div>
      )}
    </div>
  );
};

const FilterPanel: React.FC<{ category: string, initialFilters: any, onApply: (f: any) => void, onReset: () => void }> = ({ category, initialFilters, onApply, onReset }) => {
  const [localFilters, setLocalFilters] = useState<any>(initialFilters);
  
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const renderField = (key: string, config: any) => {
    if (config.type === 'select') {
      let options = config.options || [];
      if (key === 'marka') {
        options = category === 'automobili' ? AUTOMOTIVE_CATALOG.map(b => b.brand) : Object.keys(MOTO_CATALOG);
      } else if (key === 'model') {
        if (!localFilters.marka) return null;
        if (category === 'automobili') {
          options = AUTOMOTIVE_CATALOG.find(b => b.brand === localFilters.marka)?.models.map(m => m.name) || [];
        } else {
          options = MOTO_CATALOG[localFilters.marka] || [];
        }
      }

      return (
        <div key={key} className="space-y-2">
          <label className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">{config.label}</label>
          <select 
            value={localFilters[key] || ""} 
            onChange={e => setLocalFilters({...localFilters, [key]: e.target.value, ...(key === 'marka' ? {model: ''} : {})})} 
            className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]"
          >
            <option value="">Sve</option>
            {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    if (config.type === 'number') {
      return (
        <div key={key} className="space-y-2">
          <label className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">{config.label}</label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number" 
              placeholder="Od" 
              value={localFilters[key + 'Min'] || ""} 
              onChange={e => setLocalFilters({...localFilters, [key + 'Min']: e.target.value})} 
              className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]" 
            />
            <input 
              type="number" 
              placeholder="Do" 
              value={localFilters[key + 'Max'] || ""} 
              onChange={e => setLocalFilters({...localFilters, [key + 'Max']: e.target.value})} 
              className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]" 
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const fields = VEHICLE_FIELDS_CONFIG[category as keyof typeof VEHICLE_FIELDS_CONFIG];

  return (
    <div className="bg-[#131C2B] border border-white/5 rounded-[32px] p-6 lg:p-8 shadow-2xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GLOBAL LOKACIJA & CIJENA */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Lokacija</label>
          <select value={localFilters.lokacija || ""} onChange={e => setLocalFilters({...localFilters, lokacija: e.target.value})} className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]">
            <option value="">Svi gradovi</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Cijena (€)</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Min" value={localFilters.priceMin || ""} onChange={e => setLocalFilters({...localFilters, priceMin: e.target.value})} className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]" />
            <input type="number" placeholder="Max" value={localFilters.priceMax || ""} onChange={e => setLocalFilters({...localFilters, priceMax: e.target.value})} className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]" />
          </div>
        </div>

        {/* DINAMIČKA POLJA IZ CONFIG-A */}
        {fields && Object.entries(fields).map(([key, config]) => renderField(key, config))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
        <button onClick={() => { setLocalFilters(DEFAULT_FILTERS); onReset(); }} className="w-full sm:w-auto h-14 px-8 rounded-2xl border border-white/5 text-[10px] font-black uppercase text-[#9CA3AF] hover:bg-white/5 transition-all">Poništi</button>
        <button onClick={() => onApply(localFilters)} className="w-full sm:flex-grow h-14 bg-[#4F6DFF] rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-[#4F6DFF]/20 hover:scale-[1.02] active:scale-95 transition-all">Primijeni Filter</button>
      </div>
    </div>
  );
};

const AdCard: React.FC<{ ad: Ad, isFavorite: boolean, onToggleFavorite: (id: string) => void }> = ({ ad, isFavorite, onToggleFavorite }) => {
  const now = Date.now();
  const isPremium = ad.isPaid && ad.promotionStatus === "active" && ad.promotedUntil !== null && ad.promotedUntil > now;
  
  return (
    <div className="group bg-[#131C2B] border border-[rgba(255,255,255,0.06)] rounded-[18px] overflow-hidden flex flex-col relative transition-all shadow-[0_10px_30px_rgba(0,0,0,0.35)] tap-scale">
      <Link to={`/oglas/${ad.slug}`} className="aspect-square overflow-hidden relative">
        <img src={ad.slike[0]} alt={ad.naslov} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        {isPremium && <div className="absolute top-2 left-2 flex gap-2"><span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-lg border border-white/10"><Zap className="w-2.5 h-2.5 fill-current" /> ISTAKNUTO</span></div>}
      </Link>
      <button onClick={(e) => { e.preventDefault(); onToggleFavorite(ad.id); }} className={`absolute top-2 right-2 p-2 rounded-full transition-all active:scale-150 ${isFavorite ? 'text-red-500 scale-110' : 'text-white/60 hover:text-white'}`}><Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} /></button>
      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/oglas/${ad.slug}`} className="font-medium text-[#F3F4F6] text-sm line-clamp-2 leading-tight mb-2 h-9">{ad.naslov}</Link>
        <p className="text-[18px] font-semibold text-[#7C8CFF] mb-2">{ad.cijena.toLocaleString()} €</p>
        <div className="mt-auto flex justify-between items-center border-t border-[rgba(255,255,255,0.04)] pt-2">
          <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1 truncate max-w-[65px]"><MapPin className="w-2.5 h-2.5" /> {ad.lokacija}</span>
          <span className="text-[10px] text-[#9CA3AF] shrink-0">{timeAgo(ad.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

const AdDetail: React.FC<{ 
  ads: Ad[], user: User | null, onToggleFavorite: (id: string) => void, favorites: string[], ratings: Rating[], onAddRating: (sellerId: string, score: number) => void, getSellerMetrics: (sellerId: string) => { avg: string, count: number }
}> = ({ ads, user, onToggleFavorite, favorites, ratings, onAddRating, getSellerMetrics }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const ad = ads.find(a => a.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const sellerAds = useMemo(() => ad ? ads.filter(a => a.vlasnikId === ad.vlasnikId && a.id !== ad.id).slice(0, 4) : [], [ad, ads]);
  const metrics = useMemo(() => ad ? getSellerMetrics(ad.vlasnikId) : { avg: "5.0", count: 0 }, [ad, ratings]);
  const sellerAdsCount = useMemo(() => ad ? ads.filter(a => a.vlasnikId === ad.vlasnikId).length : 0, [ad?.vlasnikId, ads]);
  
  if (!ad) return <div className="text-center py-40 font-bold uppercase tracking-widest text-[#9CA3AF]">Oglas nije pronađen</div>;
  
  const handleMessageClick = () => { if (!user) { navigate('/prijava'); return; } navigate(`/poruke?sellerId=${ad.vlasnikId}&adId=${ad.id}`); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
             <div className="aspect-[4/3] sm:aspect-video bg-[#0B1220] rounded-[32px] overflow-hidden border border-white/5 relative group shadow-2xl">
                <img src={ad.slike[activeImg]} className="w-full h-full object-contain" alt={ad.naslov} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/10 z-10 shadow-lg">{activeImg + 1} / {ad.slike.length}</div>
             </div>
             {ad.slike.length > 1 && (<div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">{ad.slike.map((img, i) => <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#4F6DFF] scale-95 shadow-lg shadow-[#4F6DFF]/20' : 'border-white/5 opacity-60 hover:opacity-100'}`}><img src={img} className="w-full h-full object-cover" alt="" /></button>)}</div>)}
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3"><span className="px-3 py-1 bg-[#4F6DFF]/10 text-[#7C8CFF] text-[10px] font-black uppercase rounded-lg border border-[#4F6DFF]/20">{ad.kategorija}</span><span className="text-[10px] text-[#9CA3AF] font-bold uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> Objavljeno {timeAgo(ad.createdAt)}</span></div>
            <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight">{ad.naslov}</h1>
            <div className="text-4xl font-black text-[#7C8CFF] tracking-tighter">{ad.cijena.toLocaleString()} €</div>
          </div>
          <div className="space-y-4 pt-4 border-t border-white/5">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] flex items-center gap-2"><Settings2 className="w-3 h-3 text-[#4F6DFF]" /> Specifikacije Vozila</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{ad.carDetails && <SpecGrid details={ad.carDetails} />}{ad.motorcycleDetails && <SpecGrid details={ad.motorcycleDetails} />}{!ad.carDetails && !ad.motorcycleDetails && <div className="col-span-full p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] text-[#9CA3AF] font-bold uppercase text-center">Osnovni podaci oglasa</div>}</div>
          </div>
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Opis oglasa</h3>
             <div className="bg-[#131C2B] border border-white/5 p-6 lg:p-8 rounded-[32px] shadow-xl"><p className="text-[#F3F4F6] leading-relaxed whitespace-pre-wrap text-sm lg:text-base opacity-90">{ad.opis}</p></div>
          </div>
          <RatingSection sellerId={ad.vlasnikId} user={user} onAddRating={onAddRating} metrics={metrics} />
        </div>
        <div className="lg:col-span-4 space-y-6">
           <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-[#131C2B] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                 <div className="space-y-6">
                    <div className="flex items-center gap-5"><div className="w-20 h-20 bg-gradient-to-br from-[#4F6DFF] to-[#7C8CFF] rounded-full flex items-center justify-center font-black text-white text-3xl shadow-xl border-4 border-[#0B1220]">{ad.kontaktIme[0]}</div><div><div className="text-white font-black text-xl flex items-center gap-2 mb-1">{ad.kontaktIme}<ShieldCheck className="w-5 h-5 text-emerald-400" /></div><div className="flex items-center gap-1.5"><div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(metrics.avg)) ? 'fill-current' : 'opacity-20'}`} />)}</div><span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{metrics.avg} ({metrics.count})</span></div></div></div>
                    <div className="space-y-2"><div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] bg-white/5 p-3 rounded-xl border border-white/5"><span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#4F6DFF]" /> Lokacija</span><span className="text-white">{ad.lokacija}</span></div><div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] bg-white/5 p-3 rounded-xl border border-white/5"><span className="flex items-center gap-2"><LayoutDashboard className="w-3 h-3 text-[#4F6DFF]" /> Aktivni oglasi</span><span className="text-white">{sellerAdsCount}</span></div></div>
                    <div className="space-y-3">{ad.kontaktTelefon && (<a href={`tel:${ad.kontaktTelefon}`} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><Phone className="w-4 h-4 fill-current" /> Pozovi prodavca</a>)}<button onClick={handleMessageClick} className="w-full h-14 bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs shadow-lg shadow-[#4F6DFF]/20 active:scale-95 transition-all"><MessageSquare className="w-4 h-4" /> Pošalji poruku</button></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SpecGrid = ({ details }: { details: any }) => {
  const specs = [];
  if (details.marka) specs.push({ label: 'Marka', value: details.marka });
  if (details.model) specs.push({ label: 'Model', value: details.model });
  if (details.godiste) specs.push({ label: 'Godište', value: `${details.godiste}. god` });
  if (details.kilometraza) specs.push({ label: 'Kilometraža', value: `${details.kilometraza.toLocaleString()} km` });
  if (details.gorivo) specs.push({ label: 'Gorivo', value: details.gorivo });
  if (details.mjenjac) specs.push({ label: 'Mjenjač', value: details.mjenjac });
  if (details.snaga) specs.push({ label: 'Snaga', value: `${details.snaga} KS` });
  if (details.snagaKW) specs.push({ label: 'Snaga', value: `${details.snagaKW} kW` });
  if (details.kubikaza) specs.push({ label: 'Kubikaža', value: `${details.kubikaza} cm3` });
  if (details.karoserija) specs.push({ label: 'Karoserija', value: details.karoserija });
  if (details.pogon) specs.push({ label: 'Pogon', value: details.pogon });
  if (details.stanje) specs.push({ label: 'Stanje', value: details.stanje });
  if (details.tip) specs.push({ label: 'Tip', value: details.tip });
  return (<>{specs.map((s, i) => (<div key={i} className="bg-[#131C2B] border border-white/5 p-4 rounded-2xl flex flex-col gap-1 hover:border-[#4F6DFF]/30 group transition-all"><span className="text-[8px] font-black uppercase text-[#9CA3AF] tracking-widest group-hover:text-[#4F6DFF]">{s.label}</span><span className="text-xs font-bold text-[#F3F4F6] truncate">{s.value}</span></div>))}</>);
};

const RatingSection = ({ sellerId, user, onAddRating, metrics }: { sellerId: string, user: User | null, onAddRating: (sid: string, s: number) => void, metrics: { avg: string, count: number } }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isSelf = user?.id === sellerId;
  return (
    <div className="space-y-4 pt-8 border-t border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-1">⭐ Ocijeni prodavca</h3></div>
        {!isSelf && user && (<div className="flex items-center gap-1.5 bg-white/5 p-3 rounded-2xl border border-white/5 shadow-inner">{[1, 2, 3, 4, 5].map((s) => (<button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => onAddRating(sellerId, s)} className="transition-all active:scale-125 p-1"><Star className={`w-6 h-6 ${s <= (hoverRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} /></button>))}</div>)}
      </div>
      <div className="flex items-center gap-4 bg-white/5 p-6 rounded-[32px] border border-white/5"><div className="text-4xl font-black text-white">{metrics.avg}</div><div><div className="flex text-amber-400 gap-0.5 mb-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(metrics.avg)) ? 'fill-current' : 'opacity-10'}`} />)}</div><div className="text-[9px] text-[#9CA3AF] font-black uppercase tracking-widest">Bazirano na {metrics.count} recenzija</div></div></div>
    </div>
  );
};

const PublicProfile: React.FC<{ ads: Ad[], favorites: string[], onToggleFavorite: (id: string) => void }> = ({ ads, favorites, onToggleFavorite }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const sellerAds = useMemo(() => ads.filter(a => a.vlasnikId === userId), [ads, userId]);
  const sellerName = sellerAds.length > 0 ? sellerAds[0].kontaktIme : "Nepoznat prodavac";
  return (<div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-slide-up"><div className="flex items-center gap-4"><button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-white"><ChevronLeft className="w-6 h-6" /></button><div><h1 className="text-2xl font-black text-white uppercase tracking-widest">{sellerName}</h1><p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">{sellerAds.length} Aktivnih oglasa</p></div></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{sellerAds.map(ad => (<AdCard key={ad.id} ad={ad} isFavorite={favorites.includes(ad.id)} onToggleFavorite={onToggleFavorite} />))}</div></div>);
};

const Chat = ({ user, ads, conversations, setConversations, messages, setMessages, setNotifications }: any) => {
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const adId = searchParams.get('adId');
  const contextAd = adId ? ads.find((a: any) => a.id === adId) : null;
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(() => {
    if (!user || !sellerId || !adId) return null;
    const sortedParticipants = [user.id, sellerId].sort();
    return conversations.find((c: Conversation) => 
      c.adId === adId && 
      JSON.stringify(c.participantIds.sort()) === JSON.stringify(sortedParticipants)
    );
  }, [user?.id, sellerId, adId, conversations]);

  const conversationMessages = useMemo(() => {
    if (!activeConversation) return [];
    return messages.filter((m: Message) => m.conversationId === activeConversation.id);
  }, [activeConversation, messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversationMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user || !sellerId || !adId || !contextAd) return;

    let convId = activeConversation?.id;

    if (!activeConversation) {
      convId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        adId,
        participantIds: [user.id, sellerId].sort(),
        updatedAt: Date.now()
      };
      setConversations((prev: any) => [...prev, newConv]);
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: sellerId,
      text: inputText,
      createdAt: Date.now(),
      adId,
      conversationId: convId!
    };

    setMessages((prev: any) => [...prev, newMessage]);
    setInputText("");

    const newNotif: Notification = {
      id: `notif-msg-${Date.now()}`,
      korisnikId: sellerId,
      tip: 'new_message',
      naslov: 'Nova poruka',
      poruka: `${user.ime} vam je poslao poruku za oglas: ${contextAd.naslov}`,
      link: `/poruke?sellerId=${user.id}&adId=${adId}`,
      procitano: false,
      createdAt: Date.now()
    };
    setNotifications((prev: any) => [newNotif, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-120px)] lg:h-[calc(100dvh-200px)] flex flex-col px-4 py-6 animate-slide-up">
      <div className="bg-[#131C2B] border border-white/5 rounded-[32px] flex-grow flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#4F6DFF] rounded-full flex items-center justify-center font-bold text-white uppercase">
            {contextAd ? contextAd.kontaktIme[0] : "?"}
          </div>
          <div>
            <div className="text-white font-black uppercase text-xs tracking-widest">
              {contextAd ? contextAd.kontaktIme : "Izaberi razgovor"}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online</div>
          </div>
        </div>
        {contextAd && (
          <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-3">
            <img src={contextAd.slike[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
            <div className="flex-grow">
              <div className="text-[10px] text-white font-bold line-clamp-1">{contextAd.naslov}</div>
              <div className="text-[10px] text-[#7C8CFF] font-black">{contextAd.cijena.toLocaleString()} €</div>
            </div>
          </div>
        )}
        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 no-scrollbar">
          {conversationMessages.length > 0 ? (
            conversationMessages.map((msg: Message) => (
              <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.senderId === user.id ? 'bg-[#4F6DFF] text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                  {msg.text}
                  <div className="text-[8px] opacity-50 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center opacity-30">
              <MessageSquare className="w-16 h-16" />
              <p className="text-[10px] uppercase font-bold tracking-widest">Započnite razgovor</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-white/5 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="relative">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Unesite poruku..." className="w-full h-14 bg-[#0B1220] border border-white/10 rounded-2xl px-6 pr-16 text-sm text-white outline-none focus:border-[#4F6DFF]" />
            <button type="submit" className="absolute right-2 top-2 w-10 h-10 bg-[#4F6DFF] rounded-xl flex items-center justify-center text-white hover:bg-[#3D56D6] transition-colors"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Notifications = ({ notifications, setNotifications }: any) => {
  const navigate = useNavigate();
  const handleNotificationClick = (n: Notification) => {
    setNotifications((prev: Notification[]) => prev.map(notif => notif.id === n.id ? { ...notif, procitano: true } : notif));
    navigate(n.link);
  };
  return (<div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-slide-up"><h1 className="text-2xl font-black text-white uppercase tracking-widest">Obavještenja</h1><div className="space-y-3">{notifications.map((n: Notification) => (<div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-5 rounded-3xl border flex gap-4 cursor-pointer transition-all ${n.procitano ? 'bg-[#131C2B] border-white/5 opacity-60' : 'bg-[#162235] border-[#4F6DFF]/30 hover:scale-[1.01]'}`}><div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4F6DFF]/20 text-[#4F6DFF]"><Bell className="w-5 h-5" /></div><div className="flex-grow space-y-1"><div className="text-white font-bold text-sm">{n.naslov}</div><div className="text-xs text-[#9CA3AF] leading-relaxed">{n.poruka}</div></div></div>))}</div></div>);
};

const Auth = ({ onLogin }: any) => (<div className="p-40 text-center"><button onClick={() => onLogin({id:'user-0', ime:'Marko Marković', email:'marko@Poveži.ME', telefon:'+38267000000', datumRegistracije: Date.now(), omiljeniOglasi: [], role: 'admin'})} className="bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] text-white px-12 py-5 rounded-full font-black uppercase text-xs">Prijavi se na Poveži.ME</button></div>);

const AddAd: React.FC<{ user: User | null, onAddAd: (ad: Ad) => void }> = ({ user, onAddAd }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);
  const [category, setCategory] = useState<string>('');
  const [formData, setFormData] = useState<any>({
    naslov: '', cijena: '', opis: '', lokacija: 'Podgorica', telefon: user?.telefon || '', 
    premium: false, instagram: '', facebook: '',
    carDetails: { marka: '', model: '', godiste: '', kilometraza: '', gorivo: '', mjenjac: '', karoserija: '', pogon: '', snaga: '', kubikaza: '', stanje: 'Polovno' },
    motoDetails: { marka: '', model: '', godiste: '', kilometraza: '', kubikaza: '', gorivo: '', mjenjac: '', tip: '', snagaKW: '', stanje: 'Polovno' }
  });

  const renderFormField = (key: string, config: any) => {
    const isCar = category === 'automobili';
    const detailKey = isCar ? 'carDetails' : 'motoDetails';
    const currentVal = formData[detailKey][key];

    if (config.type === 'select') {
      let options = config.options || [];
      if (key === 'marka') {
        options = isCar ? AUTOMOTIVE_CATALOG.map(b => b.brand) : Object.keys(MOTO_CATALOG);
      } else if (key === 'model') {
        const brand = formData[detailKey].marka;
        if (!brand) return null;
        options = isCar ? AUTOMOTIVE_CATALOG.find(b => b.brand === brand)?.models.map(m => m.name) || [] : MOTO_CATALOG[brand] || [];
      }

      return (
        <div key={key} className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[#9CA3AF]">{config.label}</label>
          <select 
            value={currentVal || ""} 
            onChange={e => setFormData({...formData, [detailKey]: {...formData[detailKey], [key]: e.target.value, ...(key === 'marka' ? {model: ''} : {})}})} 
            className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]"
          >
            <option value="">Izaberi</option>
            {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    if (config.type === 'number') {
      return (
        <div key={key} className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[#9CA3AF]">{config.label}</label>
          <input 
            type="number" 
            value={currentVal || ""} 
            onChange={e => setFormData({...formData, [detailKey]: {...formData[detailKey], [key]: e.target.value}})} 
            className="w-full h-12 bg-[#0B1220] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-[#4F6DFF]" 
          />
        </div>
      );
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 10 - images.length);
      const newImages = newFiles.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/prijava'); return; }

    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      naslov: formData.naslov,
      slug: `${formData.naslov.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      opis: formData.opis,
      kategorija: category,
      potkategorija: formData.premium ? 'Premium' : 'Basic',
      cijena: parseFloat(formData.cijena),
      lokacija: formData.lokacija,
      slike: images.map(img => img.preview),
      vlasnikId: user.id,
      isPaid: formData.premium,
      promotionStatus: formData.premium ? 'active' : 'none',
      promotionPlan: formData.premium ? '7d' : null,
      promotedUntil: formData.premium ? Date.now() + 86400000 * 7 : null,
      promotionPrice: formData.premium ? 3.00 : null,
      createdAt: Date.now(),
      status: AdStatus.AKTIVAN,
      pogledi: 0,
      kontaktIme: user.ime,
      kontaktTelefon: formData.telefon,
      instagram: formData.instagram,
      facebook: formData.facebook,
      glavnaSlikaIndex: 0,
      carDetails: category === 'automobili' ? {...formData.carDetails, godiste: Number(formData.carDetails.godiste), kilometraza: Number(formData.carDetails.kilometraza), snaga: Number(formData.carDetails.snaga), kubikaza: Number(formData.carDetails.kubikaza)} : undefined,
      motorcycleDetails: category === 'motocikli' ? {...formData.motoDetails, godiste: Number(formData.motoDetails.godiste), kilometraza: Number(formData.motoDetails.kilometraza), kubikaza: Number(formData.motoDetails.kubikaza), snagaKW: Number(formData.motoDetails.snagaKW)} : undefined
    };
    onAddAd(newAd);
    navigate('/');
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-slide-up">
        <h1 className="text-3xl font-black uppercase text-white tracking-widest mb-12 text-center">Šta prodajete?</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setStep(2); }} className="h-40 bg-[#131C2B] border border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-4 group hover:border-[#4F6DFF] transition-all shadow-xl">
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-black uppercase text-[10px] lg:text-xs tracking-widest text-[#F3F4F6] text-center px-2">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const fieldsConfig = VEHICLE_FIELDS_CONFIG[category as keyof typeof VEHICLE_FIELDS_CONFIG];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setStep(1)} className="p-3 bg-[#131C2B] rounded-full text-[#9CA3AF] hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-black uppercase text-white tracking-widest">Nova Objava: {CATEGORIES.find(c => c.id === category)?.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-[#131C2B] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xs font-black uppercase text-[#9CA3AF] tracking-[0.2em] mb-6">Slike ({images.length}/10) *</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, i) => (
              <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 group">
                <img src={img.preview} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
              </div>
            ))}
            {images.length < 10 && (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square bg-[#0B1220] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:border-[#4F6DFF] hover:text-white transition-all">
                <Plus className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase tracking-widest">Dodaj</span>
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageChange} />
        </section>

        <section className="bg-[#131C2B] border border-white/5 p-8 rounded-[40px] shadow-2xl space-y-6">
          <h3 className="text-xs font-black uppercase text-[#9CA3AF] tracking-[0.2em]">Osnovne informacije</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-[#9CA3AF]">Naslov Oglasa *</label>
              <input required type="text" placeholder="Npr. Audi A4 2.0 TDI..." value={formData.naslov} onChange={e => setFormData({...formData, naslov: e.target.value})} className="w-full h-14 bg-[#0B1220] border border-white/5 rounded-2xl px-6 text-sm text-white outline-none focus:border-[#4F6DFF]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#9CA3AF]">Cijena (€) *</label>
              <input required type="number" value={formData.cijena} onChange={e => setFormData({...formData, cijena: e.target.value})} className="w-full h-14 bg-[#0B1220] border border-white/5 rounded-2xl px-6 text-sm text-white outline-none focus:border-[#4F6DFF]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#9CA3AF]">Lokacija</label>
              <select value={formData.lokacija} onChange={e => setFormData({...formData, lokacija: e.target.value})} className="w-full h-14 bg-[#0B1220] border border-white/5 rounded-2xl px-6 text-sm text-white outline-none focus:border-[#4F6DFF]">
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#9CA3AF]">Opis</label>
            <textarea placeholder="Opis oglasa..." rows={5} value={formData.opis} onChange={e => setFormData({...formData, opis: e.target.value})} className="w-full bg-[#0B1220] border border-white/5 rounded-2xl p-6 text-sm text-white outline-none focus:border-[#4F6DFF]" />
          </div>
        </section>

        {fieldsConfig && (
          <section className="bg-[#131C2B] border border-white/5 p-8 rounded-[40px] shadow-2xl space-y-6">
            <h3 className="text-xs font-black uppercase text-[#9CA3AF] tracking-[0.2em]">Detalji Vozila</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(fieldsConfig).map(([key, config]) => renderFormField(key, config))}
            </div>
          </section>
        )}

        <section className="bg-[#131C2B] border border-white/5 p-8 rounded-[40px] shadow-2xl space-y-6">
          <h3 className="text-xs font-black uppercase text-[#9CA3AF] tracking-[0.2em]">Kontakt i Linkovi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#9CA3AF]">Telefon *</label>
              <input required type="tel" value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})} className="w-full h-14 bg-[#0B1220] border border-white/5 rounded-2xl px-6 text-sm text-white outline-none focus:border-[#4F6DFF]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#9CA3AF]">Instagram (@korisnik)</label>
              <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full h-14 bg-[#0B1220] border border-white/5 rounded-2xl px-6 text-sm text-white outline-none focus:border-[#4F6DFF]" />
            </div>
          </div>
        </section>

        <button type="submit" className="w-full h-20 bg-gradient-to-r from-[#4F6DFF] to-[#7C8CFF] text-white rounded-[32px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Objavi Oglas</button>
      </form>
    </div>
  );
};

const MyAds = ({ ads, user }: any) => <div className="p-40 text-center text-[#9CA3AF] uppercase font-bold tracking-widest">Moji oglasi</div>;
const MyFavorites = ({ ads, favorites, onToggleFavorite }: any) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-black text-white uppercase mb-8 tracking-widest">Sačuvano</h1>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {ads.filter((a:any) => favorites.includes(a.id)).map((ad:any) => (<AdCard key={ad.id} ad={ad} isFavorite={true} onToggleFavorite={onToggleFavorite} />))}
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-[#0B1220] border-t border-[rgba(255,255,255,0.06)] py-12 px-6 pb-32 lg:pb-12 text-center flex flex-col items-center">
    <Logo variant="vertical" />
    <p className="text-[10px] text-[#9CA3AF]/40 mt-6 uppercase tracking-[0.2em] font-bold">© 2024 Poveži.ME Premium Marketplace</p>
  </footer>
);

export default App;