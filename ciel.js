(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const fr = (n, d = 0) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  if (!$('dome')) return;

  const RAD = Math.PI / 180, DEG = 180 / Math.PI;
  const sin = (d) => Math.sin(d * RAD), cos = (d) => Math.cos(d * RAD);
  const norm = (d) => ((d % 360) + 360) % 360;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Données ----------
     Éléments orbitaux moyens des planètes (E. M. Standish, JPL, valables de 1800 à 2050) :
     [valeur en J2000, variation par siècle] pour a (UA), e, I (°), L longitude moyenne (°),
     ϖ longitude du périhélie (°), Ω longitude du nœud ascendant (°) */
  const ORBITS = {
    Mercure: [[0.38709927, 0.00000037], [0.20563593, 0.00001906], [7.00497902, -0.00594749], [252.25032350, 149472.67411175], [77.45779628, 0.16047689], [48.33076593, -0.12534081]],
    Vénus: [[0.72333566, 0.00000390], [0.00677672, -0.00004107], [3.39467605, -0.00078890], [181.97909950, 58517.81538729], [131.60246718, 0.00268329], [76.67984255, -0.27769418]],
    Terre: [[1.00000261, 0.00000562], [0.01671123, -0.00004392], [-0.00001531, -0.01294668], [100.46457166, 35999.37244981], [102.93768193, 0.32327364], [0, 0]],
    Mars: [[1.52371034, 0.00001847], [0.09339410, 0.00007882], [1.84969142, -0.00813131], [-4.55343205, 19140.30268499], [-23.94362959, 0.44441088], [49.55953891, -0.29257343]],
    Jupiter: [[5.20288700, -0.00011607], [0.04838624, -0.00013253], [1.30439695, -0.00183714], [34.39644051, 3034.74612775], [14.72847983, 0.21252668], [100.47390909, 0.20469106]],
    Saturne: [[9.53667594, -0.00125060], [0.05386179, -0.00050991], [2.48599187, 0.00193609], [49.95424423, 1222.49362201], [92.59887831, -0.41897216], [113.66242448, -0.28867794]],
    Uranus: [[19.18916464, -0.00196176], [0.04725744, -0.00004397], [0.77263783, -0.00242939], [313.23810451, 428.48202785], [170.95427630, 0.40805281], [74.01692503, 0.04240589]],
    Neptune: [[30.06992276, 0.00026291], [0.00859048, 0.00005105], [1.77004347, 0.00035372], [-55.12002969, 218.45945325], [44.96476227, -0.32241464], [131.78422574, -0.00508664]],
  };
  // magnitude apparente (J. Meeus) selon la distance au Soleil r, à la Terre d (UA) et l'angle de phase i (°)
  const PLANETS = [
    { name: 'Mercure', color: '#bdbdbd', mag: (r, d, i) => -0.42 + 5 * Math.log10(r * d) + 0.038 * i - 0.000273 * i * i + 0.000002 * i * i * i,
      tip: 'Toujours proche du Soleil : à chercher bas sur l\'horizon, juste après le coucher ou juste avant le lever du Soleil.' },
    { name: 'Vénus', color: '#fff3c4', mag: (r, d, i) => -4.40 + 5 * Math.log10(r * d) + 0.0009 * i + 0.000239 * i * i - 0.00000065 * i * i * i,
      tip: 'L\'« étoile du berger » : l\'astre le plus brillant du ciel après le Soleil et la Lune.' },
    { name: 'Mars', color: '#ff7b4f', mag: (r, d, i) => -1.52 + 5 * Math.log10(r * d) + 0.016 * i,
      tip: 'Reconnaissable à sa couleur orangée. Son éclat varie beaucoup selon sa distance à la Terre.' },
    { name: 'Jupiter', color: '#ffd9a0', mag: (r, d, i) => -9.40 + 5 * Math.log10(r * d) + 0.005 * i,
      tip: 'Très brillante et fixe. Aux jumelles, on aperçoit ses quatre grandes lunes alignées.' },
    { name: 'Saturne', color: '#f0d890', mag: (r, d) => -8.88 + 5 * Math.log10(r * d),
      tip: 'Jaune pâle et paisible. Il faut un petit télescope pour voir ses anneaux.' },
    { name: 'Uranus', color: '#9fe8e8', mag: (r, d) => -7.19 + 5 * Math.log10(r * d), faint: true,
      tip: 'À la limite de l\'œil nu, sous un ciel parfaitement noir : des jumelles et une carte précise aident beaucoup.' },
    { name: 'Neptune', color: '#7f9bff', mag: (r, d) => -6.87 + 5 * Math.log10(r * d), faint: true,
      tip: 'Invisible à l\'œil nu : il faut un télescope.' },
  ];
  const MOON = { name: 'Lune', color: '#e8e8e8' };

  // étoiles brillantes (J2000) : nom, ascension droite (h), déclinaison (°), magnitude
  const STARS = [
    ['Sirius', 6.7525, -16.716, -1.46], ['Canopus', 6.3992, -52.696, -0.74], ['Rigil Kent', 14.66, -60.834, -0.27], ['Arcturus', 14.261, 19.182, -0.05],
    ['Véga', 18.6156, 38.784, 0.03], ['Capella', 5.2782, 45.998, 0.08], ['Rigel', 5.2423, -8.202, 0.13], ['Procyon', 7.655, 5.225, 0.34],
    ['Achernar', 1.6286, -57.237, 0.46], ['Bételgeuse', 5.9195, 7.407, 0.5], ['Hadar', 14.0637, -60.373, 0.61], ['Altaïr', 19.8464, 8.868, 0.76],
    ['Acrux', 12.4433, -63.099, 0.76], ['Aldébaran', 4.5987, 16.509, 0.86], ['Antarès', 16.4901, -26.432, 0.96], ['Spica', 13.4199, -11.161, 0.97],
    ['Pollux', 7.7553, 28.026, 1.14], ['Fomalhaut', 22.9608, -29.622, 1.16], ['Deneb', 20.6905, 45.28, 1.25], ['Régulus', 10.1395, 11.967, 1.36],
    ['Castor', 7.5767, 31.888, 1.58], ['Bellatrix', 5.4189, 6.35, 1.64], ['Alnilam', 5.6036, -1.202, 1.69], ['Alnitak', 5.6793, -1.943, 1.77],
    ['Mintaka', 5.5334, -0.299, 2.23], ['Saiph', 5.7959, -9.67, 2.07], ['Étoile polaire', 2.5303, 89.264, 1.98], ['Dubhe', 11.0621, 61.751, 1.79],
    ['Merak', 11.0307, 56.382, 2.37], ['Phecda', 11.8972, 53.695, 2.44], ['Megrez', 12.2571, 57.033, 3.31], ['Alioth', 12.9005, 55.96, 1.77],
    ['Mizar', 13.3988, 54.925, 2.23], ['Alkaid', 13.7923, 49.313, 1.86], ['Schedar', 0.6751, 56.537, 2.24], ['Caph', 0.153, 59.15, 2.28],
    ['Navi', 0.9451, 60.717, 2.47], ['Ruchbah', 1.4302, 60.235, 2.68], ['Segin', 1.9066, 63.67, 3.37], ['Mirfak', 3.4054, 49.861, 1.79],
    ['Alpheratz', 0.1398, 29.09, 2.06],
  ];
  const STAR = Object.fromEntries(STARS.map((s) => [s[0], s]));
  // tracés des constellations les plus faciles à reconnaître
  const FIGURES = [
    { name: 'Grande Ourse', lines: [['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'], ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid']] },
    { name: 'Orion', lines: [['Bételgeuse', 'Bellatrix'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'], ['Alnitak', 'Bételgeuse'], ['Alnitak', 'Saiph'], ['Saiph', 'Rigel'], ['Rigel', 'Mintaka']] },
    { name: 'Cassiopée', lines: [['Caph', 'Schedar'], ['Schedar', 'Navi'], ['Navi', 'Ruchbah'], ['Ruchbah', 'Segin']] },
    { name: 'Triangle d\'été', dashed: true, lines: [['Véga', 'Deneb'], ['Deneb', 'Altaïr'], ['Altaïr', 'Véga']] },
  ];

  // villes : [nom, latitude, longitude, fuseau horaire]
  const PLACES = [
    { group: 'France métropolitaine', tz: 'Europe/Paris', list: [
      ['Paris', 48.857, 2.352], ['Lille', 50.629, 3.057], ['Strasbourg', 48.573, 7.752], ['Brest', 48.39, -4.486],
      ['Rennes', 48.117, -1.678], ['Nantes', 47.218, -1.554], ['Lyon', 45.764, 4.836], ['Bordeaux', 44.838, -0.579],
      ['Toulouse', 43.605, 1.444], ['Montpellier', 43.611, 3.877], ['Marseille', 43.297, 5.381], ['Nice', 43.71, 7.262],
      ['Ajaccio', 41.919, 8.738]] },
    { group: 'Outre-mer', list: [
      ['Fort-de-France', 14.616, -61.059, 'America/Martinique'], ['Pointe-à-Pitre', 16.241, -61.533, 'America/Guadeloupe'],
      ['Cayenne', 4.938, -52.326, 'America/Cayenne'], ['Saint-Pierre', 46.78, -56.177, 'America/Miquelon'],
      ['Saint-Denis (La Réunion)', -20.882, 55.45, 'Indian/Reunion'], ['Mamoudzou', -12.781, 45.228, 'Indian/Mayotte'],
      ['Nouméa', -22.276, 166.458, 'Pacific/Noumea'], ['Papeete', -17.535, -149.569, 'Pacific/Tahiti']] },
    { group: 'Ailleurs dans le monde', list: [
      ['Bruxelles', 50.847, 4.357, 'Europe/Brussels'], ['Genève', 46.204, 6.143, 'Europe/Zurich'], ['Londres', 51.507, -0.128, 'Europe/London'],
      ['Madrid', 40.417, -3.704, 'Europe/Madrid'], ['Casablanca', 33.573, -7.59, 'Africa/Casablanca'], ['Alger', 36.754, 3.059, 'Africa/Algiers'],
      ['Tunis', 36.806, 10.181, 'Africa/Tunis'], ['Dakar', 14.716, -17.467, 'Africa/Dakar'], ['Abidjan', 5.345, -4.024, 'Africa/Abidjan'],
      ['Montréal', 45.502, -73.567, 'America/Toronto'], ['New York', 40.713, -74.006, 'America/New_York'], ['Tokyo', 35.69, 139.692, 'Asia/Tokyo'],
      ['Sydney', -33.869, 151.209, 'Australia/Sydney']] },
  ];
  const CITIES = [];
  PLACES.forEach((g) => g.list.forEach(([name, lat, lon, tz]) => CITIES.push({ name, lat, lon, tz: tz || g.tz, group: g.group })));

  /* ---------- Calcul des positions ---------- */
  const julian = (ms) => ms / 864e5 + 2440587.5;

  // position héliocentrique écliptique (UA, repère J2000) d'après les éléments orbitaux
  function heliocentric(o, T) {
    const [a, e, I, L, w, O] = o.map(([v, r]) => v + r * T);
    const om = w - O;
    let M = norm(L - w);
    if (M > 180) M -= 360;
    let E = M + e * DEG * sin(M);
    for (let k = 0; k < 6; k++) E -= (E - e * DEG * sin(E) - M) / (1 - e * cos(E));
    const xp = a * (cos(E) - e), yp = a * Math.sqrt(1 - e * e) * sin(E);
    return [
      (cos(om) * cos(O) - sin(om) * sin(O) * cos(I)) * xp + (-sin(om) * cos(O) - cos(om) * sin(O) * cos(I)) * yp,
      (cos(om) * sin(O) + sin(om) * cos(O) * cos(I)) * xp + (-sin(om) * sin(O) + cos(om) * cos(O) * cos(I)) * yp,
      sin(om) * sin(I) * xp + cos(om) * sin(I) * yp,
    ];
  }
  // coordonnées écliptiques (°) → équatoriales (ascension droite, déclinaison en °)
  function equatorial(lon, lat, T) {
    const eps = 23.439291 - 0.0130042 * T;
    const ra = Math.atan2(sin(lon) * cos(eps) - Math.tan(lat * RAD) * sin(eps), cos(lon)) * DEG;
    const dec = Math.asin(sin(lat) * cos(eps) + cos(lat) * sin(eps) * sin(lon)) * DEG;
    return [norm(ra), dec];
  }
  // positions géocentriques du Soleil, de la Lune et des planètes à l'instant ms
  function positions(ms) {
    const jd = julian(ms), T = (jd - 2451545) / 36525, prec = 1.396971 * T; // précession des équinoxes
    const earth = heliocentric(ORBITS.Terre, T), R = Math.hypot(...earth);
    const sunLon = norm(Math.atan2(-earth[1], -earth[0]) * DEG + prec);
    const out = { jd, Soleil: { eq: equatorial(sunLon, 0, T), lon: sunLon } };
    PLANETS.forEach((b) => {
      const p = heliocentric(ORBITS[b.name], T);
      const g = [p[0] - earth[0], p[1] - earth[1], p[2] - earth[2]];
      const d = Math.hypot(...g), r = Math.hypot(...p);
      const lon = norm(Math.atan2(g[1], g[0]) * DEG + prec), lat = Math.asin(g[2] / d) * DEG;
      const i = Math.acos(clamp((r * r + d * d - R * R) / (2 * r * d), -1, 1)) * DEG;
      out[b.name] = { eq: equatorial(lon, lat, T), lon, mag: b.mag(r, d, i), dist: d };
    });
    // la Lune : série abrégée de l'Astronomical Almanac (précision ≈ 0,3°)
    const lm = norm(218.32 + 481267.881 * T + 6.29 * sin(135.0 + 477198.87 * T) - 1.27 * sin(259.3 - 413335.36 * T)
      + 0.66 * sin(235.7 + 890534.22 * T) + 0.21 * sin(269.9 + 954397.74 * T) - 0.19 * sin(357.5 + 35999.05 * T) - 0.11 * sin(186.5 + 966404.03 * T));
    const bm = 5.13 * sin(93.3 + 483202.02 * T) + 0.28 * sin(228.2 + 960400.89 * T) - 0.28 * sin(318.3 + 6003.15 * T) - 0.17 * sin(217.6 - 407332.21 * T);
    const par = 0.9508 + 0.0518 * cos(135.0 + 477198.87 * T) + 0.0095 * cos(259.3 - 413335.36 * T) + 0.0078 * cos(235.7 + 890534.22 * T) + 0.0028 * cos(269.9 + 954397.74 * T);
    const elong = norm(lm - sunLon);
    out.Lune = { eq: equatorial(lm, bm, T), lon: lm, par, elong, lit: (1 - cos(elong) * cos(bm)) / 2 };
    return out;
  }
  // hauteur et azimut (° , azimut compté depuis le nord vers l'est)
  function horizontal([ra, dec], jd, place) {
    const H = norm(280.46061837 + 360.98564736629 * (jd - 2451545)) + place.lon - ra;
    const alt = Math.asin(sin(place.lat) * sin(dec) + cos(place.lat) * cos(dec) * cos(H)) * DEG;
    const az = norm(Math.atan2(sin(H), cos(H) * sin(place.lat) - Math.tan(dec * RAD) * cos(place.lat)) * DEG + 180);
    return { alt, az };
  }
  function sky(ms, place) {
    const P = positions(ms), out = { ms, P };
    out.Soleil = horizontal(P.Soleil.eq, P.jd, place);
    PLANETS.forEach((b) => { out[b.name] = horizontal(P[b.name].eq, P.jd, place); });
    const m = horizontal(P.Lune.eq, P.jd, place);
    m.alt -= P.Lune.par * cos(m.alt); // parallaxe : vue depuis la surface de la Terre
    out.Lune = m;
    return out;
  }

  /* ---------- Heures locales ---------- */
  const parts = (ms, tz) => {
    const o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
      .formatToParts(new Date(ms)).forEach((p) => { o[p.type] = +p.value; });
    return o;
  };
  const offset = (ms, tz) => { const p = parts(ms, tz); return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - Math.floor(ms / 1000) * 1000; };
  // instant (ms) correspondant à une date et une heure locales dans le fuseau tz
  function zoned(y, m, d, h, min, tz) {
    const guess = Date.UTC(y, m - 1, d, h, min);
    let ms = guess - offset(guess, tz);
    ms = guess - offset(ms, tz);
    return ms;
  }
  const clock = (ms, tz) => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date(ms)).replace(':', ' h ').replace(/^0(\d)/, '$1');
  const dayName = (ms, tz) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: tz }).format(new Date(ms)).replace(/(^|\s)1 (?=\D)/, '$11er ');
  const DIRS = ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ouest', 'ouest', 'nord-ouest'];
  const direction = (az) => DIRS[Math.round(norm(az) / 45) % 8];
  const towards = (az) => { const w = direction(az); return (/^[eo]/.test(w) ? 'vers l\'' : 'vers le ') + w; };

  /* ---------- La nuit choisie : de midi à midi le lendemain, toutes les 5 minutes ---------- */
  const STEP = 5, N = 24 * 60 / STEP;
  function night(place, date) {
    const [y, m, d] = date.split('-').map(Number);
    const start = zoned(y, m, d, 12, 0, place.tz);
    const S = [];
    for (let k = 0; k <= N; k++) S.push(sky(start + k * STEP * 6e4, place));
    // passages d'un astre au-dessus d'une hauteur h (lever) ou en dessous (coucher)
    const cross = (name, h) => {
      const ev = [];
      for (let k = 1; k <= N; k++) {
        const a = S[k - 1][name].alt - h, b = S[k][name].alt - h;
        if ((a < 0) !== (b < 0)) {
          const f = a / (a - b);
          const az = S[k - 1][name].az + ((S[k][name].az - S[k - 1][name].az + 540) % 360 - 180) * f;
          ev.push({ up: b > a, ms: S[k - 1].ms + f * STEP * 6e4, az: norm(az) });
        }
      }
      return ev;
    };
    const dark = (k) => S[k].Soleil.alt < -6; // fin du crépuscule civil : les planètes brillantes apparaissent
    const sun = {
      set: cross('Soleil', -0.833).find((e) => !e.up), rise: cross('Soleil', -0.833).find((e) => e.up),
      dusk: cross('Soleil', -6).find((e) => !e.up), dawn: cross('Soleil', -6).find((e) => e.up),
      darkStart: cross('Soleil', -18).find((e) => !e.up), darkEnd: cross('Soleil', -18).find((e) => e.up),
      night: S.some((s, k) => dark(k)),
    };
    const bodies = PLANETS.concat([MOON]).map((b) => {
      const h0 = b === MOON ? -0.833 + 0.27 : -0.567;
      const ev = cross(b.name, h0);
      let top = -1, best = -1, first = -1, last = -1;
      S.forEach((s, k) => {
        if (top < 0 || s[b.name].alt > S[top][b.name].alt) top = k;
        if (dark(k) && s[b.name].alt > (b.name === 'Mercure' ? 3 : 7)) {
          if (first < 0) first = k;
          last = k;
          if (best < 0 || s[b.name].alt > S[best][b.name].alt) best = k;
        }
      });
      const mid = Math.floor(N / 2);
      const P = S[best >= 0 ? best : mid].P[b.name];
      return { b, rise: ev.find((e) => e.up), set: ev.find((e) => !e.up), top, best, first, last, P, mag: P.mag };
    });
    return { place, date, start, S, sun, bodies };
  }

  /* ---------- Textes ---------- */
  const brightness = (m) => m < -3 ? 'éblouissante' : m < -1 ? 'très brillante' : m < 1 ? 'brillante' : m < 3 ? 'bien visible' : m < 6 ? 'faible, loin des villes' : 'télescope';
  function when(n, x) {
    if (x.best < 0) return null;
    const firstDark = n.S.findIndex((s) => s.Soleil.alt < -6), lastDark = N - [...n.S].reverse().findIndex((s) => s.Soleil.alt < -6);
    const early = x.first <= firstDark + 3, late = x.last >= lastDark - 3;
    if (early && late) return 'toute la nuit';
    if (x.last - x.first >= 0.6 * (lastDark - firstDark)) return 'presque toute la nuit';
    if (early) return 'en soirée';
    if (late) return 'en fin de nuit';
    return 'en pleine nuit';
  }
  function moonPhase(e) {
    if (e < 12 || e > 348) return 'nouvelle lune';
    if (e < 80) return 'premier croissant';
    if (e < 100) return 'premier quartier';
    if (e < 168) return 'gibbeuse croissante';
    if (e < 192) return 'pleine lune';
    if (e < 260) return 'gibbeuse décroissante';
    if (e < 280) return 'dernier quartier';
    return 'dernier croissant';
  }

  /* ---------- État ---------- */
  const remembered = () => {
    try { const i = CITIES.findIndex((c) => c.name === localStorage.getItem('astrolabe-ville')); return i >= 0 ? i : 0; } catch (e) { return 0; }
  };
  let place = CITIES[remembered()];
  let current = null; // nuit calculée
  let selected = null; // astre mis en avant
  const todayIn = (tz) => { const p = parts(Date.now(), tz); return p.year + '-' + String(p.month).padStart(2, '0') + '-' + String(p.day).padStart(2, '0'); };

  const select$ = $('c-place'), date$ = $('c-date'), time$ = $('c-time');
  PLACES.forEach((g) => {
    const og = document.createElement('optgroup');
    og.label = g.group;
    CITIES.forEach((c, i) => { if (c.group === g.group) og.appendChild(new Option(c.name, String(i))); });
    select$.appendChild(og);
  });
  select$.value = String(CITIES.indexOf(place));

  // minutes écoulées depuis midi (heure locale) ; par défaut 22 h, ou maintenant s'il fait nuit
  function defaultTime() {
    const p = parts(Date.now(), place.tz);
    const now = ((p.hour - 12 + 24) % 24) * 60 + p.minute;
    return date$.value === todayIn(place.tz) || (p.hour < 12 && date$.value === yesterday(place.tz)) ? (now >= 360 ? now : 600) : 600;
  }
  const yesterday = (tz) => { const p = parts(Date.now() - 864e5, tz); return p.year + '-' + String(p.month).padStart(2, '0') + '-' + String(p.day).padStart(2, '0'); };

  function compute() {
    current = night(place, date$.value);
    renderSummary();
    renderList();
    renderMoment();
  }

  /* ---------- Résumé de la nuit ---------- */
  function renderSummary() {
    const n = current, tz = place.tz, s = n.sun;
    const seen = n.bodies.filter((x) => x.b !== MOON && x.best >= 0 && !x.b.faint).sort((a, b) => a.mag - b.mag);
    const moon = n.bodies.find((x) => x.b === MOON);
    let txt;
    if (!s.night) txt = 'À ' + place.name + ', le ciel ne devient jamais vraiment noir cette nuit-là : les planètes se perdent dans la clarté.';
    else if (!seen.length) txt = 'Nuit sans planète à l\'œil nu à ' + place.name + ' : elles sont toutes trop près du Soleil ou sous l\'horizon. Profites-en pour les étoiles !';
    else {
      txt = (seen.length === 1 ? '1 planète visible' : seen.length + ' planètes visibles') + ' à l\'œil nu depuis ' + place.name + ' : ' +
        seen.map((x) => x.b.name + ' (' + when(n, x) + ', ' + towards(n.S[x.best][x.b.name].az) + ')').join(', ') + '.';
    }
    $('c-verdict').textContent = txt;
    $('c-night').textContent = 'Nuit du ' + dayName(n.start, tz) + ' · heures de ' + (tz === 'Europe/Paris' ? 'France métropolitaine' : place.name);

    const dl = $('c-sun');
    dl.textContent = '';
    const t = (e, fallback) => e ? clock(e.ms, tz) : fallback;
    const stats = [
      ['Coucher du Soleil', t(s.set, '—'), s.set ? towards(s.set.az) : 'pas de coucher'],
      ['Nuit noire', s.darkStart ? clock(s.darkStart.ms, tz) + ' → ' + t(s.darkEnd, '…') : '—', s.darkStart ? 'Soleil à plus de 18° sous l\'horizon' : 'pas de nuit noire'],
      ['Lever du Soleil', t(s.rise, '—'), s.rise ? towards(s.rise.az) : 'pas de lever'],
      ['Lune', moonPhase(moon.P.elong), 'éclairée à ' + fr(moon.P.lit * 100) + ' %' + (moon.rise ? ' · lever ' + clock(moon.rise.ms, tz) : '') + (moon.set ? ' · coucher ' + clock(moon.set.ms, tz) : '')],
    ];
    stats.forEach(([k, v, note]) => {
      const wrap = el('div');
      wrap.appendChild(el('dt', null, k));
      const dd = el('dd', null, v);
      if (note) dd.appendChild(el('small', null, note));
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    });
  }

  /* ---------- Planète par planète ---------- */
  function renderList() {
    const n = current, tz = place.tz, list = $('c-list');
    list.textContent = '';
    const head = el('div', 'sky-row sky-head');
    head.setAttribute('aria-hidden', 'true');
    ['Astre', 'Cette nuit', 'Lever', 'Au plus haut', 'Coucher', 'Éclat'].forEach((t) => head.appendChild(el('span', null, t)));
    list.appendChild(head);
    n.bodies.forEach((x) => {
      const b = x.b, row = el('button', 'sky-row');
      row.type = 'button';
      row.setAttribute('aria-pressed', String(selected === b.name));
      const name = el('span', 'sky-name');
      const dot = el('i');
      dot.style.background = b.color;
      name.appendChild(dot);
      name.appendChild(document.createTextNode(b.name));
      row.appendChild(name);
      const w = when(n, x);
      const status = el('span', 'sky-when' + (w ? ' seen' : ''), w ? 'Visible ' + w : 'Pas visible');
      status.appendChild(el('small', null, w ? 'au mieux vers ' + clock(n.S[x.best].ms, tz) : b === MOON ? 'sous l\'horizon la nuit' : 'trop près du Soleil ou couchée'));
      row.appendChild(status);
      const ev = (e, verb) => {
        const s = el('span', 'num', e ? clock(e.ms, tz) : '—');
        s.appendChild(el('small', null, e ? direction(e.az) : verb));
        return s;
      };
      row.appendChild(ev(x.rise, 'déjà levée'));
      const top = n.S[x.top][b.name];
      const hi = el('span', 'num', top.alt > 0 ? clock(n.S[x.top].ms, tz) : '—');
      hi.appendChild(el('small', null, top.alt > 0 ? fr(top.alt) + '° · ' + direction(top.az) : 'reste sous l\'horizon'));
      row.appendChild(hi);
      row.appendChild(ev(x.set, 'reste levée'));
      const glow = el('span', 'num', b === MOON ? fr(x.P.lit * 100) + ' %' : 'mag. ' + fr(x.mag, 1));
      glow.appendChild(el('small', null, b === MOON ? moonPhase(x.P.elong) : brightness(x.mag)));
      row.appendChild(glow);
      row.title = b.tip || '';
      row.addEventListener('click', () => {
        selected = selected === b.name ? null : b.name;
        if (selected && x.best >= 0) { time$.value = String(Math.round((n.S[x.best].ms - n.start) / 6e4 / 5) * 5); }
        renderList(); renderMoment();
      });
      list.appendChild(row);
    });
  }

  /* ---------- La carte du ciel à l'heure choisie ---------- */
  const canvas = $('dome'), ctx = canvas.getContext('2d');
  let size = 0;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    size = canvas.clientWidth;
    canvas.width = canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (current) renderMoment();
  }
  // projection : zénith au centre, horizon sur le cercle, nord en haut et est à gauche (carte tenue au-dessus de la tête)
  const project = (alt, az, c, R) => {
    const r = (90 - alt) / 90 * R;
    return [c - r * sin(az), c - r * cos(az)];
  };

  function renderMoment() {
    if (!current || !size) return;
    const n = current, tz = place.tz;
    const ms = n.start + (+time$.value) * 6e4;
    const now = sky(ms, place);
    const sunAlt = now.Soleil.alt;
    $('c-clock').textContent = clock(ms, tz);
    $('c-light').textContent = sunAlt > -0.833 ? 'il fait jour' : sunAlt > -6 ? 'crépuscule' : sunAlt > -12 ? 'crépuscule, les planètes brillantes apparaissent' : sunAlt > -18 ? 'presque nuit noire' : 'nuit noire';

    const c = size / 2, R = size / 2 - 26;
    ctx.clearRect(0, 0, size, size);
    // couleur du ciel selon la hauteur du Soleil
    const day = clamp((sunAlt + 18) / 18, 0, 1);
    const grad = ctx.createRadialGradient(c, c, 0, c, c, R);
    grad.addColorStop(0, `rgb(${Math.round(5 + 20 * day)}, ${Math.round(6 + 50 * day)}, ${Math.round(16 + 95 * day)})`);
    grad.addColorStop(1, `rgb(${Math.round(12 + 60 * day)}, ${Math.round(10 + 70 * day)}, ${Math.round(28 + 110 * day)})`);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(c, c, R, 0, 6.2832); ctx.fill();

    // repères de hauteur et points cardinaux
    ctx.strokeStyle = 'rgba(255, 255, 255, .08)';
    [30, 60].forEach((h) => { ctx.beginPath(); ctx.arc(c, c, (90 - h) / 90 * R, 0, 6.2832); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(255, 255, 255, .35)';
    ctx.beginPath(); ctx.arc(c, c, R, 0, 6.2832); ctx.stroke();
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SO', 225], ['O', 270], ['NO', 315]].forEach(([t, az]) => {
      const x = c - (R + 14) * sin(az), y = c - (R + 14) * cos(az);
      ctx.fillStyle = t.length === 1 ? '#ffb829' : '#6a6a6a';
      ctx.fillText(t, x, y);
    });

    ctx.save();
    ctx.beginPath(); ctx.arc(c, c, R, 0, 6.2832); ctx.clip();
    const starsUp = sunAlt < -4;
    const jd = julian(ms);
    const stars = {};
    STARS.forEach(([name, ra, dec, mag]) => { stars[name] = { ...horizontal([ra * 15, dec], jd, place), mag }; });
    if (starsUp) {
      ctx.globalAlpha = clamp((-4 - sunAlt) / 10, 0.25, 1);
      // constellations
      FIGURES.forEach((f) => {
        ctx.strokeStyle = 'rgba(128, 82, 255, .55)';
        ctx.setLineDash(f.dashed ? [3, 4] : []);
        let shown = 0, sx = 0, sy = 0;
        f.lines.forEach(([a, b]) => {
          const A = stars[a], B = stars[b];
          if (A.alt < 0 && B.alt < 0) return;
          const [x1, y1] = project(A.alt, A.az, c, R), [x2, y2] = project(B.alt, B.az, c, R);
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          shown++; sx += x1 + x2; sy += y1 + y2;
        });
        ctx.setLineDash([]);
        if (shown >= f.lines.length - 1) {
          ctx.fillStyle = 'rgba(170, 145, 255, .8)';
          ctx.font = '400 11px Inter, sans-serif';
          ctx.fillText(f.name, sx / (shown * 2), sy / (shown * 2) + 14);
        }
      });
      // étoiles
      Object.entries(stars).forEach(([name, s]) => {
        if (s.alt < 0) return;
        const [x, y] = project(s.alt, s.az, c, R);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x, y, clamp(2.6 - s.mag * 0.55, 0.8, 3.4), 0, 6.2832); ctx.fill();
        if (s.mag < 1.3 || name === 'Étoile polaire') {
          ctx.fillStyle = 'rgba(255, 255, 255, .5)';
          ctx.font = '400 10px Inter, sans-serif';
          ctx.fillText(name, x, y + 11);
        }
      });
      ctx.globalAlpha = 1;
    }
    // l'écliptique : le chemin du Soleil, de la Lune et des planètes
    ctx.strokeStyle = 'rgba(255, 184, 41, .28)';
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    let pen = false;
    const T = (jd - 2451545) / 36525;
    for (let l = 0; l <= 360; l += 3) {
      const h = horizontal(equatorial(l, 0, T), jd, place);
      if (h.alt < -1) { pen = false; continue; }
      const [x, y] = project(h.alt, h.az, c, R);
      if (pen) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      pen = true;
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Soleil, Lune et planètes
    const marks = [];
    if (sunAlt > -1) {
      const [x, y] = project(Math.max(sunAlt, 0), now.Soleil.az, c, R);
      const g = ctx.createRadialGradient(x, y, 0, x, y, 18);
      g.addColorStop(0, '#fff6dc'); g.addColorStop(0.35, '#ffb829'); g.addColorStop(1, 'rgba(255, 184, 41, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 18, 0, 6.2832); ctx.fill();
      marks.push(['Soleil', x, y, 9, '#ffb829']);
    }
    const ml = now.Lune;
    if (ml.alt > -0.5) {
      const [x, y] = project(Math.max(ml.alt, 0), ml.az, c, R), P = now.P.Lune;
      drawMoon(x, y, 7, P.lit, P.elong < 180);
      marks.push(['Lune', x, y, 8, '#e8e8e8']);
    }
    PLANETS.forEach((b) => {
      const h = now[b.name];
      if (h.alt < 0) return;
      const [x, y] = project(h.alt, h.az, c, R), mag = now.P[b.name].mag;
      const r = clamp(3.6 - mag * 0.5, 1.6, 5.5);
      ctx.fillStyle = b.color;
      ctx.globalAlpha = sunAlt > -4 && mag > -2 ? 0.45 : 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
      marks.push([b.name, x, y, r, b.color]);
    });
    // noms, en évitant les chevauchements
    const boxes = [];
    ctx.font = '600 12px Inter, sans-serif';
    marks.sort((a, b) => (a[0] === selected ? -1 : b[0] === selected ? 1 : 0)).forEach(([name, x, y, r, color]) => {
      const w = ctx.measureText(name).width;
      const tries = [[0, -r - 10], [0, r + 12], [w / 2 + r + 6, 0], [-w / 2 - r - 6, 0]];
      let pos = tries[0];
      for (const t of tries) {
        const bx = [x + t[0] - w / 2 - 2, y + t[1] - 8, x + t[0] + w / 2 + 2, y + t[1] + 8];
        if (!boxes.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) { pos = t; break; }
      }
      boxes.push([x + pos[0] - w / 2 - 2, y + pos[1] - 8, x + pos[0] + w / 2 + 2, y + pos[1] + 8]);
      if (name === selected) {
        ctx.strokeStyle = '#ffb829'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, r + 6, 0, 6.2832); ctx.stroke();
        ctx.lineWidth = 1;
      }
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0, 0, 0, .8)'; ctx.lineJoin = 'round';
      ctx.strokeText(name, x + pos[0], y + pos[1]);
      ctx.lineWidth = 1;
      ctx.fillStyle = name === selected ? '#ffb829' : color;
      ctx.fillText(name, x + pos[0], y + pos[1]);
    });
    ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';

    // ce qu'on voit à cet instant
    const up = PLANETS.filter((b) => now[b.name].alt > 0).map((b) => {
      const w = direction(now[b.name].az);
      return b.name + ' ' + fr(now[b.name].alt) + '° ' + (/^[eo]/.test(w) ? 'à l\'' : 'au ') + w;
    });
    $('dome').setAttribute('aria-label', 'Carte du ciel à ' + clock(ms, tz) + ' depuis ' + place.name + '. ' + (up.length ? 'Au-dessus de l\'horizon : ' + up.join(', ') + '.' : 'Aucune planète au-dessus de l\'horizon.'));
    $('c-up').textContent = up.length ? 'Au-dessus de l\'horizon à ' + clock(ms, tz) + ' : ' + up.join(' · ') : 'Aucune planète au-dessus de l\'horizon à ' + clock(ms, tz) + '.';
  }
  // Lune avec sa phase : partie éclairée du côté du Soleil (simplifié : à droite quand elle croît)
  function drawMoon(x, y, r, lit, waxing) {
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    ctx.fillStyle = '#f2f2f2';
    ctx.beginPath();
    const s = waxing ? 1 : -1, k = 1 - 2 * lit; // demi-axe du terminateur
    ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, s < 0);
    ctx.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, (k > 0) === (s > 0));
    ctx.fill();
  }

  /* ---------- Commandes ---------- */
  date$.value = todayIn(place.tz);
  time$.value = String(defaultTime());
  select$.addEventListener('change', () => {
    place = CITIES[+select$.value];
    try { localStorage.setItem('astrolabe-ville', place.name); } catch (e) { /* mémoire indisponible */ }
    compute();
  });
  date$.addEventListener('change', () => { if (date$.value) compute(); });
  time$.addEventListener('input', renderMoment);
  $('c-now').addEventListener('click', () => {
    const p = parts(Date.now(), place.tz);
    date$.value = p.hour < 12 ? yesterday(place.tz) : todayIn(place.tz);
    time$.value = String(((p.hour - 12 + 24) % 24) * 60 + p.minute - (p.minute % 5));
    compute();
  });
  $('c-prev').addEventListener('click', () => shift(-1));
  $('c-next').addEventListener('click', () => shift(1));
  function shift(days) {
    const [y, m, d] = date$.value.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + days));
    date$.value = t.toISOString().slice(0, 10);
    compute();
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  compute();
})();
