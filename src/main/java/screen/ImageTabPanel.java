package screen;

import java.awt.Color;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.swing.JTabbedPane;
import javax.swing.UIManager;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import static javax.swing.BorderFactory.createEtchedBorder;
import static lombok.AccessLevel.PRIVATE;
import static screen.Util.getImageFile;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class ImageTabPanel extends JTabbedPane {
    @Setter(PRIVATE)
    @Getter(PRIVATE)
    private Map<String, Integer> indexMap = new HashMap<>();
    private List<ScreenShotFrame> screenShotFrameList;

    public ImageTabPanel() {
        this.addChangeListener(e -> this.updateTabAppearance());
    }

    public void addTab(String name) {
        ImagePanel imagePanel = new ImagePanel(name, getImageFile(name), this);
        imagePanel.setBorder(createEtchedBorder());

        this.indexMap.put(name, this.getComponentCount());
        this.addTab(name, imagePanel);
        this.setSelectedComponent(imagePanel);
        this.revalidate();
        this.repaint();
        this.updateTabAppearance();
    }

    public void removeTab(String name) {
        this.remove(this.indexMap.get(name));
        this.updateTabAppearance();
    }

    private void updateTabAppearance() {
        Color normalForeground = new Color(70, 70, 70);
        Color selectedForeground = new Color(20, 20, 20);
        Color defaultBackground = UIManager.getColor("Panel.background");

        for (int i = 0; i < this.getTabCount(); i++) {
            boolean selected = i == this.getSelectedIndex();
            this.setForegroundAt(i, selected ? selectedForeground : normalForeground);
            if (defaultBackground != null) {
                this.setBackgroundAt(i, defaultBackground);
            }
        }
    }
}
