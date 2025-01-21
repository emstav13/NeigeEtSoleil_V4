package controleur;

import java.security.MessageDigest;

public class Utilisateur {
    private int idUtilisateur;
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private String role;
    private String dateCreation;

    // Constructeur avec ID
    public Utilisateur(int idUtilisateur, String nom, String prenom, String email, String motDePasse, String role, String dateCreation) {
        this.idUtilisateur = idUtilisateur;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateCreation = dateCreation;
    }

        // Méthode pour hacher le mot de passe
        
        public static String hashPassword(String password) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hashedBytes = md.digest(password.getBytes("UTF-8"));
                StringBuilder sb = new StringBuilder();
                for (byte b : hashedBytes) {
                    sb.append(String.format("%02x", b));
                }
                return sb.toString();
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors du hachage du mot de passe");
            }
        }
            
    // Constructeur sans ID (pour insertion)
    public Utilisateur(String nom, String prenom, String email, String motDePasse, String role, String dateCreation) {
        this.idUtilisateur = 0; // Par défaut pour les nouvelles insertions
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = hashPassword(motDePasse); // Hashage du mot de passe
        this.role = role;
        this.dateCreation = dateCreation;
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

    public String getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(String dateCreation) {
        this.dateCreation = dateCreation;
    }
}
