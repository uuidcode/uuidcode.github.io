package screen;

import java.awt.BorderLayout;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JPanel;
import javax.swing.JRadioButton;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.JFileChooser.APPROVE_OPTION;

public class ImagePanel extends JPanel {
    private final String name;
    private final ButtonTabPanel tabbedPane;
    private ImageViewPanel imagePanel;
    private JPanel controlPanel;

    public ImagePanel(String name, File imageFile, ButtonTabPanel tabbedPane) {
        super(new BorderLayout());
        this.name = name;
        this.tabbedPane = tabbedPane;
        this.imagePanel = this.createImageViewPanel(imageFile);
        this.createControlPanel(imageFile);
    }

    private ImageViewPanel createImageViewPanel(File imageFile) {
        this.imagePanel = new ImageViewPanel(imageFile);
        imagePanel.addMouseListener(imagePanel);
        imagePanel.addMouseMotionListener(imagePanel);
        this.add(imagePanel, CENTER);
        return imagePanel;
    }

    private void createControlPanel(File imageFile) {
        this.controlPanel = new JPanel();
        this.controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));

        this.createActionRadio();
        this.createSaveButton();
        this.createCopyButton(imageFile);
        this.createCloseButton();

        this.add(this.controlPanel, NORTH);
    }

    private void createActionRadio() {
        ButtonGroup buttonGroup = new ButtonGroup();

        JRadioButton cropRadioButton = new JRadioButton("crop");
        JRadioButton arrowRadioButton = new JRadioButton("arrow");

        buttonGroup.add(arrowRadioButton);
        buttonGroup.add(cropRadioButton);

        this.controlPanel.add(arrowRadioButton);
        this.controlPanel.add(cropRadioButton);
    }

    private void createSaveButton() {
        JButton saveButton = new JButton("save");
        saveButton.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            fileChooser.setCurrentDirectory(new File("."));
            int result = fileChooser.showSaveDialog(this);

            if (result == APPROVE_OPTION) {
                File selectedFile = fileChooser.getSelectedFile();
                this.imagePanel.save(selectedFile);
            }
        });

        controlPanel.add(saveButton);
    }

    private void createCloseButton() {
        JButton closeButton = new JButton("close");
        closeButton.addActionListener(e -> this.tabbedPane.close(this.name));

        controlPanel.add(closeButton);
    }

    private void createCopyButton(File imageFile) {
        JButton copyButton = new JButton("copy");
        
        copyButton.addActionListener(e -> {
            try {
                ProcessBuilder processBuilder = new ProcessBuilder();
                String command = "osascript -e 'set the clipboard to (read (POSIX file \"" + imageFile + "\") as  {«class PNGf»})'";
                processBuilder.command("sh", "-c", command);
                Process process = processBuilder.start();
                StreamGobbler streamGobbler = new StreamGobbler(process.getInputStream(), System.out::println);
                Executors.newSingleThreadExecutor().submit(streamGobbler);
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        });

        controlPanel.add(copyButton);
    }

    private static class StreamGobbler implements Runnable {
        private final InputStream inputStream;
        private final Consumer<String> consumer;

        public StreamGobbler(InputStream inputStream, Consumer<String> consumer) {
            this.inputStream = inputStream;
            this.consumer = consumer;
        }

        @Override
        public void run() {
            new BufferedReader(new InputStreamReader(inputStream)).lines()
                .forEach(consumer);
        }
    }
}
