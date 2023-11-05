package screen;

import java.awt.BorderLayout;
import java.awt.GraphicsDevice;
import java.awt.event.KeyEvent;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;
import static java.awt.Toolkit.getDefaultToolkit;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toList;
import static javax.swing.JFileChooser.APPROVE_OPTION;
import static javax.swing.JFileChooser.FILES_ONLY;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageFrame extends JFrame {
    private ImageTabPanel tabbedPane;
    private List<ScreenShotFrame> screenShotFrameList;

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

        Map<Integer, Runnable> keyMap = new HashMap<>();
        keyMap.put(KeyEvent.VK_P, this::capture);
        keyMap.put(KeyEvent.VK_O, this::open);

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            if (ke.getID() == KeyEvent.KEY_RELEASED
                && (ke.isControlDown() || ke.isMetaDown())) {
                keyMap.getOrDefault(ke.getKeyCode(), () -> {}).run();
            }

            return false;
        });
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
        captureButton.addActionListener(e -> capture());
        panel.add(captureButton);
    }

    private void capture() {
        this.setVisible(false);

        GraphicsDevice[] screenDeviceArray =
            getLocalGraphicsEnvironment()
                .getScreenDevices();

        this.screenShotFrameList = stream(screenDeviceArray)
            .map(device -> new ScreenShotFrame(device, this))
            .peek(f -> f.setVisible(true))
            .collect(toList());

        this.tabbedPane.setScreenShotFrameList(this.screenShotFrameList);
    }

    private void createOpenButton(JPanel panel) {
        JButton captureButton = new JButton("open");
        captureButton.addActionListener(e -> open());
        panel.add(captureButton);
    }

    private void open() {
        FileNameExtensionFilter filter = new FileNameExtensionFilter("png file", "png");
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(filter);
        fileChooser.setFileSelectionMode(FILES_ONLY);
        String dirName = "/Users/ted.song/IdeaProjects/uuidcode.github.io/screenshot";
        fileChooser.setCurrentDirectory(new File(dirName));
        int result = fileChooser.showOpenDialog(this);

        if (result == APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            try {
                this.tabbedPane.addTab(selectedFile.getName());
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        }
    }

    public static void main(String[] args) {
        final ImageFrame imageFrame = new ImageFrame();
        imageFrame.setVisible(true);
    }
}
