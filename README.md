# Zerbaz Péi — Maquette vitrine

Maquette cliquable de **Zerbaz Péi**, la plateforme dédiée aux plantes de La Réunion, aux tisanes locales et aux tisaneurs de l'île.

**En ligne : https://zerbaz-pei.ethaniel-gonthier.workers.dev**

C'est une maquette **front-only** : aucune API, aucun backend, aucune base de données. Toutes les données sont fictives et servent à la démonstration. Elle suit le cahier des charges et la maquette de référence du projet. Ces deux documents restent privés et ne sont pas dans ce dépôt.

## Fonctionnalités

| Rubrique | Ce que l'on peut faire |
| --- | --- |
| Accueil | Présentation, bouton « Scanner une plante », raccourcis, plantes du moment, sélection de tisanes, tisaneurs |
| Scanner | Prise de photo simulée ou import depuis la galerie, analyse animée, résultats avec niveau de confiance, avertissements de sécurité, astuces |
| Plantes | Recherche, filtres (fleurs, feuilles, racines, fruits), fiches botaniques avec onglets Description, Bienfaits, Usages et Précautions, encadré « Conseil santé » |
| Boutique | Catégories (tisanes, infusions, poudres), recherche, fiche produit, produit indisponible, favoris |
| Panier | Bouton flottant visible dans la boutique, quantités, suppression, frais de livraison (4,90 €) |
| Paiement | Étape livraison (formulaire, code postal 974xx), étape paiement (carte, PayPal, Apple Pay), acceptation des CGV, confirmation |
| Professionnels | Tisaneurs et producteurs, profils, prise de rendez-vous avec calendrier et créneaux |
| Chat | Bouton « Prendre contact », messagerie avec réponses automatiques simulées et réponses rapides |
| Profil | Mon profil, mes commandes, mes rendez-vous (accessibles par l'icône profil en haut à droite) |
| Informations | À propos, mentions légales, confidentialité, CGV (produits et rendez-vous), cookies, scanner, contact |

Le panier, les favoris, les rendez-vous et les conversations sont gardés dans le `localStorage` du navigateur de chaque visiteur.

## Historique des versions

1. **Maquette initiale** — tous les écrans de la maquette de référence, pages légales, données fictives, navigation mobile en bas et navigation PC en haut.
2. **Photos réelles** — photos des vraies espèces (Wikimedia Commons) et photos de tisanes et portraits (Unsplash).
3. **En-tête et couleurs** — « Plus » quitte la barre du bas pour une icône profil en haut à droite, fond jaune plus prononcé.
4. **Panier flottant** — le panier quitte l'en-tête et devient un bouton rond en bas à droite, seulement dans la boutique.
5. **Prise de contact** — le choix de prestation est remplacé par un bouton « Prendre contact » qui ouvre un chat.
6. **Profil tisaneur et santé** — prestations retirées du profil, onglet « Bienfaits » et encadré « Conseil santé » sur chaque plante.
7. **Design moins générique** — accueil tablette et PC en planche d'herbier, raccourcis en vrais liens (fin des pastilles qui ressemblaient à des boutons), polices Caprasimo et Karla, séparateurs et ombres simplifiés.
8. **Accueil téléphone** — retour de la version téléphone appréciée : photo de montagne plein cadre et trois tuiles.

## Lancer en local

```bash
cd public
python3 -m http.server 8765
```

Puis ouvrir http://localhost:8765. Ouvrir `public/index.html` directement dans le navigateur fonctionne aussi. Les photos et les polices demandent une connexion internet.

## Mettre en ligne

Le site est servi par Cloudflare Workers en fichiers statiques (voir `wrangler.jsonc`). Seul le dossier `public/` est publié.

```bash
npx wrangler@4 login    # une seule fois
npx wrangler@4 deploy
```

## Structure

```
public/
  index.html   point d'entrée, polices, icônes Lucide
  styles.css   charte (jaune pastel, vert forêt, marron clair), responsive téléphone, tablette, PC
  data.js      données fictives : plantes, bienfaits, produits, professionnels, commandes, pages légales
  app.js       routeur par hash (#/boutique, #/plante/hibiscus…), écrans, panier, chat
wrangler.jsonc configuration Cloudflare
```

## À savoir avant une vraie mise en production

- Les textes légaux contiennent des `[à compléter]` (SIRET, hébergeur, responsable).
- Les fiches plantes, bienfaits et conseils santé doivent être vérifiés par un professionnel de santé et des sources botaniques.
- Le scanner, le paiement, les e-mails et le chat sont simulés : il faudra brancher une API d'identification, un prestataire de paiement et une vraie messagerie.
