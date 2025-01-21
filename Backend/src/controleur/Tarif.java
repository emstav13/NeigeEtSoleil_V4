package controleur;

public class Tarif {
    private int idTarif;
    private int idLogement;
    private int idSaison;
    private double prix;

    // Constructeur avec ID
    public Tarif(int idTarif, int idLogement, int idSaison, double prix) {
        this.idTarif = idTarif;
        this.idLogement = idLogement;
        this.idSaison = idSaison;
        this.prix = prix;
    }

    // Constructeur sans ID (pour insertion)
    public Tarif(int idLogement, int idSaison, double prix) {
        this.idTarif = 0; // Par défaut pour les nouvelles insertions
        this.idLogement = idLogement;
        this.idSaison = idSaison;
        this.prix = prix;
    }

    // Getters et Setters
    public int getIdTarif() {
        return idTarif;
    }

    public void setIdTarif(int idTarif) {
        this.idTarif = idTarif;
    }

    public int getIdLogement() {
        return idLogement;
    }

    public void setIdLogement(int idLogement) {
        this.idLogement = idLogement;
    }

    public int getIdSaison() {
        return idSaison;
    }

    public void setIdSaison(int idSaison) {
        this.idSaison = idSaison;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }
}
