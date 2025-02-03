package controleur;

public class Detente extends Activite {
    private String typeDetente; // Type de détente (ex: Spa, Balade)
    private double prix; // ✅ Renommé depuis `prixEntree` pour uniformisation

    // ✅ Constructeur avec ID (Utilisé pour récupérer une activité existante)
    public Detente(int idActivite, String nomActivite, int idStation, String typeDetente, double prix) {
        super(idActivite, nomActivite, idStation);
        this.typeDetente = typeDetente;
        this.prix = prix;
    }

    // ✅ Constructeur sans ID (Utilisé pour ajouter une nouvelle activité)
    public Detente(String nomActivite, int idStation, String typeDetente, double prix) {
        super(nomActivite, idStation);
        this.typeDetente = typeDetente;
        this.prix = prix;
    }

    // ✅ Getters et Setters
    public String getTypeDetente() {
        return typeDetente;
    }

    public void setTypeDetente(String typeDetente) {
        this.typeDetente = typeDetente;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    @Override
    public String toString() {
        return "Detente{" +
                "idActivite=" + getIdActivite() +
                ", nomActivite='" + getNomActivite() + '\'' +
                ", idStation=" + getIdStation() +
                ", typeDetente='" + typeDetente + '\'' +
                ", prix=" + prix +
                '}';
    }
}
