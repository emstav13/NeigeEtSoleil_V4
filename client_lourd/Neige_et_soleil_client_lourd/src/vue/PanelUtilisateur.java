package vue;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.border.*;
import controleur.Utilisateur;
import controleur.Controleur;
import controleur.Tableau;

public class PanelUtilisateur extends PanelPrincipal implements ActionListener {

    private JPanel panelForm = new JPanel();
    private JPanel panelRecherche = new JPanel();

    private JTextField txtNom = new JTextField();
    private JTextField txtPrenom = new JTextField();
    private JTextField txtEmail = new JTextField();
    private JPasswordField txtMotDePasse = new JPasswordField(); // Nouveau champ
    private JTextField txtRole = new JTextField();
    private JTextField txtRecherche = new JTextField(15);

    private JButton btAnnuler = new JButton("Annuler");
    private JButton btValider = new JButton("Valider");
    private JButton btSupprimer = new JButton("Supprimer");
    private JButton btModifier = new JButton("Modifier");
    private JButton btRechercher = new JButton("Rechercher");

    private JTable tableUtilisateurs;
    private Tableau tableauUtilisateurs;

    public PanelUtilisateur() {
        super("Gérer les utilisateurs");

        // ==== FORMULAIRE ====
        this.panelForm.setLayout(new BorderLayout(10, 10));
        this.panelForm.setBackground(new Color(245, 245, 245));
        this.panelForm.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(15, 15, 15, 15)
        ));
        this.panelForm.setBounds(30, 120, 400, 300); // Augmenter la hauteur
        this.add(this.panelForm);

        // Panel pour les champs
        JPanel panelChamps = new JPanel(new GridLayout(5, 2, 10, 10)); // 5 lignes
        panelChamps.setBackground(new Color(245, 245, 245));

        panelChamps.add(new JLabel("Nom :"));
        panelChamps.add(this.txtNom);

        panelChamps.add(new JLabel("Prénom :"));
        panelChamps.add(this.txtPrenom);

        panelChamps.add(new JLabel("Email :"));
        panelChamps.add(this.txtEmail);

        panelChamps.add(new JLabel("Mot de passe :"));
        panelChamps.add(this.txtMotDePasse);

        panelChamps.add(new JLabel("Rôle :"));
        panelChamps.add(this.txtRole);

        // Panel pour les boutons
        JPanel panelBoutons = new JPanel(new GridLayout(2, 2, 10, 10)); // 2x2 boutons
        panelBoutons.setBackground(new Color(245, 245, 245));
        panelBoutons.add(this.btAnnuler);
        panelBoutons.add(this.btValider);
        panelBoutons.add(this.btSupprimer);
        panelBoutons.add(this.btModifier);

        // Panel centre qui regroupe champs + boutons
        JPanel panelCentre = new JPanel(new BorderLayout(10, 10));
        panelCentre.setBackground(new Color(245, 245, 245));
        panelCentre.add(panelChamps, BorderLayout.CENTER);
        panelCentre.add(panelBoutons, BorderLayout.SOUTH);

        // Ajout au formulaire
        this.panelForm.add(panelCentre, BorderLayout.CENTER);

        // ==== BOUTONS STYLE ====
        styliserBouton(this.btAnnuler);
        styliserBouton(this.btValider);
        styliserBouton(this.btSupprimer);
        styliserBouton(this.btModifier);
        styliserBouton(this.btRechercher);

        // ==== PANEL RECHERCHE ====
        this.panelRecherche.setLayout(new FlowLayout(FlowLayout.LEFT, 10, 5));
        this.panelRecherche.setBounds(450, 70, 400, 40);
        this.panelRecherche.setBackground(new Color(245, 245, 245));
        this.panelRecherche.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(5, 10, 5, 10)
        ));
        this.add(this.panelRecherche);

        JLabel lblRecherche = new JLabel("Recherche :");
        lblRecherche.setFont(new Font("Arial", Font.PLAIN, 12));
        this.panelRecherche.add(lblRecherche);

        this.txtRecherche.setPreferredSize(new Dimension(140, 20));
        this.panelRecherche.add(this.txtRecherche);

        this.btRechercher.setPreferredSize(new Dimension(105, 20));
        this.btRechercher.setFont(new Font("Arial", Font.BOLD, 11));
        this.panelRecherche.add(this.btRechercher);

        // ==== TABLEAU UTILISATEURS ====
        String[] entetes = {"ID", "Nom", "Prénom", "Email", "Rôle"};
        this.tableauUtilisateurs = new Tableau(this.obtenirDonnees(), entetes);
        this.tableUtilisateurs = new JTable(this.tableauUtilisateurs);
        JScrollPane uneScroll = new JScrollPane(this.tableUtilisateurs);
        uneScroll.setBounds(450, 120, 600, 350);
        this.add(uneScroll);

        // ==== ACTIONS ====
        this.btAnnuler.addActionListener(this);
        this.btValider.addActionListener(this);
        this.btRechercher.addActionListener(this);
        this.btSupprimer.addActionListener(this);
        this.btModifier.addActionListener(this);

        this.tableUtilisateurs.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int selectedRow = tableUtilisateurs.getSelectedRow();
                if (selectedRow >= 0) {
                    txtNom.setText(tableUtilisateurs.getValueAt(selectedRow, 1).toString());
                    txtPrenom.setText(tableUtilisateurs.getValueAt(selectedRow, 2).toString());
                    txtEmail.setText(tableUtilisateurs.getValueAt(selectedRow, 3).toString());
                    txtRole.setText(tableUtilisateurs.getValueAt(selectedRow, 4).toString());
                    txtMotDePasse.setText(""); // On ne remplit PAS le mot de passe
                }
            }
        });
    }

    private void styliserBouton(JButton bouton) {
        bouton.setFocusPainted(false);
        bouton.setBackground(new Color(100, 149, 237));
        bouton.setForeground(Color.WHITE);
        bouton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == this.btAnnuler) {
            this.viderChamps();
        } else if (e.getSource() == this.btValider) {
            ArrayList<String> lesChamps = new ArrayList<>();
            lesChamps.add(this.txtNom.getText());
            lesChamps.add(this.txtPrenom.getText());
            lesChamps.add(this.txtEmail.getText());
            lesChamps.add(new String(this.txtMotDePasse.getPassword())); // ajout mot de passe
            lesChamps.add(this.txtRole.getText());

            if (Controleur.verifDonnees(lesChamps)) {
                Utilisateur unUtilisateur = new Utilisateur(
                    0,
                    txtNom.getText(),
                    txtPrenom.getText(),
                    txtEmail.getText(),
                    new String(this.txtMotDePasse.getPassword()),
                    txtRole.getText(),
                    null
                );
                Controleur.insertUtilisateur(unUtilisateur);
                JOptionPane.showMessageDialog(this, "Insertion réussie de l'utilisateur.", "Insertion Utilisateur", JOptionPane.INFORMATION_MESSAGE);
                actualiserTableau();
                viderChamps();
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez remplir tous les champs.", "Erreur de saisie", JOptionPane.ERROR_MESSAGE);
            }
        } else if (e.getSource() == this.btRechercher) {
            actualiserTableau();
        } else if (e.getSource() == this.btSupprimer) {
            int selectedRow = this.tableUtilisateurs.getSelectedRow();
            if (selectedRow >= 0) {
                int idUtilisateur = Integer.parseInt(this.tableUtilisateurs.getValueAt(selectedRow, 0).toString());
                Controleur.deleteUtilisateur(idUtilisateur);
                JOptionPane.showMessageDialog(this, "Suppression réussie de l'utilisateur.", "Suppression", JOptionPane.INFORMATION_MESSAGE);
                actualiserTableau();
                viderChamps();
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner un utilisateur à supprimer.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
            }
        } else if (e.getSource() == this.btModifier) {
            int selectedRow = this.tableUtilisateurs.getSelectedRow();
            if (selectedRow >= 0) {
                int idUtilisateur = Integer.parseInt(this.tableUtilisateurs.getValueAt(selectedRow, 0).toString());
                String nouveauMotDePasse = new String(this.txtMotDePasse.getPassword());
                Utilisateur unUtilisateur = new Utilisateur(
                    idUtilisateur,
                    txtNom.getText(),
                    txtPrenom.getText(),
                    txtEmail.getText(),
                    nouveauMotDePasse.isEmpty() ? null : nouveauMotDePasse, // null si champ vide
                    txtRole.getText(),
                    null
                );
                Controleur.updateUtilisateur(unUtilisateur);
                JOptionPane.showMessageDialog(this, "Modification réussie de l'utilisateur.", "Modification", JOptionPane.INFORMATION_MESSAGE);
                actualiserTableau();
                viderChamps();
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner un utilisateur à modifier.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public Object[][] obtenirDonnees() {
        ArrayList<Utilisateur> utilisateurs;
        String filtre = this.txtRecherche.getText().trim();

        if (filtre.isEmpty()) {
            utilisateurs = Controleur.selectAllUtilisateurs();
        } else {
            utilisateurs = Controleur.selectLikeUtilisateurs(filtre);
        }

        Object[][] matrice = new Object[utilisateurs.size()][5];
        int i = 0;
        for (Utilisateur u : utilisateurs) {
            matrice[i][0] = u.getIdUtilisateur();
            matrice[i][1] = u.getNom();
            matrice[i][2] = u.getPrenom();
            matrice[i][3] = u.getEmail();
            matrice[i][4] = u.getRole();
            i++;
        }
        return matrice;
    }

    public void actualiserTableau() {
        this.tableauUtilisateurs.setDonnees(this.obtenirDonnees());
        this.tableUtilisateurs.repaint();
    }

    public void viderChamps() {
        this.txtNom.setText("");
        this.txtPrenom.setText("");
        this.txtEmail.setText("");
        this.txtMotDePasse.setText("");
        this.txtRole.setText("");
    }
}
