package vue;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.border.*;
import controleur.*;

public class PanelReservation extends PanelPrincipal implements ActionListener {

    private JPanel panelForm = new JPanel();
    private JPanel panelRecherche = new JPanel();

    private JTextField txtDateDebut = new JTextField();
    private JTextField txtDateFin = new JTextField();
    private JTextField txtRecherche = new JTextField(15);
    private JComboBox<String> txtStatut = new JComboBox<>(new String[]{"disponible", "reserve", "confirmé", "annulé"});
    private static JComboBox<String> txtIdUtilisateur = new JComboBox<>();
    private static JComboBox<String> txtIdLogement = new JComboBox<>();

    private JButton btAnnuler = new JButton("Annuler");
    private JButton btValider = new JButton("Valider");
    private JButton btRechercher = new JButton("Rechercher");
    private JButton btSupprimer = new JButton("Supprimer");
    private JButton btModifier = new JButton("Modifier");

    private JTable tableReservations;
    private Tableau tableauReservations;

    public PanelReservation() {
        super("Gérer les réservations");

        // ==== FORMULAIRE ====
        this.panelForm.setLayout(new BorderLayout(10, 10));
        this.panelForm.setBackground(new Color(245, 245, 245));
        this.panelForm.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.LIGHT_GRAY, 2),
            new EmptyBorder(15, 15, 15, 15)
        ));
        this.panelForm.setBounds(30, 120, 400, 260); // agrandi un peu la hauteur pour caser tous les boutons
        this.add(this.panelForm);

        // Panel pour les champs
        JPanel panelChamps = new JPanel(new GridLayout(5, 2, 10, 5));
        panelChamps.setBackground(new Color(245, 245, 245));

        Dimension champTaille = new Dimension(0, 20);

        txtDateDebut.setPreferredSize(champTaille);
        txtDateFin.setPreferredSize(champTaille);
        txtStatut.setPreferredSize(champTaille);
        txtIdUtilisateur.setPreferredSize(champTaille);
        txtIdLogement.setPreferredSize(champTaille);

        panelChamps.add(new JLabel("Date Début :"));
        panelChamps.add(this.txtDateDebut);

        panelChamps.add(new JLabel("Date Fin :"));
        panelChamps.add(this.txtDateFin);

        panelChamps.add(new JLabel("Statut :"));
        panelChamps.add(this.txtStatut);

        panelChamps.add(new JLabel("Client :"));
        panelChamps.add(this.txtIdUtilisateur);

        panelChamps.add(new JLabel("Logement :"));
        panelChamps.add(this.txtIdLogement);

        // Panel pour les boutons
        JPanel panelBoutons = new JPanel(new GridLayout(2, 2, 10, 10));
        panelBoutons.setBackground(new Color(245, 245, 245));
        panelBoutons.add(this.btAnnuler);
        panelBoutons.add(this.btValider);
        panelBoutons.add(this.btSupprimer);
        panelBoutons.add(this.btModifier);

        // Créer un panel intermédiaire pour tout aligner verticalement
        JPanel panelConteneur = new JPanel();
        panelConteneur.setLayout(new BorderLayout(10, 10));
        panelConteneur.setBackground(new Color(245, 245, 245));
        panelConteneur.add(panelChamps, BorderLayout.CENTER);
        panelConteneur.add(panelBoutons, BorderLayout.SOUTH);

        // Ajouter le tout dans le panelForm
        this.panelForm.add(panelConteneur, BorderLayout.CENTER);

        // ==== STYLISATION BOUTONS ====
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
        String[] entetes = {"ID", "Client", "Logement", "Date Début", "Date Fin", "Statut"};
        this.tableauReservations = new Tableau(this.obtenirDonnees(), entetes);
        this.tableReservations = new JTable(this.tableauReservations);
        JScrollPane uneScroll = new JScrollPane(this.tableReservations);
        uneScroll.setBounds(450, 120, 600, 350);
        this.add(uneScroll);

        // ==== ACTIONS ====
        this.btAnnuler.addActionListener(this);
        this.btValider.addActionListener(this);
        this.btRechercher.addActionListener(this);
        this.btSupprimer.addActionListener(this);
        this.btModifier.addActionListener(this);

        remplirIDUtilisateurs();
        remplirIDLogements();

        this.tableReservations.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int selectedRow = tableReservations.getSelectedRow();
                if (selectedRow >= 0) {
                    txtIdUtilisateur.setSelectedItem(tableReservations.getValueAt(selectedRow, 1).toString());
                    txtIdLogement.setSelectedItem(tableReservations.getValueAt(selectedRow, 2).toString());
                    txtDateDebut.setText(tableReservations.getValueAt(selectedRow, 3).toString());
                    txtDateFin.setText(tableReservations.getValueAt(selectedRow, 4).toString());
                    txtStatut.setSelectedItem(tableReservations.getValueAt(selectedRow, 5).toString());
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

    public static void remplirIDLogements() {
        txtIdLogement.removeAllItems();
        ArrayList<Logement> lesLogements = Controleur.selectAllLogements();
        for (Logement unLogement : lesLogements) {
            txtIdLogement.addItem(String.valueOf(unLogement.getIdLogement())); // conversion int -> String
        }
    }

    public static void remplirIDUtilisateurs() {
        txtIdUtilisateur.removeAllItems();
        ArrayList<Utilisateur> lesUtilisateurs = Controleur.selectAllUtilisateurs();
        for (Utilisateur unUtilisateur : lesUtilisateurs) {
            if (unUtilisateur.getRole().equals("client")) {
                txtIdUtilisateur.addItem(String.valueOf(unUtilisateur.getIdUtilisateur())); // conversion int -> String
            }
        }
    }


    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == this.btAnnuler) {
            viderChamps();
        } else if (e.getSource() == this.btValider) {
            insererReservation();
        } else if (e.getSource() == this.btRechercher) {
            actualiserTableau();
        } else if (e.getSource() == this.btSupprimer) {
            supprimerReservation();
        } else if (e.getSource() == this.btModifier) {
            modifierReservation();
        }
    }

    private void insererReservation() {
        try {
            if (txtDateDebut.getText().isEmpty() || txtDateFin.getText().isEmpty()
                || txtIdUtilisateur.getSelectedItem() == null || txtIdLogement.getSelectedItem() == null) {
                throw new Exception("Veuillez remplir tous les champs.");
            }

            String dateDebut = this.txtDateDebut.getText();
            String dateFin = this.txtDateFin.getText();
            String statut = this.txtStatut.getSelectedItem().toString();

            String[] tab = txtIdUtilisateur.getSelectedItem().toString().split("-");
            int idUtilisateur = Integer.parseInt(tab[0]);

            tab = txtIdLogement.getSelectedItem().toString().split("-");
            int idLogement = Integer.parseInt(tab[0]);

            Reservation uneReservation = new Reservation(0, idUtilisateur, idLogement, dateDebut, dateFin, statut);

            Controleur.insertReservation(uneReservation);

            JOptionPane.showMessageDialog(this, "Insertion réussie de la réservation.", "Insertion Réservation", JOptionPane.INFORMATION_MESSAGE);

            actualiserTableau();
            viderChamps();

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Erreur : " + ex.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void supprimerReservation() {
        int selectedRow = this.tableReservations.getSelectedRow();
        if (selectedRow >= 0) {
            int idReservation = Integer.parseInt(this.tableReservations.getValueAt(selectedRow, 0).toString());
            Controleur.deleteReservation(idReservation);
            JOptionPane.showMessageDialog(this, "Suppression réussie de la réservation.", "Suppression", JOptionPane.INFORMATION_MESSAGE);
            actualiserTableau();
            viderChamps();
        } else {
            JOptionPane.showMessageDialog(this, "Veuillez sélectionner une réservation à supprimer.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void modifierReservation() {
        int selectedRow = this.tableReservations.getSelectedRow();
        if (selectedRow >= 0) {
            try {
                int idReservation = Integer.parseInt(this.tableReservations.getValueAt(selectedRow, 0).toString());

                String dateDebut = this.txtDateDebut.getText();
                String dateFin = this.txtDateFin.getText();
                String statut = this.txtStatut.getSelectedItem().toString();

                String[] tab = txtIdUtilisateur.getSelectedItem().toString().split("-");
                int idUtilisateur = Integer.parseInt(tab[0]);

                tab = txtIdLogement.getSelectedItem().toString().split("-");
                int idLogement = Integer.parseInt(tab[0]);

                Reservation uneReservation = new Reservation(idReservation, idUtilisateur, idLogement, dateDebut, dateFin, statut);

                Controleur.updateReservation(uneReservation);

                JOptionPane.showMessageDialog(this, "Modification réussie de la réservation.", "Modification", JOptionPane.INFORMATION_MESSAGE);
                actualiserTableau();
                viderChamps();
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "Erreur : Format incorrect.", "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(this, "Veuillez sélectionner une réservation à modifier.", "Erreur de sélection", JOptionPane.ERROR_MESSAGE);
        }
    }

    public Object[][] obtenirDonnees() {
        ArrayList<Reservation> reservations;
        String filtre = this.txtRecherche.getText().trim();

        if (filtre.isEmpty()) {
            reservations = Controleur.selectAllReservations();
        } else {
            reservations = Controleur.selectLikeReservations(filtre);
        }

        Object[][] matrice = new Object[reservations.size()][6];
        int i = 0;
        for (Reservation uneReservation : reservations) {
            matrice[i][0] = uneReservation.getIdReservation();
            matrice[i][1] = uneReservation.getIdUtilisateur();
            matrice[i][2] = uneReservation.getIdLogement();
            matrice[i][3] = uneReservation.getDateDebut();
            matrice[i][4] = uneReservation.getDateFin();
            matrice[i][5] = uneReservation.getStatut();
            i++;
        }
        return matrice;
    }

    public void actualiserTableau() {
        this.tableauReservations.setDonnees(this.obtenirDonnees());
        this.tableReservations.repaint();
    }

    public void viderChamps() {
        this.txtDateDebut.setText("");
        this.txtDateFin.setText("");
        this.txtStatut.setSelectedIndex(0);
        this.txtIdUtilisateur.setSelectedIndex(-1); // 🔥 Ajout : remettre aucune sélection
        this.txtIdLogement.setSelectedIndex(-1);    // 🔥 Ajout : remettre aucune sélection
    }

}
