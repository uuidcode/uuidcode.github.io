package screen;

import java.awt.BorderLayout;
import java.awt.GraphicsDevice;
import java.awt.Image;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
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

        ThumbnailDialog.deleteOldFile();
    }

    public JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.LINE_AXIS));
        this.createCaptureButton(panel);
        this.createCaptureRepeatButton(panel);
        this.createClipboardButton(panel);
        this.createOpenButton(panel);
        this.createViewButton(panel);

        return panel;
    }

    private void createCaptureButton(JPanel panel) {
        JButton button = new JButton("capture");
        button.addActionListener(e -> this.capture());
        panel.add(button);
    }

    private void createCaptureRepeatButton(JPanel panel) {
        JButton button = new JButton("capture repeat");
        button.addActionListener(e -> this.captureRepeat());
        panel.add(button);
    }

    private void createClipboardButton(JPanel panel) {
        JButton button = new JButton("clipboard");
        button.addActionListener(e -> this.clipboard());
        panel.add(button);
    }

    private void createOpenButton(JPanel panel) {
        JButton button = new JButton("open");
        button.addActionListener(e -> this.open());
        panel.add(button);
    }

    private void createViewButton(JPanel panel) {
        JButton button = new JButton("view");
        button.addActionListener(e -> this.view());
        panel.add(button);
    }

    private void view() {
        ThumbnailDialog dialog = new ThumbnailDialog(this, this.tabbedPane, "Thumbnail Viewer");
        dialog.setVisible(true);
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

    private void captureRepeat() {
        this.setVisible(false);

        try {
            Robot robot = new Robot();

            ScreenShotPanel.capture(robot, ScreenShotPanel.lastRectangle,
                ScreenShotPanel.lastRectangle.x, ScreenShotPanel.lastRectangle.y,
                this.tabbedPane);
        } catch (Throwable t) {
            t.printStackTrace();
        }

        this.setVisible(true);
    }

    private void clipboard() {
        Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

        try {
            Transferable transferable = clipboard.getContents(null);
            if (transferable != null && transferable.isDataFlavorSupported(DataFlavor.imageFlavor)) {
                Image image = (Image) transferable.getTransferData(DataFlavor.imageFlavor);

                String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
                File file = Util.getImageFile(fileName);
                BufferedImage bufferedImage = this.toBufferedImage(image);
                ImageIO.write(bufferedImage, "png", file);
                this.tabbedPane.addTab(fileName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static BufferedImage toBufferedImage(Image img) {
        if (img instanceof BufferedImage) {
            return (BufferedImage) img;
        }

        int width = img.getWidth(null);
        int height = img.getHeight(null);

        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        bufferedImage.getGraphics().drawImage(img, 0, 0, null);
        return bufferedImage;
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
