package modele;

import controleur.Utilisateur;

public class TestVerifier {
    public static void main(String[] args) {
        String email = args[0];
        String mot_de_passe = args[1];

        Utilisateur utilisateur = Modele.verifierUtilisateur(email, mot_de_passe);
        if (utilisateur != null) {
            System.out.println(utilisateur.getNom() + ";" + utilisateur.getPrenom() + ";" + utilisateur.getEmail());
        } else {
            System.out.println("null");
        }
    }
}
