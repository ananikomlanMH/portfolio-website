# Anani Komlan — Portfolio

Portfolio de Software Engineer : Backend, Architecture logicielle et Open Source.

Site public : https://portfolio.ananikmh17.workers.dev/

## Technologies

Site statique en HTML, CSS et JavaScript. Les styles, scripts, polices et images sont disponibles dans `assets/`. Aucune compilation ni base de données n'est nécessaire pour afficher le site.

## Structure

```text
index.html          Page principale et métadonnées SEO
assets/css/         Styles, responsive et thèmes
assets/js/          Interactions et changement de thème
assets/images/      Logos, portraits, projets et favicons
assets/fonts/       Polices locales
site.webmanifest    Métadonnées de l'application web
robots.txt          Instructions pour les robots
sitemap.xml         URL publique du site
```

## Lancement local

Depuis la racine du projet, avec Python 3 installé :

```sh
python -m http.server 8000
```

Ouvrir http://localhost:8000. Sur Windows, `py -m http.server 8000` peut remplacer la commande précédente.

## Dépôt Git

Créer un dépôt distant vide, puis exécuter les commandes suivantes en remplaçant `URL_DU_DEPOT` par son URL :

```sh
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin URL_DU_DEPOT
git push -u origin main
```

Le `.gitignore` exclut les paramètres IDE, dépendances, caches, fichiers temporaires et secrets locaux. Les fichiers de `assets/` doivent rester versionnés.

## Déploiement sur Cloudflare Workers

Le site utilise Workers Static Assets. Node.js et npm sont nécessaires pour les commandes de déploiement.

Préparer un dossier `dist/` contenant uniquement les fichiers publics :

```sh
node -e "const fs = require('node:fs'); fs.mkdirSync('dist', {recursive:true}); for (const f of ['index.html','assets','robots.txt','sitemap.xml','site.webmanifest']) fs.cpSync(f, 'dist/' + f, {recursive:true});"
```

Authentifier Wrangler et déployer dans le compte Cloudflare propriétaire du site :

```sh
npx wrangler login
npx wrangler deploy --name portfolio --assets ./dist
```

Le nom `portfolio` correspond au Worker de l'URL publique. Le sous-domaine `ananikmh17.workers.dev` dépend du compte Cloudflare utilisé.

Pour un déploiement automatique depuis Git, connecter le dépôt au Worker dans Cloudflare et configurer :

- Branche de production : `main`.
- Répertoire racine : racine du dépôt.
- Commande de build : la commande `node -e` ci-dessus.
- Commande de déploiement : `npx wrangler deploy --name portfolio --assets ./dist`.

Le dossier `dist/` est ignoré par Git et doit être régénéré pour chaque déploiement. Utiliser un dossier `dist/` neuf si des fichiers publics ont été supprimés ou renommés. Ne pas publier la racine du dépôt comme répertoire d'assets.

Documentation : [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## Avant publication

- Vérifier les affichages desktop, tablette et mobile, ainsi que les thèmes clair et sombre.
- Tester le menu, les projets et les liens de contact.
- En cas de changement de domaine, mettre à jour la canonical, Open Graph et le JSON-LD dans `index.html`, puis `robots.txt` et `sitemap.xml`.
- Après déploiement, vérifier les URL `/robots.txt`, `/sitemap.xml`, `/site.webmanifest` et `/assets/images/social-preview.png`.

Le manifeste décrit l'application ; il n'implémente pas de fonctionnement hors ligne.
