package screen;

import java.awt.Color;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.swing.JTabbedPane;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import static javax.swing.BorderFactory.createCompoundBorder;
import static javax.swing.BorderFactory.createEmptyBorder;
import static javax.swing.BorderFactory.createEtchedBorder;
import static lombok.AccessLevel.PRIVATE;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class ImageTabPanel extends JTabbedPane {
    @Setter(PRIVATE)
    @Getter(PRIVATE)
    private Map<String, Integer> indexMap = new HashMap<>();
    private List<ScreenShotFrame> screenShotFrameList;

    public void addTab(String name) {
        ImagePanel imagePanel = new ImagePanel(name, Util.getImageFile(name), this);
        imagePanel.setBorder(createCompoundBorder(
            createEtchedBorder(), createEmptyBorder(10, 10, 10, 10)));

        this.indexMap.put(name, this.getComponentCount());
        this.addTab(name, imagePanel);
        this.setSelectedComponent(imagePanel);
        this.revalidate();
        this.repaint();

        int selectedIndex = this.getSelectedIndex();
        this.setBackgroundAt(selectedIndex, Color.blue);
    }

    public void removeTab(String name) {
        this.remove(this.indexMap.get(name));
    }
}
