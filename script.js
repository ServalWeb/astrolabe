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

  /* ---------- Données (NASA Planetary Fact Sheet) ----------
     diam : diamètre équatorial (km) · mass : masse (Terre = 1) · dist : distance moyenne au Soleil (millions de km)
     year : période de révolution (jours terrestres) · g : gravité (m/s²) · temp : température moyenne (°C) */
  const SUN = {
    name: 'Soleil', type: 'Étoile · naine jaune (G2V)', color: '#ffb829', px: 14,
    file: "The Sun by the Atmospheric Imaging Assembly of NASA's Solar Dynamics Observatory - 20100819.jpg",
    credit: 'Le Soleil en ultraviolet extrême — NASA / SDO',
    desc: 'Une boule de plasma qui transforme chaque seconde environ 600 millions de tonnes d\'hydrogène en hélium. Sa gravité retient tout le système solaire, et sa lumière met un peu plus de huit minutes à atteindre la Terre.',
    fact: 'Le Soleil concentre 99,86 % de la masse du système solaire. On pourrait y loger environ 1,3 million de Terres.',
    stats: [
      ['Diamètre', '1 392 700 km', '109 fois la Terre'],
      ['Masse', '333 000 Terres', '1,989 × 10³⁰ kg'],
      ['Température de surface', '≈ 5 500 °C'],
      ['Température du cœur', '≈ 15 millions °C'],
      ['Âge', '4,6 milliards d\'années'],
      ['Composition', '73 % hydrogène', '25 % hélium'],
      ['Rotation à l\'équateur', '≈ 25 jours'],
      ['Distance du centre galactique', '≈ 26 000 années-lumière'],
    ],
  };

  const PLANETS = [
    { name: 'Mercure', type: 'Planète tellurique', color: '#9a9a9a', px: 3.5,
      diam: 4879, mass: 0.0553, dist: 57.9, year: 87.97, day: '58,6 jours', g: 3.7, temp: 167, moons: 0,
      file: 'Mercury in true color.jpg', credit: 'Mercure en couleurs réelles — NASA / MESSENGER',
      desc: 'La plus petite planète et la plus proche du Soleil. Sans véritable atmosphère pour retenir la chaleur, sa surface criblée de cratères passe d\'environ 430 °C le jour à −180 °C la nuit.',
      fact: 'Mercure tourne si lentement sur elle-même qu\'une journée solaire complète (d\'un lever de Soleil au suivant) y dure deux années mercuriennes.' },
    { name: 'Vénus', type: 'Planète tellurique', color: '#e8c887', px: 5,
      diam: 12104, mass: 0.815, dist: 108.2, year: 224.7, day: '243 jours', dayNote: 'rotation rétrograde', g: 8.9, temp: 464, moons: 0,
      file: 'PIA23791-Venus-RealAndEnhancedContrastViews-20200608 (cropped2).jpg', credit: 'Vénus vue par Mariner 10 — NASA / JPL-Caltech',
      desc: 'Presque la jumelle de la Terre par la taille, mais un enfer : une atmosphère de dioxyde de carbone 90 fois plus dense que la nôtre et des nuages d\'acide sulfurique entretiennent un effet de serre extrême.',
      fact: 'Vénus est la planète la plus chaude du système solaire, plus chaude que Mercure pourtant deux fois plus proche du Soleil. Elle tourne à l\'envers : le Soleil s\'y lève à l\'ouest.' },
    { name: 'Terre', type: 'Planète tellurique', color: '#3b82ff', px: 5,
      diam: 12756, mass: 1, dist: 149.6, year: 365.26, day: '23 h 56 min', g: 9.8, temp: 15, moons: 1,
      file: 'The Blue Marble (remastered).jpg', credit: 'La « Bille bleue », Apollo 17 — NASA',
      desc: 'Le seul monde connu qui abrite la vie. L\'eau liquide couvre 71 % de sa surface, son atmosphère d\'azote et d\'oxygène filtre les rayonnements, et son champ magnétique dévie le vent solaire.',
      fact: 'La Terre est la plus dense des planètes du système solaire : 5,5 fois la densité de l\'eau, grâce à son noyau de fer et de nickel.' },
    { name: 'Mars', type: 'Planète tellurique', color: '#e0623a', px: 4,
      diam: 6792, mass: 0.107, dist: 227.9, year: 686.98, day: '24 h 37 min', g: 3.7, temp: -65, moons: 2,
      file: 'OSIRIS Mars true color.jpg', credit: 'Mars en couleurs réelles — ESA / Rosetta (OSIRIS)',
      desc: 'La planète rouge doit sa couleur à l\'oxyde de fer de son sol. Froide et désertique, enveloppée d\'une fine atmosphère de dioxyde de carbone, elle garde les traces d\'anciens fleuves et de lacs disparus.',
      fact: 'Mars porte le plus haut volcan connu du système solaire, Olympus Mons : environ 22 km d\'altitude, près de trois fois l\'Everest.' },
    { name: 'Cérès', type: 'Planète naine', color: '#b8b3a8', px: 2, dwarf: true,
      diam: 940, mass: 0.000157, dist: 413.7, year: 1682, day: '9 h 04 min', g: 0.28, temp: -105, moons: 0,
      file: 'Ceres - RC3 - Haulani Crater (22381131691) (cropped).jpg', credit: 'Cérès vue par la sonde Dawn — NASA / JPL-Caltech',
      desc: 'Le plus gros objet de la ceinture d\'astéroïdes, entre Mars et Jupiter. Découverte en 1801, elle a d\'abord été prise pour une planète, puis pour un astéroïde, avant d\'être classée planète naine en 2006.',
      fact: 'La sonde Dawn de la NASA y a repéré des taches très brillantes au fond du cratère Occator : des dépôts de sels laissés par une eau salée remontée des profondeurs.' },
    { name: 'Jupiter', type: 'Géante gazeuse', color: '#d9a66b', px: 11,
      diam: 142984, mass: 317.8, dist: 778.5, year: 4332.6, day: '9 h 56 min', g: 23.1, temp: -110, moons: 95,
      file: 'Jupiter and its shrunken Great Red Spot.jpg', credit: 'Jupiter et sa Grande Tache rouge — NASA / ESA / Hubble',
      desc: 'La plus grande planète : une boule d\'hydrogène et d\'hélium sans surface solide, striée de bandes nuageuses. Sa masse dépasse deux fois celle de toutes les autres planètes réunies.',
      fact: 'La Grande Tache rouge est une tempête plus large que la Terre, observée depuis plus de 150 ans. Jupiter est aussi la planète qui tourne le plus vite : un jour y dure moins de 10 heures.' },
    { name: 'Saturne', type: 'Géante gazeuse', color: '#e6cf8f', px: 9, ring: true,
      diam: 120536, mass: 95.2, dist: 1432, year: 10759, day: '10 h 39 min', g: 9.0, temp: -140, moons: 274,
      file: 'Saturn during Equinox.jpg', credit: 'Saturne à l\'équinoxe — NASA / JPL / Cassini',
      desc: 'La planète aux anneaux. Ceux-ci, faits de milliards de fragments de glace et de roche, s\'étendent sur plus de 280 000 km de large pour une épaisseur souvent inférieure à quelques dizaines de mètres.',
      fact: 'Saturne est la seule planète moins dense que l\'eau : dans un océan assez grand, elle flotterait. C\'est aussi celle qui compte le plus de lunes connues.' },
    { name: 'Uranus', type: 'Géante de glaces', color: '#8fe0e0', px: 7,
      diam: 51118, mass: 14.5, dist: 2867, year: 30687, day: '17 h 14 min', dayNote: 'rotation rétrograde', g: 8.7, temp: -195, moons: 28,
      file: "Uranus as seen by NASA's Voyager 2 (remastered) - JPEG converted.jpg", credit: 'Uranus vue par Voyager 2 — NASA / JPL-Caltech',
      desc: 'Une géante de glaces bleu-vert, colorée par le méthane de sa haute atmosphère. Sous les nuages, un manteau d\'eau, d\'ammoniac et de méthane entoure un petit noyau rocheux.',
      fact: 'Uranus roule sur son orbite : son axe est incliné de 98°. Chaque pôle connaît ainsi environ 42 ans de jour continu, puis 42 ans de nuit.' },
    { name: 'Neptune', type: 'Géante de glaces', color: '#4a6bff', px: 7,
      diam: 49528, mass: 17.1, dist: 4515, year: 60190, day: '16 h 07 min', g: 11.0, temp: -200, moons: 16,
      file: 'Neptune - Voyager 2 (29347980845) flatten crop.jpg', credit: 'Neptune vue par Voyager 2 — NASA / JPL-Caltech',
      desc: 'La planète la plus lointaine, invisible à l\'œil nu. Elle a été découverte en 1846 par le calcul, à partir des perturbations de l\'orbite d\'Uranus, avant d\'être observée au télescope.',
      fact: 'Neptune détient le record des vents les plus rapides du système solaire : plus de 2 000 km/h. Depuis sa découverte, elle n\'a bouclé qu\'un seul tour du Soleil, en 2011.' },
    { name: 'Pluton', type: 'Planète naine', color: '#d8b48c', px: 2.5, dwarf: true,
      diam: 2377, mass: 0.0022, dist: 5906, year: 90560, day: '6,4 jours', dayNote: 'rotation rétrograde', g: 0.62, temp: -225, moons: 5,
      file: 'Pluto in True Color - High-Res.jpg', credit: 'Pluton en couleurs réelles — NASA / JHUAPL / SwRI (New Horizons)',
      desc: 'Découverte en 1930 et longtemps considérée comme la neuvième planète, Pluton a été reclassée planète naine en 2006. Ce monde de roche et de glace évolue dans la ceinture de Kuiper, au-delà de Neptune.',
      fact: 'En 2015, la sonde New Horizons y a révélé un immense glacier d\'azote en forme de cœur, Tombaugh Regio. Sa lune Charon est si grosse que les deux astres tournent autour d\'un point situé entre eux.' },
    { name: 'Haumea', type: 'Planète naine', color: '#e3e3e3', px: 2, dwarf: true,
      diam: 1600, diamNote: 'diamètre moyen, forme allongée', mass: 0.00067, dist: 6452, year: 103774, day: '3 h 55 min', g: 0.4, temp: -241, moons: 2,
      file: 'Haumea Hubble.png', credit: 'Haumea et ses deux lunes, un simple point lumineux pour Hubble — NASA / ESA',
      desc: 'Une planète naine de la ceinture de Kuiper recouverte de glace d\'eau cristalline. Elle possède deux lunes, Hiʻiaka et Namaka, et un anneau découvert en 2017.',
      fact: 'Haumea tourne sur elle-même en moins de 4 heures, un record parmi les grands corps du système solaire. Cette rotation folle l\'a étirée en forme de ballon de rugby.' },
    { name: 'Makémaké', type: 'Planète naine', color: '#c98b6b', px: 2, dwarf: true,
      diam: 1430, mass: 0.00052, dist: 6850, year: 111845, day: '22 h 50 min', g: 0.5, temp: -240, moons: 1,
      file: 'Makemake and its moon.jpg', credit: 'Makémaké et sa petite lune vues par Hubble — NASA / ESA',
      desc: 'Découverte en 2005, peu après Pâques, elle porte le nom du dieu créateur du peuple Rapa Nui de l\'île de Pâques. Sa surface rougeâtre est couverte de glaces de méthane et d\'éthane.',
      fact: 'Le télescope Hubble a découvert en 2016 sa petite lune sombre, surnommée MK2, environ 1 300 fois moins lumineuse que Makémaké.' },
    { name: 'Éris', type: 'Planète naine', color: '#f0ece4', px: 2.5, dwarf: true,
      diam: 2326, mass: 0.0028, dist: 10125, year: 204199, day: '15,8 jours', g: 0.82, temp: -231, moons: 1,
      file: 'Eris and dysnomia2.jpg', credit: 'Éris et sa lune Dysnomie vues par Hubble — NASA / ESA',
      desc: 'La planète naine la plus massive connue, environ 27 % plus lourde que Pluton. Son orbite très allongée l\'emmène jusqu\'à près de 100 fois la distance Terre-Soleil.',
      fact: 'Sa découverte en 2005 a obligé les astronomes à définir officiellement ce qu\'est une planète. Résultat en 2006 : Pluton et Éris sont devenues des planètes naines.' },
  ];
  // hors du système solaire : fiche seule, sans comparaisons ni orbite
  const ANDROMEDA = {
    name: 'Andromède', type: 'Galaxie spirale · hors du système solaire', color: '#c9b8ff', galaxy: true,
    file: 'Andromeda galaxy.jpg',
    credit: 'La galaxie d\'Andromède en ultraviolet — NASA / JPL-Caltech (GALEX)',
    desc: 'La grande galaxie voisine de la nôtre, la Voie lactée. Ce disque spirale de quelque 1 000 milliards d\'étoiles est l\'objet le plus lointain que l\'on puisse voir à l\'œil nu, par une nuit bien noire, dans la constellation d\'Andromède.',
    fact: 'La lumière qui nous en parvient est partie il y a environ 2,5 millions d\'années. Andromède se rapproche de nous à près de 110 km/s : une fusion avec la Voie lactée est possible dans quelques milliards d\'années, mais les études récentes ne lui donnent plus qu\'environ une chance sur deux d\'ici 10 milliards d\'années.',
    stats: [
      ['Distance', '≈ 2,5 millions d\'années-lumière', '≈ 24 milliards de milliards de km'],
      ['Diamètre', '≈ 220 000 années-lumière', 'environ 2 fois la Voie lactée'],
      ['Étoiles', '≈ 1 000 milliards'],
      ['Vitesse d\'approche', '≈ 110 km/s', 'vers la Voie lactée'],
      ['Galaxies satellites', 'M32, M110', 'et des dizaines d\'autres'],
      ['Désignations', 'M31', 'NGC 224'],
      ['Taille dans le ciel', '≈ 6 pleines lunes', 'de largeur'],
      ['Identifiée comme galaxie', '1923', 'par Edwin Hubble'],
    ],
  };
  /* ---------- Astéroïdes (JPL Small-Body Database, NASA) ----------
     au : demi-grand axe (UA) · year : période de révolution (jours) */
  const ASTEROIDS = [
    { name: 'Vesta', type: 'Astéroïde · ceinture principale', color: '#c9c2b4', px: 1.8, au: 2.36, year: 1330,
      file: 'Vesta full mosaic.jpg', credit: 'Vesta vue par la sonde Dawn — NASA / JPL-Caltech / UCLA / MPS / DLR / IDA',
      desc: 'Le deuxième objet le plus massif de la ceinture d\'astéroïdes, après Cérès. Vesta est un petit monde différencié, avec une croûte, un manteau et un noyau, comme une planète en miniature.',
      fact: 'Son pôle sud porte le cratère Rheasilvia, large d\'environ 500 km, soit 95 % du diamètre de l\'astéroïde. Des météorites tombées sur Terre proviennent de cet impact.',
      stats: [
        ['Diamètre', '≈ 523 km', 'environ 1/24 de la Terre'],
        ['Distance au Soleil', '2,36 UA', '≈ 353 M km'],
        ['Durée de l\'année', '3,6 ans', '1 330 jours'],
        ['Rotation sur lui-même', '5 h 21 min'],
        ['Découverte', '1807', 'par Heinrich Olbers'],
        ['Exploration', 'Dawn (NASA)', 'en orbite de 2011 à 2012'],
      ] },
    { name: 'Pallas', type: 'Astéroïde · ceinture principale', color: '#9d9a94', px: 1.8, au: 2.77, year: 1680,
      file: 'Pallas - Potw2008a.jpg', credit: 'Pallas vue par le Très Grand Télescope (SPHERE) — ESO / M. Marsset et al.',
      desc: 'Le deuxième astéroïde découvert, après Cérès. Son orbite est très inclinée : Pallas passe loin au-dessus puis loin au-dessous du plan où tournent les planètes.',
      fact: 'Son orbite est inclinée d\'environ 35° par rapport à celle de la Terre, ce qui rend une visite par une sonde particulièrement coûteuse en carburant.',
      stats: [
        ['Diamètre', '≈ 513 km'],
        ['Distance au Soleil', '2,77 UA', '≈ 414 M km'],
        ['Durée de l\'année', '4,6 ans', '1 680 jours'],
        ['Rotation sur lui-même', '7 h 49 min'],
        ['Inclinaison de l\'orbite', '34,9°'],
        ['Découverte', '1802', 'par Heinrich Olbers'],
      ] },
    { name: 'Hygie', type: 'Astéroïde · ceinture principale', color: '#6f6a64', px: 1.7, au: 3.15, year: 2040,
      file: 'SPHERE image of Hygiea (eso1918a).jpg', credit: 'Hygie vue par le Très Grand Télescope (SPHERE) — ESO / P. Vernazza et al.',
      desc: 'Le quatrième plus gros objet de la ceinture d\'astéroïdes. Sombre et riche en carbone, Hygie réfléchit à peine 7 % de la lumière qu\'elle reçoit.',
      fact: 'Des images du Très Grand Télescope (ESO) ont montré en 2019 qu\'Hygie est presque sphérique : certains astronomes proposent d\'en faire la plus petite planète naine.',
      stats: [
        ['Diamètre', '≈ 407 km'],
        ['Distance au Soleil', '3,15 UA', '≈ 471 M km'],
        ['Durée de l\'année', '5,6 ans', '2 040 jours'],
        ['Rotation sur elle-même', '13 h 50 min'],
        ['Albédo', '7 %', 'surface très sombre'],
        ['Découverte', '1849', 'par Annibale de Gasparis'],
      ] },
    { name: 'Psyché', type: 'Astéroïde métallique · ceinture principale', color: '#b7a98c', px: 1.6, au: 2.93, year: 1830,
      file: 'Illustration of Psyche, March 2021 (PIA24473).jpg', credit: 'Vue d\'artiste de Psyché — NASA / JPL-Caltech / ASU / Peter Rubin',
      desc: 'Un astéroïde riche en métal, peut-être le noyau partiel d\'une planète en formation dont les couches extérieures auraient été arrachées par des collisions.',
      fact: 'La sonde Psyche de la NASA, lancée le 13 octobre 2023, doit commencer à l\'explorer en 2029 : la première visite d\'un monde fait de métal plutôt que de roche ou de glace.',
      stats: [
        ['Diamètre', '≈ 222 km'],
        ['Distance au Soleil', '2,93 UA', '≈ 438 M km'],
        ['Durée de l\'année', '5 ans', '1 830 jours'],
        ['Rotation sur lui-même', '4 h 12 min'],
        ['Composition', 'riche en métal', 'fer et nickel probables'],
        ['Exploration', 'Psyche (NASA)', 'arrivée prévue en 2029'],
      ] },
    { name: 'Bennu', type: 'Astéroïde géocroiseur', color: '#8a8580', px: 1.4, au: 1.13, year: 437,
      file: 'Bennu mosaic OSIRIS-REx.jpg', credit: 'Mosaïque de Bennu par OSIRIS-REx — NASA / Goddard / University of Arizona',
      desc: 'Un petit astéroïde sombre, un tas de gravats tenus ensemble par leur faible gravité. Son orbite croise celle de la Terre et il s\'en approche environ tous les six ans.',
      fact: 'La sonde OSIRIS-REx de la NASA a prélevé des roches et de la poussière à sa surface le 20 octobre 2020. La capsule est revenue sur Terre, dans l\'Utah, le 24 septembre 2023.',
      stats: [
        ['Diamètre', '≈ 490 m', 'à l\'équateur'],
        ['Distance au Soleil', '1,13 UA', 'en moyenne'],
        ['Durée de l\'année', '437 jours'],
        ['Rotation sur lui-même', '4 h 18 min'],
        ['Passage près de la Terre', 'tous les ≈ 6 ans', 'jusqu\'à ≈ 299 000 km'],
        ['Exploration', 'OSIRIS-REx (NASA)', 'échantillon rapporté en 2023'],
      ] },
    { name: 'Apophis', type: 'Astéroïde géocroiseur', color: '#a39a8c', px: 1.4, au: 0.92, year: 324,
      file: 'PIA24168-Asteroid-99942Apophis-RadarImages-20210326.jpg', credit: 'Apophis vu au radar en mars 2021 (Goldstone et Green Bank) — NASA / JPL-Caltech, NSF / AUI / GBO',
      desc: 'Découvert en 2004, Apophis a d\'abord inquiété les astronomes comme impacteur possible. Les observations suivantes ont écarté tout risque de collision pour au moins un siècle.',
      fact: 'Le 13 avril 2029, il frôlera la Terre à environ 32 000 km de la surface, plus près que certains satellites, et sera visible à l\'œil nu. La sonde OSIRIS-APEX de la NASA l\'étudiera de près.',
      stats: [
        ['Diamètre', '≈ 340 m'],
        ['Distance au Soleil', '0,92 UA', 'en moyenne'],
        ['Durée de l\'année', '324 jours'],
        ['Rotation sur lui-même', '≈ 30 h 34 min'],
        ['Passage au plus près', '13 avril 2029', '≈ 32 000 km de la surface'],
        ['Risque d\'impact', 'aucun', 'pour au moins 100 ans'],
      ] },
  ];

  /* ---------- Exoplanètes (NASA Exoplanet Archive) ----------
     hors du système solaire : dessinées dans les coins avec leur étoile, sans échelle */
  const EXOPLANETS = [
    { name: '51 Pegasi b', type: 'Exoplanète · Jupiter chaud', color: '#ff9a52', star: '#ffe08a', year: 4.23,
      file: 'Artist impression of the exoplanet 51 Pegasi b.jpg', credit: 'Vue d\'artiste de 51 Pegasi b — ESO / M. Kornmesser / Nick Risinger',
      desc: 'La première exoplanète découverte autour d\'une étoile semblable au Soleil, par les Suisses Michel Mayor et Didier Queloz en 1995. Une géante gazeuse collée à son étoile.',
      fact: 'Elle boucle son année en un peu plus de 4 jours. Sa découverte a valu le prix Nobel de physique 2019 à ses découvreurs et a lancé la chasse aux exoplanètes.',
      stats: [
        ['Distance', '≈ 50 années-lumière', 'constellation de Pégase'],
        ['Masse', '≈ 0,46 Jupiter', 'masse minimale'],
        ['Durée de l\'année', '4,2 jours'],
        ['Distance à son étoile', '0,052 UA', '8 fois moins que Mercure'],
        ['Température estimée', '≈ 1 050 °C'],
        ['Découverte', '1995', 'Observatoire de Haute-Provence'],
      ] },
    { name: 'Proxima b', type: 'Exoplanète · tellurique probable', color: '#d9785a', star: '#ff6b4a', year: 11.2,
      file: 'Artist\'s impression of the planet orbiting Proxima Centauri.jpg', credit: 'Vue d\'artiste de la surface de Proxima b — ESO / M. Kornmesser',
      desc: 'L\'exoplanète la plus proche du système solaire. Elle tourne autour de Proxima du Centaure, une naine rouge, dans la zone où l\'eau pourrait rester liquide en surface.',
      fact: 'Même à la vitesse de la lumière, il faudrait plus de 4 ans pour l\'atteindre. Sa naine rouge lance de violentes éruptions qui pourraient avoir arraché son atmosphère.',
      stats: [
        ['Distance', '4,24 années-lumière', 'la plus proche connue'],
        ['Masse', '≈ 1,07 Terre', 'masse minimale'],
        ['Durée de l\'année', '11,2 jours'],
        ['Distance à son étoile', '0,048 UA'],
        ['Température estimée', '≈ −55 °C', 'sans atmosphère'],
        ['Découverte', '2016'],
      ] },
    { name: 'TRAPPIST-1 e', type: 'Exoplanète · tellurique', color: '#7fb3ff', star: '#ff5a3c', year: 6.1,
      file: 'PIA21422 - TRAPPIST-1 Planet Lineup.jpg', credit: 'Vue d\'artiste des sept planètes de TRAPPIST-1 ; TRAPPIST-1 e est la quatrième en partant de la gauche — NASA / JPL-Caltech',
      desc: 'L\'une des sept planètes rocheuses de l\'étoile TRAPPIST-1, une naine rouge ultra-froide. Sa taille et sa masse sont très proches de celles de la Terre.',
      fact: 'TRAPPIST-1 compte sept planètes de la taille de la Terre, dont trois dans la zone habitable. Le télescope spatial James Webb scrute leur éventuelle atmosphère.',
      stats: [
        ['Distance', '≈ 40 années-lumière', 'constellation du Verseau'],
        ['Diamètre', '0,92 × la Terre'],
        ['Masse', '0,69 Terre'],
        ['Durée de l\'année', '6,1 jours'],
        ['Température estimée', '≈ −23 °C'],
        ['Découverte', '2017'],
      ] },
    { name: 'Kepler-186 f', type: 'Exoplanète · taille de la Terre', color: '#6fd0a0', star: '#ff8a5c', year: 129.9,
      file: 'Kepler186f-ArtistConcept-20140417.jpg', credit: 'Vue d\'artiste de Kepler-186 f — NASA Ames / SETI Institute / JPL-Caltech',
      desc: 'La première planète de la taille de la Terre trouvée dans la zone habitable d\'une autre étoile, grâce au télescope spatial Kepler de la NASA.',
      fact: 'Son étoile, une naine rouge, l\'éclaire faiblement : à midi sur Kepler-186 f, la lumière ressemblerait à celle d\'une heure avant le coucher du Soleil sur Terre.',
      stats: [
        ['Distance', '≈ 580 années-lumière', 'constellation du Cygne'],
        ['Diamètre', '1,17 × la Terre'],
        ['Durée de l\'année', '130 jours'],
        ['Distance à son étoile', '0,43 UA'],
        ['Température estimée', '≈ −96 °C', 'sans effet de serre'],
        ['Découverte', '2014', 'télescope Kepler'],
      ] },
    { name: 'K2-18 b', type: 'Exoplanète · sub-Neptune', color: '#5fa8d3', star: '#ff7a50', year: 32.9,
      file: 'Exoplanet K2-18 b (Illustration).jpg', credit: 'Vue d\'artiste de K2-18 b — NASA / ESA / CSA / Joseph Olmsted (STScI)',
      desc: 'Une planète plus grosse que la Terre et plus petite que Neptune, dans la zone habitable de sa naine rouge. Elle pourrait abriter un océan sous une atmosphère riche en hydrogène.',
      fact: 'En 2023, le télescope James Webb y a détecté du méthane et du dioxyde de carbone. Des indices d\'autres molécules, possiblement liées à la vie, restent très débattus.',
      stats: [
        ['Distance', '≈ 124 années-lumière', 'constellation du Lion'],
        ['Diamètre', '2,4 × la Terre'],
        ['Masse', '8,9 Terres'],
        ['Durée de l\'année', '33 jours'],
        ['Température estimée', '≈ 11 °C'],
        ['Découverte', '2015', 'mission K2 de Kepler'],
      ] },
    { name: 'HD 189733 b', type: 'Exoplanète · Jupiter chaud', color: '#3d6bff', star: '#ffc070', year: 2.2,
      file: 'Artist\'s impression of the extrasolar planet HD 189733b (heic0807a).jpg', credit: 'Vue d\'artiste de HD 189733 b devant son étoile — ESA / NASA / G. Tinetti / M. Kornmesser',
      desc: 'Une géante gazeuse d\'un bleu profond, proche de son étoile. Son atmosphère chargée de particules de silicate lui donne sa couleur.',
      fact: 'Il y pleuvrait du verre, soufflé à l\'horizontale par des vents de plus de 8 000 km/h. En 2024, le télescope James Webb y a trouvé du sulfure d\'hydrogène, qui sent l\'œuf pourri.',
      stats: [
        ['Distance', '≈ 64 années-lumière', 'constellation du Petit Renard'],
        ['Masse', '≈ 1,13 Jupiter'],
        ['Durée de l\'année', '2,2 jours'],
        ['Distance à son étoile', '0,031 UA'],
        ['Température estimée', '≈ 940 °C'],
        ['Découverte', '2005'],
      ] },
  ];

  const BODIES = [SUN].concat(PLANETS, ASTEROIDS, EXOPLANETS, [ANDROMEDA]);

  const yearText = (days) => days < 1000 ? fr(days, days < 100 ? 1 : 0) + ' jours' : fr(days / 365.25, 1) + ' ans';
  const lightText = (mkm) => {
    const min = mkm * 1e6 / 299792.458 / 60;
    return min < 60 ? fr(min, 1) + ' min' : Math.floor(min / 60) + ' h ' + String(Math.round(min % 60)).padStart(2, '0') + ' min';
  };
  // les planètes naines pèsent quelques dix-millièmes de Terre : on garde deux chiffres significatifs
  const massText = (m) => m < 0.01 ? m.toLocaleString('fr-FR', { maximumSignificantDigits: 2 }) : fr(m, m < 1 ? 3 : 1);
  const gText = (g) => fr(g, g < 1 ? 2 : 1);
  const planetStats = (p) => [
    ['Diamètre', fr(p.diam) + ' km', p.diamNote || fr(p.diam / 12756, 2) + ' × la Terre'],
    ['Masse', massText(p.mass) + ' Terre' + (p.mass >= 2 ? 's' : '')],
    ['Distance au Soleil', fr(p.dist, 1) + ' M km', fr(p.dist / 149.6, 2) + ' UA'],
    ['Lumière du Soleil', lightText(p.dist), 'temps de trajet'],
    ['Durée de l\'année', yearText(p.year)],
    ['Rotation sur elle-même', p.day, p.dayNote],
    ['Gravité', gText(p.g) + ' m/s²', fr(p.g / 9.8, 2) + ' g'],
    ['Température moyenne', fr(p.temp) + ' °C'],
    ['Lunes connues', String(p.moons)],
  ];

  /* ---------- Fiche d'un astre ----------
     Le site est réparti sur plusieurs pages : l'astre choisi passe d'une page à l'autre par l'adresse
     (planetes.html#mars) et reste en mémoire du navigateur pour les pages suivantes. */
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const SHEET = !!$('planetes');
  function remembered() {
    const fromUrl = BODIES.findIndex((b) => slug(b.name) === decodeURIComponent(location.hash.slice(1)));
    if (fromUrl >= 0) return fromUrl;
    try {
      const i = BODIES.findIndex((b) => b.name === localStorage.getItem('astrolabe-astre'));
      if (i >= 0) return i;
    } catch (e) { /* mémoire du navigateur indisponible */ }
    return 3; // la Terre
  }
  let current = remembered();
  const onSelect = [];

  // open : afficher la fiche de l'astre, quitte à changer de page
  function select(i, open) {
    current = (i + BODIES.length) % BODIES.length;
    const anchor = '#' + slug(BODIES[current].name);
    try { localStorage.setItem('astrolabe-astre', BODIES[current].name); } catch (e) { /* idem */ }
    if (open && !SHEET) { location.href = 'planetes.html' + anchor; return; }
    if (SHEET) {
      try { history.replaceState(null, '', anchor); } catch (e) { /* adresse locale non modifiable */ }
    }
    onSelect.forEach((fn) => fn());
  }

  function renderSheet() {
    const b = BODIES[current];
    const tabs = $('tabs');
    tabs.textContent = '';
    BODIES.forEach((x, i) => {
      const t = el('button', 'ghost', x.name);
      t.type = 'button';
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', String(i === current));
      t.addEventListener('click', () => select(i));
      tabs.appendChild(t);
    });

    const image = $('p-img'), disc = $('p-disc');
    disc.style.background = b.color;
    if (b.file) {
      image.hidden = false; disc.hidden = true;
      image.alt = b.credit;
      image.src = img(b.file);
    } else {
      // pas de vraie photo pour ces petits corps lointains : un disque de leur couleur
      image.hidden = true; disc.hidden = false;
      image.removeAttribute('src');
    }
    $('p-credit').textContent = b.credit || (EXOPLANETS.includes(b)
      ? 'Aucune photo : l\'exoplanète est trop loin pour être distinguée de son étoile.'
      : 'Disque indicatif : pas de photo détaillée de cet astéroïde dans le site.');

    $('p-type').textContent = b.type;
    $('p-name').textContent = b.name;
    $('p-desc').textContent = b.desc;
    $('p-fact').textContent = b.fact;

    const dl = $('p-stats');
    dl.textContent = '';
    (b.stats || planetStats(b)).forEach(([k, v, note]) => {
      const wrap = el('div');
      wrap.appendChild(el('dt', null, k));
      const dd = el('dd', null, v);
      if (note) dd.appendChild(el('small', null, note));
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    });

    const dots = $('dots');
    dots.textContent = '';
    BODIES.forEach((_, i) => dots.appendChild(el('i', i === current ? 'current' : '')));
  }
  if (SHEET) {
    // photo locale absente : on tente la version en ligne, puis un disque de la couleur de l'astre
    $('p-img').addEventListener('error', () => {
      const image = $('p-img');
      if (!BODIES[current].file) return;
      if (!image.src.startsWith('https:')) { image.src = online(BODIES[current].file); return; }
      image.hidden = true; $('p-disc').hidden = false;
    });
    $('prev').addEventListener('click', () => select(current - 1));
    $('next').addEventListener('click', () => select(current + 1));
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input')) return;
      if (e.key === 'ArrowLeft') select(current - 1);
      if (e.key === 'ArrowRight') select(current + 1);
    });
    // retour arrière vers une autre adresse planetes.html#…
    addEventListener('hashchange', () => {
      const i = remembered();
      if (i !== current) select(i);
    });
    onSelect.push(renderSheet);
  }

  /* ---------- Comparaison ---------- */
  const METRICS = [
    { id: 'diam', label: 'Diamètre', text: (p) => fr(p.diam) + ' km' },
    { id: 'mass', label: 'Masse', text: (p) => massText(p.mass) + ' × Terre' },
    { id: 'dist', label: 'Distance au Soleil', text: (p) => fr(p.dist, 1) + ' M km' },
    { id: 'year', label: 'Durée de l\'année', text: (p) => yearText(p.year) },
    { id: 'g', label: 'Gravité', text: (p) => gText(p.g) + ' m/s²' },
    { id: 'moons', label: 'Lunes', text: (p) => String(p.moons) },
  ];
  let metric = METRICS[0];

  function renderBars() {
    const tabs = $('metrics');
    tabs.textContent = '';
    METRICS.forEach((m) => {
      const t = el('button', 'ghost', m.label);
      t.type = 'button';
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', String(m === metric));
      t.addEventListener('click', () => { metric = m; renderBars(); });
      tabs.appendChild(t);
    });

    const max = Math.max(...PLANETS.map((p) => p[metric.id]));
    const list = $('bars');
    const first = !list.children.length;
    if (first) {
      PLANETS.forEach((p, i) => {
        const li = el('li');
        const b = el('button');
        b.type = 'button';
        const row = el('span', 'row');
        row.appendChild(el('span', 'name', p.name));
        row.appendChild(el('span', 'val'));
        b.appendChild(row);
        b.appendChild(el('span', 'bar'));
        b.addEventListener('click', () => select(i + 1, true));
        li.appendChild(b);
        list.appendChild(li);
      });
    }
    PLANETS.forEach((p, i) => {
      const li = list.children[i];
      li.classList.toggle('current', i + 1 === current);
      li.querySelector('.val').textContent = metric.text(p);
      li.querySelector('.bar').style.width = (p[metric.id] / max * 100) + '%';
    });
  }
  if ($('bars')) onSelect.push(renderBars);

  /* ---------- Tailles à l'échelle ---------- */
  function renderSizes() {
    const box = $('sizes');
    box.textContent = '';
    const gap = parseFloat(getComputedStyle(box).columnGap) || 18;
    // les quatre petites planètes occupent la largeur de leur légende, les géantes celle de leur disque
    const giants = PLANETS.filter((p) => p.diam > 40000).reduce((s, p) => s + p.diam, 0);
    const smalls = PLANETS.filter((p) => p.diam <= 40000).length;
    const room = box.clientWidth - gap * (PLANETS.length - 1) - smalls * 72;
    const scale = Math.max(room / giants, 120 / 142984);
    box.style.overflowX = room / giants < 120 / 142984 ? 'auto' : 'visible';
    PLANETS.forEach((p, i) => {
      const b = el('button');
      b.type = 'button';
      b.setAttribute('aria-label', p.name + ', ' + fr(p.diam) + ' km');
      const orb = el('span', 'orb' + (p.ring ? ' ring' : ''));
      // les planètes naines feraient moins d'un pixel : on les garde visibles en point de 3 px
      orb.style.width = orb.style.height = Math.max(p.diam * scale, 3) + 'px';
      orb.style.background = p.color;
      const cap = el('span', 'cap');
      cap.appendChild(el('b', null, p.name));
      cap.appendChild(el('span', null, fr(p.diam) + ' km'));
      b.appendChild(orb);
      b.appendChild(cap);
      b.addEventListener('click', () => select(i + 1, true));
      box.appendChild(b);
    });
  }

  /* ---------- Poids et âge ailleurs ---------- */
  function renderCalc() {
    const w = parseFloat($('w').value), a = parseFloat($('a').value);
    const out = $('calc-out');
    out.textContent = '';
    PLANETS.forEach((p) => {
      const li = el('li', p.name === 'Terre' ? 'home' : '');
      li.appendChild(el('span', 'name', p.name));
      const kg = el('span', 'num', w > 0 ? fr(w * p.g / 9.8, 1) + ' kg' : '—');
      kg.appendChild(el('small', null, 'sur la balance'));
      const local = a > 0 ? a * 365.25 / p.year : NaN;
      const age = el('span', 'num', a > 0 ? fr(local, local < 10 ? 2 : local < 100 ? 1 : 0) + (local >= 2 ? ' ans' : ' an') : '—');
      age.appendChild(el('small', null, 'années locales'));
      li.appendChild(kg);
      li.appendChild(age);
      out.appendChild(li);
    });
  }

  /* ---------- Animation des orbites ---------- */
  function initOrrery(canvas) {
    const ctx = canvas.getContext('2d');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tri = ['#8052ff', '#ffb829', '#15846e', '#e04bd0', '#3b82ff', '#a98bff', '#2fd3b0'];
    // assez de triangles pour un grand écran ; on n'en dessine qu'une partie, selon la surface
    const stars = Array.from({ length: 700 }, () => ({
      x: Math.random(), y: Math.random(), s: 1.5 + Math.random() * 3,
      r: Math.random() * 6.28, c: tri[Math.floor(Math.random() * tri.length)], v: 0.2 + Math.random() * 0.6,
    }));
    const phase = PLANETS.map(() => Math.random() * 6.28);
    const astPhase = ASTEROIDS.map(() => Math.random() * 6.28);
    const exoPhase = EXOPLANETS.map(() => Math.random() * 6.28);
    // les orbites des planètes sont espacées régulièrement : on place un corps à sa distance réelle
    // par interpolation entre les orbites des planètes voisines (résultat en fraction du rayon)
    const au = PLANETS.map((p) => p.dist / 149.6);
    const orbitFrac = (i) => 0.15 + 0.85 * (i + 1) / PLANETS.length;
    const auFrac = (d) => {
      if (d <= au[0]) return orbitFrac(0) * d / au[0];
      for (let i = 1; i < au.length; i++) {
        if (d <= au[i]) return orbitFrac(i - 1) + (orbitFrac(i) - orbitFrac(i - 1)) * (d - au[i - 1]) / (au[i] - au[i - 1]);
      }
      return orbitFrac(au.length - 1);
    };
    // ceinture principale (2,1 à 3,3 UA) et ceinture de Kuiper (30 à 50 UA) : poussière de petits points
    const belt = (n, a0, a1, alpha) => Array.from({ length: n }, () => {
      const d = a0 + Math.random() * (a1 - a0);
      return { f: auFrac(d) + (Math.random() - 0.5) * 0.012, year: 365.25 * Math.pow(d, 1.5), ph: Math.random() * 6.28, s: 0.5 + Math.random() * 0.9, alpha };
    });
    const dust = belt(still ? 250 : 520, 2.1, 3.3, 0.55).concat(belt(still ? 200 : 420, 30, 50, 0.3));
    // exoplanètes : deux par coin (Andromède occupe le coin haut droit)
    const EXO_SLOTS = [[34, 34], [34, 84], [34, -34], [84, -34], [-34, -34], [-34, -84]];
    let W = 0, H = 0, days = 0, speed = 30, paused = still, last = 0, hover = -1, visible = true, raf = 0;
    let pos = [];

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!paused) days += dt * speed;
      // le système solaire au centre ; la zone peut être plus large que haute
      const cx = W / 2, cy = H / 2, side = Math.min(W, H), R = side / 2 - 16, k = Math.max(side / 560, 0.6), t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // champ de triangles ambiant, sur toute la zone (densité constante)
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      const count = Math.min(stars.length, Math.round(150 * W * H / (560 * 560)));
      for (let n = 0; n < count; n++) {
        const s = stars[n];
        const rot = s.r + (still ? 0 : t * s.v * 0.3);
        ctx.strokeStyle = s.c;
        ctx.beginPath();
        for (let j = 0; j < 3; j++) {
          const a = rot + j * 2.0944, x = s.x * W + Math.cos(a) * s.s, y = s.y * H + Math.sin(a) * s.s;
          if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ceintures d'astéroïdes et de Kuiper
      ctx.fillStyle = '#8f877c';
      for (const d of dust) {
        const a = d.ph - 6.2832 * days / d.year;
        ctx.globalAlpha = d.alpha;
        ctx.fillRect(cx + Math.cos(a) * d.f * R, cy + Math.sin(a) * d.f * R, d.s * k, d.s * k);
      }
      ctx.globalAlpha = 1;

      // orbites
      pos = [{ x: cx, y: cy, r: SUN.px * k }];
      PLANETS.forEach((p, i) => {
        const orbit = R * orbitFrac(i);
        ctx.strokeStyle = i + 1 === current ? '#5a5a5a' : '#242424';
        ctx.setLineDash(p.dwarf ? [2, 5] : []); // orbites des planètes naines en pointillés
        ctx.beginPath();
        ctx.arc(cx, cy, orbit, 0, 6.2832);
        ctx.stroke();
        ctx.setLineDash([]);
        const a = phase[i] - 6.2832 * days / p.year;
        pos.push({ x: cx + Math.cos(a) * orbit, y: cy + Math.sin(a) * orbit, r: p.px * k });
      });
      // astéroïdes remarquables, à leur distance moyenne ; orbite visible quand on les survole ou les choisit
      ASTEROIDS.forEach((s, i) => {
        const j = 1 + PLANETS.length + i, orbit = R * auFrac(s.au);
        if (j === current || j === hover) {
          ctx.strokeStyle = j === current ? '#5a5a5a' : '#3a3a3a';
          ctx.setLineDash([1, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, orbit, 0, 6.2832);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        const a = astPhase[i] - 6.2832 * days / s.year;
        pos.push({ x: cx + Math.cos(a) * orbit, y: cy + Math.sin(a) * orbit, r: s.px * k });
      });
      // exoplanètes, dans les coins : la position enregistrée est celle de leur étoile
      EXOPLANETS.forEach((e, i) => {
        const [sx, sy] = EXO_SLOTS[i];
        pos.push({ x: sx > 0 ? sx * k : W + sx * k, y: sy > 0 ? sy * k : H + sy * k, r: 10 * k, exo: i });
      });
      // Andromède, nébuleuse lointaine dans le coin du champ
      pos.push({ x: W - 30 * k, y: 30 * k, r: 9 * k });

      // astres
      BODIES.forEach((b, i) => {
        const p = pos[i];
        if (b.galaxy) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
          glow.addColorStop(0, '#ffffff');
          glow.addColorStop(0.25, b.color);
          glow.addColorStop(1, 'rgba(201, 184, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r * 2, p.r * 0.7, -0.6, 0, 6.2832);
          ctx.fill();
        } else if (b.star) {
          // étoile lointaine et sa planète ; l'année est ralentie 60 fois pour rester lisible
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5 * k);
          glow.addColorStop(0, '#ffffff');
          glow.addColorStop(0.35, b.star);
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5 * k, 0, 6.2832);
          ctx.fill();
          ctx.strokeStyle = '#2a2a2a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.stroke();
          const a = exoPhase[p.exo] - 6.2832 * days / (b.year * 60);
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(p.x + Math.cos(a) * p.r, p.y + Math.sin(a) * p.r, 2.2 * k, 0, 6.2832);
          ctx.fill();
        } else {
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fill();
        }
        if (b.ring) {
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r * 1.9, p.r * 0.6, -0.4, 0, 6.2832);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
        if (i === current || i === hover) {
          ctx.strokeStyle = i === current ? '#ffffff' : '#9a9a9a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 6, 0, 6.2832);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 12px Inter, sans-serif';
          const label = b.name.toUpperCase();
          const tw = ctx.measureText(label).width;
          const lx = Math.min(Math.max(p.x - tw / 2, 2), W - tw - 2);
          const ly = p.y - p.r - 14 < 12 ? p.y + p.r + 22 : p.y - p.r - 14;
          ctx.fillText(label, lx, ly);
        }
      });

      $('sim-caption').textContent = 'Jour ' + fr(Math.floor(days)) + ' · ' + fr(days / 365.25, 1) + ' années terrestres · orbites non à l\'échelle · exoplanètes dans les coins';
      if (visible) raf = requestAnimationFrame(draw);
    }

    function hit(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      let best = -1, bd = 26;
      pos.forEach((p, i) => {
        const d = Math.hypot(p.x - x, p.y - y) - p.r;
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    canvas.addEventListener('pointermove', (e) => {
      hover = hit(e);
      canvas.style.cursor = hover >= 0 ? 'pointer' : 'default';
    });
    canvas.addEventListener('pointerleave', () => { hover = -1; });
    canvas.addEventListener('click', (e) => {
      const i = hit(e);
      if (i >= 0) select(i, true);
    });

    const pause = $('pause');
    const paintControls = () => {
      pause.textContent = paused ? 'Lecture' : 'Pause';
      pause.setAttribute('aria-pressed', String(paused));
      document.querySelectorAll('[data-speed]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.speed === speed)));
    };
    pause.addEventListener('click', () => { paused = !paused; paintControls(); });
    document.querySelectorAll('[data-speed]').forEach((b) => b.addEventListener('click', () => {
      speed = +b.dataset.speed; paused = false; paintControls();
    }));
    paintControls();

    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (visible) raf = requestAnimationFrame(draw);
    }).observe(canvas);
  }

  // chaque page n'affiche qu'une partie du site : on n'active que ce qui s'y trouve
  if (SHEET) renderSheet();
  if ($('bars')) renderBars();
  if ($('sizes')) {
    renderSizes();
    addEventListener('resize', renderSizes);
  }
  if ($('calc-out')) {
    $('w').addEventListener('input', renderCalc);
    $('a').addEventListener('input', renderCalc);
    renderCalc();
  }
  if ($('orrery')) initOrrery($('orrery'));
})();
