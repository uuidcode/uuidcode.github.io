package screen;

import java.awt.Color;
import java.awt.Component;
import java.awt.Rectangle;
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
    private boolean galleryVisible;

    public ImageTabPanel() {
        this.addChangeListener(e -> {
            this.updateTabAppearance();
            this.refreshGalleries();
        });
    }

    // 갤러리 토글은 모든 탭이 공유해서, 어느 탭에서 켜도 하단 갤러리가 함께 보인다.
    public void setGalleryVisible(boolean galleryVisible) {
        this.galleryVisible = galleryVisible;

        for (int i = 0; i < this.getTabCount(); i++) {
            Component component = this.getComponentAt(i);

            if (component instanceof ImagePanel) {
                ((ImagePanel) component).setGalleryVisible(galleryVisible);
            }
        }
    }

    private void refreshGalleries() {
        for (int i = 0; i < this.getTabCount(); i++) {
            Component component = this.getComponentAt(i);

            if (component instanceof ImagePanel) {
                ((ImagePanel) component).refreshGallery();
            }
        }
    }

    public void addTab(String name) {
        this.addTab(
            name,
            null,
            null,
            false
        );
    }

    public void addTab(
        String name,
        Rectangle captureRectangle,
        CaptureConfig captureConfig,
        boolean windowCapture
    ) {
        ImagePanel imagePanel = new ImagePanel(
            name,
            getImageFile(name),
            this,
            captureRectangle,
            captureConfig,
            windowCapture
        );
        imagePanel.setBorder(createEtchedBorder());

        this.indexMap.put(name, this.getComponentCount());
        this.addTab(name, imagePanel);
        this.setSelectedComponent(imagePanel);

        if (this.galleryVisible) {
            imagePanel.setGalleryVisible(true);
        }

        this.revalidate();
        this.repaint();
        this.updateTabAppearance();
        this.refreshGalleries();
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
