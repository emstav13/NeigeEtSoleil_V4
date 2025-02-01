package controleur;

public class Activite {
    protected int idActivite;
    protected String nomActivite;
    protected int idStation;

    // Constructeur
    public Activite(int idActivite, String nomActivite, int idStation) {
        this.idActivite = idActivite;
        this.nomActivite = nomActivite;
        this.idStation = idStation;
    }

    public Activite(String nomActivite, int idStation) {
        this.nomActivite = nomActivite;
        this.idStation = idStation;
    }

    // Getters et Setters
    public int getIdActivite() {
        return idActivite;
    }

    public String getNomActivite() {
        return nomActivite;
    }

    public int getIdStation() {
        return idStation;
    }
}
