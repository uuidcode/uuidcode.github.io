package screen;

import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Image;
import java.awt.Insets;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.SwingConstants;

public class ThumbnailDialog extends JDialog {
    public ThumbnailDialog(Frame owner, String title) {
        super(owner, title, true);
        initComponents();
    }

    private void initComponents() {
        setSize(500, 400);
        setLocationRelativeTo(getOwner());

        JPanel contentPanel = new JPanel(new GridBagLayout());
        JScrollPane scrollPane = new JScrollPane(contentPanel);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);

        // 이미지 파일들이 있는 디렉토리
        File dir = new File("screenshot");
        File[] files = dir.listFiles((d, name) -> name.endsWith(".png"));

        GridBagConstraints gridBagConstraints = new GridBagConstraints();
        gridBagConstraints.gridwidth = GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = GridBagConstraints.CENTER;
        gridBagConstraints.insets = new Insets(5, 5, 5, 5);  //

        if (files != null) {
            for (File file : files) {
                try {
                    BufferedImage img = ImageIO.read(file);
                    Image thumbnailImage = img.getScaledInstance(300, 300, Image.SCALE_SMOOTH);
                    ImageIcon icon = new ImageIcon(thumbnailImage);
                    JLabel label = new JLabel(file.getName(), icon, SwingConstants.CENTER);
                    contentPanel.add(label, gridBagConstraints);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        getContentPane().add(scrollPane);
    }
}
