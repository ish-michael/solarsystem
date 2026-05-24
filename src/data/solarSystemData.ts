import type { Planet, SunData } from '../types';

// Import planet images using Vite's static asset loader
import sunImg from '../assets/sun.jpg';
import mercuryImg from '../assets/mercury.jpg';
import venusImg from '../assets/venus.jpg';
import earthImg from '../assets/earth.jpg';
import marsImg from '../assets/mars.jpg';
import jupiterImg from '../assets/jupiter.jpg';
import saturnImg from '../assets/saturn.jpg';
import uranusImg from '../assets/uranus.jpg';
import neptuneImg from '../assets/neptune.jpg';

export const sunData: SunData = {
  name: "Sonne",
  color: "text-amber-500",
  glowColor: "rgba(245, 158, 11, 0.6)",
  gradientId: "sunGrad",
  gradientStops: [
    { offset: "0%", color: "#fef08a" },   // yellow-200
    { offset: "50%", color: "#f59e0b" },  // amber-500
    { offset: "100%", color: "#ea580c" }  // orange-600
  ],
  radius: 35, // Visual size in solar view
  diameterKm: 1392700,
  tempC: "ca. 5.500 °C (Oberfläche) / 15 Mio. °C (Kern)",
  mass: "1,989 × 10³⁰ kg (99,86% der Systemmasse)",
  description: "Die Sonne ist das Zentrum unseres Sonnensystems. Sie ist ein nahezu perfekter heißer Gasball aus Plasma, der durch die Kernfusion von Wasserstoff zu Helium in seinem Inneren Licht und Wärme erzeugt. Ohne sie gäbe es kein Leben auf der Erde.",
  funFact: "Die Sonne verliert jede Sekunde etwa 4 Millionen Tonnen an Masse, die direkt in Energie umgewandelt wird!",
  atmosphere: "Corona und Chromosphäre, besteht fast ausschließlich aus heißem Plasma (ca. 73% Wasserstoff, 25% Helium).",
  surface: "Keine feste Oberfläche. Sichtbar ist die Photosphäre aus wirbelnden, heißen Gasen und ausgedehnten Sonnenflecken.",
  discoveryYear: "Prähistorisch",
  discoverer: "Unbekannt",
  imagePath: sunImg
};

export const planetsData: Planet[] = [
  {
    id: "mercury",
    name: "Merkur",
    color: "text-slate-400",
    glowColor: "rgba(148, 163, 184, 0.4)",
    gradientId: "mercuryGrad",
    gradientStops: [
      { offset: "0%", color: "#cbd5e1" },   // slate-300
      { offset: "60%", color: "#64748b" },  // slate-500
      { offset: "100%", color: "#334155" }  // slate-700
    ],
    radius: 12,
    orbitRadius: 75,
    orbitalPeriodDays: 87.97,
    distanceFromSunAU: 0.39,
    diameterKm: 4879,
    dayLengthHours: 1407.6,
    tempC: "-180 °C bis 430 °C",
    totalMoonsCount: 0,
    description: "Merkur ist der kleinste und sonnennächste Planet. Da er fast keine Atmosphäre hat, die Wärme speichern kann, herrschen dort extreme Temperaturunterschiede zwischen Tag und Nacht. Seine Oberfläche ist übersät mit unzähligen Kratern, ähnlich unserem Mond.",
    funFact: "Ein Tag-Nacht-Zyklus auf dem Merkur dauert etwa 176 Erdentage, obwohl ein Merkurjahr nur 88 Erdentage lang ist!",
    atmosphere: "Praktisch keine Atmosphäre (nur eine hauchdünne Exosphäre aus Helium, Natrium und Sauerstoff).",
    surface: "Silikatgestein, von Kratern zerfurcht, reich an dunklem vulkanischem Basalt und riesigen Klippen (Rupes).",
    discoveryYear: "ca. 3.000 v. Chr.",
    discoverer: "Sumerer / Babylonier",
    imagePath: mercuryImg,
    moons: []
  },
  {
    id: "venus",
    name: "Venus",
    color: "text-orange-400",
    glowColor: "rgba(251, 146, 60, 0.4)",
    gradientId: "venusGrad",
    gradientStops: [
      { offset: "0%", color: "#ffedd5" },   // orange-100
      { offset: "40%", color: "#fb923c" },  // orange-400
      { offset: "100%", color: "#c2410c" }  // orange-700
    ],
    radius: 16,
    orbitRadius: 110,
    orbitalPeriodDays: 224.7,
    distanceFromSunAU: 0.72,
    diameterKm: 12104,
    dayLengthHours: 5832.5,
    tempC: "ca. 460 °C (Durchschnitt)",
    totalMoonsCount: 0,
    description: "Venus ist der heißeste Planet unseres Sonnensystems, da eine extrem dichte Atmosphäre aus Kohlendioxid einen gigantischen Treibhauseffekt verursacht. Sie wird oft als 'Abendstern' oder 'Morgenstern' bezeichnet, da sie nach dem Mond das hellste Objekt am Nachthimmel ist.",
    funFact: "Die Venus rotiert rückwärts (retrograd) im Vergleich zu fast allen anderen Planeten – die Sonne geht dort also im Westen auf!",
    atmosphere: "Extrem dicht (92-facher Erddruck), bestehend aus 96,5% Kohlendioxid mit dicken Wolken aus Schwefelsäure.",
    surface: "Weite vulkanische Ebenen, erstarrte Lavaströme, tektonische Brüche und heiße Gesteinswüsten.",
    discoveryYear: "Prähistorisch",
    discoverer: "Unbekannt",
    imagePath: venusImg,
    moons: []
  },
  {
    id: "earth",
    name: "Erde",
    color: "text-blue-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
    gradientId: "earthGrad",
    gradientStops: [
      { offset: "0%", color: "#93c5fd" },   // blue-300
      { offset: "50%", color: "#3b82f6" },  // blue-500
      { offset: "100%", color: "#1e3a8a" }  // blue-900
    ],
    radius: 18,
    orbitRadius: 150,
    orbitalPeriodDays: 365.26,
    distanceFromSunAU: 1.0,
    diameterKm: 12742,
    dayLengthHours: 24,
    tempC: "-89 °C bis 58 °C",
    totalMoonsCount: 1,
    description: "Unsere Heimat, die Erde, ist der einzige bekannte Himmelskörper, auf dem Leben existiert. Sie befindet sich in der habitablen Zone und besitzt flüssiges Wasser an der Oberfläche sowie eine Atmosphäre, die reich an Sauerstoff und Stickstoff ist.",
    funFact: "Die Erde ist der einzige Planet unseres Sonnensystems, der nicht nach einer mythologischen Gottheit benannt ist.",
    atmosphere: "Stickstoff (78%), Sauerstoff (21%), Argon (0,9%) sowie lebenswichtige Spurengase wie Kohlendioxid und Wasser.",
    surface: "Zu 71% mit flüssigem Wasser (Ozeanen) bedeckt, Kontinentalplatten aus Granit und Basalt mit tektonischer Dynamik.",
    discoveryYear: "Prähistorisch",
    discoverer: "Menschheit",
    imagePath: earthImg,
    moons: [
      { name: "Mond (Luna)", radiusKm: 1737.4, discoveryYear: undefined, discoverer: "Prähistorisch" }
    ]
  },
  {
    id: "mars",
    name: "Mars",
    color: "text-red-500",
    glowColor: "rgba(239, 68, 68, 0.5)",
    gradientId: "marsGrad",
    gradientStops: [
      { offset: "0%", color: "#fca5a5" },   // red-300
      { offset: "50%", color: "#ef4444" },  // red-500
      { offset: "100%", color: "#7f1d1d" }  // red-900
    ],
    radius: 14,
    orbitRadius: 195,
    orbitalPeriodDays: 686.98,
    distanceFromSunAU: 1.52,
    diameterKm: 6779,
    dayLengthHours: 24.6,
    tempC: "-143 °C bis 35 °C",
    totalMoonsCount: 2,
    description: "Der 'Rote Planet' verdankt seine Farbe dem Eisenoxid (Rost) auf seiner staubigen Oberfläche. Mars besitzt dünne Polkappen aus Eis und Trockeneis sowie den größten bekannten Vulkan des Sonnensystems, den Olympus Mons.",
    funFact: "Mars hat den höchsten Vulkan im Sonnensystem: Olympus Mons ist über 22 Kilometer hoch – fast dreimal so hoch wie der Mount Everest!",
    atmosphere: "Sehr dünn (nur 1% des Erddrucks), bestehend aus 95% Kohlendioxid mit Spuren von Stickstoff und Argon.",
    surface: "Rote Eisenoxid-Staubwüste, gewaltige Grabenbrüche (Valles Marineris), Krater und gefrorene Trockeneis-Polkappen.",
    discoveryYear: "Prähistorisch",
    discoverer: "Unbekannt",
    imagePath: marsImg,
    moons: [
      { name: "Phobos", radiusKm: 11.1, discoveryYear: 1877, discoverer: "Asaph Hall" },
      { name: "Deimos", radiusKm: 6.2, discoveryYear: 1877, discoverer: "Asaph Hall" }
    ]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "text-amber-600",
    glowColor: "rgba(217, 119, 6, 0.4)",
    gradientId: "jupiterGrad",
    gradientStops: [
      { offset: "0%", color: "#fed7aa" },   // orange-200
      { offset: "50%", color: "#d97706" },  // amber-600
      { offset: "100%", color: "#451a03" }  // amber-950
    ],
    radius: 28,
    orbitRadius: 255,
    orbitalPeriodDays: 4332.59,
    distanceFromSunAU: 5.20,
    diameterKm: 139820,
    dayLengthHours: 9.9,
    tempC: "ca. -108 °C (in Wolkenhöhen)",
    totalMoonsCount: 95,
    description: "Jupiter ist der Riese des Sonnensystems – er ist massereicher als alle anderen Planeten zusammen. Dieser Gasriese ist berühmt für seinen 'Großen Roten Fleck', einen gewaltigen Wirbelsturm, der größer als die Erde ist und seit Jahrhunderten tobt.",
    funFact: "Jupiter dreht sich extrem schnell um die eigene Achse: Ein Tag dauert dort weniger als 10 Stunden!",
    atmosphere: "Extrem tief und dicht, bestehend aus ca. 89% Wasserstoff, 10% Helium und Spuren von Methan und Ammoniak.",
    surface: "Keine feste Oberfläche. Unter dem dichten Gasmantel liegt eine Schicht aus metallisch leitfähigem, flüssigem Wasserstoff.",
    discoveryYear: "Prähistorisch",
    discoverer: "Unbekannt",
    imagePath: jupiterImg,
    moons: [
      { name: "Ganymed", radiusKm: 2634.1, discoveryYear: 1610, discoverer: "Galileo Galilei" },
      { name: "Kallisto", radiusKm: 2410.3, discoveryYear: 1610, discoverer: "Galileo Galilei" },
      { name: "Io", radiusKm: 1821.6, discoveryYear: 1610, discoverer: "Galileo Galilei" },
      { name: "Europa", radiusKm: 1560.8, discoveryYear: 1610, discoverer: "Galileo Galilei" },
      { name: "Himalia", radiusKm: 85.0, discoveryYear: 1904, discoverer: "Charles D. Perrine" },
      { name: "Amalthea", radiusKm: 83.5, discoveryYear: 1892, discoverer: "Edward E. Barnard" },
      { name: "Thebe", radiusKm: 49.3, discoveryYear: 1979, discoverer: "Voyager 1 / Stephen P. Synnott" },
      { name: "Elara", radiusKm: 43.0, discoveryYear: 1905, discoverer: "Charles D. Perrine" },
      { name: "Pasiphae", radiusKm: 30.0, discoveryYear: 1908, discoverer: "Philibert J. Melotte" },
      { name: "Carme", radiusKm: 23.0, discoveryYear: 1938, discoverer: "Seth B. Nicholson" }
    ]
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "text-yellow-500",
    glowColor: "rgba(234, 179, 8, 0.4)",
    gradientId: "saturnGrad",
    gradientStops: [
      { offset: "0%", color: "#fef08a" },   // yellow-200
      { offset: "60%", color: "#eab308" },  // yellow-500
      { offset: "100%", color: "#713f12" }  // yellow-950
    ],
    radius: 24,
    orbitRadius: 315,
    orbitalPeriodDays: 10759.22,
    distanceFromSunAU: 9.58,
    diameterKm: 116460,
    dayLengthHours: 10.7,
    tempC: "ca. -139 °C (in Wolkenhöhen)",
    totalMoonsCount: 146,
    description: "Saturn is bekannt für sein spektakuläres Ringsystem, das hauptsächlich aus Eispartikeln, Gesteinstrümmern und kosmischem Staub besteht. Er ist ein Gasriese mit der geringsten Dichte aller Planeten – in einem gigantischen Wasserbecken würde er schwimmen.",
    funFact: "Das Ringsystem des Saturns ist extrem dünn: Es erstreckt sich über Hunderttausende Kilometer, ist aber stellenweise nur etwa 10 Meter dick!",
    atmosphere: "Hauptsächlich Wasserstoff (96%) und Helium (3%) mit turbulenten Sturmwolken aus gefrorenem Ammoniak.",
    surface: "Keine feste Oberfläche. Unter dem riesigen Gasmantel liegt ein heißer, hochverdichteter metallischer Felskern.",
    discoveryYear: "Prähistorisch",
    discoverer: "Unbekannt",
    imagePath: saturnImg,
    moons: [
      { name: "Titan", radiusKm: 2574.7, discoveryYear: 1655, discoverer: "Christiaan Huygens" },
      { name: "Rhea", radiusKm: 763.8, discoveryYear: 1672, discoverer: "Giovanni Domenico Cassini" },
      { name: "Iapetus", radiusKm: 734.5, discoveryYear: 1671, discoverer: "Giovanni Domenico Cassini" },
      { name: "Dione", radiusKm: 561.4, discoveryYear: 1684, discoverer: "Giovanni Domenico Cassini" },
      { name: "Tethys", radiusKm: 531.1, discoveryYear: 1684, discoverer: "Giovanni Domenico Cassini" },
      { name: "Enceladus", radiusKm: 252.1, discoveryYear: 1789, discoverer: "William Herschel" },
      { name: "Mimas", radiusKm: 198.2, discoveryYear: 1789, discoverer: "William Herschel" },
      { name: "Hyperion", radiusKm: 135.0, discoveryYear: 1848, discoverer: "William C. Bond" },
      { name: "Phoebe", radiusKm: 106.5, discoveryYear: 1898, discoverer: "William H. Pickering" },
      { name: "Janus", radiusKm: 89.5, discoveryYear: 1966, discoverer: "Audouin Dollfus" }
    ],
    hasRings: true,
    ringInnerRadius: 28,
    ringOuterRadius: 46
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.4)",
    gradientId: "uranusGrad",
    gradientStops: [
      { offset: "0%", color: "#ecfeff" },   // cyan-50
      { offset: "50%", color: "#22d3ee" },  // cyan-400
      { offset: "100%", color: "#164e63" }  // cyan-900
    ],
    radius: 19,
    orbitRadius: 375,
    orbitalPeriodDays: 30688.5,
    distanceFromSunAU: 19.22,
    diameterKm: 50724,
    dayLengthHours: 17.2,
    tempC: "ca. -197 °C",
    totalMoonsCount: 28,
    description: "Uranus ist ein Eisriese, dessen blaugrüne Färbung durch Methangas in der oberen Atmosphäre entsteht. Seine Rotationsachse ist extrem geneigt (98°), so dass er quasi auf seiner Umlaufbahn rollt. Er besitzt ebenfalls feine, dunkle Ringe.",
    funFact: "Aufgrund seiner extrem gekippten Achse dauern Tag und Nacht an den Polen des Uranus jeweils 42 Erdenjahre!",
    atmosphere: "Wasserstoff (82,5%), Helium (15,2%) und Methan (2,3%), welches das rote Licht absorbiert und ihm das Cyan-Aussehen verleiht.",
    surface: "Ein heißer, hochviskoser Mantel aus Wasser-, Ammoniak- und Methan-Eis über einem kleinen, erdgroßen Gesteinskern.",
    discoveryYear: 1781,
    discoverer: "William Herschel",
    imagePath: uranusImg,
    moons: [
      { name: "Titania", radiusKm: 788.4, discoveryYear: 1787, discoverer: "William Herschel" },
      { name: "Oberon", radiusKm: 761.4, discoveryYear: 1787, discoverer: "William Herschel" },
      { name: "Umbriel", radiusKm: 584.7, discoveryYear: 1851, discoverer: "William Lassell" },
      { name: "Ariel", radiusKm: 578.9, discoveryYear: 1851, discoverer: "William Lassell" },
      { name: "Miranda", radiusKm: 235.8, discoveryYear: 1948, discoverer: "Gerard Kuiper" },
      { name: "Puck", radiusKm: 81.0, discoveryYear: 1985, discoverer: "Voyager 2 / Stephen P. Synnott" },
      { name: "Sycorax", radiusKm: 75.0, discoveryYear: 1997, discoverer: "Brett J. Gladman et al." },
      { name: "Portia", radiusKm: 67.5, discoveryYear: 1986, discoverer: "Voyager 2 / Stephen P. Synnott" },
      { name: "Juliet", radiusKm: 53.0, discoveryYear: 1986, discoverer: "Voyager 2 / Stephen P. Synnott" },
      { name: "Belinda", radiusKm: 45.0, discoveryYear: 1986, discoverer: "Voyager 2 / Stephen P. Synnott" }
    ],
    hasRings: true,
    ringInnerRadius: 22,
    ringOuterRadius: 28
  },
  {
    id: "neptune",
    name: "Neptun",
    color: "text-blue-600",
    glowColor: "rgba(37, 99, 235, 0.4)",
    gradientId: "neptuneGrad",
    gradientStops: [
      { offset: "0%", color: "#bfdbfe" },   // blue-200
      { offset: "50%", color: "#2563eb" },  // blue-600
      { offset: "100%", color: "#1e3a8a" }  // blue-900
    ],
    radius: 19,
    orbitRadius: 430,
    orbitalPeriodDays: 60182.0,
    distanceFromSunAU: 30.05,
    diameterKm: 49244,
    dayLengthHours: 16.1,
    tempC: "ca. -201 °C",
    totalMoonsCount: 16,
    description: "Neptun ist der äußerste bekannte Planet des Sonnensystems und ein stürmischer Eisriese. Seine wunderschöne tiefblaue Farbe unterscheidet ihn von Uranus. In seiner Atmosphäre herrschen die stärksten Winde des Sonnensystems mit Geschwindigkeiten bis zu 2100 km/h.",
    funFact: "Seit seiner Entdeckung im Jahr 1846 hat Neptun erst ein einziges komplettes Neptunjahr (165 Erdenjahre) abgeschlossen – das passierte im Jahr 2011!",
    atmosphere: "Wasserstoff (80%), Helium (19%) und Methan (1,5%) mit stürmischen Winden und eisigen Methanwolken.",
    surface: "Mantel aus ionisiertem Wasser-, Ammoniak- und Methan-Eis ('superionisches Wasser') über einem dichten Felskern.",
    discoveryYear: 1846,
    discoverer: "Johann Gottfried Galle & Urbain Le Verrier",
    imagePath: neptuneImg,
    moons: [
      { name: "Triton", radiusKm: 1353.4, discoveryYear: 1846, discoverer: "William Lassell" },
      { name: "Proteus", radiusKm: 210.0, discoveryYear: 1989, discoverer: "Voyager 2 / Stephen P. Synnott" },
      { name: "Nereid", radiusKm: 170.0, discoveryYear: 1949, discoverer: "Gerard Kuiper" },
      { name: "Larissa", radiusKm: 97.0, discoveryYear: 1981, discoverer: "Harold J. Reitsema et al." },
      { name: "Galatea", radiusKm: 88.0, discoveryYear: 1989, discoverer: "Voyager 2 / Stephen P. Synnott" },
      { name: "Despina", radiusKm: 75.0, discoveryYear: 1989, discoverer: "Voyager 2 / Stephen P. Synnott" },
      { name: "Thalassa", radiusKm: 41.0, discoveryYear: 1989, discoverer: "Voyager 2 / Richard J. Terrile" },
      { name: "Naiad", radiusKm: 33.0, discoveryYear: 1989, discoverer: "Voyager 2 / Richard J. Terrile" },
      { name: "Halimede", radiusKm: 31.0, discoveryYear: 2002, discoverer: "Matthew J. Holman et al." },
      { name: "Neso", radiusKm: 30.0, discoveryYear: 2002, discoverer: "Matthew J. Holman et al." }
    ]
  }
];
