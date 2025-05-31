## 1. Présentation du projet

**Neige & Soleil V4** est une application web de gestion des locations saisonnières et des activités en station de montagne. Elle permet aux clients de réserver des logements, de s'inscrire à des activités culturelles, sportives ou de détente, et aux propriétaires de gérer leurs offres. L'application inclut également un espace administrateur pour le suivi global de l'activité et des revenus.

Ce projet a été développé dans un contexte pédagogique simulant la commande d'une entreprise fictive, **Neige & Soleil**, spécialisée dans la location d'appartements et l'organisation d'activités touristiques en montagne.

### 🎯 Objectifs principaux :
- Offrir une **expérience de réservation fluide** pour les clients
- Permettre aux **propriétaires** de gérer facilement leurs logements
- Fournir à l’administrateur un **dashboard statistique** complet
- Intégrer une **gestion des saisons**, des **tarifs dynamiques**, et un **système de réservation d'activités**

### ⚙️ Technologies utilisées :

**Frontend** :
- HTML
- CSS
- JavaScript
- Bootstrap

**Backend** :
- Node.js
- Express.js

**Base de données** :
- MySQL 8

**Autres modules utilisés** :
- `bcrypt` : sécurisation des mots de passe
- `dotenv` : gestion des variables d’environnement
- `multer` : gestion des fichiers (upload images)
- `nodemailer` : envoi d’e-mails
- `pdfkit` : génération de fichiers PDF (contrats)

L’architecture du projet est pensée pour être claire, évolutive et modulaire, avec une séparation nette entre les rôles (client, propriétaire, admin), et une base de données robuste.

## 2. Architecture générale du projet

Le projet est structuré selon une architecture MVC simplifiée avec séparation entre le front-end, le back-end et la base de données.  
Afin de réduire le nombre de fichiers et de faciliter la lecture, nous avons regroupé les modèles, contrôleurs et routes de chaque entité dans un seul fichier par domaine fonctionnel (logement, activité, utilisateur, etc.).

### 📁 Organisation des dossiers

NeigeEtSoleil_V4/
├── Backend/
│   └── src/
│       ├── routes/             ← Fichiers combinés par entité (route + logique + requêtes SQL)
│       ├── utils/              ← Connexion à la base de données
│       ├── Contrats/           ← PDFs générés automatiquement
│       └── server.js           ← Point d’entrée du serveur Express
├── Frontend/
│   └── Append/
│       ├── *.html              ← Pages du site (accueil, dashboard, réservations...)
│       └── assets/
│           ├── css/            ← Feuilles de style
│           ├── img/            ← Images utilisées dans l’interface
│           └── vendor.tar      ← Librairies tierces (Bootstrap, etc.)
├── .env                        ← Configuration de la base de données
├── package.json                ← Dépendances du backend Node.js
### 🔁 Communication Frontend ↔ Backend

Dans ce projet, le **frontend** (interface utilisateur en HTML/CSS/JS) et le **backend** (serveur Node.js avec Express) sont séparés, mais ils communiquent en permanence via des requêtes HTTP.

#### Fonctionnement général

- Le **frontend** envoie des requêtes au serveur backend via **fetch()** ou **AJAX**.
  Exemple : lorsqu’un utilisateur veut réserver un logement, le frontend envoie une requête POST vers une route comme `/reservation`.

- Le **backend** traite cette requête grâce à **Express.js**, effectue les opérations nécessaires (connexion à la base de données, vérifications, envoi de mail, génération de contrat...) puis **renvoie une réponse**.

- Les réponses du backend sont envoyées au **format JSON**, ce qui permet au frontend d’actualiser dynamiquement l’interface sans recharger la page.

#### Exemple concret

1. Un client clique sur "Réserver ce logement" sur le site.
2. Un script JS envoie une requête POST avec les données de réservation à l’URL `/reservation` du backend.
3. Le backend (dans `routes/reservation.js`) :
   - vérifie que le logement est disponible,
   - insère la réservation dans la base de données MySQL,
   - retourne un message de confirmation ou d’erreur au frontend.
4. Le frontend affiche une alerte ou redirige vers la page de confirmation.

#### Configuration CORS

- Le **CORS (Cross-Origin Resource Sharing)** est activé dans le backend pour **autoriser uniquement** les requêtes provenant du frontend local (en développement) :
Origine autorisée : http://127.0.0.1:5500
Cela signifie que si quelqu’un tente d’accéder à l’API depuis un autre domaine (ex. : un site malveillant), la requête sera bloquée par sécurité.

#### Fichiers statiques (images)

- Le backend est aussi responsable de servir les **images** des logements et activités.
- Une route comme `/assets/img/logement/maison.jpg` permet d’afficher une image stockée localement dans le dossier `Frontend/Append/assets/img`.

---

👉 Ce système garantit une **bonne séparation des rôles** :
- le **frontend** s’occupe de l’affichage et de l’interaction avec l’utilisateur,
- le **backend** gère la logique, les données, la sécurité, et les traitements métier.

### 🛠 Environnement de développement

Voici les étapes pour installer, configurer et exécuter le projet en local.

#### 1. Prérequis

Avant de commencer, tu dois avoir installé sur ta machine :

- [Node.js](https://nodejs.org/) (version recommandée : 18+)
- [MySQL Server](https://dev.mysql.com/)
- Un gestionnaire de base de données (ex : phpMyAdmin, DBeaver ou MySQL Workbench)

---

#### 2. Installation du projet

Voici les étapes pour installer, configurer et exécuter le projet en local :

1. **Cloner ou extraire** le projet dans un dossier local :  
   Le projet est disponible sur GitHub à l’adresse suivante :  
   👉 https://github.com/Nabil-Touinsi/NeigeEtSoleil_V4.git  
   **Branche :** `main`  

   Pour le cloner avec Git :  
   ```bash
   git clone -b main https://github.com/Nabil-Touinsi/NeigeEtSoleil_V4.git
   ```

   Ou bien, tu peux télécharger le `.zip` depuis GitHub puis l’extraire localement.

2. **Ouvrir un terminal** dans le dossier `Backend/src/` :
   ```bash
   cd NeigeEtSoleil_V4/Backend/src/
   ```

3. **Installer les dépendances Node.js** :
   ```bash
   npm install
   ```

4. **Configurer la base de données** :  
   - Créer une base de données MySQL nommée :
     ```sql
     CREATE DATABASE neigeetsoleil_v4;
     ```
   - Importer le script SQL fourni (via phpMyAdmin, MySQL Workbench ou tout autre outil) pour créer les tables et insérer les données.  
   - Créer un fichier `.env` dans `Backend/src/` avec le contenu suivant :

     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=neigeetsoleil_v4
     PORT=3000
     ```

     Remplace `your_password` par ton mot de passe MySQL.

5. **Lancer le serveur backend** :  
   Toujours dans `Backend/src/`, exécuter :
   ```bash
   npm start
   ```
   Le serveur tourne alors sur :  
   👉 http://localhost:3000

6. **Accéder au frontend** :  
   Le frontend est constitué de fichiers HTML statiques que tu peux ouvrir directement dans ton navigateur.

   Il est recommandé d’utiliser l’extension **Live Server** (sur VS Code) pour plus de confort.

   Exemple pour accéder à la page d’accueil :  
   👉 http://127.0.0.1:5500/Frontend/Append/index.html

### 3. Modélisation de la base de données

La base de données `neigeetsoleil_v4` repose sur un schéma relationnel structuré, combinant **entités principales**, **activités spécialisées**, **tarifs dynamiques**, **vues analytiques**, et **relations** entre logements, saisons, utilisateurs et réservations.

---

#### 🔑 Entités principales

- **utilisateur**  
  - `id_utilisateur` *(PK)*  
  - `nom`, `prenom`, `email`, `mot_de_passe`, `role`, `date_creation`  
  - `role` : `'client'`, `'proprietaire'`, `'admin'`

- **proprietaire**  
  - `id_proprietaire` *(PK)*  
  - `id_utilisateur` *(FK → utilisateur)*  
  - `logements` *(type JSON : liste des logements gérés)*

- **logement**  
  - `id_logement` *(PK)*  
  - `id_proprietaire` *(FK → utilisateur)*  
  - `nom_immeuble`, `adresse`, `code_postal`, `ville`, `type_logement`, `surface_habitable`, `capacite_accueil`, `specifite`, `photo`

- **contrat**  
  - `id_contrat` *(PK)*  
  - `id_proprietaire` *(FK)*, `id_logement` *(FK)*  
  - `date_debut`, `date_fin`, `statut`

- **reservation**  
  - `id_reservation` *(PK)*  
  - `id_utilisateur`, `id_logement` *(FK)*  
  - `date_debut`, `date_fin`, `statut`

- **saison**  
  - `id_saison` *(PK)*  
  - `nom` : `'haute'`, `'moyenne'`, `'basse'`  
  - `date_debut`, `date_fin`

- **region**  
  - `id_region` *(PK)*  
  - `nom_region`

- **station**  
  - `id_station` *(PK)*  
  - `nom`, `id_region` *(FK → region)*

---

#### 🎯 Activités : hiérarchie et spécialisation

- **activite_generale**  
  - `id_activite` *(PK)*, `nom_activite`, `id_station` *(FK)*, `image`

- **activite_culturelle**, **activite_detente**, **activite_sportive** *(héritent de activite_generale via `id_activite`)*

  | Table                | Champs spécifiques                                       |
  |----------------------|-----------------------------------------------------------|
  | activite_culturelle  | `duree`, `public_cible` *(enum : enfants, adultes, tous)* |
  | activite_detente     | `type_detente`, `description`                             |
  | activite_sportive    | `type_sport`, `niveau_difficulte` *(enum)*               |

- **equipement**  
  - `id_equipement` *(PK)*  
  - `nom_equipement`, `description`, `id_activite` *(FK)*

---

#### 💸 Tarification dynamique

- **tarif**  
  - `id_tarif` *(PK)*  
  - `id_logement` *(nullable)*  
  - `id_activite` *(nullable)*  
  - `id_saison` *(FK)*  
  - `prix`  
  - **Règle de validation** : soit un tarif pour un logement **ou** pour une activité (pas les deux en même temps)

- **tarif_activite**  
  - `id_tarif_activite`, `id_tarif` *(FK)*, `id_activite` *(FK)*, `description`

---

#### 📅 Réservations

- **reservation_activite**  
  - `id_reservation` *(PK)*  
  - `id_utilisateur` *(FK)*, `id_activite` *(FK)*  
  - `date_reservation`, `statut`, `nombre_personnes`, `prix_total`

- **archive_resa**  
  - Contient les réservations supprimées ou archivées : `id`, `nom_client`, `email`, `date_reservation`, `id_logement`

---

#### 📊 Statistiques et vues

La base utilise plusieurs **vues SQL** pour faciliter l’analyse des données :

| Vue                             | Objectif principal                                                |
|----------------------------------|-------------------------------------------------------------------|
| `logements_disponibles`         | Logements disponibles par saison avec prix                       |
| `logements_par_ville`           | Nombre de logements et capacité totale par ville                 |
| `activites_reservees_par_type`  | Nombre de réservations et revenus par type d’activité            |
| `reservations_confirmees`       | Liste des réservations confirmées avec détails utilisateur       |
| `reservations_en_attente`       | Réservations au statut "reserve"                                 |
| `reservations_par_mois`         | Nombre de réservations par mois et par an                        |
| `reservations_par_type_logement`| Statistiques par type de logement                                |
| `reservations_utilisateur`      | Réservations passées par utilisateur                             |
| `revenus_par_logement_saison`   | Revenus générés par logement et saison                           |
| `vue_stations_activites_par_region` | Activités proposées selon les stations et régions          |

---

#### 📈 Suivi des revenus

- **suivi_revenus**  
  - `id_revenu` *(PK)*, `id_reservation` *(FK)*, `montant`, `date_revenu`

---

#### 🔗 Explication des relations (1-N, N-N, clés étrangères, contraintes)

La base de données `neigeetsoleil_v4` repose sur une modélisation relationnelle cohérente, articulée autour des relations suivantes :

---

##### 🔹 Relations **1-N** (Un à plusieurs)

| Relation                              | Détail                                                                 |
|---------------------------------------|------------------------------------------------------------------------|
| `utilisateur` → `logement`            | Un utilisateur propriétaire peut posséder plusieurs logements.         |
| `utilisateur` → `reservation`         | Un utilisateur peut effectuer plusieurs réservations.                 |
| `logement` → `reservation`            | Un logement peut être réservé plusieurs fois.                         |
| `proprietaire` → `contrat`            | Un propriétaire peut avoir plusieurs contrats avec différents logements. |
| `station` → `activite_generale`       | Une station propose plusieurs activités.                              |
| `region` → `station`                  | Une région contient plusieurs stations.                               |
| `saison` → `tarif`                    | Une saison est associée à plusieurs tarifs.                           |
| `reservation` → `suivi_revenus`       | Une réservation peut générer un ou plusieurs enregistrements de revenus. |

---

##### 🔹 Relations **N-N** (Plusieurs à plusieurs)

Ces relations sont modélisées par des tables d’association :

| Table d'association        | Liens établis entre...                                     |
|----------------------------|-------------------------------------------------------------|
| `reservation_activite`     | `utilisateur` et `activite_generale`                       |
| `tarif`                    | `saison` et soit `logement` soit `activite_generale`       |

> ⚠️ **Contrainte CHECK dans `tarif`** :
> ```sql
> CHECK (
>   (id_logement IS NOT NULL AND id_activite IS NULL)
>   OR (id_logement IS NULL AND id_activite IS NOT NULL)
> )
> ```
> Cette règle garantit qu’un tarif concerne **soit un logement, soit une activité**, mais jamais les deux.

---

##### 🔸 Clés étrangères et intégrité référentielle

Toutes les relations entre tables sont protégées par des **clés étrangères** avec l’option :

- `ON DELETE CASCADE` :  
  Lorsqu’un enregistrement parent est supprimé, ses dépendances sont automatiquement supprimées.  
  Exemple : Supprimer une `station` supprime toutes les `activites_generales` associées.

- **Clés étrangères typiques** :
  - `logement.id_proprietaire` → `utilisateur.id_utilisateur`
  - `reservation.id_logement` → `logement.id_logement`
  - `activite_generale.id_station` → `station.id_station`
  - `tarif.id_saison` → `saison.id_saison`
  - etc.

---

##### 🧩 Contraintes supplémentaires

- **Contraintes `UNIQUE`** :  
  - `utilisateur.email` est unique.
  
- **Enumérations** :  
  Certains champs sont limités à des valeurs prédéfinies (ex : `role`, `statut`, `type_logement`, etc.)

- **Intégrité des données** :  
  - Les données sont normalisées et cohérentes grâce aux relations et aux contraintes SQL définies.

---

Cette organisation garantit à la fois :

- la **cohérence des données** (via les clés étrangères),
- une **extensibilité** claire pour de futures fonctionnalités,
- une **structure optimisée** pour les requêtes analytiques (vues SQL, agrégats, etc.).

Cette modélisation relationnelle permet de gérer efficacement les aspects suivants :

- location de logements,
- réservations d’activités (culturelles, sportives, détente),
- tarification par saison,
- statistiques détaillées pour les dashboards,
- gestion fine des utilisateurs et propriétaires.

### 4. Fonctionnalités principales

L’application **Neige & Soleil V4** propose un ensemble de fonctionnalités adaptées à chaque type d’utilisateur : **Client**, **Propriétaire**, et **Administrateur**. Chacun a accès à une interface personnalisée selon ses droits.

---

#### 👤 Utilisateur **Client**
Le client représente une personne cherchant à louer un logement à la montagne et à participer à des activités saisonnières.

Fonctionnalités :
- 🔍 Rechercher et consulter les **logements disponibles** par région, ville, ou saison.
- 📅 Effectuer une **réservation de logement** sur une période donnée.
- 🎯 Réserver une **activité** (culturelle, détente ou sportive).
- 💬 Laisser un **avis** sur les logements et équipements utilisés. (NEIGEETSOLEIL_V5)
- 🔐 Modifier ses informations personnelles (nom, prénom, email, mot de passe).(NEIGEETSOLEIL_V5)

---

#### 🧑‍💼 Utilisateur **Propriétaire**
Le propriétaire est une personne disposant d’un ou plusieurs logements qu’il souhaite mettre en location via la plateforme.

Fonctionnalités :
- ➕ Ajouter un nouveau **logement** (photos, adresse, type, capacité, etc.).
- 📝 Gérer ses logements (mise à jour des informations).
- 📄 Suivre les **contrats de location** liés à ses logements.
- 💰 Suivre les **revenus générés** par ses locations selon les saisons.(NEIGEETSOLEIL_V5)
- 📊 Accéder à une vue synthétique de ses **performances de location**.(NEIGEETSOLEIL_V5)

---

#### 👨‍💻 Utilisateur **Administrateur**
L’administrateur dispose de droits étendus pour superviser l’ensemble du système et assurer sa bonne gestion.

Fonctionnalités :
- 👥 Gérer tous les **utilisateurs** (clients, propriétaires, admins).
- ✅ Valider et suivre les **contrats de location**.
- 📉 Consulter les **statistiques avancées** via des vues SQL :
  - Réservations par mois, logement, type...
  - Activités les plus réservées
  - Revenus par saison ou par logement
- 🏗️ Gérer les **stations**, **régions**, **saisons**, **tarifs**, ...
- 🗂️ Archiver automatiquement les anciennes réservations.

---

Chaque utilisateur est redirigé vers son interface spécifique dès la connexion, selon le rôle défini dans la base de données (`client`, `proprietaire`, `admin`). Cette séparation des rôles permet de **garantir la sécurité** des données et de **simplifier l’usage** de l’application pour chaque profil.

### 5. Sécurité et bonnes pratiques

L'application **Neige & Soleil V4** intègre plusieurs mesures de sécurité essentielles, ainsi que des bonnes pratiques pour garantir la fiabilité et la maintenabilité du projet.

---

#### 🔐 Gestion des mots de passe

- Les mots de passe des utilisateurs sont **hachés avec bcrypt** avant d’être stockés dans la base de données.
- Cela empêche toute récupération directe des mots de passe même en cas d’accès non autorisé à la base.

---

#### 🧑‍🏫 Rôles et permissions

Chaque utilisateur est associé à un **rôle** (`client`, `proprietaire`, `admin`) défini dans la base de données :
- Les **clients** peuvent consulter les logements disponibles et effectuer des réservations.
- Les **propriétaires** peuvent publier leurs logements pour les proposer à la location.
- Les **administrateurs** ont un accès complet à l’interface de gestion technique (utilisateurs, statistiques, contrats, revenus…).

L’interface et les routes backend utilisent ce rôle pour **restreindre l’accès** aux fonctionnalités sensibles.

---

#### 🧪 Fichier `.env` et configuration

Toutes les informations sensibles (identifiants de connexion à la base de données, ports, etc.) sont **centralisées dans un fichier `.env`** non versionné :

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=neigeetsoleil_v4
PORT=3000

### 7. Auteurs et crédits

---

#### 🧑‍💻 Réalisé par

Ce projet a été développé dans le cadre du **BTS SIO 2ème année** par le groupe suivant :

- **Nabil TOUINSI**
- **Emmanouil STAVRAKAKIS**
- **Tristan MOTTIER**

---

#### 👨‍🏫 Remerciements

Nous remercions chaleureusement nos enseignants pour leur accompagnement tout au long du projet :

- **Abderaman CHOUAKI**
- **Okacha BENAHMED**

---

#### 🎨 Template utilisée

Le front-end repose sur la template gratuite **Append** proposée par [BootstrapMade](https://bootstrapmade.com/append-bootstrap-website-template/)
