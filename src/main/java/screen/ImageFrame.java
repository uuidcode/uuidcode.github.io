package screen;

import java.awt.BorderLayout;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageFrame extends JFrame {
    private ButtonTabPanel tabbedPane;
    private JFrame captureScreenFrame;

    public ImageFrame(JFrame captureScreenFrame) {
        JPanel panel = new JPanel(new BorderLayout());
        this.tabbedPane = new ButtonTabPanel();
        this.captureScreenFrame = captureScreenFrame;
        panel.add(tabbedPane, CENTER);
        panel.add(this.createControlPanel(), NORTH);
        this.setContentPane(panel);
    }

    public JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.LINE_AXIS));
        JButton captureScreenButton = new JButton("capture screen");

        captureScreenButton.addActionListener(e -> {
            this.setVisible(false);
            this.captureScreenFrame.setVisible(true);
        });

        panel.add(captureScreenButton);
        return panel;
    }
}
