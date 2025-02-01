package controleur;

public class Culturelle extends Activite {
    private int duree; // Durée en minutes
    private String publicCible; // 'enfants', 'adultes', 'tous'

    public Culturelle(int idActivite, String nomActivite, int idStation, int duree, String publicCible) {
        super(idActivite, nomActivite, idStation);
        this.duree = duree;
        this.publicCible = publicCible;
    }

    public Culturelle(String nomActivite, int idStation, int duree, String publicCible) {
        super(nomActivite, idStation);
        this.duree = duree;
        this.publicCible = publicCible;
    }

    // Getters et Setters
    public int getDuree() {
        return duree;
    }

    public void setDuree(int duree) {
        this.duree = duree;
    }

    public String getPublicCible() {
        return publicCible;
    }

    public void setPublicCible(String publicCible) {
        this.publicCible = publicCible;
    }

    @Override
    public String toString() {
        return "Culturelle{" +
                "idActivite=" + getIdActivite() +
                ", nomActivite='" + getNomActivite() + '\'' +
                ", idStation=" + getIdStation() +
                ", duree=" + duree +
                ", publicCible='" + publicCible + '\'' +
                '}';
    }
}
