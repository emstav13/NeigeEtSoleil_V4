package vue;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.border.*;

import controleur.NS;

public class VueGenerale extends JFrame implements ActionListener {

    private JPanel panelMenu = new JPanel();

    private JButton btProfil = createMenuButton("Profil");
    private JButton btUtilisateurs = createMenuButton("Utilisateurs");
    private JButton btProprietaires = createMenuButton("Propriétaires");
    private JButton btReservations = createMenuButton("Réservations");
    private JButton btLogements = createMenuButton("Logements");
    private JButton btStats = createMenuButton("Stats");
    private JButton btQuitter = createMenuButton("Quitter");

    private static PanelProfil unPanelProfil = new PanelProfil();
    private static PanelUtilisateur unPanelUtilisateurs = new PanelUtilisateur(); // <== ajouté
    private static PanelProprietaire unPanelProprietaires = new PanelProprietaire();
    private static PanelReservation unPanelReservations = new PanelReservation();
    private static PanelLogement unPanelLogements = new PanelLogement();
    private static PanelStats unPanelStats = new PanelStats();

    public VueGenerale() {
        this.setTitle("Gestion de Neige & Soleil");
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setResizable(false);
        this.getContentPane().setBackground(new Color(44, 62, 80)); 
        this.setLayout(null);
        this.setBounds(50, 50, 1100, 700);

        // Installation du panel Menu
        this.panelMenu.setBackground(new Color(44, 62, 80));
        this.panelMenu.setBounds(0, 10, 1080, 40);
        this.panelMenu.setLayout(new FlowLayout(FlowLayout.CENTER, 10, 5));

        this.panelMenu.add(this.btProfil);
        this.panelMenu.add(this.btUtilisateurs);
        this.panelMenu.add(this.btProprietaires);
        this.panelMenu.add(this.btReservations);
        this.panelMenu.add(this.btLogements);
        this.panelMenu.add(this.btQuitter);  // <== Quitter avant
        this.panelMenu.add(this.btStats);    // <== Stats après (éventuellement masqué si pas de place)
        this.add(this.panelMenu);

        // Rendre les boutons écoutables
        this.btProfil.addActionListener(this);
        this.btUtilisateurs.addActionListener(this); // Ajout de l'écouteur
        this.btProprietaires.addActionListener(this);
        this.btReservations.addActionListener(this);
        this.btLogements.addActionListener(this);
        this.btStats.addActionListener(this);
        this.btQuitter.addActionListener(this);

        // Ajout des panels
        this.add(unPanelProfil);
        this.add(unPanelUtilisateurs); // Ajout du panel Utilisateurs
        this.add(unPanelProprietaires);
        this.add(unPanelReservations);
        this.add(unPanelLogements);
        this.add(unPanelStats);

        afficherPanel(1); // Par défaut afficher Profil
        this.setVisible(true);
    }

    private void afficherPanel(int choix) {
        unPanelProfil.setVisible(false);
        unPanelUtilisateurs.setVisible(false);
        unPanelProprietaires.setVisible(false);
        unPanelReservations.setVisible(false);
        unPanelLogements.setVisible(false);
        unPanelStats.setVisible(false);

        switch (choix) {
            case 1: unPanelProfil.setVisible(true); break;
            case 2: unPanelUtilisateurs.setVisible(true); break;
            case 3: unPanelProprietaires.setVisible(true); break;
            case 4: unPanelReservations.setVisible(true); break;
            case 5: unPanelLogements.setVisible(true); break;
            case 6:
                unPanelStats.actualiserTableau();
                unPanelStats.setVisible(true);
                break;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String choix = e.getActionCommand();
        switch (choix) {
            case "Quitter":
                NS.rendreVisibleVueConnexion(true);
                NS.creerVueGenerale(false);
                break;
            case "Profil": this.afficherPanel(1); break;
            case "Utilisateurs": this.afficherPanel(2); break; // Ajout
            case "Propriétaires": this.afficherPanel(3); break;
            case "Réservations": this.afficherPanel(4); break;
            case "Logements": this.afficherPanel(5); break;
            case "Stats": this.afficherPanel(6); break;
        }
    }

    private static JButton createMenuButton(String text) {
        JButton bouton = new JButton(text);
        bouton.setFocusPainted(false);
        bouton.setBackground(Color.WHITE);
        bouton.setForeground(new Color(41, 128, 185)); 
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        bouton.setPreferredSize(new Dimension(150, 35));
        return bouton;
    }
}
