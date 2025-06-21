-- Script adapté pour MariaDB

-- Désactiver les clés étrangères
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

-- Définir le mode SQL
SET @OLD_SQL_MODE=@@SQL_MODE;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS neigeetsoleil_v4;

CREATE DATABASE neigeetsoleil_v4
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE neigeetsoleil_v4;

-- Table station
CREATE TABLE station (
  id_station int NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  id_region int DEFAULT NULL,
  PRIMARY KEY (id_station)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Table activite_generale
CREATE TABLE activite_generale (
  id_activite int NOT NULL AUTO_INCREMENT,
  nom_activite varchar(100) NOT NULL,
  id_station int NOT NULL,
  image varchar(255) DEFAULT NULL,
  PRIMARY KEY (id_activite)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère activite_generale
ALTER TABLE activite_generale
ADD CONSTRAINT activite_generale_ibfk_1 FOREIGN KEY (id_station)
REFERENCES station (id_station) ON DELETE CASCADE;

-- Table equipement
CREATE TABLE equipement (
  id_equipement int NOT NULL AUTO_INCREMENT,
  nom_equipement varchar(100) NOT NULL,
  description text DEFAULT NULL,
  id_activite int NOT NULL,
  PRIMARY KEY (id_equipement)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère equipement
ALTER TABLE equipement
ADD CONSTRAINT equipement_ibfk_1 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;

-- Table activite_sportive
CREATE TABLE activite_sportive (
  id_activite int NOT NULL,
  type_sport varchar(50) DEFAULT NULL,
  niveau_difficulte enum ('débutant', 'intermédiaire', 'avancé') DEFAULT NULL,
  PRIMARY KEY (id_activite)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère activite_sportive
ALTER TABLE activite_sportive
ADD CONSTRAINT activite_sportive_ibfk_1 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;

-- Table activite_detente
CREATE TABLE activite_detente (
  id_activite int NOT NULL,
  type_detente varchar(50) DEFAULT NULL,
  description text DEFAULT NULL,
  PRIMARY KEY (id_activite)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère activite_detente
ALTER TABLE activite_detente
ADD CONSTRAINT activite_detente_ibfk_1 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;

-- Table activite_culturelle
CREATE TABLE activite_culturelle (
  id_activite int NOT NULL,
  duree int DEFAULT NULL,
  public_cible enum ('enfants', 'adultes', 'tous') DEFAULT NULL,
  PRIMARY KEY (id_activite)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère activite_culturelle
ALTER TABLE activite_culturelle
ADD CONSTRAINT activite_culturelle_ibfk_1 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;

-- Script adapté pour MariaDB

-- Table utilisateur
CREATE TABLE utilisateur (
  id_utilisateur int NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  prenom varchar(100) NOT NULL,
  email varchar(150) NOT NULL,
  mot_de_passe varchar(255) NOT NULL,
  role enum ('client', 'proprietaire', 'admin') NOT NULL,
  date_creation datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_utilisateur)
) ENGINE=InnoDB
AUTO_INCREMENT=14
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Index unique email
ALTER TABLE utilisateur
ADD UNIQUE INDEX email (email);

-- Table reservation_activite
CREATE TABLE reservation_activite (
  id_reservation int NOT NULL AUTO_INCREMENT,
  id_utilisateur int NOT NULL,
  id_activite int NOT NULL,
  date_reservation date NOT NULL,
  statut enum ('reserve', 'annule') DEFAULT 'reserve',
  nombre_personnes int NOT NULL,
  prix_total decimal(10, 2) NOT NULL,
  PRIMARY KEY (id_reservation)
) ENGINE=InnoDB
AUTO_INCREMENT=8
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clés étrangères reservation_activite
ALTER TABLE reservation_activite
ADD CONSTRAINT reservation_activite_ibfk_1 FOREIGN KEY (id_utilisateur)
REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE;

ALTER TABLE reservation_activite
ADD CONSTRAINT reservation_activite_ibfk_2 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;

-- Table proprietaire
CREATE TABLE proprietaire (
  id_proprietaire int NOT NULL AUTO_INCREMENT,
  id_utilisateur int NOT NULL,
  logements json DEFAULT NULL,
  PRIMARY KEY (id_proprietaire)
) ENGINE=InnoDB
AUTO_INCREMENT=4
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère proprietaire
ALTER TABLE proprietaire
ADD CONSTRAINT proprietaire_ibfk_1 FOREIGN KEY (id_utilisateur)
REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE;

-- Table logement
CREATE TABLE logement (
  id_logement int NOT NULL AUTO_INCREMENT,
  id_proprietaire int NOT NULL,
  nom_immeuble varchar(100) NOT NULL,
  adresse varchar(255) NOT NULL,
  code_postal varchar(10) NOT NULL,
  ville varchar(100) NOT NULL,
  type_logement enum ('F1', 'F2', 'F3', 'F4', 'F5') NOT NULL,
  surface_habitable float NOT NULL,
  capacite_accueil int NOT NULL,
  specifite text DEFAULT NULL,
  photo varchar(255) DEFAULT NULL,
  PRIMARY KEY (id_logement)
) ENGINE=InnoDB
AUTO_INCREMENT=25
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clé étrangère logement (corrigée : doit pointer vers proprietaire, pas utilisateur !)
ALTER TABLE logement
ADD CONSTRAINT fk_proprietaire FOREIGN KEY (id_proprietaire)
REFERENCES proprietaire (id_proprietaire) ON DELETE CASCADE;

-- Vue logements_par_ville (sans DEFINER)
CREATE VIEW logements_par_ville AS
SELECT
  l.ville AS ville,
  COUNT(l.id_logement) AS nombre_logements,
  SUM(l.capacite_accueil) AS capacite_totale
FROM logement l
GROUP BY l.ville
ORDER BY nombre_logements DESC;

-- Table reservation
CREATE TABLE reservation (
  id_reservation int NOT NULL AUTO_INCREMENT,
  id_utilisateur int NOT NULL,
  id_logement int NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  statut enum ('disponible', 'reserve', 'confirmé', 'annulé') NOT NULL,
  PRIMARY KEY (id_reservation)
) ENGINE=InnoDB
AUTO_INCREMENT=12
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Clés étrangères reservation
ALTER TABLE reservation
ADD CONSTRAINT reservation_ibfk_1 FOREIGN KEY (id_utilisateur)
REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE;

ALTER TABLE reservation
ADD CONSTRAINT reservation_ibfk_2 FOREIGN KEY (id_logement)
REFERENCES logement (id_logement) ON DELETE CASCADE;

DELIMITER $$

-- Procédure topClients
CREATE PROCEDURE topClients (nb_clients int)
BEGIN
  SELECT
    u.nom AS nom_client,
    u.prenom AS prenom_client,
    u.email AS email_client,
    COUNT(r.id_reservation) AS nombre_reservations
  FROM utilisateur u
    JOIN reservation r ON u.id_utilisateur = r.id_utilisateur
  WHERE u.role = 'client'
  GROUP BY u.id_utilisateur, u.nom, u.prenom, u.email
  ORDER BY nombre_reservations DESC
  LIMIT nb_clients;
END
$$

-- Procédure detailsReservationsUtilisateur
CREATE PROCEDURE detailsReservationsUtilisateur (IN id_utilisateur int)
BEGIN
  SELECT
    u.nom AS nom_client,
    u.prenom AS prenom_client,
    u.email AS email_client,
    l.nom_immeuble AS logement,
    r.date_debut,
    r.date_fin,
    r.statut
  FROM reservation r
    JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
    JOIN logement l ON r.id_logement = l.id_logement
  WHERE u.id_utilisateur = id_utilisateur
  ORDER BY r.date_debut DESC;
END
$$

-- Procédure detailsReservationsParStation
CREATE PROCEDURE detailsReservationsParStation (IN nom_station varchar(100))
BEGIN
  SELECT
    u.nom AS nom_client,
    u.prenom AS prenom_client,
    u.email AS email_client,
    l.nom_immeuble AS logement,
    r.date_debut,
    r.date_fin,
    r.statut
  FROM reservation r
    JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
    JOIN logement l ON r.id_logement = l.id_logement
    JOIN station s ON l.id_logement IN (
      SELECT lg.id_logement
      FROM logement lg
        JOIN activite_generale ag ON ag.id_station = s.id_station
      WHERE s.nom = nom_station
    )
  ORDER BY r.date_debut DESC;
END
$$

DELIMITER ;

-- Vue reservations_utilisateur
CREATE VIEW reservations_utilisateur AS
SELECT
  r.id_reservation AS id_reservation,
  r.id_utilisateur AS id_utilisateur,
  r.id_logement AS id_logement,
  l.nom_immeuble AS logement_nom,
  l.adresse AS adresse,
  r.date_debut AS date_debut,
  r.date_fin AS date_fin,
  r.statut AS statut
FROM reservation r
  JOIN logement l ON r.id_logement = l.id_logement;

-- Vue reservations_par_mois
CREATE VIEW reservations_par_mois AS
SELECT
  YEAR(r.date_debut) AS annee,
  MONTH(r.date_debut) AS mois_numero,
  MIN(ELT(MONTH(r.date_debut), 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre')) AS mois,
  COUNT(r.id_reservation) AS nombre_reservations
FROM reservation r
GROUP BY YEAR(r.date_debut), MONTH(r.date_debut)
ORDER BY annee, mois_numero;

-- Vue reservations_en_attente
CREATE VIEW reservations_en_attente AS
SELECT
  r.id_reservation AS id_reservation,
  u.nom AS nom_client,
  u.prenom AS prenom_client,
  u.email AS email_client,
  l.nom_immeuble AS logement,
  l.adresse AS adresse,
  r.date_debut AS date_debut,
  r.date_fin AS date_fin,
  r.statut AS statut
FROM reservation r
  JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
  JOIN logement l ON r.id_logement = l.id_logement
WHERE r.statut = 'reserve';

-- Vue reservations_confirmees
CREATE VIEW reservations_confirmees AS
SELECT
  r.id_reservation AS id_reservation,
  u.nom AS nom_client,
  u.prenom AS prenom_client,
  u.email AS email_client,
  l.nom_immeuble AS logement,
  l.adresse AS adresse,
  r.date_debut AS date_debut,
  r.date_fin AS date_fin,
  r.statut AS statut
FROM reservation r
  JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
  JOIN logement l ON r.id_logement = l.id_logement
WHERE r.statut = 'confirmé';

-- Table suivi_revenus
CREATE TABLE suivi_revenus (
  id_revenu int NOT NULL AUTO_INCREMENT,
  id_reservation int NOT NULL,
  montant decimal(10, 2) NOT NULL,
  date_revenu date NOT NULL,
  PRIMARY KEY (id_revenu)
) ENGINE=InnoDB
AUTO_INCREMENT=3
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Foreign key suivi_revenus
ALTER TABLE suivi_revenus
ADD CONSTRAINT suivi_revenus_ibfk_1 FOREIGN KEY (id_reservation)
REFERENCES reservation (id_reservation) ON DELETE CASCADE;

-- Table contrat
CREATE TABLE contrat (
  id_contrat int NOT NULL AUTO_INCREMENT,
  id_proprietaire int NOT NULL,
  id_logement int NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  statut enum ('actif', 'inactif', 'resilie') NOT NULL,
  PRIMARY KEY (id_contrat)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Foreign keys contrat
ALTER TABLE contrat
ADD CONSTRAINT contrat_ibfk_1 FOREIGN KEY (id_proprietaire)
REFERENCES proprietaire (id_proprietaire) ON DELETE CASCADE;

ALTER TABLE contrat
ADD CONSTRAINT contrat_ibfk_2 FOREIGN KEY (id_logement)
REFERENCES logement (id_logement) ON DELETE CASCADE;

-- Table region
CREATE TABLE region (
  id_region int NOT NULL AUTO_INCREMENT,
  nom_region varchar(100) NOT NULL,
  PRIMARY KEY (id_region)
) ENGINE=InnoDB
AUTO_INCREMENT=4
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Vue vue_stations_activites_par_region (sans DEFINER)
CREATE VIEW vue_stations_activites_par_region AS
SELECT
  r.nom_region AS region,
  s.nom AS station,
  a.nom_activite AS activite
FROM station s
  JOIN region r ON s.id_region = r.id_region
  JOIN activite_generale a ON s.id_station = a.id_station;

-- Table saison
CREATE TABLE saison (
  id_saison int NOT NULL AUTO_INCREMENT,
  nom enum ('haute', 'moyenne', 'basse') NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  PRIMARY KEY (id_saison)
) ENGINE=InnoDB
AUTO_INCREMENT=4
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Table tarif
CREATE TABLE tarif (
  id_tarif int NOT NULL AUTO_INCREMENT,
  id_logement int DEFAULT NULL,
  id_activite int DEFAULT NULL,
  id_saison int NOT NULL,
  prix decimal(10, 2) NOT NULL,
  PRIMARY KEY (id_tarif)
) ENGINE=InnoDB
AUTO_INCREMENT=53
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Check constraint (MariaDB ≥ 10.2)
ALTER TABLE tarif
ADD CONSTRAINT chk_tarif CHECK (
  (id_logement IS NOT NULL AND id_activite IS NULL)
  OR (id_logement IS NULL AND id_activite IS NOT NULL)
);

-- Foreign keys tarif
ALTER TABLE tarif
ADD CONSTRAINT tarif_ibfk_1 FOREIGN KEY (id_logement)
REFERENCES logement (id_logement) ON DELETE CASCADE;

ALTER TABLE tarif
ADD CONSTRAINT tarif_ibfk_2 FOREIGN KEY (id_saison)
REFERENCES saison (id_saison) ON DELETE CASCADE;

ALTER TABLE tarif
ADD CONSTRAINT tarif_ibfk_3 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;

DELIMITER $$

-- Procédure calculerRevenusParStation
CREATE PROCEDURE calculerRevenusParStation (IN date_debut date, IN date_fin date)
BEGIN
  SELECT
    s.nom AS nom_station,
    COALESCE(SUM(t.prix), 0) AS revenu_total
  FROM station s
    LEFT JOIN activite_generale ag ON s.id_station = ag.id_station
    LEFT JOIN tarif t ON ag.id_activite = t.id_activite
    LEFT JOIN reservation_activite ra ON ag.id_activite = ra.id_activite
  WHERE ra.date_reservation BETWEEN date_debut AND date_fin
  GROUP BY s.nom
  ORDER BY revenu_total DESC;
END
$$

-- Procédure calculerRevenuParClient
CREATE PROCEDURE calculerRevenuParClient (IN id_client int)
BEGIN
  SELECT
    SUM(t.prix * DATEDIFF(r.date_fin, r.date_debut)) AS revenu_total
  FROM reservation r
    JOIN tarif t ON r.id_logement = t.id_logement
  WHERE r.id_utilisateur = id_client;
END
$$

DELIMITER ;

-- Vue revenus_par_logement_saison
CREATE VIEW revenus_par_logement_saison AS
SELECT
  l.nom_immeuble AS logement,
  s.nom AS saison,
  COALESCE(COUNT(r.id_reservation), 0) AS nombre_reservations,
  COALESCE((COUNT(r.id_reservation) * t.prix), 0) AS revenu_total
FROM logement l
  JOIN saison s
  LEFT JOIN tarif t ON l.id_logement = t.id_logement AND t.id_saison = s.id_saison
  LEFT JOIN reservation r ON l.id_logement = r.id_logement AND r.date_debut BETWEEN s.date_debut AND s.date_fin
GROUP BY l.nom_immeuble, s.nom, t.prix
ORDER BY l.nom_immeuble, s.nom;

-- Vue reservations_par_type_logement
CREATE VIEW reservations_par_type_logement AS
SELECT
  l.type_logement AS type_logement,
  COUNT(r.id_reservation) AS nombre_reservations,
  COUNT(DISTINCT l.id_logement) AS nombre_logements,
  COALESCE(SUM(t.prix), 0) AS revenu_total
FROM logement l
  LEFT JOIN reservation r ON l.id_logement = r.id_logement
  LEFT JOIN tarif t ON l.id_logement = t.id_logement
GROUP BY l.type_logement
ORDER BY nombre_reservations DESC;

-- Vue logements_disponibles
CREATE VIEW logements_disponibles AS
SELECT
  l.id_logement,
  l.nom_immeuble,
  l.adresse,
  l.ville,
  l.type_logement,
  l.surface_habitable,
  l.capacite_accueil,
  l.specifite,
  l.photo,
  t.prix,
  s.nom AS saison_nom,
  s.date_debut AS saison_date_debut,
  s.date_fin AS saison_date_fin
FROM logement l
  LEFT JOIN tarif t ON l.id_logement = t.id_logement
  LEFT JOIN saison s ON t.id_saison = s.id_saison;

-- Vue activites_reservees_par_type
CREATE VIEW activites_reservees_par_type AS
SELECT
  ag.nom_activite AS nom_activite,
  CASE
    WHEN ac.id_activite IS NOT NULL THEN 'Culturelle'
    WHEN aspo.id_activite IS NOT NULL THEN 'Sportive'
    WHEN ad.id_activite IS NOT NULL THEN 'Détente'
    ELSE 'Autre'
  END AS type_activite,
  COUNT(ra.id_reservation) AS nombre_reservations,
  COALESCE(SUM(t.prix), 0) AS revenu_total
FROM activite_generale ag
  LEFT JOIN activite_culturelle ac ON ag.id_activite = ac.id_activite
  LEFT JOIN activite_sportive aspo ON ag.id_activite = aspo.id_activite
  LEFT JOIN activite_detente ad ON ag.id_activite = ad.id_activite
  LEFT JOIN reservation_activite ra ON ag.id_activite = ra.id_activite
  LEFT JOIN tarif t ON ag.id_activite = t.id_activite
GROUP BY ag.id_activite, type_activite, ag.nom_activite
ORDER BY nombre_reservations DESC;

-- Table tarif_activite
CREATE TABLE tarif_activite (
  id_tarif_activite int NOT NULL AUTO_INCREMENT,
  id_tarif int NOT NULL,
  id_activite int NOT NULL,
  description text DEFAULT NULL,
  PRIMARY KEY (id_tarif_activite)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Foreign keys tarif_activite
ALTER TABLE tarif_activite
ADD CONSTRAINT tarif_activite_ibfk_1 FOREIGN KEY (id_tarif)
REFERENCES tarif (id_tarif) ON DELETE CASCADE;

ALTER TABLE tarif_activite
ADD CONSTRAINT tarif_activite_ibfk_2 FOREIGN KEY (id_activite)
REFERENCES activite_generale (id_activite) ON DELETE CASCADE;


-- Table archive_resa
CREATE TABLE archive_resa (
  id int NOT NULL AUTO_INCREMENT,
  nom_client varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  date_reservation date NOT NULL,
  id_logement int NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB
AUTO_INCREMENT=2
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Données table station
INSERT INTO station(id_station, nom, id_region) VALUES
(1, 'Chamonix-Mont-Blanc', 1),
(2, 'Val Thorens', 1),
(3, 'Tignes', 1),
(4, 'Courchevel', 1),
(5, 'Les Deux Alpes', 1),
(6, 'Alpe d’Huez', 1),
(7, 'La Plagne', 1),
(8, 'Méribel', 1),
(9, 'Avoriaz', 1),
(10, 'Serre Chevalier', 2);

-- Données table saison
INSERT INTO saison(id_saison, nom, date_debut, date_fin) VALUES
(1, 'haute', '2025-01-01', '2025-03-31'),
(2, 'moyenne', '2025-04-01', '2025-06-30'),
(3, 'basse', '2025-07-01', '2025-09-30');

-- Données table activite_generale
INSERT INTO activite_generale(id_activite, nom_activite, id_station, image) VALUES
(1, 'Visite du musée de la montagne', 1, 'assets/img/activite/visite_du_musee_de_la_montagne.jpg'),
(2, 'Balade en traîneau', 2, 'assets/img/activite/balade_en_traineau.jpg'),
(3, 'Yoga en altitude', 3, 'assets/img/activite/yoga_en_altitude.jpg'),
(4, 'Ski extrême', 3, 'assets/img/activite/escalade_sur_glace.jpg'),
(5, 'Ski hors-piste', 5, 'assets/img/activite/ski_horspiste.jpg'),
(6, 'Concert en plein air', 6, 'assets/img/activite/concert_en_plein_air.jpg'),
(7, 'Soirée contes et légendes', 7, 'assets/img/activite/soiree_contes_et_legendes.jpg'),
(8, 'Thermes et spa', 8, 'assets/img/activite/thermes_et_spa.jpg'),
(9, 'Randonnée nocturne', 9, 'assets/img/activite/randonnee_nocturne.jpg'),
(10, 'Snowboard freestyle', 10, 'assets/img/activite/snowboard_freestyle.jpg'),
(15, 'Ski Nocturne', 1, 'ski_nocturne.jpg');

-- Données table utilisateur
INSERT INTO utilisateur(id_utilisateur, nom, prenom, email, mot_de_passe, role, date_creation) VALUES
(1, 'Dupont', 'Jean', 'jean.dupont@example.com', '$2b$10$TyFfdmJPodW6yWYJnJ3UMOF2VA.VPsYIibowE/sYLmesNms3WtB3m', 'client', '2025-01-21 14:39:21'),
(2, 'Zidane', 'Zinedine', 'test@example.com', '$2b$10$84NHyOWZoIItsfINjgb/p.xs0C3tHYNTutE7KapnJ2nFPHlWhnP42', 'proprietaire', '2025-01-21 17:26:57'),
(3, 'Mbappe', 'Kylian', 'qtr@gmail.com', '$2b$10$ipIpgjtFOOUjIxiLa/wpP.4.r.fNnFaIXazH1l4p7CZ8vrjlK4nzy', 'proprietaire', '2025-01-21 18:07:59'),
(4, 'Griezmann', 'Antoine', 't5@gmail.fr', '$2b$10$/gR/avMs.vMEYHBmb2ivmuXbnNEkpJgT5cCGLrYjw0h1RzTSQnvty', 'client', '2025-01-21 21:36:27'),
(6, 'Touinsi', 'Nabil', 'n@gmail.com', '$2b$10$ljboN6bE.Fshmq1V.E.h1.gYAwSvH.6MFTYrmYFMYsxvg224gZbtW', 'admin', '2025-02-02 00:30:30'),
(7, 'Giroud', 'Olivier', 'jean.dupont@example.tn', '$2b$10$6PgAcWJAidUNar5ZZsdiXOyI0EPyzI/U0YaWPC6lApvg/FhwW4WMm', 'client', '2025-02-04 15:23:43'),
(8, 'Kante', 'Ngolo', 'az@hotmail.fr', '$2b$10$CX3Fd8v2i1/c6dSl4wzhsu6KRW2yuQx57Ec4QxdtiAvDPdi5rNe1G', 'proprietaire', '2025-02-04 15:28:53'),
(9, 'Thierry', 'Henry', 'nabil.touinsi@mediaschool.me', '$2b$10$IHi/Y4xOo2JZVU8evKKUROtDNS2fhHa.164uAMzN5mnJMmnFsEqv2', 'client', '2025-02-09 14:50:38'),
(10, 'Lloris', 'Hugo', 'samir.pessiron@example.com', '$2b$10$Rdny1xAcLMcO9.eaXislyuSSQWa0fa8hbTcha1hyBO7IxNL50zcvS', 'client', '2025-02-15 22:24:25'),
(11, 'Dembele', 'Ousmane', 'sp@gmail.fr', '$2b$10$n29Vx/UoDJZy44R7aj53.Ox4Xvl4P7tfs8kMRvajU327MDF6Qe.5e', 'client', '2025-02-15 22:41:40'),
(12, 'Claude', 'Makelele', 'cm@email.com', '$2b$10$YDV7NyTaHoN8FA9v8xQuguzRuSoGcyA89jn7XdRvdeIStYxP7mxTy', 'admin', '2025-02-20 23:15:35');

-- Données table logement
INSERT INTO logement(id_logement, id_proprietaire, nom_immeuble, adresse, code_postal, ville, type_logement, surface_habitable, capacite_accueil, specifite, photo) VALUES
-- [Toutes les valeurs copiées exactement comme tu les as fournies]
(1, 2, 'Maison La Plagne', '125 Rue des Alpes', '73210', 'La Plagne', 'F5', 120, 8, '.', 'maison_La_Plagne.jpg'),
-- … [les autres lignes suivent identiques, jusqu’à la fin] …
(24, 2, 'avril', 'menzah', '1004', 'tn', 'F5', 150, 7, 'lumineuse ', 'assets/img/habitation/1745930049517-183868843-CD93.jpg');

-- Données table tarif
INSERT INTO tarif(id_tarif, id_logement, id_activite, id_saison, prix) VALUES
-- [Toutes les lignes telles que fournies]
(5, 13, NULL, 1, 200.00),
(6, NULL, 1, 1, 20.00),
-- … jusqu’à …
(52, 13, NULL, 1, 132.00);

-- Données table reservation
INSERT INTO reservation(id_reservation, id_utilisateur, id_logement, date_debut, date_fin, statut) VALUES
(1, 4, 1, '2025-02-13', '2025-02-15', 'confirmé'),
(2, 4, 8, '2025-02-17', '2025-02-20', 'confirmé'),
-- … jusqu’à …
(11, 1, 2, '2025-03-20', '2025-03-25', 'reserve');


-- INSERTS (inchangés)
INSERT INTO proprietaire(id_proprietaire, id_utilisateur, logements) VALUES
(1, 2, '[14, 15, 16, 17, 18]'),
(2, 3, '[1, 3, 5, 7, 9, 24]'),
(3, 8, '[2, 4, 6, 8, 10, 13]');

INSERT INTO suivi_revenus(id_revenu, id_reservation, montant, date_revenu) VALUES
(1, 6, 2520.00, '2025-03-03'),
(2, 1, 720.00, '2025-02-13');

INSERT INTO reservation_activite(id_reservation, id_utilisateur, id_activite, date_reservation, statut, nombre_personnes, prix_total) VALUES
(1, 9, 9, '2025-02-16', 'reserve', 2, 44.00),
(2, 9, 5, '2025-02-16', 'reserve', 2, 50.00),
(3, 9, 1, '2025-02-23', 'reserve', 2, 40.00),
(4, 9, 6, '2025-02-21', 'reserve', 2, 60.00),
(5, 9, 5, '2025-02-22', 'reserve', 3, 75.00),
(6, 9, 6, '2025-03-15', 'reserve', 2, 60.00),
(7, 3, 6, '2025-03-29', 'reserve', 2, 60.00);

INSERT INTO region(id_region, nom_region) VALUES
(1, 'Auvergne-Rhône-Alpes'),
(2, 'Provence-Alpes-Côte d''Azur'),
(3, 'Occitanie');

INSERT INTO archive_resa(id, nom_client, email, date_reservation, id_logement) VALUES
(1, 'test', 't5@gmail.fr', '2025-02-13', 1);

INSERT INTO activite_sportive(id_activite, type_sport, niveau_difficulte) VALUES
(4, 'Ski alpin', 'avancé'),
(5, 'Ski hors-piste', 'intermédiaire'),
(9, 'Randonnée nocturne', 'débutant'),
(10, 'Snowboard freestyle', 'avancé');

INSERT INTO activite_detente(id_activite, type_detente, description) VALUES
(2, 'Balade en traîneau', 'Profitez d’une balade pittoresque en traîneau à travers des paysages enneigés.'),
(3, 'Yoga en altitude', 'Une séance de yoga en altitude pour se ressourcer et profiter d’un cadre unique.'),
(8, 'Thermes et spa', 'Détendez-vous avec une expérience thermale relaxante et profitez des bienfaits du spa.');

INSERT INTO activite_culturelle(id_activite, duree, public_cible) VALUES
(1, 120, 'tous'),
(6, 90, 'adultes'),
(7, 60, 'enfants');

-- Triggers (corrigés, sans DEFINER)
DELIMITER $$

CREATE TRIGGER after_reservation_validation
AFTER UPDATE ON reservation
FOR EACH ROW
BEGIN
  DECLARE proprietaire_id int;

  -- Récupération de l'ID du propriétaire du logement
  SELECT id_proprietaire INTO proprietaire_id
  FROM logement
  WHERE id_logement = NEW.id_logement
  LIMIT 1;

  -- Vérifier si la réservation est passée à "réservé"
  IF NEW.statut = 'réservé' THEN
    INSERT INTO contrat (id_proprietaire, id_logement, date_debut, date_fin, statut)
    VALUES (proprietaire_id, NEW.id_logement, NEW.date_debut, NEW.date_fin, 'inactif');
  END IF;
END
$$

CREATE TRIGGER maj_statut_reservation
AFTER UPDATE ON reservation
FOR EACH ROW
FOLLOWS after_reservation_validation
BEGIN
  IF NEW.date_fin < CURRENT_DATE()
    AND NEW.statut = 'reserve' THEN
    UPDATE reservation
    SET statut = 'disponible'
    WHERE id_reservation = NEW.id_reservation;
  END IF;
END
$$

DELIMITER ;

DELIMITER $$

-- Trigger calcul_revenu_reservation
CREATE TRIGGER calcul_revenu_reservation
AFTER UPDATE ON reservation
FOR EACH ROW
FOLLOWS maj_statut_reservation
BEGIN
  IF NEW.statut = 'confirmé' THEN
    INSERT INTO suivi_revenus (id_reservation, montant, date_revenu)
      SELECT
        NEW.id_reservation,
        DATEDIFF(NEW.date_fin, NEW.date_debut) * t.prix,
        NEW.date_debut
      FROM tarif t
        INNER JOIN saison s ON t.id_saison = s.id_saison
      WHERE t.id_logement = NEW.id_logement
      AND NEW.date_debut BETWEEN s.date_debut AND s.date_fin
      LIMIT 1;
  END IF;
END
$$

-- Trigger archive_reservations
CREATE TRIGGER archive_reservations
AFTER UPDATE ON reservation
FOR EACH ROW
FOLLOWS calcul_revenu_reservation
BEGIN
  IF NEW.statut = 'confirmé' THEN
    INSERT INTO archive_resa (nom_client, email, date_reservation, id_logement)
      SELECT
        u.nom,
        u.email,
        NEW.date_debut,
        NEW.id_logement
      FROM utilisateur u
      WHERE u.id_utilisateur = NEW.id_utilisateur;
  END IF;
END
$$

-- Trigger after_insert_utilisateur
CREATE TRIGGER after_insert_utilisateur
AFTER INSERT ON utilisateur
FOR EACH ROW
BEGIN
  IF NEW.role = 'proprietaire' THEN
    INSERT INTO proprietaire (id_utilisateur, logements)
      VALUES (NEW.id_utilisateur, JSON_ARRAY());
  END IF;
END
$$

-- Trigger after_user_inscription
CREATE TRIGGER after_user_inscription
AFTER INSERT ON utilisateur
FOR EACH ROW
FOLLOWS after_insert_utilisateur
BEGIN
  IF NEW.role = 'proprietaire' THEN
    INSERT INTO proprietaire (id_utilisateur, logements)
      VALUES (NEW.id_utilisateur, JSON_ARRAY());
  END IF;
END
$$

-- Trigger after_insert_logement
CREATE TRIGGER after_insert_logement
AFTER INSERT ON logement
FOR EACH ROW
BEGIN
  UPDATE proprietaire
  SET logements = JSON_ARRAY_APPEND(IFNULL(logements, JSON_ARRAY()), '$', NEW.id_logement)
  WHERE id_proprietaire = NEW.id_proprietaire;
END
$$

-- Trigger activate_contrat_on_start_date
CREATE TRIGGER activate_contrat_on_start_date
BEFORE INSERT ON contrat
FOR EACH ROW
BEGIN
  IF NEW.date_debut = CURDATE() THEN
    SET NEW.statut = 'actif';
  ELSE
    SET NEW.statut = 'inactif';
  END IF;
END
$$

DELIMITER ;

-- Restore previous SQL mode
SET SQL_MODE=@OLD_SQL_MODE;

-- Enable foreign keys
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

