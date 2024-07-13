package screen;

import java.awt.BorderLayout;
import java.awt.Frame;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.SOUTH;
import static java.util.Comparator.comparing;
import static javax.swing.ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS;

public class ThumbnailDialog extends JDialog {
    private ImageTabPanel imageTabPanel;

    public ThumbnailDialog(Frame owner, ImageTabPanel imageTabPanel, String title) {
        super(owner, title, true);
        this.imageTabPanel = imageTabPanel;
        initComponents();
    }

    private void initComponents() {
        setSize(1_000, 800);
        setLocationRelativeTo(getOwner());

        File dir = new File("screenshot");
        File[] files = dir.listFiles((d, name) -> name.endsWith(".png"));

        JPanel contentPanel = new JPanel(new GridLayout(files.length / 3, 3));
        JScrollPane scrollPane = new JScrollPane(contentPanel);
        scrollPane.setVerticalScrollBarPolicy(VERTICAL_SCROLLBAR_ALWAYS);
        scrollPane.addMouseWheelListener(e -> {
            JScrollBar verticalScrollBar = scrollPane.getVerticalScrollBar();
            int notches = e.getWheelRotation();
            int scrollAmount = 200;

            if (notches < 0) {
                verticalScrollBar.setValue(verticalScrollBar.getValue() - scrollAmount);
            } else {
                verticalScrollBar.setValue(verticalScrollBar.getValue() + scrollAmount);
            }

            e.consume();
        });

        if (files != null) {
            Arrays.stream(files)
                .sorted(comparing(File::getName).reversed())
                .forEach(file -> {
                    try {
                        BufferedImage img = ImageIO.read(file);
                        Image thumbnailImage = img.getScaledInstance(300, 300, Image.SCALE_SMOOTH);
                        ImageIcon icon = new ImageIcon(thumbnailImage);
                        JLabel label = new JLabel(icon);

                        label.addMouseListener(new MouseAdapter() {
                            @Override
                            public void mouseClicked(MouseEvent e) {
                                imageTabPanel.addTab(file.getName());
                                ThumbnailDialog.this.dispose();
                            }
                        });

                        JPanel panel = new JPanel(new BorderLayout());
                        panel.add(label, CENTER);
                        panel.add(new JLabel(file.getName()), SOUTH);
                        contentPanel.add(panel);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
        }

        getContentPane().add(scrollPane);
    }
}
