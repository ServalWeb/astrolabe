(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const fr = (n, d = 0) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const ALL = window.ECLIPSES || [];
  if (!ALL.length || !$('earth')) return;

  /* ---------- Textes ---------- */
  const TYPES = {
    T: { one: 'Éclipse totale', short: 'Totale', band: 'Totalité', zone: 'Totale', color: '#ffffff',
      what: 'La Lune passe exactement devant le Soleil et le cache entièrement. Dans la bande noire, le jour s\'assombrit en quelques secondes, les étoiles apparaissent et la couronne solaire se dévoile autour du disque noir. Partout ailleurs dans la zone colorée, l\'éclipse n\'est que partielle.' },
    A: { one: 'Éclipse annulaire', short: 'Annulaire', band: 'Anneau', zone: 'Annulaire', color: '#ffb829',
      what: 'La Lune, un peu trop loin de la Terre ce jour-là, paraît plus petite que le Soleil : même parfaitement alignée, elle laisse dépasser un anneau de lumière, l\'« anneau de feu ». Hors de la bande noire, l\'éclipse est partielle.' },
    H: { one: 'Éclipse hybride', short: 'Hybride', band: 'Phase centrale', zone: 'Totale ou annulaire', color: '#ff7a59',
      what: 'Une éclipse à double visage : selon l\'endroit, la Lune cache entièrement le Soleil ou laisse un mince anneau. La courbure de la Terre rapproche certains lieux de la Lune juste assez pour que son ombre les atteigne.' },
    P: { one: 'Éclipse partielle', short: 'Partielle', color: '#8052ff',
      what: 'L\'ombre de la Lune frôle la Terre sans la toucher : personne ne voit le Soleil entièrement caché, seulement une partie grignotée par la Lune.' },
  };

  // region : zone de l'éclipse partielle d'après la NASA ; fact : le fait marquant
  const TEXTS = {
    '2027-02-06': { region: 'Amérique du Sud, Antarctique, ouest et sud de l\'Afrique',
      fact: 'La Lune, loin de la Terre ce jour-là, paraît nettement plus petite que le Soleil : l\'anneau de lumière est large et peut durer jusqu\'à 7 min 51 s.' },
    '2027-08-02': { region: 'Afrique, Europe, Moyen-Orient, ouest et sud de l\'Asie',
      fact: 'Près de Louxor, en Égypte, la nuit tombe en plein jour pendant 6 min 23 s : aucune éclipse totale ne durera aussi longtemps sur la terre ferme avant 2114.' },
    '2028-01-26': { region: 'est de l\'Amérique du Nord, Amérique centrale et du Sud, ouest de l\'Europe, nord-ouest de l\'Afrique',
      fact: 'Avec 10 min 27 s d\'anneau au maximum, c\'est l\'une des éclipses annulaires les plus longues du siècle. L\'anneau traverse l\'Amazonie et une partie de la Guyane, puis l\'Atlantique, et atteint le Portugal et l\'Espagne au coucher du Soleil.' },
    '2028-07-22': { region: 'Asie du Sud-Est, Indonésie, Australie, Nouvelle-Zélande',
      fact: 'La bande de totalité traverse toute l\'Australie et passe en plein sur Sydney, qui n\'avait pas vu d\'éclipse totale depuis 1857.' },
    '2029-01-14': { region: 'Amérique du Nord, Amérique centrale',
      fact: 'C\'est la première des quatre éclipses de Soleil de 2029, toutes partielles. Une année avec quatre éclipses de Soleil n\'arrive que quelques fois par siècle.' },
    '2029-06-12': { region: 'Arctique, Scandinavie, Alaska, nord de l\'Asie, nord du Canada',
      fact: 'Dans l\'Arctique canadien, elle se produit vers minuit, sous le soleil de minuit de l\'été polaire.' },
    '2029-07-11': { region: 'sud du Chili et de l\'Argentine',
      fact: 'Une éclipse discrète : au mieux, la Lune ne cache qu\'un quart du diamètre du Soleil, et seulement tout au sud de l\'Amérique.' },
    '2029-12-05': { region: 'sud de l\'Argentine et du Chili, Antarctique',
      fact: 'Quatrième et dernière éclipse de 2029. Elle est surtout visible depuis l\'Antarctique, où c\'est l\'été et où le Soleil ne se couche presque plus.' },
    '2030-06-01': { region: 'Europe, nord de l\'Afrique, Moyen-Orient, Asie, Arctique, Alaska',
      fact: 'L\'anneau de feu traverse l\'Afrique du Nord, la Grèce, la Turquie, la Russie puis le Japon. En France, l\'éclipse est partielle, en tout début de matinée.' },
    '2030-11-25': { region: 'sud de l\'Afrique, sud de l\'océan Indien, Indonésie, Australie, Antarctique',
      fact: 'Elle appartient au même saros, le 133, que l\'éclipse totale de novembre 2012 vue dans le nord de l\'Australie : les éclipses d\'un même saros reviennent tous les 18 ans et 11 jours, décalées d\'un tiers de tour vers l\'ouest.' },
    '2031-05-21': { region: 'Afrique, sud de l\'Asie, Indonésie, Australie',
      fact: 'L\'anneau traverse toute l\'Afrique centrale, puis l\'océan Indien jusqu\'au sud de l\'Inde et au Sri Lanka, avant de finir en Indonésie.' },
    '2031-11-14': { region: 'Pacifique, sud des États-Unis, Amérique centrale, nord-ouest de l\'Amérique du Sud',
      fact: 'Une éclipse hybride, le type le plus rare (moins de 5 % des éclipses) : annulaire au début et à la fin de son trajet, elle devient totale au milieu, là où la surface de la Terre est un peu plus proche de la Lune.' },
    '2032-05-09': { region: 'sud de l\'Amérique du Sud, sud de l\'Afrique',
      fact: 'Un anneau d\'une finesse extrême : la Lune couvre 99,6 % du diamètre du Soleil, et l\'anneau ne dure que 22 secondes, au-dessus de l\'Atlantique Sud, loin de toute terre habitée.' },
    '2032-11-03': { region: 'Asie',
      fact: 'Partielle dans une grande partie de l\'Asie : au maximum, près du pôle Nord, la Lune cache plus de 85 % du diamètre du Soleil.' },
    '2033-03-30': { region: 'Amérique du Nord, extrême est de la Russie',
      fact: 'L\'ombre arrive en biais, près du pôle Nord : la bande de totalité s\'étale sur 781 km de large, trois fois plus que d\'habitude.' },
    '2033-09-23': { region: 'sud de l\'Amérique du Sud, Antarctique',
      fact: 'Au maximum, près des côtes de l\'Antarctique, la Lune cache plus des deux tiers du diamètre du Soleil.' },
    '2034-03-20': { region: 'Afrique, Europe, ouest de l\'Asie',
      fact: 'Elle a lieu le jour de l\'équinoxe de printemps. La totalité, qui dure jusqu\'à 4 min 09 s, traverse l\'Afrique, l\'Arabie, l\'Iran et l\'Himalaya jusqu\'en Chine.' },
    '2034-09-12': { region: 'Amérique centrale, Amérique du Sud',
      fact: 'Elle arrive presque six mois après l\'éclipse totale de mars 2034 : les éclipses vont par « saisons », environ tous les six mois, quand la Lune croise le plan de l\'orbite terrestre au bon moment.' },
    '2035-03-09': { region: 'Australie, Nouvelle-Zélande, Pacifique Sud, Mexique, Antarctique',
      fact: 'L\'anneau ne dure que 48 secondes au maximum : ce jour-là, la Lune paraît presque aussi grande que le Soleil.' },
    '2035-09-02': { region: 'est de l\'Asie, Pacifique',
      fact: 'La totalité passe en plein sur Pékin, puis traverse la Corée et le Japon, où elle frôle Tokyo : des dizaines de millions de personnes se trouvent sur son chemin.' },
    '2036-02-27': { region: 'Antarctique, sud de l\'Australie, Nouvelle-Zélande',
      fact: 'Le sud de l\'Australie et la Nouvelle-Zélande la voient partielle, en fin de journée.' },
    '2036-07-23': { region: 'sud de l\'Atlantique, Antarctique',
      fact: 'La plus petite éclipse de la liste : la Lune ne fait qu\'effleurer le Soleil, au-dessus de l\'océan Austral, et presque personne ne pourra la voir.' },
    '2036-08-21': { region: 'Alaska, Canada, Arctique, ouest de l\'Europe, nord-ouest de l\'Afrique',
      fact: 'En France, la Lune entame le Soleil en fin de journée, peu avant son coucher.' },
  };

  // villes proposées : [nom, latitude, longitude, fuseau horaire]
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
      ['Madrid', 40.417, -3.704, 'Europe/Madrid'], ['Séville', 37.389, -5.984, 'Europe/Madrid'], ['Lisbonne', 38.722, -9.139, 'Europe/Lisbon'],
      ['Athènes', 37.984, 23.728, 'Europe/Athens'], ['Istanbul', 41.008, 28.978, 'Europe/Istanbul'],
      ['Casablanca', 33.573, -7.59, 'Africa/Casablanca'], ['Alger', 36.754, 3.059, 'Africa/Algiers'], ['Tunis', 36.806, 10.181, 'Africa/Tunis'],
      ['Le Caire', 30.044, 31.236, 'Africa/Cairo'], ['Louxor', 25.687, 32.64, 'Africa/Cairo'], ['Dakar', 14.716, -17.467, 'Africa/Dakar'],
      ['Abidjan', 5.345, -4.024, 'Africa/Abidjan'], ['Le Cap', -33.925, 18.424, 'Africa/Johannesburg'],
      ['Montréal', 45.502, -73.567, 'America/Toronto'], ['New York', 40.713, -74.006, 'America/New_York'], ['Mexico', 19.433, -99.133, 'America/Mexico_City'],
      ['Rio de Janeiro', -22.907, -43.173, 'America/Sao_Paulo'], ['Buenos Aires', -34.604, -58.382, 'America/Argentina/Buenos_Aires'],
      ['Santiago du Chili', -33.449, -70.669, 'America/Santiago'], ['Bombay', 19.076, 72.878, 'Asia/Kolkata'], ['Pékin', 39.904, 116.407, 'Asia/Shanghai'],
      ['Tokyo', 35.69, 139.692, 'Asia/Tokyo'], ['Sydney', -33.869, 151.209, 'Australia/Sydney'], ['Auckland', -36.848, 174.763, 'Pacific/Auckland']] },
  ];
  const CITIES = [];
  PLACES.forEach((g) => g.list.forEach(([name, lat, lon, tz]) => CITIES.push({ name, lat, lon, tz: tz || g.tz, group: g.group })));

  /* ---------- Calcul : éléments de Bessel ----------
     Dans le « plan fondamental », perpendiculaire à l'axe Soleil-Lune et passant par le centre de la Terre,
     l'ombre de la Lune est un disque (rayon l1 pour la pénombre, l2 pour l'ombre) centré en (x, y).
     On y projette l'observateur (ξ, η) : l'éclipse est visible quand il tombe dans ce disque. */
  const RAD = Math.PI / 180;
  const K = 0.99664719; // rayon polaire / rayon équatorial de la Terre
  const poly = (c, t) => c[0] + t * (c[1] + t * (c[2] + t * (c[3] || 0)));
  const dpoly = (c, t) => c[1] + t * (2 * c[2] + 3 * t * (c[3] || 0));

  function elements(E, t) {
    return {
      x: poly(E.x, t), dx: dpoly(E.x, t), y: poly(E.y, t), dy: dpoly(E.y, t),
      d: poly(E.d, t) * RAD, dd: dpoly(E.d, t) * RAD, mu: poly(E.mu, t) * RAD, dmu: dpoly(E.mu, t) * RAD,
      l1: poly(E.l1, t), l2: poly(E.l2, t),
    };
  }
  function observer(lat, lon) {
    const u = Math.atan(K * Math.tan(lat * RAD));
    return { lat: lat * RAD, lon: lon * RAD, rs: K * Math.sin(u), rc: Math.cos(u) };
  }
  // position de l'observateur par rapport à l'ombre, t heures après t0
  function situation(E, o, t) {
    const b = elements(E, t);
    const H = b.mu + o.lon - E.dT / 13713.44;
    const sH = Math.sin(H), cH = Math.cos(H), sd = Math.sin(b.d), cd = Math.cos(b.d);
    const xi = o.rc * sH;
    const eta = o.rs * cd - o.rc * sd * cH;
    const zeta = o.rs * sd + o.rc * cd * cH;
    const u = b.x - xi, v = b.y - eta;
    return {
      t, u, v, m: Math.hypot(u, v),
      a: b.dx - b.dmu * o.rc * cH,
      b: b.dy - (b.dmu * xi * sd - zeta * b.dd),
      L1: b.l1 - zeta * E.f1, L2: b.l2 - zeta * E.f2,
      alt: Math.asin(Math.sin(o.lat) * sd + Math.cos(o.lat) * cd * cH) / RAD,
    };
  }
  // fraction du diamètre du Soleil cachée
  function magnitude(s) {
    if (s.m >= s.L1) return 0;
    if (s.m <= Math.abs(s.L2)) return (s.L1 - s.L2) / (s.L1 + s.L2);
    return (s.L1 - s.m) / (s.L1 + s.L2);
  }
  // fraction de la surface du Soleil cachée
  function obscuration(s) {
    const k = (s.L1 - s.L2) / (s.L1 + s.L2); // rayon de la Lune / rayon du Soleil
    const d = 2 * s.m / (s.L1 + s.L2); // écart des centres, en rayons solaires
    if (d >= 1 + k) return 0;
    if (d <= Math.abs(1 - k)) return Math.min(1, k * k);
    const a1 = Math.acos((d * d + 1 - k * k) / (2 * d));
    const a2 = Math.acos((d * d + k * k - 1) / (2 * d * k));
    return (a1 + k * k * a2 - 0.5 * Math.sqrt((-d + 1 + k) * (d + 1 - k) * (d - 1 + k) * (d + 1 + k))) / Math.PI;
  }
  function maximum(E, o, t) {
    for (let i = 0; i < 8; i++) {
      const s = situation(E, o, t);
      const dt = -(s.u * s.a + s.v * s.b) / (s.a * s.a + s.b * s.b);
      t += dt;
      if (Math.abs(dt) < 1e-6) break;
    }
    return situation(E, o, t);
  }
  // premier (sign = −1) ou dernier (sign = +1) contact avec la pénombre, ou avec l'ombre si umbra
  function contact(E, o, t, umbra, sign) {
    for (let i = 0; i < 8; i++) {
      const s = situation(E, o, t);
      const L = umbra ? Math.abs(s.L2) : s.L1;
      const n = Math.hypot(s.a, s.b);
      const S = (s.a * s.v - s.u * s.b) / (n * L);
      const dt = -(s.u * s.a + s.v * s.b) / (n * n) + sign * (L / n) * Math.sqrt(Math.max(0, 1 - S * S));
      t += dt;
      if (Math.abs(dt) < 1e-6) break;
    }
    return t;
  }
  // lever ou coucher du Soleil entre un instant où il est levé et un instant où il ne l'est pas
  function horizon(E, o, up, down) {
    for (let i = 0; i < 20; i++) {
      const mid = (up + down) / 2;
      if (situation(E, o, mid).alt > 0) up = mid; else down = mid;
    }
    return situation(E, o, up);
  }
  // le meilleur moment où le Soleil est levé : le maximum, ou à défaut le lever ou le coucher
  function bestVisible(E, o, max, c1, c4) {
    if (max.alt > 0) return max;
    if (c1 == null) { c1 = contact(E, o, max.t, false, -1); c4 = contact(E, o, max.t, false, 1); }
    let best = null;
    [c1, c4].forEach((tc) => {
      if (situation(E, o, tc).alt <= 0) return;
      const s = horizon(E, o, tc, max.t);
      if (!best || magnitude(s) > magnitude(best)) best = s;
    });
    return best;
  }
  function local(E, lat, lon) {
    const o = observer(lat, lon);
    const max = maximum(E, o, 0);
    if (!(max.m < max.L1) || Math.abs(max.t) > 5) return null;
    const c1 = contact(E, o, max.t, false, -1), c4 = contact(E, o, max.t, false, 1);
    const r = {
      max, c1, c4, best: bestVisible(E, o, max, c1, c4),
      up1: situation(E, o, c1).alt > 0, up4: situation(E, o, c4).alt > 0,
    };
    if (max.m < Math.abs(max.L2)) { r.c2 = contact(E, o, max.t, true, -1); r.c3 = contact(E, o, max.t, true, 1); }
    return r;
  }
  // instant de la plus grande éclipse : l'axe de l'ombre passe au plus près du centre de la Terre
  function greatest(E) {
    let t = 0;
    for (let i = 0; i < 6; i++) {
      const b = elements(E, t);
      t -= (b.x * b.dx + b.y * b.dy) / (b.dx * b.dx + b.dy * b.dy);
    }
    return t;
  }
  // point du sol (ellipsoïde terrestre) correspondant à (ξ, η) dans le plan fondamental
  function ground(E, b, xi, eta) {
    const sd = Math.sin(b.d), cd = Math.cos(b.d), k2 = 1 / (K * K);
    const A = cd * cd + sd * sd * k2;
    const B = 2 * eta * sd * cd * (k2 - 1);
    const C = eta * eta * (sd * sd + cd * cd * k2) + xi * xi - 1;
    const disc = B * B - 4 * A * C;
    if (disc < 0) return null;
    const zeta = (-B + Math.sqrt(disc)) / (2 * A);
    const P = zeta * cd - eta * sd, Z = eta * cd + zeta * sd;
    const lon = (Math.atan2(xi, P) - b.mu + E.dT / 13713.44) / RAD;
    return { lat: Math.atan2(Z, K * K * Math.hypot(xi, P)) / RAD, lon: wrap(lon) };
  }
  const wrap = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;
  function unwrap(pts) {
    for (let i = 1; i < pts.length; i++) {
      while (pts[i][0] - pts[i - 1][0] > 180) pts[i][0] -= 360;
      while (pts[i][0] - pts[i - 1][0] < -180) pts[i][0] += 360;
    }
    return pts;
  }

  /* ---------- Pays (fond de carte Natural Earth) ---------- */
  const COUNTRIES = (window.MONDE || []).map(([name, polys]) => ({
    name,
    polys: polys.map((rings) => {
      const r = rings[0], box = [Infinity, Infinity, -Infinity, -Infinity];
      for (let i = 0; i < r.length; i += 2) {
        box[0] = Math.min(box[0], r[i]); box[2] = Math.max(box[2], r[i]);
        box[1] = Math.min(box[1], r[i + 1]); box[3] = Math.max(box[3], r[i + 1]);
      }
      return { rings, box };
    }),
  }));
  function inRing(r, x, y) {
    let inside = false;
    for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
      const xi = r[i], yi = r[i + 1], xj = r[j], yj = r[j + 1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  const SHORT = { 'République populaire de Chine': 'Chine', 'République démocratique du Congo': 'RD Congo', Somaliland: 'Somalie' };
  function nameOf(name, lat, lon) {
    if (name === 'France' && lon < -40) return 'Guyane';
    if (name === 'États-Unis' && lon < -130) return lat > 40 ? 'Alaska' : 'Hawaï';
    return SHORT[name] || name;
  }
  function countryAt(lat, lon) {
    for (const c of COUNTRIES) {
      for (const p of c.polys) {
        if (lon < p.box[0] || lon > p.box[2] || lat < p.box[1] || lat > p.box[3]) continue;
        if (inRing(p.rings[0], lon, lat) && !p.rings.slice(1).some((h) => inRing(h, lon, lat))) return nameOf(c.name, lat, lon);
      }
    }
    return null;
  }
  const LAND = new Path2D();
  COUNTRIES.forEach((c) => c.polys.forEach((p) => p.rings.forEach((r) => {
    LAND.moveTo(r[0], -r[1]);
    for (let i = 2; i < r.length; i += 2) LAND.lineTo(r[i], -r[i + 1]);
    LAND.closePath();
  })));
  const GRATICULE = new Path2D();
  for (let lon = -180; lon <= 180; lon += 30) { GRATICULE.moveTo(lon, -90); GRATICULE.lineTo(lon, 90); }
  for (let lat = -60; lat <= 60; lat += 30) { GRATICULE.moveTo(-180, -lat); GRATICULE.lineTo(180, -lat); }

  /* ---------- Préparation d'une éclipse : zone de visibilité et bande centrale ---------- */
  const GW = 361, GH = 181; // grille de 1° : longitudes −180 → 180, latitudes 90 → −90
  const STOPS = [[0, [96, 64, 230, 0.34]], [0.5, [214, 82, 160, 0.58]], [1, [255, 184, 41, 0.86]]];
  function ramp(v) {
    const i = v < 0.5 ? 0 : 1, [a0, c0] = STOPS[i], [a1, c1] = STOPS[i + 1], f = (v - a0) / (a1 - a0);
    return c0.map((c, k) => c + (c1[k] - c) * f);
  }
  function coverage(E) {
    const vals = new Float32Array(GW * GH);
    for (let j = 0; j < GH; j++) {
      let guess = 0;
      for (let i = 0; i < GW; i++) {
        const o = observer(90 - j, i - 180);
        const max = maximum(E, o, guess);
        if (!(Math.abs(max.t) < 5)) { guess = 0; continue; }
        guess = max.t;
        if (max.m >= max.L1) continue;
        const best = bestVisible(E, o, max);
        if (best) vals[j * GW + i] = obscuration(best);
      }
    }
    return vals;
  }
  // courbes de niveau (carrés marchants) en coordonnées de carte (x = longitude, y = −latitude)
  function contours(vals, level, path) {
    const P = (x, y) => [x - 180, y - 90];
    for (let j = 0; j < GH - 1; j++) {
      for (let i = 0; i < GW - 1; i++) {
        const a = vals[j * GW + i], b = vals[j * GW + i + 1], c = vals[(j + 1) * GW + i + 1], d = vals[(j + 1) * GW + i];
        const idx = (a > level) << 3 | (b > level) << 2 | (c > level) << 1 | (d > level);
        if (idx === 0 || idx === 15) continue;
        const top = P(i + (level - a) / (b - a), j), right = P(i + 1, j + (level - b) / (c - b));
        const bottom = P(i + (level - d) / (c - d), j + 1), left = P(i, j + (level - a) / (d - a));
        const segs = {
          1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[top, right]], 5: [[top, right], [left, bottom]],
          6: [[top, bottom]], 7: [[left, top]], 8: [[left, top]], 9: [[top, bottom]], 10: [[left, top], [bottom, right]],
          11: [[top, right]], 12: [[left, right]], 13: [[bottom, right]], 14: [[left, bottom]],
        }[idx];
        segs.forEach(([p, q]) => { path.moveTo(p[0], p[1]); path.lineTo(q[0], q[1]); });
      }
    }
  }
  // bande centrale : réunion des empreintes successives de l'ombre sur le sol (toutes les 20 s),
  // avec la ligne centrale et les deux bords, perpendiculaires à la course de l'ombre
  function track(E) {
    if (E.type === 'P') return null;
    const band = new Path2D(), line = [], north = [], south = [], samples = [];
    let step = 0;
    for (let t = -3.5; t <= 3.5; t += 1 / 180, step++) {
      const b = elements(E, t);
      const c = ground(E, b, b.x, b.y);
      let r = Math.abs(b.l2); // au bord du disque terrestre, ζ ≈ 0
      if (c && step % 3 === 0) {
        const s = situation(E, observer(c.lat, c.lon), t);
        const n = Math.hypot(s.a, s.b);
        r = Math.abs(s.L2);
        const px = -s.b / n * r, py = s.a / n * r;
        line.push([c.lon, c.lat]);
        const N = ground(E, b, b.x + px, b.y + py), S = ground(E, b, b.x - px, b.y - py);
        if (N && S) { north.push([N.lon, N.lat]); south.push([S.lon, S.lat]); }
      }
      const pts = [];
      for (let k = 0; k < 24; k++) {
        const g = ground(E, b, b.x + r * Math.cos(k * Math.PI / 12), b.y + r * Math.sin(k * Math.PI / 12));
        if (g) pts.push([g.lon, g.lat]);
      }
      if (pts.length < 3) continue;
      unwrap(pts).forEach(([x, y], i) => (i ? band.lineTo(x, -y) : band.moveTo(x, -y)));
      band.closePath();
      if (c) samples.push([c.lon, c.lat, t]);
      pts.forEach((p, i) => { if (i % 2 === 0) samples.push([p[0], p[1], t]); });
      for (let k = 0; k < 8; k++) {
        const g = ground(E, b, b.x + r / 2 * Math.cos(k * Math.PI / 4), b.y + r / 2 * Math.sin(k * Math.PI / 4));
        if (g) samples.push([g.lon, g.lat, t]);
      }
    }
    if (!samples.length) return null;
    const polyline = (pts, path) => unwrap(pts).forEach(([x, y], i) => (i ? path.lineTo(x, -y) : path.moveTo(x, -y)));
    const center = new Path2D(), edges = new Path2D();
    polyline(line, center);
    polyline(north, edges);
    polyline(south, edges);
    // pays traversés, dans l'ordre de passage de l'ombre : points de la bande, plus chaque point des côtes et frontières
    const first = new Map();
    const seen = (name, t) => { if (name && !(first.get(name) <= t)) first.set(name, t); };
    samples.forEach(([lon, lat, t]) => seen(countryAt(lat, wrap(lon)), t));
    COUNTRIES.forEach((cn) => cn.polys.forEach((p) => {
      const r = p.rings[0];
      for (let i = 0; i < r.length; i += 2) {
        const s = maximum(E, observer(r[i + 1], r[i]), 0);
        if (s.m < Math.abs(s.L2) && s.alt > 0 && Math.abs(s.t) < 5) seen(nameOf(cn.name, r[i + 1], r[i]), s.t);
      }
    }));
    const countries = [...first.keys()].sort((a, b) => first.get(a) - first.get(b));
    return { band, center, edges, countries };
  }
  const cache = new Map();
  function prepare(E) {
    if (cache.has(E)) return cache.get(E);
    const vals = coverage(E);
    const image = document.createElement('canvas');
    image.width = GW; image.height = GH;
    const ic = image.getContext('2d'), data = ic.createImageData(GW, GH);
    let sx = 0, sy = 0;
    for (let k = 0; k < vals.length; k++) {
      const v = vals[k];
      if (v <= 0) continue;
      const [r, g, b, a] = ramp(v);
      data.data[k * 4] = r; data.data[k * 4 + 1] = g; data.data[k * 4 + 2] = b; data.data[k * 4 + 3] = a * 255;
      const lon = (k % GW - 180) * RAD, w = v * Math.cos((90 - Math.floor(k / GW)) * RAD);
      sx += w * Math.cos(lon); sy += w * Math.sin(lon);
    }
    ic.putImageData(data, 0, 0);
    const levels = new Path2D(), edge = new Path2D();
    [0.2, 0.4, 0.6, 0.8].forEach((L) => contours(vals, L, levels));
    contours(vals, 0.002, edge);
    const tg = greatest(E);
    const P = { image, levels, edge, track: track(E), tg, center: Math.atan2(sy, sx) / RAD };
    cache.set(E, P);
    return P;
  }

  /* ---------- Mise en forme ---------- */
  const instant = (E, t) => new Date(Date.UTC(+E.date.slice(0, 4), +E.date.slice(5, 7) - 1, +E.date.slice(8, 10)) + ((E.t0 + t) * 3600 - E.dT) * 1000);
  const clock = (date, tz) => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: tz || 'UTC' })
    .format(date).replace(':', ' h ').replace(/^0(\d)/, '$1');
  const day = (date, tz, opts) => new Intl.DateTimeFormat('fr-FR', Object.assign({ day: 'numeric', month: 'long', timeZone: tz || 'UTC' }, opts))
    .format(date).replace(/(^|\s)1 (?=\D)/, '$11er '); // « 1er juin »
  const duration = (sec) => {
    sec = Math.round(sec);
    const m = Math.floor(sec / 60), s = sec % 60;
    return m ? m + ' min ' + String(s).padStart(2, '0') + ' s' : s + ' s';
  };
  const percent = (v) => (v > 0 && v < 0.005 ? '< 1' : fr(v * 100)) + ' %';
  const coords = (lat, lon) => fr(Math.abs(lat), 1) + '° ' + (lat >= 0 ? 'N' : 'S') + ' · ' + fr(Math.abs(lon), 1) + '° ' + (lon >= 0 ? 'E' : 'O');
  const tzLabel = (p) => (p.custom ? 'temps universel (TU)' : p.tz === 'Europe/Paris' ? 'heure française' : 'heure locale');
  // heure locale, précédée de la date si elle diffère du jour de l'éclipse
  function when(E, t, p) {
    const date = instant(E, t), tz = p.custom ? 'UTC' : p.tz;
    const same = day(date, tz) === day(instant(E, 0), 'UTC');
    return (same ? '' : day(date, tz, { month: 'short' }) + ', ') + clock(date, tz);
  }

  /* ---------- État ---------- */
  const upcoming = ALL.filter((E) => instant(E, 0) > Date.now() - 864e5);
  const items = upcoming.length ? upcoming : ALL;
  let current = 0;
  let place = CITIES[0];
  const custom = { name: '', lat: 0, lon: 0, custom: true };

  /* ---------- Fiche de l'éclipse ---------- */
  function renderCard() {
    const E = items[current], T = TYPES[E.type], X = TEXTS[E.date] || {}, P = prepare(E);
    $('e-type').textContent = T.one + ' · saros ' + E.saros;
    const name = day(instant(E, P.tg), 'UTC', { weekday: 'long', year: 'numeric' });
    $('e-name').textContent = name.charAt(0).toUpperCase() + name.slice(1);
    const where = countryAt(E.ge[0], E.ge[1]);
    $('e-when').textContent = 'Plus grande éclipse à ' + clock(instant(E, P.tg)) + ' TU, ' + (where ? 'au-dessus de : ' + where : 'en mer') + ' (' + coords(E.ge[0], E.ge[1]) + ')';
    $('e-desc').textContent = T.what;

    const prev = new Date(instant(E, P.tg) - 6585.3211 * 864e5);
    const saros = ['Saros', fr(E.saros), 'même famille que l\'éclipse du ' + day(prev, 'UTC', { month: 'short', year: 'numeric' })];
    const stats = E.type === 'P'
      ? [['Magnitude maximale', fr(E.mag, 3), 'part du diamètre du Soleil cachée'], saros]
      : [[T.band + ' maximale', duration(E.dur)], ['Largeur de la bande', fr(Math.round(E.width)) + ' km'],
        ['Magnitude', fr(E.mag, 3), 'diamètre de la Lune / du Soleil'], saros];
    const dl = $('e-stats');
    dl.textContent = '';
    stats.forEach(([k, v, note]) => {
      const wrap = el('div');
      wrap.appendChild(el('dt', null, k));
      const dd = el('dd', null, v);
      if (note) dd.appendChild(el('small', null, note));
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    });

    const w = $('e-where');
    w.textContent = '';
    if (P.track) {
      w.appendChild(el('span', 'hl', T.zone + ' : '));
      w.appendChild(document.createTextNode((P.track.countries.length ? P.track.countries.join(', ') : 'uniquement au-dessus de l\'océan') + '. '));
    }
    w.appendChild(el('span', 'hl', 'Partielle : '));
    w.appendChild(document.createTextNode((X.region || '') + '.'));
    $('e-fact').textContent = X.fact || '';
  }

  /* ---------- Vu depuis… ---------- */
  function renderLocal() {
    const E = items[current], T = TYPES[E.type];
    const L = local(E, place.lat, place.lon);
    const from = place.custom ? 'ce point (' + coords(place.lat, place.lon) + ')' : place.name;
    const dl = $('e-local');
    dl.textContent = '';
    let verdict;
    if (!L) verdict = 'Depuis ' + from + ', rien à voir : l\'ombre de la Lune passe trop loin.';
    else if (!L.best) verdict = 'Depuis ' + from + ', l\'éclipse a lieu pendant la nuit : le Soleil est sous l\'horizon.';
    else {
      const b = L.best, central = L.c2 != null && b === L.max;
      const kind = b.L2 < 0 ? 'totale' : 'annulaire';
      if (central) {
        verdict = 'Depuis ' + from + ', l\'éclipse est ' + kind + ' : ' + (kind === 'totale' ? 'le Soleil disparaît' : 'un anneau de feu brille') + ' pendant ' + duration((L.c3 - L.c2) * 3600) + ', à ' + when(E, b.t, place) + '.';
      } else {
        verdict = 'Depuis ' + from + ', l\'éclipse est partielle : la Lune cache ' + percent(obscuration(b)) + ' du Soleil' +
          (b === L.max ? ', à ' + when(E, b.t, place) : L.up4 && b.t > L.max.t ? ' au lever du Soleil, à ' + when(E, b.t, place) : ' juste avant le coucher du Soleil, à ' + when(E, b.t, place)) + '.';
      }
      const stats = [
        ['Soleil caché', percent(obscuration(b)), 'magnitude ' + fr(magnitude(b), 2)],
        ['Maximum', when(E, b.t, place), b === L.max ? tzLabel(place) : (b.t > L.max.t ? 'au lever du Soleil' : 'au coucher du Soleil')],
        ['Début → fin', (L.up1 ? when(E, L.c1, place) : 'lever') + ' → ' + (L.up4 ? when(E, L.c4, place) : 'coucher'), tzLabel(place)],
        ['Hauteur du Soleil', fr(Math.max(0, b.alt)) + '°', b === L.max ? 'au maximum' : 'au ras de l\'horizon'],
      ];
      if (central) stats.splice(1, 0, [kind === 'totale' ? 'Totalité' : 'Anneau', duration((L.c3 - L.c2) * 3600), 'de ' + when(E, L.c2, place) + ' à ' + when(E, L.c3, place)]);
      stats.forEach(([k, v, note]) => {
        const wrap = el('div');
        wrap.appendChild(el('dt', null, k));
        const dd = el('dd', null, v);
        if (note) dd.appendChild(el('small', null, note));
        wrap.appendChild(dd);
        dl.appendChild(wrap);
      });
    }
    $('e-verdict').textContent = verdict;
    $('e-view-cap').textContent = L && L.best
      ? 'Le Soleil vu depuis ' + from + ' au plus fort de l\'éclipse · nord en haut'
      : 'Depuis ' + from + ', le Soleil reste entier ou sous l\'horizon';
    $('sunview').setAttribute('aria-label', verdict);
    drawSun(L);
  }

  /* ---------- Dessin du Soleil et de la Lune ---------- */
  const sun = $('sunview'), sctx = sun.getContext('2d');
  let lastView = null;
  function drawSun(L) {
    lastView = L;
    const dpr = Math.min(devicePixelRatio || 1, 2), w = sun.clientWidth, h = sun.clientHeight;
    if (!w) return;
    sun.width = w * dpr; sun.height = h * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.24;
    const s = L && L.best;
    const total = s && s.m < -s.L2;
    sctx.globalAlpha = s ? 1 : 0.35;
    // halo ou couronne
    const halo = sctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * (total ? 2.8 : 1.9));
    halo.addColorStop(0, total ? 'rgba(235, 240, 255, .75)' : 'rgba(255, 184, 41, .32)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = halo;
    sctx.beginPath(); sctx.arc(cx, cy, R * 3, 0, 6.2832); sctx.fill();
    // disque solaire
    const disc = sctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, R * 0.1, cx, cy, R);
    disc.addColorStop(0, '#fff6dc'); disc.addColorStop(0.6, '#ffd36b'); disc.addColorStop(1, '#ffb829');
    sctx.fillStyle = disc;
    sctx.beginPath(); sctx.arc(cx, cy, R, 0, 6.2832); sctx.fill();
    sctx.globalAlpha = 1;
    if (!s) return;
    // la Lune : décalée vers (u, v) ; nord en haut, donc est à gauche
    const k = (s.L1 - s.L2) / (s.L1 + s.L2), sep = 2 * s.m / (s.L1 + s.L2);
    const ux = s.m > 1e-9 ? -s.u / s.m : 0, uy = s.m > 1e-9 ? -s.v / s.m : 0;
    sctx.fillStyle = '#000';
    sctx.strokeStyle = 'rgba(255, 255, 255, .18)';
    sctx.beginPath(); sctx.arc(cx + ux * sep * R, cy + uy * sep * R, k * R, 0, 6.2832); sctx.fill(); sctx.stroke();
  }

  /* ---------- Liste des éclipses ---------- */
  function renderList() {
    const list = $('elist');
    list.textContent = '';
    const head = el('div', 'ecl-row ecl-head');
    head.setAttribute('aria-hidden', 'true');
    ['Date', 'Type', 'Durée centrale', 'Depuis ' + (place.custom ? 'ce point' : place.name)].forEach((t, i) => head.appendChild(el('span', i === 2 ? 'dur' : null, t)));
    list.appendChild(head);
    items.forEach((E, i) => {
      const T = TYPES[E.type];
      const b = el('button', 'ecl-row');
      b.type = 'button';
      b.setAttribute('aria-current', String(i === current));
      b.appendChild(el('span', 'date', day(instant(E, 0), 'UTC', { month: 'short', year: 'numeric' })));
      const kind = el('span', 'kind');
      const dot = el('i');
      dot.style.background = T.color;
      kind.appendChild(dot);
      kind.appendChild(document.createTextNode(T.short));
      b.appendChild(kind);
      b.appendChild(el('span', 'num dur', E.type === 'P' ? '—' : duration(E.dur)));
      const L = local(E, place.lat, place.lon);
      const seen = L && L.best;
      let txt = 'non visible';
      if (seen) {
        if (L.c2 != null && L.best === L.max) txt = L.best.L2 < 0 ? 'Totale !' : 'Anneau !';
        else txt = percent(obscuration(L.best));
      }
      b.appendChild(el('span', 'num' + (seen ? ' seen' : ''), txt));
      b.addEventListener('click', () => {
        select(i);
        // la carte est sous le calendrier : on l'amène à l'écran
        const map = document.querySelector('.ecl-map'), top = map.getBoundingClientRect().top;
        if (top > innerHeight * 0.5 || top < 0) map.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
      });
      list.appendChild(b);
    });
    const E = items[current];
    $('e-current').textContent = day(instant(E, 0), 'UTC', { year: 'numeric' }) + ' · ' + TYPES[E.type].short;
    $('eprev').disabled = current === 0;
    $('enext').disabled = current === items.length - 1;
  }

  /* ---------- Carte du monde ---------- */
  const canvas = $('earth'), ctx = canvas.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cam = { lon: 0, lat: 0, z: 1 };
  let W = 0, H = 0, dpr = 1, queued = false, tween = null, hint = '';

  const scale = () => Math.max(W / 360, H / 180) * cam.z; // pixels par degré
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  function settle() {
    const half = H / 2 / scale();
    cam.lat = half >= 90 ? 0 : clamp(cam.lat, -90 + half, 90 - half);
  }
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    request();
    if (lastView !== undefined) drawSun(lastView);
  }
  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame((t) => { queued = false; draw(t); });
  }
  const toScreen = (lat, lon) => {
    const s = scale(), dl = ((lon - cam.lon) % 360 + 540) % 360 - 180;
    return [W / 2 + dl * s, H / 2 + (cam.lat - lat) * s];
  };
  function toWorld(px, py) {
    const s = scale(), lat = cam.lat - (py - H / 2) / s;
    return Math.abs(lat) > 90 ? null : { lat, lon: wrap(cam.lon + (px - W / 2) / s) };
  }

  function label(text, x, y) {
    ctx.font = '600 11px Inter, sans-serif';
    const w = ctx.measureText(text).width, lx = clamp(x - w / 2, 4, W - w - 4);
    return { text, x: lx, y, box: [lx - 3, y - 12, lx + w + 3, y + 4] };
  }
  const overlap = (a, b) => a.box[0] < b.box[2] && a.box[2] > b.box[0] && a.box[1] < b.box[3] && a.box[3] > b.box[1];
  function write(l, color) {
    ctx.font = '600 11px Inter, sans-serif';
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0, 0, 0, .85)'; ctx.lineJoin = 'round';
    ctx.strokeText(l.text, l.x, l.y);
    ctx.fillStyle = color;
    ctx.fillText(l.text, l.x, l.y);
  }

  function draw(t = 0) {
    if (tween) {
      const k = Math.min((t - tween.t0) / tween.ms, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cam.lon = wrap(tween.from.lon + tween.dlon * e);
      cam.lat = tween.from.lat + (tween.to.lat - tween.from.lat) * e;
      cam.z = Math.exp(Math.log(tween.from.z) + (Math.log(tween.to.z) - Math.log(tween.from.z)) * e);
      if (k >= 1) tween = null;
    }
    settle();
    const E = items[current], P = prepare(E), s = scale();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (let k = -1; k <= 1; k++) {
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (W / 2 + (k * 360 - cam.lon) * s), dpr * (H / 2 + cam.lat * s));
      ctx.lineWidth = 1 / s;
      ctx.strokeStyle = '#161616';
      ctx.stroke(GRATICULE);
      ctx.fillStyle = '#1c1c1c';
      ctx.fill(LAND, 'evenodd');
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(P.image, 0, 0, GW - 1, GH, -180.5, -90.5, GW - 1, GH);
      ctx.lineWidth = 0.7 / s;
      ctx.strokeStyle = 'rgba(255, 255, 255, .26)';
      ctx.stroke(LAND);
      ctx.lineWidth = 1 / s;
      ctx.setLineDash([3 / s, 3 / s]);
      ctx.strokeStyle = 'rgba(255, 255, 255, .4)';
      ctx.stroke(P.levels);
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(160, 130, 255, .9)';
      ctx.stroke(P.edge);
      if (P.track) {
        ctx.fillStyle = 'rgba(0, 0, 0, .82)';
        ctx.fill(P.track.band);
        ctx.lineWidth = 1.2 / s;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke(P.track.edges);
        ctx.lineWidth = 1 / s;
        ctx.setLineDash([4 / s, 4 / s]);
        ctx.strokeStyle = 'rgba(255, 255, 255, .55)';
        ctx.stroke(P.track.center);
        ctx.setLineDash([]);
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // plus grande éclipse
    const [gx, gy] = toScreen(E.ge[0], E.ge[1]);
    ctx.fillStyle = 'rgba(255, 255, 255, .25)';
    ctx.beginPath(); ctx.arc(gx, gy, 7, 0, 6.2832); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(gx, gy, 3.5, 0, 6.2832); ctx.fill();
    // lieu choisi
    const [px, py] = toScreen(place.lat, place.lon);
    ctx.fillStyle = 'rgba(0, 0, 0, .6)';
    ctx.beginPath(); ctx.arc(px, py, 8.5, 0, 6.2832); ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffb829';
    ctx.beginPath(); ctx.arc(px, py, 6, 0, 6.2832); ctx.stroke();
    ctx.fillStyle = '#ffb829';
    ctx.beginPath(); ctx.arc(px, py, 2, 0, 6.2832); ctx.fill();
    // étiquettes : on les écarte si elles se chevauchent
    const name = place.custom ? 'POINT CHOISI' : place.name.toUpperCase();
    let gl = label('MAXIMUM', gx, gy - 13), pl = label(name, px, py + 22);
    if (overlap(gl, pl)) {
      pl = label(name, px, py - 14);
      if (overlap(gl, pl)) gl = label('MAXIMUM', gx, gy + 22);
    }
    write(gl, '#ffffff');
    write(pl, '#ffb829');

    $('earth-hint').textContent = hint || 'Glisser pour se déplacer · molette ou pincement pour zoomer · clic pour choisir un lieu';
    if (tween) request();
  }

  function zoomAt(px, py, f) {
    const before = toWorld(px, py);
    cam.z = clamp(cam.z * f, 1, 8);
    settle();
    const after = toWorld(px, py);
    if (before && after) { cam.lon = wrap(cam.lon + before.lon - after.lon); cam.lat += before.lat - after.lat; }
    request();
  }
  function flyTo(lon, lat, z) {
    const dlon = ((lon - cam.lon) % 360 + 540) % 360 - 180;
    if (still) { cam.lon = wrap(lon); cam.lat = lat; cam.z = z; request(); return; }
    tween = { from: { ...cam }, to: { lat, z }, dlon, t0: performance.now(), ms: 900 };
    request();
  }
  function describe(lat, lon) {
    const name = countryAt(lat, lon) || 'En mer';
    const L = local(items[current], lat, lon);
    let txt = 'pas d\'éclipse visible';
    if (L && L.best) txt = L.c2 != null && L.best === L.max ? (L.best.L2 < 0 ? 'éclipse totale' : 'éclipse annulaire') : 'Soleil caché à ' + percent(obscuration(L.best));
    else if (L) txt = 'éclipse pendant la nuit';
    return name + ' · ' + coords(lat, lon) + ' · ' + txt;
  }

  // glisser, pincer, cliquer
  const pointers = new Map();
  let moved = 0;
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0; tween = null;
  });
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const prev = pointers.get(e.pointerId);
    if (!prev) {
      const w = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      hint = w ? describe(w.lat, w.lon) : '';
      request();
      return;
    }
    const cur = { x: e.clientX, y: e.clientY };
    if (pointers.size === 1) {
      const s = scale();
      cam.lon = wrap(cam.lon - (cur.x - prev.x) / s);
      cam.lat += (cur.y - prev.y) / s;
      moved += Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y);
      if (moved > 5) canvas.style.cursor = 'grabbing';
    } else if (pointers.size === 2) {
      const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)[1];
      const before = Math.hypot(prev.x - other.x, prev.y - other.y), after = Math.hypot(cur.x - other.x, cur.y - other.y);
      if (before > 0) zoomAt((cur.x + other.x) / 2 - rect.left, (cur.y + other.y) / 2 - rect.top, after / before);
      moved += 10;
    }
    pointers.set(e.pointerId, cur);
    request();
  });
  const release = (e) => {
    if (!pointers.has(e.pointerId)) return;
    if (pointers.size === 1 && moved < 6 && e.type === 'pointerup') {
      const rect = canvas.getBoundingClientRect();
      const w = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      if (w) pick(w.lat, w.lon);
    }
    pointers.delete(e.pointerId);
    canvas.style.cursor = '';
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { if (hint) { hint = ''; request(); } });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    tween = null;
    const rect = canvas.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });
  canvas.addEventListener('keydown', (e) => {
    const step = 20 / cam.z;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[e.key]) { cam.lon = wrap(cam.lon + moves[e.key][0]); cam.lat += moves[e.key][1]; }
    else if (e.key === '+' || e.key === '=') zoomAt(W / 2, H / 2, 1.4);
    else if (e.key === '-') zoomAt(W / 2, H / 2, 1 / 1.4);
    else return;
    e.preventDefault();
    request();
  });
  $('ezin').addEventListener('click', () => zoomAt(W / 2, H / 2, 1.5));
  $('ezout').addEventListener('click', () => zoomAt(W / 2, H / 2, 1 / 1.5));
  $('ezreset').addEventListener('click', () => flyTo(prepare(items[current]).center, 0, 1));

  /* ---------- Choix du lieu ---------- */
  const select$ = $('e-place');
  const customOption = new Option('', 'custom');
  PLACES.forEach((g) => {
    const og = document.createElement('optgroup');
    og.label = g.group;
    CITIES.forEach((c, i) => { if (c.group === g.group) og.appendChild(new Option(c.name, String(i))); });
    select$.appendChild(og);
  });
  select$.value = '0';
  select$.addEventListener('change', () => {
    place = select$.value === 'custom' ? custom : CITIES[+select$.value];
    renderLocal(); renderList(); request();
  });
  function pick(lat, lon) {
    Object.assign(custom, { lat, lon, name: countryAt(lat, lon) || 'En mer' });
    customOption.textContent = custom.name;
    if (!customOption.parentNode) select$.insertBefore(customOption, select$.firstChild);
    select$.value = 'custom';
    place = custom;
    renderLocal(); renderList(); request();
  }

  function select(i) {
    current = i;
    renderCard(); renderLocal(); renderList();
    flyTo(prepare(items[i]).center, 0, 1);
  }
  $('eprev').addEventListener('click', () => { if (current > 0) select(current - 1); });
  $('enext').addEventListener('click', () => { if (current < items.length - 1) select(current + 1); });

  const first = prepare(items[0]);
  cam.lon = first.center;
  $('e-span').textContent = 'Éclipses de Soleil · ' + items[0].date.slice(0, 4) + ' – ' + items[items.length - 1].date.slice(0, 4);
  renderCard(); renderLocal(); renderList();
  new ResizeObserver(resize).observe(canvas);
  new ResizeObserver(() => drawSun(lastView)).observe(sun);
})();
