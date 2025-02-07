const readline = require('readline');

// Initialisation de readline pour les entrées utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour poser une question à l'utilisateur
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Liste des mots du dictionnaire
const dico = [
    "actrice", "amitié", "amour", "année", "arbre", "argent", "argenté", "automne", "avion", 
    "balle", "blanc", "bleu", "bonté", "brouillard",  
    "casque","chaise", "chanson", "chat", "chaussure", "ciel", "circuit","classe", "colère", "couleur", "cuisine",  
    "dauphin", "déni", "dessin","doré", "dormir", 
    "eau", "école", "écriture", "élève", "espoir", "été", "étoile", "examen",  
    "fenêtre", "film", "Finlande", "fleur", "fromage", "fruit",  
    "gris",  
    "hérisson", "hiver", "hydrogène",  
    "insecte", "Italie", 
    "jaune", "jeu", "joie", "jour", 
    "kayak","kiwi", 
    "lecture", "légume", "livre", "loisir", "lune",  
    "maison", "matin", "marron", "mélodie", "mer", "mois", "mort", "montagne", "musique",  
    "nature", "neige", "noir", "note", "nuit", "nuage",  
    "ordinateur", "oiseau", "or", "oxydation",  
    "papillon", "papier", "peur", "pizza","plage", "pain", "plante", "pluie", "poney", "porte", "printemps", "professeur",
    "question", "quille", "quokka", 
    "restaurant", "respirer", "réveil", "rire", "rose", "rouge", "routeur",  
    "sable", "salade", "saison", "semaine", "soleil", "sommeil", "soir", "sport", "stylo",  
    "table", "tempête", "téléphone", "tristesse", "travail",  
    "usine",
    "vacances", "vent", "vert", "vêtement", "vie", "violet", "voiture",
    "wagon", "wombat",
    "xylophone",
    "yaourt",
    "zèbre"
    ];

// Fonction pour choisir cinq mots aléatoires pour creer une carte
function getRandomWords() {
    let mots_aleatoire = [];
    while (mots_aleatoire.length < 5) {
        let randomIndex = Math.floor(Math.random() * dico.length);
        if (!mots_aleatoire.includes(dico[randomIndex])) {
            mots_aleatoire.push(dico[randomIndex]);
        }
    }
    return mots_aleatoire;
}

// Fonction pour compter combien de fois un mot apparaît dans une liste
function compteur(mot, liste) {
    let x = 0;
    for (let i = 0; i < liste.length; i++) {
        if (liste[i].toLowerCase() === mot.toLowerCase()) {
            x++;
        }
    }
    return x;
}

// Fonction qui vérifie qu'un mot ne contient pas d'espace sauf au début ou à la fin 
// exemple "petit chat" -> false et "  chat" -> true
function un_seul_mot(mot) {
    return /^(\s*)[^\s]+(\s*)$/.test(mot);
}

// Fonction pour afficher le résultat en fonction du score
function resultat(pts) {
    if (pts > 0 && pts <= 3) {
        return "Vous êtes très très nul";
    } else if (pts > 3 && pts <= 6) {
        return "Mouais vous pouvez réessayez";
    } else if (pts > 6 && pts <= 8) {
        return "C'est la moyenne quoi";
    } else if (pts > 8 && pts <= 10) {
        return "Ok ok c'est pas si mal i guess";
    } else if (pts === 11) {
        return "Cool";
    } else if (pts === 12) {
        return "Si près et pourtant si loin";
    } else if (pts === 13) {
        return "WOW BRAVO VOUS ETES TROP TROP FORTS CEST TROP INCROYABLE";
    }
}

// Fonction principale du jeu
async function jouer() {
    const nbr_joueurs = parseInt(await askQuestion("Combien de joueurs ? -> "));
    let liste_joueurs = [];
    for (let i = 0; i < nbr_joueurs; i++) {
        const prenom = await askQuestion(`Prénom du joueur ${i + 1} : `);
        liste_joueurs.push(prenom);
    }

    
    let points = 0;
    let nbr_cartes_dans_pioche  = 20;
    while ((points < 14) && (nbr_cartes_dans_pioche > 0)) { // car dans la règle on joue jusqu'à obtenir treize points
        for (let i = 0; i < nbr_joueurs; i++) { // pour tourner entre les joueurs
            let carte = [getRandomWords()]; // nouvelle carte
            console.log("On pioche une nouvelle carte :");
            console.log(carte);
            let dev;
            do {
                dev = parseInt(await askQuestion(`${liste_joueurs[i]}, choisissez un chiffre entre 1 et 5 : `));
                if (!Number.isInteger(dev) || dev > 5 || dev < 1) {
                    console.log("Veuillez choisir un chiffre entre 1 et 5 !");
                }
            } while (!Number.isInteger(dev) || dev > 5 || dev < 1);

            const mot = carte[0][dev - 1];
            console.log("Le mot à deviner est :", mot);

            let indices = [];
            for (let j = 0; j < nbr_joueurs; j++) {
                if (j !== i) {
                    let indice_donne = await askQuestion(`${liste_joueurs[j]}, quel est votre indice ? -> `);
                    while (indice_donne.toLowerCase() == mot.toLowerCase()) {
                        indice_donne = await askQuestion(`${liste_joueurs[j]}, il faut un indice différent du mot à faire deviner -> `);
                    }
                    indices.push(indice_donne.trim()); // la liste de tous les indices données en enlevant les éventuels espaces
                }
            }

            let indices_valides = [];
            for (let ind of indices) { // on parcoure la liste de tous les indices donnés
                if (compteur(ind, indices) <= 1 && un_seul_mot(ind)) { // on vérifie que les indices soient valides càd ils n'apparaissent qu'une seule fois et ils n'ont pas d'espace (car pas de mot composé autorisé)
                    indices_valides.push(ind);
                }
            }
            if (indices_valides.length != 0){
                console.log("Voici les indices donnés :", indices_valides);
            }
            else {
                console.log ("Il n'y a pas d'indices, tes coéquipiers n'ont pas eu d'inspi");
            }

            const rep = await askQuestion(`${liste_joueurs[i]}, quel est votre mot ? -> `);
            if (rep.toLowerCase() === mot.toLowerCase()) {
                console.log("Bravo !");
                points += 1;
            } else {
                console.log("Non, le mot était :", mot);
            }
            nbr_cartes_dans_pioche -= 1; // on decremente le nombre de cartes a chaque tour 
        }
    }

    if (nbr_cartes_dans_pioche==0){
        console.log("Il n'y a plus de cartes dans la pioche. Comptons votre nombre de points.");}
    console.log(`Vous avez réussi à deviner ${points} cartes avec succès. ${resultat(points)}`);
    rl.close();
}

jouer();
