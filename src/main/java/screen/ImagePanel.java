package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FileDialog;
import java.awt.FlowLayout;
import java.awt.Frame;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Window;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTable;
import javax.swing.JToggleButton;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;
import javax.swing.text.JTextComponent;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import lombok.SneakyThrows;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.NORTH;
import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;
import static java.awt.event.KeyEvent.KEY_RELEASED;
import static javax.swing.BoxLayout.LINE_AXIS;
import static javax.swing.BoxLayout.X_AXIS;

public class ImagePanel extends JPanel {
    private static final long CAPTURE_REPEAT_HIDE_DELAY_MS = 200;
    private static final Color TOOL_TOGGLE_ACTIVE_BACKGROUND = new Color(52, 120, 246);
    private static final String REPOSITORY_RELATIVE_PATH = "IdeaProjects/uuidcode.github.io";
    private static final String REPOSITORY_DIRECTORY_NAME = "uuidcode.github.io";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final String PREVIEW_URL_FORMAT = "http://localhost:63342/uuidcode.github.io/stream/images/%d.html";
    private static final String CHROME_APPLICATION_NAME = "Google Chrome";
    private static final String INTELLIJ_APPLICATION_NAME = "IntelliJ IDEA";
    private static final long INTELLIJ_OPEN_SETTLE_DELAY_MS = 3_000;
    private static final ShapeType[] TOOL_SHAPE_TYPES = {
        ShapeType.CROP,
        ShapeType.BLUR,
        ShapeType.BLUR_CLIPPING
    };

    private final String name;
    private final ImageTabPanel tabbedPane;
    private final File imageFile;
    private final Rectangle captureRectangle;
    private final CaptureConfig captureConfig;
    private final boolean windowCapture;
    private final ImageOcrService imageOcrService = new ImageOcrService();
    private ImageViewPanel imageViewPanel;
    private JPanel controlPanel;
    private JPanel buttonPanel;
    private JScrollPane jScrollPane;
    private JSplitPane contentSplitPane;
    private ImageOcrPanel imageOcrPanel;
    private JButton ocrButton;
    private JButton writeButton;
    private final Map<ShapeType, JToggleButton> toggleButtonMap = new LinkedHashMap<>();
    private ShapeType selectedShapeType;

    public ImagePanel(
        String name,
        File imageFile,
        ImageTabPanel tabbedPane,
        Rectangle captureRectangle,
        CaptureConfig captureConfig,
        boolean windowCapture
    ) {
        super(new BorderLayout());
        this.name = name;
        this.tabbedPane = tabbedPane;
        this.imageFile = imageFile;
        this.captureRectangle = captureRectangle == null ? null : new Rectangle(captureRectangle);
        this.captureConfig = captureConfig == null ? null : captureConfig.copy();
        this.windowCapture = windowCapture;
        this.imageViewPanel = this.createImageViewPanel(imageFile);
        this.createControlPanel();
        this.setCenterComponent(this.jScrollPane);

        Map<Integer, Runnable> keyMap = new HashMap<>();
        keyMap.put(KeyEvent.VK_S, this::save);
        keyMap.put(KeyEvent.VK_C, this::copy);
        keyMap.put(KeyEvent.VK_W, this::close);
        keyMap.put(KeyEvent.VK_Z, this::undo);
        keyMap.put(KeyEvent.VK_Y, this::redo);
        keyMap.put(KeyEvent.VK_E, this::clear);
        keyMap.put(KeyEvent.VK_EQUALS, this::zoomIn);
        keyMap.put(KeyEvent.VK_PLUS, this::zoomIn);
        keyMap.put(KeyEvent.VK_MINUS, this::zoomOut);
        keyMap.put(KeyEvent.VK_0, this::resetZoom);
        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            Component focusOwner = getCurrentKeyboardFocusManager().getFocusOwner();
            if (focusOwner instanceof JTextComponent || focusOwner instanceof JTable) {
                return false;
            }

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
            this.jScrollPane.revalidate();
            SwingUtilities.invokeLater(() -> {
                if (this.jScrollPane == null) {
                    return;
                }

                Dimension viewSize = this.jScrollPane.getViewport().getViewSize();
                Dimension extentSize = this.jScrollPane.getViewport().getExtentSize();
                int x = Math.max(0, (viewSize.width - extentSize.width) / 2);
                int y = Math.max(0, (viewSize.height - extentSize.height) / 2);
                this.jScrollPane.getViewport().setViewPosition(new Point(x, y));
            });
        }
    }

    private ImageViewPanel createImageViewPanel(File imageFile) {
        this.imageViewPanel = new ImageViewPanel(this, imageFile);
        this.jScrollPane = new JScrollPane(this.imageViewPanel);
        this.jScrollPane.setBorder(BorderFactory.createEmptyBorder(4, 4, 4, 4));

        jScrollPane.addMouseWheelListener(e -> {
            int notches = e.getWheelRotation();

            if (e.isControlDown() || e.isMetaDown()) {
                if (notches < 0) {
                    this.imageViewPanel.zoomIn();
                } else {
                    this.imageViewPanel.zoomOut();
                }

                e.consume();
                return;
            }

            JScrollBar verticalScrollBar = jScrollPane.getVerticalScrollBar();
            int scrollAmount = 100;

            if (notches < 0) {
                verticalScrollBar.setValue(verticalScrollBar.getValue() - scrollAmount);
            } else {
                verticalScrollBar.setValue(verticalScrollBar.getValue() + scrollAmount);
            }

            e.consume();
        });

        return imageViewPanel;
    }

    private void setCenterComponent(JComponent component) {
        Component currentComponent = ((BorderLayout) this.getLayout()).getLayoutComponent(CENTER);

        if (currentComponent != null) {
            this.remove(currentComponent);
        }

        this.add(component, CENTER);
        this.revalidate();
        this.repaint();
    }

    private void createControlPanel() {
        JPanel wrapper = new JPanel();
        wrapper.setLayout(new BoxLayout(wrapper, BoxLayout.Y_AXIS));

        this.controlPanel = new JPanel();
        this.controlPanel.setLayout(new BoxLayout(controlPanel, LINE_AXIS));

        this.buttonPanel = new JPanel();
        this.buttonPanel.setLayout(new WrapLayout(FlowLayout.CENTER, 0, 0));

        this.createToolTogglePanel();
        this.createFillTypeRadio();
        this.createColorTypeRadio();

        this.createCaptureRepeatButton();
        this.createMeasureButton();
        this.createShadowButton();
        this.createBorderButton();
        this.createRotateRightButton();
        this.createRotateLeftButton();
        this.createZoomInButton();
        this.createZoomOutButton();
        this.createZoomResetButton();
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
        this.createOcrButton();
        this.createDeleteImageButton();
        this.createCloseButton();
        this.createWriteButton();

        Util.styleButtonsAsSquare(this.buttonPanel);

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

    // 도형/Crop/Blur 토글을 기존 Shape Type 자리의 Tool 그룹 한 곳에 모아 둔다.
    private void createToolTogglePanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, X_AXIS));
        panel.setBorder(BorderFactory.createTitledBorder("Tool"));

        Arrays.stream(selectableShapeTypes())
            .forEach(shapeType -> panel.add(this.createToggleButton(shapeType)));

        Arrays.stream(TOOL_SHAPE_TYPES)
            .forEach(shapeType -> panel.add(this.createToggleButton(shapeType)));

        // 초기에는 모든 토글이 꺼진, 그리기 도구가 없는 상태로 시작한다.
        this.setActiveShapeType(null);

        this.controlPanel.add(panel);
    }

    private JToggleButton createToggleButton(ShapeType shapeType) {
        JToggleButton button = new JToggleButton(toggleLabel(shapeType));
        button.setName(this.name);
        button.addActionListener(e -> this.onToggleClicked(shapeType));

        Util.styleButtonAsSquare(button);

        this.toggleButtonMap.put(shapeType, button);

        return button;
    }

    // 켜져 있는 토글을 다시 누르면 전부 꺼져 그리기 도구가 없는 상태가 된다.
    private void onToggleClicked(ShapeType shapeType) {
        JToggleButton button = this.toggleButtonMap.get(shapeType);

        this.setActiveShapeType(button.isSelected() ? shapeType : null);
    }

    // 모든 토글은 하나의 그룹으로 동작해서, 켜진 토글 외에는 전부 꺼진 상태가 된다.
    private void setActiveShapeType(ShapeType shapeType) {
        this.selectedShapeType = shapeType;

        this.toggleButtonMap.forEach(
            (type, button) -> button.setSelected(type == shapeType)
        );

        this.updateToggleButtonAppearances();

        this.imageViewPanel.setShapeType(shapeType);
        this.imageViewPanel.repaint();
    }

    private void updateToggleButtonAppearances() {
        this.toggleButtonMap.forEach(this::updateToggleButtonAppearance);
    }

    // 토글의 on/off 상태가 눈에 보이도록 활성 시 강조 색으로 채운다.
    private void updateToggleButtonAppearance(
        ShapeType shapeType,
        JToggleButton button
    ) {
        if (button == null) {
            return;
        }

        String label = toggleLabel(shapeType);

        boolean active = button.isSelected();
        if (active) {
            button.setContentAreaFilled(false);
            button.setOpaque(true);
            button.setBackground(TOOL_TOGGLE_ACTIVE_BACKGROUND);
            button.setForeground(Color.WHITE);
            button.setText(label + " ●");
        } else {
            button.setContentAreaFilled(true);
            button.setOpaque(false);
            button.setBackground(null);
            button.setForeground(null);
            button.setText(label);
        }
    }

    private static String toggleLabel(ShapeType shapeType) {
        if (shapeType == ShapeType.BLUR_CLIPPING) {
            return "Blur Outside";
        }

        return shapeType.getTitle();
    }

    static ShapeType[] selectableShapeTypes() {
        return Arrays.stream(ShapeType.values())
            .filter(ImagePanel::isSelectableShapeType)
            .toArray(ShapeType[]::new);
    }

    private static boolean isSelectableShapeType(ShapeType shapeType) {
        return Arrays.stream(TOOL_SHAPE_TYPES)
            .noneMatch(toolShapeType -> toolShapeType == shapeType);
    }

    private void createFillTypeRadio() {
        this.createRadioPanel(
            "Fill Type",
            FillType.values(),
            FillType::getTitle,
            fillType -> this.imageViewPanel.setFillType(fillType)
        );
    }

    private void createColorTypeRadio() {
        this.createRadioPanel(
            "Color Type",
            ColorType.values(),
            ColorType::getTitle,
            colorType -> this.imageViewPanel.setColorType(colorType)
        );
    }

    private <T extends Enum<T>>void createRadioPanel(
        String name,
        T[] values,
        Function<T, String> nameFunction,
        Consumer<T> consumer
    ) {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, X_AXIS));
        panel.setBorder(BorderFactory.createTitledBorder(name));

        ButtonGroup buttonGroup = new ButtonGroup();

        Arrays.stream(values)
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

    private void createCaptureRepeatButton() {
        JButton button = new JButton("capture repeat");
        button.setName(this.name);
        button.setEnabled(this.captureRectangle != null);
        button.addActionListener(e -> this.captureRepeat());
        this.buttonPanel.add(button);
    }

    private void captureRepeat() {
        if (this.captureRectangle == null) {
            return;
        }

        Window window = SwingUtilities.getWindowAncestor(this);

        new Thread(() -> {
            try {
                // 앱 창이 캡처 영역을 가리면 그 위의 앱(이전 캡처 이미지)을 다시 찍어
                // auto trim 과 맞물려 점점 작아지므로, 원래 영역이 드러나도록 앱 창을 잠시 숨긴다
                if (window != null) {
                    SwingUtilities.invokeAndWait(() -> window.setVisible(false));
                }

                Thread.sleep(CAPTURE_REPEAT_HIDE_DELAY_MS);

                Robot robot = new Robot();

                CaptureConfig config;
                if (this.captureConfig != null) {
                    config = this.captureConfig.copy();
                } else {
                    config = new CaptureConfig();
                }

                // 저장된 영역은 이미 auto-trim이 반영된 영역이므로, 재캡처 시에는
                // trim을 끄고 같은 좌표를 그대로 다시 찍어 동일한 영역이 나오도록 한다.
                config.setAutoTrimEnabled(false);

                ScreenShotPanel.capture(
                    robot,
                    new Rectangle(this.captureRectangle), // rectangle
                    this.captureRectangle.x,
                    this.captureRectangle.y,
                    this.tabbedPane,
                    config, // config
                    this.windowCapture
                );
            } catch (Throwable t) {
                t.printStackTrace();
            } finally {
                if (window != null) {
                    SwingUtilities.invokeLater(() -> window.setVisible(true));
                }
            }
        }, "capture-repeat").start();
    }

    private void createMeasureButton() {
        JButton button = new JButton("measure");
        button.setName(this.name);
        button.addActionListener(e -> this.imageViewPanel.measureRectangles());
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

    private void createZoomInButton() {
        JButton button = new JButton("zoom +");
        button.setName(this.name);
        button.addActionListener(e -> this.zoomIn());
        this.buttonPanel.add(button);
    }

    private void createZoomOutButton() {
        JButton button = new JButton("zoom -");
        button.setName(this.name);
        button.addActionListener(e -> this.zoomOut());
        this.buttonPanel.add(button);
    }

    private void createZoomResetButton() {
        JButton button = new JButton("zoom reset");
        button.setName(this.name);
        button.addActionListener(e -> this.resetZoom());
        this.buttonPanel.add(button);
    }

    private void zoomIn() {
        this.imageViewPanel.zoomIn();
    }

    private void zoomOut() {
        this.imageViewPanel.zoomOut();
    }

    private void resetZoom() {
        this.imageViewPanel.resetZoom();
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
        String input = JOptionPane.showInputDialog(window, "Enter text:");
        if (input != null && !input.isEmpty()) {
            this.imageViewPanel.startTextMode(input);
        }
    }

    @SneakyThrows
    private void save() {
        FileDialog fileDialog = new FileDialog((Frame) null, "Choose file", FileDialog.SAVE);
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

    private void createWriteButton() {
        this.writeButton = new JButton("write");
        this.writeButton.setName(this.name);
        this.writeButton.addActionListener(e -> this.write());
        this.buttonPanel.add(this.writeButton);
    }

    // 홈 디렉터리의 IdeaProjects/uuidcode.github.io 를 pull 한 뒤
    // images/{연도}.html 에 오늘 날짜의 img 태그를 추가하고 i 디렉터리에 이미지를 저장한다.
    private void write() {
        File repositoryDirectory = new File(
            System.getProperty("user.home"), // parent
            REPOSITORY_RELATIVE_PATH // child
        );

        if (!repositoryDirectory.isDirectory()) {
            JOptionPane.showMessageDialog(
                this, // parentComponent
                repositoryDirectory.getAbsolutePath() + " not found." // message
            );

            return;
        }

        BufferedImage bufferedImage = this.imageViewPanel.getBufferedImage();

        if (bufferedImage == null) {
            JOptionPane.showMessageDialog(
                this, // parentComponent
                "Image not found." // message
            );

            return;
        }

        this.writeButton.setEnabled(false);

        new SwingWorker<Void, Void>() {
            @Override
            protected Void doInBackground() throws Exception {
                gitPull(repositoryDirectory);

                LocalDate today = LocalDate.now();
                String date = today.format(DATE_FORMATTER);

                String htmlPath = "images/" + today.getYear() + ".html";
                File htmlFile = new File(
                    repositoryDirectory, // parent
                    htmlPath // child
                );

                if (!htmlFile.isFile()) {
                    throw new IllegalStateException(htmlFile.getAbsolutePath() + " not found.");
                }

                ImageHtmlWriter.Result result = ImageHtmlWriter.write(
                    FileUtils.readFileToString(
                        htmlFile,
                        StandardCharsets.UTF_8 // encoding
                    ),
                    date
                );

                String imagePath = "i/" + result.getImageName() + ".png";
                File targetImageFile = new File(
                    repositoryDirectory, // parent
                    imagePath // child
                );

                File imageDirectory = targetImageFile.getParentFile();

                if (!imageDirectory.isDirectory() && !imageDirectory.mkdirs()) {
                    throw new IllegalStateException("Failed to create " + imageDirectory.getAbsolutePath());
                }

                // 이미지 저장이 실패하면 html 만 수정되는 상황이 생기므로 이미지를 먼저 저장한다.
                if (!ImageIO.write(
                    bufferedImage,
                    "png", // formatName
                    targetImageFile // output
                )) {
                    throw new IllegalStateException("Failed to write " + targetImageFile.getAbsolutePath());
                }

                FileUtils.writeStringToFile(
                    htmlFile,
                    result.getHtml(), // data
                    StandardCharsets.UTF_8 // encoding
                );

                git(
                    repositoryDirectory,
                    "add", // argument
                    "--", // argument
                    imagePath,
                    htmlPath
                );

                // 다른 파일이 이미 staged 되어 있어도 함께 커밋되지 않도록 경로를 지정한다.
                git(
                    repositoryDirectory,
                    "commit", // argument
                    "-m", // argument
                    result.getImageName(), // argument
                    "--", // argument
                    imagePath,
                    htmlPath
                );

                // 직전에 pull 했으므로 lease 가 최신이다. 로컬 히스토리를 고쳐 쓴 경우에도
                // push 되고, pull 이후 원격에 새로 올라온 커밋은 덮어쓰지 않는다.
                git(
                    repositoryDirectory,
                    "push", // argument
                    "--force-with-lease" // argument
                );

                openIntellijProjectIfNecessary(repositoryDirectory);

                openChrome(String.format(
                    PREVIEW_URL_FORMAT, // format
                    today.getYear() // args
                ));

                return null;
            }

            @Override
            protected void done() {
                writeButton.setEnabled(true);

                try {
                    this.get();
                } catch (Exception e) {
                    Throwable cause = e;

                    if (e.getCause() != null) {
                        cause = e.getCause();
                    }

                    String message = "Write failed.";

                    if (cause.getMessage() != null) {
                        message = cause.getMessage();
                    }

                    JOptionPane.showMessageDialog(
                        ImagePanel.this, // parentComponent
                        message
                    );
                }
            }
        }.execute();
    }

    private static void openChrome(String url) throws Exception {
        runCommand(openApplicationCommand(
            CHROME_APPLICATION_NAME, // applicationName
            url
        ));
    }

    private static void openIntellijProjectIfNecessary(File repositoryDirectory) throws Exception {
        if (isIntellijProjectOpen()) {
            return;
        }

        runCommand(openApplicationCommand(
            INTELLIJ_APPLICATION_NAME, // applicationName
            repositoryDirectory.getAbsolutePath() // pathOrUrl
        ));

        Thread.sleep(INTELLIJ_OPEN_SETTLE_DELAY_MS);
    }

    private static boolean isIntellijProjectOpen() {
        try {
            String windowList = runCommand(intellijWindowListCommand());

            return containsIntellijProjectWindow(windowList);
        } catch (Exception e) {
            return false;
        }
    }

    static boolean containsIntellijProjectWindow(String windowList) {
        if (windowList == null) {
            return false;
        }

        return windowList.contains(REPOSITORY_DIRECTORY_NAME);
    }

    static List<String> openApplicationCommand(
        String applicationName,
        String pathOrUrl
    ) {
        List<String> command = new ArrayList<>();
        command.add("open");

        command.add("-a");

        command.add(applicationName);

        command.add(pathOrUrl);

        return command;
    }

    private static List<String> intellijWindowListCommand() {
        List<String> command = new ArrayList<>();
        command.add("osascript");

        command.add("-e");

        command.add("tell application \"System Events\"");

        command.add("-e");

        command.add("if exists process \"" + INTELLIJ_APPLICATION_NAME + "\" then");

        command.add("-e");

        command.add("tell process \"" + INTELLIJ_APPLICATION_NAME + "\" to return name of windows as string");

        command.add("-e");

        command.add("end if");

        command.add("-e");

        command.add("return \"\"");

        command.add("-e");

        command.add("end tell");

        return command;
    }

    private static String runCommand(List<String> command) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder(command);

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        String output = IOUtils.toString(
            process.getInputStream(),
            StandardCharsets.UTF_8 // encoding
        );

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IllegalStateException(
                String.join(
                    " ", // delimiter
                    command
                ) + " failed.\n" + output.trim()
            );
        }

        return output;
    }

    private static void gitPull(File repositoryDirectory) throws Exception {
        git(repositoryDirectory, "pull");
    }

    private static void git(File repositoryDirectory, String... arguments) throws Exception {
        List<String> command = new ArrayList<>();
        command.add("git");
        command.addAll(Arrays.asList(arguments));

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(repositoryDirectory);
        processBuilder.redirectErrorStream(true);
        // 자격 증명 프롬프트에서 멈추지 않고 바로 실패하도록 터미널 입력을 막는다.
        processBuilder.environment().put("GIT_TERMINAL_PROMPT", "0");

        Process process = processBuilder.start();
        String output = IOUtils.toString(process.getInputStream(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IllegalStateException(
                "git " + String.join(" ", arguments) + " failed.\n" + output.trim()
            );
        }
    }

    private void createDeleteImageButton() {
        JButton button = new JButton("delete image");
        button.setName(this.name);
        button.addActionListener(e -> this.deleteImage());
        this.buttonPanel.add(button);
    }

    private void createOcrButton() {
        this.ocrButton = new JButton("ocr");
        this.ocrButton.setName(this.name);
        this.ocrButton.addActionListener(e -> this.runOcr());
        this.buttonPanel.add(this.ocrButton);
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
            JOptionPane.showMessageDialog(this, "Failed to delete image file.");
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

    private void runOcr() {
        if (!this.imageFile.exists()) {
            JOptionPane.showMessageDialog(this, "Image file not found.");
            return;
        }

        this.showOcrPanel();
        this.imageOcrPanel.showLoading();
        this.ocrButton.setEnabled(false);

        new SwingWorker<ImageOcrService.OcrRunResult, Void>() {
            @Override
            protected ImageOcrService.OcrRunResult doInBackground() throws Exception {
                return imageOcrService.run(imageFile);
            }

            @Override
            protected void done() {
                ocrButton.setEnabled(true);

                try {
                    imageOcrPanel.setResult(this.get());
                } catch (Exception e) {
                    Throwable cause = e.getCause();
                    String message = cause != null && cause.getMessage() != null
                        ? cause.getMessage()
                        : (e.getMessage() == null ? "OCR failed." : e.getMessage());
                    imageOcrPanel.showError(message);
                    JOptionPane.showMessageDialog(ImagePanel.this, message);
                }
            }
        }.execute();
    }

    private void showOcrPanel() {
        if (this.imageOcrPanel == null) {
            this.imageOcrPanel = new ImageOcrPanel(new ImageOcrPanel.OcrPanelListener() {
                @Override
                public void onShowRectsChanged(boolean visible, java.util.List<ImageOcrService.OcrItem> items) {
                    if (visible) {
                        imageViewPanel.setOcrOverlays(items);
                    } else {
                        imageViewPanel.setOcrOverlays(java.util.Collections.<ImageOcrService.OcrItem>emptyList());
                    }
                }

                @Override
                public void onItemSelected(ImageOcrService.OcrItem item) {
                    imageViewPanel.setSelectedOcrItem(item);
                }

                @Override
                public void onResetRequested() {
                    imageViewPanel.clearOcrOverlays();
                }

                @Override
                public void onCloseRequested() {
                    hideOcrPanel();
                }
            });
        }

        if (this.contentSplitPane == null) {
            this.contentSplitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, this.jScrollPane, this.imageOcrPanel);
            this.contentSplitPane.setResizeWeight(0.7d);
        } else {
            this.contentSplitPane.setLeftComponent(this.jScrollPane);
            this.contentSplitPane.setRightComponent(this.imageOcrPanel);
        }

        this.setCenterComponent(this.contentSplitPane);
        SwingUtilities.invokeLater(() -> this.contentSplitPane.setDividerLocation(0.7d));
    }

    private void hideOcrPanel() {
        this.imageViewPanel.clearOcrOverlays();
        this.setCenterComponent(this.jScrollPane);
        this.revalidate();
        this.repaint();
    }
}
