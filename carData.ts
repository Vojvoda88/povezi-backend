
import { CarBrand, CarModel } from './types';

export const BRANDS_RAW = [
  "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "BYD", 
  "Cadillac", "Caterham", "Chevrolet", "Chrysler", "Citroen", "Cupra", "Dacia", "Daewoo", "Daihatsu", "Dodge", 
  "DS", "Ferrari", "Fiat", "Fisker", "Ford", "Genesis", "GMC", "Great Wall", "Honda", "Hummer", "Hyundai", 
  "Infiniti", "Isuzu", "Iveco", "Jaguar", "Jeep", "Karma", "Kia", "Koenigsegg", "Lada", "Lamborghini", 
  "Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lynk & Co", "Maserati", "Maybach", "Mazda", "McLaren", 
  "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan", "Oldsmobile", "Opel", "Pagani", "Peugeot", 
  "Polestar", "Pontiac", "Porsche", "Ram", "Renault", "Rimac", "Rolls-Royce", "Rover", "Saab", "Seat", "Skoda", 
  "Smart", "SsangYong", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Triumph", "TVR", "Vauxhall", "Volkswagen", 
  "Volvo", "Wiesmann", "Zastava", "Zenvo", "Ostalo"
];

export const MODELS_DATA: Record<string, string[]> = {
  "Alfa Romeo": ["147", "156", "159", "166", "GT", "Brera", "Giulietta", "Mito", "Giulia", "Stelvio", "Tonale", "4C", "8C"],
  "Audi": [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron", "TT", "R8",
    "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8", "S1", "S3", "S4", "S5", "S6", "S7", "S8", "SQ2", "SQ5", "SQ7", "SQ8",
    "100", "80", "90", "A4 Allroad", "A6 Allroad"
  ],
  "BMW": [
    "Serija 1", "Serija 2", "Serija 3", "Serija 4", "Serija 5", "Serija 6", "Serija 7", "Serija 8",
    "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "Z1", "Z3", "Z4", "Z8", "i3", "i4", "i7", "i8", "iX", "iX1", "iX3",
    "M1", "M2", "M3", "M4", "M5", "M6", "M8", "X3 M", "X4 M", "X5 M", "X6 M"
  ],
  "Mercedes-Benz": [
    "A-Klasa", "B-Klasa", "C-Klasa", "E-Klasa", "S-Klasa", "G-Klasa", "V-Klasa", "X-Klasa",
    "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV",
    "SL", "SLC", "SLK", "SLS AMG", "AMG GT", "AMG GT 4-Door", "Vito", "Sprinter", "Viano", "Citan",
    "190", "200", "220", "250", "280", "300", "320", "350", "380", "400", "420", "450", "500", "560", "600"
  ],
  "Volkswagen": [
    "Golf 1", "Golf 2", "Golf 3", "Golf 4", "Golf 5", "Golf 6", "Golf 7", "Golf 8",
    "Passat B1", "Passat B2", "Passat B3", "Passat B4", "Passat B5", "Passat B5.5", "Passat B6", "Passat B7", "Passat B8",
    "Polo", "Tiguan", "Touareg", "Touran", "Arteon", "T-Roc", "T-Cross", "Taigo", "ID.3", "ID.4", "ID.5", "ID.Buzz",
    "Caddy", "Transporter", "Multivan", "Amarok", "Bora", "Jetta", "Scirocco", "Sharan", "Up!", "Lupo", "Fox", "Corrado", "Eos", "New Beetle"
  ],
  "Skoda": ["Octavia", "Superb", "Fabia", "Kodiaq", "Karoq", "Kamiq", "Scala", "Enyaq", "Rapid", "Yeti", "Roomster", "Citigo", "Felicia", "Favorit"],
  "Toyota": ["Corolla", "Yaris", "RAV4", "C-HR", "Aygo", "Camry", "Land Cruiser", "Hilux", "Prius", "Auris", "Avensis", "Verso", "Supra", "GT86", "GR86"],
  "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Austral", "Arkana", "Talisman", "Scenic", "Espace", "Twingo", "Zoe", "Laguna", "Fluence", "Koleos", "Kangoo"],
  "Peugeot": ["206", "207", "208", "307", "308", "407", "508", "2008", "3008", "5008", "RCZ", "Partner", "Rifter", "Expert", "Boxer", "106", "107", "108"],
  "Ford": ["Focus", "Fiesta", "Mondeo", "Kuga", "Puma", "Mustang", "Mustang Mach-E", "Explorer", "Ranger", "Transit", "Custom", "S-Max", "Galaxy", "EcoSport", "Ka"],
  "Citroen": ["C1", "C2", "C3", "C3 Aircross", "C4", "C4 Cactus", "C4 Picasso", "C5", "C5 Aircross", "C5 X", "Berlingo", "Jumpy", "Jumper", "DS3", "DS4", "DS5"],
  "Fiat": ["500", "500L", "500X", "Panda", "Tipo", "Punto", "Grande Punto", "Bravo", "Stilo", "Doblo", "Ducato", "Fullback", "Talento", "Qubo"],
  "Opel": ["Astra", "Corsa", "Insignia", "Mokka", "Grandland", "Crossland", "Zafira", "Vivaro", "Movano", "Combo", "Adam", "Karl", "Vectra", "Omega", "Meriva"],
  "Hyundai": ["i10", "i20", "i30", "i40", "Tucson", "Santa Fe", "Kona", "Ioniq", "Ioniq 5", "Ioniq 6", "Bayon", "Elantra", "Getz", "Accent"],
  "Kia": ["Ceed", "Sportage", "Sorento", "Rio", "Picanto", "Stinger", "Niro", "EV6", "EV9", "Stonic", "Xceed", "Soul", "Venga", "Optima"],
  "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-9", "MX-5", "RX-7", "RX-8", "BT-50"],
  "Nissan": ["Qashqai", "Juke", "X-Trail", "Navara", "Leaf", "Ariya", "Micra", "Note", "Pulsar", "350Z", "370Z", "GT-R", "Pathfinder", "Patrol"],
  "Honda": ["Civic", "CR-V", "HR-V", "Jazz", "Accord", "NSX", "S2000", "Insight", "FR-V", "Legend"],
  "Volvo": ["XC40", "XC60", "XC90", "V40", "V60", "V90", "S40", "S60", "S90", "C40", "V50", "C30"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Discovery", "Discovery Sport", "Defender", "Freelander"],
  "Dacia": ["Duster", "Sandero", "Logan", "Jogger", "Lodgy", "Dokker", "Spring"],
  "Suzuki": ["Swift", "Vitara", "SX4 S-Cross", "Jimny", "Ignis", "Baleno", "Swace", "Across", "Alto", "Grand Vitara"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra", "Toledo", "Mii", "Altea"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718 Cayman", "718 Boxster"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Roadster", "Cybertruck"],
  "Zastava": ["Yugo", "Skala", "Florida", "101", "128", "750", "Fića", "Tristać", "Poli"],
  "Ostalo": ["Ostalo"]
};

// Generisanje punog kataloga
export const getFullBrands = (): CarBrand[] => {
  return BRANDS_RAW.map((name, index) => ({
    id: `b-${index}`,
    naziv: name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    aktivna: true
  }));
};

export const getFullModels = (brands: CarBrand[]): CarModel[] => {
  const allModels: CarModel[] = [];
  brands.forEach(brand => {
    const models = MODELS_DATA[brand.naziv] || ["Ostalo"];
    models.forEach((modelName, mIndex) => {
      allModels.push({
        id: `m-${brand.id}-${mIndex}`,
        markaId: brand.id,
        naziv: modelName,
        slug: modelName.toLowerCase().replace(/ /g, '-'),
        aktivan: true
      });
    });
    // Svaka marka mora imati "Ostalo" ako ga već nema
    if (!models.includes("Ostalo")) {
      allModels.push({
        id: `m-${brand.id}-fallback`,
        markaId: brand.id,
        naziv: "Ostalo",
        slug: "ostalo",
        aktivan: true
      });
    }
  });
  return allModels;
};
