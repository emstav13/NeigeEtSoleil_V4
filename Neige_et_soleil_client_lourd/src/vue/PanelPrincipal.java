package vue;

import java.awt.Color;
import java.awt.Font;

import javax.swing.JLabel;
import javax.swing.JPanel;

public abstract class PanelPrincipal extends JPanel
{
	private JLabel lbTitre = new JLabel(); 

	public PanelPrincipal(String titre) {
	    this.setBackground(Color.WHITE);
	    this.setBounds(0, 80, 1100, 700);

	    this.lbTitre.setText(titre);
	    this.lbTitre.setBounds(425, 20, 400, 30); // <-- Position fixe
	    Font unePolice = new Font("Arial", Font.BOLD, 25); 
	    this.lbTitre.setFont(unePolice);

	    this.add(this.lbTitre);

	    this.setLayout(null); // <-- Layout en mode absolu
	}

}





