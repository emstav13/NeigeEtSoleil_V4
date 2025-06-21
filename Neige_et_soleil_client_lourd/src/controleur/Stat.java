package controleur;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;

import modele.Modele;

public class Stat {

    public static ArrayList<String[]> obtenirStatistiques() {
        return Modele.getStatistiquesGlobales();
    }

    public static int getNombreTotalReservations() {
        ArrayList<String[]> stats = obtenirStatistiques();
        if (!stats.isEmpty()) {
            return Integer.parseInt(stats.get(0)[2]);
        }
        return 0;
    }

    public static double getRevenuTotal() {
        ArrayList<String[]> stats = obtenirStatistiques();
        if (!stats.isEmpty()) {
            return Double.parseDouble(stats.get(0)[3]);
        }
        return 0;
    }

    public static String getActivitePlusPopulaire() {
        ArrayList<String[]> stats = obtenirStatistiques();
        if (!stats.isEmpty()) {
            return stats.get(0)[4];
        }
        return "N/A";
    }

    public static String getVillePlusLogements() {
        ArrayList<String[]> stats = obtenirStatistiques();
        if (!stats.isEmpty()) {
            return stats.get(0)[5];
        }
        return "N/A";
    }

    public static String getProprietairePlusRentable() {
        ArrayList<String[]> stats = obtenirStatistiques();
        if (!stats.isEmpty()) {
            return stats.get(0)[6];
        }
        return "N/A";
    }

    public static String getUtilisateurPlusActif() {
        ArrayList<String[]> stats = obtenirStatistiques();
        if (!stats.isEmpty()) {
            return stats.get(0)[7];
        }
        return "N/A";
    }

    public static ArrayList<String[]> chargerVue(String nomVue) {
        ArrayList<String[]> resultat = new ArrayList<>();
        String requete = "SELECT * FROM " + nomVue + ";";
        Statement unStat = null;
        ResultSet desResultats = null;
        try {
            Modele.getConnexion().seConnecter();
            unStat = Modele.getConnexion().getMaConnexion().createStatement();
            desResultats = unStat.executeQuery(requete);

            ResultSetMetaData rsmd = desResultats.getMetaData();
            int nbColonnes = rsmd.getColumnCount();
            while (desResultats.next()) {
                String[] ligne = new String[nbColonnes];
                for (int i = 1; i <= nbColonnes; i++) {
                    ligne[i - 1] = desResultats.getString(i);
                }
                resultat.add(ligne);
            }
        } catch (Exception e) {
            System.out.println("Erreur de chargement de la vue : " + e);
        } finally {
            try {
                if (desResultats != null) desResultats.close();
                if (unStat != null) unStat.close();
                Modele.getConnexion().seDeConnecter();
            } catch (Exception e) {
                System.out.println("Erreur lors de la fermeture : " + e);
            }
        }
        return resultat;
    }

    public static String[] getColonnesVue(String nomVue) {
        ArrayList<String> colonnes = new ArrayList<>();
        String requete = "SELECT * FROM " + nomVue + " LIMIT 1;";
        Statement unStat = null;
        ResultSet desResultats = null;
        try {
            Modele.getConnexion().seConnecter();
            unStat = Modele.getConnexion().getMaConnexion().createStatement();
            desResultats = unStat.executeQuery(requete);

            ResultSetMetaData rsmd = desResultats.getMetaData();
            int nbColonnes = rsmd.getColumnCount();
            for (int i = 1; i <= nbColonnes; i++) {
                colonnes.add(rsmd.getColumnLabel(i));
            }
        } catch (Exception e) {
            System.out.println("Erreur pour obtenir les colonnes : " + e);
        } finally {
            try {
                if (desResultats != null) desResultats.close();
                if (unStat != null) unStat.close();
                Modele.getConnexion().seDeConnecter();
            } catch (Exception e) {
                System.out.println("Erreur lors de la fermeture : " + e);
            }
        }
        return colonnes.toArray(new String[0]);
    }
}
