package vue;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.border.*;

import controleur.Stat;
import controleur.Tableau;

public class PanelStats extends PanelPrincipal {

    private JTable tableStats; 
    private Tableau tableauStats;
    private JScrollPane uneScroll;
    private JComboBox<String> comboVues;

    private String[] vuesDisponibles = {
        "activites_reservees_par_type", 
        "logements_disponibles", 
        "logements_par_ville",
        "reservations_en_attente",
        "reservations_par_mois",
        "reservations_par_type_logement",
        "reservations_utilisateur",
        "revenus_par_logement_saison"
    };

    public PanelStats() {
        super("Voir les statistiques"); 

     // ==== PANEL DE SELECTION DE VUES ====
        JPanel panelSelection = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        panelSelection.setBackground(new Color(245, 245, 245));
        panelSelection.setBorder(BorderFactory.createCompoundBorder(
        	    new LineBorder(Color.LIGHT_GRAY, 2),
        	    new EmptyBorder(8, 10, 8, 10) // Top & Bottom 8px
        	));
        
        panelSelection.setBounds(50, 80, 900, 60); // hauteur réduite
        this.add(panelSelection);

        JLabel lblVue = new JLabel("Choisir une vue :");
        lblVue.setFont(new Font("Arial", Font.PLAIN, 14));
        panelSelection.add(lblVue);

        this.comboVues = new JComboBox<>(vuesDisponibles);
        this.comboVues.setPreferredSize(new Dimension(300, 30));
        this.comboVues.setBackground(Color.WHITE);
        this.comboVues.setFont(new Font("Arial", Font.PLAIN, 13));
        this.comboVues.setFocusable(false);
        this.comboVues.setCursor(new Cursor(Cursor.HAND_CURSOR));
        panelSelection.add(this.comboVues);


        // ==== TABLEAU DES STATISTIQUES ====
        String[] entetes = Stat.getColonnesVue(vuesDisponibles[0]);
        this.tableauStats = new Tableau(this.obtenirDonnees(vuesDisponibles[0]), entetes); 
        this.tableStats = new JTable(this.tableauStats);
        this.uneScroll = new JScrollPane(this.tableStats);
        this.uneScroll.setBounds(50, 160, 900, 400); // <<--- Y décalé à 160 (au lieu de 110)
        this.add(this.uneScroll);

        // ==== ACTIONS ====
        this.comboVues.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                actualiserTableau();
            }
        });
    }

    public Object[][] obtenirDonnees(String nomVue) {
        ArrayList<String[]> stats = Stat.chargerVue(nomVue);
        if (stats.size() == 0) {
            return new Object[0][0];
        }

        Object[][] matrice = new Object[stats.size()][stats.get(0).length];
        int i = 0;
        for (String[] stat : stats) {
            matrice[i] = stat;
            i++;
        }
        return matrice;
    }
    
    public void actualiserTableau() {
        String vueSelectionnee = (String) this.comboVues.getSelectedItem();
        String[] entetes = Stat.getColonnesVue(vueSelectionnee);
        Object[][] donnees = this.obtenirDonnees(vueSelectionnee);

        this.tableauStats.setDonnees(donnees);
        this.tableauStats.setEntetes(entetes);
        this.tableauStats.fireTableStructureChanged();
    }
}
