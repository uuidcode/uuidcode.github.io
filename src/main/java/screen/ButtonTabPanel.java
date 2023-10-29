package screen;

import java.util.HashMap;
import java.util.Map;

import javax.swing.JTabbedPane;

import static javax.swing.BorderFactory.createCompoundBorder;
import static javax.swing.BorderFactory.createEmptyBorder;
import static javax.swing.BorderFactory.createEtchedBorder;

public class ButtonTabPanel extends JTabbedPane {
    private final Map<String, Integer> indexMap = new HashMap<>();

    public void addTab(String name) {
        ImagePanel imagePanel = new ImagePanel(name, Util.getImageFile(name), this);
        imagePanel.setBorder(createCompoundBorder(
            createEtchedBorder(), createEmptyBorder(10, 10, 10, 10)));

        this.indexMap.put(name, this.getComponentCount());
        this.addTab(name, imagePanel);
        this.setSelectedComponent(imagePanel);
        this.revalidate();
        this.repaint();
    }

    public void removeTab(String name) {
        this.remove(this.indexMap.get(name));
    }
}
