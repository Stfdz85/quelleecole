import React, { useState, useMemo, useEffect, useRef } from 'react';
import { D } from './data.js';

/* ============================================================
   QuelleEcole.fr — V2
   Interface ultra-moderne · Civic Tech + palette V1
   255 établissements · Lille Métropole
   Données DEPP · Ministère de l'Éducation nationale · 2024
   ============================================================ */


const TL = {m:"Maternelle",e:"Élémentaire",p:"Primaire",c:"Collège",l:"Lycée"};
const TC = {m:"Maternelles",e:"Élémentaires",p:"Primaires",c:"Collèges",l:"Lycées"};
const TE = {u:"Public",v:"Privé"};
const SL = {u:"Public",v:"Privé"};

// Palette V1 stricte
function ipsColor(v){
  if(!v) return '#A3A3A3';
  if(v>=130) return '#1B4F72';
  if(v>=115) return '#2874A6';
  if(v>=100) return '#5DADE2';
  if(v>=88)  return '#E8A135';
  if(v>=70)  return '#E67E22';
  return '#D35400';
}
function ipsLabel(v){
  if(!v) return 'N/D';
  if(v>=125) return 'Très favorisé';
  if(v>=110) return 'Favorisé';
  if(v>=100) return 'Mixte +';
  if(v>=90)  return 'Mixte';
  if(v>=75)  return 'Populaire';
  return 'Très populaire';
}
function ipsShort(v){
  if(!v) return '';
  if(v>=110) return 'Favorisé';
  if(v>=100) return 'Mixte';
  if(v>=85)  return 'Populaire';
  return 'Populaire';
}
function vaClass(v){ if(v==null) return ''; if(v>=1) return 'positive'; if(v<=-1) return 'negative'; return ''; }
function vaSign(v){ return v>0 ? '+'+v : String(v); }
function getVA(s){
  if(s.t === 'c' && s.iv && typeof s.iv.va_brevet !== 'undefined') return s.iv.va_brevet;
  if(s.t === 'l' && s.iv && typeof s.iv.va_bac !== 'undefined') return s.iv.va_bac;
  return null;
}

const HELP = {
  ips: {t:"IPS — Indice de Position Sociale",d:"L'IPS est un indicateur du Ministère de l'Éducation qui résume le profil socio-économique des familles d'une école. Il est calculé à partir des professions des deux parents. Plus il est élevé, plus les élèves viennent en moyenne de milieux favorisés.\n\nMoyenne nationale : 103. En dessous de 85 : milieu défavorisé. Au-dessus de 125 : milieu très favorisé.\n\n⚠️ Un IPS élevé ne signifie pas que l'école est « meilleure ». Il décrit le profil social, pas la qualité de l'enseignement.\n\nSource : DEPP (Direction de l'évaluation, de la prospective et de la performance), Ministère de l'Éducation nationale — data.education.gouv.fr"},
  ips_est: {t:"IPS estimé — pourquoi ≈ ?",d:"L'IPS officiel n'existe que pour les écoles ayant des élèves de CM2 (c'est à partir de leur passage en 6ème que les professions des parents sont enregistrées). Les maternelles et certaines petites écoles n'ont donc pas d'IPS.\n\nPour ces écoles, nous affichons un IPS estimé (≈) basé sur l'école élémentaire publique la plus proche (même secteur, moins de 600m). En général, les mêmes familles fréquentent les deux écoles.\n\nLe contour en pointillé et le symbole ≈ distinguent toujours une estimation d'une donnée officielle."},
  va: {t:"Valeur ajoutée — qu'est-ce que c'est ?",d:"La valeur ajoutée est l'indicateur le plus fiable pour évaluer ce qu'un collège apporte réellement à ses élèves.\n\nLe Ministère compare le taux de réussite au brevet d'un collège à celui qu'on attendrait, compte tenu du profil de ses élèves (âge, sexe, origine sociale, niveau scolaire à l'entrée en 6ème). La différence est la valeur ajoutée.\n\n• VA positive (+6 par exemple) : le collège obtient de meilleurs résultats que des collèges comparables. Il fait progresser ses élèves au-delà de ce que leur profil laissait prévoir.\n• VA négative (-5 par exemple) : le collège fait moins bien que ce qu'on attendrait.\n• VA proche de 0 : résultats conformes aux attentes.\n\nUn collège avec un IPS faible mais une VA positive est un collège qui travaille bien. L'inverse (IPS élevé, VA négative) indique un collège qui « vit sur sa rente » sociale.\n\nSource : DEPP, indicateurs IVAC — data.education.gouv.fr"},
  eval: {t:"Évaluations nationales de 6ème",d:"Chaque année en septembre, tous les élèves entrant en 6ème passent des tests standardisés en français et en mathématiques, organisés par le Ministère.\n\nLe score est standardisé : la moyenne nationale est d'environ 250. Il n'y a pas de maximum fixe — les meilleurs établissements peuvent dépasser 300.\n\nLe « % d'élèves dans le groupe le plus avancé » indique la part d'élèves ayant obtenu les meilleurs résultats. Plus ce pourcentage est élevé, plus le collège accueille d'élèves performants à leur entrée.\n\n⚠️ Ces scores mesurent le niveau des élèves à l'entrée, pas ce que le collège leur apporte ensuite. Pour cela, regardez la valeur ajoutée.\n\nSource : DEPP, évaluations exhaustives — data.education.gouv.fr"},
  brevet: {t:"Résultats du Brevet (DNB)",d:"Le Diplôme National du Brevet est l'examen passé en fin de 3ème par tous les collégiens.\n\n• Taux de réussite : % d'élèves qui obtiennent le brevet.\n• Note à l'écrit : moyenne des épreuves écrites sur 20.\n• Parcours complet 6ᵉ→3ᵉ : % des élèves entrés en 6ème qui sont allés jusqu'en 3ème dans ce collège (un chiffre bas peut indiquer des départs en cours de route).\n• Mentions Très Bien : nombre d'élèves ayant eu 16/20 ou plus de moyenne.\n\nSource : DEPP, indicateurs IVAC — data.education.gouv.fr"},
  secteur: {t:"Collège de secteur — carte scolaire",d:"En France, chaque adresse est rattachée à un collège public par la « carte scolaire », fixée par le Département (Conseil départemental du Nord pour Lille).\n\nVotre enfant sera automatiquement affecté à ce collège à la fin du CM2, sauf si vous demandez une dérogation ou choisissez un collège privé.\n\nLes dérogations sont possibles pour : handicap, raison médicale, boursier, fratrie déjà dans le collège, proximité du domicile, parcours scolaire particulier (CHAM, section internationale, section sportive).\n\n⚠️ Le collège de secteur affiché ici est basé sur l'adresse de l'école, pas sur votre adresse personnelle. Vérifiez toujours sur services.lenord.fr.\n\nSource : carte scolaire Affelnet, Département du Nord"},
  rep: {t:"REP / REP+ — Éducation Prioritaire",d:"Les Réseaux d'Éducation Prioritaire regroupent les écoles et collèges situés dans des quartiers défavorisés. Ils bénéficient de moyens renforcés :\n\n• Classes plus petites (souvent 12-15 élèves en CP/CE1)\n• Plus d'enseignants et de personnels\n• Accompagnement éducatif renforcé\n• Formation continue des enseignants\n\nREP+ est le niveau le plus renforcé.\n\nSource : Ministère de l'Éducation nationale"},
  ulis: {t:"ULIS — Inclusion scolaire",d:"Une Unité Localisée pour l'Inclusion Scolaire (ULIS) est un dispositif qui accueille, au sein d'une école ordinaire, des élèves en situation de handicap. Les élèves ULIS suivent les cours dans leur classe de référence et bénéficient de temps d'enseignement adapté.\n\nLa présence d'un dispositif ULIS dans une école est un signe d'inclusivité.\n\nSource : annuaire de l'Éducation nationale"},
  appli: {t:"École d'application",d:"Une école d'application accueille des enseignants stagiaires en formation (rattachés à l'INSPÉ, ex-IUFM). L'école est dirigée par un « maître formateur » certifié.\n\nPour les parents, c'est un signal positif : l'équipe pédagogique est soumise à un regard extérieur permanent, les pratiques sont actualisées, et l'encadrement est renforcé par la présence régulière de formateurs.\n\nSource : annuaire de l'Éducation nationale"},
  prix: {t:"Frais de scolarité (privé)",d:"Les écoles privées sous contrat avec l'État facturent une contribution aux familles. Les enseignants sont payés par l'État, mais les frais couvrent l'entretien des locaux, le personnel non enseignant et les activités.\n\nLe prix affiché est la scolarité annuelle seule (hors cantine, garderie, sorties, fournitures). Il varie selon les écoles et les niveaux.\n\nLes écoles publiques sont gratuites (seuls la cantine et le périscolaire sont payants).\n\nSource : sites web des écoles privées, mars 2026"},
  bac: {t:"Résultats du Baccalauréat (IVAL)",d:"Le Ministère publie chaque année les indicateurs de valeur ajoutée des lycées (IVAL), qui évaluent l'action propre de chaque lycée.\n\n• Taux de réussite : % d'élèves qui obtiennent le bac.\n• Taux de mentions : % de bacheliers ayant obtenu une mention (AB, B ou TB).\n• Parcours 2nde→Bac : % des élèves entrés en 2nde qui obtiennent le bac dans ce lycée. C'est un indicateur clé de l'accompagnement — un lycée qui perd beaucoup d'élèves en cours de route a un taux bas.\n\nChaque indicateur a sa propre valeur ajoutée (VA), qui compare les résultats observés à ceux attendus compte tenu du profil social et scolaire des élèves.\n\nUn lycée avec un IPS moyen mais une VA positive fait bien son travail. L'inverse (IPS élevé, VA négative) indique un lycée qui ne capitalise pas sur le profil favorable de ses élèves.\n\nSource : DEPP, indicateurs IVAL — data.education.gouv.fr, session 2024."},
  lyctype: {t:"LEGT, LP, LPO — Types de lycées",d:"Le système français distingue trois types de lycées :\n\n• LEGT (Lycée d'Enseignement Général et Technologique) : prépare au bac général et technologique. C'est le parcours classique vers les études supérieures longues.\n• LP (Lycée Professionnel) : prépare au bac professionnel et aux CAP. Enseignement concret, stages en entreprise, insertion professionnelle directe ou poursuite en BTS.\n• LPO (Lycée Polyvalent) : combine les deux — propose à la fois des filières générales/technologiques et professionnelles sous le même toit.\n\nL'IPS des trois voies diffère souvent au sein du même lycée polyvalent : la voie GT a en général un IPS plus élevé que la voie Pro.\n\nSource : annuaire de l'Éducation nationale."},
  mentions: {t:"Mentions au Bac — Très Bien, Bien, Assez Bien",d:"Au baccalauréat, les mentions sont attribuées selon la moyenne générale :\n\n• Très Bien (TB) : 16/20 et plus\n• Bien (B) : 14 à 16/20\n• Assez Bien (AB) : 12 à 14/20\n\nLe taux de mentions d'un lycée est le % de bacheliers ayant obtenu au moins AB. La VA mentions compare ce taux à celui attendu : un lycée avec VA mentions positive pousse ses élèves vers les mentions mieux que des lycées comparables.\n\nUn lycée avec 92% de mentions et VA +3 fait un travail remarquable. Un lycée avec 92% mais VA -5 a simplement un public très favorisé qui aurait eu ces mentions partout.\n\nSource : DEPP, IVAL session 2024."},
  cham: {t:"CHAM — Musique et Danse",d:"Les Classes à Horaires Aménagés Musique ou Danse (CHAM/CHAD) permettent aux élèves de suivre un cursus musical ou chorégraphique au Conservatoire tout en poursuivant leur scolarité.\n\nC'est aussi un motif de dérogation à la carte scolaire : un enfant peut intégrer un collège CHAM même s'il n'est pas dans son secteur.\n\nConditions : être inscrit au Conservatoire, passer un examen d'entrée (épreuve de formation musicale + instrument).\n\nSource : annuaire de l'Éducation nationale, Conservatoire de Lille"},
};

// Tour guidé - 3 étapes
const TOUR_STEPS = [
  {
    targetSelector: '.chip[data-filter="addr"]',
    title: '<span class="accent">1.</span> Votre adresse d\'abord',
    desc: 'C\'est l\'essentiel. Tapez votre adresse pour voir <strong>l\'école de secteur</strong> de votre enfant — et surtout le <strong>collège</strong> où il ira après. Celui que vous n\'avez peut-être pas choisi.',
    position: 'bottom',
    spotlightRadius: 55
  },
  {
    targetSelector: '.legend',
    title: '<span class="accent">2.</span> L\'échelle IPS',
    desc: 'Chaque couleur = un <strong>milieu social</strong>. Orange = populaire, bleu foncé = favorisé. L\'écart à Lille Métropole atteint <strong>100 points</strong> entre deux écoles parfois voisines.',
    position: 'top',
    spotlightRadius: 100
  }
];

function App() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('ips');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [sheetState, setSheetState] = useState('collapsed');
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [addrResult, setAddrResult] = useState(null);
  const [addrInput, setAddrInput] = useState('');
  const [tourIdx, setTourIdx] = useState(-1);
  const [tourReplayVisible, setTourReplayVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(true);
  const [bubble, setBubble] = useState(null);
  const [compareIds, setCompareIds] = useState([]); // 0 à 2 écoles à comparer
  const [compareOpen, setCompareOpen] = useState(false); // Modal comparateur ouvert
  
  function toggleCompare(id) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id]; // garde la plus récente + nouvelle
      return [...prev, id];
    });
  }
  
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef({});
  const markerGroupRef = useRef(null);
  
  // Filter + sort
  const list = useMemo(() => {
    let arr = [...D];
    if (filter === 'ep') arr = arr.filter(s => s.t === 'e' || s.t === 'p'); // Élém + Prim fusionnés (Maternelles séparé)
    else if (filter !== 'all') arr = arr.filter(s => s.t === filter);
    
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      arr = arr.filter(s =>
        s.n.toLowerCase().includes(q) ||
        (s.c && s.c.toLowerCase().includes(q)) ||
        (s.a && s.a.toLowerCase().includes(q))
      );
    }
    
    if (sort === 'ips') arr.sort((a,b) => (b.i||0) - (a.i||0));
    else if (sort === 'va') arr.sort((a,b) => (getVA(b)??-99) - (getVA(a)??-99));
    else if (sort === 'alpha') arr.sort((a,b) => a.n.localeCompare(b.n));
    
    return arr;
  }, [filter, sort, search]);
  
  const selected = useMemo(() => D.find(s => s.id === selectedId), [selectedId]);
  
  // Init Leaflet
  useEffect(() => {
    if (!window.L || leafletMapRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
      maxZoom: 18,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel: 120
    }).setView([50.633, 3.063], 13);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · CARTO · QuelleEcole.fr',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    
    // Tap sur la carte (en dehors d'un marqueur) = ferme la fiche / réduit la sheet
    map.on('click', () => {
      // Si une école est sélectionnée, on déselectionne
      setSelectedId(null);
      // Et on réduit la sheet à 'collapsed' pour voir la carte
      setSheetState('collapsed');
    });
    
    leafletMapRef.current = map;
    markerGroupRef.current = L.layerGroup().addTo(map);
  }, []);
  
  // Update markers when list changes
  useEffect(() => {
    if (!leafletMapRef.current || !markerGroupRef.current || !window.L) return;
    const L = window.L;
    markerGroupRef.current.clearLayers();
    markersRef.current = {};
    
    list.forEach(s => {
      if (!s.la || !s.lo) return;
      const color = ipsColor(s.i);
          const proxyClass = s.i_proxy ? 'proxy' : '';
      const html = `<div class="qe-pin ${proxyClass}" data-id="${s.id}" style="background:${color}">${s.i ? Math.round(s.i) : '?'}</div>`;
      const icon = L.divIcon({ html, className: '', iconSize: [30,30], iconAnchor: [15,15] });
      const m = L.marker([s.la, s.lo], { icon, riseOnHover: true });
      m.on('click', () => setSelectedId(s.id));
      markersRef.current[s.id] = m;
      markerGroupRef.current.addLayer(m);
    });
  }, [list]);
  
  // Fly to selected
  useEffect(() => {
    if (!selected || !leafletMapRef.current) return;
    // Décaler le centre vers le HAUT pour que la pastille reste visible 
    // au-dessus de la sheet (qui prend ~50% du bas en mode 'half')
    const offsetLat = 0.005; // ~500m de décalage vers le nord
    leafletMapRef.current.flyTo([selected.la - offsetLat, selected.lo], 15, { animate: true, duration: 0.7 });
    // Mode 'half' : 50% carte / 50% fiche pour garder la carte visible
    setSheetState('half');
    
    // Highlight marker
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement()?.querySelector('.qe-pin');
      if (el) el.classList.toggle('selected', id === selected.id);
    });
  }, [selected]);
  
  // Auto-launch tour on first visit
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('qe_tour_seen') === '1'; } catch(e) {}
    if (!seen) {
      const t = setTimeout(() => {
        setOnboardingVisible(false);
        setTourIdx(0);
      }, 1400);
      return () => clearTimeout(t);
    } else {
      setTourReplayVisible(true);
      const t = setTimeout(() => setTourReplayVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape') {
        if (tourIdx >= 0) endTour(false);
        else if (addrModalOpen) setAddrModalOpen(false);
        else if (bubble) setBubble(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [tourIdx, addrModalOpen, bubble]);
  
  function openAddr() {
    setAddrModalOpen(true);
    setOnboardingVisible(false);
  }
  
  function endTour(completed) {
    setTourIdx(-1);
    try { sessionStorage.setItem('qe_tour_seen', '1'); } catch(e) {}
    if (completed) {
      setTourReplayVisible(true);
      setTimeout(() => setTourReplayVisible(false), 5000);
    }
  }
  
  // Distance Haversine en km entre 2 coords GPS
  function distance(lat1, lo1, lat2, lo2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLo = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLo/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  
  // Quand l'utilisateur sélectionne une adresse dans les suggestions :
  // - on trouve l'école élémentaire publique la plus proche
  // - on lit son collège de secteur
  function selectAddress(addr) {
    const lat = addr.lat, lo = addr.lo;
    // École élémentaire ou primaire publique la plus proche
    const ecoles = D
      .filter(s => (s.t === 'e' || s.t === 'p') && s.s === 'u' && s.la && s.lo)
      .map(s => ({ ...s, dist: distance(lat, lo, s.la, s.lo) }))
      .sort((a, b) => a.dist - b.dist);
    
    const ec = ecoles[0];
    if (!ec) {
      setAddrResult({ label: addr.label, ec: null, col: null, error: 'Aucune école trouvée à proximité' });
      return;
    }
    
    // Collège de secteur de l'école trouvée
    let col = null;
    let colExt = null; // collège hors périmètre MEL (mais avec ses données IPS/VA si présentes)
    if (ec.cs) {
      // Nouveau format objet : {n, uai, ext, i, va, br}
      if (typeof ec.cs === 'object') {
        // 1) Match par UAI (100% fiable)
        if (ec.cs.uai) {
          col = D.find(x => x.t === 'c' && x.id === ec.cs.uai);
        }
        // 2) Si pas trouvé dans D (collège hors MEL), on garde l'objet cs
        // qui contient déjà n, i, va, br pour affichage minimal
        if (!col && ec.cs.n) {
          colExt = { 
            n: ec.cs.n, 
            uai: ec.cs.uai, 
            i: ec.cs.i,           // IPS
            va: ec.cs.va,         // valeur ajoutée brevet
            br: ec.cs.br,         // taux brevet
            c: 'Hors périmètre MEL'
          };
        }
      } 
      // Ancien format string : "Collège X (UAI)"
      else if (typeof ec.cs === 'string') {
        // Essayer d'extraire un UAI entre parenthèses
        const uaiMatch = ec.cs.match(/\(([0-9]{7}[A-Z])\)/);
        if (uaiMatch) {
          col = D.find(x => x.t === 'c' && x.id === uaiMatch[1]);
        }
        // Sinon match par nom
        if (!col) {
          const clean = ec.cs.replace('Collège ', '').replace(/\(.+?\)/, '').trim().toLowerCase();
          col = D.find(x => x.t === 'c' && x.n.toLowerCase().includes(clean));
        }
      }
    }
    
    setAddrResult({ label: addr.label, ec, col, colExt, dist: ec.dist });
  }
  
  /* ========= RENDER ========= */
  return (
    <div id="app">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">Q</div>
          <div className="brand-text">
            <span className="b-name">QuelleEcole</span><span className="b-dot">.fr</span>
          </div>
          <span className="brand-badge">BETA</span>
        </div>
        <div className="top-actions">
          {compareIds.length > 0 && (
            <button 
              className={`top-compare ${compareIds.length === 2 ? 'ready' : 'pending'}`}
              onClick={() => compareIds.length === 2 ? setCompareOpen(true) : null}
              title={compareIds.length === 2 ? "Comparer les 2 écoles" : "Sélectionnez une 2e école pour comparer"}
            >
              <span className="top-compare-label">
                {compareIds.length === 2 ? 'Comparer' : 'Comparer'}
              </span>
              <span className="top-compare-count">{compareIds.length}/2</span>
              <span 
                className="top-compare-clear" 
                role="button"
                aria-label="Effacer la sélection"
                onClick={(e) => { e.stopPropagation(); setCompareIds([]); }}
              >×</span>
            </button>
          )}
          <button className="icon-btn" title="Comment ça marche ?" onClick={() => setBubble('ips')}>?</button>
          <a
            className="support-btn"
            href="https://buymeacoffee.com/quelleecole"
            target="_blank"
            rel="noopener noreferrer"
          >☕ Soutenir</a>
        </div>
      </div>
      
      {/* SEARCH + FILTERS */}
      <div className="search-stack">
        <div className="search-bar">
          <span className="s-icon">⌕</span>
          <input
            id="search-input"
            type="text"
            placeholder="Rechercher une école, un collège, un lycée…"
            autoComplete="off"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="s-clear show" onClick={() => setSearch('')}>×</button>
          )}
          <span className="s-kbd">⌘K</span>
        </div>
        <div className="chips">
          <button className="chip primary" data-filter="addr" onClick={openAddr}>📍 Mon adresse</button>
          {[
            {key:'all', label:'Tout'},
            {key:'m', label:'Maternelles', color:'#5DADE2'},
            {key:'ep', label:'Élémentaires', color:'#E8A135'},
            {key:'c', label:'Collèges', color:'#2874A6'},
            {key:'l', label:'Lycées', color:'#1B4F72'}
          ].map(f => {
            const count = f.key === 'all' ? D.length :
              f.key === 'ep' ? D.filter(s => s.t === 'e' || s.t === 'p').length :
              D.filter(s => s.t === f.key).length;
            return (
              <button
                key={f.key}
                className={`chip ${filter === f.key ? 'active' : ''}`}
                onClick={() => { setFilter(f.key); setOnboardingVisible(false); }}
              >
                {f.color && <span className="chip-dot" style={{background: f.color}}></span>}
                {f.label} <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* MAP */}
      <div id="map" ref={mapRef}></div>
      
      {/* LEGEND */}
      <div className="legend" onClick={() => setBubble('ips')} role="button">
        <div className="legend-header">
          <div className="legend-title">Milieu social · IPS</div>
          <span className="legend-info">i</span>
        </div>
        <div className="legend-gradient"></div>
        <div className="legend-labels"><span>55</span><span>100</span><span>155</span></div>
        <div className="legend-footer">
          <div className="legend-footer-dot"></div>
        </div>
      </div>
      
      {/* ONBOARDING */}
      {onboardingVisible && tourIdx < 0 && (
        <div className="onboarding">
          <div className="onb-icon">📍</div>
          <div className="onb-text">
            <div className="t">Trouvez la bonne école pour votre enfant</div>
            <div className="d">En 2 clics, à partir de votre adresse.</div>
          </div>
          <button className="onb-close" onClick={e => { e.stopPropagation(); setOnboardingVisible(false); }}>×</button>
          <div className="onb-click-area" onClick={openAddr}></div>
        </div>
      )}
      
      {/* REPLAY TOUR */}
      {tourReplayVisible && tourIdx < 0 && (
        <button className="tour-replay show" onClick={() => { setTourReplayVisible(false); setTourIdx(0); }}>
          <span>↻</span> Revoir le tour
        </button>
      )}
      
      {/* BOTTOM SHEET */}
      <Sheet
        state={sheetState}
        setState={setSheetState}
        list={list}
        selected={selected}
        sort={sort}
        setSort={setSort}
        onSelect={setSelectedId}
        onBack={() => { setSelectedId(null); setSheetState('open'); }}
        onSetBubble={setBubble}
        compareIds={compareIds}
        onToggleCompare={toggleCompare}
      />
      
      {/* COMPARE MODAL */}
      {compareOpen && (
        <CompareModal
          ids={compareIds}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => {
            setCompareIds(prev => prev.filter(x => x !== id));
            if (compareIds.length <= 1) setCompareOpen(false);
          }}
        />
      )}
      
      {/* ADDRESS MODAL */}
      <AddressModal
        open={addrModalOpen}
        onClose={() => { setAddrModalOpen(false); setAddrResult(null); setAddrInput(''); }}
        input={addrInput}
        setInput={setAddrInput}
        result={addrResult}
        onSelectAddress={selectAddress}
        onOpen={(id) => {
          setAddrModalOpen(false);
          setAddrResult(null);
          setAddrInput('');
          setTimeout(() => setSelectedId(id), 350);
        }}
      />
      
      {/* TOUR */}
      <Tour
        idx={tourIdx}
        setIdx={setTourIdx}
        onEnd={endTour}
      />
      
      {/* BUBBLE HELP */}
      {bubble && <HelpBubble topic={bubble} onClose={() => setBubble(null)} />}
    </div>
  );
}

/* =========== COMPONENTS =========== */

function Sheet({ state, setState, list, selected, sort, setSort, onSelect, onBack, onSetBubble, compareIds, onToggleCompare }) {
  const sheetRef = React.useRef(null);
  const dragRef = React.useRef({ active: false, startY: 0, startState: null, startTime: 0, lastY: 0 });
  const [dragOffset, setDragOffset] = React.useState(0);
  
  // Hauteurs en vh selon l'état (déduites du CSS)
  // collapsed : 100% - 140px → environ 85vh translateY
  // open      : 30vh
  // half      : 50vh (mode détail école : 50% carte / 50% fiche)
  // full      : 0vh
  function stateToOffset(s) {
    if (typeof window === 'undefined') return 0;
    const vh = window.innerHeight;
    if (s === 'full') return 0;
    if (s === 'open') return vh * 0.30;
    if (s === 'half') return vh * 0.50;
    return vh - 140; // collapsed: 140px visible en bas
  }
  
  function offsetToState(offset) {
    const vh = window.innerHeight;
    const fullDist = Math.abs(offset - 0);
    const openDist = Math.abs(offset - vh * 0.30);
    const halfDist = Math.abs(offset - vh * 0.50);
    const collapsedDist = Math.abs(offset - (vh - 140));
    const min = Math.min(fullDist, openDist, halfDist, collapsedDist);
    if (min === fullDist) return 'full';
    if (min === openDist) return 'open';
    if (min === halfDist) return 'half';
    return 'collapsed';
  }
  
  function handleStart(clientY) {
    dragRef.current = {
      active: true,
      startY: clientY,
      lastY: clientY,
      startState: state,
      startTime: Date.now()
    };
    // Désactiver la transition pendant le drag pour suivre le doigt
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  }
  
  function handleMove(clientY) {
    if (!dragRef.current.active) return;
    const baseOffset = stateToOffset(dragRef.current.startState);
    const delta = clientY - dragRef.current.startY;
    const newOffset = Math.max(0, Math.min(window.innerHeight - 80, baseOffset + delta));
    setDragOffset(newOffset);
    dragRef.current.lastY = clientY;
  }
  
  function handleEnd() {
    if (!dragRef.current.active) return;
    const elapsed = Date.now() - dragRef.current.startTime;
    const totalDelta = dragRef.current.lastY - dragRef.current.startY;
    const velocity = totalDelta / Math.max(elapsed, 1); // px/ms
    
    if (sheetRef.current) sheetRef.current.style.transition = '';
    
    const baseOffset = stateToOffset(dragRef.current.startState);
    const finalOffset = baseOffset + totalDelta;
    
    let nextState;
    // Swipe rapide → saute d'un cran (échelle: collapsed → open → half → full)
    const states = ['collapsed', 'open', 'half', 'full'];
    if (Math.abs(velocity) > 0.6) {
      const startIdx = states.indexOf(dragRef.current.startState);
      if (velocity > 0) {
        // Swipe rapide vers le bas : descend d'un cran
        nextState = states[Math.max(0, startIdx - 1)];
      } else {
        // Swipe rapide vers le haut : monte d'un cran
        nextState = states[Math.min(states.length - 1, startIdx + 1)];
      }
    } else {
      // Sinon snap au plus proche
      nextState = offsetToState(finalOffset);
    }
    
    dragRef.current.active = false;
    setDragOffset(0);
    setState(nextState);
  }
  
  // Touch events
  function onTouchStart(e) {
    handleStart(e.touches[0].clientY);
  }
  function onTouchMove(e) {
    if (!dragRef.current.active) return;
    e.preventDefault(); // évite le scroll de la page
    handleMove(e.touches[0].clientY);
  }
  function onTouchEnd() {
    handleEnd();
  }
  
  // Mouse events (desktop)
  function onMouseDown(e) {
    handleStart(e.clientY);
    function onMouseMove(ev) { handleMove(ev.clientY); }
    function onMouseUp() {
      handleEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
  
  function tapToggle() {
    // Tap simple sur le grip = cycle entre les états
    if (state === 'full') setState('half');
    else if (state === 'half') setState('open');
    else if (state === 'open') setState('full');
    else setState('open'); // collapsed → open
  }
  
  // Style dynamique pendant le drag
  const dragStyle = dragRef.current.active 
    ? { transform: `translateY(${dragOffset}px)` }
    : undefined;
  
  return (
    <div className={`sheet ${state}`} ref={sheetRef} style={dragStyle}>
      <div 
        className="sheet-grip"
        onClick={tapToggle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div className="sheet-grip-bar"></div>
      </div>
      <div 
        className="sheet-head" 
        onClick={() => {
          if (state === 'collapsed') setState('open');
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="sheet-count">
          <span className="n">{selected ? 1 : list.length}</span>
          <span className="l">{selected ? 'fiche' : (list.length > 1 ? 'établissements' : 'établissement')}</span>
        </div>
        {!selected && (
          <div className="sort-toggle" onClick={e => e.stopPropagation()}>
            <button className={sort === 'ips' ? 'active' : ''} onClick={() => setSort('ips')}>↓ IPS</button>
            <button className={sort === 'va' ? 'active' : ''} onClick={() => setSort('va')}>↓ VA</button>
            <button className={sort === 'alpha' ? 'active' : ''} onClick={() => setSort('alpha')}>A→Z</button>
          </div>
        )}
      </div>
      <div className="sheet-content">
        {selected ? (
          <Detail s={selected} onBack={onBack} onSelect={onSelect} onSetBubble={onSetBubble} compareIds={compareIds} onToggleCompare={onToggleCompare} />
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <div className="empty-title">Aucun résultat</div>
            <div className="empty-desc">Essayez une autre recherche ou ajustez les filtres.</div>
          </div>
        ) : (
          list.map((s, i) => (
            <SchoolCard key={s.id} s={s} onClick={() => onSelect(s.id)} index={i} />
          ))
        )}
      </div>
    </div>
  );
}

function SchoolCard({ s, onClick, index }) {
  const va = getVA(s);
  const br = s.iv?.brevet ?? s.iv?.bac;
  const delay = Math.min(0.14, index * 0.02);
  return (
    <div
      className={`school-card `}
      onClick={onClick}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="sc-top">
        <div className="sc-body">
          <div className="sc-tags">
            <span className="tag tag-type">{TL[s.t]}</span>
            <span className={`tag ${s.s === 'u' ? 'tag-public' : 'tag-prive'}`}>{SL[s.s]}</span>
            {s.f?.includes('REP+') && <span className="tag tag-rep">REP+</span>}
            {s.f?.includes('REP') && !s.f?.includes('REP+') && <span className="tag tag-rep">REP</span>}
            {s.sp?.includes('CHAM') && <span className="tag tag-type">♪ CHAM</span>}
            {s.sp?.includes('Intl') && <span className="tag tag-type">🌐 Intl</span>}
          </div>
          <div className="sc-name">{s.n}</div>
          <div className="sc-meta">
            {s.c}<span className="dot">·</span>{s.a}
            {s.px && <><span className="dot">·</span><span className="price">{s.px}€/an</span></>}
          </div>
        </div>
        <div className={`sc-ips ${s.i_proxy ? 'proxy' : ''}`} style={{ background: ipsColor(s.i) }}>
          <div className="n">{s.i ? Math.round(s.i) : '?'}</div>
          <div className="l">{ipsShort(s.i)}</div>
        </div>
      </div>
      {(va != null || br != null || s.ef) && (
        <div className="sc-metrics">
          {br != null ? (
            <div className="sc-metric">
              <div className="sc-metric-l">{s.t === 'l' ? 'Bac' : 'Brevet'}</div>
              <div className="sc-metric-v mono">{br}%</div>
            </div>
          ) : (s.t === 'm' || s.t === 'e' || s.t === 'p') && s.cs ? (
            <div className="sc-metric">
              <div className="sc-metric-l">Collège</div>
              <div className="sc-metric-v" style={{fontSize: '11px', lineHeight: 1.2}}>
                {(typeof s.cs === 'string' ? s.cs : s.cs.n).replace('Collège ','').replace(/\(.+?\)/,'').trim().substring(0, 22)}
              </div>
            </div>
          ) : <div></div>}
          {va != null ? (
            <div className="sc-metric">
              <div className="sc-metric-l">Plus-value</div>
              <div className={`sc-metric-v mono ${vaClass(va)}`}>{vaSign(va)}</div>
            </div>
          ) : <div></div>}
          {s.ef ? (
            <div className="sc-metric">
              <div className="sc-metric-l">Effectif</div>
              <div className="sc-metric-v mono">{s.ef}</div>
            </div>
          ) : <div></div>}
        </div>
      )}
    </div>
  );
}

function Detail({ s, onBack, onSelect, onSetBubble, compareIds, onToggleCompare }) {
  const va = getVA(s);
  const br = s.iv?.brevet ?? s.iv?.bac;
  const ipsPos = s.i ? Math.min(98, Math.max(2, (s.i - 55) / 100 * 100)) : 50;
  const cs = s.cs && typeof s.cs === 'object' ? s.cs : null;
  const linkedCollege = cs && cs.n ? D.find(x => x.t === 'c' && x.n.replace(/\s+/g,'').toLowerCase() === cs.n.replace('Collège ','').replace(/\s+/g,'').toLowerCase().replace(/\(.+?\)/,'')) : null;
  const inCompare = compareIds?.includes(s.id);
  
  return (
    <div className="detail">
      <div className="detail-actions">
        <button className="detail-back" onClick={onBack}>← Retour à la liste</button>
        {onToggleCompare && (
          <button
            className={`detail-compare ${inCompare ? 'active' : ''}`}
            onClick={() => onToggleCompare(s.id)}
            title={inCompare ? "Retirer de la comparaison" : "Ajouter à la comparaison (max 2)"}
          >
            {inCompare ? '✓ Sélectionnée' : '⇄ Comparer'}
          </button>
        )}
      </div>
      <div className="detail-head">
        <div className="detail-tags">
          <span className="tag tag-type">{TL[s.t]}</span>
          <span className={`tag ${s.s === 'u' ? 'tag-public' : 'tag-prive'}`}>{SL[s.s]}</span>
          {s.f?.includes('REP+') && <span className="tag tag-rep">REP+</span>}
          {s.f?.includes('REP') && !s.f?.includes('REP+') && <span className="tag tag-rep">REP</span>}
          {s.sp?.map(sp => (
            <span key={sp} className="tag tag-type">
              {sp === 'CHAM' ? '♪ CHAM' : sp === 'Intl' ? '🌐 Intl' : sp}
            </span>
          ))}
        </div>
        <div className="detail-name">{s.n}</div>
        <div className="detail-addr">
          📍 {s.c} · {s.a}
          {s.px && <> · <strong>{s.px}€/an</strong></>}
        </div>
        {s.i && (
          <div className="detail-ips-panel">
            <div className={`detail-ips-circle ${s.i_proxy ? 'proxy' : ''}`} style={{ background: ipsColor(s.i) }}>
              <div className="n">{Math.round(s.i)}</div>
              <div className="l">{ipsShort(s.i)}</div>
            </div>
            <div className="detail-ips-info">
              <div className="k">
                Indice Position Sociale · IPS
                <button className="k-info" onClick={() => onSetBubble('ips')}>i</button>
              </div>
              <div className="v">{ipsLabel(s.i)}</div>
              <div className="detail-ips-spec">
                <div className="detail-ips-cursor" style={{ left: `${ipsPos}%` }}></div>
              </div>
              <div className="detail-ips-labels">
                <span>55</span><span>100</span><span>155</span>
              </div>
              {s.i_proxy && (
                <div className="proxy-note">
                  ≈ IPS estimé ({s.i_source || 'quartier'})
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {s.ev && (
        <div className="detail-section">
          <div className="detail-section-h">
            Niveau à l'entrée en 6ème · 2024
            <button className="h-info" onClick={() => onSetBubble('eval')}>i</button>
          </div>
          <div className="kpi-grid">
            {s.ev.fr_s && (
              <div className="kpi-card">
                <div className="kpi-l">Français</div>
                <div className="kpi-v">{s.ev.fr_s}</div>
                <div className="kpi-sub">score standardisé</div>
              </div>
            )}
            {s.ev.ma_s && (
              <div className="kpi-card">
                <div className="kpi-l">Mathématiques</div>
                <div className="kpi-v">{s.ev.ma_s}</div>
                <div className="kpi-sub">score standardisé</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {s.iv && (br != null || va != null) && (
        <div className="detail-section">
          <div className="detail-section-h">
            {s.t === 'l' ? 'Bac · session 2024' : 'Brevet · session 2024'}
            <button className="h-info" onClick={() => onSetBubble(s.t === 'l' ? 'bac' : 'brevet')}>i</button>
          </div>
          <div className="kpi-grid">
            {br != null && (
              <div className="kpi-card">
                <div className="kpi-l">Réussite</div>
                <div className="kpi-v">{br}%</div>
                <div className="kpi-sub">{br >= 95 ? 'Excellent' : br >= 85 ? 'Solide' : br >= 75 ? 'Correct' : 'Moyen'}</div>
              </div>
            )}
            {va != null && (
              <div className={`kpi-card ${va >= 5 ? 'positive' : va <= -5 ? 'neg' : ''}`}>
                <div className="kpi-l">Plus-value</div>
                <div className={`kpi-v ${vaClass(va)}`}>{vaSign(va)}</div>
                <div className="kpi-sub">
                  {va >= 8 ? '★ exceptionnel' : va >= 3 ? 'au-dessus' : va >= -2 ? 'moyenne' : 'en dessous'}
                </div>
              </div>
            )}
            {s.iv.men != null && (
              <div className="kpi-card">
                <div className="kpi-l">Mentions</div>
                <div className="kpi-v">{s.iv.men}%</div>
                <div className="kpi-sub">AB, B ou TB</div>
              </div>
            )}
            {s.iv.note_ecrit != null && (
              <div className="kpi-card">
                <div className="kpi-l">Note écrit</div>
                <div className="kpi-v">{s.iv.note_ecrit}</div>
                <div className="kpi-sub">/20 moyenne</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {cs && (
        <div className="detail-section">
          <div className="detail-section-h">
            Collège de secteur · Affelnet
            <button className="h-info" onClick={() => onSetBubble('secteur')}>i</button>
          </div>
          <div
            className="cs-card"
            onClick={() => linkedCollege && onSelect(linkedCollege.id)}
            style={{ cursor: linkedCollege ? 'pointer' : 'default' }}
          >
            <div className="cs-icon">→</div>
            <div className="cs-info">
              <div className="l">{cs.ext ? 'Hors périmètre' : 'Votre secteur'}</div>
              <div className="n">{cs.n}</div>
              {(cs.va != null || cs.br != null) && (
                <div className="d">
                  {cs.va != null && <>VA {vaSign(cs.va)}</>}
                  {cs.va != null && cs.br != null && ' · '}
                  {cs.br != null && <>Brevet {cs.br}%</>}
                </div>
              )}
            </div>
            {cs.i && (
              <div className="cs-ips-mini" style={{ background: ipsColor(cs.i) }}>
                {Math.round(cs.i)}
              </div>
            )}
          </div>
        </div>
      )}
      
      {(s.ef || s.px || s.px_nc || s.cl) && (
        <div className="detail-section">
          <div className="detail-section-h">Informations pratiques</div>
          <div className="kpi-grid">
            {s.ef && (
              <div className={`kpi-card ${(!s.px && !s.px_nc && !s.cl) ? 'full' : ''}`}>
                <div className="kpi-l">Effectif</div>
                <div className="kpi-v">{s.ef}</div>
                <div className="kpi-sub">élèves</div>
              </div>
            )}
            {s.cl && (
              <div className="kpi-card">
                <div className="kpi-l">Classes</div>
                <div className="kpi-v">{s.cl}</div>
                <div className="kpi-sub">{s.ef ? Math.round(s.ef/s.cl) + ' élèves/classe' : ''}</div>
              </div>
            )}
            {s.px && (
              <div className={`kpi-card ${!s.cl ? 'full' : ''}`}>
                <div className="kpi-l">Scolarité</div>
                <div className="kpi-v">{s.px}€</div>
                <div className="kpi-sub">par an</div>
              </div>
            )}
            {!s.px && s.px_nc && (
              <div className={`kpi-card ${!s.cl ? 'full' : ''}`}>
                <div className="kpi-l">Scolarité</div>
                <div className="kpi-v" style={{fontSize: '18px', color: 'var(--ink-4)'}}>NC</div>
                <div className="kpi-sub">non communiqué</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="detail-footer">
        <div className="detail-source">
          Source · DEPP · Ministère de l'Éducation nationale · 2024
        </div>
      </div>
    </div>
  );
}

function AddressModal({ open, onClose, input, setInput, result, onSelectAddress, onOpen }) {
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const debounceRef = React.useRef(null);
  
  // Autocomplétion via API BAN (api-adresse.data.gouv.fr) — gratuite et officielle
  React.useEffect(() => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Recentrer sur Lille pour avoir des résultats locaux en priorité
        // Note: ne pas utiliser type=housenumber,street (l'API renvoie 400, n'accepte qu'une valeur)
        const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(input)}&limit=5&lat=50.633&lon=3.063`;
        const res = await fetch(url);
        const data = await res.json();
        const features = (data.features || [])
          .filter(f => {
            // Garder uniquement les communes du département du Nord (59)
            // Les codes postaux MEL commencent par 59
            const pc = (f.properties.postcode || '').toString();
            return pc.startsWith('59');
          })
          .map(f => ({
            id: f.properties.id,
            label: f.properties.label,
            city: f.properties.city,
            postcode: f.properties.postcode,
            type: f.properties.type,
            lo: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1]
          }));
        setSuggestions(features);
        setActiveIdx(-1);
      } catch (err) {
        console.error('Erreur API BAN:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);
  
  function handleSelect(addr) {
    setSuggestions([]);
    setInput(addr.label);
    onSelectAddress(addr);
  }
  
  function handleKeyDown(e) {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      // Si aucune suggestion n'est mise en surbrillance, prend la première
      e.preventDefault();
      const idx = activeIdx >= 0 ? activeIdx : 0;
      handleSelect(suggestions[idx]);
    }
  }
  
  return (
    <div className={`addr-modal ${open ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="addr-panel">
        <div className="addr-grip"></div>
        <div className="addr-title">
          Ne vous trompez pas <span className="accent">d'école.</span>
        </div>
        <div className="addr-sub">
          Saisissez votre adresse. On identifie l'école de secteur et le collège où votre enfant ira après. Avec les données officielles du Ministère.
        </div>
        <div className="addr-input-wrap">
          <span>📍</span>
          <input
            type="text"
            placeholder="Ex : 12 rue Solférino, Lille…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {loading && <span className="addr-loading">⏳</span>}
        </div>
        
        {/* Suggestions BAN */}
        {suggestions.length > 0 && (
          <div className="addr-suggestions">
            {suggestions.map((s, i) => (
              <div
                key={s.id}
                className={`addr-suggestion ${i === activeIdx ? 'active' : ''}`}
                onClick={() => handleSelect(s)}
              >
                <span className="addr-suggestion-icon">📍</span>
                <div className="addr-suggestion-body">
                  <div className="addr-suggestion-label">{s.label}</div>
                  <div className="addr-suggestion-meta">{s.postcode} {s.city}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!result && suggestions.length === 0 && input.length < 3 && (
          <div className="addr-hint">
            <div className="addr-examples-label">Quelques quartiers à tester</div>
            <div className="addr-examples">
              {['Wazemmes', 'Vauban', 'Lille-Sud', 'Lambersart', 'La Madeleine'].map(q => (
                <button
                  key={q}
                  className="addr-example"
                  onClick={() => setInput(q)}
                >{q}</button>
              ))}
            </div>
          </div>
        )}
        
        {result && (
          <div className="addr-results">
            <div className="addr-results-title">
              ✓ {result.label}
              {result.dist != null && ` · école à ${result.dist.toFixed(2)} km`}
            </div>
            {result.error && (
              <div className="addr-error">{result.error}</div>
            )}
            {result.ec && (
              <div className="addr-result" onClick={() => onOpen(result.ec.id)}>
                <div className="addr-result-body">
                  <div className="addr-result-k">École la plus proche</div>
                  <div className="addr-result-n">{result.ec.n}</div>
                  <div className="addr-result-d">{result.ec.c} · {result.ec.a}</div>
                </div>
                {result.ec.i && (
                  <div className="cs-ips-mini" style={{ background: ipsColor(result.ec.i) }}>
                    {Math.round(result.ec.i)}
                  </div>
                )}
              </div>
            )}
            {result.ec && result.col && (
              <div className="addr-chain">
                <div className="addr-chain-line"></div>
                <span>↓ rattaché au collège</span>
                <div className="addr-chain-line"></div>
              </div>
            )}
            {result.col && (
              <div className="addr-result" onClick={() => onOpen(result.col.id)}>
                <div className="addr-result-body">
                  <div className="addr-result-k">Collège de secteur</div>
                  <div className="addr-result-n">{result.col.n}</div>
                  <div className="addr-result-d">
                    {result.col.c}
                    {getVA(result.col) != null && ` · VA ${vaSign(getVA(result.col))}`}
                    {result.col.iv?.brevet != null && ` · Brevet ${result.col.iv.brevet}%`}
                  </div>
                </div>
                {result.col.i && (
                  <div className="cs-ips-mini" style={{ background: ipsColor(result.col.i) }}>
                    {Math.round(result.col.i)}
                  </div>
                )}
              </div>
            )}
            {result.ec && !result.col && result.colExt && (
              <>
                <div className="addr-chain">
                  <div className="addr-chain-line"></div>
                  <span>↓ rattaché au collège</span>
                  <div className="addr-chain-line"></div>
                </div>
                <div className="addr-result addr-result-ext">
                  <div className="addr-result-body">
                    <div className="addr-result-k">Collège de secteur · hors périmètre</div>
                    <div className="addr-result-n">{result.colExt.n}</div>
                    <div className="addr-result-d">
                      {result.colExt.va != null && `VA ${vaSign(result.colExt.va)}`}
                      {result.colExt.va != null && result.colExt.br != null && ' · '}
                      {result.colExt.br != null && `Brevet ${result.colExt.br}%`}
                      {(result.colExt.va == null && result.colExt.br == null) && 'Données ministérielles'}
                    </div>
                  </div>
                  {result.colExt.i != null && (
                    <div className="cs-ips-mini" style={{ background: ipsColor(result.colExt.i) }}>
                      {Math.round(result.colExt.i)}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
        <div className="addr-disclaimer">
          ℹ️ Ce service utilise l'API officielle de la Base Adresse Nationale (BAN) du gouvernement français. Aucune donnée n'est stockée.
        </div>
      </div>
    </div>
  );
}

function Tour({ idx, setIdx, onEnd }) {
  const [pos, setPos] = useState(null);
  
  useEffect(() => {
    if (idx < 0 || idx >= TOUR_STEPS.length) return;
    const step = TOUR_STEPS[idx];
    
    // Attendre un tick pour que le DOM soit prêt
    const tid = setTimeout(() => {
      let target = document.querySelector(step.targetSelector);
      if (!target && step.fallbackSelector) {
        target = document.querySelector(step.fallbackSelector);
      }
      if (!target) {
        setPos({ center: true });
        return;
      }
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = step.spotlightRadius || Math.max(rect.width, rect.height) / 2 + 10;
      setPos({ cx, cy, radius, position: step.position });
    }, 120);
    
    return () => clearTimeout(tid);
  }, [idx]);
  
  if (idx < 0) return null;
  const step = TOUR_STEPS[idx];
  const isLast = idx === TOUR_STEPS.length - 1;
  
  // Calcul position card
  let cardStyle = {};
  let arrowClass = '';
  if (pos && !pos.center) {
    const cardW = Math.min(360, window.innerWidth - 48);
    const margin = 22;
    let top;
    if (step.position === 'bottom') {
      top = pos.cy + pos.radius + margin;
      arrowClass = 'top';
    } else {
      top = pos.cy - pos.radius - margin - 180;
      arrowClass = 'bottom';
    }
    let left = pos.cx - cardW / 2;
    if (left < 12) left = 12;
    if (left + cardW > window.innerWidth - 12) left = window.innerWidth - cardW - 12;
    if (top < 12) { top = pos.cy + pos.radius + margin; arrowClass = 'top'; }
    cardStyle = { left, top, width: cardW };
  } else if (pos?.center) {
    const cardW = Math.min(360, window.innerWidth - 48);
    cardStyle = { left: (window.innerWidth - cardW) / 2, top: window.innerHeight / 2 - 100, width: cardW };
    arrowClass = '';
  }
  
  return (
    <>
      <div className="tour-overlay show" onClick={() => onEnd(false)}></div>
      {pos && !pos.center && (
        <div
          className="tour-spotlight show pulse"
          style={{
            left: pos.cx - pos.radius,
            top: pos.cy - pos.radius,
            width: pos.radius * 2,
            height: pos.radius * 2
          }}
        ></div>
      )}
      <div className="tour-card show" style={cardStyle}>
        {arrowClass && <div className={`tour-card-arrow ${arrowClass}`}></div>}
        <div className="tour-card-head">
          <div className="tour-steps">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`tour-step ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}
              ></div>
            ))}
          </div>
          <div className="tour-counter">{String(idx + 1).padStart(2, '0')} / {String(TOUR_STEPS.length).padStart(2, '0')}</div>
        </div>
        <div className="tour-title" dangerouslySetInnerHTML={{ __html: step.title }}></div>
        <div className="tour-desc" dangerouslySetInnerHTML={{ __html: step.desc }}></div>
        <div className="tour-actions">
          <button className="tour-skip" onClick={() => onEnd(false)}>Passer</button>
          <button className="tour-next" onClick={() => isLast ? onEnd(true) : setIdx(idx + 1)}>
            {isLast ? 'Terminer ✓' : 'Suivant →'}
          </button>
        </div>
      </div>
    </>
  );
}

function HelpBubble({ topic, onClose }) {
  const h = HELP[topic];
  if (!h) return null;
  // Convertir les \n\n en paragraphes et \n en <br>
  const paragraphs = (h.d || '').split('\n\n').filter(Boolean);
  return (
    <div className="help-bubble-overlay" onClick={onClose}>
      <div className="help-bubble" onClick={e => e.stopPropagation()}>
        <button className="help-close" onClick={onClose}>×</button>
        <div className="help-title">{h.t}</div>
        <div className="help-content">
          {paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br/>') }}></p>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// COMPARATEUR — 2 écoles côte-à-côte
// ============================================================
function CompareModal({ ids, onClose, onRemove }) {
  const schools = ids.map(id => D.find(s => s.id === id)).filter(Boolean);
  
  // Si une seule école, afficher un placeholder
  const cols = [...schools];
  while (cols.length < 2) cols.push(null);
  
  // Lignes de comparaison (key, label, render fn)
  const rows = [
    { k: 'type', label: 'Type', render: s => `${TL[s.t]} · ${SL[s.s]}` },
    { k: 'addr', label: 'Adresse', render: s => `${s.c} · ${s.a}` },
    { k: 'ips', label: 'IPS', help: 'ips', render: s => s.i ? (s.i_proxy ? `≈ ${Math.round(s.i)}` : Math.round(s.i)) : '—' },
    { k: 'effectif', label: 'Effectif', render: s => s.ef || '—' },
    { k: 'classes', label: 'Classes', render: s => s.cl || '—' },
    { k: 'rep', label: 'Éducation prioritaire', render: s => 
      s.f?.includes('REP+') ? 'REP+' : 
      s.f?.includes('REP') ? 'REP' : 
      '—'
    },
    { k: 'ulis', label: 'ULIS', render: s => s.f?.includes('ULIS') ? '✓' : '—' },
    { k: 'cantine', label: 'Cantine', render: s => s.f?.includes('CANT') ? '✓' : '—' },
    { k: 'specs', label: 'Spécialités', render: s => s.sp?.length ? s.sp.join(' · ') : '—' },
    // Pour collèges
    { k: 'brevet', label: 'Brevet', condition: s => s.t === 'c', render: s => s.iv?.brevet ? `${s.iv.brevet}%` : '—' },
    { k: 'va_brevet', label: 'VA Brevet', help: 'va', condition: s => s.t === 'c', render: s => s.iv?.va_brevet != null ? vaSign(s.iv.va_brevet) : '—' },
    { k: 'eval6e', label: 'Éval 6e maths', condition: s => s.t === 'c', render: s => s.ev?.ma_s ? s.ev.ma_s : '—' },
    { k: 'eval6e_fr', label: 'Éval 6e français', condition: s => s.t === 'c', render: s => s.ev?.fr_s ? s.ev.fr_s : '—' },
    // Pour lycées
    { k: 'bac', label: 'Bac', condition: s => s.t === 'l', render: s => s.iv?.bac ? `${s.iv.bac}%` : '—' },
    { k: 'va_bac', label: 'VA Bac', help: 'va', condition: s => s.t === 'l', render: s => s.iv?.va_bac != null ? vaSign(s.iv.va_bac) : '—' },
    { k: 'mention', label: 'Mention', condition: s => s.t === 'l', render: s => s.iv?.men ? `${s.iv.men}%` : '—' },
    { k: 'va_men', label: 'VA Mention', condition: s => s.t === 'l', render: s => s.iv?.va_men != null ? vaSign(s.iv.va_men) : '—' },
    // Pour écoles primaires
    { k: 'cs', label: 'Collège secteur', condition: s => s.t === 'e' || s.t === 'p' || s.t === 'm', render: s => 
      s.cs ? (typeof s.cs === 'string' ? s.cs : s.cs.n) : '—'
    },
    // Privé
    { k: 'prix', label: 'Scolarité', condition: s => s.s === 'v', render: s => 
      s.px ? `${s.px} €/an` : 
      s.px_nc ? 'NC' : 
      '—'
    },
  ];
  
  // Filtrer les lignes pertinentes (au moins une école répond à la condition)
  const relevantRows = rows.filter(r => 
    !r.condition || schools.some(s => s && r.condition(s))
  );
  
  return (
    <div className="compare-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="compare-panel">
        
        {/* Header style Detail : back button + titre + sous-titre */}
        <div className="compare-head">
          <button className="compare-back" onClick={onClose} aria-label="Fermer le comparateur">
            <span aria-hidden="true">←</span> Retour
          </button>
          <div className="compare-title">Comparer 2 écoles</div>
          <div className="compare-sub">Source · DEPP · Ministère de l'Éducation nationale</div>
        </div>
        
        {/* 2 colonnes en mode "carte fiche" : tags + nom + cercle IPS + adresse */}
        <div className="compare-cols-head">
          {cols.map((s, i) => (
            <div key={i} className="compare-col-head">
              {s ? (
                <>
                  <button className="compare-col-remove" onClick={() => onRemove(s.id)} title="Retirer cette école" aria-label="Retirer">×</button>
                  <div className="compare-col-tags">
                    <span className="tag tag-type">{TL[s.t]}</span>
                    <span className={`tag ${s.s === 'u' ? 'tag-public' : 'tag-prive'}`}>{SL[s.s]}</span>
                  </div>
                  <div className="compare-col-name">{s.n}</div>
                  <div className="compare-col-addr">{s.c}</div>
                  {s.i && (
                    <div className="compare-col-ips-circle" style={{ background: ipsColor(s.i) }}>
                      <span className="n">{s.i_proxy ? '≈' : ''}{Math.round(s.i)}</span>
                      <span className="l">IPS</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="compare-col-empty">
                  <div className="compare-col-empty-icon">+</div>
                  <div className="compare-col-empty-label">Sélectionnez une 2<sup>e</sup> école<br/><small>depuis la liste ou la carte</small></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Lignes de comparaison */}
        <div className="compare-rows">
          {relevantRows.map(row => (
            <div className="compare-row" key={row.k}>
              <div className="compare-row-label">{row.label}</div>
              {cols.map((s, i) => (
                <div key={i} className="compare-row-cell">
                  {s ? row.render(s) : '—'}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="compare-footer">
          Les valeurs précédées de <span className="mono">≈</span> sont des IPS estimés à partir de l'école voisine la plus proche.
        </div>
      </div>
    </div>
  );
}

export default App;
