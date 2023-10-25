package screen;

import java.awt.BorderLayout;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.util.Arrays;

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
    private ImageViewPanel imageViewPanel;
    private JPanel controlPanel;

    public ImagePanel(String name, File imageFile, ButtonTabPanel tabbedPane) {
        super(new BorderLayout());
        this.name = name;
        this.tabbedPane = tabbedPane;
        this.imageViewPanel = this.createImageViewPanel(imageFile);
        this.createControlPanel(imageFile);
    }

    private ImageViewPanel createImageViewPanel(File imageFile) {
        this.imageViewPanel = new ImageViewPanel(imageFile);
        this.add(imageViewPanel, CENTER);
        this.imageViewPanel.addKeyListener(new MyKeyListener(imageViewPanel));
        this.imageViewPanel.setFocusable(true);
        this.imageViewPanel.requestFocus();
        return imageViewPanel;
    }

    private void createControlPanel(File imageFile) {
        this.controlPanel = new JPanel();
        this.controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));

        this.createActionRadio();
        this.createSaveButton();
        this.createCopyButton(imageFile);
        this.createUndoButton();
        this.createCloseButton();

        this.add(this.controlPanel, NORTH);
    }

    private void createUndoButton() {
        JButton button = new JButton("undo");

        button.addActionListener(e -> this.imageViewPanel.undo());

        controlPanel.add(button);
    }

    private void createActionRadio() {
        ButtonGroup buttonGroup = new ButtonGroup();

        Arrays.stream(Mode.values())
            .forEach(mode -> {
                JRadioButton radioButton = new JRadioButton(mode.name());
                radioButton.setSelected(true);
                radioButton.addActionListener(e -> {
                    Store.mode = mode;
                });

                buttonGroup.add(radioButton);
                this.controlPanel.add(radioButton);
            });
    }

    private void createSaveButton() {
        JButton saveButton = new JButton("save");
        saveButton.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            fileChooser.setCurrentDirectory(new File("."));
            int result = fileChooser.showSaveDialog(this);

            if (result == APPROVE_OPTION) {
                File selectedFile = fileChooser.getSelectedFile();
                this.imageViewPanel.save(selectedFile);
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
            this.imageViewPanel.copy(imageFile);
        });

        controlPanel.add(copyButton);
    }

    public void keyReleased(KeyEvent e) {
        this.imageViewPanel.keyReleased(e);
    }

    static class MyKeyListener implements KeyListener {
        private final ImageViewPanel imageViewPanel;

        public MyKeyListener(ImageViewPanel imageViewPanel) {
            this.imageViewPanel = imageViewPanel;
        }

        @Override
        public void keyTyped(KeyEvent e) {

        }

        @Override
        public void keyPressed(KeyEvent e) {

        }

        public void keyReleased(KeyEvent e) {
            System.out.println("@@@@@" + e);
            this.imageViewPanel.keyReleased(e);
        }
    }
}
