package screen;

import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.Frame;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import javax.imageio.ImageIO;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.SOUTH;
import static java.awt.FlowLayout.LEFT;
import static java.awt.Image.SCALE_SMOOTH;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static javax.swing.BorderFactory.createCompoundBorder;
import static javax.swing.BorderFactory.createEmptyBorder;
import static javax.swing.BorderFactory.createEtchedBorder;
import static javax.swing.BoxLayout.Y_AXIS;
import static javax.swing.ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS;
import static screen.ImageViewPanel.copy;

public class ThumbnailDialog extends JDialog {
    private ImageTabPanel imageTabPanel;
    private JPanel contentPanel;

    public ThumbnailDialog(Frame owner, ImageTabPanel imageTabPanel, String title) {
        super(owner, title, true);
        this.imageTabPanel = imageTabPanel;
        initComponents();
    }

    public static List<File> getFileList() {
        File dir = new File("screenshot");
        File[] files = dir.listFiles((d, name) -> name.endsWith(".png"));

        if (files == null) {
            return new ArrayList<>();
        }

        return Arrays.stream(files)
            .sorted(comparing(File::getName).reversed())
            .collect(toList());
    }

    public static void deleteOldFile() {
        getFileList()
            .stream()
            .skip(100)
            .forEach(File::delete);
    }

    private void initComponents() {
        setSize(1_000, 800);
        setLocationRelativeTo(getOwner());

        List<File> totalLlist = getFileList();

        this.contentPanel = new JPanel();
        this.contentPanel.setLayout(new BoxLayout(this.contentPanel, Y_AXIS));

        JScrollPane scrollPane = new JScrollPane(this.contentPanel);
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

        List<File> list = totalLlist.subList(0, Math.min(9, totalLlist.size()));
        addImage(list);

        new Thread(() -> addImage(totalLlist.subList(list.size(), totalLlist.size()))).start();

        setContentPane(scrollPane);
    }

    private void addImage(List<File> list) {
        AtomicInteger atomicInteger = new AtomicInteger();
        JPanel rowPanel = null;

        for (File file : list) {
            if (atomicInteger.getAndIncrement() % 3 == 0) {
                rowPanel = new JPanel(new GridLayout(1, 3, 5, 5));
                this.contentPanel.add(rowPanel);
                this.contentPanel.revalidate();
            }

            try {
                BufferedImage img = ImageIO.read(file);
                Image thumbnailImage = img.getScaledInstance(300, 300, SCALE_SMOOTH);
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

                JPanel bottomPanel = new JPanel(new FlowLayout(LEFT));
                bottomPanel.setBorder(createEmptyBorder(2, 2, 2, 2));
                JLabel fileNameLabel = new JLabel(file.getName());
                bottomPanel.add(fileNameLabel);

                JButton copyButton = new JButton("copy");
                copyButton.addActionListener(e -> copy(file));
                bottomPanel.add(copyButton);

                JButton deleteButton = new JButton("delete");
                deleteButton.addActionListener(e -> {
                    file.delete();
                    this.initComponents();
                    this.revalidate();
                    this.repaint();
                });

                bottomPanel.add(deleteButton);

                panel.add(bottomPanel, SOUTH);

                panel.setBorder(createCompoundBorder(createEtchedBorder(), createEmptyBorder(2, 2, 2, 2)));
                rowPanel.add(panel);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
