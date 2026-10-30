# Ventre tranquille

Application web personnelle pour suivre un régime pauvre en FODMAP :

- **Guide** : environ 180 aliments classés OK / selon la portion / à éviter, avec les familles de
  FODMAP concernées. Chaque fiche peut être corrigée selon sa propre tolérance, et on peut
  ajouter ses aliments.
- **Recettes** : 12 recettes pauvres en FODMAP, favoris et liste de courses.
- **Journal** : repas (avec les aliments du guide), symptômes notés sur 10, selles (échelle de
  Bristol), stress et sommeil.
- **Bilan** : courbe des symptômes, répartition Bristol, et pistes d’aliments ou de familles
  associés à plus de symptômes 2 à 24 h après le repas.
- **Parcours** : les trois phases (élimination, réintroduction, personnalisation) et le suivi
  des tests de réintroduction famille par famille. Les résultats s’affichent ensuite dans le guide.

Les informations sur les aliments sont des indications générales issues des connaissances
publiques sur les FODMAP, pas des mesures de laboratoire. Elles ne remplacent pas l’avis d’un
médecin ou d’un diététicien.

## Données

Tout est stocké dans le navigateur de l’appareil (localStorage). Rien n’est envoyé sur un
serveur. Le Bilan permet de sauvegarder et restaurer un fichier JSON, et d’exporter le journal
en CSV (lisible dans Excel).

## Lancer

Aucune dépendance, aucune compilation : ce sont des fichiers statiques.

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Pour l’installer sur un téléphone, il faut la publier en HTTPS (GitHub Pages, Netlify ou
Cloudflare Pages), l’ouvrir puis choisir « Ajouter à l’écran d’accueil ». Elle fonctionne
ensuite hors ligne.

Après une modification des fichiers, incrémenter `VERSION` dans `sw.js`.
