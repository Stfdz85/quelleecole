# QuelleEcole.fr — V2

Guide scolaire indépendant de Lille Métropole.
255 établissements · IPS · Valeur ajoutée · Carte scolaire · Évaluations 6ème

## Déploiement

### Option 1 — Via GitHub + Vercel (recommandé, workflow actuel)

1. **Remplacer le contenu du repo GitHub** par celui de ce dossier :
   - Soit via l'interface GitHub : glisser-déposer tous les fichiers (sauf `.git`)
   - Soit via Git : `git pull`, puis écraser les fichiers et commit

2. **Vercel redéploie automatiquement** quand tu push sur la branche principale

3. **Premier déploiement** : Vercel détecte automatiquement Vite grâce au `vercel.json`

### Option 2 — Déploiement manuel

```bash
npm install
npm run build
# Le dossier dist/ contient le site prêt à uploader
```

## Ce qui est inclus

### Vercel Analytics + Speed Insights
Branchés dans `src/main.jsx` — pas besoin de config supplémentaire, Vercel détecte.

### SEO complet
- `index.html` avec JSON-LD (WebSite, Dataset, FAQPage), Open Graph, Twitter Card, meta geo
- `public/sitemap.xml` avec date 2026-04-18
- `public/robots.txt` avec 25+ crawlers AI/LLM autorisés
- `public/llms.txt` (standard émergent pour les LLM)
- `<noscript>` fallback avec contenu textuel pour les crawlers sans JS

### Crawlers IA autorisés
GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, Google-Extended, PerplexityBot, CCBot, Meta-ExternalAgent, MistralAI-User, DeepSeekBot, Applebot-Extended, Kagibot, Bytespider, YouBot, Cohere-ai, Amazonbot, Diffbot, et les crawlers traditionnels.

### Headers de sécurité
Via `vercel.json` : X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy + cache long pour les assets immutables.

## Stack

- **React 18** + **Vite 5**
- **Leaflet** pour la carte (via CDN, chargé dans index.html)
- **Geist + Geist Mono** pour la typo (Google Fonts)
- **@vercel/analytics** + **@vercel/speed-insights**

## Fichiers sensibles à ne pas écraser

Si tu as fait des modifs en ligne sur Vercel ou GitHub, vérifie que ces fichiers correspondent à ce que tu veux :
- `public/og-image.png` (image preview réseaux sociaux)
- `public/logo.svg` (favicon + icône)

Ces fichiers ont été copiés depuis ta V1 telle quelle.

## Après déploiement

1. Tester `https://quelleecole.fr/robots.txt` — doit lister les crawlers AI
2. Tester `https://quelleecole.fr/llms.txt` — doit s'ouvrir en text/plain
3. Tester `https://quelleecole.fr/sitemap.xml` — avec la date du jour
4. Vérifier dans **Vercel Dashboard → Analytics** que le tracking remonte
5. **Google Search Console** : soumettre à nouveau le sitemap (toujours pointer vers `/sitemap.xml`)
6. Sur le site : vérifier que le **tour guidé** se lance bien au premier chargement (private/incognito pour reset le sessionStorage)

## Tour guidé

Se lance automatiquement au premier chargement (après 1,4s).
`sessionStorage.qe_tour_seen = '1'` empêche la relance pendant la session.
Bouton "↻ Revoir le tour" flotte en haut après la première visite.

## Données

Les 255 établissements sont **inline** dans `src/App.jsx` (pas de backend nécessaire).
Source : DEPP — Ministère de l'Éducation nationale, open data 2024.

---

Stéphane et Mylène · quelleecole.fr@gmail.com
