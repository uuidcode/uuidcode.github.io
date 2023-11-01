package screen;

import java.awt.BorderLayout;
import java.awt.GraphicsDevice;
import java.io.File;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.filechooser.FileNameExtensionFilter;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment;
import static java.awt.Toolkit.getDefaultToolkit;
import static javax.swing.JFileChooser.APPROVE_OPTION;
import static javax.swing.JFileChooser.FILES_ONLY;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageFrame extends JFrame {
    private ImageTabPanel tabbedPane;

    public ImageFrame() {
        super("ImageFrame");
        JPanel panel = new JPanel(new BorderLayout());
        this.tabbedPane = new ImageTabPanel();
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
        this.createCaptureButton(panel);
        this.createOpenButton(panel);

        return panel;
    }

    private void createCaptureButton(JPanel panel) {
        JButton captureButton = new JButton("capture");

        captureButton.addActionListener(e -> {
            this.setVisible(false);
            Store.screenShotFrameList.forEach(f -> f.setVisible(true));
        });

        panel.add(captureButton);
    }

    private void createOpenButton(JPanel panel) {
        JButton captureButton = new JButton("open");

        captureButton.addActionListener(e -> {
            FileNameExtensionFilter filter = new FileNameExtensionFilter("png file", "png");
            JFileChooser fileChooser = new JFileChooser();
            fileChooser.setFileFilter(filter);
            fileChooser.setFileSelectionMode(FILES_ONLY);
            fileChooser.setCurrentDirectory(new File("/Users/ted.song/IdeaProjects/uuidcode.github.io/screenshot"));
            int result = fileChooser.showOpenDialog(this);

            if (result == APPROVE_OPTION) {
                File selectedFile = fileChooser.getSelectedFile();
                try {
                    this.tabbedPane.addTab(selectedFile.getName());
                } catch (Throwable t) {
                    throw new RuntimeException(t);
                }
            }
        });

        panel.add(captureButton);
    }

    public static void main(String[] args) {
        ImageFrame imageFrame = new ImageFrame();
        imageFrame.setVisible(true);

        GraphicsDevice[] screenDeviceArray =
            getLocalGraphicsEnvironment().getScreenDevices();

        for (GraphicsDevice graphicsDevice : screenDeviceArray) {
            ScreenShotFrame screenShotFrame =
                new ScreenShotFrame(graphicsDevice, imageFrame);
            Store.screenShotFrameList.add(screenShotFrame);
        }
    }
}
