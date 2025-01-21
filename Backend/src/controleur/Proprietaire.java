package controleur;

public class Proprietaire {
    private int idProprietaire;
    private int idUtilisateur;

    // Constructeur avec ID
    public Proprietaire(int idProprietaire, int idUtilisateur) {
        this.idProprietaire = idProprietaire;
        this.idUtilisateur = idUtilisateur;
    }

    // Constructeur sans ID (pour insertion)
    public Proprietaire(int idUtilisateur) {
        this.idProprietaire = 0; // Par défaut pour les nouvelles insertions
        this.idUtilisateur = idUtilisateur;
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
}
