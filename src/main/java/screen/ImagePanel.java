package screen;

import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.event.KeyEvent;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.filechooser.FileNameExtensionFilter;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;
import static java.awt.event.KeyEvent.KEY_RELEASED;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.BoxLayout.X_AXIS;
import static javax.swing.JFileChooser.APPROVE_OPTION;

public class ImagePanel extends JPanel {
    private final String name;
    private final ImageTabPanel tabbedPane;
    private final File imageFile;
    private ImageViewPanel imageViewPanel;
    private JPanel controlPanel;
    private JScrollPane jScrollPane;

    public ImagePanel(String name, File imageFile, ImageTabPanel tabbedPane) {
        super(new BorderLayout());
        this.name = name;
        this.tabbedPane = tabbedPane;
        this.imageFile = imageFile;
        this.imageViewPanel = this.createImageViewPanel(imageFile);
        this.createControlPanel();

        Map<Integer, Runnable> keyMap = new HashMap<>();
        keyMap.put(KeyEvent.VK_S, this::save);
        keyMap.put(KeyEvent.VK_C, this::copy);
        keyMap.put(KeyEvent.VK_W, this::close);
        keyMap.put(KeyEvent.VK_Z, this::undo);
        keyMap.put(KeyEvent.VK_Y, this::redo);
        keyMap.put(KeyEvent.VK_E, this::clear);

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            Component selectedComponent = this.tabbedPane
                .getSelectedComponent();

            boolean isOK = false;

            if (selectedComponent instanceof ImagePanel) {
                ImagePanel imagePanel = (ImagePanel) selectedComponent;
                isOK = imagePanel.name.equals(this.name);
            }

            if (isOK && ke.getID() == KEY_RELEASED
                && (ke.isControlDown() || ke.isMetaDown())) {
                keyMap.getOrDefault(ke.getKeyCode(), () -> {}).run();
            }

            return false;
        });
    }

    public void init() {
        if (this.jScrollPane != null) {
            this.jScrollPane.getVerticalScrollBar().setValue(0);
            this.jScrollPane.getHorizontalScrollBar().setValue(0);
            this.jScrollPane.revalidate();
        }
    }

    private ImageViewPanel createImageViewPanel(File imageFile) {
        this.imageViewPanel = new ImageViewPanel(this, imageFile);
        this.jScrollPane = new JScrollPane(this.imageViewPanel);
        this.jScrollPane.setBorder(BorderFactory.createEmptyBorder(4, 4, 4, 4));

        jScrollPane.addMouseWheelListener(e -> {
            JScrollBar verticalScrollBar = jScrollPane.getVerticalScrollBar();
            int notches = e.getWheelRotation();
            int scrollAmount = 100;

            if (notches < 0) {
                verticalScrollBar.setValue(verticalScrollBar.getValue() - scrollAmount);
            } else {
                verticalScrollBar.setValue(verticalScrollBar.getValue() + scrollAmount);
            }

            e.consume();
        });

        this.add(jScrollPane, CENTER);
        return imageViewPanel;
    }

    private void createControlPanel() {
        this.controlPanel = new JPanel();
        this.controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));

        this.createShapeTypeRadio();
        this.createFillTypeRadio();
        this.createColorTypeRadio();
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
        button.setName(this.name);
        button.addActionListener(e -> undo());
        this.controlPanel.add(button);
    }

    private void undo() {
        this.imageViewPanel.undo();
    }

    private void createRedoButton() {
        JButton button = new JButton("redo");
        button.setName(this.name);
        button.addActionListener(e -> redo());
        this.controlPanel.add(button);
    }

    private void redo() {
        this.imageViewPanel.redo();
    }

    private void createShapeTypeRadio() {
        this.createRadioPanel("Shape Type", ShapeType.class, ShapeType::getTitle,
            shapeType -> this.imageViewPanel.setShapeType(shapeType));
    }

    private void createFillTypeRadio() {
        this.createRadioPanel("Fill Type", FillType.class, FillType::getTitle,
            fillType -> this.imageViewPanel.setFillType(fillType));
    }

    private void createColorTypeRadio() {
        this.createRadioPanel("Color Type", ColorType.class, ColorType::getTitle,
            colorType -> this.imageViewPanel.setColorType(colorType));
    }

    private <T extends Enum<T>>void createRadioPanel(String name,
                                                     Class<T> tClass,
                                                     Function<T, String> nameFunction,
                                                     Consumer<T> consumer) {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, X_AXIS));
        panel.setBorder(BorderFactory.createTitledBorder(name));

        ButtonGroup buttonGroup = new ButtonGroup();

        Arrays.stream(tClass.getEnumConstants())
            .forEach(type -> {
                JRadioButton radioButton = new JRadioButton(nameFunction.apply(type));
                radioButton.setSelected(true);
                radioButton.addActionListener(e -> consumer.accept(type));
                buttonGroup.add(radioButton);
                panel.add(radioButton);
            });

        this.controlPanel.add(panel);
    }

    private void createSaveButton() {
        JButton button = new JButton("save");
        button.setName(this.name);
        button.addActionListener(e -> save());
        this.controlPanel.add(button);
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

            if (selectedFile.exists()) {
                JOptionPane.showMessageDialog(null, "이미 존재하는 파일입니다.");
                return;
            }

            this.imageViewPanel.save(selectedFile);
        }
    }

    private void createCloseButton() {
        JButton button = new JButton("close");
        button.setName(this.name);
        button.addActionListener(e -> this.close());
        controlPanel.add(button);
    }

    private void createClearButton() {
        JButton button = new JButton("clear");
        button.setName(this.name);
        button.addActionListener(e -> this.clear());
        controlPanel.add(button);
    }

    private void clear() {
        this.imageViewPanel.clear();
    }

    private void close() {
        this.tabbedPane.removeTab(this.name);
    }

    private void createCopyButton() {
        JButton button = new JButton("copy");
        button.setName(this.name);
        button.addActionListener(e -> this.copy());
        controlPanel.add(button);
    }

    private void copy() {
        ImageViewPanel.copy(imageFile);
    }
}
