package vue;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.border.*;

import controleur.Controleur;
import controleur.NS;
import controleur.Utilisateur;

public class PanelProfil extends PanelPrincipal implements ActionListener {
    private JTextArea txtInfos = new JTextArea();
    private Utilisateur unUtilisateur;
    
    private JPanel panelForm = new JPanel();
    private JTextField txtNom = new JTextField();
    private JTextField txtPrenom = new JTextField();
    private JTextField txtEmail = new JTextField();
    private JTextField txtRole = new JTextField();
    private JPasswordField txtMdp1 = new JPasswordField();
    private JPasswordField txtMdp2 = new JPasswordField();
    
    private JButton btModifier = new JButton("Modifier Profil");
    private JButton btAnnuler = new JButton("Annuler");
    private JButton btValider = new JButton("Valider");

    public PanelProfil() {
        super("Profil utilisateur");

        // ======= PANEL INFOS =======
        this.txtInfos.setBounds(30, 120, 400, 250);
        this.txtInfos.setBackground(new Color(245, 245, 245));
        this.txtInfos.setEditable(false);
        this.txtInfos.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(15, 15, 15, 15)
        ));
        this.add(this.txtInfos);

        this.unUtilisateur = NS.getUtilisateurConnecte();
        majInfosProfil();

        // ======= PANEL FORMULAIRE =======
        this.panelForm.setLayout(new BorderLayout(10, 10));
        this.panelForm.setBackground(new Color(245, 245, 245));
        this.panelForm.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(15, 15, 15, 15)
        ));
        this.panelForm.setBounds(450, 120, 400, 300);
        this.panelForm.setVisible(false);
        this.add(this.panelForm);

        JPanel panelCentre = new JPanel(new GridLayout(6, 2, 10, 10));
        panelCentre.setBackground(new Color(245, 245, 245));

        panelCentre.add(new JLabel("Nom :"));
        panelCentre.add(this.txtNom);

        panelCentre.add(new JLabel("Prénom :"));
        panelCentre.add(this.txtPrenom);

        panelCentre.add(new JLabel("Email :"));
        panelCentre.add(this.txtEmail);

        panelCentre.add(new JLabel("Rôle :"));
        panelCentre.add(this.txtRole);
        this.txtRole.setEditable(false);

        panelCentre.add(new JLabel("Mot de Passe :"));
        panelCentre.add(this.txtMdp1);

        panelCentre.add(new JLabel("Confirmation :"));
        panelCentre.add(this.txtMdp2);

        this.panelForm.add(panelCentre, BorderLayout.CENTER);

        JPanel panelBoutons = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        panelBoutons.setBackground(new Color(245, 245, 245));
        panelBoutons.add(this.btAnnuler);
        panelBoutons.add(this.btValider);
        this.panelForm.add(panelBoutons, BorderLayout.SOUTH);

        // ======= BOUTON MODIFIER =======
        this.btModifier.setBounds(150, 400, 150, 30);
        styliserBouton(this.btModifier);
        this.add(this.btModifier);

        // ======= STYLISATION BOUTONS =======
        styliserBouton(this.btAnnuler);
        styliserBouton(this.btValider);

        // ======= ACTIONS =======
        this.btAnnuler.addActionListener(this);
        this.btValider.addActionListener(this);
        this.btModifier.addActionListener(this);
    }

    private void styliserBouton(JButton bouton) {
        bouton.setFocusPainted(false);
        bouton.setBackground(new Color(100, 149, 237));
        bouton.setForeground(Color.WHITE);
        bouton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
    }

    private void majInfosProfil() {
        this.txtInfos.setText(
              "\n========= INFORMATIONS DU PROFIL UTILISATEUR =========\n\n"

            + " Nom : " + unUtilisateur.getNom() + "\n\n"
            + " Prénom : " + unUtilisateur.getPrenom() + "\n\n"
            + " Email : " + unUtilisateur.getEmail() + "\n\n"
            + " Rôle : " + unUtilisateur.getRole() + "\n\n"
            + "===================================================="
        );
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == this.btModifier) {
            this.txtNom.setText(unUtilisateur.getNom());
            this.txtPrenom.setText(unUtilisateur.getPrenom());
            this.txtEmail.setText(unUtilisateur.getEmail());
            this.txtRole.setText(unUtilisateur.getRole());
            this.panelForm.setVisible(true);
        }
        else if (e.getSource() == this.btAnnuler) {
            viderChamps();
            this.panelForm.setVisible(false);
        }
        else if (e.getSource() == this.btValider) {
            String nom = this.txtNom.getText();
            String prenom = this.txtPrenom.getText();
            String email = this.txtEmail.getText();
            String mdp1 = new String(this.txtMdp1.getPassword());
            String mdp2 = new String(this.txtMdp2.getPassword());

            ArrayList<String> lesChamps = new ArrayList<>();
            lesChamps.add(nom);
            lesChamps.add(prenom);
            lesChamps.add(email);
            lesChamps.add(mdp1);
            lesChamps.add(mdp2);

            if (Controleur.verifDonnees(lesChamps) && mdp1.equals(mdp2)) {
                unUtilisateur.setNom(nom);
                unUtilisateur.setPrenom(prenom);
                unUtilisateur.setEmail(email);
                unUtilisateur.setMotDePasse(mdp1);

                Controleur.updateUtilisateur(unUtilisateur);
                NS.setUtilisateurConnecte(unUtilisateur);

                JOptionPane.showMessageDialog(this, "Modification des données réussie", "Modification", JOptionPane.INFORMATION_MESSAGE);

                majInfosProfil();
            }
            else {
                JOptionPane.showMessageDialog(this, "Veuillez remplir les champs correctement.", "Modification Profil", JOptionPane.ERROR_MESSAGE);
            }

            viderChamps();
            this.panelForm.setVisible(false);
        }
    }

    private void viderChamps() {
        this.txtNom.setText("");
        this.txtPrenom.setText("");
        this.txtEmail.setText("");
        this.txtMdp1.setText("");
        this.txtMdp2.setText("");
    }
}
