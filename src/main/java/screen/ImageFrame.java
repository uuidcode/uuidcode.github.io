package screen;

import org.apache.commons.io.IOUtils;
import org.jcodec.api.awt.AWTFrameGrab;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Image;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.Color;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.CodeSource;
import java.text.SimpleDateFormat;
import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.Timer;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.text.JTextComponent;

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
    private static final String WINDOW_RECT_BINARY_RELATIVE_PATH = "script/bin/window_rect_at_point";
    private static final String WINDOW_RECT_SCRIPT_RELATIVE_PATH = "script/window_rect_at_point.swift";
    private static final String BRING_WINDOW_TO_FRONT_BINARY_RELATIVE_PATH = "script/bin/bring_window_to_front";
    private static final String BRING_WINDOW_TO_FRONT_SCRIPT_RELATIVE_PATH = "script/bring_window_to_front.swift";
    private static final String FRONTMOST_WINDOW_BINARY_RELATIVE_PATH = "script/bin/get_frontmost_window";
    private static final String FRONTMOST_WINDOW_SCRIPT_RELATIVE_PATH = "script/get_frontmost_window.swift";
    private static final String GLOBAL_HOTKEY_BINARY_RELATIVE_PATH = "script/bin/global_hotkey";
    private static final String GLOBAL_HOTKEY_SCRIPT_RELATIVE_PATH = "script/global_hotkey.swift";
    private ImageTabPanel tabbedPane;
    private List<ScreenShotFrame> screenShotFrameList;
    // ImageFrame 이 화면에서 지워지기를 기다렸다가 오버레이가 깔 화면을 얼린다.
    private static final int OVERLAY_BASE_CAPTURE_DELAY_MS = 120;
    static final int TO_FRONT_SHORTCUT_KEY_CODE = KeyEvent.VK_F1;
    static final int CAPTURE_SHORTCUT_KEY_CODE = KeyEvent.VK_F2;
    static final int AUTO_SHOT_SHORTCUT_KEY_CODE = KeyEvent.VK_F3;
    static final int AUTO_SHOT_RETURN_SHORTCUT_KEY_CODE = KeyEvent.VK_F4;
    static final int AUTO_SHOT_WRITE_SHORTCUT_KEY_CODE = KeyEvent.VK_F5;
    static final int AUTO_SHOT_WRITE_RETURN_SHORTCUT_KEY_CODE = KeyEvent.VK_F6;
    static final String TO_FRONT_HOTKEY_NAME = "f1";
    static final String CAPTURE_HOTKEY_NAME = "f2";
    static final String AUTO_SHOT_HOTKEY_NAME = "f3";
    static final String AUTO_SHOT_RETURN_HOTKEY_NAME = "f4";
    static final String AUTO_SHOT_WRITE_HOTKEY_NAME = "f5";
    static final String AUTO_SHOT_WRITE_RETURN_HOTKEY_NAME = "f6";

    private volatile WindowTarget captureReturnTarget;

    private CaptureConfig captureConfig = new CaptureConfig();
    private ColorHistoryRepository colorHistoryRepository = new ColorHistoryRepository();
    private JComboBox<CaptureGridMode> captureGridModeComboBox;
    private JCheckBox imgTagCheckbox;
    private JTextField widthField;
    private JTextField heightField;
    private JTextField redField;
    private JTextField greenField;
    private JTextField blueField;
    private JTextField htmlColorField;
    private JPanel pickedColorPreviewPanel;
    private ScreenRecorder screenRecorder;
    private RecordingOverlay recordingOverlay;
    private RecordingAreaIndicator recordingAreaIndicator;

    @Data
    public static class WindowTarget {
        private final Rectangle rectangle;
        private final String ownerName;
        private final String windowName;
        private final int windowId;
        private final long ownerPid;
    }

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

        // shift 와 함께 누르는 기능키 단축키. shift+f1 은 ImageFrame 을 맨 앞으로,
        // shift+f2 는 앱을 앞으로 올린 다음 캡처까지 이어서 한다.
        // shift+f3 ~ shift+f6 은 영역을 고르면 바로 찍는다. f3 는 shot,
        // f5 는 shot and write 이고 둘 다 보던 화면에 머무른다.
        // f4, f6 은 같은 일을 하고 나서 ImageFrame 으로 돌아온다.
        // 드래그할 때 cmd 를 같이 누르고 있으면 각각 auto 쪽으로 바뀐다.
        // 전역 단축키 헬퍼가 떠 있으면 그쪽에서 먼저 가로채고,
        // 헬퍼를 못 띄운 환경에서는 아래 디스패처가 앱 안에서만 같은 일을 한다.
        Map<Integer, Runnable> functionKeyMap = new HashMap<>();
        functionKeyMap.put(TO_FRONT_SHORTCUT_KEY_CODE, this::bringToFront);
        functionKeyMap.put(CAPTURE_SHORTCUT_KEY_CODE, this::bringToFrontAndCapture);
        functionKeyMap.put(AUTO_SHOT_SHORTCUT_KEY_CODE, this::captureShotFromShortcut);
        functionKeyMap.put(AUTO_SHOT_RETURN_SHORTCUT_KEY_CODE, this::captureShotAndReturnFromShortcut);
        functionKeyMap.put(AUTO_SHOT_WRITE_SHORTCUT_KEY_CODE, this::captureShotAndWriteFromShortcut);
        functionKeyMap.put(
            AUTO_SHOT_WRITE_RETURN_SHORTCUT_KEY_CODE,
            this::captureShotAndWriteAndReturnFromShortcut
        );

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            if (getCurrentKeyboardFocusManager().getFocusOwner() instanceof JTextComponent) {
                return false;
            }

            if (ke.getID() != KeyEvent.KEY_RELEASED) {
                return false;
            }

            if (ke.isControlDown() || ke.isMetaDown()) {
                keyMap.getOrDefault(ke.getKeyCode(), () -> {}).run();
            }

            if (isFunctionKeyShortcutEnabled(ke)) {
                functionKeyMap.getOrDefault(ke.getKeyCode(), () -> {}).run();
            }

            return false;
        });

        this.startGlobalHotkeyListener();

//        ThumbnailDialog.deleteOldFile();
    }

    public JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.LINE_AXIS));
        // 양쪽 끝의 glue가 남는 가로 공간을 반씩 나눠 가져 버튼들이 가운데 정렬된다.
        panel.add(Box.createHorizontalGlue());
        this.createCaptureButton(panel);
        this.createCaptureRepeatButton(panel);
        this.createCaptureWindowButton(panel);
        this.createCaptureFullScreenButton(panel);
        this.createClipboardButton(panel);
        this.createOpenButton(panel);
        this.createViewButton(panel);
        this.createCaptureGridModeComboBox(panel);
        this.createImgTagCheckBox(panel);
        this.createFixedSizeFields(panel);
        panel.add(Box.createHorizontalGlue());

        Util.styleButtonsAsSquare(panel);

        return panel;
    }

    private void createCaptureGridModeComboBox(JPanel panel) {
        captureGridModeComboBox = new JComboBox<>(CaptureGridMode.values());
        Dimension comboSize = new Dimension(200, captureGridModeComboBox.getPreferredSize().height);
        captureGridModeComboBox.setPreferredSize(comboSize);
        captureGridModeComboBox.setMaximumSize(comboSize);
        captureGridModeComboBox.setSelectedItem(captureConfig.getCaptureGridMode());
        captureGridModeComboBox.addActionListener(e ->
            captureConfig.setCaptureGridMode((CaptureGridMode) captureGridModeComboBox.getSelectedItem()));
        panel.add(captureGridModeComboBox);
    }

    private void createImgTagCheckBox(JPanel panel) {
        imgTagCheckbox = new JCheckBox("img tag");
        imgTagCheckbox.setSelected(captureConfig.isImgTagEnabled());
        imgTagCheckbox.addActionListener(e -> captureConfig.setImgTagEnabled(imgTagCheckbox.isSelected()));
        panel.add(imgTagCheckbox);
    }

    private void createFixedSizeFields(JPanel panel) {
        panel.add(new JLabel(" width:"));
        widthField = new JTextField(3);
        Dimension fieldSize = new Dimension(60, widthField.getPreferredSize().height);
        widthField.setPreferredSize(fieldSize);
        widthField.setMaximumSize(fieldSize);
        widthField.addActionListener(e -> updateFixedSize());
        widthField.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                updateFixedSize();
            }
        });
        panel.add(widthField);
        panel.add(new JLabel(" height:"));
        heightField = new JTextField(3);
        heightField.setPreferredSize(fieldSize);
        heightField.setMaximumSize(fieldSize);
        heightField.addActionListener(e -> updateFixedSize());
        heightField.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                updateFixedSize();
            }
        });
        panel.add(heightField);

        Dimension colorFieldSize = new Dimension(45, heightField.getPreferredSize().height);
        Dimension htmlFieldSize = new Dimension(90, heightField.getPreferredSize().height);

        panel.add(new JLabel(" R:"));
        redField = new JTextField(3);
        redField.setPreferredSize(colorFieldSize);
        redField.setMaximumSize(colorFieldSize);
        panel.add(redField);

        panel.add(new JLabel(" G:"));
        greenField = new JTextField(3);
        greenField.setPreferredSize(colorFieldSize);
        greenField.setMaximumSize(colorFieldSize);
        panel.add(greenField);

        panel.add(new JLabel(" B:"));
        blueField = new JTextField(3);
        blueField.setPreferredSize(colorFieldSize);
        blueField.setMaximumSize(colorFieldSize);
        panel.add(blueField);

        panel.add(new JLabel(" HTML:"));
        htmlColorField = new JTextField(7);
        htmlColorField.setPreferredSize(htmlFieldSize);
        htmlColorField.setMaximumSize(htmlFieldSize);
        panel.add(htmlColorField);

        pickedColorPreviewPanel = new JPanel();
        int previewSide = htmlColorField.getPreferredSize().height;
        Dimension previewSize = new Dimension(previewSide, previewSide);
        pickedColorPreviewPanel.setPreferredSize(previewSize);
        pickedColorPreviewPanel.setMinimumSize(previewSize);
        pickedColorPreviewPanel.setMaximumSize(previewSize);
        pickedColorPreviewPanel.setBackground(Color.WHITE);
        pickedColorPreviewPanel.setBorder(BorderFactory.createLineBorder(Color.GRAY));
        panel.add(pickedColorPreviewPanel);

        JButton historyButton = new JButton("history");
        historyButton.addActionListener(e -> this.openColorHistory());
        panel.add(historyButton);
    }

    public void setPickedColor(Color color) {
        this.redField.setText(String.valueOf(color.getRed()));
        this.greenField.setText(String.valueOf(color.getGreen()));
        this.blueField.setText(String.valueOf(color.getBlue()));
        this.htmlColorField.setText(String.format("#%02X%02X%02X", color.getRed(), color.getGreen(), color.getBlue()));
        this.pickedColorPreviewPanel.setBackground(color);
        this.pickedColorPreviewPanel.repaint();
    }

    public void savePickedColor(Color color, Point point) {
        this.colorHistoryRepository.save(color, point);
    }

    private void openColorHistory() {
        ColorHistoryDialog dialog = new ColorHistoryDialog(this, this.colorHistoryRepository);
        dialog.setVisible(true);
    }

    private void updateFixedSize() {
        captureConfig.setFixedWidth(parseInteger(widthField.getText()));
        captureConfig.setFixedHeight(parseInteger(heightField.getText()));
    }

    private Integer parseInteger(String text) {
        try {
            return Integer.parseInt(text.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static String toCaptureButtonLabel(String text) {
        return text.startsWith("capture ")
            ? text.substring("capture ".length())
            : text;
    }

    private void createCaptureButton(JPanel panel) {
        JButton button = new JButton("capture");
        button.setToolTipText("capture (shift+f2)");
        button.addActionListener(e -> this.capture());
        panel.add(button);
    }

    private void createCaptureRepeatButton(JPanel panel) {
        JButton button = new JButton(toCaptureButtonLabel("capture repeat"));
        button.addActionListener(e -> this.captureRepeat());
        panel.add(button);
    }

    private void createCaptureWindowButton(JPanel panel) {
        JButton button = new JButton(toCaptureButtonLabel("capture window"));
        button.addActionListener(e -> this.captureWindow());
        panel.add(button);
    }

    private void createCaptureFullScreenButton(JPanel panel) {
        JButton button = new JButton(toCaptureButtonLabel("capture full screen"));
        button.addActionListener(e -> this.captureFullScreen());
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
        this.startAreaCapture(CaptureShortcut.NONE);
    }

    // shift 만 누른 기능키 조합만 받는다. 다른 조합키가 섞이면 다른 단축키다.
    static boolean isFunctionKeyShortcutEnabled(KeyEvent keyEvent) {
        return keyEvent.isShiftDown()
            && !keyEvent.isMetaDown()
            && !keyEvent.isControlDown()
            && !keyEvent.isAltDown();
    }

    // 캡처 오버레이가 떠 있는 동안에는 ImageFrame 을 숨겨 두므로,
    // 그때 눌린 단축키로 캡처가 다시 시작되지 않게 막는다.
    private void captureFromShortcut(CaptureShortcut captureShortcut) {
        if (!this.isVisible()) {
            return;
        }

        this.startAreaCapture(captureShortcut);
    }

    // shift+f3 ~ shift+f5 는 shift+f2 처럼 영역 오버레이를 띄우되,
    // 드래그가 끝나는 순간 컨트롤 패널 없이 바로 찍는다.
    private void captureShotFromShortcut() {
        this.bringToFrontAndCapture(CaptureShortcut.SHOT);
    }

    // shot 과 같지만 keep screen 설정과 무관하게 ImageFrame 으로 돌아온다.
    private void captureShotAndReturnFromShortcut() {
        this.bringToFrontAndCapture(CaptureShortcut.SHOT_AND_RETURN);
    }

    private void captureShotAndWriteFromShortcut() {
        this.bringToFrontAndCapture(CaptureShortcut.SHOT_AND_WRITE);
    }

    // write 까지 끝낸 뒤 ImageFrame 으로 돌아온다.
    private void captureShotAndWriteAndReturnFromShortcut() {
        this.bringToFrontAndCapture(CaptureShortcut.SHOT_AND_WRITE_AND_RETURN);
    }

    // 캡처 중 숨겨 둔 ImageFrame 을 다시 띄운다. keep current screen 이면
    // 창을 띄우되 포커스를 가져가지 않고 뒤로 보내, 보고 있던 화면이 그대로 남는다.
    void showAfterCapture(boolean keepCurrentScreen) {
        if (!keepCurrentScreen) {
            this.setVisible(true);

            return;
        }

        this.setAutoRequestFocus(false);
        this.setVisible(true);
        this.toBack();
        this.setAutoRequestFocus(true);
    }

    // keep current screen 으로 뒤에 둔 ImageFrame 을 shift+f1 로 다시 맨 앞으로 불러낸다.
    private void bringToFront() {
        this.bringToFront(null);
    }

    // shift+f2 는 shift+f1 + capture 다. 앱을 먼저 앞으로 올려 두고 캡처를 시작해야
    // 오버레이가 바로 키 입력(esc)까지 받는 상태로 뜬다.
    // 누르기 직전에 쓰던 앱은 기억해 두었다가, esc 로 캡처를 접으면 그 앱으로 되돌아간다.
    private void bringToFrontAndCapture() {
        this.bringToFrontAndCapture(CaptureShortcut.CAPTURE);
    }

    private void bringToFrontAndCapture(CaptureShortcut captureShortcut) {
        if (this.isCaptureOverlayOpen()) {
            return;
        }

        new Thread(() -> {
            this.captureReturnTarget = this.resolveCaptureReturnTarget();

            SwingUtilities.invokeLater(() -> this.bringToFront(() -> this.captureFromShortcut(captureShortcut)));
        }, "image-frame-capture-shortcut").start();
    }

    // 이미 우리 앱이 맨 앞이면 돌아갈 곳이 없다.
    private WindowTarget resolveCaptureReturnTarget() {
        try {
            WindowTarget target = this.getFrontmostWindowTarget();

            if (target == null || target.getOwnerPid() == this.getCurrentProcessId()) {
                return null;
            }

            return target;
        } catch (Throwable ignored) {
            return null;
        }
    }

    // shift+f2 로 시작한 캡처를 접었을 때 원래 쓰던 앱으로 되돌린다.
    // 되돌릴 곳이 있었으면 true 를 돌려줘, 호출한 쪽이 ImageFrame 을 앞으로 올리지 않게 한다.
    boolean restoreCaptureReturnTarget() {
        WindowTarget target = this.captureReturnTarget;

        this.captureReturnTarget = null;

        if (target == null) {
            return false;
        }

        new Thread(() -> {
            try {
                this.bringWindowToFront(target);
            } catch (Throwable ignored) {
            }
        }, "image-frame-return").start();

        return true;
    }

    void clearCaptureReturnTarget() {
        this.captureReturnTarget = null;
    }

    // 앱 자체를 앞으로 올리는 건 네이티브 헬퍼가 필요해 EDT 를 막지 않도록 별도 스레드에서 처리한다.
    // 그래서 앞으로 올라간 다음에 할 일은 콜백으로 이어 붙인다.
    private void bringToFront(Runnable afterFront) {
        this.setVisible(true);
        this.toFront();
        this.requestFocus();

        new Thread(() -> {
            try {
                this.bringCurrentAppToFront();
            } catch (Throwable ignored) {
            }

            SwingUtilities.invokeLater(() -> {
                this.toFront();
                this.requestFocus();

                if (afterFront != null) {
                    afterFront.run();
                }
            });
        }, "image-frame-to-front").start();
    }

    private boolean isCaptureOverlayOpen() {
        return this.screenShotFrameList != null
            && this.screenShotFrameList.stream().anyMatch(ScreenShotFrame::isVisible);
    }

    // 캡처 오버레이가 깔아 둘 "얼린 화면"이다.
    // Retina 에서 createScreenCapture 는 논리 크기로만 돌려줘 2 배로 늘리면 흐려지므로,
    // 화면에 깔 때는 해상도 변형을 함께 들고 있는 multi resolution 쪽을 쓴다.
    // (픽셀을 들여다보는 쪽은 ScreenShotPanel 이 여기서 논리 크기 변형을 꺼내 쓴다.)
    private Image captureBaseScreenImage(GraphicsDevice device) {
        try {
            Rectangle displayBounds = device.getDefaultConfiguration().getBounds();
            Robot robot = new Robot(device);

            return (Image) robot.createMultiResolutionScreenCapture(displayBounds);
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }

    void disposeScreenShotFrames() {
        if (this.screenShotFrameList == null) {
            return;
        }

        this.screenShotFrameList.forEach(ScreenShotFrame::dispose);
        this.screenShotFrameList = null;
    }

    void startRecording(
        GraphicsDevice graphicsDevice,
        Rectangle captureRectangle
    ) {
        if (this.screenRecorder != null) {
            return;
        }

        File outputFile = ScreenRecorder.resolveOutputFile();

        this.screenRecorder = new ScreenRecorder(
            captureRectangle, // captureRectangle
            ScreenRecorder.DEFAULT_FPS, // fps
            outputFile // outputFile
        );

        this.disposeScreenShotFrames();

        this.recordingAreaIndicator = new RecordingAreaIndicator(this.screenRecorder.getCaptureRectangle());
        this.recordingAreaIndicator.setVisible(true);

        this.recordingOverlay = new RecordingOverlay(
            graphicsDevice, // graphicsDevice
            this::stopRecording // onStop
        );

        this.recordingOverlay.setVisible(true);
        this.recordingOverlay.start();

        this.screenRecorder.start();
    }

    void stopRecording() {
        ScreenRecorder recorder = this.screenRecorder;

        if (recorder == null) {
            return;
        }

        this.screenRecorder = null;

        if (this.recordingOverlay != null) {
            this.recordingOverlay.dispose();
            this.recordingOverlay = null;
        }

        if (this.recordingAreaIndicator != null) {
            this.recordingAreaIndicator.dispose();
            this.recordingAreaIndicator = null;
        }

        new Thread(() -> {
            File file = recorder.stop();
            Throwable failure = recorder.getFailure();

            if (failure == null) {
                this.addRecordingTab(file);
            } else {
                failure.printStackTrace();
            }

            SwingUtilities.invokeLater(() -> {
                this.setVisible(true);
                this.toFront();
                this.requestFocus();
            });
        }, "screen-recorder-stop").start();
    }

    // 녹화된 mp4의 첫 프레임을 png로 저장해 탭으로 추가하고, 그 탭에서 영상을 재생할 수 있게 한다.
    private void addRecordingTab(File videoFile) {
        try {
            BufferedImage firstFrame = AWTFrameGrab.getFrame(
                videoFile, // file
                0.0 // second
            );

            String baseName = toRecordingBaseName(videoFile);
            File imageFile = Util.getImageFile(baseName);

            ImageIO.write(
                firstFrame, // im
                "png", // formatName
                imageFile // output
            );

            this.tabbedPane.addTab(
                baseName, // name
                null, // captureRectangle
                null, // captureConfig
                false, // windowCapture
                videoFile // videoFile
            );
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    // mp4 파일 이름에서 확장자를 뗀 이름을 탭 이름 겸 첫 프레임 png 이름으로 사용한다.
    static String toRecordingBaseName(File videoFile) {
        return videoFile.getName().replace(ScreenRecorder.VIDEO_EXTENSION, "");
    }

    private void captureRepeat() {
        this.setVisible(false);
        this.captureConfig.setWindowCaptureMode(false);

        try {
            Robot robot = new Robot();
            Rectangle lastRect = captureConfig.getLastRectangle();
            
            if (lastRect != null) {
                ScreenShotPanel.capture(
                    robot,
                    lastRect,
                    lastRect.x,
                    lastRect.y,
                    this.tabbedPane,
                    captureConfig,
                    false
                );
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }

        this.setVisible(true);
    }

    // toBack 으로는 자신이 찍히는 것을 막을 수 없다. 오버레이를 숨기는 순간
    // 같은 앱의 남은 창으로 포커스가 넘어가 ImageFrame 이 최전면으로 올라오기 때문이다.
    // 그래서 영역 캡처 중에는 숨겨 둔다. 자신을 찍으려면 delay shot 을 쓴다.
    private void startAreaCapture(CaptureShortcut captureShortcut) {
        this.captureConfig.setAutoTrimEnabled(false);
        this.captureConfig.setWindowCaptureMode(false);
        this.captureConfig.setSeeMode(false);
        this.captureConfig.setAutoShotMode(captureShortcut.getAutoShotMode());
        this.captureConfig.setCaptureShortcut(captureShortcut);
        updateFixedSize();

        this.setVisible(false);
        this.openCaptureOverlayAfterHidden();
    }

    private void captureFullScreen() {
        updateFixedSize();
        this.captureConfig.setAutoTrimEnabled(false);
        this.captureConfig.setWindowCaptureMode(false);

        int previousState = this.getExtendedState();
        Thread iconifyThread = this.iconifyInBackground(previousState | JFrame.ICONIFIED);

        new Thread(() -> {
            boolean originalImgTagEnabled = captureConfig.isImgTagEnabled();

            try {
                iconifyThread.join();
                Thread.sleep(300);

                GraphicsConfiguration graphicsConfiguration = this.getGraphicsConfiguration();
                Rectangle bounds;

                if (graphicsConfiguration != null) {
                    bounds = new Rectangle(graphicsConfiguration.getBounds());
                } else {
                    GraphicsDevice defaultDevice = getLocalGraphicsEnvironment().getDefaultScreenDevice();
                    bounds = new Rectangle(defaultDevice.getDefaultConfiguration().getBounds());
                }

                PointerInfo pointerInfo = MouseInfo.getPointerInfo();
                Point mousePoint = pointerInfo != null
                    ? pointerInfo.getLocation()
                    : new Point(bounds.x, bounds.y);

                captureConfig.setLastRectangle(new Rectangle(bounds));
                captureConfig.setImgTagEnabled(false);

                Robot robot = new Robot();

                ScreenShotPanel.capture(
                    robot,
                    bounds,
                    mousePoint.x,
                    mousePoint.y,
                    this.tabbedPane,
                    captureConfig,
                    false
                );
            } catch (Throwable t) {
                t.printStackTrace();
            } finally {
                captureConfig.setImgTagEnabled(originalImgTagEnabled);

                SwingUtilities.invokeLater(() -> {
                    this.setVisible(true);
                    this.setExtendedState(previousState & ~JFrame.ICONIFIED);
                    this.toFront();
                });
            }
        }).start();
    }

    private void captureWindow() {
        this.setVisible(false);
        this.captureConfig.setAutoTrimEnabled(false);
        this.captureConfig.setWindowCaptureMode(true);
        this.captureConfig.setAutoShotMode(AutoShotMode.NONE);
        this.captureConfig.setCaptureShortcut(CaptureShortcut.NONE);

        updateFixedSize();

        this.openCaptureOverlayAfterHidden();
    }

    // setVisible(false) 는 바로 돌아오지만 창이 화면에서 실제로 지워지는 것은 그 뒤다.
    // 오버레이가 캡처 시작 순간의 화면을 얼려서 깔기 때문에, 곧바로 찍으면
    // 사라지는 중인 ImageFrame 이 그대로 찍혀 오버레이 뒤에 비쳐 보인다.
    // Swing Timer 로 한 박자 쉬어 EDT 가 창을 지울 틈을 준 뒤에 찍는다.
    private void openCaptureOverlayAfterHidden() {
        Timer timer = new Timer(OVERLAY_BASE_CAPTURE_DELAY_MS, e -> this.openCaptureOverlay());
        timer.setRepeats(false);
        timer.start();
    }

    private void openCaptureOverlay() {
        GraphicsDevice[] screenDeviceArray =
            getLocalGraphicsEnvironment()
                .getScreenDevices();

        this.disposeScreenShotFrames();

        this.screenShotFrameList = stream(screenDeviceArray)
            .map(device -> new ScreenShotFrame(device, this, this.captureBaseScreenImage(device)))
            .peek(f -> f.setVisible(true))
            .collect(toList());

        this.tabbedPane.setScreenShotFrameList(this.screenShotFrameList);
    }

    WindowTarget getWindowTargetAtPoint(Point point) throws Exception {
        List<String> command = buildHelperCommand(WINDOW_RECT_BINARY_RELATIVE_PATH, WINDOW_RECT_SCRIPT_RELATIVE_PATH);
        if (command == null) {
            throw new IllegalStateException("Window rect helper not found: " + WINDOW_RECT_BINARY_RELATIVE_PATH);
        }
        command.add(String.valueOf(point.x));
        command.add(String.valueOf(point.y));
        command.add(String.valueOf(getCurrentProcessId()));

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();
        String stdout = IOUtils.toString(process.getInputStream(), StandardCharsets.UTF_8);
        String stderr = IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IllegalStateException(stderr.isEmpty() ? "Failed to resolve window rectangle." : stderr.trim());
        }

        Map<String, String> values = new HashMap<String, String>();
        for (String line : stdout.split("\\R")) {
            int separatorIndex = line.indexOf('=');
            if (separatorIndex <= 0) {
                continue;
            }

            String key = line.substring(0, separatorIndex).trim();
            String value = line.substring(separatorIndex + 1).trim();
            if (value.isEmpty()) {
                continue;
            }
            values.put(key, value);
        }

        if (!values.containsKey("x") || !values.containsKey("y")
            || !values.containsKey("width") || !values.containsKey("height")) {
            throw new IllegalStateException("Window rect script returned incomplete rectangle.");
        }

        Rectangle rectangle = new Rectangle(
            Integer.parseInt(values.get("x")),
            Integer.parseInt(values.get("y")),
            Integer.parseInt(values.get("width")),
            Integer.parseInt(values.get("height"))
        );

        return new WindowTarget(
            rectangle,
            values.getOrDefault("ownerName", ""),
            values.getOrDefault("windowName", ""),
            Integer.parseInt(values.getOrDefault("windowID", "0")),
            Long.parseLong(values.getOrDefault("ownerPid", "0"))
        );
    }

    void bringWindowToFront(WindowTarget target) throws Exception {
        if (target == null || target.getOwnerPid() <= 0) {
            return;
        }

        List<String> command = buildHelperCommand(BRING_WINDOW_TO_FRONT_BINARY_RELATIVE_PATH, BRING_WINDOW_TO_FRONT_SCRIPT_RELATIVE_PATH);
        if (command == null) {
            throw new IllegalStateException("Bring window helper not found: " + BRING_WINDOW_TO_FRONT_BINARY_RELATIVE_PATH);
        }
        command.add(String.valueOf(target.getOwnerPid()));
        command.add(target.getWindowName() == null ? "" : target.getWindowName());

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();
        String stderr = IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IllegalStateException(stderr.isEmpty() ? "Failed to bring window to front." : stderr.trim());
        }
    }

    void bringCurrentAppToFront() throws Exception {
        this.bringWindowToFront(new WindowTarget(
            new Rectangle(),
            "",
            "",
            0,
            getCurrentProcessId()
        ));
    }

    WindowTarget getFrontmostWindowTarget() throws Exception {
        List<String> command = buildHelperCommand(FRONTMOST_WINDOW_BINARY_RELATIVE_PATH, FRONTMOST_WINDOW_SCRIPT_RELATIVE_PATH);
        if (command == null) {
            throw new IllegalStateException("Frontmost window helper not found: " + FRONTMOST_WINDOW_BINARY_RELATIVE_PATH);
        }
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Process process = processBuilder.start();
        String stdout = IOUtils.toString(process.getInputStream(), StandardCharsets.UTF_8);
        String stderr = IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IllegalStateException(stderr.isEmpty() ? "Failed to resolve frontmost window." : stderr.trim());
        }

        Map<String, String> values = new HashMap<String, String>();
        for (String line : stdout.split("\\R")) {
            int separatorIndex = line.indexOf('=');
            if (separatorIndex <= 0) {
                continue;
            }

            String key = line.substring(0, separatorIndex).trim();
            String value = line.substring(separatorIndex + 1).trim();
            values.put(key, value);
        }

        long ownerPid = Long.parseLong(values.getOrDefault("ownerPid", "0"));
        if (ownerPid <= 0) {
            return null;
        }

        return new WindowTarget(
            new Rectangle(),
            values.getOrDefault("ownerName", ""),
            values.getOrDefault("windowName", ""),
            0,
            ownerPid
        );
    }

    // 단축키는 다른 앱을 쓰는 중에도 눌려야 해서 맥 전역 단축키(shift+f1 ~ shift+f5)로 등록한다.
    // 등록은 네이티브 헬퍼가 맡고, 키가 눌릴 때마다 한 줄씩 내려 주는 이름을 읽어 실행한다.
    private void startGlobalHotkeyListener() {
        List<String> command = buildHelperCommand(
            GLOBAL_HOTKEY_BINARY_RELATIVE_PATH, // binaryRelativePath
            GLOBAL_HOTKEY_SCRIPT_RELATIVE_PATH // scriptRelativePath
        );

        if (command == null) {
            return;
        }

        command.add(String.valueOf(this.getCurrentProcessId()));

        Map<String, Runnable> hotkeyMap = new HashMap<>();
        hotkeyMap.put(TO_FRONT_HOTKEY_NAME, this::bringToFront);
        hotkeyMap.put(CAPTURE_HOTKEY_NAME, this::bringToFrontAndCapture);
        hotkeyMap.put(AUTO_SHOT_HOTKEY_NAME, this::captureShotFromShortcut);
        hotkeyMap.put(AUTO_SHOT_RETURN_HOTKEY_NAME, this::captureShotAndReturnFromShortcut);
        hotkeyMap.put(AUTO_SHOT_WRITE_HOTKEY_NAME, this::captureShotAndWriteFromShortcut);
        hotkeyMap.put(
            AUTO_SHOT_WRITE_RETURN_HOTKEY_NAME,
            this::captureShotAndWriteAndReturnFromShortcut
        );

        Thread thread = new Thread(
            () -> this.readGlobalHotkey(command, hotkeyMap), // target
            "global-hotkey" // name
        );

        thread.setDaemon(true);
        thread.start();
    }

    private void readGlobalHotkey(List<String> command, Map<String, Runnable> hotkeyMap) {
        try {
            Process process = new ProcessBuilder(command).start();

            // ImageFrame 을 닫아 JVM 이 끝날 때 헬퍼만 남지 않게 한다.
            Runtime.getRuntime().addShutdownHook(new Thread(process::destroy, "global-hotkey-stop"));

            try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;

                while ((line = reader.readLine()) != null) {
                    Runnable action = hotkeyMap.get(line.trim());

                    if (action == null) {
                        continue;
                    }

                    SwingUtilities.invokeLater(action);
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private List<String> buildHelperCommand(String binaryRelativePath, String scriptRelativePath) {
        File binaryFile = resolveHelperFile(binaryRelativePath);
        if (binaryFile != null && binaryFile.canExecute()) {
            List<String> command = new ArrayList<String>();
            command.add(binaryFile.getAbsolutePath());
            return command;
        }

        File scriptFile = resolveHelperFile(scriptRelativePath);
        if (scriptFile != null) {
            List<String> command = new ArrayList<String>();
            command.add("swift");
            command.add(scriptFile.getAbsolutePath());
            return command;
        }

        return null;
    }

    private File resolveHelperFile(String relativePath) {
        for (File candidate : buildHelperCandidates(relativePath)) {
            if (candidate.isFile()) {
                return candidate.getAbsoluteFile();
            }
        }

        return null;
    }

    private List<File> buildHelperCandidates(String relativePath) {
        List<File> candidates = new ArrayList<File>();
        Set<String> seen = new LinkedHashSet<String>();

        addSearchPathCandidates(candidates, seen, new File(System.getProperty("user.dir", ".")), relativePath);

        try {
            CodeSource codeSource = ImageFrame.class.getProtectionDomain().getCodeSource();
            if (codeSource != null && codeSource.getLocation() != null) {
                File codeLocation = new File(codeSource.getLocation().toURI());
                File startDir = codeLocation.isDirectory() ? codeLocation : codeLocation.getParentFile();
                addSearchPathCandidates(candidates, seen, startDir, relativePath);
            }
        } catch (Exception ignored) {
        }

        return candidates;
    }

    private void addSearchPathCandidates(List<File> candidates, Set<String> seen, File startDir, String relativePath) {
        File current = startDir;
        while (current != null) {
            File candidate = new File(current, relativePath).getAbsoluteFile();
            String path = candidate.getAbsolutePath();
            if (seen.add(path)) {
                candidates.add(candidate);
            }
            current = current.getParentFile();
        }
    }

    private long getCurrentProcessId() {
        String runtimeName = ManagementFactory.getRuntimeMXBean().getName();
        int separatorIndex = runtimeName.indexOf('@');
        String pidText = separatorIndex >= 0 ? runtimeName.substring(0, separatorIndex) : runtimeName;
        return Long.parseLong(pidText);
    }

    private Thread iconifyInBackground(int state) {
        Thread thread = new Thread(() -> this.setExtendedState(state), "image-frame-iconify");
        thread.start();
        return thread;
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
