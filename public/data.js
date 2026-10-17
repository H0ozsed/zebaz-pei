// Données fictives de démonstration — aucune API, aucun backend.
// Photos : Wikimedia Commons (espèces réelles) et Unsplash (tisanes, portraits).
const wm = file => w => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;
const us = id => w => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;
const PHOTOS = {
  hibiscus: wm('Hibiscus_rosa-sinensis_22.jpg'),
  syriacus: wm('Hibiscus_syriacus_colore_esterno_viola_e_interno_fucsia.jpg'),
  margose: wm('Momordica_charantia_22052014.jpg'),
  chandelle: wm('Dracaena_reflexa.JPG'),
  ayapana: wm('Ayapana_triplinervis_01.jpg'),
  vetiver: wm('Vetiveria_zizanoides_dsc07810.jpg'),
  citronnelle: wm('Cymbopogon_citratus.jpg'),
  goyavier: wm('Psidium_cattleyanum_f._lucidum.jpg'),
  fleurjaune: wm('Hypericum_lanceolatum.JPG'),
  salazie: wm('Cirque_Salazie_Reunion_0.jpg'),
  tea1: us('1564890369478-c89ca6d9cde9'),
  tea2: us('1576092768241-dec231879fc3'),
  tea3: us('1563822249548-9a72b6353cd1'),
  tea4: us('1594631252845-29fc4cc8cde9'),
  marie: us('1531123897727-8f129e1688ce'),
  josette: us('1544005313-94ddf0286df2'),
  jp: us('1507003211169-0a1dd7228f2d'),
  lucas: us('1506794778202-cad84cf45f1d'),
  sophie: us('1438761681033-6461ffad8d80')
};
const img = (key, _n, w = 800) => PHOTOS[key](w);

const PLANTS = [
  { id: 'hibiscus', nom: 'Hibiscus', sci: 'Hibiscus rosa-sinensis', cat: 'Fleurs', court: 'Plante ornementale', tags: ['Plante ornementale', 'Fleurs'],
    autres: 'Rose de Chine, choublak', habitat: 'Zones tropicales, jardins de basse altitude', parties: 'Fleurs', usages: 'Infusions, soins capillaires',
    precautions: 'Peut provoquer des allergies. Déconseillé pendant la grossesse sans avis médical.', kw: 'hibiscus', n: 11, produits: ['relaxation'],
    desc: "L’hibiscus est un arbuste tropical aux grandes fleurs colorées. Très présent à La Réunion, il est apprécié pour sa beauté et ses propriétés traditionnelles.",
    usagesTxt: "Les fleurs sont traditionnellement utilisées en infusion et dans les soins des cheveux. Ces usages relèvent de la tradition et ne remplacent pas un avis médical." },
  { id: 'margose', nom: 'Margose', sci: 'Momordica charantia', cat: 'Fruits', court: 'Plante médicinale', tags: ['Potagère', 'Fruits'],
    autres: 'Concombre amer, pok-pok', habitat: 'Cultures et jardins créoles, basse altitude', parties: 'Fruits, feuilles', usages: 'Cuisine, tisanes lontan',
    precautions: 'Amertume marquée. Déconseillée aux femmes enceintes et en cas de traitement du diabète sans avis médical.', kw: 'margose', n: 21, produits: ['poudre-margose'],
    desc: "Liane grimpante aux fruits verts et bosselés, très présente dans la cuisine réunionnaise (rougail, achards).",
    usagesTxt: "Consommée en cuisine et, traditionnellement, en tisane amère. Usage traditionnel documenté, à confirmer auprès d’un professionnel." },
  { id: 'bois-de-chandelle', nom: 'Bois de chandelle', sci: 'Dracaena reflexa', cat: 'Feuilles', court: 'Plante indigène', tags: ['Indigène', 'Feuilles'],
    autres: 'Bois de chandelle', habitat: 'Forêts humides de moyenne altitude', parties: 'Feuilles', usages: 'Pharmacopée traditionnelle',
    precautions: 'Espèce indigène à préserver : ne pas prélever en milieu naturel.', kw: 'chandelle', n: 31, produits: [],
    desc: "Arbuste indigène des Mascareignes aux feuilles étroites disposées en rosettes. Son bois brûlait autrefois comme une chandelle.",
    usagesTxt: "Cité dans la pharmacopée traditionnelle de La Réunion. Les informations doivent être vérifiées avant tout usage." },
  { id: 'ayapana', nom: 'Ayapana', sci: 'Ayapana triplinervis', cat: 'Feuilles', court: 'Tisane lontan', tags: ['Aromatique', 'Feuilles'],
    autres: 'Zerbaz ayapana', habitat: 'Jardins et cours créoles', parties: 'Feuilles', usages: 'Infusions digestives',
    precautions: 'Usage modéré. Demander conseil en cas de grossesse ou d’allaitement.', kw: 'ayapana', n: 41, produits: ['digestion', 'infusion-ayapana'],
    desc: "Petite plante herbacée aux tiges rougeâtres, cultivée dans de nombreux jardins réunionnais pour ses feuilles parfumées.",
    usagesTxt: "Infusée traditionnellement après les repas. Usage traditionnel, sans valeur de prescription." },
  { id: 'vetiver', nom: 'Vétiver', sci: 'Chrysopogon zizanioides', cat: 'Racines', court: 'Parfum & bien-être', tags: ['Aromatique', 'Racines'],
    autres: 'Vétyver', habitat: 'Cultures des Hauts du Sud', parties: 'Racines', usages: 'Parfumerie, sachets',
    precautions: 'Huile essentielle : ne pas ingérer, tenir hors de portée des enfants.', kw: 'vetiver', n: 51, produits: [],
    desc: "Grande graminée dont les racines odorantes ont fait la renommée de La Réunion en parfumerie.",
    usagesTxt: "Racines utilisées en parfumerie et en sachets pour parfumer le linge." },
  { id: 'citronnelle', nom: 'Citronnelle', sci: 'Cymbopogon citratus', cat: 'Feuilles', court: 'Apaisante', tags: ['Aromatique', 'Feuilles'],
    autres: 'Verveine des Indes', habitat: 'Jardins, basse et moyenne altitude', parties: 'Feuilles', usages: 'Infusions, cuisine',
    precautions: 'Peut irriter les peaux sensibles en usage externe.', kw: 'citronnelle', n: 61, produits: ['sommeil', 'infusion-citronnelle'],
    desc: "Graminée au parfum citronné, incontournable des tisanes du soir et de la cuisine créole.",
    usagesTxt: "Feuilles infusées traditionnellement le soir. Usage traditionnel documenté." },
  { id: 'goyavier', nom: 'Goyavier', sci: 'Psidium cattleyanum', cat: 'Fruits', court: 'Antioxydant', tags: ['Fruitier', 'Fruits'],
    autres: 'Goyave de Chine', habitat: 'Forêts et bords de routes des Hauts', parties: 'Fruits, feuilles', usages: 'Confitures, jus, tisanes',
    precautions: 'Espèce envahissante : ne pas planter en milieu naturel.', kw: 'goyavier', n: 71, produits: ['immunite', 'poudre-goyavier'],
    desc: "Arbuste aux petits fruits rouges très appréciés en confiture. Sa cueillette est une tradition réunionnaise.",
    usagesTxt: "Fruits consommés frais ou en confiture, feuilles parfois infusées." },
  { id: 'fleur-jaune', nom: 'Fleur jaune', sci: 'Hypericum lanceolatum', cat: 'Fleurs', court: 'Endémique', tags: ['Endémique', 'Fleurs'], danger: true,
    autres: 'Fleur jaune des Hauts', habitat: 'Hauts de l’île, au-dessus de 1 000 m', parties: 'Sommités fleuries', usages: 'Pharmacopée traditionnelle',
    precautions: 'Plante active : interactions médicamenteuses possibles. Ne jamais consommer sans avis d’un professionnel de santé.', kw: 'fleurjaune', n: 81, produits: [],
    desc: "Arbuste endémique des Mascareignes aux fleurs jaune vif, emblématique des paysages d’altitude.",
    usagesTxt: "Citée dans la pharmacopée réunionnaise. Plante à risque : toute utilisation nécessite un avis professionnel." }
];

// Bienfaits et conseil santé : contenus prudents, à faire valider par un professionnel de santé.
const SANTE = {
  hibiscus: [['Riche en antioxydants (anthocyanes)', 'Infusion rafraîchissante et sans caféine', 'Traditionnellement utilisé pour le soin des cheveux'],
    'En cas de traitement contre l’hypertension ou de grossesse, demandez l’avis de votre médecin avant une consommation régulière.'],
  margose: [['Riche en vitamine C et en fibres', 'Étudiée pour son effet sur la glycémie', 'Traditionnellement utilisée pour la digestion'],
    'Elle peut faire baisser la glycémie : si vous êtes diabétique et sous traitement, parlez-en à votre médecin. Déconseillée pendant la grossesse.'],
  'bois-de-chandelle': [['Tisane dépurative de la pharmacopée réunionnaise', 'Données scientifiques encore limitées'],
    'Faute d’études suffisantes, n’en faites pas un usage prolongé sans avis médical.'],
  ayapana: [['Infusion traditionnelle de confort digestif', 'Goût doux, sans caféine', 'Inscrite à la Pharmacopée française'],
    'Privilégiez un usage occasionnel. Demandez conseil en cas de grossesse, d’allaitement ou pour un enfant.'],
  vetiver: [['Parfum relaxant en aromathérapie (usage externe)', 'Racines utilisées pour parfumer le linge et éloigner les mites'],
    'L’huile essentielle s’utilise uniquement en usage externe et toujours diluée. À éviter chez la femme enceinte et l’enfant.'],
  citronnelle: [['Infusion apaisante, propice à la détente le soir', 'Confort digestif après le repas', 'Riche en composés aromatiques (citral)'],
    'Sans risque particulier aux doses habituelles d’infusion. Évitez les huiles essentielles par voie orale.'],
  goyavier: [['Fruits très riches en vitamine C', 'Source d’antioxydants et de fibres', 'Feuilles traditionnellement infusées pour la digestion'],
    'Les fruits se consomment sans restriction particulière. Pour les feuilles en infusion, restez sur un usage ponctuel.'],
  'fleur-jaune': [['Plante patrimoniale, emblème des Hauts', 'Usage traditionnel uniquement : bienfaits non établis'],
    'Comme le millepertuis, elle peut interagir avec de nombreux médicaments (pilule, anticoagulants, antidépresseurs). Ne la consommez jamais sans avis médical.']
};
PLANTS.forEach(p => [p.bienfaits, p.conseil] = SANTE[p.id]);

const PRODUCTS = [
  { id: 'sommeil', nom: 'Tisane Sommeil Réunion', cat: 'Tisanes', poids: '50 g', prix: 15, note: 4.8, avis: 120, k: 'tea1', dispo: true,
    desc: 'Une infusion douce et apaisante, élaborée avec des plantes locales de La Réunion.', compo: 'Mélisse, verveine, fleur de ti, passiflore' },
  { id: 'digestion', nom: 'Tisane Digestion', cat: 'Tisanes', poids: '50 g', prix: 14, note: 4.7, avis: 84, k: 'tea2', dispo: true,
    desc: 'Un mélange traditionnel à déguster après le repas.', compo: 'Ayapana, citronnelle, menthe, fenouil' },
  { id: 'immunite', nom: 'Tisane Immunité', cat: 'Tisanes', poids: '50 g', prix: 16, note: 4.6, avis: 61, k: 'tea3', dispo: true,
    desc: 'Un mélange fruité et épicé pour les journées fraîches des Hauts.', compo: 'Feuilles de goyavier, gingembre, citronnelle, cannelle' },
  { id: 'relaxation', nom: 'Tisane Relaxation', cat: 'Tisanes', poids: '50 g', prix: 14.5, note: 4.9, avis: 47, k: 'tea4', dispo: true,
    desc: 'Une infusion florale aux notes d’hibiscus, à savourer chaude ou glacée.', compo: 'Hibiscus, camomille, tilleul, vanille Bourbon' },
  { id: 'infusion-citronnelle', nom: 'Infusion Citronnelle', cat: 'Infusions', poids: '40 g', prix: 9.9, note: 4.5, avis: 33, k: 'citronnelle', dispo: true,
    desc: 'Citronnelle séchée cultivée sans pesticides dans l’Est.', compo: 'Citronnelle 100 %' },
  { id: 'infusion-ayapana', nom: 'Infusion Ayapana', cat: 'Infusions', poids: '30 g', prix: 11.5, note: 4.7, avis: 19, k: 'ayapana', dispo: false,
    desc: 'Feuilles d’ayapana séchées à l’ombre, récolte artisanale.', compo: 'Ayapana 100 %' },
  { id: 'poudre-margose', nom: 'Poudre de Margose', cat: 'Poudres', poids: '100 g', prix: 12, note: 4.3, avis: 12, k: 'margose', dispo: true,
    desc: 'Margose séchée et finement moulue, pour la cuisine.', compo: 'Margose 100 %' },
  { id: 'poudre-goyavier', nom: 'Poudre de Goyavier', cat: 'Poudres', poids: '80 g', prix: 13.5, note: 4.6, avis: 22, k: 'goyavier', dispo: true,
    desc: 'Fruits de goyavier séchés et réduits en poudre.', compo: 'Goyavier 100 %' }
];
PRODUCTS.forEach(p => p.img = img(p.k));

const PROS = [
  { id: 'marie', nom: 'Marie Lelong', role: 'Tisaneuse locale', type: 'Tisaneurs', ville: 'Saint-Benoît', note: 4.8, avis: 56, n: 201, kw: 'marie',
    tags: ['Tisanes médicinales', 'Plantes locales'],
    bio: 'Passionnée par les plantes de La Réunion, Marie cultive et transforme des plantes locales de manière artisanale. Elle propose des tisanes élaborées avec respect et partage son savoir-faire lors de rencontres et d’ateliers.',
    prestations: [{ nom: 'Conseil en phytothérapie', duree: '45 min', prix: 40 }, { nom: 'Atelier tisanes lontan', duree: '2 h', prix: 35 }] },
  { id: 'josette', nom: 'Josette Payet', role: 'Tisaneuse', type: 'Tisaneurs', ville: 'Saint-Paul', note: 4.9, avis: 38, n: 202, kw: 'josette',
    tags: ['Zerbaz lontan', 'Transmission'],
    bio: 'Héritière d’un savoir familial, Josette transmet les usages traditionnels des plantes de l’Ouest.',
    prestations: [{ nom: 'Consultation tisanes', duree: '30 min', prix: 30 }] },
  { id: 'jean-pierre', nom: 'Jean-Pierre Hoarau', role: 'Producteur de plantes', type: 'Producteurs', ville: 'Le Tampon', note: 4.7, avis: 41, n: 203, kw: 'jp',
    tags: ['Plantes aromatiques', 'Biodiversité'],
    bio: 'Jean-Pierre cultive des plantes aromatiques et médicinales dans les Hauts du Sud, en agriculture raisonnée.',
    prestations: [{ nom: 'Visite de culture', duree: '1 h 30', prix: 20 }] },
  { id: 'lucas', nom: 'Lucas Grondin', role: 'Producteur', type: 'Producteurs', ville: 'Cilaos', note: 4.6, avis: 17, n: 204, kw: 'lucas',
    tags: ['Plantes endémiques', 'Pépinière'],
    bio: 'Pépiniériste à Cilaos, Lucas multiplie des plantes indigènes pour les jardins réunionnais.',
    prestations: [{ nom: 'Visite de la pépinière', duree: '1 h', prix: 15 }] }
];

const ORDERS = [
  { num: '#ZP20261015', date: '15 oct. 2026', total: 33.9, statut: 'En préparation', fini: false, k: 'tea1' },
  { num: '#ZP20260928', date: '28 sept. 2026', total: 24.5, statut: 'Livrée', fini: true, k: 'tea3' },
  { num: '#ZP20260912', date: '12 sept. 2026', total: 18.9, statut: 'Livrée', fini: true, k: 'citronnelle' }
];

const RDVS = [
  { date: 'Mar. 20 oct. 2026 à 10:30', pro: 'marie', presta: 'Conseil en phytothérapie', passe: false },
  { date: 'Sam. 24 oct. 2026 à 14:00', pro: 'jean-pierre', presta: 'Visite de culture', passe: false },
  { date: 'Ven. 18 sept. 2026 à 09:00', pro: 'josette', presta: 'Consultation tisanes', passe: true }
];

const LIVRAISON = 4.9;

const PAGES = {
  'a-propos': ['À propos', 'info', [
    ['Notre projet', 'Zerbaz Péi est une plateforme dédiée aux plantes de La Réunion, aux tisanes traditionnelles et à la découverte botanique.'],
    ['Nos valeurs', 'Découverte botanique, transmission des savoir-faire, commerce local, mise en relation et valorisation du patrimoine réunionnais.'],
    ['Qui sommes-nous ?', 'Zerbaz Péi est exploitée sous le statut de micro-entreprise. [Porteur du projet à compléter]']]],
  'mentions': ['Mentions légales', 'scale', [
    ['Éditeur', 'Zerbaz Péi — Micro-entreprise. SIRET : [à compléter]. Adresse : [à compléter], La Réunion.'],
    ['Directeur de la publication', '[À compléter]'],
    ['Hébergement', '[Nom, adresse et contact de l’hébergeur à compléter]'],
    ['Propriété intellectuelle', 'L’ensemble des contenus (textes, photographies, logo) est protégé. Toute reproduction sans autorisation est interdite.']]],
  'confidentialite': ['Politique de confidentialité', 'shield-check', [
    ['Données collectées', 'Coordonnées de livraison, informations de commande et de rendez-vous, photographies envoyées au scanner.'],
    ['Photographies du scanner', 'Les images sont transmises au service d’identification puis supprimées après analyse. Elles ne sont pas conservées plus longtemps que nécessaire.'],
    ['Paiements', 'Les données bancaires sont traitées exclusivement par notre prestataire de paiement. Zerbaz Péi ne stocke aucun numéro de carte.'],
    ['Vos droits', 'Vous disposez d’un droit d’accès, de rectification et de suppression de vos données (RGPD). Contact : [e-mail à compléter].']]],
  'cookies': ['Cookies et traceurs', 'cookie', [
    ['Cookies nécessaires', 'Indispensables au fonctionnement du panier et à la sécurité. Ils ne peuvent pas être désactivés.'],
    ['Mesure d’audience', 'Déposés uniquement avec votre consentement.'],
    ['Gérer vos choix', 'Vous pouvez modifier vos préférences à tout moment depuis cette page.']]],
  'scanner': ['Informations sur le scanner', 'scan-line', [
    ['Un outil d’aide', 'Le scanner propose une identification à l’aide d’un service d’intelligence artificielle. Il ne garantit pas l’identité d’une plante.'],
    ['Niveau de confiance', 'Le pourcentage affiché est indicatif et ne constitue pas une garantie scientifique.'],
    ['Sécurité', 'Ne consommez jamais une plante sur la seule base d’un résultat de scan. Certaines espèces toxiques ressemblent à des plantes comestibles.']]]
};

const CGV = {
  Produits: [['Objet', 'Les présentes CGV régissent la vente des tisanes et produits commercialisés par Zerbaz Péi.'],
    ['Produits et services', 'Les caractéristiques essentielles figurent sur chaque fiche produit.'],
    ['Prix', 'Les prix sont indiqués en euros TTC, hors frais de livraison précisés avant validation.'],
    ['Commande', 'La commande est validée après acceptation des CGV et confirmation du paiement.'],
    ['Paiement', 'Le paiement s’effectue en ligne par carte bancaire, PayPal ou Apple Pay via un prestataire sécurisé.'],
    ['Livraison', 'Livraison sur l’ensemble de l’île de La Réunion. Frais : 4,90 €.'],
    ['Droit de rétractation', 'Vous disposez de 14 jours pour exercer votre droit de rétractation, selon les règles applicables aux produits.'],
    ['Garanties', 'Garantie légale de conformité et garantie des vices cachés.'],
    ['Réclamations', 'Toute réclamation peut être adressée via la page « Nous contacter ».']],
  'Rendez-vous': [['Objet', 'Zerbaz Péi met en relation les utilisateurs avec des professionnels référencés.'],
    ['Paiement', 'Le règlement des consultations se fait directement auprès du professionnel. Zerbaz Péi n’encaisse aucun paiement de consultation.'],
    ['Annulation', 'Tout rendez-vous peut être annulé jusqu’à 24 h avant son horaire.'],
    ['Responsabilité', 'Les prestations relèvent de la seule responsabilité du professionnel. Elles ne remplacent pas un avis médical.']]
};
