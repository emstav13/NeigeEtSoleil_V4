DROP DATABASE IF EXISTS neigeetsoleil_v4;
CREATE DATABASE neigeetsoleil_v4;
USE neigeetsoleil_v4;

-- DROP TABLES (enfants → parents)
DROP TABLE IF EXISTS activite_culturelle;
DROP TABLE IF EXISTS activite_detente;
DROP TABLE IF EXISTS activite_sportive;
DROP TABLE IF EXISTS equipement;
DROP TABLE IF EXISTS reservation_activite;
DROP TABLE IF EXISTS tarif_activite;
DROP TABLE IF EXISTS suivi_revenus;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS contrat;
DROP TABLE IF EXISTS tarif;
DROP TABLE IF EXISTS logement;
DROP TABLE IF EXISTS proprietaire;
DROP TABLE IF EXISTS activite_generale;
DROP TABLE IF EXISTS station;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS saison;
DROP TABLE IF EXISTS archive_resa;
DROP TABLE IF EXISTS utilisateur;

-- DROP VIEW statements
DROP VIEW IF EXISTS activites_reservees_par_type;
DROP VIEW IF EXISTS logements_disponibles;
DROP VIEW IF EXISTS logements_par_ville;
DROP VIEW IF EXISTS reservations_confirmees;
DROP VIEW IF EXISTS reservations_en_attente;
DROP VIEW IF EXISTS reservations_par_mois;
DROP VIEW IF EXISTS reservations_par_type_logement;
DROP VIEW IF EXISTS reservations_utilisateur;
DROP VIEW IF EXISTS revenus_par_logement_saison;
DROP VIEW IF EXISTS vue_stations_activites_par_region;

-- CREATE TABLES (ordre corrigé)

CREATE TABLE utilisateur (
  id_utilisateur int NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  prenom varchar(100) NOT NULL,
  email varchar(150) NOT NULL,
  mot_de_passe varchar(255) NOT NULL,
  role enum('client','proprietaire','admin') NOT NULL,
  date_creation datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_utilisateur),
  UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE region (
  id_region int NOT NULL AUTO_INCREMENT,
  nom_region varchar(100) NOT NULL,
  PRIMARY KEY (id_region)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE saison (
  id_saison int NOT NULL AUTO_INCREMENT,
  nom enum('haute','moyenne','basse') NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  PRIMARY KEY (id_saison)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE station (
  id_station int NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  id_region int DEFAULT NULL,
  PRIMARY KEY (id_station),
  CONSTRAINT station_ibfk_1 FOREIGN KEY (id_region) REFERENCES region (id_region) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE activite_generale (
  id_activite int NOT NULL AUTO_INCREMENT,
  nom_activite varchar(100) NOT NULL,
  id_station int NOT NULL,
  image varchar(255) DEFAULT NULL,
  PRIMARY KEY (id_activite),
  KEY id_station (id_station),
  CONSTRAINT activite_generale_ibfk_1 FOREIGN KEY (id_station) REFERENCES station (id_station) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE activite_culturelle (
  id_activite int NOT NULL,
  duree int DEFAULT NULL,
  public_cible enum('enfants','adultes','tous') DEFAULT NULL,
  PRIMARY KEY (id_activite),
  CONSTRAINT activite_culturelle_ibfk_1 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE activite_detente (
  id_activite int NOT NULL,
  type_detente varchar(50) DEFAULT NULL,
  description text,
  PRIMARY KEY (id_activite),
  CONSTRAINT activite_detente_ibfk_1 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE activite_sportive (
  id_activite int NOT NULL,
  type_sport varchar(50) DEFAULT NULL,
  niveau_difficulte enum('débutant','intermédiaire','avancé') DEFAULT NULL,
  PRIMARY KEY (id_activite),
  CONSTRAINT activite_sportive_ibfk_1 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE equipement (
  id_equipement int NOT NULL AUTO_INCREMENT,
  nom_equipement varchar(100) NOT NULL,
  description text,
  id_activite int NOT NULL,
  PRIMARY KEY (id_equipement),
  KEY id_activite (id_activite),
  CONSTRAINT equipement_ibfk_1 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE proprietaire (
  id_proprietaire int NOT NULL AUTO_INCREMENT,
  id_utilisateur int NOT NULL,
  logements json DEFAULT NULL,
  PRIMARY KEY (id_proprietaire),
  KEY id_utilisateur (id_utilisateur),
  CONSTRAINT proprietaire_ibfk_1 FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE logement (
  id_logement int NOT NULL AUTO_INCREMENT,
  id_proprietaire int NOT NULL,
  nom_immeuble varchar(100) NOT NULL,
  adresse varchar(255) NOT NULL,
  code_postal varchar(10) NOT NULL,
  ville varchar(100) NOT NULL,
  type_logement enum('F1','F2','F3','F4','F5') NOT NULL,
  surface_habitable float NOT NULL,
  capacite_accueil int NOT NULL,
  specifite text,
  photo varchar(255) DEFAULT NULL,
  PRIMARY KEY (id_logement),
  KEY fk_proprietaire (id_proprietaire),
  CONSTRAINT fk_proprietaire FOREIGN KEY (id_proprietaire) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE contrat (
  id_contrat int NOT NULL AUTO_INCREMENT,
  id_proprietaire int NOT NULL,
  id_logement int NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  statut enum('actif','inactif','resilie') NOT NULL,
  PRIMARY KEY (id_contrat),
  KEY id_proprietaire (id_proprietaire),
  KEY id_logement (id_logement),
  CONSTRAINT contrat_ibfk_1 FOREIGN KEY (id_proprietaire) REFERENCES proprietaire (id_proprietaire) ON DELETE CASCADE,
  CONSTRAINT contrat_ibfk_2 FOREIGN KEY (id_logement) REFERENCES logement (id_logement) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE reservation (
  id_reservation int NOT NULL AUTO_INCREMENT,
  id_utilisateur int NOT NULL,
  id_logement int NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  statut enum('disponible','reserve','confirmé','annulé') NOT NULL,
  PRIMARY KEY (id_reservation),
  KEY id_utilisateur (id_utilisateur),
  KEY id_logement (id_logement),
  CONSTRAINT reservation_ibfk_1 FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE,
  CONSTRAINT reservation_ibfk_2 FOREIGN KEY (id_logement) REFERENCES logement (id_logement) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE suivi_revenus (
  id_revenu int NOT NULL AUTO_INCREMENT,
  id_reservation int NOT NULL,
  montant decimal(10,2) NOT NULL,
  date_revenu date NOT NULL,
  PRIMARY KEY (id_revenu),
  KEY id_reservation (id_reservation),
  CONSTRAINT suivi_revenus_ibfk_1 FOREIGN KEY (id_reservation) REFERENCES reservation (id_reservation) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tarif (
  id_tarif int NOT NULL AUTO_INCREMENT,
  id_logement int DEFAULT NULL,
  id_activite int DEFAULT NULL,
  id_saison int NOT NULL,
  prix decimal(10,2) NOT NULL,
  PRIMARY KEY (id_tarif),
  KEY id_logement (id_logement),
  KEY id_saison (id_saison),
  KEY tarif_ibfk_3 (id_activite),
  CONSTRAINT tarif_ibfk_1 FOREIGN KEY (id_logement) REFERENCES logement (id_logement) ON DELETE CASCADE,
  CONSTRAINT tarif_ibfk_2 FOREIGN KEY (id_saison) REFERENCES saison (id_saison) ON DELETE CASCADE,
  CONSTRAINT tarif_ibfk_3 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE,
  CONSTRAINT chk_tarif CHECK (
    ((id_logement is not null and id_activite is null) or
     (id_logement is null and id_activite is not null))
  )
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tarif_activite (
  id_tarif_activite int NOT NULL AUTO_INCREMENT,
  id_tarif int NOT NULL,
  id_activite int NOT NULL,
  description text,
  PRIMARY KEY (id_tarif_activite),
  KEY id_tarif (id_tarif),
  KEY id_activite (id_activite),
  CONSTRAINT tarif_activite_ibfk_1 FOREIGN KEY (id_tarif) REFERENCES tarif (id_tarif) ON DELETE CASCADE,
  CONSTRAINT tarif_activite_ibfk_2 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE reservation_activite (
  id_reservation int NOT NULL AUTO_INCREMENT,
  id_utilisateur int NOT NULL,
  id_activite int NOT NULL,
  date_reservation date NOT NULL,
  statut enum('reserve','annule') DEFAULT 'reserve',
  nombre_personnes int NOT NULL,
  prix_total decimal(10,2) NOT NULL,
  PRIMARY KEY (id_reservation),
  KEY id_utilisateur (id_utilisateur),
  KEY id_activite (id_activite),
  CONSTRAINT reservation_activite_ibfk_1 FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE,
  CONSTRAINT reservation_activite_ibfk_2 FOREIGN KEY (id_activite) REFERENCES activite_generale (id_activite) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE archive_resa (
  id int NOT NULL AUTO_INCREMENT,
  nom_client varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  date_reservation date NOT NULL,
  id_logement int NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE VIEW logements_par_ville AS
SELECT
  l.ville,
  COUNT(l.id_logement) AS nombre_logements,
  SUM(l.capacite_accueil) AS capacite_totale
FROM logement l
GROUP BY l.ville
ORDER BY nombre_logements DESC;

CREATE VIEW reservations_confirmees AS
SELECT
  r.id_reservation,
  u.nom AS nom_client,
  u.prenom AS prenom_client,
  u.email AS email_client,
  l.nom_immeuble AS logement,
  l.adresse,
  r.date_debut,
  r.date_fin,
  r.statut
FROM reservation r
JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
JOIN logement l ON r.id_logement = l.id_logement
WHERE r.statut = 'confirmé';

CREATE VIEW reservations_en_attente AS
SELECT
  r.id_reservation,
  u.nom AS nom_client,
  u.prenom AS prenom_client,
  u.email AS email_client,
  l.nom_immeuble AS logement,
  l.adresse,
  r.date_debut,
  r.date_fin,
  r.statut
FROM reservation r
JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
JOIN logement l ON r.id_logement = l.id_logement
WHERE r.statut = 'reserve';

CREATE VIEW reservations_par_mois AS
SELECT
  YEAR(r.date_debut) AS annee,
  MONTH(r.date_debut) AS mois_numero,
  MIN(ELT(MONTH(r.date_debut),
    'janvier','février','mars','avril','mai','juin',
    'juillet','août','septembre','octobre','novembre','décembre')) AS mois,
  COUNT(r.id_reservation) AS nombre_reservations
FROM reservation r
GROUP BY YEAR(r.date_debut), MONTH(r.date_debut)
ORDER BY annee, mois_numero;

CREATE VIEW reservations_par_type_logement AS
SELECT
  l.type_logement,
  COUNT(r.id_reservation) AS nombre_reservations,
  COUNT(DISTINCT l.id_logement) AS nombre_logements,
  COALESCE(SUM(t.prix),0) AS revenu_total
FROM logement l
LEFT JOIN reservation r ON l.id_logement = r.id_logement
LEFT JOIN tarif t ON l.id_logement = t.id_logement
GROUP BY l.type_logement
ORDER BY nombre_reservations DESC;

CREATE VIEW reservations_utilisateur AS
SELECT
  r.id_reservation,
  r.id_utilisateur,
  r.id_logement,
  l.nom_immeuble AS logement_nom,
  l.adresse,
  r.date_debut,
  r.date_fin,
  r.statut
FROM reservation r
JOIN logement l ON r.id_logement = l.id_logement;

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

CREATE VIEW vue_stations_activites_par_region AS
SELECT
  r.nom_region AS region,
  s.nom AS station,
  a.nom_activite AS activite
FROM station s
JOIN region r ON s.id_region = r.id_region
JOIN activite_generale a ON s.id_station = a.id_station;

-- UTILISATEURS
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'Hash à générer', 'client'),
('Martin', 'Sophie', 'sophie.martin@example.com', 'Hash à générer', 'proprietaire'),
('IRIS', 'Admin', 'admin@example.com', '$2a$10$sx85ehR6/BL595WMZJX2f.O9HoIb2cHjwCjj1DfZnmbbOVQ7bETya', 'admin'), -- mot de passe : test123
('Lemoine', 'Claire', 'claire.lemoine@example.com', 'Hash à générer', 'client'), 
('Petit', 'Luc', 'luc.petit@example.com', 'Hash à générer', 'client'), 
('Moreau', 'Julie', 'julie.moreau@example.com', 'Hash à générer', 'proprietaire'), 
('Girard', 'Antoine', 'antoine.girard@example.com', 'Hash à générer', 'client'), 
('Fabre', 'Nina', 'nina.fabre@example.com', 'Hash à générer', 'client'),
('Bertrand', 'Alice', 'alice.bertrand@example.com', 'Hash à générer', 'client'),
('Delcourt', 'Marc', 'marc.delcourt@example.com', 'Hash à générer', 'client'),
('Lafont', 'Emma', 'emma.lafont@example.com', 'Hash à générer', 'proprietaire'),
('Roche', 'Olivier', 'olivier.roche@example.com', 'Hash à générer', 'client'),
('Benoit', 'Isabelle', 'isabelle.benoit@example.com', 'Hash à générer', 'client');


-- REGIONS
INSERT INTO region (nom_region) VALUES
('Alpes'), ('Pyrénées'), ('Vosges'), ('Massif Central'), ('Jura');

-- SAISONS
INSERT INTO saison (nom, date_debut, date_fin) VALUES
('haute', '2025-12-15', '2026-01-15'),
('moyenne', '2025-06-01', '2025-08-31'),
('basse', '2025-04-01', '2025-05-31');

-- STATIONS
INSERT INTO station (nom, id_region) VALUES
('Chamonix', 1),
('Val Thorens', 1),
('Font-Romeu', 2),
('Luz Ardiden', 2),
('Gérardmer', 3),
('Le Mont-Dore', 4),
('Les Rousses', 5),
('La Clusaz', 1),
('Saint-Lary', 2);

-- ACTIVITES GENERALES
INSERT INTO activite_generale (nom_activite, id_station, image) VALUES
('Ski alpin', 1, 'ski.jpg'),
('Snowboard', 2, 'snowboard.jpg'),
('Raquettes', 3, 'raquettes.jpg'),
('Escalade', 4, 'escalade.jpg'),
('Visite Musée', 5, 'musee.jpg'),
('Balade guidée', 6, 'balade.jpg'),
('Piscine', 3, 'piscine.jpg'),
('Spa', 1, 'spa.jpg'),
('Luge', 1, 'luge.jpg'),
('Patinoire', 5, 'patinoire.jpg'),
('Canoë', 6, 'canoe.jpg'),
('Yoga', 1, 'yoga.jpg');

-- ACTIVITES SPECIFIQUES
INSERT INTO activite_sportive (id_activite, type_sport, niveau_difficulte) VALUES
(1, 'Ski', 'avancé'),
(2, 'Snowboard', 'intermédiaire'),
(4, 'Escalade', 'débutant'),
(9, 'Luge', 'débutant'),
(11, 'Canoë', 'intermédiaire');

INSERT INTO activite_detente (id_activite, type_detente, description) VALUES
(3, 'Balade en raquettes', 'Randonnée en raquettes accompagnée'),
(7, 'Natation', 'Accès piscine couverte'),
(8, 'Relaxation', 'Accès au spa et sauna'),
(10, 'Patinage libre', 'Patinoire libre accès'),
(12, 'Yoga', 'Séance de yoga en montagne');

INSERT INTO activite_culturelle (id_activite, duree, public_cible) VALUES
(5, 120, 'tous'),
(6, 90, 'adultes');

-- EQUIPEMENTS
INSERT INTO equipement (nom_equipement, description, id_activite) VALUES
('Raquettes', 'Raquettes légères', 3),
('Casque', 'Casque de ski homologué', 1),
('Bâtons', 'Bâtons de marche', 3),
('Harnais', 'Harnais d’escalade', 4),
('Serviette', 'Serviette fournie au spa', 8),
('Luge', 'Luge classique pour neige', 9),
('Patins', 'Patins à glace', 10),
('Gilet de sauvetage', 'Gilet pour canoë', 11),
('Tapis de yoga', 'Tapis de yoga antidérapant', 12);

-- PROPRIETAIRES
INSERT INTO proprietaire (id_utilisateur, logements) VALUES
(2, JSON_ARRAY(1,2,3)),
(6, JSON_ARRAY(4,5)),
(11, JSON_ARRAY(6,7));

-- LOGEMENTS
INSERT INTO logement (id_proprietaire, nom_immeuble, adresse, code_postal, ville, type_logement, surface_habitable, capacite_accueil, specifite, photo) VALUES
(1, 'Chalet Neige', '123 rue des Glaciers', '74400', 'Chamonix', 'F4', 80.0, 8, 'Cheminée, vue montagne', 'chalet1.jpg'),
(1, 'Studio Soleil', '456 avenue des Alpages', '74400', 'Chamonix', 'F1', 30.0, 2, 'Balcon sud', 'studio1.jpg'),
(1, 'Appartement Cime', '789 route des Crêtes', '74400', 'Chamonix', 'F3', 65.0, 5, 'Cuisine équipée', 'appart1.jpg'),
(2, 'Résidence Pic', '12 rue des Écureuils', '66120', 'Font-Romeu', 'F2', 45.0, 4, 'Terrasse', 'residence1.jpg'),
(2, 'Chalet Pyrenees', '34 chemin des Sapins', '66120', 'Font-Romeu', 'F5', 95.0, 10, 'Jacuzzi, barbecue', 'chalet_py.jpg'),
(3, 'Villa Jura', '1 montée des Sapins', '39220', 'Les Rousses', 'F4', 85.0, 7, 'Poêle à bois', 'villa1.jpg'),
(3, 'Studio Neige', '2 montée des Sapins', '39220', 'Les Rousses', 'F1', 28.0, 2, 'Proche pistes', 'studio2.jpg');

-- CONTRATS
INSERT INTO contrat (id_proprietaire, id_logement, date_debut, date_fin, statut) VALUES
(1, 1, '2025-01-01', '2026-01-01', 'actif'),
(1, 2, '2025-06-01', '2026-06-01', 'actif'),
(2, 4, '2025-03-01', '2026-03-01', 'actif'),
(3, 6, '2025-11-01', '2026-11-01', 'actif'),
(3, 7, '2025-12-01', '2026-12-01', 'actif');

-- TARIFS
INSERT INTO tarif (id_logement, id_activite, id_saison, prix) VALUES
(1, NULL, 1, 200.00),
(1, NULL, 2, 180.00),
(2, NULL, 1, 120.00),
(3, NULL, 3, 90.00),
(6, NULL, 1, 210.00),
(6, NULL, 2, 190.00),
(7, NULL, 1, 115.00),
(NULL, 1, 1, 35.00),
(NULL, 2, 1, 40.00),
(NULL, 4, 2, 50.00),
(NULL, 8, 2, 25.00),
(NULL, 9, 1, 20.00),
(NULL, 10, 2, 15.00),
(NULL, 11, 2, 45.00),
(NULL, 12, 1, 30.00);

-- RESERVATIONS
INSERT INTO reservation (id_utilisateur, id_logement, date_debut, date_fin, statut) VALUES
(1, 1, '2025-12-20', '2025-12-27', 'confirmé'),
(4, 2, '2025-12-26', '2026-01-02', 'reserve'),
(5, 4, '2025-07-15', '2025-07-22', 'confirmé'),
(7, 3, '2025-04-10', '2025-04-17', 'annulé'),
(9, 6, '2025-12-22', '2025-12-29', 'confirmé'),
(10, 7, '2026-01-05', '2026-01-12', 'reserve'),
(8, 4, '2025-08-05', '2025-08-12', 'confirmé');

-- RESERVATIONS ACTIVITES
INSERT INTO reservation_activite (id_utilisateur, id_activite, date_reservation, statut, nombre_personnes, prix_total) VALUES
(1, 1, '2025-12-21', 'reserve', 2, 70.00),
(4, 8, '2025-12-27', 'reserve', 1, 25.00),
(5, 3, '2025-07-16', 'reserve', 4, 100.00),
(9, 9, '2025-12-23', 'reserve', 3, 60.00),
(10, 12, '2025-12-24', 'reserve', 2, 60.00),
(8, 11, '2025-08-06', 'reserve', 2, 90.00);

-- SUIVI REVENUS
INSERT INTO suivi_revenus (id_reservation, montant, date_revenu) VALUES
(1, 200.00, '2025-12-28'),
(3, 180.00, '2025-07-23'),
(5, 210.00, '2025-12-30'),
(6, 115.00, '2026-01-13'),
(7, 180.00, '2025-08-13');

-- TARIF ACTIVITE
INSERT INTO tarif_activite (id_tarif, id_activite, description) VALUES
(5, 1, 'Tarif haute saison ski'),
(6, 2, 'Tarif snowboard haute saison'),
(8, 8, 'Spa tarif été'),
(9, 9, 'Tarif luge haute saison'),
(10, 10, 'Tarif patinoire été'),
(11, 11, 'Tarif canoë été'),
(12, 12, 'Tarif yoga haute saison');

-- ARCHIVE RESERVATIONS
INSERT INTO archive_resa (nom_client, email, date_reservation, id_logement) VALUES
('Jean Dupont', 'jean.dupont@example.com', '2025-12-20', 1),
('Claire Lemoine', 'claire.lemoine@example.com', '2025-07-15', 4),
('Alice Bertrand', 'alice.bertrand@example.com', '2025-12-22', 6),
('Marc Delcourt', 'marc.delcourt@example.com', '2026-01-05', 7);

