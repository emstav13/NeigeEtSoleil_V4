package controleur;

public class Logement {
    private int idLogement;
    private String nomImmeuble;
    private String adresse;
    private String codePostal;
    private String ville;
    private String typeLogement;
    private float surfaceHabitable;
    private int capaciteAccueil;
    private String specifite;

    // Constructeur avec ID
    public Logement(int idLogement, String nomImmeuble, String adresse, String codePostal, String ville, 
                    String typeLogement, float surfaceHabitable, int capaciteAccueil, String specifite) {
        this.idLogement = idLogement;
        this.nomImmeuble = nomImmeuble;
        this.adresse = adresse;
        this.codePostal = codePostal;
        this.ville = ville;
        this.typeLogement = typeLogement;
        this.surfaceHabitable = surfaceHabitable;
        this.capaciteAccueil = capaciteAccueil;
        this.specifite = specifite;
    }

    // Constructeur sans ID (pour insertion)
    public Logement(String nomImmeuble, String adresse, String codePostal, String ville, 
                    String typeLogement, float surfaceHabitable, int capaciteAccueil, String specifite) {
        this.idLogement = 0; // Par défaut pour les nouvelles insertions
        this.nomImmeuble = nomImmeuble;
        this.adresse = adresse;
        this.codePostal = codePostal;
        this.ville = ville;
        this.typeLogement = typeLogement;
        this.surfaceHabitable = surfaceHabitable;
        this.capaciteAccueil = capaciteAccueil;
        this.specifite = specifite;
    }

    // Getters et Setters
    public int getIdLogement() {
        return idLogement;
    }

    public void setIdLogement(int idLogement) {
        this.idLogement = idLogement;
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
}
