import { AdStatus, FuelType, Ad, TransmissionType, DriveType, BodyType, MotorcycleType, Notification } from './types';

export const CATEGORIES = [
  { id: 'automobili', name: 'Automobili', icon: '🚗', slug: 'automobili' },
  { id: 'motocikli', name: 'Motocikli', icon: '🏍️', slug: 'motocikli' },
  { id: 'nekretnine', name: 'Nekretnine', icon: '🏠', slug: 'nekretnine' },
  { id: 'tehnika', name: 'Tehnika', icon: '💻', slug: 'tehnika' },
  { id: 'bijela_tehnika', name: 'Bijela tehnika', icon: '🧺', slug: 'bijela-tehnika' },
  { id: 'namjestaj', name: 'Namještaj', icon: '🛋️', slug: 'namjestaj' },
  { id: 'moda', name: 'Moda', icon: '👕', slug: 'moda' },
  { id: 'poslovi', name: 'Poslovi', icon: '💼', slug: 'poslovi' },
  { id: 'usluge', name: 'Usluge', icon: '🛠️', slug: 'usluge' },
  { id: 'kucni_ljubimci', name: 'Kućni ljubimci', icon: '🐾', slug: 'kucni-ljubimci' },
  { id: 'sport', name: 'Sport i rekreacija', icon: '⚽', slug: 'sport-i-rekreacija' },
  { id: 'gradjevina', name: 'Građevina i alati', icon: '🏗️', slug: 'gradjevina-i-alati' },
  { id: 'poljoprivreda', name: 'Poljoprivreda', icon: '🚜', slug: 'poljoprivreda' },
  { id: 'ostalo', name: 'Ostalo', icon: '📦', slug: 'ostalo' },
];

export const LOCATIONS = [
  'Podgorica', 'Budva', 'Kotor', 'Tivat', 'Nikšić', 'Bar', 'Herceg Novi', 'Bijelo Polje', 'Cetinje', 'Ulcinj', 'Pljevlja'
];

export const STANJE_OPTIONS = ['Polovno', 'Novo', 'Oštećeno'];

export const MOTO_CATALOG: Record<string, string[]> = {
  "Honda": ["Africa Twin", "CB 500F", "CBR 600RR", "X-ADV", "Hornet", "PCX 125"],
  "Yamaha": ["MT-07", "MT-09", "TMAX 560", "R1", "Tracer 9", "XMAX 300"],
  "Kawasaki": ["Ninja 650", "Z900", "Versys 650", "Ninja H2", "Vulcan S"],
  "Suzuki": ["GSX-R 1000", "V-Strom 650", "Hayabusa", "Burgman 400", "SV650"],
  "BMW": ["R 1250 GS", "S 1000 RR", "F 850 GS", "C 400 GT", "G 310 R"],
  "KTM": ["Duke 390", "Adventure 1290", "Super Duke 1290 R", "Exc 300"],
  "Ducati": ["Panigale V4", "Multistrada V4", "Monster", "Diavel", "Scrambler"],
  "Piaggio": ["Beverly 300", "Liberty 125", "Medley 150"],
  "Vespa": ["GTS 300", "Primavera 125", "Sprint 50"],
  "Harley-Davidson": ["Iron 883", "Fat Boy", "Street Glide", "Pan America"],
  "Aprilia": ["RS 660", "Tuono V4", "SR GT 200"],
  "Ostalo": ["Ostalo"]
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', korisnikId: 'user-0', tip: 'payment', naslov: 'Uspešna uplata', poruka: 'Vaš oglas je sada istaknut.', link: '/moji-oglasi', procitano: false, createdAt: Date.now() - 3600000 }
];

// Unified schema for rendering forms and filter panels
export const VEHICLE_FIELDS_CONFIG = {
  automobili: {
    marka: { type: 'select', label: 'Marka' },
    model: { type: 'select', label: 'Model' },
    godiste: { type: 'number', label: 'Godište', min: 1950, max: 2025 },
    kilometraza: { type: 'number', label: 'Kilometraža (km)' },
    gorivo: { type: 'select', label: 'Gorivo', options: Object.values(FuelType) },
    mjenjac: { type: 'select', label: 'Mjenjač', options: Object.values(TransmissionType) },
    karoserija: { type: 'select', label: 'Karoserija', options: Object.values(BodyType) },
    pogon: { type: 'select', label: 'Pogon', options: Object.values(DriveType) },
    kubikaza: { type: 'number', label: 'Kubikaža (cm3)' },
    snaga: { type: 'number', label: 'Snaga (KS)' },
    stanje: { type: 'select', label: 'Stanje', options: STANJE_OPTIONS },
  },
  motocikli: {
    marka: { type: 'select', label: 'Marka' },
    model: { type: 'select', label: 'Model' },
    godiste: { type: 'number', label: 'Godište', min: 1950, max: 2025 },
    kilometraza: { type: 'number', label: 'Kilometraža (km)' },
    gorivo: { type: 'select', label: 'Gorivo', options: Object.values(FuelType) },
    mjenjac: { type: 'select', label: 'Mjenjač', options: Object.values(TransmissionType) },
    kubikaza: { type: 'number', label: 'Kubikaža (cm3)' },
    snagaKW: { type: 'number', label: 'Snaga (kW)' },
    tip: { type: 'select', label: 'Tip', options: Object.values(MotorcycleType) },
    stanje: { type: 'select', label: 'Stanje', options: STANJE_OPTIONS },
  }
};

const generatePremiumAds = (): Ad[] => {
  const ads: Ad[] = [];
  const now = Date.now();

  const baseItems = [
    { title: 'Audi A4 2.0 TDI S-line', cat: 'automobili', price: 16800, loc: 'Podgorica', img: 'audi,a4,car' },
    { title: 'BMW 320d M-Sport 2018', cat: 'automobili', price: 19900, loc: 'Budva', img: 'bmw,3,car' },
    { title: 'Mercedes C220d Avantgarde', cat: 'automobili', price: 17800, loc: 'Tivat', img: 'mercedes,c,car' },
    { title: 'VW Golf 7 GTE 2017', cat: 'automobili', price: 15500, loc: 'Nikšić', img: 'golf,vw,car' },
    { title: 'Audi Q5 Quattro 2019', cat: 'automobili', price: 32000, loc: 'Kotor', img: 'audi,q5,car' },
    { title: 'BMW 520d G30 2020', cat: 'automobili', price: 34500, loc: 'Podgorica', img: 'bmw,5,car' },
    { title: 'Mercedes E220d AMG 2021', cat: 'automobili', price: 48000, loc: 'Bar', img: 'mercedes,e,car' },
    { title: 'VW Polo 1.2 TSI 2016', cat: 'automobili', price: 9200, loc: 'Bijelo Polje', img: 'polo,vw,car' },
    { title: 'Audi A3 Sportback 2015', cat: 'automobili', price: 11800, loc: 'Budva', img: 'audi,a3,car' },
    { title: 'Toyota RAV4 Hybrid 2021', cat: 'automobili', price: 36500, loc: 'Podgorica', img: 'toyota,rav4,car' },
    { title: 'BMW X1 sDrive 2018', cat: 'automobili', price: 21500, loc: 'Herceg Novi', img: 'bmw,x1,car' },
    { title: 'Mercedes GLE Coupe 2022', cat: 'automobili', price: 79000, loc: 'Tivat', img: 'mercedes,gle,car' },
    { title: 'VW Tiguan R-Line 2019', cat: 'automobili', price: 28500, loc: 'Cetinje', img: 'tiguan,vw,car' },
    { title: 'Audi A6 Matrix LED 2018', cat: 'automobili', price: 27500, loc: 'Podgorica', img: 'audi,a6,car' },
    { title: 'Renault Clio 1.5 dCi 2017', cat: 'automobili', price: 8900, loc: 'Nikšić', img: 'renault,clio,car' },
    { title: 'Yamaha MT-07 ABS 2021', cat: 'motocikli', price: 6800, loc: 'Podgorica', img: 'motorcycle,yamaha' },
    { title: 'Honda Africa Twin 1100', cat: 'motocikli', price: 12500, loc: 'Budva', img: 'motorcycle,honda' },
    { title: 'BMW R 1250 GS Adventure', cat: 'motocikli', price: 18900, loc: 'Tivat', img: 'motorcycle,bmw' },
    { title: 'Dvosoban stan Centar', cat: 'nekretnine', price: 165000, loc: 'Podgorica', img: 'apartment,living' },
    { title: 'iPhone 15 Pro Max 256GB', cat: 'tehnika', price: 1180, loc: 'Podgorica', img: 'iphone,smartphone' },
  ];

  // Popuni do 50 oglasa
  for (let i = 0; i < 50; i++) {
    const base = baseItems[i % baseItems.length];
    const isPromoted = i < 13;
    const slikaNiz: string[] = [];
    for(let j=0; j<7; j++) {
      slikaNiz.push(`https://loremflickr.com/800/600/${base.img.split(',')[0]}?lock=${i * 10 + j}`);
    }

    let carDetails;
    if (base.cat === 'automobili') {
      carDetails = {
        marka: base.title.split(' ')[0],
        model: base.title.split(' ')[1],
        godiste: 2015 + Math.floor(Math.random() * 8),
        kilometraza: 80000 + Math.floor(Math.random() * 150000),
        gorivo: FuelType.DIZEL,
        mjenjac: TransmissionType.AUTOMATSKI,
        snaga: 150,
        kubikaza: 1968,
        karoserija: BodyType.LIMUZINA,
        pogon: DriveType.PREDNJI,
        stanje: 'Polovno'
      };
    }

    ads.push({
      id: `ad-${i}`,
      naslov: `${base.title}${i > baseItems.length ? ' #' + i : ''}`,
      slug: `${base.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      opis: `Prodaje se ${base.title} u vrhunskom stanju. Redovno održavan u ovlašćenom servisu, bez ikakvih ulaganja.`,
      kategorija: base.cat,
      potkategorija: isPromoted ? 'Premium' : 'Basic',
      cijena: base.price,
      lokacija: base.loc,
      slike: slikaNiz,
      vlasnikId: 'user-0',
      isPaid: isPromoted,
      promotionStatus: isPromoted ? 'active' : 'none',
      promotionPlan: isPromoted ? '7d' : null,
      promotedUntil: isPromoted ? now + 86400000 * 7 : null,
      promotionPrice: isPromoted ? 3.00 : null,
      createdAt: now - (i * 3600000),
      status: AdStatus.AKTIVAN,
      pogledi: Math.floor(Math.random() * 2500),
      kontaktIme: "Marko Marković",
      kontaktTelefon: "+38267000000",
      glavnaSlikaIndex: 0,
      carDetails: carDetails,
      motorcycleDetails: base.cat === 'motocikli' ? {
        marka: base.title.split(' ')[0],
        model: base.title.split(' ').slice(1).join(' '),
        godiste: 2021,
        kilometraza: 12000,
        kubikaza: 700,
        gorivo: FuelType.BENZIN,
        mjenjac: TransmissionType.MANUELNI,
        tip: MotorcycleType.SPORT,
        stanje: 'Polovno',
        snagaKW: 55
      } : undefined
    });
  }

  return ads;
};

export const DEMO_ADS = generatePremiumAds();