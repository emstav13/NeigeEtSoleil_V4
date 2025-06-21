package vue;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.border.*;
import controleur.Proprietaire;
import controleur.Controleur;
import controleur.Tableau;

public class PanelProprietaire extends PanelPrincipal implements ActionListener {

    private JPanel panelForm = new JPanel(); 
    private JPanel panelRecherche = new JPanel();

    private JTextField txtIdUtilisateur = new JTextField(); 
    private JTextField txtLogements = new JTextField(); 
    private JTextField txtRecherche = new JTextField(15);

    private JButton btAnnuler = new JButton("Annuler"); 
    private JButton btValider = new JButton("Valider"); 
    private JButton btSupprimer = new JButton("Supprimer");
    private JButton btModifier = new JButton("Modifier");
    private JButton btRechercher = new JButton("Rechercher"); 

    private JTable tableProprietaires;
    private Tableau tableauProprietaires;

    public PanelProprietaire() {
        super("Gérer les propriétaires"); 

     // ==== FORMULAIRE ====
        this.panelForm.setLayout(new BorderLayout(10, 10));
        this.panelForm.setBackground(new Color(245, 245, 245));
        this.panelForm.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(15, 15, 15, 15) // marges internes
        ));
        this.panelForm.setBounds(30, 120, 400, 200);
        this.add(this.panelForm);

        // Panel pour le titre
        JLabel lblTitreFormulaire = new JLabel("Formulaire propriétaire");
        lblTitreFormulaire.setFont(new Font("Arial", Font.BOLD, 16));
        lblTitreFormulaire.setHorizontalAlignment(SwingConstants.CENTER);
        this.panelForm.add(lblTitreFormulaire, BorderLayout.NORTH);

        // Panel pour les champs et boutons
        JPanel panelCentre = new JPanel(new GridLayout(4, 2, 10, 10));
        panelCentre.setBackground(new Color(245, 245, 245));

        // Ajout des champs
        panelCentre.add(new JLabel("ID Utilisateur :"));
        panelCentre.add(this.txtIdUtilisateur);

        panelCentre.add(new JLabel("Logements (JSON) :"));
        panelCentre.add(this.txtLogements);

        // Ajout des boutons
        panelCentre.add(this.btAnnuler);
        panelCentre.add(this.btValider);
        panelCentre.add(this.btSupprimer);
        panelCentre.add(this.btModifier);

        this.panelForm.add(panelCentre, BorderLayout.CENTER);


        // ==== BOUTONS STYLE MODERNE ====
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
            new LineBorder(Color.LIGHT_GRAY, 2), // Bordure plus épaisse : 3px
            new EmptyBorder(5, 10, 5, 10)
        ));
        this.add(this.panelRecherche);

        // Label
        JLabel lblRecherche = new JLabel("Recherche :");
        lblRecherche.setFont(new Font("Arial", Font.PLAIN, 12)); // Police légère et sobre
        this.panelRecherche.add(lblRecherche);

        // Zone de texte
        this.txtRecherche.setPreferredSize(new Dimension(140, 20));
        this.panelRecherche.add(this.txtRecherche);

        // Bouton
        this.btRechercher.setText("Rechercher");
        this.btRechercher.setPreferredSize(new Dimension(105, 20));
        this.btRechercher.setFont(new Font("Arial", Font.BOLD, 11)); // Police GRAS et compacte
        this.panelRecherche.add(this.btRechercher);


        // ==== TABLEAU ====
        String[] entetes = {"ID", "ID Utilisateur", "Logements"};
        this.tableauProprietaires = new Tableau(this.obtenirDonnees(), entetes);
        this.tableProprietaires = new JTable(this.tableauProprietaires);
        JScrollPane uneScroll = new JScrollPane(this.tableProprietaires);
        uneScroll.setBounds(450, 120, 600, 350);
        this.add(uneScroll);

        // ==== ACTIONS ====
        this.btAnnuler.addActionListener(this);
        this.btValider.addActionListener(this);
        this.btRechercher.addActionListener(this);
        this.btSupprimer.addActionListener(this);
        this.btModifier.addActionListener(this);

        // ==== CLIC SUR LIGNE TABLE ====
        this.tableProprietaires.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int selectedRow = tableProprietaires.getSelectedRow();
                if (selectedRow >= 0) {
                    txtIdUtilisateur.setText(tableProprietaires.getValueAt(selectedRow, 1).toString());
                    txtLogements.setText(tableProprietaires.getValueAt(selectedRow, 2).toString());
                }
            }
        });
    }

    private void styliserBouton(JButton bouton) {
        bouton.setFocusPainted(false);
        bouton.setBackground(new Color(100, 149, 237)); // bleu clair
        bouton.setForeground(Color.WHITE);
        bouton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == this.btAnnuler) {
            this.viderChamps();
        } 
        else if (e.getSource() == this.btValider) {
            try {
                int idUtilisateur = Integer.parseInt(this.txtIdUtilisateur.getText());
                String logements = this.txtLogements.getText();

                ArrayList<String> lesChamps = new ArrayList<>();
                lesChamps.add(String.valueOf(idUtilisateur));
                lesChamps.add(logements);

                if (Controleur.verifDonnees(lesChamps)) {
                    Proprietaire unProprietaire = new Proprietaire(0, idUtilisateur, logements);
                    Controleur.insertProprietaire(unProprietaire);
                    JOptionPane.showMessageDialog(this, "Insertion réussie du Propriétaire.", "Insertion Propriétaire", JOptionPane.INFORMATION_MESSAGE);
                    actualiserTableau();
                } else {
                    JOptionPane.showMessageDialog(this, "Veuillez remplir tous les champs.", "Erreur de saisie", JOptionPane.ERROR_MESSAGE);
                }
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "ID Utilisateur doit être un nombre valide.", "Erreur de saisie", JOptionPane.ERROR_MESSAGE);
            }
            this.viderChamps();
        } 
        else if (e.getSource() == this.btRechercher) {
            actualiserTableau();
        }
        else if (e.getSource() == this.btSupprimer) {
            int selectedRow = this.tableProprietaires.getSelectedRow();
            if (selectedRow >= 0) {
                int idProprietaire = Integer.parseInt(this.tableProprietaires.getValueAt(selectedRow, 0).toString());
                Controleur.deleteProprietaire(idProprietaire);
                JOptionPane.showMessageDialog(this, "Suppression réussie du propriétaire.", "Suppression", JOptionPane.INFORMATION_MESSAGE);
                actualiserTableau();
                viderChamps();
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner un propriétaire à supprimer.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
            }
        }
        else if (e.getSource() == this.btModifier) {
            int selectedRow = this.tableProprietaires.getSelectedRow();
            if (selectedRow >= 0) {
                try {
                    int idProprietaire = Integer.parseInt(this.tableProprietaires.getValueAt(selectedRow, 0).toString());
                    int idUtilisateur = Integer.parseInt(this.txtIdUtilisateur.getText());
                    String logements = this.txtLogements.getText();

                    Proprietaire unProprietaire = new Proprietaire(idProprietaire, idUtilisateur, logements);
                    Controleur.updateProprietaire(unProprietaire);
                    JOptionPane.showMessageDialog(this, "Modification réussie du propriétaire.", "Modification", JOptionPane.INFORMATION_MESSAGE);
                    actualiserTableau();
                    viderChamps();
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(this, "ID Utilisateur doit être un nombre valide.", "Erreur de saisie", JOptionPane.ERROR_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner un propriétaire à modifier.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public Object[][] obtenirDonnees() {
        ArrayList<Proprietaire> proprietaires;
        String filtre = this.txtRecherche.getText().trim();

        if (filtre.isEmpty()) {
            proprietaires = Controleur.selectAllProprietaires();
        } else {
            proprietaires = Controleur.selectLikeProprietaires(filtre);
        }

        Object[][] matrice = new Object[proprietaires.size()][3];
        int i = 0;
        for (Proprietaire unProprietaire : proprietaires) {
            matrice[i][0] = unProprietaire.getIdProprietaire();
            matrice[i][1] = unProprietaire.getIdUtilisateur();
            matrice[i][2] = unProprietaire.getLogements();
            i++;
        }
        return matrice;
    }

    public void actualiserTableau() {
        this.tableauProprietaires.setDonnees(this.obtenirDonnees());
        this.tableProprietaires.repaint();
    }

    public void viderChamps() {
        this.txtIdUtilisateur.setText("");
        this.txtLogements.setText("");
    }
}
