package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Image;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.SwingConstants;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.EAST;
import static java.awt.BorderLayout.WEST;
import static javax.swing.ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED;
import static javax.swing.ScrollPaneConstants.VERTICAL_SCROLLBAR_NEVER;

// 하단에 캡처된 탭 이미지를 100x100 썸네일 갤러리로 보여주고,
// 썸네일 클릭 시 해당 탭을 선택한다. 마우스 휠/좌우 화살표로 네비게이션한다.
public class ImageGalleryPanel extends JPanel {
    static final int THUMBNAIL_SIZE = 100;
    private static final int SCROLL_UNIT = 120;
    private static final int PANEL_PADDING = 44;
    private static final Color SELECTED_BORDER_COLOR = new Color(52, 120, 246);
    private static final Color NORMAL_BORDER_COLOR = new Color(200, 200, 200);

    private final ImageTabPanel tabbedPane;
    private final JPanel strip;
    private final JScrollPane scrollPane;

    public ImageGalleryPanel(ImageTabPanel tabbedPane) {
        super(new BorderLayout());
        this.tabbedPane = tabbedPane;

        this.strip = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));

        this.scrollPane = new JScrollPane(
            this.strip, // view
            VERTICAL_SCROLLBAR_NEVER, // vsbPolicy
            HORIZONTAL_SCROLLBAR_AS_NEEDED // hsbPolicy
        );
        this.scrollPane.setBorder(BorderFactory.createEmptyBorder());
        this.scrollPane.getHorizontalScrollBar().setUnitIncrement(SCROLL_UNIT);

        this.scrollPane.addMouseWheelListener(e -> {
            JScrollBar bar = this.scrollPane.getHorizontalScrollBar();
            bar.setValue(bar.getValue() + e.getWheelRotation() * SCROLL_UNIT);
            e.consume();
        });

        this.add(this.createArrowButton("◀", -SCROLL_UNIT), WEST);

        this.add(this.scrollPane, CENTER);

        this.add(this.createArrowButton("▶", SCROLL_UNIT), EAST);

        this.setBorder(BorderFactory.createMatteBorder(
            1, // top
            0, // left
            0, // bottom
            0, // right
            NORMAL_BORDER_COLOR // matteColor
        ));

        this.setPreferredSize(new Dimension(0, THUMBNAIL_SIZE + PANEL_PADDING));
    }

    private JButton createArrowButton(String text, int delta) {
        JButton button = new JButton(text);
        button.setFocusable(false);
        button.addActionListener(e -> {
            JScrollBar bar = this.scrollPane.getHorizontalScrollBar();
            bar.setValue(bar.getValue() + delta);
        });

        return button;
    }

    public void refresh() {
        this.strip.removeAll();

        int selectedIndex = this.tabbedPane.getSelectedIndex();

        for (int i = 0; i < this.tabbedPane.getTabCount(); i++) {
            Component component = this.tabbedPane.getComponentAt(i);

            if (!(component instanceof ImagePanel)) {
                continue;
            }

            ImagePanel imagePanel = (ImagePanel) component;
            this.strip.add(this.createThumbnail(imagePanel, i == selectedIndex));
        }

        this.strip.revalidate();
        this.strip.repaint();
    }

    private JLabel createThumbnail(ImagePanel imagePanel, boolean selected) {
        JLabel label = new JLabel();
        label.setHorizontalAlignment(SwingConstants.CENTER);
        label.setVerticalAlignment(SwingConstants.CENTER);
        label.setToolTipText(imagePanel.getTabName());
        label.setOpaque(true);
        label.setBackground(Color.WHITE);
        label.setPreferredSize(new Dimension(THUMBNAIL_SIZE, THUMBNAIL_SIZE));

        BufferedImage image = imagePanel.getDisplayImage();

        if (image != null) {
            Dimension size = thumbnailSize(
                image.getWidth(), // width
                image.getHeight(), // height
                THUMBNAIL_SIZE // max
            );
            Image scaled = image.getScaledInstance(size.width, size.height, Image.SCALE_SMOOTH);
            label.setIcon(new ImageIcon(scaled));
        }

        Color borderColor = NORMAL_BORDER_COLOR;
        int thickness = 1;

        if (selected) {
            borderColor = SELECTED_BORDER_COLOR;
            thickness = 3;
        }

        label.setBorder(BorderFactory.createLineBorder(borderColor, thickness));

        label.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                tabbedPane.setSelectedComponent(imagePanel);
            }
        });

        return label;
    }

    // 원본 비율을 유지하면서 max x max 정사각형 안에 들어가도록 썸네일 크기를 계산한다.
    static Dimension thumbnailSize(int width, int height, int max) {
        if (width <= 0 || height <= 0) {
            return new Dimension(max, max);
        }

        double ratio = Math.min((double) max / width, (double) max / height);
        int scaledWidth = Math.max(1, (int) Math.round(width * ratio));
        int scaledHeight = Math.max(1, (int) Math.round(height * ratio));

        return new Dimension(scaledWidth, scaledHeight);
    }
}
