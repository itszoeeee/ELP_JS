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
    "fenêtre", "film", "fleur", "fromage", "fruit",  
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

// Fonction pour choisir des mots aléatoires
function getRandomWords() {
    let mots_aleatoire = [];
    while (mots_aleatoire.length < 5) {
        let randomIndex = Math.floor(Math.random() * dico.length);
        if (!mots_aleatoire.includes(dico[randomIndex])) {
            mots_aleatoire.push(dico[randomIndex]);
        }
    }
    return mots_aleat;
}

// Fonction pour compter combien de fois un mot apparaît dans une liste
function compteur(mot, liste) {
    let x = 0;
    for (let i = 0; i < liste.length; i++) {
        if (liste[i] === mot) {
            x++;
        }
    }
    return x;
}

// Fonction pour vérifier si un mot contient un espace
function un_seul_mot(mot) {
    return !mot.includes(" ");
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
        return "Ok sans faute mais c'est qu'un jeu ya pas de quoi frimer";
    }
}

// Fonction principale du jeu
async function jouer() {
    const nbr_joueurs = parseInt(await askQuestion("Combien de joueurs ? -> "));
    let liste_joueurs = [];
    for (let i = 0; i < nbr_joueurs; i++) {
        const prenom = await askQuestion(`Name of player ${i + 1} : `);
        liste_joueurs.push(prenom);
    }

    let carte = [getRandomWords()];
    // console.log(carte);

    let points = 0;
    while (points < 14) {
        for (let i = 0; i < nbr_joueurs; i++) {
            let dev;
            do {
                dev = parseInt(await askQuestion(`Joueur ${i + 1}, piochez une carte et choisissez un chiffre entre 1 et 5 : `));
                if (dev > 5 || dev < 1) {
                    console.log("Veuillez choisir un chiffre entre 1 et 5 !");
                }
            } while (dev > 5 || dev < 1);

            const mot = carte[0][dev - 1];
            // console.log("Le mot à deviner est", mot);

            let ind = [];
            for (let j = 0; j < nbr_joueurs; j++) {
                if (j !== i) {
                    const indice = await askQuestion(`Joueur ${j + 1}, quel est votre indice ? -> `);
                    ind.push(indice);
                }
            }

            let ind_val = [];
            for (let a of ind) {
                if (compteur(a, ind) <= 1 && un_seul_mot(a)) {
                    ind_val.push(a);
                }
            }
            console.log("Voici les indices donnés :", ind_val);

            const rep = await askQuestion("Quel est votre mot ? -> ");
            if (rep === mot) {
                console.log("Bravo !");
                points += 1;
            } else {
                console.log("Non, le mot était", mot);
            }
        }
    }

    console.log(`Vous avez obtenu ${points} points. ${resultat(points)}`);
    rl.close();
}

jouer();
