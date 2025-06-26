package vue;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

import controleur.Controleur;
import controleur.NS;
import controleur.Utilisateur;

public class VueConnexion extends JFrame implements ActionListener, KeyListener {

    private JButton btAnnuler = new JButton("Annuler");
    private JButton btSeConnecter = new JButton("Se Connecter");
    private JTextField txtEmail = new JTextField();
    private JPasswordField txtMdp = new JPasswordField();

    private JPanel panelForm = new JPanel();
    private JLabel lbTitre = new JLabel("Bienvenue chez Neige & Soleil", JLabel.CENTER);

    public VueConnexion() {
        // 📌 **Configuration de la fenêtre**
        this.setTitle("Neige et Soleil - Connexion");
        this.setBounds(100, 100, 500, 350); // 🔹 Fenêtre plus compacte
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.getContentPane().setBackground(new Color(44, 62, 80));
        this.setResizable(false);
        this.setLayout(new BorderLayout());

        // 📌 **Panel supérieur : Titre**
        lbTitre.setFont(new Font("Arial", Font.BOLD, 22));
        lbTitre.setForeground(Color.WHITE);
        lbTitre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        this.add(lbTitre, BorderLayout.NORTH);

        // 📌 **Panel central : Formulaire**
        JPanel panelCentral = new JPanel(new GridBagLayout()); // 🔹 Permet de centrer le formulaire
        panelCentral.setBackground(new Color(52, 73, 94));

        panelForm.setLayout(new GridLayout(4, 2, 10, 10));
        panelForm.setPreferredSize(new Dimension(300, 120)); // 🔹 Taille contrôlée pour éviter l'étirement
        panelForm.setBackground(new Color(52, 73, 94));

        JLabel lbEmail = new JLabel("E-mail : ");
        lbEmail.setForeground(Color.WHITE);
        lbEmail.setFont(new Font("Arial", Font.BOLD, 16));

        txtEmail.setFont(new Font("Arial", Font.PLAIN, 14));
        txtEmail.setPreferredSize(new Dimension(200, 30)); // 🔹 Réduction de la largeur
        txtEmail.setText("test@example.com");
        txtMdp.setText("test123");

        JLabel lbMdp = new JLabel("Mot de passe : ");
        lbMdp.setForeground(Color.WHITE);
        lbMdp.setFont(new Font("Arial", Font.BOLD, 16));

        txtMdp.setFont(new Font("Arial", Font.PLAIN, 14));
        txtMdp.setPreferredSize(new Dimension(200, 30)); // 🔹 Réduction de la largeur
        txtMdp.setEchoChar('*');

        panelForm.add(lbEmail);
        panelForm.add(txtEmail);
        panelForm.add(lbMdp);
        panelForm.add(txtMdp);

        panelCentral.add(panelForm);
        this.add(panelCentral, BorderLayout.CENTER);

        // 📌 **Panel inférieur : Boutons**
        JPanel panelBoutons = new JPanel();
        panelBoutons.setBackground(new Color(52, 73, 94));
        panelBoutons.setBorder(BorderFactory.createEmptyBorder(10, 0, 20, 0)); // 🔹 Espacement en bas

        btAnnuler.setFont(new Font("Arial", Font.BOLD, 14));
        btAnnuler.setBackground(Color.RED);
        btAnnuler.setForeground(Color.WHITE);
        btAnnuler.setPreferredSize(new Dimension(120, 35));

        btSeConnecter.setFont(new Font("Arial", Font.BOLD, 14));
        btSeConnecter.setBackground(new Color(39, 174, 96));
        btSeConnecter.setForeground(Color.WHITE);
        btSeConnecter.setPreferredSize(new Dimension(140, 35));

        panelBoutons.add(btAnnuler);
        panelBoutons.add(btSeConnecter);
        this.add(panelBoutons, BorderLayout.SOUTH);

        // 📌 **Ajout d'écouteurs d'événements**
        btAnnuler.addActionListener(this);
        btSeConnecter.addActionListener(this);
        txtEmail.addKeyListener(this);
        txtMdp.addKeyListener(this);

        // 📌 **Affichage de la fenêtre**
        this.setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btAnnuler) {
            txtEmail.setText("");
            txtMdp.setText("");
        } else if (e.getSource() == btSeConnecter) {
            traitement();
        }
    }

    private void traitement() {
        String email = txtEmail.getText();
        String motDePasse = new String(txtMdp.getPassword());

        // 🔹 Vérification des identifiants
        Utilisateur unUtilisateur = Controleur.selectWhereUtilisateur(email, motDePasse);

        if (unUtilisateur == null) {
            JOptionPane.showMessageDialog(this, "❌ Identifiants incorrects.", "Erreur", JOptionPane.ERROR_MESSAGE);
        } else if (!unUtilisateur.getRole().equalsIgnoreCase("admin")) {
            JOptionPane.showMessageDialog(this, "⚠️ Seul un administrateur peut se connecter.", "Accès refusé", JOptionPane.ERROR_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(this, "✅ Bienvenue, " + unUtilisateur.getNom() + " !", "Connexion réussie", JOptionPane.INFORMATION_MESSAGE);
            NS.rendreVisibleVueConnexion(false);
            NS.setUtilisateurConnecte(unUtilisateur);
            NS.creerVueGenerale(true);
        }
    }

    @Override
    public void keyTyped(KeyEvent e) { }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ENTER) {
            traitement();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) { }
}
