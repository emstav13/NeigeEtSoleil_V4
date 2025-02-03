package controleur;

public class Culturelle extends Activite {
    private int duree; // Durée en minutes
    private String publicCible; // 'enfants', 'adultes', 'tous'
    private double prix; // ✅ Ajout du prix de l'activité

    // ✅ Constructeur avec ID (Utilisé pour récupérer une activité existante)
    public Culturelle(int idActivite, String nomActivite, int idStation, int duree, String publicCible, double prix) {
        super(idActivite, nomActivite, idStation);
        this.duree = duree;
        this.publicCible = publicCible;
        this.prix = prix;
    }

    // ✅ Constructeur sans ID (Utilisé pour ajouter une nouvelle activité)
    public Culturelle(String nomActivite, int idStation, int duree, String publicCible, double prix) {
        super(nomActivite, idStation);
        this.duree = duree;
        this.publicCible = publicCible;
        this.prix = prix;
    }

    // ✅ Getters et Setters
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

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    @Override
    public String toString() {
        return "Culturelle{" +
                "idActivite=" + getIdActivite() +
                ", nomActivite='" + getNomActivite() + '\'' +
                ", idStation=" + getIdStation() +
                ", duree=" + duree +
                ", publicCible='" + publicCible + '\'' +
                ", prix=" + prix +
                '}';
    }
}
