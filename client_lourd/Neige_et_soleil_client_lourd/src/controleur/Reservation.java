package controleur;

public class Reservation {
    private int idReservation; 
    private int idUtilisateur; 
    private int idLogement;
    private String dateDebut, dateFin, statut;

    // Constructeur avec ID (utilisé pour récupérer depuis la BDD)
    public Reservation(int idReservation, int idUtilisateur, int idLogement, String dateDebut, String dateFin, String statut) {
        this.idReservation = idReservation;
        this.idUtilisateur = idUtilisateur;
        this.idLogement = idLogement;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
    }

    // Constructeur sans ID (utilisé pour insertion)
    public Reservation(int idUtilisateur, int idLogement, String dateDebut, String dateFin, String statut) {
        this.idReservation = 0; // Auto-incrémenté en base
        this.idUtilisateur = idUtilisateur;
        this.idLogement = idLogement;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
    }

    // Getters et Setters
    public int getIdReservation() {
        return idReservation;
    }

    public void setIdReservation(int idReservation) {
        this.idReservation = idReservation;
    }

    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
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
