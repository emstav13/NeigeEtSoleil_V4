package vue;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;

import controleur.Stat;
import controleur.Tableau;

public class VueStatistiquesGenerales extends JFrame {

    private static final long serialVersionUID = 1L;
    private JTable tableVue;

    public VueStatistiquesGenerales() {
        this.setTitle("Exploration Statistiques");
        this.setSize(1000, 600);
        this.setLocationRelativeTo(null);
        this.setLayout(null);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // ferme juste cette fenêtre

        // Exemple : tu choisis la vue à charger
        String vue = "v_ta_vue"; // à changer selon ce que tu veux afficher
        String[] colonnes = Stat.getColonnesVue(vue);
        Object[][] donnees = Stat.chargerVue(vue).toArray(new Object[0][]);

        Tableau tableau = new Tableau(donnees, colonnes);
        this.tableVue = new JTable(tableau);
        JScrollPane scroll = new JScrollPane(this.tableVue);
        scroll.setBounds(20, 20, 940, 500);

        this.add(scroll);
        this.setVisible(true);
    }
}
