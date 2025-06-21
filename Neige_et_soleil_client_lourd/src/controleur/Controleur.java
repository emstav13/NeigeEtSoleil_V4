package controleur;

import java.util.ArrayList;
import modele.Modele;

public class Controleur {
    /************************* Contrôle des données *********************/
    public static boolean verifDonnees(ArrayList<String> lesChamps) {
        for (String champ : lesChamps) {
            if (champ.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    /***************************  Gestion des utilisateurs ***********************/
    public static void insertUtilisateur(Utilisateur unUtilisateur) {
        Modele.insertUtilisateur(unUtilisateur);
    }

    public static ArrayList<Utilisateur> selectAllUtilisateurs() {
        return Modele.selectAllUtilisateurs();
    }

    public static void deleteUtilisateur(int idUtilisateur) {
        Modele.deleteUtilisateur(idUtilisateur);
    }

    public static void updateUtilisateur(Utilisateur unUtilisateur) {
        Modele.updateUtilisateur(unUtilisateur);
    }

    public static ArrayList<Utilisateur> selectLikeUtilisateurs(String filtre) {
        return Modele.selectLikeUtilisateurs(filtre);
    }

    public static Utilisateur selectWhereUtilisateur(String email, String motDePasse) {
        return Modele.selectWhereUtilisateur(email, motDePasse);
    }

    /***************************  Gestion des propriétaires ***********************/
    public static void insertProprietaire(Proprietaire unProprietaire) {
        Modele.insertProprietaire(unProprietaire);
    }

    public static ArrayList<Proprietaire> selectAllProprietaires() {
        return Modele.selectAllProprietaires();
    }

    public static void deleteProprietaire(int idProprietaire) {
        Modele.deleteProprietaire(idProprietaire);
    }

    public static void updateProprietaire(Proprietaire unProprietaire) {
        Modele.updateProprietaire(unProprietaire);
    }

    public static ArrayList<Proprietaire> selectLikeProprietaires(String filtre) {
        return Modele.selectLikeProprietaires(filtre);
    }

    public static Proprietaire selectWhereProprietaire(int idProprietaire) {
        return Modele.selectWhereProprietaire(idProprietaire);
    }

    /***************************  Gestion des logements ***********************/
    public static void insertLogement(Logement unLogement) {
        Modele.insertLogement(unLogement);
    }

    public static ArrayList<Logement> selectAllLogements() {
        return Modele.selectAllLogements();
    }

    public static void deleteLogement(int idLogement) {
        Modele.deleteLogement(idLogement);
    }

    public static void updateLogement(Logement unLogement) {
        Modele.updateLogement(unLogement);
    }

    public static ArrayList<Logement> selectLikeLogements(String filtre) {
        return Modele.selectLikeLogements(filtre);
    }

    public static Logement selectWhereLogement(int idLogement) {
        return Modele.selectWhereLogement(idLogement);
    }

    /***************************  Gestion des réservations ***********************/
    public static void insertReservation(Reservation uneReservation) {
        Modele.insertReservation(uneReservation);
    }

    public static ArrayList<Reservation> selectAllReservations() {
        return Modele.selectAllReservations();
    }

    public static void deleteReservation(int idReservation) {
        Modele.deleteReservation(idReservation);
    }

    public static void updateReservation(Reservation uneReservation) {
        Modele.updateReservation(uneReservation);
    }

    public static ArrayList<Reservation> selectLikeReservations(String filtre) {
        return Modele.selectLikeReservations(filtre);
    }

    public static Reservation selectWhereReservation(int idReservation) {
        return Modele.selectWhereReservation(idReservation);
    }

    /********************* Gestion des statistiques ***********************/
    public static ArrayList<String[]> selectStatistiques() {
        return Stat.obtenirStatistiques();
    }


    /********************* Autres méthodes ***********************/
    public static int count(String table) {
        return Modele.count(table);
    }
}
