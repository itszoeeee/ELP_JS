# ELP_JS

### Réalisation du jeu Just One - Bleuenn EVEN et Zoé FEUILLOY

Nous avons créé un code JavaScript qui recrée le jeu Just One. <br>
Pour l'instant, tout se passe sur la même interface, ainsi pour jouer correctement il faudrait une personne intermédiaire derrière l'écran qui annonce le mot caché à faire deviner et écrit dans la console les indices de chaque joueur. <br>
La validité d'un indice se mesure à :<br>
- son unicité (il n'a été donné qu'une fois) => fonction COMPTEUR(mot, liste) qui compte le nombre d'occurences d'un mot dans une liste
- l'absence d'espaces (un seul mot) => fonction UN_SEUL_MOT(mot) qui s'assure de l'absence d'espaces dans une chaine de caractères
- sa différence exacte avec le mot proposé (indice_donné != mot)
<br><br>Grâce à l'attribut .toLowerCase(), le code ne dinstingue pas les majuscules et les minuscules (ex italie = Italie = ITALIE). <br>
Le jeu se termine lorsque la pioche est vide (nous avons défini une constante nombre_cartes = 20) ou lorsque les joueurs atteignent le score de 13 points. <br>
<br>Déroulement du jeu :
- le code commence par demander à l'utilisateur le nombre de joueurs et leurs prénoms
- le 1er tour démarre. Une nouvelle carte de 5 mots aléatoires distincts choisis dans le dictionnaire donné (150 mots) est générée et affichée dans la console. Le joueur 1 est incité à choisir un chiffre entre 1 et 5, ce qui donnera le mot à faire deviner.
- les autres joueurs donnent tour à tour leur indice (différent du mot caché), qui sera entré dans la console et stocké dans une liste d'indices
- une fois que tous les joueurs ont donné leur indices, on sélectionne parmi ceux-ci les indices valides et on les renvoie au joueur 1
- le joueur 1 propose un mot qu'on compare avec le mot caché et s'il réussit, le nombre de points est augmenté de 1
- la pioche perd 1 carte, et c'est maintenant au joueur 2
- les tours continuent jusqu'à ce que les joueurs atteignent 13 points ou que la pioche soit vide
- après la fin de la partie, le score est affiché
