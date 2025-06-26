-- Création de la base et sélection

DROP DATABASE IF EXISTS ns;
CREATE DATABASE IF NOT EXISTS ns DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ns;

-- Table utilisateur
CREATE TABLE `utilisateur` (
  `ID_Utilisateur` int NOT NULL AUTO_INCREMENT,
  `idClient` int DEFAULT NULL,
  `idProprietaire` int DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `Date_Creation` date DEFAULT NULL,
  `idSalarie` int DEFAULT NULL,
  PRIMARY KEY (`ID_Utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table station
CREATE TABLE `station` (
  `ID_Station` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Station`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table equipement
CREATE TABLE `equipement` (
  `ID_Equipement` int NOT NULL AUTO_INCREMENT,
  `Nom_Equipement` varchar(100) NOT NULL,
  `Categorie` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Equipement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table client
CREATE TABLE `client` (
  `ID_Utilisateur` int NOT NULL,
  `idClient` int NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `Mot_De_Passe` varchar(255) NOT NULL,
  `Adresse` varchar(255) NOT NULL,
  `Ville` varchar(255) NOT NULL,
  `CP` varchar(10) NOT NULL,
  `Telephone` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`ID_Utilisateur`, `idClient`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table proprietaire
CREATE TABLE `proprietaire` (
  `ID_Utilisateur` int NOT NULL,
  `idProprietaire` int NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `Adresse` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_Utilisateur`, `idProprietaire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table salarie
CREATE TABLE `salarie` (
  `ID_Utilisateur` int NOT NULL,
  `idSalarie` int NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `mdp` varchar(45) NOT NULL,
  PRIMARY KEY (`idSalarie`, `ID_Utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table appartement (sans contraintes FK vers image pour l’instant)
CREATE TABLE `appartement` (
  `ID_Appartement` int NOT NULL AUTO_INCREMENT,
  `Nom_Immeuble` varchar(100) NOT NULL,
  `Adresse` varchar(255) NOT NULL,
  `CP` varchar(10) NOT NULL,
  `Ville` varchar(100) NOT NULL,
  `Exposition` varchar(50) DEFAULT NULL,
  `Surface_Habitable` decimal(10,2) DEFAULT NULL,
  `Surface_Balcon` decimal(10,2) DEFAULT NULL,
  `Capacite_Accueil` int DEFAULT NULL,
  `Distance_Pistes` decimal(10,2) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Tarif` int NOT NULL,
  `ID_Station` int NOT NULL,
  `ID_Utilisateur` int NOT NULL,
  `idImage` int DEFAULT NULL,
  PRIMARY KEY (`ID_Appartement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table image (sans contraintes FK vers appartement pour l’instant)
CREATE TABLE `image` (
  `idImage` int NOT NULL AUTO_INCREMENT,
  `ID_Appartement` int NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`idImage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table reservation
CREATE TABLE `reservation` (
  `ID_Reservation` int NOT NULL AUTO_INCREMENT,
  `DateReservation` date NOT NULL,
  `DateDebut` date NOT NULL,
  `DateFin` date NOT NULL,
  `Montant_Total` decimal(10,2) NOT NULL,
  `ID_Utilisateur` int NOT NULL,
  `ID_Appartement` int NOT NULL,
  PRIMARY KEY (`ID_Reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table contrat
CREATE TABLE `contrat` (
  `idcontrat` int NOT NULL AUTO_INCREMENT,
  `ID_Utilisateur` int NOT NULL,
  `ID_Appartement` int NOT NULL,
  `dateSignature` date DEFAULT (curdate()),
  `etatContrat` enum('Actif','Inactif') DEFAULT 'Actif',
  `annéeContrat` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`idcontrat`,`ID_Utilisateur`,`ID_Appartement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table appartements_equipements
CREATE TABLE `appartements_equipements` (
  `id_appartement` int NOT NULL,
  `id_equipement` int NOT NULL,
  PRIMARY KEY (`id_appartement`, `id_equipement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--------------------------------------------------------------------------------
-- AJOUT DES CONTRAINTES FOREIGN KEY après coup

-- Appartement
ALTER TABLE `appartement`
  ADD KEY `FK_Appartement_Station` (`ID_Station`),
  ADD KEY `FK_Appartement_Tarif` (`Tarif`),
  ADD KEY `FK_Appartement_Proprietaire` (`ID_Utilisateur`),
  ADD KEY `fk_appartement_idImage` (`idImage`);

-- Image
ALTER TABLE `image`
  ADD KEY `fk_image_ID_Appartement` (`ID_Appartement`);

-- Foreign keys&nbsp;: (attention aux ON DELETE, adapte si besoin)
ALTER TABLE `appartement`
  ADD CONSTRAINT `fk_appartement_idImage`
    FOREIGN KEY (`idImage`) REFERENCES `image` (`idImage`) ON DELETE CASCADE;

ALTER TABLE `image`
  ADD CONSTRAINT `fk_image_ID_Appartement`
    FOREIGN KEY (`ID_Appartement`) REFERENCES `appartement` (`ID_Appartement`) ON DELETE CASCADE;

--------------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS=0;

CREATE OR REPLACE VIEW `appartement_dispo` AS
SELECT
    a.`ID_Appartement`,
    a.`Adresse`,
    a.`Tarif`
FROM
    `appartement` a
WHERE
    NOT EXISTS (
        SELECT 1
        FROM `reservation` r
        WHERE
            r.`ID_Appartement` = a.`ID_Appartement`
            AND CURDATE() BETWEEN r.`DateDebut` AND r.`DateFin`
    );


CREATE OR REPLACE VIEW `reservations_utilisateur` AS
SELECT
    r.`ID_Reservation`,
    r.`ID_Utilisateur`,
    r.`DateReservation`,
    r.`Montant_Total`,
    c.`prenom` AS `Prenom`,
    c.`nom` AS `Nom`
FROM
    `reservation` r
    JOIN `utilisateur` u ON r.`ID_Utilisateur` = u.`ID_Utilisateur`
    JOIN `client` c ON u.`ID_Utilisateur` = c.`ID_Utilisateur`;


CREATE OR REPLACE VIEW `vuereservation` AS
SELECT
    rs.`ID_Reservation`,
    rs.`ID_Utilisateur`,
    rs.`DateReservation`,
    rs.`Montant_Total`,
    r.`DateDebut`,
    r.`DateFin`,
    r.`ID_Appartement`,
    a.`Nom_Immeuble`,
    a.`Adresse`,
    a.`CP`,
    a.`Ville`,
    a.`Exposition`,
    a.`Surface_Habitable`,
    a.`Surface_Balcon`,
    a.`Capacite_Accueil`,
    a.`Distance_Pistes`,
    a.`Description`,
    a.`Tarif`,
    i.`image`
FROM
    `reservation` rs
    JOIN `reservation` r ON r.`ID_Reservation` = rs.`ID_Reservation`
    JOIN `appartement` a ON r.`ID_Appartement` = a.`ID_Appartement`
    JOIN `image` i ON a.`idImage` = i.`idImage`;
	
INSERT INTO `utilisateur` VALUES
(3,3,NULL,'TRIGGER','2025-01-24',NULL),
(4,4,1,'Pereira','2025-01-24',NULL),
(5,5,2,'Sauvage','2025-01-24',NULL),
(7,1,NULL,'per','2025-02-17',NULL);

INSERT INTO `station` VALUES
(1,'Chamonix'),
(2,'Val Thorens'),
(3,'Méribel'),
(4,'Les Arcs'),
(5,'La Plagne'),
(6,'Tignes'),
(7,'Les Deux Alpes'),
(8,'Courchevel'),
(9,'Alpe d’Huez'),
(10,'Megève');

INSERT INTO `equipement` VALUES
(8,'Wi-Fi','Confort'),
(9,'Climatisation','Confort'),
(10,'Chauffage','Confort'),
(11,'Télévision','Confort'),
(12,'Cuisine équipée','Cuisine'),
(13,'Lave-vaisselle','Cuisine'),
(14,'Four','Cuisine'),
(15,'Micro-ondes','Cuisine'),
(16,'Réfrigérateur','Cuisine'),
(17,'Piscine privée','Loisirs'),
(18,'Jacuzzi','Loisirs'),
(19,'Parking','Extérieur'),
(20,'Balcon','Extérieur'),
(21,'Barbecue','Extérieur'),
(22,'Sèche-cheveux','Salle de bain'),
(23,'Serviettes','Salle de bain'),
(24,'Savon et shampoing','Salle de bain'),
(25,'Lit double','Chambre'),
(26,'Lit bébé','Chambre'),
(27,'Extincteur','Sécurité'),
(28,'Détecteur de fumée','Sécurité'),
(29,'Chaise haute','Équipements pour bébés'),
(30,'Rampe d\'accès pour fauteuil roulant','Accessibilité'),
(31,'Panneaux solaires','Eco-responsabilité'),
(32,'Smart TV','Équipements technologiques');


INSERT INTO `client` VALUES
(4,4,'Benjamin','Pereira','a@gmail.com','456','9 Place des Ternes','Paris','75017',NULL),
(5,5,'Lyam','Sauvage','b@gmail.com','123','24 Place des Gaullois','Aulnay-sous-Bois','93010','0602351428'),
(7,1,'ben','per','benjaminpereira7515@gmail.com','123','paris','paris','75017',NULL);


INSERT INTO `proprietaire` VALUES
(4,1,'Pereira','Benjamin','9 Place des Ternes'),
(5,2,'Sauvage','Lyam','24 Place des Gaullois');


INSERT INTO `salarie` VALUES
(6,1,'Pereira','Benjamin','tst@ns.com','123');


INSERT INTO `appartement` VALUES
(1,'Immeuble Les Édelweiss','15 Rue des Alpes','74400 ','Chamonix','Sud',55.00,5.00,6,100.00,'',150,1,1,1),
(2,'Résidence Le Glacier','27 Avenue de l\'Aiguille','74400','Chamonix','Nord',35.00,10.00,4,500.00,'Appartement exposé plein Sud à seulement 10 m des piste',90,1,1,2),
(6,'Résidence Les Étoiles Alpines','8 Avenue des Sommets','73440 ','Val Thorens','Ouest',60.00,10.00,6,10.00,'Grand appartement moderne avec accès direct aux pistes, doté d’une cheminée et d’un balcon offrant des couchers de soleil splendides.',180,2,1,6),
(7,'Le Chalet des Cimes','15 Chemin de la Neige','73440','Val Thorens','Est',35.00,0.00,2,150.00,'Petit studio chaleureux parfait pour les escapades romantiques. Situé à proximité des commerces et des restaurants.',90,2,1,7),
(8,'Les Chalets du Caron','25 Boulevard des Glaciers','73440 ','Val Thorens','Ouest',70.00,14.00,7,15.00,'Appartement spacieux avec une décoration moderne, situé dans une résidence calme avec un accès direct aux pistes.',250,2,1,8),
(9,'Immeuble Les Neiges Éternelles','14 Rue des Alpages','73550 ','Méribel','Sud',50.00,10.00,5,20.00,'Appartement lumineux avec une grande terrasse offrant une vue magnifique sur les montagnes, idéal pour des vacances en famille.',180,3,1,9),
(11,'Les Terrasses de l\'Aiguille','25 Rue des Glaciers','73700 ','Les Arcs','Ouest',60.00,12.00,6,150.00,'Appartement spacieux avec vue sur la vallée et une cheminée pour se détendre après une journée sur les pistes.',220,4,1,11),
(12,'Immeuble Le Grand Col',' 30 Rue des Sommets','73700 ','Les Arcs','Nord',40.00,5.00,4,100.00,'Appartement cosy avec un accès direct aux pistes et un local à skis pratique.',140,4,1,12),
(13,'Résidence Les Cristaux Blancs','18 Boulevard des Cimes','73210 ','La Plagne','Sud-Est',70.00,15.00,8,25.00,'Grand appartement avec une décoration moderne et des équipements haut de gamme, parfait pour les groupes ou familles nombreuses.',300,5,1,13),
(14,'Les Chalets de Bellecôte','5 Impasse des Chalets','73210 ','La Plagne','Sud',45.00,0.00,4,500.00,'Appartement chaleureux dans une résidence calme, situé à proximité des commerces et des restaurants.',120,5,1,14),
(15,'Immeuble L\'Étoile des Glaciers','12 Chemin du Lac','73320','Tignes','Ouest',55.00,8.00,5,10.00,'Appartement moderne avec vue sur le lac gelé, situé dans le centre de la station. Idéal pour un accès facile aux pistes et aux activités.',200,6,1,15),
(16,'Résidence Les Sommets Enneigés','22 Rue des Alpages','73320 ','Tignes','Nord-Est',40.00,6.00,4,300.00,'Appartement cosy avec cuisine équipée, idéal pour les familles ou les petits groupes souhaitant être au cœur des activités.',130,6,1,16),
(17,'Chalet L\'Aurore','9 Rue des Glaciers','38860 ','Les Deux Alpes','Sud-Ouest',80.00,20.00,10,50.00,'Chalet luxueux avec un grand salon, des baies vitrées et une vue imprenable sur les montagnes. Jacuzzi disponible.',400,7,1,17),
(18,'Immeuble Les Balcons des Sommets','3 Avenue du Centre','38860 ','Les Deux Alpes','Est',45.00,0.00,4,20.00,'Appartement situé au cœur de la station, à quelques pas des écoles de ski et des commerces.',120,7,1,18),
(23,'Immeuble Le Grand Refuge','10 Rue de la Sapinière','73440 ','Val Thorens','Sud',42.00,0.00,3,90.00,'Charmant appartement à proximité des écoles de ski, idéal pour les débutants ou les familles avec enfants.',100,2,5,21),
(24,'Immeuble Les Cimes Dorées','25 Allée des Chalets','73120','Courchevel','Est',65.00,10.00,6,15.00,'Appartement élégant avec un mobilier contemporain et une vue magnifique sur la vallée enneigée.',250,8,5,22),
(25,'Chalet Soleil Levant','20 Rue des Édelweiss','38750 ','Alpe d’Huez','Sud',100.00,15.00,8,50.00,'Chalet haut de gamme avec jacuzzi et vue panoramique sur les montagnes, parfait pour des vacances de luxe.',400,9,2,31),
(26,'Immeuble Le Chalet de l’Horizon','21 Chemin des Edelweiss','73550','Méribel','Ouest',70.00,15.00,6,1500.00,'Appartement élégant dans un immeuble typiquement savoyard. Décoration chaleureuse avec bois naturel, cheminée et grande baie vitrée donnant sur une vue panoramique. Cuisine équipée et deux chambres spacieuses.',220,3,4,43),
(34,'Test','8 rue du destin','25489','Courchevel','Nord',10.00,2.00,2,10.00,'Un test pour voir si ça fonctionne bien',110,8,4,47);


INSERT INTO `image` VALUES
(1,1,'images\\ImageAppartement\\1\\minia.jpg'),
(2,2,'images\\ImageAppartement\\2\\1.jpg'),
(6,6,'images\\ImageAppartement\\image.png'),
(7,7,'images\\ImageAppartement\\image.png'),
(8,8,'images\\ImageAppartement\\image.png'),
(9,9,'images\\ImageAppartement\\image.png'),
(11,11,'images\\ImageAppartement\\image.png'),
(12,12,'images\\ImageAppartement\\image.png'),
(13,13,'images\\ImageAppartement\\image.png'),
(14,14,'images\\ImageAppartement\\image.png'),
(15,15,'images\\ImageAppartement\\image.png'),
(16,16,'images\\ImageAppartement\\image.png'),
(17,17,'images\\ImageAppartement\\image.png'),
(18,18,'images\\ImageAppartement\\image.png'),
(21,23,'images/ImageAppartement/23/1.jpg'),
(22,24,'images/ImageAppartement/24/Rubis_wc.jpg'),
(23,24,'images/ImageAppartement/24/Rubis_vue.jpg'),
(24,24,'images/ImageAppartement/24/Rubis_sdb2.jpg'),
(25,24,'images/ImageAppartement/24/Rubis_sdb.jpg'),
(26,24,'images/ImageAppartement/24/Rubis_salon_2.jpg'),
(27,24,'images/ImageAppartement/24/Rubis_coin_repas3.jpg'),
(28,24,'images/ImageAppartement/24/Rubis_coin_repas.jpg'),
(29,24,'images/ImageAppartement/24/Rubis_coin_nuit2.jpg'),
(30,24,'images/ImageAppartement/24/Rubis_coin_nuit.jpg'),
(31,25,'images/ImageAppartement/25/SALON ENTREE 2.jpg'),
(32,25,'images/ImageAppartement/25/IMG_20240511_165537.jpg'),
(33,25,'images/ImageAppartement/25/SALON ENTREE.jpg'),
(34,25,'images/ImageAppartement/25/Appt-LeSavoy_Vue-balcon.jpg'),
(35,25,'images/ImageAppartement/25/P1000508.jpg'),
(36,25,'images/ImageAppartement/25/Appt-LeSavoy_Sdb.jpg'),
(37,25,'images/ImageAppartement/25/CHAMBRE2.jpg'),
(38,25,'images/ImageAppartement/25/Appt-LeSavoy_Chambre3.jpg'),
(39,25,'images/ImageAppartement/25/Appt-LeSavoy_Chambre2bis.jpg'),
(40,25,'images/ImageAppartement/25/Appt-LeSavoy_Chambre2.jpg'),
(41,25,'images/ImageAppartement/25/Appt-LeSavoy_Chambre1.jpg'),
(42,25,'images/ImageAppartement/25/Appt-LeSAvoy_Cuisine.jpg'),
(43,26,'images/ImageAppartement/26/Chalet-Bionnassay _Jardin.jfif'),
(47,34,'images/ImageAppartement/34/Chalet-Bionnassay _Jardin.jfif');


INSERT INTO `reservation` VALUES
(6,'2025-01-11','2025-01-13','2025-01-14',0.00,5,2),
(8,'2025-02-12','2025-01-03','2025-01-04',90.00,5,2),
(9,'2025-01-13','2025-01-06','2025-01-08',300.00,5,1),
(10,'2025-02-17','2025-02-17','2025-02-18',0.00,1,25),
(11,'2025-02-17','2025-02-17','2025-02-18',220.00,1,11),
(12,'2025-02-17','2025-02-17','2025-02-18',0.00,1,2),
(13,'2025-02-17','2025-02-17','2025-02-18',0.00,1,1),
(14,'2025-02-17','2025-02-24','2025-02-25',0.00,1,1),
(15,'2025-02-17','2025-02-20','2025-02-22',300.00,1,1),
(16,'2025-02-17','2025-02-26','2025-02-27',149.00,1,1),
(17,'2025-02-17','2025-03-01','2025-03-02',149.00,1,1),
(18,'2025-02-17','2025-03-04','2025-03-05',142.50,1,1),
(19,'2025-02-17','2025-03-06','2025-03-07',142.00,1,1),
(20,'2025-02-17','2025-03-08','2025-03-09',142.00,1,1),
(21,'2025-02-17','2025-03-10','2025-03-11',142.00,1,1),
(22,'2025-02-17','2025-04-01','2025-04-02',142.50,1,1),
(23,'2025-02-17','2025-04-14','2025-04-18',0.00,1,1),
(24,'2025-02-17','2025-05-19','2025-05-24',0.00,1,1),
(28,'2025-03-31','2025-03-31','2025-04-01',0.00,1,9),
(29,'2025-03-31','2025-04-02','2025-04-03',0.00,1,9),
(30,'2025-03-31','2025-01-27','2025-01-28',171.00,1,9),
(31,'2025-04-14','2025-04-14','2025-04-15',162.45,1,9),
(32,'2025-04-14','2025-04-16','2025-04-17',162.45,1,9),
(33,'2025-04-14','2025-04-14','2025-04-15',85.00,1,7),
(34,'2025-04-14','2025-04-16','2025-04-17',85.00,1,7),
(37,'2025-04-14','2025-04-18','2025-04-20',171.00,1,7),
(49,'2025-04-14','2025-04-21','2025-04-24',256.50,5,7),
(50,'2025-04-24','2025-10-01','2025-10-05',360.00,1,7),
(68,'2025-05-04','2025-05-07','2025-05-08',237.50,4,24),
(70,'2025-05-04','2025-05-05','2025-05-06',90.00,4,2);

INSERT INTO `contrat` VALUES
(4,35,5,'2025-03-24','Actif','2025'),
(3,1,1,'2025-03-24','Actif','2025');


INSERT INTO `appartements_equipements` VALUES
(34,10),
(34,12),
(34,15),
(34,17),
(34,31),
(34,32),
(35,10);

SET FOREIGN_KEY_CHECKS=1;

--search -> 2 root
--home -> 1 root