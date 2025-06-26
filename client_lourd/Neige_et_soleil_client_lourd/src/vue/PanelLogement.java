package vue;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.border.*;

import controleur.Controleur;
import controleur.Logement;
import controleur.Proprietaire;
import controleur.Tableau;

public class PanelLogement extends PanelPrincipal implements ActionListener {

    private JPanel panelForm = new JPanel();
    private JPanel panelRecherche = new JPanel();

    private JTextField txtNomImmeuble = new JTextField();
    private JTextField txtAdresse = new JTextField();
    private JTextField txtCodePostal = new JTextField();
    private JTextField txtVille = new JTextField();
    private JTextField txtTypeLogement = new JTextField();
    private JTextField txtSurfaceHabitable = new JTextField();
    private JTextField txtCapaciteAccueil = new JTextField();
    private JTextField txtSpecifite = new JTextField();
    private JTextField txtPhoto = new JTextField();
    private JTextField txtRecherche = new JTextField(15);

    private static JComboBox<String> txtIdProprietaire = new JComboBox<>();

    private JButton btAnnuler = new JButton("Annuler");
    private JButton btValider = new JButton("Valider");
    private JButton btRechercher = new JButton("Rechercher");
    private JButton btSupprimer = new JButton("Supprimer");
    private JButton btModifier = new JButton("Modifier");

    private JTable tableLogements;
    private Tableau tableauLogements;

    public PanelLogement() {
        super("Gérer les logements");

        ajusterTailleChamps();

        // ==== FORMULAIRE ====
        this.panelForm.setLayout(new BorderLayout(10, 10));
        this.panelForm.setBackground(new Color(245, 245, 245));
        this.panelForm.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(15, 15, 15, 15)
        ));
        this.panelForm.setBounds(30, 120, 400, 425);

        this.add(this.panelForm);

        JPanel panelCentre = new JPanel(new GridLayout(9, 2, 8, 16)); // 16 au lieu de 8 pour la hauteur
        panelCentre.setBackground(new Color(245, 245, 245));

        panelCentre.add(new JLabel("Nom Immeuble :"));
        panelCentre.add(this.txtNomImmeuble);

        panelCentre.add(new JLabel("Adresse :"));
        panelCentre.add(this.txtAdresse);

        panelCentre.add(new JLabel("Code Postal :"));
        panelCentre.add(this.txtCodePostal);

        panelCentre.add(new JLabel("Ville :"));
        panelCentre.add(this.txtVille);

        panelCentre.add(new JLabel("Type Logement :"));
        panelCentre.add(this.txtTypeLogement);

        panelCentre.add(new JLabel("Surface Habitable (m²) :"));
        panelCentre.add(this.txtSurfaceHabitable);

        panelCentre.add(new JLabel("Capacité d'Accueil :"));
        panelCentre.add(this.txtCapaciteAccueil);

        panelCentre.add(new JLabel("Spécificité :"));
        panelCentre.add(this.txtSpecifite);

        panelCentre.add(new JLabel("Photo (URL) :"));
        panelCentre.add(this.txtPhoto);

        this.panelForm.add(panelCentre, BorderLayout.CENTER);

        JPanel panelBas = new JPanel(new GridLayout(3, 2, 10, 10));
        panelBas.setBackground(new Color(245, 245, 245));

        // Ligne 1
        panelBas.add(new JLabel("Propriétaire :"));
        panelBas.add(this.txtIdProprietaire);

        // Ligne 2
        panelBas.add(this.btAnnuler);
        panelBas.add(this.btValider);

        // Ligne 3
        panelBas.add(this.btSupprimer);
        panelBas.add(this.btModifier);

        this.panelForm.add(panelBas, BorderLayout.SOUTH);

        styliserBouton(this.btAnnuler);
        styliserBouton(this.btValider);
        styliserBouton(this.btSupprimer);
        styliserBouton(this.btModifier);
        styliserBouton(this.btRechercher);

        // ==== RECHERCHE ====
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

        this.btRechercher.setText("Rechercher");
        this.btRechercher.setPreferredSize(new Dimension(105, 20));
        this.btRechercher.setFont(new Font("Arial", Font.BOLD, 11));
        this.panelRecherche.add(this.btRechercher);

        // ==== TABLEAU ====
        String[] entetes = {"ID", "Nom Immeuble", "Adresse", "Ville", "Type", "Surface", "Capacité", "Propriétaire"};
        this.tableauLogements = new Tableau(this.obtenirDonnees(), entetes);
        this.tableLogements = new JTable(this.tableauLogements);
        JScrollPane uneScroll = new JScrollPane(this.tableLogements);
        uneScroll.setBounds(450, 120, 600, 425);
        this.add(uneScroll);

        remplirIDProprietaires();

        // ==== ACTIONS ====
        this.btAnnuler.addActionListener(this);
        this.btValider.addActionListener(this);
        this.btRechercher.addActionListener(this);
        this.btSupprimer.addActionListener(this);
        this.btModifier.addActionListener(this);

        this.tableLogements.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int selectedRow = tableLogements.getSelectedRow();
                if (selectedRow >= 0) {
                    txtNomImmeuble.setText(tableLogements.getValueAt(selectedRow, 1).toString());
                    txtAdresse.setText(tableLogements.getValueAt(selectedRow, 2).toString());
                    txtVille.setText(tableLogements.getValueAt(selectedRow, 3).toString());
                    txtTypeLogement.setText(tableLogements.getValueAt(selectedRow, 4).toString());
                    txtSurfaceHabitable.setText(tableLogements.getValueAt(selectedRow, 5).toString());
                    txtCapaciteAccueil.setText(tableLogements.getValueAt(selectedRow, 6).toString());
                    txtSpecifite.setText("");
                    txtPhoto.setText("");
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

    private void ajusterTailleChamps() {
        Dimension dimChamp = new Dimension(100, 30);
        this.txtNomImmeuble.setPreferredSize(dimChamp);
        this.txtAdresse.setPreferredSize(dimChamp);
        this.txtCodePostal.setPreferredSize(dimChamp);
        this.txtVille.setPreferredSize(dimChamp);
        this.txtTypeLogement.setPreferredSize(dimChamp);
        this.txtSurfaceHabitable.setPreferredSize(dimChamp);
        this.txtCapaciteAccueil.setPreferredSize(dimChamp);
        this.txtSpecifite.setPreferredSize(dimChamp);
        this.txtPhoto.setPreferredSize(dimChamp);
    }

    public static void remplirIDProprietaires() {
        txtIdProprietaire.removeAllItems();
        ArrayList<Proprietaire> lesProprietaires = Controleur.selectAllProprietaires();

        for (Proprietaire unProprietaire : lesProprietaires) {
            txtIdProprietaire.addItem(String.valueOf(unProprietaire.getIdProprietaire()));
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == this.btAnnuler) {
            viderChamps();
        } else if (e.getSource() == this.btValider) {
            try {
                String nomImmeuble = this.txtNomImmeuble.getText();
                String adresse = this.txtAdresse.getText();
                String codePostal = this.txtCodePostal.getText();
                String ville = this.txtVille.getText();
                String typeLogement = this.txtTypeLogement.getText();
                float surfaceHabitable = Float.parseFloat(this.txtSurfaceHabitable.getText());
                int capaciteAccueil = Integer.parseInt(this.txtCapaciteAccueil.getText());
                String specifite = this.txtSpecifite.getText();
                String photo = this.txtPhoto.getText();

                String[] tab = txtIdProprietaire.getSelectedItem().toString().split("-");
                int idProprietaire = Integer.parseInt(tab[0]);

                Logement unLogement = new Logement(0, idProprietaire, nomImmeuble, adresse, codePostal, ville, typeLogement, surfaceHabitable, capaciteAccueil, specifite, photo);
                Controleur.insertLogement(unLogement);

                JOptionPane.showMessageDialog(this, "Insertion réussie du Logement.", "Insertion Logement", JOptionPane.INFORMATION_MESSAGE);

                actualiserTableau();
                viderChamps();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Erreur : " + ex.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        } else if (e.getSource() == this.btRechercher) {
            actualiserTableau();
        } else if (e.getSource() == this.btSupprimer) {
            int selectedRow = this.tableLogements.getSelectedRow();
            if (selectedRow >= 0) {
                int idLogement = Integer.parseInt(this.tableLogements.getValueAt(selectedRow, 0).toString());
                Controleur.deleteLogement(idLogement);
                JOptionPane.showMessageDialog(this, "Suppression réussie du logement.", "Suppression", JOptionPane.INFORMATION_MESSAGE);
                actualiserTableau();
                viderChamps();
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner un logement à supprimer.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
            }
        } else if (e.getSource() == this.btModifier) {
            int selectedRow = this.tableLogements.getSelectedRow();
            if (selectedRow >= 0) {
                try {
                    int idLogement = Integer.parseInt(this.tableLogements.getValueAt(selectedRow, 0).toString());

                    String nomImmeuble = this.txtNomImmeuble.getText();
                    String adresse = this.txtAdresse.getText();
                    String codePostal = this.txtCodePostal.getText();
                    String ville = this.txtVille.getText();
                    String typeLogement = this.txtTypeLogement.getText();
                    float surfaceHabitable = Float.parseFloat(this.txtSurfaceHabitable.getText());
                    int capaciteAccueil = Integer.parseInt(this.txtCapaciteAccueil.getText());
                    String specifite = this.txtSpecifite.getText();
                    String photo = this.txtPhoto.getText();

                    String[] tab = txtIdProprietaire.getSelectedItem().toString().split("-");
                    int idProprietaire = Integer.parseInt(tab[0]);

                    Logement unLogement = new Logement(idLogement, idProprietaire, nomImmeuble, adresse, codePostal, ville, typeLogement, surfaceHabitable, capaciteAccueil, specifite, photo);
                    Controleur.updateLogement(unLogement);

                    JOptionPane.showMessageDialog(this, "Modification réussie du logement.", "Modification", JOptionPane.INFORMATION_MESSAGE);
                    actualiserTableau();
                    viderChamps();
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(this, "Erreur : " + ex.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner un logement à modifier.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public Object[][] obtenirDonnees() {
        ArrayList<Logement> logements;
        String filtre = this.txtRecherche.getText().trim();

        if (filtre.isEmpty()) {
            logements = Controleur.selectAllLogements();
        } else {
            logements = Controleur.selectLikeLogements(filtre);
        }

        Object[][] matrice = new Object[logements.size()][8];
        int i = 0;
        for (Logement unLogement : logements) {
            matrice[i][0] = unLogement.getIdLogement();
            matrice[i][1] = unLogement.getNomImmeuble();
            matrice[i][2] = unLogement.getAdresse();
            matrice[i][3] = unLogement.getVille();
            matrice[i][4] = unLogement.getTypeLogement();
            matrice[i][5] = unLogement.getSurfaceHabitable();
            matrice[i][6] = unLogement.getCapaciteAccueil();
            matrice[i][7] = unLogement.getIdProprietaire();
            i++;
        }
        return matrice;
    }

    public void actualiserTableau() {
        this.tableauLogements.setDonnees(this.obtenirDonnees());
        this.tableLogements.repaint();
    }

    public void viderChamps() {
        this.txtNomImmeuble.setText("");
        this.txtAdresse.setText("");
        this.txtCodePostal.setText("");
        this.txtVille.setText("");
        this.txtTypeLogement.setText("");
        this.txtSurfaceHabitable.setText("");
        this.txtCapaciteAccueil.setText("");
        this.txtSpecifite.setText("");
        this.txtPhoto.setText("");
    }
}
