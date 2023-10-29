package screen;

import java.awt.BorderLayout;
import java.awt.event.KeyEvent;
import java.io.File;
import java.util.Arrays;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.filechooser.FileNameExtensionFilter;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.JFileChooser.APPROVE_OPTION;

public class ImagePanel extends JPanel {
    private final String name;
    private final ImageTabPanel tabbedPane;
    private final File imageFile;
    private ImageViewPanel imageViewPanel;
    private JPanel controlPanel;

    public ImagePanel(String name, File imageFile, ImageTabPanel tabbedPane) {
        super(new BorderLayout());
        this.name = name;
        this.tabbedPane = tabbedPane;
        this.imageFile = imageFile;
        this.imageViewPanel = this.createImageViewPanel(imageFile);
        this.createControlPanel();

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            if (ke.getID() == KeyEvent.KEY_RELEASED && (ke.isControlDown() || ke.isMetaDown())) {
                if (ke.getKeyCode() == KeyEvent.VK_S) {
                    save();
                } else if (ke.getKeyCode() == KeyEvent.VK_C) {
                    copy();
                } else if (ke.getKeyCode() == KeyEvent.VK_W) {
                    close();
                } else if (ke.getKeyCode() == KeyEvent.VK_Z) {
                    undo();
                } else if (ke.getKeyCode() == KeyEvent.VK_Y) {
                    redo();
                } else if (ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                    Store.screenShotFrameList.forEach(f -> f.setVisible(false));
                }
            }

            return false;
        });
    }

    private ImageViewPanel createImageViewPanel(File imageFile) {
        this.imageViewPanel = new ImageViewPanel(imageFile);
        this.imageViewPanel.setBorder(BorderFactory.createEmptyBorder(4, 4, 4, 4));
        this.add(imageViewPanel, CENTER);
        return imageViewPanel;
    }

    private void createControlPanel() {
        this.controlPanel = new JPanel();
        this.controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));

        this.createActionRadio();
        this.createSaveButton();
        this.createCopyButton();
        this.createUndoButton();
        this.createRedoButton();
        this.createClearButton();
        this.createCloseButton();

        this.add(this.controlPanel, NORTH);
    }

    private void createUndoButton() {
        JButton button = new JButton("undo");
        button.addActionListener(e -> undo());
        this.controlPanel.add(button);
    }

    private void undo() {
        this.imageViewPanel.undo();
    }

    private void createRedoButton() {
        JButton button = new JButton("redo");
        button.addActionListener(e -> redo());
        this.controlPanel.add(button);
    }

    private void redo() {
        this.imageViewPanel.redo();
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
        saveButton.addActionListener(e -> save());
        this.controlPanel.add(saveButton);
    }

    private void save() {
        FileNameExtensionFilter filter = new FileNameExtensionFilter("png file", "png");
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(filter);
        fileChooser.setCurrentDirectory(new File("/Users/ted.song/IdeaProjects/uuidcode.github.io/i"));
        int result = fileChooser.showSaveDialog(this);

        if (result == APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();

            String fileName = selectedFile.getName();
            if (!fileName.endsWith(".png")) {
                selectedFile = new File(selectedFile.getParent(), fileName + ".png");
            }

            this.imageViewPanel.save(selectedFile);
        }
    }

    private void createCloseButton() {
        JButton closeButton = new JButton("close");
        closeButton.addActionListener(e -> this.close());
        controlPanel.add(closeButton);
    }

    private void createClearButton() {
        JButton closeButton = new JButton("clear");
        closeButton.addActionListener(e -> this.clear());
        controlPanel.add(closeButton);
    }

    private void clear() {
        this.imageViewPanel.clear();
    }

    private void close() {
        this.tabbedPane.removeTab(this.name);
    }

    private void createCopyButton() {
        JButton copyButton = new JButton("copy");
        copyButton.addActionListener(e -> copy());
        controlPanel.add(copyButton);
    }

    private void copy() {
        if (this.isValid() && this.isVisible()) {
            this.imageViewPanel.copy(imageFile);
        }
    }
}
