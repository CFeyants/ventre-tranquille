// Données de référence — indicatives, issues des connaissances publiques générales sur
// les FODMAP. Ce ne sont pas des mesures de laboratoire : les teneurs varient selon la
// variété, la maturité et la portion. L'utilisateur peut corriger chaque fiche.

export const FAMILIES = {
  fructanes: { label: 'Fructanes', hint: 'blé, seigle, orge, ail, oignon, poireau' },
  gos: { label: 'GOS', hint: 'légumineuses, noix de cajou, pistaches' },
  lactose: { label: 'Lactose', hint: 'lait, yaourt, fromages frais' },
  fructose: { label: 'Fructose', hint: 'miel, mangue, pomme, asperge' },
  sorbitol: { label: 'Sorbitol', hint: 'fruits à noyau, avocat, édulcorants' },
  mannitol: { label: 'Mannitol', hint: 'champignons, chou-fleur, patate douce' },
};

export const STATUS = {
  ok: { label: 'Pauvre en FODMAP', short: 'OK' },
  limite: { label: 'Selon la portion', short: 'Portion' },
  eviter: { label: 'Riche en FODMAP', short: 'Éviter' },
};

export const CATEGORIES = [
  'Légumes', 'Fruits', 'Céréales & féculents', 'Protéines', 'Légumineuses',
  'Produits laitiers & alternatives', 'Noix & graines', 'Sucres & douceurs',
  'Boissons', 'Condiments & assaisonnements',
];

// [nom, catégorie, statut, familles concernées, note]
const RAW = [
  // Légumes
  ['Carotte', 'Légumes', 'ok', [], ''],
  ['Courgette', 'Légumes', 'limite', ['fructanes'], 'Bien tolérée en petite portion (environ 65 g).'],
  ['Concombre', 'Légumes', 'ok', [], ''],
  ['Aubergine', 'Légumes', 'eviter', [], 'D’autres sources la tolèrent en petite portion.'],
  ['Poivron rouge', 'Légumes', 'eviter', [], 'D’autres sources le tolèrent : à tester en réintroduction.'],
  ['Poivron vert', 'Légumes', 'eviter', [], ''],
  ['Tomate', 'Légumes', 'ok', [], 'Tomates cerises et séchées : portions plus petites.'],
  ['Épinards', 'Légumes', 'ok', [], ''],
  ['Laitue, roquette, mâche', 'Légumes', 'ok', [], ''],
  ['Endive', 'Légumes', 'ok', [], ''],
  ['Pomme de terre', 'Légumes', 'ok', [], ''],
  ['Patate douce', 'Légumes', 'limite', ['mannitol'], 'À favoriser selon la fiche SNFCP, en restant vers ½ tasse (75 g) par repas.'],
  ['Haricots verts', 'Légumes', 'ok', [], 'Environ 15 haricots par portion.'],
  ['Panais', 'Légumes', 'ok', [], ''],
  ['Navet', 'Légumes', 'ok', [], ''],
  ['Radis', 'Légumes', 'ok', [], ''],
  ['Chou kale', 'Légumes', 'ok', [], ''],
  ['Pak choï / bok choy', 'Légumes', 'ok', [], ''],
  ['Chou blanc', 'Légumes', 'limite', ['sorbitol'], 'Petite portion (environ 75 g).'],
  ['Chou rouge', 'Légumes', 'limite', ['fructanes'], 'Petite portion (environ 75 g).'],
  ['Choux de Bruxelles', 'Légumes', 'eviter', ['fructanes'], ''],
  ['Brocoli (têtes)', 'Légumes', 'eviter', ['fructose'], 'Les têtes passent souvent mieux que les tiges en réintroduction.'],
  ['Brocoli (tiges)', 'Légumes', 'eviter', ['fructose'], ''],
  ['Chou-fleur', 'Légumes', 'eviter', ['mannitol'], ''],
  ['Champignons de Paris', 'Légumes', 'eviter', ['mannitol'], ''],
  ['Pleurotes', 'Légumes', 'ok', [], 'Une alternative aux champignons de Paris.'],
  ['Champignons en conserve', 'Légumes', 'limite', ['mannitol'], 'Rincés, ils sont mieux tolérés.'],
  ['Céleri branche', 'Légumes', 'limite', ['mannitol'], 'À favoriser selon la fiche SNFCP ; en grande quantité, il apporte du mannitol.'],
  ['Céleri-rave', 'Légumes', 'ok', [], ''],
  ['Fenouil (bulbe)', 'Légumes', 'eviter', ['fructanes'], ''],
  ['Betterave', 'Légumes', 'eviter', ['gos', 'fructanes'], ''],
  ['Petits pois', 'Légumes', 'eviter', ['gos'], ''],
  ['Maïs doux', 'Légumes', 'eviter', ['sorbitol'], ''],
  ['Avocat', 'Légumes', 'limite', ['sorbitol'], 'Environ 30 g (⅛ d’avocat).'],
  ['Courge butternut', 'Légumes', 'limite', ['gos', 'mannitol'], 'Environ ¼ de tasse.'],
  ['Potimarron / courge kabocha', 'Légumes', 'ok', [], ''],
  ['Germes de soja', 'Légumes', 'ok', [], ''],
  ['Olives', 'Légumes', 'ok', [], ''],
  ['Gingembre frais', 'Légumes', 'ok', [], ''],
  ['Ail', 'Légumes', 'eviter', ['fructanes'], 'Remplacer par de l’huile infusée à l’ail.'],
  ['Oignon (blanc, jaune, rouge)', 'Légumes', 'eviter', ['fructanes'], 'Remplacer par la partie verte des oignons nouveaux.'],
  ['Échalote', 'Légumes', 'eviter', ['fructanes'], ''],
  ['Poireau (partie blanche)', 'Légumes', 'eviter', ['fructanes'], ''],
  ['Poireau (partie verte)', 'Légumes', 'ok', [], ''],
  ['Oignon nouveau (partie verte)', 'Légumes', 'ok', [], ''],
  ['Ciboulette', 'Légumes', 'ok', [], ''],
  ['Artichaut', 'Légumes', 'eviter', ['fructanes'], ''],
  ['Topinambour', 'Légumes', 'eviter', ['fructanes'], ''],
  ['Asperges', 'Légumes', 'eviter', ['fructose', 'fructanes'], ''],

  // Fruits
  ['Banane ferme (peu mûre)', 'Fruits', 'ok', [], ''],
  ['Banane bien mûre', 'Fruits', 'limite', ['fructanes'], 'Environ ⅓ de banane.'],
  ['Myrtilles', 'Fruits', 'ok', [], ''],
  ['Fraises', 'Fruits', 'ok', [], ''],
  ['Framboises', 'Fruits', 'limite', ['fructose'], 'Environ 30 framboises.'],
  ['Kiwi', 'Fruits', 'ok', [], ''],
  ['Orange', 'Fruits', 'ok', [], ''],
  ['Mandarine, clémentine', 'Fruits', 'ok', [], ''],
  ['Citron, citron vert', 'Fruits', 'ok', [], ''],
  ['Ananas', 'Fruits', 'ok', [], ''],
  ['Raisin', 'Fruits', 'ok', [], ''],
  ['Melon (cantaloup, charentais)', 'Fruits', 'ok', [], ''],
  ['Papaye', 'Fruits', 'ok', [], ''],
  ['Fruit de la passion', 'Fruits', 'ok', [], ''],
  ['Pomme', 'Fruits', 'eviter', ['fructose', 'sorbitol'], ''],
  ['Poire', 'Fruits', 'eviter', ['fructose', 'sorbitol'], ''],
  ['Mangue', 'Fruits', 'eviter', ['fructose'], ''],
  ['Pastèque, melon d’eau', 'Fruits', 'eviter', ['fructose', 'mannitol', 'fructanes'], ''],
  ['Cerises', 'Fruits', 'eviter', ['fructose', 'sorbitol'], ''],
  ['Pêche, nectarine', 'Fruits', 'eviter', ['sorbitol'], ''],
  ['Prune, pruneau', 'Fruits', 'eviter', ['sorbitol'], ''],
  ['Abricot', 'Fruits', 'eviter', ['sorbitol'], ''],
  ['Mûres', 'Fruits', 'eviter', ['sorbitol'], ''],
  ['Figues', 'Fruits', 'eviter', ['fructanes', 'fructose'], ''],
  ['Dattes, raisins secs', 'Fruits', 'eviter', ['fructanes'], ''],
  ['Canneberges séchées', 'Fruits', 'limite', ['fructanes'], '1 cuillère à soupe.'],

  // Céréales & féculents
  ['Riz (blanc, complet, basmati)', 'Céréales & féculents', 'ok', [], ''],
  ['Quinoa', 'Céréales & féculents', 'ok', [], ''],
  ['Flocons d’avoine', 'Céréales & féculents', 'limite', ['fructanes', 'gos'], 'Environ ½ tasse (50 g) crus.'],
  ['Polenta (maïs)', 'Céréales & féculents', 'ok', [], ''],
  ['Sarrasin', 'Céréales & féculents', 'ok', [], ''],
  ['Millet', 'Céréales & féculents', 'ok', [], ''],
  ['Tapioca', 'Céréales & féculents', 'ok', [], ''],
  ['Nouilles de riz', 'Céréales & féculents', 'ok', [], ''],
  ['Pâtes sans gluten', 'Céréales & féculents', 'ok', [], 'Vérifier l’absence d’inuline ou de farine de légumineuses.'],
  ['Pain sans gluten', 'Céréales & féculents', 'ok', [], 'Vérifier les ingrédients (inuline, farine de soja, miel).'],
  ['Pain d’épeautre au levain', 'Céréales & féculents', 'eviter', ['fructanes'], 'L’épeautre est un blé. Le levain réduit les fructanes : à tester en réintroduction.'],
  ['Pain blanc au levain traditionnel', 'Céréales & féculents', 'eviter', ['fructanes'], 'Le blé est exclu sous toutes ses formes pendant l’élimination.'],
  ['Pain de blé classique', 'Céréales & féculents', 'eviter', ['fructanes'], ''],
  ['Pâtes de blé', 'Céréales & féculents', 'eviter', ['fructanes'], ''],
  ['Couscous, semoule de blé', 'Céréales & féculents', 'eviter', ['fructanes'], ''],
  ['Seigle', 'Céréales & féculents', 'eviter', ['fructanes'], ''],
  ['Orge', 'Céréales & féculents', 'eviter', ['fructanes'], ''],
  ['Galettes de riz', 'Céréales & féculents', 'ok', [], ''],

  // Protéines
  ['Bœuf, porc, agneau, volaille (nature)', 'Protéines', 'ok', [], 'Attention aux marinades, saucisses et panures.'],
  ['Poisson et fruits de mer', 'Protéines', 'ok', [], ''],
  ['Œufs', 'Protéines', 'ok', [], ''],
  ['Tofu ferme', 'Protéines', 'ok', [], 'Le pressage élimine une partie des GOS.'],
  ['Tofu soyeux', 'Protéines', 'eviter', ['gos'], ''],
  ['Tempeh', 'Protéines', 'ok', [], ''],
  ['Charcuterie, saucisses', 'Protéines', 'limite', ['fructanes'], 'Contiennent souvent ail, oignon ou blé.'],

  // Légumineuses
  ['Lentilles en conserve (rincées)', 'Légumineuses', 'eviter', ['gos'], 'La fiche SNFCP exclut toutes les légumineuses. Rincées, en petite portion, elles sont souvent réintroduites ensuite.'],
  ['Pois chiches en conserve (rincés)', 'Légumineuses', 'eviter', ['gos'], 'La fiche SNFCP exclut toutes les légumineuses.'],
  ['Lentilles sèches cuites', 'Légumineuses', 'eviter', ['gos'], ''],
  ['Haricots rouges, blancs, noirs', 'Légumineuses', 'eviter', ['gos'], ''],
  ['Fèves, gourganes', 'Légumineuses', 'eviter', ['gos'], ''],
  ['Edamame', 'Légumineuses', 'eviter', ['gos'], 'La fiche SNFCP exclut toutes les légumineuses, dont la fève de soja.'],
  ['Houmous', 'Légumineuses', 'eviter', ['gos', 'fructanes'], 'Pois chiches et ail.'],

  // Produits laitiers & alternatives
  ['Lait de vache', 'Produits laitiers & alternatives', 'eviter', ['lactose'], 'Préférer le lait sans lactose.'],
  ['Lait sans lactose', 'Produits laitiers & alternatives', 'ok', [], ''],
  ['Yaourt classique', 'Produits laitiers & alternatives', 'eviter', ['lactose'], 'Préférer sans lactose ou végétal.'],
  ['Yaourt sans lactose', 'Produits laitiers & alternatives', 'ok', [], ''],
  ['Fromages affinés (comté, cheddar, parmesan, gouda)', 'Produits laitiers & alternatives', 'ok', [], 'Pratiquement sans lactose.'],
  ['Mozzarella, brie, camembert, feta', 'Produits laitiers & alternatives', 'ok', [], ''],
  ['Ricotta, cottage cheese', 'Produits laitiers & alternatives', 'eviter', ['lactose'], 'Fromages à pâte molle non affinés.'],
  ['Fromage frais, fromage blanc', 'Produits laitiers & alternatives', 'eviter', ['lactose'], ''],
  ['Crème fraîche, crème liquide', 'Produits laitiers & alternatives', 'eviter', ['lactose'], ''],
  ['Beurre', 'Produits laitiers & alternatives', 'eviter', ['lactose'], 'Il contient en réalité très peu de lactose : à rediscuter avec votre médecin.'],
  ['Glace au lait', 'Produits laitiers & alternatives', 'eviter', ['lactose'], ''],
  ['Lait d’amande', 'Produits laitiers & alternatives', 'ok', [], ''],
  ['Lait de riz', 'Produits laitiers & alternatives', 'ok', [], ''],
  ['Lait d’avoine', 'Produits laitiers & alternatives', 'limite', ['fructanes'], 'Environ ½ tasse.'],
  ['Lait de soja (protéines de soja)', 'Produits laitiers & alternatives', 'ok', [], 'Celui fait de graines de soja entières est riche en GOS.'],
  ['Lait de soja (graines entières)', 'Produits laitiers & alternatives', 'eviter', ['gos'], ''],
  ['Lait de coco (conserve)', 'Produits laitiers & alternatives', 'ok', [], 'Environ ½ tasse.'],

  // Noix & graines
  ['Noix', 'Noix & graines', 'ok', [], ''],
  ['Noix de pécan', 'Noix & graines', 'ok', [], ''],
  ['Noix de macadamia', 'Noix & graines', 'ok', [], ''],
  ['Cacahuètes, beurre de cacahuète', 'Noix & graines', 'ok', [], ''],
  ['Pignons de pin', 'Noix & graines', 'ok', [], ''],
  ['Graines de courge', 'Noix & graines', 'ok', [], ''],
  ['Graines de tournesol', 'Noix & graines', 'limite', ['fructanes'], '2 cuillères à café.'],
  ['Graines de chia', 'Noix & graines', 'ok', [], '2 cuillères à soupe.'],
  ['Graines de lin', 'Noix & graines', 'limite', ['gos'], '1 cuillère à soupe.'],
  ['Graines de sésame', 'Noix & graines', 'ok', [], ''],
  ['Amandes', 'Noix & graines', 'limite', ['gos'], 'À favoriser selon la fiche SNFCP ; au-delà d’une dizaine, elles apportent des GOS.'],
  ['Noisettes', 'Noix & graines', 'limite', ['gos', 'fructanes'], 'À favoriser selon la fiche SNFCP ; au-delà d’une dizaine, elles apportent des fructanes.'],
  ['Noix de cajou', 'Noix & graines', 'eviter', ['gos', 'fructanes'], ''],
  ['Pistaches', 'Noix & graines', 'eviter', ['gos', 'fructanes'], ''],

  // Sucres & douceurs
  ['Sucre blanc ou roux', 'Sucres & douceurs', 'ok', [], ''],
  ['Sirop d’érable', 'Sucres & douceurs', 'ok', [], ''],
  ['Chocolat noir', 'Sucres & douceurs', 'ok', [], 'Environ 30 g.'],
  ['Chocolat au lait', 'Sucres & douceurs', 'limite', ['lactose'], 'Environ 20 g.'],
  ['Stévia', 'Sucres & douceurs', 'ok', [], ''],
  ['Miel', 'Sucres & douceurs', 'eviter', ['fructose'], ''],
  ['Sirop d’agave', 'Sucres & douceurs', 'eviter', ['fructose'], ''],
  ['Sirop de glucose-fructose', 'Sucres & douceurs', 'eviter', ['fructose'], ''],
  ['Polyols : sorbitol, mannitol, xylitol, maltitol, isomalt', 'Sucres & douceurs', 'eviter', ['sorbitol', 'mannitol'], 'Chewing-gums et bonbons « sans sucre » (E420, E421, E965, E953, E967).'],
  ['Inuline, racine de chicorée', 'Sucres & douceurs', 'eviter', ['fructanes'], 'Souvent ajoutée aux produits « riches en fibres ».'],

  // Boissons
  ['Eau, eau gazeuse', 'Boissons', 'ok', [], ''],
  ['Café (espresso, filtre)', 'Boissons', 'ok', [], 'Le café peut irriter indépendamment des FODMAP.'],
  ['Thé noir léger', 'Boissons', 'ok', [], 'Infusé fort, il devient riche en fructanes.'],
  ['Thé vert', 'Boissons', 'ok', [], ''],
  ['Infusion de menthe poivrée', 'Boissons', 'ok', [], 'La fiche SNFCP déconseille la menthe : il s’agit des bonbons et chewing-gums à la menthe, pas de l’infusion.'],
  ['Infusion de camomille', 'Boissons', 'eviter', ['fructanes'], ''],
  ['Infusion de fenouil', 'Boissons', 'eviter', ['fructanes'], ''],
  ['Jus d’orange frais maison', 'Boissons', 'limite', ['fructose'], 'Environ ½ verre. Les jus du commerce sont à éviter.'],
  ['Jus de pomme', 'Boissons', 'eviter', ['fructose', 'sorbitol'], ''],
  ['Vin rouge ou blanc', 'Boissons', 'ok', [], '1 verre ; l’alcool irrite l’intestin.'],
  ['Bière', 'Boissons', 'ok', [], '1 verre.'],
  ['Rhum', 'Boissons', 'eviter', ['fructose'], ''],
  ['Sodas au sirop de glucose-fructose', 'Boissons', 'eviter', ['fructose'], ''],

  // Condiments & assaisonnements
  ['Huile infusée à l’ail', 'Condiments & assaisonnements', 'ok', [], 'Les fructanes ne passent pas dans l’huile.'],
  ['Huiles (olive, colza, sésame)', 'Condiments & assaisonnements', 'ok', [], ''],
  ['Sauce soja, tamari', 'Condiments & assaisonnements', 'ok', [], ''],
  ['Sauce de poisson', 'Condiments & assaisonnements', 'ok', [], ''],
  ['Moutarde', 'Condiments & assaisonnements', 'ok', [], ''],
  ['Mayonnaise', 'Condiments & assaisonnements', 'ok', [], 'Sans ail.'],
  ['Vinaigre de vin, de riz, de cidre', 'Condiments & assaisonnements', 'ok', [], ''],
  ['Vinaigre balsamique', 'Condiments & assaisonnements', 'limite', ['fructose'], '1 cuillère à soupe.'],
  ['Ketchup', 'Condiments & assaisonnements', 'limite', ['fructanes'], '1 cuillère à soupe.'],
  ['Bouillon cube classique', 'Condiments & assaisonnements', 'eviter', ['fructanes'], 'Contient ail et oignon ; choisir une version sans.'],
  ['Herbes fraîches (basilic, persil, coriandre, menthe, thym)', 'Condiments & assaisonnements', 'ok', [], ''],
  ['Épices (cumin, curcuma, paprika, poivre, curry sans ail)', 'Condiments & assaisonnements', 'ok', [], 'Vérifier les mélanges : ail et oignon en poudre fréquents.'],
  ['Ail et oignon en poudre', 'Condiments & assaisonnements', 'eviter', ['fructanes'], ''],
  ['Asa-fœtida', 'Condiments & assaisonnements', 'ok', [], 'Une pincée donne un goût d’ail ; choisir sans farine de blé.'],
  ['Pesto', 'Condiments & assaisonnements', 'limite', ['fructanes'], 'Le maison sans ail passe très bien.'],
  ['Sauce tomate du commerce', 'Condiments & assaisonnements', 'limite', ['fructanes'], 'Contient souvent ail et oignon.'],  // Ajouts d'après la fiche SNFCP. L'identifiant d'un aliment est sa position dans cette
  // liste : toujours ajouter à la fin, ne jamais insérer ni supprimer.
  ['Kaki', 'Fruits', 'eviter', [], ''],
  ['Fruits en conserve', 'Fruits', 'eviter', ['fructose'], ''],
  ['Pamplemousse', 'Fruits', 'ok', [], 'Environ ½ pamplemousse.'],
  ['Rhubarbe', 'Fruits', 'ok', [], ''],
  ['Noix de coco', 'Fruits', 'ok', [], ''],
  ['Tangelo', 'Fruits', 'ok', [], ''],
  ['Durian', 'Fruits', 'ok', [], ''],
  ['Canneberges fraîches', 'Fruits', 'ok', [], ''],
  ['Amarante', 'Céréales & féculents', 'ok', [], ''],
  ['Arrow-root', 'Céréales & féculents', 'ok', [], ''],
  ['Farines sans gluten (riz, maïs, sarrasin)', 'Céréales & féculents', 'ok', [], ''],
  ['Biscuits, viennoiseries (blé)', 'Céréales & féculents', 'eviter', ['fructanes'], 'Fiche SNFCP : le blé est à éviter sous toutes ses formes.'],
  ['Flageolets', 'Légumineuses', 'eviter', ['gos'], ''],
  ['Pois cassés, pois secs', 'Légumineuses', 'eviter', ['gos'], ''],
  ['Lait concentré, lait en poudre', 'Produits laitiers & alternatives', 'eviter', ['lactose'], ''],
  ['Beurre sans lactose, beurre végétal', 'Produits laitiers & alternatives', 'ok', [], ''],
  ['Margarine', 'Produits laitiers & alternatives', 'eviter', [], ''],
  ['Yaourt végétal (soja, coco)', 'Produits laitiers & alternatives', 'ok', [], 'Vérifier l’absence d’inuline.'],
  ['Desserts à base de lait de vache', 'Produits laitiers & alternatives', 'eviter', ['lactose'], 'Crèmes dessert, flans, riz au lait…'],
  ['Glace sans lactose, sorbet', 'Sucres & douceurs', 'ok', [], 'Sorbet : éviter ceux à la mangue, à la pomme ou à la poire.'],
  ['Fructose (sucre de fruit)', 'Sucres & douceurs', 'eviter', ['fructose'], ''],
  ['Mélasse', 'Sucres & douceurs', 'ok', [], 'En petite quantité.'],
  ['Confiture', 'Sucres & douceurs', 'eviter', ['fructose'], ''],
  ['Bonbons, sucettes, chewing-gums', 'Sucres & douceurs', 'eviter', ['sorbitol', 'mannitol'], 'Surtout « sans sucre » ou à la menthe.'],
  ['Gin, whisky, vodka', 'Boissons', 'ok', [], 'Avec modération ; l’alcool irrite l’intestin.'],
  ['Cidre', 'Boissons', 'eviter', ['fructose', 'sorbitol'], ''],
  ['Vermouth, porto, vin cuit, crème de cassis', 'Boissons', 'eviter', ['fructose'], ''],
  ['Jus de fruits du commerce, concentrés', 'Boissons', 'eviter', ['fructose'], ''],
  ['Plats préparés en sauce', 'Protéines', 'eviter', ['fructanes'], 'Sauces et bouillons contiennent souvent ail, oignon et blé.'],
  ['Anis étoilé (badiane)', 'Condiments & assaisonnements', 'ok', [], ''],
];

// Classement de la fiche « Régime pauvre en FODMAPs » remise par le médecin (SNFCP).
// Il prime sur le classement ci-dessus pour chaque aliment qu'elle cite.
const FICHE = {
  ok: [
    // Fruits
    206, 49, 50, 51, 74, 184, 60, 57, 183, 52, 53, 62, 61, 54, 56, 179, 55, 180, 182, 181,
    // Légumes
    7, 0, 9, 37, 38, 27, 28, 10, 11, 1, 2, 8,
    // Céréales
    185, 79, 187, 83, 84, 75, 78, 80, 186, 76, 81,
    // Noix
    134, 131, 126, 125, 135, 127, 133, 124,
    // Laits, yaourts, fromages, beurre, huile
    108, 123, 121, 122, 118, 119, 110, 194, 111, 112, 192, 162,
    // Sirops, sucres, glaces, herbes
    139, 198, 138, 142, 196, 171,
    // Protéines, alcools, boissons
    93, 95, 94, 96, 97, 158, 201, 157, 149, 150, 151, 155,
  ],
  eviter: [
    // Fruits
    63, 65, 66, 178, 70, 177, 67, 72, 71, 68, 64, 69,
    // Légumes
    46, 21, 22, 48, 30, 20, 3, 29, 42, 43, 39, 40, 41, 44, 23, 4, 5, 24, 25, 26, 32, 31, 47,
    // Légumineuses
    100, 101, 102, 103, 104, 105, 106, 189, 190,
    // Céréales
    85, 86, 87, 88, 89, 90, 91, 188,
    // Noix, laitages
    136, 137, 107, 191, 109, 113, 114, 115, 116, 193, 117,
    // Sirops, édulcorants, autres
    145, 197, 146, 200, 152, 195, 143, 199,
    // Protéines, alcools, boissons
    205, 202, 159, 203, 204, 156,
  ],
};
const FICHE_STATUS = new Map(Object.entries(FICHE).flatMap(([st, ids]) => ids.map((i) => [i, st])));

// Notes réécrites quand la fiche change le classement d'origine.
const FICHE_NOTES = {
  1: '', 3: '', 4: '', 21: '', 85: 'L’épeautre est un blé.', 100: '', 101: '', 105: '', 11: '', 27: '', 50: '', 53: '', 74: '', 97: '', 122: '', 134: '', 135: '',
  43: 'La fiche classe le poireau à éviter, partie verte comprise.',
  44: 'La fiche classe l’oignon à éviter, partie verte comprise. La ciboulette la remplace.',
  25: 'La fiche classe tous les champignons à éviter.',
  152: 'La fiche déconseille la menthe.',
  155: 'Frais maison uniquement.',
  116: 'Préférer le beurre sans lactose ou végétal.',
};

export const FOODS = RAW.map(([name, category, status, families, note], i) => ({
  id: 'f' + i,
  name,
  category,
  status: FICHE_STATUS.get(i) || status,
  families,
  note: i in FICHE_NOTES ? FICHE_NOTES[i] : note,
  fiche: FICHE_STATUS.has(i),
}));

// Aliments-tests suggérés pour la réintroduction (portion croissante sur 3 jours).
export const REINTRO = {
  fructanes: { food: 'Pain de blé', doses: ['½ tranche', '1 tranche', '2 tranches'] },
  gos: { food: 'Pois chiches en conserve', doses: ['¼ tasse', '½ tasse', '1 tasse'] },
  lactose: { food: 'Lait de vache', doses: ['½ tasse', '¾ tasse', '1 tasse'] },
  fructose: { food: 'Miel', doses: ['1 c. à café', '1 c. à soupe', '1½ c. à soupe'] },
  sorbitol: { food: 'Avocat', doses: ['¼ d’avocat', '⅓ d’avocat', '½ avocat'] },
  mannitol: { food: 'Champignons de Paris', doses: ['¼ tasse', '½ tasse', '1 tasse'] },
};

export const SYMPTOMS = [
  { id: 'ballonnements', label: 'Ballonnements' },
  { id: 'douleur', label: 'Douleurs abdominales' },
  { id: 'gaz', label: 'Gaz' },
  { id: 'nausee', label: 'Nausées' },
  { id: 'reflux', label: 'Reflux, brûlures' },
  { id: 'fatigue', label: 'Fatigue' },
];

export const BRISTOL = [
  { n: 1, label: 'Petites boules dures' },
  { n: 2, label: 'Saucisse grumeleuse' },
  { n: 3, label: 'Saucisse craquelée' },
  { n: 4, label: 'Lisse et souple' },
  { n: 5, label: 'Morceaux mous' },
  { n: 6, label: 'Pâteuse' },
  { n: 7, label: 'Liquide' },
];

export const RECIPES = [
  {
    id: 'r1', title: 'Porridge banane, myrtilles et noix', meal: 'Petit-déjeuner', time: 10, servings: 1,
    ingredients: ['40 g de flocons d’avoine', '200 ml de lait d’amande', '½ banane ferme', '1 poignée de myrtilles', '1 c. à soupe de noix concassées', '1 c. à café de sirop d’érable', '1 pincée de cannelle'],
    steps: ['Cuire les flocons dans le lait d’amande 4 à 5 minutes à feu doux en remuant.', 'Ajouter la cannelle, verser dans un bol.', 'Garnir de banane en rondelles, de myrtilles, de noix et de sirop d’érable.'],
  },
  {
    id: 'r2', title: 'Omelette épinards, feta et ciboulette', meal: 'Petit-déjeuner', time: 10, servings: 1,
    ingredients: ['2 œufs', '1 poignée d’épinards', '30 g de feta', '1 c. à soupe de ciboulette', '1 c. à café d’huile d’olive', 'Sel, poivre'],
    steps: ['Faire tomber les épinards dans l’huile chaude 1 minute.', 'Verser les œufs battus, salés et poivrés.', 'Parsemer de feta émiettée et de ciboulette, plier l’omelette quand elle est prise.'],
  },
  {
    id: 'r3', title: 'Bol de riz au saumon, concombre et sésame', meal: 'Déjeuner', time: 20, servings: 2,
    ingredients: ['150 g de riz', '2 pavés de saumon', '½ concombre', '1 carotte râpée', '2 c. à soupe de sauce soja', '1 c. à café d’huile de sésame', '1 c. à café de gingembre râpé', 'Graines de sésame', 'Ciboulette'],
    steps: ['Cuire le riz.', 'Saisir le saumon 3 à 4 minutes de chaque côté.', 'Mélanger sauce soja, huile de sésame et gingembre.', 'Dresser riz, saumon émietté, concombre et carotte ; arroser de sauce, parsemer de sésame et de ciboulette.'],
  },
  {
    id: 'r4', title: 'Salade de quinoa, poulet et légumes grillés', meal: 'Déjeuner', time: 30, servings: 2,
    ingredients: ['120 g de quinoa', '1 blanc de poulet', '2 carottes en bâtonnets', '1 petite courgette', '6 olives', '2 c. à soupe d’huile infusée à l’ail', '1 citron', 'Persil', 'Sel, poivre'],
    steps: ['Cuire le quinoa et le laisser tiédir.', 'Griller carottes et courgette en lamelles, puis le poulet assaisonné.', 'Mélanger le tout avec les olives et le persil.', 'Assaisonner d’huile à l’ail, de jus de citron, de sel et de poivre.'],
  },
  {
    id: 'r5', title: 'Soupe carotte, gingembre et lait de coco', meal: 'Dîner', time: 30, servings: 4,
    ingredients: ['600 g de carottes', '1 pomme de terre', '1 c. à soupe de gingembre râpé', '1 branche de céleri', '200 ml de lait de coco', '800 ml de bouillon sans ail ni oignon', '1 c. à soupe d’huile d’olive', 'Coriandre'],
    steps: ['Faire revenir le céleri émincé dans l’huile.', 'Ajouter carottes et pomme de terre en morceaux, le gingembre et le bouillon.', 'Cuire 20 minutes, ajouter le lait de coco et mixer.', 'Servir avec de la coriandre.'],
  },
  {
    id: 'r6', title: 'Pâtes sans gluten à la sauce tomate maison', meal: 'Dîner', time: 25, servings: 2,
    ingredients: ['200 g de pâtes sans gluten', '400 g de tomates concassées', '2 c. à soupe d’huile infusée à l’ail', '1 pincée d’asa-fœtida (facultatif)', 'Basilic frais', '1 c. à café de sucre', 'Parmesan', 'Sel, poivre'],
    steps: ['Chauffer l’huile à l’ail, ajouter l’asa-fœtida puis les tomates et le sucre.', 'Laisser mijoter 15 minutes, saler, poivrer.', 'Cuire les pâtes, mélanger à la sauce.', 'Servir avec basilic et parmesan.'],
  },
  {
    id: 'r7', title: 'Curry de poulet et pommes de terre', meal: 'Dîner', time: 35, servings: 3,
    ingredients: ['2 blancs de poulet', '3 pommes de terre', '1 carotte', '1 poignée d’épinards', '200 ml de lait de coco', '2 c. à café de curry en poudre sans ail', '1 c. à café de curcuma', '1 c. à soupe de gingembre', 'Coriandre', 'Riz basmati'],
    steps: ['Dorer le poulet en dés avec le gingembre et les épices.', 'Ajouter pommes de terre et carotte en dés, le lait de coco et 100 ml d’eau.', 'Mijoter 20 minutes, ajouter les épinards en fin de cuisson.', 'Servir avec le riz et la coriandre.'],
  },
  {
    id: 'r8', title: 'Sauté de tofu, pak choï et nouilles de riz', meal: 'Dîner', time: 20, servings: 2,
    ingredients: ['200 g de tofu ferme', '150 g de nouilles de riz', '2 pak choï', '1 carotte', '2 c. à soupe de sauce soja', '1 c. à soupe de sirop d’érable', '1 c. à café de gingembre', '1 c. à soupe de cacahuètes', 'Citron vert'],
    steps: ['Presser et couper le tofu, le dorer à la poêle.', 'Faire sauter carotte en julienne et pak choï.', 'Ajouter les nouilles réhydratées, la sauce soja, le sirop d’érable et le gingembre.', 'Servir avec cacahuètes concassées et citron vert.'],
  },
  {
    id: 'r9', title: 'Poisson au four, pommes de terre et haricots verts', meal: 'Dîner', time: 35, servings: 2,
    ingredients: ['2 filets de cabillaud', '400 g de pommes de terre', '150 g de haricots verts', '1 citron', 'Thym', '2 c. à soupe d’huile d’olive', 'Sel, poivre'],
    steps: ['Rôtir les pommes de terre en quartiers 20 minutes à 200 °C avec la moitié de l’huile et le thym.', 'Ajouter le poisson et les haricots verts, arroser d’huile et de citron.', 'Prolonger de 12 à 15 minutes.'],
  },
  {
    id: 'r10', title: 'Crumble fraises et rhubarbe, flocons et noix', meal: 'Dessert', time: 40, servings: 4,
    ingredients: ['300 g de fraises', '200 g de rhubarbe', '2 c. à soupe de sucre', '60 g de flocons d’avoine', '40 g de farine de riz', '40 g de beurre sans lactose ou végétal', '30 g de noix de pécan', '30 g de sucre roux'],
    steps: ['Disposer fruits coupés et sucre dans un plat.', 'Sabler flocons, farine, beurre, sucre roux et noix concassées.', 'Recouvrir les fruits et cuire 25 minutes à 180 °C.'],
  },
  {
    id: 'r11', title: 'Yaourt sans lactose, kiwi et chia', meal: 'Collation', time: 5, servings: 1,
    ingredients: ['150 g de yaourt sans lactose', '1 kiwi', '1 c. à soupe de graines de chia', '1 c. à café de sirop d’érable'],
    steps: ['Mélanger le yaourt et le chia, laisser reposer 5 minutes.', 'Ajouter le kiwi en dés et le sirop d’érable.'],
  },
  {
    id: 'r12', title: 'Galettes de riz, beurre de cacahuète et banane', meal: 'Collation', time: 3, servings: 1,
    ingredients: ['2 galettes de riz', '1 c. à soupe de beurre de cacahuète', '½ banane ferme'],
    steps: ['Tartiner les galettes, ajouter la banane en rondelles.'],
  },
];
