package screen;

import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.FileDialog;
import java.awt.Frame;
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
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;

import lombok.SneakyThrows;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;
import static java.awt.event.KeyEvent.KEY_RELEASED;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.BoxLayout.X_AXIS;

public class ImagePanel extends JPanel {
    private final String name;
    private final ImageTabPanel tabbedPane;
    private final File imageFile;
    private ImageViewPanel imageViewPanel;
    private JPanel controlPanel;
    private JPanel buttonPanel;
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

            if (isOK && ke.getID() == KEY_RELEASED) {
                if (ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                    this.imageViewPanel.cancelPaste();
                    this.imageViewPanel.cancelText();
                } else if (ke.getKeyCode() == KeyEvent.VK_DELETE || ke.getKeyCode() == KeyEvent.VK_BACK_SPACE) {
                    this.imageViewPanel.deleteSelectedObject();
                } else if (ke.isControlDown() || ke.isMetaDown()) {
                    keyMap.getOrDefault(ke.getKeyCode(), () -> {}).run();
                }
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
        JPanel wrapper = new JPanel();
        wrapper.setLayout(new BoxLayout(wrapper, BoxLayout.Y_AXIS));

        this.controlPanel = new JPanel();
        this.controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));

        this.createShapeTypeRadio();
        this.createFillTypeRadio();
        this.createColorTypeRadio();

        this.buttonPanel = new JPanel();
        this.buttonPanel.setLayout(new BoxLayout(buttonPanel, LINE_AXIS));

        this.createShadowButton();
        this.createBorderButton();
        this.createRotateRightButton();
        this.createRotateLeftButton();
        this.createSaveButton();
        this.createPasteButton();
        this.createTextButton();
        this.createCopyButton();
        this.createSelectCopyButton();
        this.createCopyPathButton();
        this.createDeleteButton();
        this.createUndoButton();
        this.createRedoButton();
        this.createClearButton();
        this.createDeleteImageButton();
        this.createCloseButton();

        wrapper.add(this.controlPanel);
        wrapper.add(this.buttonPanel);
        this.add(wrapper, NORTH);
    }

    private void createDeleteButton() {
        JButton button = new JButton("delete selected object");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.deleteSelectedObject());
        this.buttonPanel.add(button);
    }

    private void createUndoButton() {
        JButton button = new JButton("undo");
        button.setName(this.name);
        button.addActionListener(e -> undo());
        this.buttonPanel.add(button);
    }

    private void undo() {
        this.imageViewPanel.undo();
    }

    private void createRedoButton() {
        JButton button = new JButton("redo");
        button.setName(this.name);
        button.addActionListener(e -> redo());
        this.buttonPanel.add(button);
    }

    private void redo() {
        this.imageViewPanel.redo();
    }

    private void createShapeTypeRadio() {
        this.createRadioPanel("Shape Type", ShapeType.class, ShapeType::getTitle,
            shapeType -> {
                this.imageViewPanel.setShapeType(shapeType);
                this.imageViewPanel.repaint();
            });
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

    private void createShadowButton() {
        JButton button = new JButton("shadow");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.shadow());
        this.buttonPanel.add(button);
    }

    private void createBorderButton() {
        JButton button = new JButton("border");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.border());
        this.buttonPanel.add(button);
    }

    private void createRotateRightButton() {
        JButton button = new JButton("rotate →");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.rotateRight());
        this.buttonPanel.add(button);
    }

    private void createRotateLeftButton() {
        JButton button = new JButton("rotate ←");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.rotateLeft());
        this.buttonPanel.add(button);
    }

    private void createSaveButton() {
        JButton button = new JButton("save");
        button.setName(this.name);
        button.addActionListener(e -> save());
        this.buttonPanel.add(button);
    }

    private void createPasteButton() {
        JButton button = new JButton("paste");
        button.setName(this.name);
        button.addActionListener(e -> paste());
        this.buttonPanel.add(button);
    }

    private void paste() {
        this.imageViewPanel.pasteFromClipboard();
    }

    private void createTextButton() {
        JButton button = new JButton("text");
        button.setName(this.name);
        button.addActionListener(e -> text());
        this.buttonPanel.add(button);
    }

    private void text() {
        java.awt.Window window = javax.swing.SwingUtilities.getWindowAncestor(this);
        String input = JOptionPane.showInputDialog(window, "텍스트를 입력하세요:");
        if (input != null && !input.isEmpty()) {
            this.imageViewPanel.startTextMode(input);
        }
    }

    @SneakyThrows
    private void save() {
        FileDialog fileDialog = new FileDialog((Frame) null, "파일 선택", FileDialog.SAVE);
        fileDialog.setVisible(true);

        String imageDirPath = getImageSavePath();

        fileDialog.setDirectory(imageDirPath);
        fileDialog.setFilenameFilter((dir, name) -> name.endsWith(".png"));

        String file = fileDialog.getFile();

        if (file != null) {
            File selectedFile = new File(fileDialog.getDirectory(), file);
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

    private static String getImageSavePath() {
        String imageDirPath = "/Users/ted/IdeaProjects/uuidcode.github.io/i";

        if (new File(imageDirPath).exists()) {
            return imageDirPath;
        }

        return "/Users/ted.song/IdeaProjects/uuidcode.github.io/i";
    }

    private void createCloseButton() {
        JButton button = new JButton("close");
        button.setName(this.name);
        button.addActionListener(e -> this.close());
        this.buttonPanel.add(button);
    }

    private void createDeleteImageButton() {
        JButton button = new JButton("delete image");
        button.setName(this.name);
        button.addActionListener(e -> this.deleteImage());
        this.buttonPanel.add(button);
    }

    private void createClearButton() {
        JButton button = new JButton("clear");
        button.setName(this.name);
        button.addActionListener(e -> this.clear());
        this.buttonPanel.add(button);
    }

    private void clear() {
        this.imageViewPanel.clear();
    }

    private void close() {
        this.tabbedPane.removeTab(this.name);
    }

    private void deleteImage() {
        if (this.imageFile.exists() && !this.imageFile.delete()) {
            JOptionPane.showMessageDialog(this, "이미지 파일 삭제에 실패했습니다.");
            return;
        }

        this.close();
    }

    private void createCopyButton() {
        JButton button = new JButton("copy");
        button.setName(this.name);
        button.addActionListener(e -> this.copy());
        this.buttonPanel.add(button);
    }

    private void createSelectCopyButton() {
        JButton button = new JButton("select copy");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.startSelectCopyMode());
        this.buttonPanel.add(button);
    }

    private void createCopyPathButton() {
        JButton button = new JButton("copy path");
        button.setName(this.name);
        button.addActionListener(e -> this.copyPath());
        this.buttonPanel.add(button);
    }

    private void copyPath() {
        String absolutePath = imageFile.getAbsolutePath();
        java.awt.datatransfer.StringSelection stringSelection =
            new java.awt.datatransfer.StringSelection(absolutePath);
        java.awt.Toolkit.getDefaultToolkit().getSystemClipboard()
            .setContents(stringSelection, null);
    }

    private void copy() {
        ImageViewPanel.copy(imageFile);
    }
}
