package controleur;

public class Proprietaire {
    private int idProprietaire;
    private int idUtilisateur;
    private String logements; // Stocké sous format JSON en base

    // Constructeur avec ID (pour récupération depuis la BDD)
    public Proprietaire(int idProprietaire, int idUtilisateur, String logements) {
        this.idProprietaire = idProprietaire;
        this.idUtilisateur = idUtilisateur;
        this.logements = logements;
    }

    // Constructeur sans ID (pour insertion)
    public Proprietaire(int idUtilisateur, String logements) {
        this.idProprietaire = 0; // Auto-incrémenté en base
        this.idUtilisateur = idUtilisateur;
        this.logements = logements;
    }

    // Getters et Setters
    public int getIdProprietaire() {
        return idProprietaire;
    }

    public void setIdProprietaire(int idProprietaire) {
        this.idProprietaire = idProprietaire;
    }

    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public String getLogements() {
        return logements;
    }

    public void setLogements(String logements) {
        this.logements = logements;
    }
}
