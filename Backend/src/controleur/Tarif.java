package controleur;

public class Tarif {
    private int idTarif;
    private Integer idLogement; // Peut être null si c'est une activité
    private Integer idActivite; // Peut être null si c'est un logement
    private int idSaison;
    private double prix;

    // Constructeur avec ID
    public Tarif(int idTarif, Integer idLogement, Integer idActivite, int idSaison, double prix) {
        this.idTarif = idTarif;
        this.idLogement = idLogement;
        this.idActivite = idActivite;
        this.idSaison = idSaison;
        this.prix = prix;
    }

    // Constructeur pour logement
    public Tarif(Integer idLogement, int idSaison, double prix) {
        this.idTarif = 0;
        this.idLogement = idLogement;
        this.idActivite = null;
        this.idSaison = idSaison;
        this.prix = prix;
    }

    // Constructeur pour activité
    public Tarif(int idActivite, int idSaison, double prix) {
        this.idTarif = 0;
        this.idLogement = null;
        this.idActivite = idActivite;
        this.idSaison = idSaison;
        this.prix = prix;
    }

    // Getters et Setters
    public int getIdTarif() {
        return idTarif;
    }

    public Integer getIdLogement() {
        return idLogement;
    }

    public Integer getIdActivite() {
        return idActivite;
    }

    public int getIdSaison() {
        return idSaison;
    }

    public double getPrix() {
        return prix;
    }
}
