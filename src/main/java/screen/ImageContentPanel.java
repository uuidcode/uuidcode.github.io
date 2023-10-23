package screen;

import java.awt.BorderLayout;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.ClipboardOwner;
import java.awt.datatransfer.Transferable;
import java.io.File;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JPanel;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.JFileChooser.APPROVE_OPTION;

public class ImageContentPanel extends JPanel implements ClipboardOwner {
    private ImagePanel imagePanel;

    public ImageContentPanel(File imageFile) {
        super(new BorderLayout());
        this.imagePanel = new ImagePanel(imageFile);
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
            TransferableImage trans = new TransferableImage(this.imagePanel.getBufferedImage());
            Clipboard c = Toolkit.getDefaultToolkit().getSystemClipboard();
            c.setContents(trans, ImageContentPanel.this);
        });

        controlPanel.add(copyButton);

        this.add(controlPanel, NORTH);
    }

    @Override
    public void lostOwnership(Clipboard clipboard, Transferable contents) {

    }
}
