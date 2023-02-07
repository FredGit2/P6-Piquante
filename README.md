 MISE EN ROUTE DU PROJET


1) cloner le repository

2) Dans le terminal de commande, depuis le dossier frontend, taper npm install puis npm run start ou npm start.
Le serveur doit fonctionner sur localhost avec le port par défaut 4200.

3) Créer un compte sur MongoDB s'il n'est pas déja créé sur le site: https://www.mongodb.com/try#community.

4) Depuis MongoDB créér un utilisateur s'il n 'est pas déjà créé.

5) Dans le dossier backend, créé un fichier .env pour y stocker vos variables d'environnements.

6) Dans le fichier .env, insérer la variable suivante: 
MONGO_CONNECT = "mongodb+srv://<USER>:<PASSWORD>@<HOST>/<DATABASENAME>?retryWrites=true&w=majority".
il s'agit ici d'un exemple, la véritable variable se trouve Depuis MongoDB Atlas, cliquez sur le bouton Connect et choisissez Connect your application.
Sélectionnez bien la version la plus récente du driver Node.js, puis Connection String Only, et faites une copie de la chaîne de caractères retournée.

7) Dans le terminal de commande, depuis le dossier backend, taper npm install puis node server ou nodemon server.
Le serveur doit fonctionner sur localhost avec le port par défaut 3000.
