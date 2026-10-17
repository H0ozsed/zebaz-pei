// Maquette front-only : routeur par hash, état local, aucune requête serveur.
const $ = s => document.querySelector(s);
const eur = n => n.toFixed(2).replace('.', ',') + ' €';
const ic = (name, cls = '') => `<i data-lucide="${name}" class="${cls}"></i>`;
const pic = (src, alt = '', cls = '') => `<div class="ph ${cls}"><img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()"></div>`;
const byId = (list, id) => list.find(x => x.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('zp_' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('zp_' + k, JSON.stringify(v)); } catch {} }
};

const S = {
  cart: store.get('cart', {}),
  favs: store.get('favs', []),
  rdvs: store.get('rdvs', RDVS),
  ui: {}
};
const ui = (k, d) => (k in S.ui ? S.ui[k] : d);
const setUi = (k, v) => { S.ui[k] = v; render(); };

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2400);
}

/* ---------- Panier ---------- */
const cartCount = () => Object.values(S.cart).reduce((a, b) => a + b, 0);
const cartSub = () => Object.entries(S.cart).reduce((a, [id, q]) => a + byId(PRODUCTS, id).prix * q, 0);
function addCart(id, q = 1) {
  S.cart[id] = (S.cart[id] || 0) + q; store.set('cart', S.cart);
  toast('Ajouté au panier'); render();
}
function setQty(id, d) {
  S.cart[id] = (S.cart[id] || 0) + d;
  if (S.cart[id] <= 0) delete S.cart[id];
  store.set('cart', S.cart); render();
}
function toggleFav(id) {
  S.favs = S.favs.includes(id) ? S.favs.filter(x => x !== id) : [...S.favs, id];
  store.set('favs', S.favs); render();
}

/* ---------- Gabarit ---------- */
const NAV = [
  ['', 'house', 'Accueil'], ['scanner', 'scan-line', 'Scanner'], ['plantes', 'sprout', 'Plantes'],
  ['boutique', 'store', 'Boutique'], ['pros', 'users', 'Professionnels']
];
const SECTION = { plante: 'plantes', produit: 'boutique', panier: 'boutique', paiement: 'boutique', confirmation: 'boutique',
  pro: 'pros', rdv: 'pros', chat: 'pros', profil: 'plus', commandes: 'plus', 'mes-rdv': 'plus', page: 'plus', cgv: 'plus', contact: 'plus', 'scanner-info': 'scanner' };

const logo = () => `<a class="logo" href="#/" aria-label="Zerbaz Péi, accueil">
  <span class="logo-mark">${ic('flower-2')}</span><span class="logo-txt">Zerbaz Péi</span></a>`;

function shell(route, title, body) {
  const sec = SECTION[route] ?? route;
  const n = cartCount();
  const home = route === '';
  return `
  <header class="top ${home ? 'is-home' : ''}">
    <div class="top-in">
      ${home ? '' : `<button class="icon back" onclick="history.back()" aria-label="Retour">${ic('arrow-left')}</button>`}
      ${logo()}
      <span class="ttl">${title}</span>
      <nav class="dnav">${NAV.map(([r, , l]) => `<a href="#/${r}" class="${sec === r ? 'on' : ''}">${l}</a>`).join('')}</nav>
      <a href="#/plus" class="icon user ${sec === 'plus' ? 'on' : ''}" aria-label="Plus : profil et informations">${ic('circle-user-round')}</a>
    </div>
  </header>
  ${['boutique', 'produit'].includes(route) ? `<a href="#/panier" class="cart-fab" aria-label="Panier, ${n} article(s)">${ic('shopping-basket')}${n ? `<b>${n}</b>` : ''}</a>` : ''}
  <main class="page" id="main">
    ${home ? '' : `<h1 class="ptitle">${title}</h1>`}
    ${body}
    ${route === 'chat' ? '' : `<footer class="foot">
      <div>${logo()}<p>Les plantes de La Réunion, naturellement.</p></div>
      <nav>
        <a href="#/page/a-propos">À propos</a><a href="#/page/mentions">Mentions légales</a>
        <a href="#/page/confidentialite">Confidentialité</a><a href="#/cgv">CGV</a>
        <a href="#/page/cookies">Cookies</a><a href="#/contact">Contact</a>
      </nav>
      <small>© 2026 Zerbaz Péi — Maquette, contenus fictifs de démonstration.</small>
    </footer>`}
  </main>
  <nav class="bnav">${NAV.filter(x => x[0] !== 'pros').map(([r, i, l]) =>
    `<a href="#/${r}" class="${sec === r ? 'on' : ''}">${ic(i)}<span>${l}</span></a>`).join('')}</nav>`;
}

const tabs = (key, opts, cur) => `<div class="tabs" role="tablist">${opts.map(o =>
  `<button role="tab" aria-selected="${o === cur}" class="${o === cur ? 'on' : ''}" onclick="setUi('${key}','${o}')">${o}</button>`).join('')}</div>`;

const stars = (note, avis) => `<span class="stars">${ic('star')} ${String(note).replace('.', ',')} <em>(${avis} avis)</em></span>`;

const plantCard = p => `<a class="pcard" href="#/plante/${p.id}">${pic(img(p.kw, 0, 500), p.nom)}<strong>${p.nom}</strong><small>${p.court}</small></a>`;

const prodRow = p => `<div class="prow">
  <a href="#/produit/${p.id}">${pic(p.img, p.nom, 'thumb')}</a>
  <a href="#/produit/${p.id}" class="prow-txt"><strong>${p.nom}</strong><small>${p.poids}</small><span class="price">${eur(p.prix)}</span>
  ${p.dispo ? '' : '<span class="chip warn">Indisponible</span>'}</a>
  <button class="add" ${p.dispo ? '' : 'disabled'} onclick="addCart('${p.id}')" aria-label="Ajouter ${p.nom} au panier">${ic('plus')}</button>
</div>`;

const prodCard = p => `<a class="pcard" href="#/produit/${p.id}">${pic(p.img, p.nom)}<strong>${p.nom}</strong><small>${p.poids}</small><span class="price">${eur(p.prix)}</span></a>`;

const proCard = p => `<article class="card pro">
  <div class="pro-head">${pic(img(p.kw, 0, 300), p.nom, 'avatar lg')}
    <div><strong>${p.nom}</strong><small>${p.role}</small><small class="loc">${ic('map-pin')} ${p.ville}</small>
    <div class="chips">${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div></div></div>
  <p>${p.bio}</p>
  <div class="row2"><a class="btn ghost" href="#/pro/${p.id}">Voir le profil</a><a class="btn" href="#/rdv/${p.id}">Prendre rendez-vous</a></div>
</article>`;

/* ---------- Pages ---------- */
const V = {};

V[''] = () => ['Accueil', `
  <section class="hero-m">
    ${pic(img('salazie', 0, 1000), 'Paysage de La Réunion', 'hero-m-img')}
    <div class="hero-m-txt">
      <h1>Les plantes de La Réunion, au bout de vos doigts</h1>
      <p>Identifiez, découvrez, commandez et rencontrez nos tisaneurs et producteurs locaux.</p>
      <a class="btn yellow" href="#/scanner">${ic('camera')} Scanner une plante</a>
    </div>
  </section>
  <div class="tiles">
    <a href="#/plantes">${ic('sprout')}<span>Découvrir les plantes</span></a>
    <a href="#/boutique">${ic('coffee')}<span>Boutique de tisanes</span></a>
    <a href="#/pros">${ic('users')}<span>Professionnels & tisaneurs</span></a>
  </div>
  <section class="hero">
    <div class="hero-txt">
      <h1>Les plantes de La Réunion, au bout de vos doigts</h1>
      <p>Photographiez une plante pour l’identifier, découvrez ses usages, commandez des tisanes locales et rencontrez les tisaneurs de l’île.</p>
      <a class="btn" href="#/scanner">${ic('camera')} Scanner une plante</a>
    </div>
    <a class="specimen" href="#/plante/hibiscus" aria-label="Voir la fiche de l’hibiscus">
      ${pic(img('hibiscus', 0, 900), 'Fleur d’hibiscus rouge', 'specimen-img')}
      <span class="specimen-tag"><em>Hibiscus rosa-sinensis</em><span>Choublak</span><span>Saint-Benoît, octobre 2026</span></span>
    </a>
  </section>
  <nav class="quick" aria-label="Accès rapides">
    <a href="#/plantes">${ic('sprout')}<span>Découvrir les plantes</span>${ic('chevron-right')}</a>
    <a href="#/boutique">${ic('coffee')}<span>Boutique de tisanes</span>${ic('chevron-right')}</a>
    <a href="#/pros">${ic('users')}<span>Tisaneurs et producteurs</span>${ic('chevron-right')}</a>
  </nav>
  <div class="sec-h"><h2>Nos plantes du moment</h2><a href="#/plantes">Tout voir</a></div>
  <div class="hscroll">${PLANTS.slice(0, 6).map(plantCard).join('')}</div>
  <div class="sec-h"><h2>Sélection de tisanes</h2><a href="#/boutique">La boutique</a></div>
  <div class="hscroll">${PRODUCTS.filter(p => p.cat === 'Tisanes').map(prodCard).join('')}</div>
  <div class="sec-h"><h2>Rencontrer nos tisaneurs</h2><a href="#/pros">Tous les profils</a></div>
  <div class="hscroll">${PROS.map(p => `<a class="pcard mini-pro" href="#/pro/${p.id}">${pic(img(p.kw, 0, 300), p.nom, 'avatar xl')}<strong>${p.nom}</strong><small>${p.role}, ${p.ville}</small></a>`).join('')}</div>
  <a class="banner" href="#/page/a-propos">${ic('leaf')}<div><strong>Le saviez-vous ?</strong><p>La Réunion compte plus de 230 plantes endémiques. Découvrez notre démarche.</p></div>${ic('chevron-right')}</a>`];

const RESULTS = [
  { nom: 'Hibiscus rosa-sinensis', sub: 'Hibiscus', conf: 87, href: '#/plante/hibiscus', k: 'hibiscus' },
  { nom: 'Hibiscus syriacus', sub: 'Mauve', conf: 68, href: '#/plantes', k: 'syriacus' }
];
function shoot(file) {
  if (file) S.ui.preview = URL.createObjectURL(file);
  setUi('scan', 'loading');
  setTimeout(() => location.hash === '#/scanner' && setUi('scan', 'done'), 1600);
}
V.scanner = () => {
  const st = ui('scan', 'idle');
  return ['Scanner une plante', `
  <div class="scan-wrap">
    <div class="scanner">
      ${pic(ui('preview', img('hibiscus')), 'Aperçu de l’appareil photo', 'scan-img')}
      <div class="frame ${st === 'loading' ? 'busy' : ''}"><span></span><span></span><span></span><span></span></div>
      ${st === 'loading' ? `<div class="scan-load"><div class="spin"></div>Analyse en cours…</div>` : ''}
      <div class="scan-bar">
        <label class="sbtn">${ic('image')}<span>Galerie</span><input type="file" accept="image/*" hidden onchange="this.files[0] && shoot(this.files[0])"></label>
        <button class="shutter" onclick="shoot()" aria-label="Prendre la photo"></button>
        <button class="sbtn ${ui('flash') ? 'on' : ''}" onclick="setUi('flash', !ui('flash'))">${ic(ui('flash') ? 'zap' : 'zap-off')}<span>Flash</span></button>
      </div>
    </div>
    <div class="scan-side">
      <button class="btn ghost wide" onclick="setUi('tips', !ui('tips'))">${ic('lightbulb')} Astuces pour un bon scan</button>
      ${ui('tips') ? `<ul class="tips card">
        <li>Photographiez une seule plante, bien centrée.</li><li>Privilégiez la lumière naturelle, sans contre-jour.</li>
        <li>Cadrez une fleur ou une feuille de près.</li><li>Évitez les photos floues ou en mouvement.</li></ul>` : ''}
      ${st === 'done' ? `
      <div class="card results">
        <h2>Résultats possibles</h2>
        ${RESULTS.map(r => `<a class="res" href="${r.href}">${pic(img(r.k, 0, 200), r.nom, 'thumb sm')}
          <div><strong>${r.nom}</strong><small>${r.sub}</small><small>Confiance : ${r.conf} %</small>
          <div class="bar"><i style="width:${r.conf}%"></i></div></div>${ic('chevron-right')}</a>`).join('')}
        <p class="alert">${ic('triangle-alert')} Résultat indicatif. Ne consommez jamais une plante sur la seule base d’une photo.</p>
        <button class="btn ghost wide" onclick="S.ui.preview=null; setUi('scan','idle')">${ic('rotate-ccw')} Refaire un scan</button>
      </div>` : `<p class="muted center">Prenez une photo ou importez une image depuis votre galerie.</p>`}
      <a class="link-info" href="#/scanner-info">${ic('info')} Comment fonctionne le scanner ?</a>
    </div>
  </div>`];
};

V['scanner-info'] = () => ['Scanner une plante', `
  <div class="narrow center">
    <div class="badge-ic">${ic('sprout')}</div>
    <h2>Comment fonctionne le scanner ?</h2>
    <p>Nous utilisons une intelligence artificielle pour vous proposer des identifications, avec un niveau de confiance indicatif.</p>
    <p class="alert">${ic('triangle-alert')} Les résultats peuvent être erronés. La photo ne permet pas toujours de distinguer des espèces similaires. Ne consommez jamais une plante sur la seule base d’un résultat.</p>
    <a class="btn wide" href="#/page/scanner">En savoir plus</a>
  </div>`];

V.plantes = () => {
  const q = ui('pq', '').toLowerCase(), cat = ui('pcat', 'Toutes');
  const list = PLANTS.filter(p => (cat === 'Toutes' || p.cat === cat) && (p.nom + p.sci + p.autres).toLowerCase().includes(q));
  return ['Découvrir les plantes', `
  <label class="search">${ic('search')}<input placeholder="Rechercher une plante…" value="${esc(ui('pq', ''))}"
    oninput="S.ui.pq=this.value; clearTimeout(window._q); window._q=setTimeout(()=>{render(); const i=document.querySelector('.search input'); i.focus(); i.setSelectionRange(99,99)},250)"></label>
  ${tabs('pcat', ['Toutes', 'Fleurs', 'Feuilles', 'Racines', 'Fruits'], cat)}
  <div class="grid">${list.map(plantCard).join('') || '<p class="muted">Aucune plante trouvée.</p>'}</div>`];
};

V.plante = id => {
  const p = byId(PLANTS, id); if (!p) return V[404]();
  const t = ui('ptab', 'Description');
  const txt = t === 'Bienfaits'
    ? `<ul class="benefits">${p.bienfaits.map(b => `<li>${ic('circle-check')}${b}</li>`).join('')}</ul>`
    : `<p>${{ Description: p.desc, Usages: p.usagesTxt, Précautions: p.precautions }[t]}</p>`;
  const prods = p.produits.map(x => byId(PRODUCTS, x));
  return ['Fiche botanique', `
  <div class="detail">
    ${pic(img(p.kw, 0, 1000), p.nom, 'detail-img')}
    <div>
      <div class="pl-head">${pic(img(p.kw, 0, 200), '', 'avatar')}<div><h2>${p.sci}</h2><small>${p.nom}</small></div></div>
      <div class="chips">${p.tags.map(x => `<span class="chip yellow">${x}</span>`).join('')}</div>
      ${p.danger ? `<p class="alert">${ic('triangle-alert')} Plante potentiellement dangereuse : ne pas consommer sans avis d’un professionnel de santé.</p>` : ''}
      ${tabs('ptab', ['Description', 'Bienfaits', 'Usages', 'Précautions'], t)}
      ${txt}
      <div class="advice">
        <div class="advice-h">${ic('stethoscope')}<strong>Conseil santé</strong></div>
        <p>${p.conseil}</p>
        <small>Information générale, à faire valider par un professionnel de santé. Elle ne remplace pas une consultation.</small>
      </div>
      <ul class="facts">
        <li>${ic('leaf')}<b>Nom scientifique :</b> ${p.sci}</li>
        <li>${ic('tag')}<b>Autres noms :</b> ${p.autres}</li>
        <li>${ic('map-pin')}<b>Habitat :</b> ${p.habitat}</li>
        <li>${ic('flower')}<b>Parties utilisées :</b> ${p.parties}</li>
        <li>${ic('coffee')}<b>Usages traditionnels :</b> ${p.usages}</li>
        <li>${ic('triangle-alert')}<b>Précautions :</b> ${p.precautions}</li>
      </ul>
      <p class="muted small">Sources : [à compléter]. Dernière vérification : octobre 2026</p>
      ${prods.length ? `<a class="btn wide" href="#/produit/${prods[0].id}">Voir les produits associés</a>` : ''}
    </div>
  </div>`];
};

V.boutique = () => {
  const cat = ui('bcat', 'Tisanes'), q = ui('bq', '').toLowerCase();
  const list = PRODUCTS.filter(p => p.cat === cat && p.nom.toLowerCase().includes(q));
  return ['Boutique de tisanes', `
  <label class="search">${ic('search')}<input placeholder="Rechercher un produit…" value="${esc(ui('bq', ''))}"
    oninput="S.ui.bq=this.value; clearTimeout(window._q); window._q=setTimeout(()=>{render(); const i=document.querySelector('.search input'); i.focus(); i.setSelectionRange(99,99)},250)"></label>
  ${tabs('bcat', ['Tisanes', 'Infusions', 'Poudres'], cat)}
  <div class="plist">${list.map(prodRow).join('') || '<p class="muted">Aucun produit trouvé.</p>'}</div>`];
};

const acc = (title, body, open) => `<details class="acc" ${open ? 'open' : ''}><summary>${title}${ic('chevron-down')}</summary><div>${body}</div></details>`;

V.produit = id => {
  const p = byId(PRODUCTS, id); if (!p) return V[404]();
  const q = ui('qty-' + id, 1), fav = S.favs.includes(id);
  return ['Détail produit', `
  <div class="detail">
    <div class="rel">${pic(p.img, p.nom, 'detail-img')}
      <button class="fav ${fav ? 'on' : ''}" onclick="toggleFav('${id}')" aria-label="Favori">${ic('heart')}</button></div>
    <div>
      <h2>${p.nom}</h2><small class="muted">${p.poids}</small>
      <p class="big-price">${eur(p.prix)}</p>
      ${stars(p.note, p.avis)}
      <p>${p.desc}</p>
      ${acc('Composition', p.compo, true)}
      ${acc('Conseils d’utilisation', 'Infuser 1 cuillère à café dans 25 cl d’eau frémissante pendant 5 à 7 minutes.')}
      ${acc('Précautions & conservation', 'Conserver à l’abri de la lumière et de l’humidité. Demander conseil en cas de grossesse, d’allaitement ou de traitement en cours.')}
      ${acc('Livraison & retours', `Livraison partout à La Réunion : ${eur(LIVRAISON)}. Vendu par Zerbaz Péi (micro-entreprise). Retours selon nos <a href="#/cgv">CGV</a>.`)}
      ${p.dispo ? `<div class="buy">
        <div class="qty"><button onclick="setUi('qty-${id}', Math.max(1, ${q} - 1))" aria-label="Moins">${ic('minus')}</button><span>${q}</span>
        <button onclick="setUi('qty-${id}', ${q} + 1)" aria-label="Plus">${ic('plus')}</button></div>
        <button class="btn wide" onclick="addCart('${id}', ${q})">Ajouter au panier</button></div>`
      : `<p class="alert">${ic('package-x')} Produit momentanément indisponible.</p>`}
    </div>
  </div>`];
};

V.panier = () => {
  const items = Object.entries(S.cart);
  if (!items.length) return ['Panier', `<div class="empty">${ic('shopping-basket')}<p>Votre panier est vide.</p><a class="btn" href="#/boutique">Découvrir la boutique</a></div>`];
  const sub = cartSub();
  return ['Panier', `
  <div class="split">
    <div class="plist">${items.map(([id, q]) => { const p = byId(PRODUCTS, id); return `<div class="prow">
      ${pic(p.img, p.nom, 'thumb')}
      <div class="prow-txt"><strong>${p.nom}</strong><small>${p.poids}</small><span class="price">${eur(p.prix * q)}</span>
        <div class="qty sm"><button onclick="setQty('${id}',-1)" aria-label="Moins">${ic('minus')}</button><span>${q}</span><button onclick="setQty('${id}',1)" aria-label="Plus">${ic('plus')}</button></div></div>
      <button class="icon del" onclick="setQty('${id}',-${q})" aria-label="Supprimer">${ic('trash-2')}</button></div>`; }).join('')}</div>
    <div class="card sum">
      <p><span>Sous-total</span><span>${eur(sub)}</span></p>
      <p><span>Frais de livraison</span><span>${eur(LIVRAISON)}</span></p>
      <p class="total"><span>Total</span><span>${eur(sub + LIVRAISON)}</span></p>
      <a class="btn wide" href="#/paiement">Passer la commande</a>
    </div>
  </div>`];
};

V.paiement = () => {
  if (!cartCount()) { location.hash = '#/panier'; return ['Paiement', '']; }
  const step = ui('step', 1), pay = ui('pay', 'Carte bancaire'), total = cartSub() + LIVRAISON;
  const stepper = `<ol class="stepper">${['Livraison', 'Paiement', 'Confirmation'].map((s, i) =>
    `<li class="${i + 1 <= step ? 'on' : ''}"><b>${i + 1}</b>${s}</li>`).join('')}</ol>`;
  if (step === 1) return ['Paiement sécurisé', `${stepper}
  <form class="form narrow" onsubmit="event.preventDefault(); setUi('step', 2)">
    <label>Nom complet<input required autocomplete="name" placeholder="Sophie Martin"></label>
    <label>E-mail<input required type="email" autocomplete="email" placeholder="sophie.martin@mail.com"></label>
    <label>Téléphone<input required type="tel" autocomplete="tel" placeholder="0692 00 00 00"></label>
    <label>Adresse<input required autocomplete="street-address" placeholder="12 rue des Flamboyants"></label>
    <div class="row2"><label>Code postal<input required pattern="974[0-9]{2}" placeholder="97400" title="Code postal de La Réunion (974xx)"></label>
    <label>Commune<select required><option value="">Choisir…</option>${['Saint-Denis', 'Saint-Paul', 'Saint-Pierre', 'Le Tampon', 'Saint-Benoît', 'Saint-André', 'Saint-Louis', 'Cilaos', 'Autre commune'].map(c => `<option>${c}</option>`).join('')}</select></label></div>
    <p class="muted small">${ic('truck')} Livraison partout à La Réunion : ${eur(LIVRAISON)}, 2 à 4 jours ouvrés.</p>
    <button class="btn wide">Continuer vers le paiement</button>
  </form>`];
  return ['Paiement sécurisé', `${stepper}
  <form class="narrow" onsubmit="event.preventDefault(); S.cart={}; store.set('cart',{}); S.ui.step=1; location.hash='#/confirmation'">
    ${[['Carte bancaire', '<span class="brands"><b class="visa">VISA</b><b class="mc"></b></span>'], ['PayPal', '<b class="pp">PayPal</b>'], ['Apple Pay', `<b class="ap">${ic('apple')} Pay</b>`]].map(([m, logo]) =>
      `<label class="payopt ${pay === m ? 'on' : ''}"><input type="radio" name="pay" ${pay === m ? 'checked' : ''} onchange="setUi('pay','${m}')"><span>${m}</span>${logo}</label>`).join('')}
    <p class="muted small">${ic('lock')} Paiement sécurisé par notre partenaire. Aucune donnée bancaire n’est stockée par Zerbaz Péi.</p>
    <div class="card sum"><p class="total"><span>Montant de la commande</span><span>${eur(total)}</span></p></div>
    <label class="check"><input type="checkbox" required> J’accepte les <a href="#/cgv">conditions générales de vente</a>.</label>
    <button class="btn wide">Payer maintenant</button>
    <p class="muted small center">${ic('shield-check')} Vos données sont protégées</p>
  </form>`];
};

V.confirmation = () => ['Commande confirmée', `
  <div class="narrow center confirm">
    <div class="ok">${ic('check')}</div>
    <h2>Commande confirmée !</h2>
    <p>Merci pour votre commande.<br>Un e-mail de confirmation vous a été envoyé.</p>
    <div class="card"><strong>Numéro de commande</strong><p class="big">#ZP20261017</p></div>
    <a class="btn wide" href="#/commandes">Voir mes commandes</a>
    <a class="btn ghost wide" href="#/">Retour à l’accueil</a>
  </div>`];

V.pros = () => {
  const t = ui('protab', 'Tisaneurs');
  return ['Tisaneurs & producteurs', `${tabs('protab', ['Tisaneurs', 'Producteurs'], t)}
  <div class="grid2">${PROS.filter(p => p.type === t).map(proCard).join('')}</div>`];
};

V.pro = id => {
  const p = byId(PROS, id); if (!p) return V[404]();
  const fav = S.favs.includes(id);
  return ['Profil tisaneur', `
  <div class="detail">
    <div class="rel">${pic(img(p.kw, 0, 1000), p.nom, 'detail-img')}
      <button class="fav ${fav ? 'on' : ''}" onclick="toggleFav('${id}')" aria-label="Favori">${ic('heart')}</button></div>
    <div>
      <div class="pl-head">${pic(img(p.kw, 0, 200), '', 'avatar')}<div><h2>${p.nom}</h2><small>${p.role}, ${p.ville}</small>${stars(p.note, p.avis)}</div></div>
      <div class="chips">${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>
      <p>${p.bio}</p>
    </div>
  </div>`];
};

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const JOURS = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
function calendar() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const off = ui('mOff', 0);
  const m = new Date(today.getFullYear(), today.getMonth() + off, 1);
  const first = (m.getDay() + 6) % 7, days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const sel = ui('day', null);
  let cells = '<span></span>'.repeat(first);
  for (let d = 1; d <= days; d++) {
    const dt = new Date(m.getFullYear(), m.getMonth(), d), key = dt.toISOString();
    const closed = dt < today || dt.getDay() === 0;
    cells += `<button type="button" ${closed ? 'disabled' : ''} class="${sel === key ? 'on' : ''}" onclick="setUi('day','${key}')">${d}</button>`;
  }
  return `<div class="cal card">
    <div class="cal-h"><button type="button" ${off ? '' : 'disabled'} onclick="setUi('mOff', ${off - 1})" aria-label="Mois précédent">${ic('chevron-left')}</button>
    <strong>${MOIS[m.getMonth()]} ${m.getFullYear()}</strong><button type="button" onclick="setUi('mOff', ${off + 1})" aria-label="Mois suivant">${ic('chevron-right')}</button></div>
    <div class="cal-g">${'LMMJVSD'.split('').map(x => `<i>${x}</i>`).join('')}${cells}</div></div>`;
}
function bookRdv(id) {
  const p = byId(PROS, id), d = new Date(ui('day')), presta = p.prestations[ui('presta', 0)];
  S.rdvs = [{ date: `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()].toLowerCase().slice(0, 4)}. ${d.getFullYear()} à ${ui('slot')}`, pro: id, presta: presta.nom, passe: false }, ...S.rdvs];
  store.set('rdvs', S.rdvs);
  Object.assign(S.ui, { day: null, slot: null, presta: 0 });
  toast('Rendez-vous confirmé'); location.hash = '#/mes-rdv';
}
V.rdv = id => {
  const p = byId(PROS, id); if (!p) return V[404]();
  const day = ui('day', null), slot = ui('slot', null);
  return ['Prendre rendez-vous', `
  <div class="split">
    <div>
      <div class="card contact-card">
        <div class="pl-head">${pic(img(p.kw, 0, 200), '', 'avatar')}<div><strong>${p.nom}</strong><small>${p.role}, ${p.ville}</small></div></div>
        <p>Une question avant de réserver ? Échangez directement avec ${p.nom.split(' ')[0]} pour préparer votre rendez-vous.</p>
        <a class="btn wide" href="#/chat/${id}">${ic('message-circle')} Prendre contact</a>
        <small class="online"><i></i>Répond généralement en moins d’une heure</small>
      </div>
    </div>
    <div>
      <h3>Sélectionner une date</h3>
      ${calendar()}
      <h3>Horaires disponibles</h3>
      ${day ? `<div class="slots">${['09:00', '10:30', '14:00', '16:00'].map(s => `<button class="${slot === s ? 'on' : ''}" onclick="setUi('slot','${s}')">${s}</button>`).join('')}</div>`
        : '<p class="muted small">Choisissez d’abord une date.</p>'}
      <button class="btn wide" ${day && slot ? '' : 'disabled'} onclick="bookRdv('${id}')">Confirmer le rendez-vous</button>
      <p class="muted small center">Le paiement se fait directement auprès du professionnel.</p>
    </div>
  </div>`];
};

/* ---------- Chat (simulé, réponses automatiques) ---------- */
S.chats = store.get('chats', {});
const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const chatOf = p => S.chats[p.id] ??= [{ me: false, h: now(),
  t: `Bonjour et bienvenue ! Je suis ${p.nom.split(' ')[0]}, ${p.role.toLowerCase()} à ${p.ville}. Comment puis-je vous aider ?` }];
function replyFor(p, t) {
  t = t.toLowerCase();
  if (/rdv|rendez|dispo|créneau/.test(t)) return `Avec plaisir ! J’ai encore des créneaux cette semaine. Vous pouvez réserver directement depuis l’agenda, je confirmerai ensuite.`;
  if (/prix|tarif|combien|coût/.test(t)) return `Voici mes prestations : ${p.prestations.map(x => `${x.nom} (${x.duree}, ${eur(x.prix)})`).join(' ; ')}. Le règlement se fait directement avec moi.`;
  if (/où|adresse|trouver|lieu/.test(t)) return `Je reçois à ${p.ville}. Je vous enverrai l’adresse exacte une fois le rendez-vous confirmé.`;
  return `Merci pour votre message ! Je vous réponds en détail très vite. N’hésitez pas à me dire ce que vous recherchez.`;
}
function sendMsg(id, text) {
  const p = byId(PROS, id); text = text.trim(); if (!text) return;
  chatOf(p).push({ me: true, t: text, h: now() });
  store.set('chats', S.chats); setUi('typing', id);
  setTimeout(() => {
    chatOf(p).push({ me: false, t: replyFor(p, text), h: now() });
    store.set('chats', S.chats); S.ui.typing = null;
    if (location.hash === '#/chat/' + id) render();
  }, 1500);
}
V.chat = id => {
  const p = byId(PROS, id); if (!p) return V[404]();
  const msgs = chatOf(p);
  return [p.nom, `
  <div class="chat">
    <div class="chat-head card">
      ${pic(img(p.kw, 0, 200), '', 'avatar')}
      <div><strong>${p.nom}</strong><small class="online"><i></i>En ligne</small></div>
      <a class="btn sm" href="#/rdv/${id}">${ic('calendar-days')}<span>Réserver</span></a>
    </div>
    <p class="chat-day">Aujourd’hui</p>
    <div class="msgs">
      ${msgs.map(m => `<div class="msg ${m.me ? 'me' : ''}">${m.me ? '' : pic(img(p.kw, 0, 120), '', 'avatar xs')}
        <div class="bubble">${esc(m.t)}<time>${m.h}${m.me ? ` ${ic('check-check')}` : ''}</time></div></div>`).join('')}
      ${ui('typing') === id ? `<div class="msg">${pic(img(p.kw, 0, 120), '', 'avatar xs')}<div class="bubble typing"><span></span><span></span><span></span></div></div>` : ''}
    </div>
    ${msgs.length < 3 ? `<div class="quick-replies">${['Je voudrais prendre rendez-vous', 'Quels sont vos tarifs ?', 'Où vous trouver ?']
      .map(q => `<button onclick="sendMsg('${id}', this.textContent)">${q}</button>`).join('')}</div>` : ''}
    <form class="chat-input" onsubmit="event.preventDefault(); const i=this.m; sendMsg('${id}', i.value); i.value=''; setTimeout(()=>document.querySelector('.chat-input input').focus())">
      <input name="m" placeholder="Écrire un message…" autocomplete="off" aria-label="Message">
      <button class="send" aria-label="Envoyer">${ic('send-horizontal')}</button>
    </form>
    <p class="muted small center">Messagerie de démonstration : les réponses sont simulées.</p>
  </div>`];
};

const soon = () => toast('Fonction non incluse dans la maquette');
V.profil = () => ['Mon profil', `
  <div class="narrow">
    <div class="center profile">${pic(img('sophie', 0, 300), 'Sophie Martin', 'avatar xl')}
      <strong>Sophie Martin</strong><small class="muted">sophie.martin@mail.com</small>
      <button class="btn ghost" onclick="soon()">Modifier mon profil</button></div>
    <div class="menu card">
      <a href="#/commandes">${ic('package')}Mes commandes${ic('chevron-right')}</a>
      <a href="#/mes-rdv">${ic('calendar-days')}Mes rendez-vous${ic('chevron-right')}</a>
      <a href="javascript:soon()">${ic('heart')}Mes favoris${ic('chevron-right')}</a>
      <a href="javascript:soon()">${ic('map-pin')}Mes adresses${ic('chevron-right')}</a>
      <a href="javascript:soon()">${ic('credit-card')}Mes moyens de paiement${ic('chevron-right')}</a>
      <a href="javascript:soon()">${ic('settings')}Paramètres${ic('chevron-right')}</a>
    </div>
  </div>`];

V.commandes = () => {
  const t = ui('ctab', 'En cours');
  const list = ORDERS.filter(o => o.fini === (t === 'Terminées'));
  return ['Mes commandes', `<div class="narrow">${tabs('ctab', ['En cours', 'Terminées'], t)}
  ${list.map(o => `<div class="card order">${pic(img(o.k, 0, 200), '', 'thumb sm')}
    <div><strong>Commande ${o.num}</strong><small>${o.date}, ${eur(o.total)}</small><span class="chip ${o.fini ? '' : 'yellow'}">${o.statut}</span></div>${ic('chevron-right')}</div>`).join('')
    || '<p class="muted center">Aucune commande.</p>'}</div>`];
};

V['mes-rdv'] = () => {
  const t = ui('rtab', 'À venir');
  const list = S.rdvs.filter(r => r.passe === (t === 'Passés'));
  return ['Mes rendez-vous', `<div class="narrow">${tabs('rtab', ['À venir', 'Passés'], t)}
  ${list.map(r => { const p = byId(PROS, r.pro); return `<a class="card order" href="#/pro/${p.id}">${pic(img(p.kw, 0, 200), '', 'avatar')}
    <div><strong>${r.date}</strong><small>${p.nom} — ${p.role}</small><small>${r.presta}, ${p.ville}</small>
    <span class="chip">${r.passe ? 'Terminé' : 'Confirmé'}</span></div>${ic('chevron-right')}</a>`; }).join('')
    || '<p class="muted center">Aucun rendez-vous.</p>'}</div>`];
};

V.plus = () => ['Plus', `
  <div class="narrow menu card">
    ${[['a-propos', 'info', 'À propos'], ['mentions', 'scale', 'Mentions légales'], ['confidentialite', 'shield-check', 'Politique de confidentialité']]
      .map(([s, i, l]) => `<a href="#/page/${s}">${ic(i)}${l}${ic('chevron-right')}</a>`).join('')}
    <a href="#/cgv">${ic('file-text')}Conditions générales de vente${ic('chevron-right')}</a>
    <a href="#/page/cookies">${ic('cookie')}Cookies et traceurs${ic('chevron-right')}</a>
    <a href="#/scanner-info">${ic('scan-line')}Informations sur le scanner${ic('chevron-right')}</a>
    <a href="#/contact">${ic('mail')}Nous contacter${ic('chevron-right')}</a>
    <a href="#/pros">${ic('users')}Tisaneurs & producteurs${ic('chevron-right')}</a>
    <a href="#/profil">${ic('user')}Mon profil${ic('chevron-right')}</a>
  </div>`];

V.page = slug => {
  const pg = PAGES[slug]; if (!pg) return V[404]();
  return [pg[0], `<div class="narrow prose"><div class="badge-ic">${ic(pg[1])}</div>${pg[2].map(([h, t]) => `<h3>${h}</h3><p>${t}</p>`).join('')}</div>`];
};

V.cgv = () => {
  const t = ui('cgvtab', 'Produits');
  return ['Conditions générales de vente', `<div class="narrow">${tabs('cgvtab', ['Produits', 'Rendez-vous'], t)}
  ${CGV[t].map(([h, b], i) => acc(`${i + 1}. ${h}`, b)).join('')}</div>`];
};

V.contact = () => ['Nous contacter', `
  <div class="split">
    <form class="form" onsubmit="event.preventDefault(); this.reset(); toast('Message envoyé, merci !')">
      <label>Nom<input required autocomplete="name"></label>
      <label>E-mail<input required type="email" autocomplete="email"></label>
      <label>Sujet<select><option>Question sur une commande</option><option>Rendez-vous</option><option>Devenir partenaire</option><option>Autre</option></select></label>
      <label>Message<textarea required rows="5"></textarea></label>
      <button class="btn wide">Envoyer</button>
    </form>
    <div class="card menu">
      <a href="mailto:contact@zerbazpei.re">${ic('mail')}contact@zerbazpei.re</a>
      <a href="tel:+262692000000">${ic('phone')}0692 00 00 00</a>
      <a>${ic('map-pin')}La Réunion</a>
    </div>
  </div>`];

V[404] = () => ['Page introuvable', `<div class="empty">${ic('leaf')}<p>Cette page n’existe pas.</p><a class="btn" href="#/">Retour à l’accueil</a></div>`];

/* ---------- Routeur ---------- */
let lastRoute = null;
function render() {
  const [route = '', arg] = location.hash.replace(/^#\/?/, '').split('/');
  const view = V[route] || V[404];
  const [title, body] = view(arg);
  const y = scrollY;
  $('#app').innerHTML = shell(route, title, body);
  document.title = route ? `${title} — Zerbaz Péi` : 'Zerbaz Péi — Les plantes de La Réunion, naturellement';
  window.lucide && lucide.createIcons();
  const key = route + '/' + arg;
  if (route === 'chat') scrollTo(0, document.body.scrollHeight);
  else if (key !== lastRoute) scrollTo(0, 0); else scrollTo(0, y);
  lastRoute = key;
}
addEventListener('hashchange', () => {
  if (!location.hash.startsWith('#/scanner')) Object.assign(S.ui, { scan: 'idle', preview: null });
  if (!location.hash.startsWith('#/paiement')) S.ui.step = 1;
  Object.keys(S.ui).filter(k => ['ptab', 'day', 'slot', 'presta', 'mOff'].includes(k) || k.startsWith('qty-')).forEach(k => delete S.ui[k]);
  render();
});
render();
