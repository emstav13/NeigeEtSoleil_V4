-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: neigeetsoleil_v4
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activite_culturelle`
--

DROP TABLE IF EXISTS `activite_culturelle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activite_culturelle` (
  `id_activite` int NOT NULL,
  `duree` int DEFAULT NULL,
  `public_cible` enum('enfants','adultes','tous') DEFAULT NULL,
  PRIMARY KEY (`id_activite`),
  CONSTRAINT `activite_culturelle_ibfk_1` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activite_culturelle`
--

LOCK TABLES `activite_culturelle` WRITE;
/*!40000 ALTER TABLE `activite_culturelle` DISABLE KEYS */;
INSERT INTO `activite_culturelle` VALUES (1,120,'tous'),(6,90,'adultes'),(7,60,'enfants');
/*!40000 ALTER TABLE `activite_culturelle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activite_detente`
--

DROP TABLE IF EXISTS `activite_detente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activite_detente` (
  `id_activite` int NOT NULL,
  `type_detente` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id_activite`),
  CONSTRAINT `activite_detente_ibfk_1` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activite_detente`
--

LOCK TABLES `activite_detente` WRITE;
/*!40000 ALTER TABLE `activite_detente` DISABLE KEYS */;
INSERT INTO `activite_detente` VALUES (2,'Balade en traîneau','Profitez d’une balade pittoresque en traîneau à travers des paysages enneigés.'),(3,'Yoga en altitude','Une séance de yoga en altitude pour se ressourcer et profiter d’un cadre unique.'),(8,'Thermes et spa','Détendez-vous avec une expérience thermale relaxante et profitez des bienfaits du spa.');
/*!40000 ALTER TABLE `activite_detente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activite_generale`
--

DROP TABLE IF EXISTS `activite_generale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activite_generale` (
  `id_activite` int NOT NULL AUTO_INCREMENT,
  `nom_activite` varchar(100) NOT NULL,
  `id_station` int NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_activite`),
  KEY `id_station` (`id_station`),
  CONSTRAINT `activite_generale_ibfk_1` FOREIGN KEY (`id_station`) REFERENCES `station` (`id_station`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activite_generale`
--

LOCK TABLES `activite_generale` WRITE;
/*!40000 ALTER TABLE `activite_generale` DISABLE KEYS */;
INSERT INTO `activite_generale` VALUES (1,'Visite du musée de la montagne',1,'assets/img/activite/visite_du_musee_de_la_montagne.jpg'),(2,'Balade en traîneau',2,'assets/img/activite/balade_en_traineau.jpg'),(3,'Yoga en altitude',3,'assets/img/activite/yoga_en_altitude.jpg'),(4,'Escalade sur glace',4,'assets/img/activite/escalade_sur_glace.jpg'),(5,'Ski hors-piste',5,'assets/img/activite/ski_horspiste.jpg'),(6,'Concert en plein air',6,'assets/img/activite/concert_en_plein_air.jpg'),(7,'Soirée contes et légendes',7,'assets/img/activite/soiree_contes_et_legendes.jpg'),(8,'Thermes et spa',8,'assets/img/activite/thermes_et_spa.jpg'),(9,'Randonnée nocturne',9,'assets/img/activite/randonnee_nocturne.jpg'),(10,'Snowboard freestyle',10,'assets/img/activite/snowboard_freestyle.jpg');
/*!40000 ALTER TABLE `activite_generale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activite_sportive`
--

DROP TABLE IF EXISTS `activite_sportive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activite_sportive` (
  `id_activite` int NOT NULL,
  `type_sport` varchar(50) DEFAULT NULL,
  `niveau_difficulte` enum('débutant','intermédiaire','avancé') DEFAULT NULL,
  PRIMARY KEY (`id_activite`),
  CONSTRAINT `activite_sportive_ibfk_1` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activite_sportive`
--

LOCK TABLES `activite_sportive` WRITE;
/*!40000 ALTER TABLE `activite_sportive` DISABLE KEYS */;
INSERT INTO `activite_sportive` VALUES (4,'Escalade sur glace','avancé'),(5,'Ski hors-piste','intermédiaire'),(9,'Randonnée nocturne','débutant'),(10,'Snowboard freestyle','avancé');
/*!40000 ALTER TABLE `activite_sportive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrat`
--

DROP TABLE IF EXISTS `contrat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrat` (
  `id_contrat` int NOT NULL AUTO_INCREMENT,
  `id_proprietaire` int NOT NULL,
  `id_logement` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` enum('actif','inactif','resilie') NOT NULL,
  PRIMARY KEY (`id_contrat`),
  KEY `id_proprietaire` (`id_proprietaire`),
  KEY `id_logement` (`id_logement`),
  CONSTRAINT `contrat_ibfk_1` FOREIGN KEY (`id_proprietaire`) REFERENCES `proprietaire` (`id_proprietaire`) ON DELETE CASCADE,
  CONSTRAINT `contrat_ibfk_2` FOREIGN KEY (`id_logement`) REFERENCES `logement` (`id_logement`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrat`
--

LOCK TABLES `contrat` WRITE;
/*!40000 ALTER TABLE `contrat` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipement`
--

DROP TABLE IF EXISTS `equipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipement` (
  `id_equipement` int NOT NULL AUTO_INCREMENT,
  `nom_equipement` varchar(100) NOT NULL,
  `description` text,
  `id_activite` int NOT NULL,
  PRIMARY KEY (`id_equipement`),
  KEY `id_activite` (`id_activite`),
  CONSTRAINT `equipement_ibfk_1` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipement`
--

LOCK TABLES `equipement` WRITE;
/*!40000 ALTER TABLE `equipement` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logement`
--

DROP TABLE IF EXISTS `logement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logement` (
  `id_logement` int NOT NULL AUTO_INCREMENT,
  `id_proprietaire` int NOT NULL,
  `nom_immeuble` varchar(100) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `code_postal` varchar(10) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `type_logement` enum('F1','F2','F3','F4','F5') NOT NULL,
  `surface_habitable` float NOT NULL,
  `capacite_accueil` int NOT NULL,
  `specifite` text,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_logement`),
  KEY `fk_proprietaire` (`id_proprietaire`),
  CONSTRAINT `fk_proprietaire` FOREIGN KEY (`id_proprietaire`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logement`
--

LOCK TABLES `logement` WRITE;
/*!40000 ALTER TABLE `logement` DISABLE KEYS */;
INSERT INTO `logement` VALUES (1,2,'Maison La Plagne','123 Rue des Alpes','73210','La Plagne','F5',120,8,'','maison_La_Plagne.jpg'),(2,3,'Maison Serre Chevalier','45 Route du Ski','05330','Serre Chevalier','F5',130,10,'Vue montagne','maison_Serre_Chevalier.jpg'),(3,2,'Maison Avoriaz','12 Chemin des Neiges','74110','Avoriaz','F4',140,9,'Accès direct au télésiège','maison_Avoriaz.jpg'),(4,3,'Maison Méribel','99 Avenue des Cimes','73550','Méribel','F4',110,7,'Centre-station','maison_Méribel.jpg'),(5,2,'Maison Alpe d\'Huez','8 Rue du Soleil','38750','Alpe d\'Huez','F3',95,6,'Proche des commerces','maison_Alpe_d_Huez.jpg'),(6,3,'Maison Les Deux Alpes','74 Rue du Glacier','38860','Les Deux Alpes','F5',150,12,'Terrasse avec vue','maison_Les_Deux_Alpes.jpg'),(7,2,'Maison Courchevel','3 Impasse des Sapins','73120','Courchevel','F5',160,12,'Luxe et confort','maison_Courchevel.jpg'),(8,3,'Maison Tignes','6 Avenue du Val Claret','73320','Tignes','F4',125,8,'À proximité du lac','maison_Tignes.jpg'),(9,2,'Maison Val Thorens','27 Place du Caron','73440','Val Thorens','F4',140,9,'Station en altitude','maison_Val_Thorens.jpg'),(10,3,'Maison Chamonix Mont-Blanc','5 Chemin du Brévent','74400','Chamonix Mont-Blanc','F5',170,14,'Vue sur le Mont-Blanc','maison_Chamonix_Mont_Blanc.jpeg');
/*!40000 ALTER TABLE `logement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `logements_disponibles`
--

DROP TABLE IF EXISTS `logements_disponibles`;
/*!50001 DROP VIEW IF EXISTS `logements_disponibles`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `logements_disponibles` AS SELECT 
 1 AS `id_logement`,
 1 AS `nom_immeuble`,
 1 AS `adresse`,
 1 AS `ville`,
 1 AS `type_logement`,
 1 AS `surface_habitable`,
 1 AS `capacite_accueil`,
 1 AS `specifite`,
 1 AS `photo`,
 1 AS `prix`,
 1 AS `saison_nom`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `proprietaire`
--

DROP TABLE IF EXISTS `proprietaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proprietaire` (
  `id_proprietaire` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  PRIMARY KEY (`id_proprietaire`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `proprietaire_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proprietaire`
--

LOCK TABLES `proprietaire` WRITE;
/*!40000 ALTER TABLE `proprietaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `proprietaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  `id_logement` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` enum('disponible','reserve') NOT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `id_logement` (`id_logement`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`id_logement`) REFERENCES `logement` (`id_logement`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,4,1,'2025-02-02','2025-02-03','reserve');
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_activite`
--

DROP TABLE IF EXISTS `reservation_activite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_activite` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  `id_activite` int NOT NULL,
  `date_reservation` date NOT NULL,
  `statut` enum('reserve','annule') DEFAULT 'reserve',
  PRIMARY KEY (`id_reservation`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `id_activite` (`id_activite`),
  CONSTRAINT `reservation_activite_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `reservation_activite_ibfk_2` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_activite`
--

LOCK TABLES `reservation_activite` WRITE;
/*!40000 ALTER TABLE `reservation_activite` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation_activite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `reservations_utilisateur`
--

DROP TABLE IF EXISTS `reservations_utilisateur`;
/*!50001 DROP VIEW IF EXISTS `reservations_utilisateur`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `reservations_utilisateur` AS SELECT 
 1 AS `id_reservation`,
 1 AS `id_utilisateur`,
 1 AS `id_logement`,
 1 AS `logement_nom`,
 1 AS `adresse`,
 1 AS `date_debut`,
 1 AS `date_fin`,
 1 AS `statut`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `saison`
--

DROP TABLE IF EXISTS `saison`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saison` (
  `id_saison` int NOT NULL AUTO_INCREMENT,
  `nom` enum('haute','moyenne','basse') NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  PRIMARY KEY (`id_saison`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saison`
--

LOCK TABLES `saison` WRITE;
/*!40000 ALTER TABLE `saison` DISABLE KEYS */;
INSERT INTO `saison` VALUES (1,'haute','2025-01-01','2025-03-31'),(2,'moyenne','2025-04-01','2025-06-30'),(3,'basse','2025-07-01','2025-09-30');
/*!40000 ALTER TABLE `saison` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station`
--

DROP TABLE IF EXISTS `station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station` (
  `id_station` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  PRIMARY KEY (`id_station`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station`
--

LOCK TABLES `station` WRITE;
/*!40000 ALTER TABLE `station` DISABLE KEYS */;
INSERT INTO `station` VALUES (1,'Chamonix-Mont-Blanc'),(2,'Val Thorens'),(3,'Tignes'),(4,'Courchevel'),(5,'Les Deux Alpes'),(6,'Alpe d’Huez'),(7,'La Plagne'),(8,'Méribel'),(9,'Avoriaz'),(10,'Serre Chevalier');
/*!40000 ALTER TABLE `station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarif`
--

DROP TABLE IF EXISTS `tarif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarif` (
  `id_tarif` int NOT NULL AUTO_INCREMENT,
  `id_logement` int DEFAULT NULL,
  `id_activite` int DEFAULT NULL,
  `id_saison` int NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_tarif`),
  KEY `id_logement` (`id_logement`),
  KEY `id_saison` (`id_saison`),
  KEY `tarif_ibfk_3` (`id_activite`),
  CONSTRAINT `tarif_ibfk_1` FOREIGN KEY (`id_logement`) REFERENCES `logement` (`id_logement`) ON DELETE CASCADE,
  CONSTRAINT `tarif_ibfk_2` FOREIGN KEY (`id_saison`) REFERENCES `saison` (`id_saison`) ON DELETE CASCADE,
  CONSTRAINT `tarif_ibfk_3` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE,
  CONSTRAINT `chk_tarif` CHECK ((((`id_logement` is not null) and (`id_activite` is null)) or ((`id_logement` is null) and (`id_activite` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarif`
--

LOCK TABLES `tarif` WRITE;
/*!40000 ALTER TABLE `tarif` DISABLE KEYS */;
INSERT INTO `tarif` VALUES (1,1,NULL,1,150.00),(2,1,NULL,2,100.00),(3,2,NULL,1,250.00),(4,3,NULL,3,80.00),(5,13,NULL,1,200.00),(6,NULL,1,1,15.00),(7,NULL,2,1,20.00),(8,NULL,3,1,10.00),(9,NULL,4,1,15.00),(10,NULL,5,2,25.00),(11,NULL,6,3,30.00),(12,NULL,7,2,12.00),(13,NULL,8,2,18.00),(14,NULL,9,3,22.00),(15,NULL,10,3,14.00);
/*!40000 ALTER TABLE `tarif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarif_activite`
--

DROP TABLE IF EXISTS `tarif_activite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarif_activite` (
  `id_tarif_activite` int NOT NULL AUTO_INCREMENT,
  `id_tarif` int NOT NULL,
  `id_activite` int NOT NULL,
  `description` text,
  PRIMARY KEY (`id_tarif_activite`),
  KEY `id_tarif` (`id_tarif`),
  KEY `id_activite` (`id_activite`),
  CONSTRAINT `tarif_activite_ibfk_1` FOREIGN KEY (`id_tarif`) REFERENCES `tarif` (`id_tarif`) ON DELETE CASCADE,
  CONSTRAINT `tarif_activite_ibfk_2` FOREIGN KEY (`id_activite`) REFERENCES `activite_generale` (`id_activite`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarif_activite`
--

LOCK TABLES `tarif_activite` WRITE;
/*!40000 ALTER TABLE `tarif_activite` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarif_activite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id_utilisateur` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('client','proprietaire','admin') NOT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'Dupont','Jean','jean.dupont@example.com','motdepasse123','client','2025-01-21 14:39:21'),(2,'test','test','test@example.com','test123','proprietaire','2025-01-21 17:26:57'),(3,'test','qtr','qtr@gmail.com','0000','proprietaire','2025-01-21 18:07:59'),(4,'test','cnq','t5@gmail.fr','0000','client','2025-01-21 21:36:27'),(6,'Touinsi','Nabil','n@gmail.com','0000','admin','2025-02-02 00:30:30');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `logements_disponibles`
--

/*!50001 DROP VIEW IF EXISTS `logements_disponibles`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `logements_disponibles` AS select `l`.`id_logement` AS `id_logement`,`l`.`nom_immeuble` AS `nom_immeuble`,`l`.`adresse` AS `adresse`,`l`.`ville` AS `ville`,`l`.`type_logement` AS `type_logement`,`l`.`surface_habitable` AS `surface_habitable`,`l`.`capacite_accueil` AS `capacite_accueil`,`l`.`specifite` AS `specifite`,`l`.`photo` AS `photo`,`t`.`prix` AS `prix`,`s`.`nom` AS `saison_nom` from ((`logement` `l` left join `tarif` `t` on((`l`.`id_logement` = `t`.`id_logement`))) left join `saison` `s` on((`t`.`id_saison` = `s`.`id_saison`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `reservations_utilisateur`
--

/*!50001 DROP VIEW IF EXISTS `reservations_utilisateur`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `reservations_utilisateur` AS select `r`.`id_reservation` AS `id_reservation`,`r`.`id_utilisateur` AS `id_utilisateur`,`r`.`id_logement` AS `id_logement`,`l`.`nom_immeuble` AS `logement_nom`,`l`.`adresse` AS `adresse`,`r`.`date_debut` AS `date_debut`,`r`.`date_fin` AS `date_fin`,`r`.`statut` AS `statut` from (`reservation` `r` join `logement` `l` on((`r`.`id_logement` = `l`.`id_logement`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-02 21:22:24
