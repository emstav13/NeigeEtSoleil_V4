package controleur;

public class Logement {
    private int idLogement;
    private int idProprietaire;
    private String nomImmeuble, adresse, codePostal, ville, typeLogement, specifite, photo;
    private float surfaceHabitable;
    private int capaciteAccueil;

    // Constructeur avec ID (pour récupération depuis la BDD)
    public Logement(int idLogement, int idProprietaire, String nomImmeuble, String adresse, 
                    String codePostal, String ville, String typeLogement, 
                    float surfaceHabitable, int capaciteAccueil, String specifite, String photo) {
        this.idLogement = idLogement;
        this.idProprietaire = idProprietaire;
        this.nomImmeuble = nomImmeuble;
        this.adresse = adresse;
        this.codePostal = codePostal;
        this.ville = ville;
        this.typeLogement = typeLogement;
        this.surfaceHabitable = surfaceHabitable;
        this.capaciteAccueil = capaciteAccueil;
        this.specifite = specifite;
        this.photo = photo;
    }

    // Constructeur sans ID (pour insertion)
    public Logement(int idProprietaire, String nomImmeuble, String adresse, 
                    String codePostal, String ville, String typeLogement, 
                    float surfaceHabitable, int capaciteAccueil, String specifite, String photo) {
        this.idLogement = 0; // Auto-incrémenté en base
        this.idProprietaire = idProprietaire;
        this.nomImmeuble = nomImmeuble;
        this.adresse = adresse;
        this.codePostal = codePostal;
        this.ville = ville;
        this.typeLogement = typeLogement;
        this.surfaceHabitable = surfaceHabitable;
        this.capaciteAccueil = capaciteAccueil;
        this.specifite = specifite;
        this.photo = photo;
    }

    // Getters et Setters
    public int getIdLogement() {
        return idLogement;
    }

    public void setIdLogement(int idLogement) {
        this.idLogement = idLogement;
    }

    public int getIdProprietaire() {
        return idProprietaire;
    }

    public void setIdProprietaire(int idProprietaire) {
        this.idProprietaire = idProprietaire;
    }

    public String getNomImmeuble() {
        return nomImmeuble;
    }

    public void setNomImmeuble(String nomImmeuble) {
        this.nomImmeuble = nomImmeuble;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getTypeLogement() {
        return typeLogement;
    }

    public void setTypeLogement(String typeLogement) {
        this.typeLogement = typeLogement;
    }

    public float getSurfaceHabitable() {
        return surfaceHabitable;
    }

    public void setSurfaceHabitable(float surfaceHabitable) {
        this.surfaceHabitable = surfaceHabitable;
    }

    public int getCapaciteAccueil() {
        return capaciteAccueil;
    }

    public void setCapaciteAccueil(int capaciteAccueil) {
        this.capaciteAccueil = capaciteAccueil;
    }

    public String getSpecifite() {
        return specifite;
    }

    public void setSpecifite(String specifite) {
        this.specifite = specifite;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
