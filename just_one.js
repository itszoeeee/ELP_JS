const fs = require('fs'); 
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

// Dictionnaire de 150 mots 
const dico = [
    "actrice", "alcool", "amitié", "amour", "année", "arbre", "argent", "argenté", "automne", "avion", 
    "balle", "blanc", "bleu", "bonté", "brouillard", "bus",  
    "casque","chaise", "chanson", "chat", "chaussure", "chocolat", "ciel", "cinéma", "circuit","classe", "code", "colère", "couleur", "cuisine",  
    "danse", "dauphin", "déni", "dessin","doré", "dormir", "dragon",
    "eau", "école", "écriture", "élève", "espoir", "été", "étoile", "Europe", "examen",  
    "fenêtre", "film", "Finlande", "fleur", "fromage", "fruit", "fuschia",
    "gris", "guépard",
    "hérisson", "hiver", "hydrogène",  
    "indice","insecte", "Italie", 
    "jaune", "jeu", "joie", "jour", 
    "kayak","kiwi", "koala",
    "langage", "lecture", "légume", "livre", "loisir", "lune",  
    "maison", "malade", "matin", "marron", "mélodie", "mer", "mois", "mort", "montagne", "mur", "musique",  
    "nature", "neige", "noir", "note", "nuit", "nuage",  
    "ordinateur", "oiseau", "or", "oublier", "oxydation",  
    "papillon", "papier", "peur", "pizza","plage", "pain", "plante", "pluie", "poney", "porte", "printemps", "professeur",
    "question", "quille", "quokka", 
    "renard", "restaurant", "respirer", "réveil", "rire", "rose", "rouge", "routeur",  
    "sable", "salade", "saison", "semaine", "ski", "soleil", "sommeil", "soir", "sport", "stylo",  
    "table", "tempête", "téléphone", "tristesse", "trompette","travail",  
    "unique","usine",
    "vacances", "vent", "vert", "vêtement", "vie", "violet", "voiture",
    "wagon", "wombat",
    "xylophone",
    "yaourt",
    "zèbre", "zinc",
    ];

// Fonction pour choisir cinq mots aléatoires pour creer une carte
function getRandomWords(mots_prec) {
    let mots_aleatoire = [];
    while (mots_aleatoire.length < 5) {
        let randomIndex = Math.floor(Math.random() * dico.length);
        word = dico[randomIndex]
        if (!mots_aleatoire.includes(word) && !mots_prec.includes(word)) { // on vérifie que ce soit des mots distincts
            mots_aleatoire.push(word);
            mots_prec.push(word);
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

// Fonction pour afficher un commentaire en fonction du score
function resultat(pts) {
    if (pts > 0 && pts <= 3) {
        return "Essayez encore.";
    } else if (pts > 3 && pts <= 6) {
        return "C'est un bon début. Réessayez.";
    } else if (pts > 6 && pts <= 8) {
        return "Vous êtes dans la moyenne. Arriverez-vous à faire mieux ?";
    } else if (pts > 8 && pts <= 10) {
        return "Waouh pas mal du tout.";
    } else if (pts === 11) {
        return "Génial ! C'est un score qui se fête !";
    } else if (pts === 12) {
        return "Incroyable ! Vos amis doivent être impressionés !";
    } else if (pts === 13) {
        return "SCORE PARFAIT !!";
    }
}

// Fonction principale du jeu
async function jouer() {

    fs.writeFile('indices.txt', 'Liste des indices donnés par tour', (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture dans le fichier', err);
        }
        });

    let nbr_joueurs;
    do {
        nbr_joueurs = parseInt(await askQuestion("Combien de joueurs ? -> "));
    } while (!Number.isInteger(nbr_joueurs));
    let liste_joueurs = [];
    for (let i = 0; i < nbr_joueurs; i++) {
        const prenom = await askQuestion(`Prénom du joueur ${i + 1} : `);
        liste_joueurs.push(prenom);
    }
    
    let points = 0;
    let nbr_cartes_dans_pioche  = 13;
    let mots_deja_apparus = []; // pour qu'aucune carte n'ait les memes mots
    while (nbr_cartes_dans_pioche > 0) { 
        for (let i = 0; i < nbr_joueurs; i++) { // pour tourner entre les joueurs
            fs.appendFile('indices.txt', '\n\nIndices donnés au tour '+(14-nbr_cartes_dans_pioche) + ' :\n', (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture dans le fichier', err);
                }
                });
    
            let carte = [getRandomWords(mots_deja_apparus)]; // nouvelle carte
            console.log(`On pioche la ${14-nbr_cartes_dans_pioche}e carte :`);
            console.log(carte);
            let nbr_dev; // nbr_dev = NomBRe qui correspond au mot à DEViner
            do {
                nbr_dev = parseInt(await askQuestion(`${liste_joueurs[i]}, choisissez un chiffre entre 1 et 5 : `));
            } while (!Number.isInteger(nbr_dev) || nbr_dev > 5 || nbr_dev < 1);

            const mot = carte[0][nbr_dev - 1];
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
            const data = indices.join('\n');  // Chaque élément de la liste sera sur une ligne différente

            fs.appendFile('indices.txt', data, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture dans le fichier', err);
            }
            });

            let indices_valides = [];
            for (let ind of indices) { // on parcoure la liste de tous les indices donnés
                if (compteur(ind, indices) <= 1 && un_seul_mot(ind)) { // on vérifie que les indices soient valides càd ils n'apparaissent qu'une seule fois (pas de répétition) et ils n'ont pas d'espace (car pas de mot composé autorisé)
                    indices_valides.push(ind);
                }
            }
            if (indices_valides.length != 0){
                console.log("Voici les indices donnés :", indices_valides);
            }
            else {
                console.log ("Il n'y a pas d'indices, tes coéquipiers n'ont pas eu d'inspi :/");
            }

            const rep = await askQuestion(`${liste_joueurs[i]}, quel est votre mot ? -> `); // rep = REPonse donnée par le joueur
            if (rep.toLowerCase() === mot.toLowerCase()) {
                console.log("Bravo !");
                points += 1;
            } else {
                console.log("Non, le mot était :", mot, "\n");
            }
            nbr_cartes_dans_pioche -= 1; // on decremente le nombre de cartes a chaque tour 

        }
    }
    console.log(mots_deja_apparus);
    console.log("Fin de la partie. ");
    console.log(`Vous avez réussi à deviner ${points} cartes avec succès. ${resultat(points)}`);
    rl.close();
}

jouer();
