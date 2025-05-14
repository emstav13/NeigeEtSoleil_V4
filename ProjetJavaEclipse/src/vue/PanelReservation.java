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
	private JComboBox<String> txtStatut = new JComboBox<>(
			new String[] { "disponible", "reserve", "confirmé", "annulé" });
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
		this.panelForm.setBorder(BorderFactory.createCompoundBorder(new LineBorder(Color.LIGHT_GRAY, 2),
				new EmptyBorder(15, 15, 15, 15)));
		this.panelForm.setBounds(30, 120, 400, 320);
		this.add(this.panelForm);

		JPanel panelCentre = new JPanel(new GridLayout(6, 2, 10, 10));
		panelCentre.setBackground(new Color(245, 245, 245));

		panelCentre.add(new JLabel("Date Début :"));
		panelCentre.add(this.txtDateDebut);

		panelCentre.add(new JLabel("Date Fin :"));
		panelCentre.add(this.txtDateFin);

		panelCentre.add(new JLabel("Statut :"));
		panelCentre.add(this.txtStatut);

		panelCentre.add(new JLabel("Client :"));
		panelCentre.add(this.txtIdUtilisateur);

		panelCentre.add(new JLabel("Logement :"));
		panelCentre.add(this.txtIdLogement);

		this.panelForm.add(panelCentre, BorderLayout.CENTER);

		JPanel panelBoutons = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
		panelBoutons.setBackground(new Color(245, 245, 245));
		panelBoutons.add(this.btAnnuler);
		panelBoutons.add(this.btValider);
		panelBoutons.add(this.btSupprimer);
		panelBoutons.add(this.btModifier);
		this.panelForm.add(panelBoutons, BorderLayout.SOUTH);

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
		this.panelRecherche.setBorder(BorderFactory.createCompoundBorder(new LineBorder(Color.LIGHT_GRAY, 2), // Bordure
																												// plus
																												// épaisse
																												// : 3px
				new EmptyBorder(5, 10, 5, 10)));
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
		String[] entetes = { "ID", "Client", "Logement", "Date Début", "Date Fin", "Statut" };
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
		ArrayList<Logement> lesLogements = Controleur.selectAllLogements(); // ✅ ici corrigé
		for (Logement unLogement : lesLogements) {
			txtIdLogement.addItem("(" + unLogement.getIdLogement() + ")" + " - " + unLogement.getNomImmeuble());
		}
	}

	public static void remplirIDUtilisateurs() {
		txtIdUtilisateur.removeAllItems();
		ArrayList<Utilisateur> lesUtilisateurs = Controleur.selectAllUtilisateurs();
		for (Utilisateur unUtilisateur : lesUtilisateurs) {
			if (unUtilisateur.getRole().equals("client")) {
				txtIdUtilisateur.addItem("(" + unUtilisateur.getIdUtilisateur() + ")" + " - " + unUtilisateur.getNom()
						+ " " + unUtilisateur.getPrenom());
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

			JOptionPane.showMessageDialog(this, "Insertion réussie de la réservation.", "Insertion Réservation",
					JOptionPane.INFORMATION_MESSAGE);

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
			JOptionPane.showMessageDialog(this, "Suppression réussie de la réservation.", "Suppression",
					JOptionPane.INFORMATION_MESSAGE);
			actualiserTableau();
			viderChamps();
		} else {
			JOptionPane.showMessageDialog(this, "Veuillez sélectionner une réservation à supprimer.",
					"Erreur de sélection", JOptionPane.ERROR_MESSAGE);
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

				Reservation uneReservation = new Reservation(idReservation, idUtilisateur, idLogement, dateDebut,
						dateFin, statut);

				Controleur.updateReservation(uneReservation);

				JOptionPane.showMessageDialog(this, "Modification réussie de la réservation.", "Modification",
						JOptionPane.INFORMATION_MESSAGE);
				actualiserTableau();
				viderChamps();
			} catch (NumberFormatException ex) {
				JOptionPane.showMessageDialog(this, "Erreur : Format incorrect.", "Erreur", JOptionPane.ERROR_MESSAGE);
			}
		} else {
			JOptionPane.showMessageDialog(this, "Veuillez sélectionner une réservation à modifier.",
					"Erreur de sélection", JOptionPane.ERROR_MESSAGE);
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
	}
}
