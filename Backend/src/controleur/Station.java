package controleur;

public class Station {
    private int idStation;
    private String nom;

    // Constructeur avec ID
    public Station(int idStation, String nom) {
        this.idStation = idStation;
        this.nom = nom;
    }

    // Constructeur sans ID (pour insertion)
    public Station(String nom) {
        this.idStation = 0; // Par défaut pour les nouvelles insertions
        this.nom = nom;
    }

    // Getters et Setters
    public int getIdStation() {
        return idStation;
    }

    public void setIdStation(int idStation) {
        this.idStation = idStation;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }
}
