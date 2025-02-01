package controleur;

public class Sport extends Activite {
    private String typeSport; // Type de sport (ex: Football, Tennis)
    private String niveauDifficulte; // Débutant, Intermédiaire, Avancé

    public Sport(int idActivite, String nomActivite, int idStation, String typeSport, String niveauDifficulte) {
        super(idActivite, nomActivite, idStation);
        this.typeSport = typeSport;
        this.niveauDifficulte = niveauDifficulte;
    }

    public Sport(String nomActivite, int idStation, String typeSport, String niveauDifficulte) {
        super(nomActivite, idStation);
        this.typeSport = typeSport;
        this.niveauDifficulte = niveauDifficulte;
    }

    // Getters et Setters
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

    @Override
    public String toString() {
        return "Sport{" +
                "idActivite=" + getIdActivite() +
                ", nomActivite='" + getNomActivite() + '\'' +
                ", idStation=" + getIdStation() +
                ", typeSport='" + typeSport + '\'' +
                ", niveauDifficulte='" + niveauDifficulte + '\'' +
                '}';
    }
}
