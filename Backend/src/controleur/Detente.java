package controleur;

public class Detente extends Activite {
    private String typeDetente;
    private double prixEntree;

    // Constructeur avec ID
    public Detente(int idActivite, String nomActivite, int idStation, String typeDetente, double prixEntree) {
        super(idActivite, nomActivite, idStation);
        this.typeDetente = typeDetente;
        this.prixEntree = prixEntree;
    }

    // Constructeur sans ID (pour insertion)
    public Detente(String nomActivite, int idStation, String typeDetente, double prixEntree) {
        super(nomActivite, idStation);
        this.typeDetente = typeDetente;
        this.prixEntree = prixEntree;
    }

    // Getters et Setters
    public String getTypeDetente() {
        return typeDetente;
    }

    public void setTypeDetente(String typeDetente) {
        this.typeDetente = typeDetente;
    }

    public double getPrixEntree() {
        return prixEntree;
    }

    public void setPrixEntree(double prixEntree) {
        this.prixEntree = prixEntree;
    }

    @Override
    public String toString() {
        return "Detente{" +
                "idActivite=" + getIdActivite() +
                ", nomActivite='" + getNomActivite() + '\'' +
                ", idStation=" + getIdStation() +
                ", typeDetente='" + typeDetente + '\'' +
                ", prixEntree=" + prixEntree +
                '}';
    }
}
