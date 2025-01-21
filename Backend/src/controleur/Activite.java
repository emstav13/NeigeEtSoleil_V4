package controleur;

public class Activite {
    private int idActivite;
    private String nomActivite;
    private int idStation;

    // Constructeur avec ID
    public Activite(int idActivite, String nomActivite, int idStation) {
        this.idActivite = idActivite;
        this.nomActivite = nomActivite;
        this.idStation = idStation;
    }

    // Constructeur sans ID (pour insertion)
    public Activite(String nomActivite, int idStation) {
        this.idActivite = 0; // Par défaut pour les nouvelles insertions
        this.nomActivite = nomActivite;
        this.idStation = idStation;
    }

    // Getters et Setters
    public int getIdActivite() {
        return idActivite;
    }

    public void setIdActivite(int idActivite) {
        this.idActivite = idActivite;
    }

    public String getNomActivite() {
        return nomActivite;
    }

    public void setNomActivite(String nomActivite) {
        this.nomActivite = nomActivite;
    }

    public int getIdStation() {
        return idStation;
    }

    public void setIdStation(int idStation) {
        this.idStation = idStation;
    }
}
