package screen;

import java.awt.BorderLayout;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.ClipboardOwner;
import java.awt.datatransfer.Transferable;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JPanel;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.JFileChooser.APPROVE_OPTION;

public class ImageContentPanel extends JPanel implements ClipboardOwner {
    private final ImagePanel imagePanel;
    private final String name;
    private final ButtonTabPanel tabbedPane;

    public ImageContentPanel(String name, File imageFile, ButtonTabPanel tabbedPane) {
        super(new BorderLayout());
        this.name = name;
        this.imagePanel = new ImagePanel(imageFile);
        this.tabbedPane = tabbedPane;

        imagePanel.addMouseListener(imagePanel);
        imagePanel.addMouseMotionListener(imagePanel);
        this.add(imagePanel, CENTER);

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

        JPanel controlPanel = new JPanel();
        controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));
        controlPanel.add(saveButton);

        JButton copyButton = new JButton("copy");
        copyButton.addActionListener(e -> {
            try {
                ProcessBuilder processBuilder = new ProcessBuilder();
                processBuilder.command("sh", "-c", "osascript -e 'set the clipboard to (read (POSIX file \"" + imageFile + "\") as  {«class PNGf»})'");
                Process process = processBuilder.start();
                StreamGobbler streamGobbler = new StreamGobbler(process.getInputStream(), System.out::println);
                Executors.newSingleThreadExecutor().submit(streamGobbler);
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        });

        controlPanel.add(copyButton);

        JButton closeButton = new JButton("close");
        closeButton.addActionListener(e -> this.tabbedPane.close(this.name));

        controlPanel.add(closeButton);

        this.add(controlPanel, NORTH);
    }

    @Override
    public void lostOwnership(Clipboard clipboard, Transferable contents) {
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
