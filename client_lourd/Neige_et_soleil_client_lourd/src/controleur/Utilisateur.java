package controleur;

import java.sql.Timestamp;

public class Utilisateur {
    private int idUtilisateur; 
    private String nom, prenom, email, motDePasse, role;
    private Timestamp dateCreation;

    // Constructeur avec ID et date_creation (pour la récupération depuis la BDD)
    public Utilisateur(int idUtilisateur, String nom, String prenom, String email, String motDePasse, String role, Timestamp dateCreation) {
        this.idUtilisateur = idUtilisateur;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateCreation = dateCreation;
    }

    // Constructeur sans ID et sans date_creation (pour insertion)
    public Utilisateur(String nom, String prenom, String email, String motDePasse, String role) {
        this.idUtilisateur = 0; // Auto-incrémenté en base
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateCreation = null; // Généré automatiquement en BDD
    }

    // Getters et Setters
    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Timestamp getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Timestamp dateCreation) {
        this.dateCreation = dateCreation;
    }
}
