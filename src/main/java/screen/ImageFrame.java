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
import static java.awt.Toolkit.getDefaultToolkit;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageFrame extends JFrame {
    private ButtonTabPanel tabbedPane;
    private ScreenShotFrame screenShotFrame;

    public ImageFrame() {
        super("ImageFrame");
        JPanel panel = new JPanel(new BorderLayout());
        this.tabbedPane = new ButtonTabPanel();
        panel.add(tabbedPane, CENTER);
        panel.add(this.createControlPanel(), NORTH);
        this.setContentPane(panel);
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setLocation(0, 0);
        this.setSize(getDefaultToolkit().getScreenSize());
        this.setVisible(true);
    }

    public JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.LINE_AXIS));
        JButton captureScreenButton = new JButton("capture screen");

        captureScreenButton.addActionListener(e -> {
            this.setVisible(false);
            this.screenShotFrame.setVisible(true);
        });

        panel.add(captureScreenButton);
        return panel;
    }

    public static void main(String[] args){
        ImageFrame imageFrame = new ImageFrame();
        ScreenShotFrame screenShotFrame = new ScreenShotFrame("ScreenShotFrame", imageFrame);
        imageFrame.setScreenShotFrame(screenShotFrame);
    }
}
