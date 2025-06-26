package controleur;

import vue.VueConnexion;
import vue.VueGenerale;

public class NS {

	//instanciation de la classe VueConnexion 
	private static VueConnexion uneVueConnexion; 
	
	private static VueGenerale uneVueGenerale; 
	
	private static Utilisateur UtilisateurConnecte ; 
	
	public static void setUtilisateurConnecte (Utilisateur unUtilisateur) {
		UtilisateurConnecte = unUtilisateur;
	}
	public static Utilisateur getUtilisateurConnecte () {
		return UtilisateurConnecte; 
	}
	
	public static void creerVueGenerale (boolean action) {
		if (action == true) {
			uneVueGenerale = new VueGenerale(); 
			uneVueGenerale.setVisible(true);
		}else {
			uneVueGenerale.dispose();
		}
	}
	
	public static void rendreVisibleVueConnexion (boolean action) {
		uneVueConnexion.setVisible(action);
	}
	
	public static void main(String[] args) {
		uneVueConnexion = new VueConnexion(); 
	}

}



