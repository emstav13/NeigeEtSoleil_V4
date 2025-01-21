package controleur;

public class Contrat {
    private int idContrat;
    private int idProprietaire;
    private int idLogement;
    private String dateDebut;
    private String dateFin;
    private String statut;

    // Constructeur avec ID
    public Contrat(int idContrat, int idProprietaire, int idLogement, String dateDebut, String dateFin, String statut) {
        this.idContrat = idContrat;
        this.idProprietaire = idProprietaire;
        this.idLogement = idLogement;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
    }

    // Constructeur sans ID (pour insertion)
    public Contrat(int idProprietaire, int idLogement, String dateDebut, String dateFin, String statut) {
        this.idContrat = 0; // Par défaut pour les nouvelles insertions
        this.idProprietaire = idProprietaire;
        this.idLogement = idLogement;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
    }

    // Getters et Setters
    public int getIdContrat() {
        return idContrat;
    }

    public void setIdContrat(int idContrat) {
        this.idContrat = idContrat;
    }

    public int getIdProprietaire() {
        return idProprietaire;
    }

    public void setIdProprietaire(int idProprietaire) {
        this.idProprietaire = idProprietaire;
    }

    public int getIdLogement() {
        return idLogement;
    }

    public void setIdLogement(int idLogement) {
        this.idLogement = idLogement;
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

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
