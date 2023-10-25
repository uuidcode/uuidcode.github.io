package screen;

import java.awt.BorderLayout;
import java.awt.GraphicsDevice;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment;
import static java.awt.Toolkit.getDefaultToolkit;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageFrame extends JFrame {
    private ButtonTabPanel tabbedPane;

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
        this.setFocusable(true);
    }

    public JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.LINE_AXIS));
        JButton captureButton = new JButton("capture");

        captureButton.addActionListener(e -> {
            this.setVisible(false);
            Store.get().getScreenShotFrameList().forEach(f -> f.setVisible(true));
        });

        panel.add(captureButton);

        return panel;
    }

    public static void main(String[] args){
        ImageFrame imageFrame = new ImageFrame();
        imageFrame.setVisible(true);

        GraphicsDevice[] screenDeviceArray =
            getLocalGraphicsEnvironment().getScreenDevices();

        for (GraphicsDevice graphicsDevice : screenDeviceArray) {
            ScreenShotFrame screenShotFrame =
                new ScreenShotFrame(graphicsDevice, imageFrame);
            Store.get().getScreenShotFrameList().add(screenShotFrame);
        }
    }
}
