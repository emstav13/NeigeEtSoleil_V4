package controleur;

public class Saison {
    private int idSaison;
    private String nom;
    private String dateDebut;
    private String dateFin;

    // Constructeur avec ID
    public Saison(int idSaison, String nom, String dateDebut, String dateFin) {
        this.idSaison = idSaison;
        this.nom = nom;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    // Constructeur sans ID (pour insertion)
    public Saison(String nom, String dateDebut, String dateFin) {
        this.idSaison = 0; // Par défaut pour les nouvelles insertions
        this.nom = nom;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    // Getters et Setters
    public int getIdSaison() {
        return idSaison;
    }

    public void setIdSaison(int idSaison) {
        this.idSaison = idSaison;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }
}
