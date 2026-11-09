(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const fr = (n, d = 0) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  // photos enregistrées dans le dossier images/ ; la version en ligne sert de secours
  const img = (file) => 'images/' + encodeURIComponent(file);
  const online = (file) => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file) + '?width=960';

  /* ---------- Données ----------
     ra : ascension droite (heures) · dec : déclinaison (degrés) → donnent la direction dans le ciel
     d : distance (millions d'années-lumière) · diam : diamètre (milliers d'années-lumière) */
  const TYPES = {
    spiral: { label: 'Spirales', one: 'Galaxie spirale', color: '#9bb7ff' },
    barred: { label: 'Spirales barrées', one: 'Galaxie spirale barrée', color: '#b9a6ff' },
    elliptical: { label: 'Elliptiques', one: 'Galaxie elliptique', color: '#ffd59a' },
    irregular: { label: 'Irrégulières', one: 'Galaxie irrégulière', color: '#8fe3cc' },
    ring: { label: 'Annulaires', one: 'Galaxie annulaire', color: '#ff9fd6' },
    pair: { label: 'En collision', one: 'Galaxies en interaction', color: '#ffad8f' },
  };

  const MILKY_WAY = {
    name: 'Voie lactée', alt: 'Notre galaxie · tu es ici', kind: 'barred', home: true, d: 0, diam: 100,
    type: 'Galaxie spirale barrée · notre galaxie',
    file: 'Milky Way 2005.jpg', credit: 'Vue d\'artiste de la Voie lactée — NASA / JPL-Caltech / R. Hurt',
    desc: 'Toutes les étoiles visibles à l\'œil nu lui appartiennent. Vue de l\'intérieur, elle forme la bande laiteuse qui traverse le ciel des nuits sans lune. Personne n\'a jamais pu la photographier de l\'extérieur : cette image est une vue d\'artiste construite à partir des observations.',
    fact: 'En son centre se cache un trou noir supermassif, Sagittarius A*, d\'environ 4 millions de masses solaires, photographié pour la première fois en 2022.',
    here: 'Le Soleil se trouve à environ 26 000 années-lumière du centre, dans un petit bras spiral appelé bras d\'Orion. Il met environ 230 millions d\'années à faire le tour de la galaxie.',
    stats: [
      ['Diamètre', '≈ 100 000 années-lumière'],
      ['Étoiles', '100 à 400 milliards'],
      ['Âge', '≈ 13 milliards d\'années'],
      ['Galaxies satellites', 'Nuages de Magellan', 'et des dizaines de naines'],
    ],
  };

  const GALAXIES = [
    { name: 'Grand Nuage de Magellan', alt: 'LMC', kind: 'irregular', ra: 5.393, dec: -69.76, d: 0.16, diam: 14, con: 'Dorade',
      file: 'Large Magellanic Cloud.jpg', credit: 'Le Grand Nuage de Magellan en infrarouge — NASA / JPL-Caltech / STScI (Spitzer)',
      desc: 'Une galaxie satellite de la Voie lactée, visible à l\'œil nu depuis l\'hémisphère Sud comme un morceau de Voie lactée détaché. Elle abrite la nébuleuse de la Tarentule, la plus active pouponnière d\'étoiles du Groupe local.',
      fact: 'En 1987, une étoile y a explosé : la supernova 1987A, la plus proche observée depuis l\'invention du télescope, visible à l\'œil nu.' },
    { name: 'Petit Nuage de Magellan', alt: 'SMC · NGC 292', kind: 'irregular', ra: 0.879, dec: -72.83, d: 0.2, diam: 7, con: 'Toucan',
      file: 'Infrared-Radio Image of the Small Magellanic Cloud (2022-027).png', credit: 'Le Petit Nuage de Magellan en infrarouge et radio — ESA / NASA / JPL-Caltech',
      desc: 'Le compagnon plus petit du Grand Nuage. Les deux galaxies tournent autour de la Voie lactée et s\'arrachent mutuellement du gaz, formant un long courant d\'hydrogène appelé le courant magellanique.',
      fact: 'Les marins de l\'expédition de Magellan les ont décrits en 1519, d\'où leur nom. Les peuples de l\'hémisphère Sud les connaissaient depuis toujours.' },
    { name: 'Andromède', alt: 'M31 · NGC 224', kind: 'spiral', ra: 0.712, dec: 41.27, d: 2.5, diam: 220, con: 'Andromède',
      file: 'Andromeda galaxy.jpg', credit: 'La galaxie d\'Andromède en ultraviolet — NASA / JPL-Caltech (GALEX)',
      desc: 'La grande voisine de la Voie lactée et la plus grosse galaxie du Groupe local, avec environ 1 000 milliards d\'étoiles. C\'est l\'objet le plus lointain visible à l\'œil nu.',
      fact: 'Elle se rapproche de nous à près de 110 km/s. Une fusion avec la Voie lactée est possible dans quelques milliards d\'années, mais n\'est plus considérée comme certaine.' },
    { name: 'Galaxie du Triangle', alt: 'M33 · NGC 598', kind: 'spiral', ra: 1.564, dec: 30.66, d: 2.73, diam: 60, con: 'Triangle',
      file: 'Infrared Triangulum Galaxy (M33).jpg', credit: 'La galaxie du Triangle en infrarouge — NASA / JPL-Caltech (Spitzer)',
      desc: 'La troisième grande galaxie du Groupe local, après Andromède et la Voie lactée. Ses bras spiraux, lâches et morcelés, sont parsemés de régions où naissent des étoiles.',
      fact: 'Elle abrite NGC 604, une nébuleuse géante d\'environ 1 500 années-lumière de large où brillent plus de 200 étoiles très massives.' },
    { name: 'Galaxie du Sculpteur', alt: 'NGC 253', kind: 'spiral', ra: 0.793, dec: -25.29, d: 11.4, diam: 90, con: 'Sculpteur',
      file: 'NGC 253.jpg', credit: 'Le cœur de la galaxie du Sculpteur — NASA / ESA / Hubble',
      desc: 'Une grande spirale vue presque par la tranche, poussiéreuse et lumineuse. C\'est une galaxie « à flambée d\'étoiles » : elle forme des étoiles bien plus vite que la Voie lactée.',
      fact: 'Elle a été découverte en 1783 par l\'astronome Caroline Herschel, l\'une des premières femmes astronomes professionnelles.' },
    { name: 'Galaxie du Cigare', alt: 'M82 · NGC 3034', kind: 'irregular', ra: 9.931, dec: 69.68, d: 11.5, diam: 37, con: 'Grande Ourse',
      file: 'M82 HST ACS 2006-14-a-large web.jpg', credit: 'La galaxie du Cigare — NASA / ESA / Hubble Heritage Team',
      desc: 'Vue par la tranche, elle ressemble à un cigare. Des vents de gaz rougeoyant jaillissent de son centre, poussés par l\'explosion de très nombreuses étoiles jeunes.',
      fact: 'Elle forme des étoiles environ dix fois plus vite que la Voie lactée. Ce feu d\'artifice a été déclenché par un passage rapproché avec sa voisine M81.' },
    { name: 'Galaxie de Bode', alt: 'M81 · NGC 3031', kind: 'spiral', ra: 9.926, dec: 69.07, d: 11.8, diam: 90, con: 'Grande Ourse',
      file: 'Messier 81 HST.jpg', credit: 'La galaxie de Bode — NASA / ESA / Hubble Heritage Team',
      desc: 'Une spirale aux bras parfaitement dessinés, l\'une des galaxies les plus brillantes du ciel. Elle forme un petit groupe avec sa voisine, la galaxie du Cigare.',
      fact: 'Elle porte le nom de l\'astronome allemand Johann Elert Bode, qui l\'a découverte en 1774.' },
    { name: 'Centaurus A', alt: 'NGC 5128', kind: 'elliptical', ra: 13.424, dec: -43.02, d: 12, diam: 60, con: 'Centaure',
      file: 'Firestorm of Star Birth in Galaxy Centaurus A.jpg', credit: 'Le cœur de Centaurus A — NASA / ESA / Hubble',
      desc: 'Une galaxie elliptique géante traversée par une bande de poussière sombre, vestige d\'une galaxie spirale qu\'elle a avalée. C\'est l\'une des sources radio les plus puissantes du ciel.',
      fact: 'Son trou noir central projette des jets de matière qui s\'étendent sur près d\'un million d\'années-lumière, bien au-delà de la galaxie elle-même.' },
    { name: 'Galaxie du Moulinet austral', alt: 'M83 · NGC 5236', kind: 'barred', ra: 13.617, dec: -29.87, d: 15, diam: 55, con: 'Hydre',
      file: 'Messier83 - Heic1403a.jpg', credit: 'La galaxie du Moulinet austral — NASA / ESA / Hubble Heritage Team',
      desc: 'Une spirale barrée vue de face, dont les bras sont constellés de nébuleuses roses où naissent des étoiles. On la compare souvent à une version méridionale de la galaxie du Moulinet.',
      fact: 'C\'est l\'une des galaxies où l\'on a observé le plus de supernovae : les étoiles massives y naissent et y meurent à un rythme effréné.' },
    { name: 'Galaxie de l\'Œil noir', alt: 'M64 · NGC 4826', kind: 'spiral', ra: 12.946, dec: 21.68, d: 17, diam: 54, con: 'Chevelure de Bérénice',
      file: 'Blackeyegalaxy.jpg', credit: 'La galaxie de l\'Œil noir — NASA / Hubble Heritage Team',
      desc: 'Une épaisse bande de poussière sombre devant son noyau brillant lui donne l\'air d\'un œil au beurre noir, d\'où son surnom.',
      fact: 'Le gaz de ses régions extérieures tourne dans le sens inverse de celui de ses régions centrales, sans doute la trace d\'une petite galaxie avalée il y a longtemps.' },
    { name: 'Galaxie du Moulinet', alt: 'M101 · NGC 5457', kind: 'spiral', ra: 14.054, dec: 54.35, d: 21, diam: 170, con: 'Grande Ourse',
      file: 'M101 hires STScI-PRC2006-10a.jpg', credit: 'La galaxie du Moulinet — ESA / NASA / Hubble',
      desc: 'Une immense spirale vue parfaitement de face, presque deux fois plus large que la Voie lactée. Ses bras asymétriques ont été déformés par des galaxies voisines.',
      fact: 'Cette image est l\'une des plus détaillées jamais réalisées par Hubble pour une galaxie spirale : elle a été assemblée à partir de 51 photos.' },
    { name: 'Galaxie du Tourbillon', alt: 'M51 · NGC 5194', kind: 'pair', ra: 13.498, dec: 47.2, d: 23, diam: 76, con: 'Chiens de chasse',
      file: 'Messier51 sRGB.jpg', credit: 'La galaxie du Tourbillon et sa compagne — NASA / ESA / Hubble',
      desc: 'Une spirale spectaculaire qui interagit avec une petite galaxie compagne, NGC 5195, accrochée au bout de l\'un de ses bras. Leur rencontre ravive la formation d\'étoiles.',
      fact: 'C\'est la première galaxie dans laquelle on a vu une structure en spirale, dessinée par l\'astronome Lord Rosse en 1845.' },
    { name: 'Galaxie du Tournesol', alt: 'M63 · NGC 5055', kind: 'spiral', ra: 13.264, dec: 42.03, d: 29, diam: 98, con: 'Chiens de chasse',
      file: 'M63 (NGC 5055).jpg', credit: 'La galaxie du Tournesol — NASA / ESA / Hubble Legacy Archive',
      desc: 'Ses bras courts et nombreux, en forme de pétales, lui ont valu son surnom. On parle de spirale « floconneuse », sans grands bras bien définis.',
      fact: 'Ce fut la toute première découverte de l\'astronome français Pierre Méchain, en juin 1779.' },
    { name: 'Galaxie du Sombrero', alt: 'M104 · NGC 4594', kind: 'spiral', ra: 12.666, dec: -11.62, d: 31, diam: 50, con: 'Vierge',
      file: 'M104 ngc4594 sombrero galaxy hi-res.jpg', credit: 'La galaxie du Sombrero — NASA / ESA / Hubble Heritage Team',
      desc: 'Vue presque par la tranche, avec un énorme bulbe brillant ceinturé d\'un anneau de poussière : on dirait un chapeau mexicain.',
      fact: 'Son cœur abrite un trou noir d\'environ un milliard de masses solaires, l\'un des plus massifs connus dans les galaxies proches.' },
    { name: 'Galaxies des Antennes', alt: 'NGC 4038 et NGC 4039', kind: 'pair', ra: 12.031, dec: -18.87, d: 45, diamText: 'deux galaxies en collision', con: 'Corbeau',
      file: 'Antennae galaxies xl.jpg', credit: 'Les galaxies des Antennes — NASA / ESA / Hubble Heritage Team',
      desc: 'Deux galaxies spirales en pleine collision. Leurs longues queues d\'étoiles arrachées, visibles au télescope, ressemblent aux antennes d\'un insecte.',
      fact: 'Le choc comprime leurs nuages de gaz et fait naître des milliards de nouvelles étoiles. Dans quelques centaines de millions d\'années, elles ne formeront plus qu\'une seule galaxie.' },
    { name: 'M87', alt: 'Virgo A · NGC 4486', kind: 'elliptical', ra: 12.514, dec: 12.39, d: 54, diam: 120, con: 'Vierge',
      file: 'M87 jet.jpg', credit: 'Le jet de M87 — NASA / Hubble Heritage Team',
      desc: 'Une galaxie elliptique géante au cœur de l\'amas de la Vierge, qui contient des milliers de milliards d\'étoiles et un cortège de plus de 10 000 amas globulaires.',
      fact: 'Son trou noir de 6,5 milliards de masses solaires est le premier à avoir été photographié, en 2019. Il propulse un jet de matière long d\'environ 5 000 années-lumière, visible sur cette image.' },
    { name: 'NGC 1365', alt: 'Grande galaxie barrée', kind: 'barred', ra: 3.56, dec: -36.14, d: 56, diam: 200, con: 'Fourneau',
      file: 'NGC 1365 (weic2403f).jpg', credit: 'NGC 1365 en infrarouge — NASA / ESA / CSA / STScI (Webb)',
      desc: 'Une spirale barrée géante de l\'amas du Fourneau, deux fois plus large que la Voie lactée. Sa barre centrale canalise le gaz vers le noyau.',
      fact: 'Le télescope James Webb y révèle, en infrarouge, un réseau de filaments de poussière où se cachent des étoiles en formation invisibles à Hubble.' },
    { name: 'NGC 1300', alt: 'Spirale barrée de l\'Éridan', kind: 'barred', ra: 3.328, dec: -19.41, d: 61, diam: 110, con: 'Éridan',
      file: 'Hubble2005-01-barred-spiral-galaxy-NGC1300.jpg', credit: 'NGC 1300 — NASA / ESA / Hubble Heritage Team',
      desc: 'L\'exemple parfait de la spirale barrée : une longue barre d\'étoiles traverse son centre et ses deux grands bras partent de ses extrémités.',
      fact: 'La Voie lactée possède elle aussi une barre centrale : vue de loin, elle ressemblerait sans doute un peu à NGC 1300.' },
    { name: 'Quintette de Stephan', alt: 'Groupe de Hickson 92', kind: 'pair', ra: 22.599, dec: 33.96, d: 290, diamText: 'cinq galaxies en apparence', con: 'Pégase',
      file: "Stephan's Quintet taken by James Webb Space Telescope.jpg", credit: 'Le Quintette de Stephan — NASA / ESA / CSA / STScI (Webb)',
      desc: 'Cinq galaxies groupées sur le ciel, dont quatre se bousculent réellement. Leurs collisions génèrent des ondes de choc géantes dans le gaz qui les entoure.',
      fact: 'L\'une des cinq est un intrus : NGC 7320 est en réalité sept fois plus proche que les autres. Ce groupe figurait parmi les toutes premières images du télescope James Webb, en 2022.' },
    { name: 'Galaxie du Têtard', alt: 'UGC 10214', kind: 'pair', ra: 16.101, dec: 55.42, d: 420, diamText: 'queue de ≈ 280 000 années-lumière', con: 'Dragon',
      file: 'UGC 10214HST.jpg', credit: 'La galaxie du Têtard — NASA / ESA / Hubble (ACS)',
      desc: 'Une spirale déformée par le passage d\'une petite galaxie, qui lui a arraché une immense queue d\'étoiles et de gaz : elle ressemble à un têtard.',
      fact: 'Derrière elle, l\'image dévoile des milliers de galaxies encore plus lointaines, comme un papier peint cosmique.' },
    { name: 'Galaxie de la Roue de chariot', alt: 'ESO 350-40', kind: 'ring', ra: 0.628, dec: -33.72, d: 500, diam: 150, con: 'Sculpteur',
      file: 'Cartwheel Galaxy (NIRCam and MIRI Composite Image) (weic2211a).jpeg', credit: 'La galaxie de la Roue de chariot — NASA / ESA / CSA / STScI (Webb)',
      desc: 'Une galaxie en forme de roue, avec un moyeu, des rayons et une jante. Cette forme rare est née d\'une collision : une petite galaxie l\'a traversée de part en part.',
      fact: 'Le choc a créé une onde qui s\'étend comme un rond dans l\'eau et fait naître des étoiles sur son passage, formant l\'anneau extérieur.' },
    { name: 'Objet de Hoag', alt: 'PGC 54559', kind: 'ring', ra: 15.287, dec: 21.59, d: 600, diam: 100, con: 'Serpent',
      file: "Hoag's object.jpg", credit: 'L\'objet de Hoag — NASA / Hubble Heritage Team',
      desc: 'Un anneau presque parfait d\'étoiles bleues entourant un noyau jaune, sans rien de visible entre les deux. Son origine reste une énigme pour les astronomes.',
      fact: 'Dans l\'espace vide entre le noyau et l\'anneau, on aperçoit une autre galaxie annulaire, bien plus lointaine.' },
  ];
  const ITEMS = [MILKY_WAY].concat(GALAXIES);

  const RAD = Math.PI / 180;
  // longitude galactique à partir des coordonnées équatoriales (J2000)
  function galacticLongitude(raHours, dec) {
    const a = raHours * 15 * RAD, d = dec * RAD;
    const aN = 192.85948 * RAD, dN = 27.12825 * RAD, lN = 122.93192 * RAD;
    const y = Math.cos(d) * Math.sin(a - aN);
    const x = Math.sin(d) * Math.cos(dN) - Math.cos(d) * Math.sin(dN) * Math.cos(a - aN);
    return lN - Math.atan2(y, x);
  }
  // échelle logarithmique : chaque facteur 10 en distance occupe la même place
  const D0 = 0.1, DMAX = 700;
  const radius = (d) => Math.log10(1 + d / D0) / Math.log10(1 + DMAX / D0);
  ITEMS.forEach((g) => {
    if (g.home) { g.x = 0; g.y = 0; g.tilt = 0.4; return; }
    const l = galacticLongitude(g.ra, g.dec), r = radius(g.d);
    g.x = r * Math.cos(l);
    g.y = -r * Math.sin(l);
    g.tilt = (g.ra * 1.7 + g.dec) % 3.14;
  });

  const distText = (d) => d < 1 ? fr(d * 1000) + ' 000 années-lumière' : fr(d, d < 10 ? 1 : 0) + ' millions d\'années-lumière';
  const agoText = (d) => d < 1 ? fr(d * 1000) + ' 000 ans' : fr(d, d < 10 ? 1 : 0) + ' millions d\'années';
  function earthThen(d) {
    let what;
    if (d < 0.3) what = 'Homo sapiens vivait déjà en Afrique.';
    else if (d < 3) what = 'les premiers humains du genre Homo apparaissaient en Afrique.';
    else if (d < 66) what = 'les dinosaures avaient déjà disparu et les mammifères se diversifiaient.';
    else if (d < 230) what = 'les dinosaures régnaient sur la Terre.';
    else if (d < 400) what = 'les dinosaures n\'existaient pas encore ; les premiers reptiles se répandaient sur les continents.';
    else if (d < 450) what = 'les premières plantes commençaient à coloniser la terre ferme.';
    else if (d < 540) what = 'la vie était encore entièrement marine : les océans grouillaient de trilobites.';
    else what = 'la vie se résumait à d\'étranges organismes au corps mou, au fond des océans.';
    return 'La lumière que l\'on reçoit aujourd\'hui est partie il y a ' + agoText(d) + '. À ce moment-là, ' + what;
  }

  /* ---------- Fiche ---------- */
  let current = 3; // Andromède
  const hidden = new Set();

  function renderCard() {
    const g = ITEMS[current];
    const image = $('g-img'), disc = $('g-disc');
    image.hidden = false; disc.hidden = true;
    disc.style.background = TYPES[g.kind].color;
    image.alt = g.credit;
    image.src = img(g.file);
    $('g-credit').textContent = g.credit;
    $('g-type').textContent = g.type || TYPES[g.kind].one;
    $('g-name').textContent = g.name;
    $('g-alt').textContent = g.alt;
    $('g-desc').textContent = g.desc;
    $('g-fact').textContent = g.fact;
    $('g-then-label').textContent = g.home ? 'Où sommes-nous ?' : 'Pendant ce temps, sur Terre';
    $('g-then').textContent = g.home ? g.here : earthThen(g.d);

    const stats = g.stats || [
      ['Distance', distText(g.d)],
      ['Diamètre', g.diam ? '≈ ' + fr(g.diam * 1000) + ' années-lumière' : g.diamText, g.diam ? fr(g.diam / 100, 1) + ' × la Voie lactée' : null],
      ['Constellation', g.con],
      ['Rang', fr(GALAXIES.indexOf(g) + 1) + 'ᵉ plus proche', 'sur ' + GALAXIES.length + ' de la carte'],
    ];
    const dl = $('g-stats');
    dl.textContent = '';
    stats.forEach(([k, v, note]) => {
      const wrap = el('div');
      wrap.appendChild(el('dt', null, k));
      const dd = el('dd', null, v);
      if (note) dd.appendChild(el('small', null, note));
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    });

    $('glist').querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.i === current)));
  }
  $('g-img').addEventListener('error', () => {
    const image = $('g-img');
    if (!image.src.startsWith('https:')) { image.src = online(ITEMS[current].file); return; }
    image.hidden = true; $('g-disc').hidden = false;
  });

  /* ---------- Carte ---------- */
  const canvas = $('sky');
  const ctx = canvas.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cam = { x: 0, y: 0, z: 1 };
  let W = 0, H = 0, hover = -1, tween = null, queued = false;
  const stars = Array.from({ length: 260 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + 0.2, a: Math.random() * 0.5 + 0.15 }));

  const scale = () => (Math.min(W, H) / 2 - 24) * cam.z;
  const toScreen = (x, y) => { const s = scale(); return [W / 2 + (x - cam.x) * s, H / 2 + (y - cam.y) * s]; };
  const glyphSize = (g) => (2.5 + 2.2 * Math.log10(Math.max(g.diam || 60, 5))) * Math.sqrt(Math.min(cam.z, 9));
  const visible = (g) => g.home || !hidden.has(g.kind);

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    request();
  }
  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame((t) => { queued = false; draw(t); });
  }

  function glyph(g, x, y, s, t) {
    const color = TYPES[g.kind].color;
    const halo = (cx, cy, r, c) => {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.22, c);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
    };
    ctx.save();
    ctx.translate(x, y);
    if (g.kind === 'spiral' || g.kind === 'barred') {
      ctx.rotate(g.tilt);
      halo(0, 0, s * 2, color);
      ctx.beginPath(); ctx.ellipse(0, 0, s * 2, s * (g.home ? 2 : 0.8), 0, 0, 6.2832); ctx.fill();
      if (s > 9) { // bras spiraux
        ctx.strokeStyle = color; ctx.globalAlpha = 0.55; ctx.lineWidth = Math.max(1, s / 8);
        for (let arm = 0; arm < 2; arm++) {
          ctx.beginPath();
          for (let k = 0; k <= 30; k++) {
            const a = arm * Math.PI + k * 0.16, r = s * (g.kind === 'barred' ? 0.5 : 0.2) + k * s * 0.05;
            const px = Math.cos(a) * r, py = Math.sin(a) * r * (g.home ? 1 : 0.42);
            if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.stroke();
        }
        if (g.kind === 'barred') { ctx.lineWidth = s / 4; ctx.beginPath(); ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0); ctx.stroke(); }
      }
    } else if (g.kind === 'elliptical') {
      halo(0, 0, s * 1.8, color);
      ctx.beginPath(); ctx.ellipse(0, 0, s * 1.8, s * 1.4, 0, 0, 6.2832); ctx.fill();
    } else if (g.kind === 'irregular') {
      [[0, 0, 1.3], [s * 0.7, -s * 0.4, 0.9], [-s * 0.6, s * 0.3, 0.8]].forEach(([dx, dy, f]) => {
        halo(dx, dy, s * f, color);
        ctx.beginPath(); ctx.arc(dx, dy, s * f, 0, 6.2832); ctx.fill();
      });
    } else if (g.kind === 'ring') {
      ctx.rotate(g.tilt);
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(1.2, s / 5);
      ctx.beginPath(); ctx.ellipse(0, 0, s * 1.5, s * 1.1, 0, 0, 6.2832); ctx.stroke();
      halo(0, 0, s * 0.7, '#ffe2a8');
      ctx.beginPath(); ctx.arc(0, 0, s * 0.7, 0, 6.2832); ctx.fill();
    } else { // paire en collision
      ctx.rotate(g.tilt);
      halo(-s * 0.55, 0, s * 1.2, color);
      ctx.beginPath(); ctx.arc(-s * 0.55, 0, s * 1.2, 0, 6.2832); ctx.fill();
      halo(s * 0.75, s * 0.2, s * 0.9, color);
      ctx.beginPath(); ctx.arc(s * 0.75, s * 0.2, s * 0.9, 0, 6.2832); ctx.fill();
    }
    ctx.restore();
  }

  function draw(t = 0) {
    if (tween) {
      const k = Math.min((t - tween.t0) / tween.ms, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cam.x = tween.from.x + (tween.to.x - tween.from.x) * e;
      cam.y = tween.from.y + (tween.to.y - tween.from.y) * e;
      cam.z = Math.exp(Math.log(tween.from.z) + (Math.log(tween.to.z) - Math.log(tween.from.z)) * e);
      if (k >= 1) tween = null;
    }
    ctx.clearRect(0, 0, W, H);

    // étoiles d'arrière-plan, avec un léger effet de profondeur
    ctx.fillStyle = '#ffffff';
    for (const s of stars) {
      const x = ((s.x - cam.x * 0.04) % 1 + 1) % 1 * W, y = ((s.y - cam.y * 0.04) % 1 + 1) % 1 * H;
      ctx.globalAlpha = s.a;
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // cercles de distance
    const [ox, oy] = toScreen(0, 0), S = scale();
    const placed = []; // zones déjà occupées par du texte
    ctx.font = '400 11px Inter, sans-serif';
    ctx.setLineDash([3, 6]);
    [[1, '1 million d\'al'], [10, '10 millions d\'al'], [100, '100 millions d\'al'], [500, '500 millions d\'al']].forEach(([d, label]) => {
      const r = radius(d) * S;
      ctx.strokeStyle = '#262626';
      ctx.beginPath(); ctx.arc(ox, oy, r, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = '#6a6a6a';
      ctx.fillText(label, ox + 6, oy - r - 6);
      placed.push([ox + 3, oy - r - 18, ox + 9 + ctx.measureText(label).width, oy - r - 2]);
    });
    ctx.setLineDash([]);
    // Groupe local
    const rl = radius(4) * S;
    ctx.strokeStyle = 'rgba(128, 82, 255, .35)';
    ctx.beginPath(); ctx.arc(ox, oy, rl, 0, 6.2832); ctx.stroke();
    ctx.fillStyle = '#8052ff';
    ctx.fillText('GROUPE LOCAL', ox - 40, oy + rl + 16);

    // galaxies
    const order = ITEMS.map((g, i) => i).filter((i) => visible(ITEMS[i]));
    order.forEach((i) => {
      const g = ITEMS[i], [x, y] = toScreen(g.x, g.y);
      if (x < -60 || y < -60 || x > W + 60 || y > H + 60) return;
      const s = g.home ? 7 * Math.sqrt(Math.min(cam.z, 9)) : glyphSize(g);
      glyph(g, x, y, s, t);
      if (i === current || i === hover) {
        ctx.strokeStyle = i === current ? '#ffb829' : '#9a9a9a';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, s * 2 + 6, 0, 6.2832); ctx.stroke();
        ctx.lineWidth = 1;
      }
    });
    // étiquettes : la sélection et le survol d'abord, puis les autres si elles ne se chevauchent pas
    const priority = [current, hover].filter((i) => i >= 0 && visible(ITEMS[i]));
    priority.concat(order.filter((i) => !priority.includes(i))).forEach((i) => {
      const g = ITEMS[i], [x, y] = toScreen(g.x, g.y);
      const strong = priority.includes(i);
      ctx.font = (strong ? '600 12px' : '400 11px') + ' Inter, sans-serif';
      const text = g.home ? 'VOIE LACTÉE · TU ES ICI' : strong ? g.name.toUpperCase() : g.name;
      const s = g.home ? 7 * Math.sqrt(Math.min(cam.z, 9)) : glyphSize(g);
      const w = ctx.measureText(text).width, lx = Math.min(Math.max(x - w / 2, 4), W - w - 4), ly = y + s * 2 + 16;
      const box = [lx - 3, ly - 12, lx + w + 3, ly + 4];
      if (!strong && placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) return;
      if (x < -60 || y < -60 || x > W + 60 || y > H + 60) return;
      placed.push(box);
      ctx.fillStyle = strong ? '#ffffff' : '#9a9a9a';
      ctx.fillText(text, lx, ly);
    });

    $('sky-hint').textContent = 'Zoom × ' + fr(cam.z, 1) + ' · glisser pour se déplacer · molette ou pincement pour zoomer';
    if (tween) request();
  }

  function hit(px, py) {
    let best = -1, bd = Infinity;
    ITEMS.forEach((g, i) => {
      if (!visible(g)) return;
      const [x, y] = toScreen(g.x, g.y);
      const s = g.home ? 7 * Math.sqrt(Math.min(cam.z, 9)) : glyphSize(g);
      const d = Math.hypot(x - px, y - py);
      if (d < Math.max(s * 2, 16) && d < bd) { bd = d; best = i; }
    });
    return best;
  }

  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  function zoomAt(px, py, f) {
    const s0 = scale();
    const wx = cam.x + (px - W / 2) / s0, wy = cam.y + (py - H / 2) / s0;
    cam.z = clamp(cam.z * f, 0.8, 60);
    const s1 = scale();
    cam.x = clamp(wx - (px - W / 2) / s1, -1.2, 1.2);
    cam.y = clamp(wy - (py - H / 2) / s1, -1.2, 1.2);
    request();
  }
  function flyTo(x, y, z) {
    const to = { x, y, z };
    if (still) { Object.assign(cam, to); request(); return; }
    tween = { from: { ...cam }, to, t0: performance.now(), ms: 900 };
    request();
  }
  function select(i, fly) {
    current = i;
    renderCard();
    const g = ITEMS[i];
    if (fly) flyTo(g.x, g.y, g.home ? 1 : clamp(0.55 / (Math.hypot(g.x, g.y) + 0.08), 1.2, 7));
    else request();
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
      const h = hit(e.clientX - rect.left, e.clientY - rect.top);
      if (h !== hover) { hover = h; canvas.style.cursor = h >= 0 ? 'pointer' : 'grab'; request(); }
      return;
    }
    const cur = { x: e.clientX, y: e.clientY };
    if (pointers.size === 1) {
      const s = scale();
      cam.x = clamp(cam.x - (cur.x - prev.x) / s, -1.2, 1.2);
      cam.y = clamp(cam.y - (cur.y - prev.y) / s, -1.2, 1.2);
      moved += Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y);
      canvas.style.cursor = 'grabbing';
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
      const i = hit(e.clientX - rect.left, e.clientY - rect.top);
      if (i >= 0) select(i);
    }
    pointers.delete(e.pointerId);
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { if (hover !== -1) { hover = -1; request(); } });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    tween = null;
    const rect = canvas.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });
  canvas.addEventListener('keydown', (e) => {
    const step = 0.12 / cam.z;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      cam.x = clamp(cam.x + moves[e.key][0], -1.2, 1.2);
      cam.y = clamp(cam.y + moves[e.key][1], -1.2, 1.2);
    } else if (e.key === '+' || e.key === '=') zoomAt(W / 2, H / 2, 1.4);
    else if (e.key === '-') zoomAt(W / 2, H / 2, 1 / 1.4);
    else return;
    e.preventDefault();
    request();
  });
  $('zin').addEventListener('click', () => zoomAt(W / 2, H / 2, 1.5));
  $('zout').addEventListener('click', () => zoomAt(W / 2, H / 2, 1 / 1.5));
  $('zreset').addEventListener('click', () => flyTo(0, 0, 1));

  /* ---------- Légende (filtres) et liste ---------- */
  const legend = $('legend');
  Object.entries(TYPES).forEach(([kind, t]) => {
    const b = el('button', 'ghost legend-item');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'true');
    const sw = el('i');
    sw.style.background = t.color;
    b.appendChild(sw);
    b.appendChild(document.createTextNode(t.label));
    b.addEventListener('click', () => {
      if (hidden.has(kind)) hidden.delete(kind); else hidden.add(kind);
      b.setAttribute('aria-pressed', String(!hidden.has(kind)));
      $('glist').querySelectorAll('button').forEach((x) => { x.hidden = !visible(ITEMS[+x.dataset.i]); });
      request();
    });
    legend.appendChild(b);
  });

  const list = $('glist');
  ITEMS.forEach((g, i) => {
    const b = el('button', 'ghost', g.name);
    b.type = 'button';
    b.dataset.i = i;
    b.setAttribute('role', 'tab');
    b.addEventListener('click', () => select(i, true));
    list.appendChild(b);
  });

  new ResizeObserver(resize).observe(canvas);
  renderCard();
  resize();
})();
