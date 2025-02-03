package controleur;

public class Sport extends Activite {
    private String typeSport; // Type de sport (ex: Escalade, Ski)
    private String niveauDifficulte; // Débutant, Intermédiaire, Avancé
    private double prix; // ✅ Ajout du prix de l'activité

    // ✅ Constructeur avec ID (Utilisé pour récupérer une activité existante)
    public Sport(int idActivite, String nomActivite, int idStation, String typeSport, String niveauDifficulte, double prix) {
        super(idActivite, nomActivite, idStation);
        this.typeSport = typeSport;
        this.niveauDifficulte = niveauDifficulte;
        this.prix = prix;
    }

    // ✅ Constructeur sans ID (Utilisé pour ajouter une nouvelle activité)
    public Sport(String nomActivite, int idStation, String typeSport, String niveauDifficulte, double prix) {
        super(nomActivite, idStation);
        this.typeSport = typeSport;
        this.niveauDifficulte = niveauDifficulte;
        this.prix = prix;
    }

    // ✅ Getters et Setters
    public String getTypeSport() {
        return typeSport;
    }

    public void setTypeSport(String typeSport) {
        this.typeSport = typeSport;
    }

    public String getNiveauDifficulte() {
        return niveauDifficulte;
    }

    public void setNiveauDifficulte(String niveauDifficulte) {
        this.niveauDifficulte = niveauDifficulte;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    @Override
    public String toString() {
        return "Sport{" +
                "idActivite=" + getIdActivite() +
                ", nomActivite='" + getNomActivite() + '\'' +
                ", idStation=" + getIdStation() +
                ", typeSport='" + typeSport + '\'' +
                ", niveauDifficulte='" + niveauDifficulte + '\'' +
                ", prix=" + prix +
                '}';
    }
}
