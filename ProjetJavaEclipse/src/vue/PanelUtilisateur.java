package vue;

import java.awt.Color;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;

import controleur.Utilisateur;
import controleur.Controleur;
import controleur.Tableau;

public class PanelUtilisateur extends PanelPrincipal implements ActionListener, KeyListener {
	private JPanel panelForm = new JPanel();

	private JTextField txtNom = new JTextField();
	private JTextField txtPrenom = new JTextField();
	private JTextField txtEmail = new JTextField();
	private JTextField txtRole = new JTextField();

	private JButton btAnnuler = new JButton("Annuler");
	private JButton btValider = new JButton("Valider");

	private JTable tableUtilisateurs;
	private Tableau tableauUtilisateurs;

	private JPanel panelFiltre = new JPanel();
	private JTextField txtFiltre = new JTextField();
	private JButton btFiltrer = new JButton("Filtrer");

	private JButton btSupprimer = new JButton("Supprimer");

	private JLabel lbNBUtilisateurs = new JLabel();

	public PanelUtilisateur() {
		super("Gérer les utilisateurs");

		// Placement du panel formulaire
		this.panelForm.setBackground(Color.cyan);
		this.panelForm.setBounds(30, 100, 300, 150);
		this.panelForm.setLayout(new GridLayout(5, 2));

		this.panelForm.add(new JLabel("Nom Utilisateur :"));
		this.panelForm.add(this.txtNom);

		this.panelForm.add(new JLabel("Prénom Utilisateur :"));
		this.panelForm.add(this.txtPrenom);

		this.panelForm.add(new JLabel("Email Utilisateur :"));
		this.panelForm.add(this.txtEmail);

		this.panelForm.add(new JLabel("Rôle :"));
		this.panelForm.add(this.txtRole);

		this.panelForm.add(this.btAnnuler);
		this.panelForm.add(this.btValider);

		this.add(this.panelForm);

		// Rendre les boutons écoutables
		this.btAnnuler.addActionListener(this);
		this.btValider.addActionListener(this);

		// Rendre les champs écoutables
		this.txtNom.addKeyListener(this);
		this.txtPrenom.addKeyListener(this);
		this.txtEmail.addKeyListener(this);
		this.txtRole.addKeyListener(this);

		// Installation de la JTable
		String entetes[] = { "ID", "Nom", "Prénom", "Email", "Rôle" };
		this.tableauUtilisateurs = new Tableau(this.obtenirDonnees(""), entetes);
		this.tableUtilisateurs = new JTable(this.tableauUtilisateurs);
		JScrollPane uneScroll = new JScrollPane(this.tableUtilisateurs);
		uneScroll.setBounds(360, 100, 480, 250);
		this.add(uneScroll);

		// Installation du panel filtre
		this.panelFiltre.setBackground(Color.cyan);
		this.panelFiltre.setBounds(370, 60, 450, 30);
		this.panelFiltre.setLayout(new GridLayout(1, 3));
		this.panelFiltre.add(new JLabel("Filtrer les utilisateurs par : "));
		this.panelFiltre.add(this.txtFiltre);
		this.panelFiltre.add(this.btFiltrer);
		this.add(this.panelFiltre);
		this.btFiltrer.addActionListener(this);

		// Installation du bouton supprimer
		this.btSupprimer.setBounds(80, 340, 140, 30);
		this.add(this.btSupprimer);
		this.btSupprimer.addActionListener(this);
		this.btSupprimer.setVisible(false);
		this.btSupprimer.setBackground(Color.red);

		// Installation du compteur
		this.lbNBUtilisateurs.setBounds(450, 380, 400, 20);
		this.add(this.lbNBUtilisateurs);
		this.lbNBUtilisateurs.setText("Nombre d'utilisateurs : " + this.tableauUtilisateurs.getRowCount());

		// Rendre la JTable écoutable sur le click de la souris
		this.tableUtilisateurs.addMouseListener(new MouseListener() {
			@Override
			public void mouseClicked(MouseEvent e) {
				int numLigne = tableUtilisateurs.getSelectedRow();
				if (e.getClickCount() >= 1 && numLigne >= 0) {
					txtNom.setText(tableauUtilisateurs.getValueAt(numLigne, 1).toString());
					txtPrenom.setText(tableauUtilisateurs.getValueAt(numLigne, 2).toString());
					txtEmail.setText(tableauUtilisateurs.getValueAt(numLigne, 3).toString());
					txtRole.setText(tableauUtilisateurs.getValueAt(numLigne, 4).toString());

					btSupprimer.setVisible(true);
					btValider.setText("Modifier");
				}
			}

			@Override
			public void mousePressed(MouseEvent e) {
			}

			@Override
			public void mouseReleased(MouseEvent e) {
			}

			@Override
			public void mouseEntered(MouseEvent e) {
			}

			@Override
			public void mouseExited(MouseEvent e) {
			}
		});
	}

	public Object[][] obtenirDonnees(String filtre) {
		ArrayList<Utilisateur> lesUtilisateurs;
		if (filtre.equals("")) {
			lesUtilisateurs = Controleur.selectAllUtilisateurs();
		} else {
			lesUtilisateurs = Controleur.selectLikeUtilisateurs(filtre);
		}

		Object matrice[][] = new Object[lesUtilisateurs.size()][5];
		int i = 0;
		for (Utilisateur unUtilisateur : lesUtilisateurs) {
			matrice[i][0] = unUtilisateur.getIdUtilisateur();
			matrice[i][1] = unUtilisateur.getNom();
			matrice[i][2] = unUtilisateur.getPrenom();
			matrice[i][3] = unUtilisateur.getEmail();
			matrice[i][4] = unUtilisateur.getRole();
			i++;
		}
		return matrice;
	}

	public void viderChamps() {
		this.txtNom.setText("");
		this.txtPrenom.setText("");
		this.txtEmail.setText("");
		this.txtRole.setText("");
		btSupprimer.setVisible(false);
		btValider.setText("Valider");
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == this.btAnnuler) {
			this.viderChamps();
		} else if (e.getSource() == this.btFiltrer) {
			this.tableauUtilisateurs.setDonnees(this.obtenirDonnees(this.txtFiltre.getText()));
		}
	}

	@Override
	public void keyTyped(KeyEvent e) {
	}

	@Override
	public void keyPressed(KeyEvent e) {
	}

	@Override
	public void keyReleased(KeyEvent e) {
	}
}
