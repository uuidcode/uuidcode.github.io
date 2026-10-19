package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsDevice;
import java.awt.Image;
import java.awt.GridLayout;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Stroke;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.awt.image.MultiResolutionImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayDeque;
import java.util.Base64;
import java.util.Date;
import java.util.Deque;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;
import static java.awt.RenderingHints.KEY_ANTIALIASING;
import static java.awt.RenderingHints.VALUE_ANTIALIAS_ON;
import static javax.swing.BorderFactory.createEmptyBorder;

public class ScreenShotPanel extends JPanel
    implements MouseListener, MouseMotionListener {
    private static final class WindowCornerRadii {
        private final int topLeft;
        private final int topRight;
        private final int bottomLeft;
        private final int bottomRight;

        private WindowCornerRadii(int topLeft, int topRight, int bottomLeft, int bottomRight) {
            this.topLeft = topLeft;
            this.topRight = topRight;
            this.bottomLeft = bottomLeft;
            this.bottomRight = bottomRight;
        }

        private int max() {
            return Math.max(Math.max(this.topLeft, this.topRight), Math.max(this.bottomLeft, this.bottomRight));
        }
    }

    // 캡처 영역 컨트롤 패널의 버튼. 선언 순서가 그대로 화면 배치 순서가 된다.
    enum AreaControlButton {
        SHOT_AND_WRITE("shot and write"),
        SHOT("shot"),
        SEE("see"),
        AUTO("auto"),
        SELF("self"),
        RECORD("record"),
        DELAY_SHOT("delay shot"),
        DELAY_SHOT_ALL("delay shot all"),
        CANCEL("cancel");

        private final String label;

        AreaControlButton(String label) {
            this.label = label;
        }

        String getLabel() {
            return this.label;
        }
    }

    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);
    private static final int PRE_CAPTURE_HIDE_DELAY_MS = 30;
    private static final int WINDOW_FRONT_SETTLE_DELAY_MS = 60;
    private static final int MOUSE_HIDE_SETTLE_DELAY_MS = 20;
    private static final int COUNTDOWN_TICK_MS = 1000;
    private static final int COUNTDOWN_POLL_INTERVAL_MS = 50;
    private static final int DELAY_SHOT_SECOND = 5;
    private static final Color PREVIEW_GRID_COLOR = new Color(255, 255, 255, 28);
    private static final Color PREVIEW_GRID_LABEL_COLOR = new Color(255, 255, 255, 110);
    private static final Color CAPTURE_GRID_COLOR = new Color(255, 196, 0, 150);
    private static final Color CAPTURE_GRID_LABEL_COLOR = new Color(255, 224, 130, 240);
    private static final Color CAPTURE_GRID_LABEL_BACKGROUND = new Color(0, 0, 0, 150);
    private static final Color GUIDE_TEXT_BACKGROUND = new Color(0, 0, 0, 140);
    private static final Color GUIDE_TEXT_COLOR = new Color(255, 255, 255, 235);
    private static final int GUIDE_TEXT_PADDING = 4;
    // 좌표 안내의 baseline 을 영역 위/아래에서 얼마나 띄울지.
    private static final int GUIDE_LABEL_TOP_GAP = 8;
    private static final int GUIDE_LABEL_BOTTOM_GAP = 18;
    // 다시 그릴 자리를 잴 때 반올림이나 안티에일리어싱으로 한두 픽셀 삐져나오는 몫.
    private static final int OVERLAY_DAMAGE_PADDING = 8;
    // 드래그를 놓으면 무슨 일이 일어나는지 적어 두는 영역 한가운데 안내.
    private static final float RELEASE_ACTION_FONT_SIZE = 15f;
    private static final int RELEASE_ACTION_PADDING = 8;
    // 영역 왼쪽에 펼쳐 두는 shift+f2 ~ shift+f4 설명.
    private static final float SHORTCUT_HELP_FONT_SIZE = 12f;
    private static final int SHORTCUT_HELP_PADDING = 8;
    private static final int SHORTCUT_HELP_GAP = 12;
    private static final int SHORTCUT_HELP_COLUMN_GAP = 12;
    private static final int SHORTCUT_HELP_SECTION_GAP = 6;
    private static final int SHORTCUT_HELP_ACTIVE_INSET = 3;
    private static final int GUIDE_BOX_ARC = 10;
    private static final Color SHORTCUT_HELP_DETAIL_COLOR = new Color(255, 255, 255, 180);
    private static final Color SHORTCUT_HELP_ACTIVE_BACKGROUND = new Color(255, 255, 255, 45);
    // 단축키마다 뜻이 같은 조합키라서 목록 아래에 한 번만 적는다.
    private static final String[][] SHORTCUT_HELP_MODIFIER_ROW_ARRAY = {
        {"cmd", "놓을 때 auto 로"},
        {"esc", "취소"}
    };
    private static final int GRID_LABEL_INTERVAL = 100;
    private static final int CONTROL_PANEL_REPAINT_PADDING = 24;
    private static final int WINDOW_CAPTURE_PADDING = 20;
    private static final Color WINDOW_CAPTURE_BACKGROUND_COLOR = new Color(63, 66, 48);
    private static final int WINDOW_CORNER_FALLBACK_RADIUS = 10;
    private static final int WINDOW_CORNER_MIN_RADIUS = 6;
    private static final int WINDOW_CORNER_MAX_RADIUS = 20;
    private static final int WINDOW_CORNER_SAMPLE_INSET = 2;
    private static final int WINDOW_CORNER_SAMPLE_SIZE = 8;
    private static final int WINDOW_CORNER_COLOR_THRESHOLD = 24;
    private static final int WINDOW_CORNER_SEED_THRESHOLD = 28;
    private static final int WINDOW_CORNER_ALPHA_SAMPLES = 8;
    private static final int AUTO_TRIM_COLOR_THRESHOLD = 36;
    private static final int SELECTION_HANDLE_SIZE = 10;
    private static final int SELECTION_HANDLE_HIT_SIZE = 16;
    private static final int SELECTION_MIN_SIZE = 8;
    static final int AREA_CONTROL_COLUMN_COUNT = 3;
    static final String KEEP_CURRENT_SCREEN_LABEL = "keep screen";
    // macOS Aqua 캡슐 버튼은 자기 칸 안에서 좌우 5px, 아래 3px 들어간 자리에 그려진다.
    // 바를 같은 만큼 들여야 버튼 두 개를 합친 폭과 정확히 맞는다.
    static final int BUTTON_PAINT_SIDE_INSET = 5;
    // 버튼 아래쪽 3px 이 이미 비어 있으므로 간격은 그만큼 덜 준다.
    private static final int KEEP_CURRENT_SCREEN_GAP = 3;
    private static final int KEEP_CURRENT_SCREEN_PADDING = 4;
    private static final int KEEP_CURRENT_SCREEN_ARC = 8;
    private static final Color SELECTION_HANDLE_COLOR = new Color(255, 255, 255, 235);
    private static final Color SELECTION_HANDLE_BORDER_COLOR = new Color(0, 0, 0, 150);
    private final GraphicsDevice graphicsDevice;
    private Point stratPoint;
    private Point endPoint;
    private Point mousePosition;
    private final ImageTabPanel tabbedPane;
    private final ScreenShotFrame screenShotFrame;
    private final ImageFrame imageFrame;
    // 화면에 깔 얼린 화면. Retina 해상도 변형을 들고 있어 2 배 화면에서도 선명하다.
    private final Image baseScreenDisplayImage;
    // 색을 집거나 창 모서리를 재는 등 픽셀을 들여다보는 쪽이 쓰는 논리 크기 변형.
    private final BufferedImage baseScreenImage;
    private JPanel controlPanel = null;
    private JCheckBox keepCurrentScreenCheckBox;
    private SeePreview seePreview;
    private final CaptureConfig captureConfig;
    private boolean guideOverlayVisible = true;
    private boolean rightButtonPressed;
    private Point colorPreviewPoint;
    private Color colorPreviewColor;
    private final Timer windowCaptureHoverTimer;
    private Rectangle windowCapturePreviewRect;
    private ImageFrame.WindowTarget windowCaptureTarget;
    private Point windowCaptureHoverPoint;
    private int windowCaptureRequestId;
    private SelectionHandle activeSelectionHandle = SelectionHandle.NONE;
    private Rectangle selectionDragOriginRectangle;
    private Point selectionDragStartPoint;
    // 드래그를 놓을 때 cmd 를 누르고 있으면 auto 쪽으로 찍히므로, 누르고 있는 동안 안내도 그쪽으로 바꾼다.
    private boolean autoTrimKeyDown;
    private final CountdownState countdownState = new CountdownState();

    public ScreenShotPanel(
        GraphicsDevice graphicsDevice,
        ImageFrame imageFrame,
        ScreenShotFrame screenShotFrame,
        Image baseScreenImage
    ) {
        this.graphicsDevice = graphicsDevice;
        this.tabbedPane = imageFrame.getTabbedPane();
        this.imageFrame = imageFrame;
        this.screenShotFrame = screenShotFrame;
        this.baseScreenDisplayImage = baseScreenImage;
        this.baseScreenImage = toLogicalScreenImage(baseScreenImage);
        this.captureConfig = imageFrame.getCaptureConfig();
        this.setLayout(null);
        this.windowCaptureHoverTimer = new Timer(250, e -> this.resolveWindowCapturePreview());
        this.windowCaptureHoverTimer.setRepeats(false);

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            // 드래그를 멈춘 채 cmd 만 눌렀다 떼도 놓았을 때 할 일이 바뀌므로 안내를 따라 바꾼다.
            if (ke.getKeyCode() == KeyEvent.VK_META) {
                this.updateAutoTrimKeyDown(ke.getID() == KeyEvent.KEY_PRESSED);
            }

            if (ke.getID() != KeyEvent.KEY_RELEASED) {
                return false;
            }

            if (ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                // delay shot 카운트다운 중에는 촬영만 취소하고, 캡처 UI 정리는 촬영 스레드에 맡긴다.
                if (this.countdownState.cancel()) {
                    return true;
                }

                this.cancelCapture();
            }

            return false;
        });
    }

    // 픽셀을 들여다보는 쪽은 Retina 배율을 모르는 채 패널 좌표를 그대로 쓰므로
    // 해상도 변형 중 논리 크기(배율 1) 쪽을 꺼내 준다.
    private static BufferedImage toLogicalScreenImage(Image image) {
        if (image == null) {
            return null;
        }

        Image variant = image;

        if (image instanceof MultiResolutionImage) {
            List<Image> variantList = ((MultiResolutionImage) image).getResolutionVariants();

            if (!variantList.isEmpty()) {
                variant = variantList.get(0);
            }
        }

        if (variant instanceof BufferedImage) {
            return (BufferedImage) variant;
        }

        BufferedImage copied = new BufferedImage(
            variant.getWidth(null),
            variant.getHeight(null),
            BufferedImage.TYPE_INT_RGB
        );
        Graphics2D g2 = copied.createGraphics();

        try {
            g2.drawImage(variant, 0, 0, null);
        } finally {
            g2.dispose();
        }

        return copied;
    }

    // 캡처 버튼 아래에 "캡처 후 현재 화면 유지" 체크박스를 한 줄로 붙인다.
    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new BorderLayout(0, KEEP_CURRENT_SCREEN_GAP));

        configureControlPanel(panel);

        panel.add(this.createControlButtonPanel(), BorderLayout.CENTER);
        panel.add(this.createKeepCurrentScreenWrapper(), BorderLayout.SOUTH);

        return panel;
    }

    // 바 자체를 버튼이 그려지는 폭만큼 좁혀 주는 투명한 껍데기.
    private JPanel createKeepCurrentScreenWrapper() {
        JPanel wrapper = new JPanel(new BorderLayout());

        configureControlPanel(wrapper);

        wrapper.setBorder(createEmptyBorder(
            0, // top
            BUTTON_PAINT_SIDE_INSET, // left
            0, // bottom
            BUTTON_PAINT_SIDE_INSET // right
        ));

        wrapper.add(this.createKeepCurrentScreenPanel(), BorderLayout.CENTER);

        return wrapper;
    }

    // 버튼과 같은 흰 배경을 깔면 둘이 한 덩어리로 뭉개져 보여서,
    // 화면 위에 떠 있는 안내 문구와 같은 어두운 둥근 바 위에 올린다.
    private JPanel createKeepCurrentScreenPanel() {
        JPanel panel = new JPanel(new BorderLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();

                g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
                g2.setColor(GUIDE_TEXT_BACKGROUND);
                g2.fillRoundRect(
                    0, // x
                    0, // y
                    this.getWidth(),
                    this.getHeight(),
                    KEEP_CURRENT_SCREEN_ARC, // arcWidth
                    KEEP_CURRENT_SCREEN_ARC // arcHeight
                );

                g2.dispose();

                super.paintComponent(g);
            }
        };

        panel.setOpaque(false);
        panel.setBorder(createEmptyBorder(
            KEEP_CURRENT_SCREEN_PADDING, // top
            KEEP_CURRENT_SCREEN_PADDING * 2, // left
            KEEP_CURRENT_SCREEN_PADDING, // bottom
            KEEP_CURRENT_SCREEN_PADDING * 2 // right
        ));

        panel.add(this.createKeepCurrentScreenCheckBox(), BorderLayout.CENTER);

        return panel;
    }

    // 체크 상태는 공유 captureConfig 와 사용자 설정에 함께 저장해
    // 다음 캡처는 물론 다음 실행에서도 마지막으로 고른 값이 그대로 쓰이게 한다.
    private JCheckBox createKeepCurrentScreenCheckBox() {
        JCheckBox checkBox = new JCheckBox(KEEP_CURRENT_SCREEN_LABEL);

        checkBox.setToolTipText("캡쳐 완료 후 ImageFrame 으로 전환하지 않고 현재 화면을 유지한다");
        checkBox.setSelected(this.captureConfig.isKeepCurrentScreenEnabled());
        checkBox.setOpaque(false);
        checkBox.setForeground(GUIDE_TEXT_COLOR);
        checkBox.setHorizontalAlignment(SwingConstants.CENTER);
        checkBox.addActionListener(e -> this.setKeepCurrentScreenEnabled(checkBox.isSelected()));

        this.keepCurrentScreenCheckBox = checkBox;

        return checkBox;
    }

    private void setKeepCurrentScreenEnabled(boolean enabled) {
        this.captureConfig.setKeepCurrentScreenEnabled(enabled);

        CapturePreferences.setKeepCurrentScreenEnabled(enabled);
    }

    // 모니터마다 패널이 따로 있으므로, 다시 보일 때 공유 설정 값으로 맞춰 준다.
    private void syncKeepCurrentScreenCheckBox() {
        if (this.keepCurrentScreenCheckBox == null) {
            return;
        }

        this.keepCurrentScreenCheckBox.setSelected(this.captureConfig.isKeepCurrentScreenEnabled());
    }

    private JPanel createControlButtonPanel() {
        if (this.captureConfig.isWindowCaptureMode()) {
            JPanel panel = new JPanel(new GridLayout(1, 2));

            this.configureControlPanel(panel);

            JButton captureButton = new JButton("capture");
            captureButton.addActionListener(e -> this.shot(null, false));
            panel.add(captureButton);

            JButton cancelButton = new JButton("cancel");
            cancelButton.addActionListener(e -> this.cancelCapture());
            panel.add(cancelButton);
            return panel;
        }

        // 버튼 9 개를 3 * 3 으로 놓는다.
        JPanel panel = new JPanel(new GridLayout(0, AREA_CONTROL_COLUMN_COUNT));

        this.configureControlPanel(panel);

        for (AreaControlButton areaControlButton : AreaControlButton.values()) {
            JButton button = new JButton(areaControlButton.getLabel());

            button.addActionListener(e -> this.runAreaControlAction(areaControlButton));

            panel.add(button);
        }

        return panel;
    }

    private void runAreaControlAction(AreaControlButton areaControlButton) {
        switch (areaControlButton) {
            case SHOT:
                this.shot(null, false);
                break;
            case SHOT_AND_WRITE:
                this.shot(
                    null, // second
                    false, // isAll
                    false, // autoTrim
                    AutoShotMode.SHOT_AND_WRITE // autoShotMode
                );

                break;
            case SEE:
                this.see();
                break;
            case AUTO:
                this.shot(
                    null, // second
                    false, // isAll
                    true // autoTrim
                );

                break;
            case SELF:
                this.toggleSelf();
                break;
            case RECORD:
                this.record();
                break;
            case DELAY_SHOT:
                this.delayShot(false);
                break;
            case DELAY_SHOT_ALL:
                this.delayShot(true);
                break;
            case CANCEL:
                this.cancelCapture();
                break;
        }
    }

    // capture 는 자기 UI 를 숨기고 시작해서 자기 화면을 보며 영역을 잡을 수 없다.
    // 숨긴 창은 alt(cmd)+tab 목록에도 안 뜨므로 그쪽으로는 되돌릴 방법이 없다.
    // self 를 누르면 항상 위에 떠 있는 반투명 오버레이 뒤로 ImageFrame 을 띄워
    // 자기 UI 를 보면서 영역을 맞출 수 있고, 다시 누르면 숨겨 뒤 화면으로 돌아간다.
    // 켜 둔 채로 shot 을 누르면 보이는 그대로 찍힌다.
    private void toggleSelf() {
        boolean show = !this.imageFrame.isVisible();

        this.imageFrame.setVisible(show);

        if (show) {
            try {
                this.imageFrame.bringCurrentAppToFront();
            } catch (Throwable ignored) {
            }
        }

        // ImageFrame 을 여닫으면 포커스가 옮겨 가므로 오버레이를 다시 앞으로 올려
        // 영역 조절과 컨트롤 패널 클릭이 계속 되게 한다.
        this.imageFrame.getScreenShotFrameList().forEach(f -> f.toFront());

        this.repaint();
    }

    // 오버레이만 걷고 카운트다운에 들어간다. ImageFrame 은 capture 가 숨겨 둔 상태
    // 또는 self 로 불러낸 상태 그대로 둔다.
    private void delayShot(boolean isAll) {
        this.imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));

        this.shot(DELAY_SHOT_SECOND, isAll);
    }

    static void configureControlPanel(JPanel panel) {
        panel.setOpaque(false);
        panel.setBackground(new Color(0, 0, 0, 0));
    }

    // 선택 영역을 유지한 채 see 미리보기로 전환한다.
    private void see() {
        Rectangle selectionRectangle = this.getSelectionRectangle();

        if (selectionRectangle == null) {
            return;
        }

        this.captureConfig.setSeeMode(true);

        this.enterSeePreview(selectionRectangle);
    }

    private void shot(
        Integer second,
        boolean isAll
    ) {
        this.shot(
            second,
            isAll,
            false // autoTrim
        );
    }

    private void shot(
        Integer second,
        boolean isAll,
        boolean autoTrim
    ) {
        this.shot(
            second,
            isAll,
            autoTrim,
            AutoShotMode.NONE // autoShotMode
        );
    }

    // autoShotMode 는 어느 버튼을 누른 셈으로 찍는지를 나타낸다.
    // 컨트롤 패널의 shot / auto 처럼 특별한 뒷처리가 없는 경우에는 NONE 이다.
    private void shot(
        Integer second,
        boolean isAll,
        boolean autoTrim,
        AutoShotMode autoShotMode
    ) {
        // auto 는 여백 자동 잘라내기만 다르고 나머지는 shot 과 같다.
        this.captureConfig.setAutoTrimEnabled(autoTrim);

        // shot and write 는 찍은 뒤 열린 탭에서 write 까지 이어서 한다.
        this.captureConfig.setWriteAfterCaptureEnabled(autoShotMode.isWriteAfterCapture());

        // shot and return 은 찍은 뒤 화면을 유지하지 않고 ImageFrame 으로 돌아간다.
        this.captureConfig.setReturnToImageFrameEnabled(autoShotMode.isReturnToImageFrame());

        Rectangle selectionRectangle = this.getSelectionRectangle();
        if (selectionRectangle == null) {
            return;
        }

        ImageFrame.WindowTarget selectedWindowTarget = this.windowCaptureTarget;

        if (controlPanel != null) {
            this.hideControlPanel(shouldRepaintWhenHidingControlPanel(true));
        }

        // ImageFrame 가시성은 건드리지 않는다. capture 가 숨겨 둔 상태 그대로거나,
        // self 로 불러냈으면 보이는 상태 그대로 찍는다.

        imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));

        stratPoint = null;
        endPoint = null;
        this.windowCapturePreviewRect = null;
        this.windowCaptureTarget = null;
        guideOverlayVisible = false;

        if (!this.captureConfig.isWindowCaptureMode()) {
            selectionRectangle.width++;
            selectionRectangle.height++;
        }

        new Thread(() -> {
            try {
                PointerInfo pointerInfo = MouseInfo.getPointerInfo();
                Point mousePoint = pointerInfo.getLocation();
                int x = (int) mousePoint.getX();
                int y = (int) mousePoint.getY();

                Robot robot = new Robot();

                Thread.sleep(PRE_CAPTURE_HIDE_DELAY_MS);

                if (this.captureConfig.isWindowCaptureMode() && selectedWindowTarget != null) {
                    try {
                        this.imageFrame.bringWindowToFront(selectedWindowTarget);
                        Thread.sleep(WINDOW_FRONT_SETTLE_DELAY_MS);
                    } catch (Throwable ignored) {
                    }
                }

                // esc 로 취소하면 촬영하지 않고 끝낸다. finally 에서 캡처 UI 는 정리된다.
                if (second != null && !this.runCountdown(second)) {
                    return;
                }

                Rectangle captureRectangle;
                if (this.captureConfig.isWindowCaptureMode() && selectedWindowTarget != null) {
                    captureRectangle = new Rectangle(selectedWindowTarget.getRectangle());
                } else {
                    Rectangle display = graphicsDevice.getDefaultConfiguration().getBounds();
                    captureRectangle = new Rectangle(selectionRectangle);
                    captureRectangle.x += display.x;
                    captureRectangle.y += display.y;
                }

                captureConfig.setLastRectangle(new Rectangle(captureRectangle));

                boolean windowCapture = this.captureConfig.isWindowCaptureMode() && selectedWindowTarget != null;

                // delay shot 은 카운트다운 동안 사용자가 커서를 원하는 곳에 맞춰 두므로 마우스를 건드리지 않는다.
                boolean hideMouse = second == null;

                if (isAll) {
                    Rectangle display = graphicsDevice.getDefaultConfiguration().getBounds();

                    capture(
                        robot,
                        display,
                        x,
                        y,
                        this.tabbedPane,
                        captureConfig,
                        false,
                        hideMouse
                    );
                } else {
                    capture(
                        robot,
                        captureRectangle,
                        x,
                        y,
                        this.tabbedPane,
                        captureConfig,
                        windowCapture,
                        hideMouse
                    );
                }
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                guideOverlayVisible = true;

                this.restoreAfterCapture(autoShotMode);
            }
        }).start();
    }

    private void showImageFrame(boolean keepCurrentScreen) {
        imageFrame.showAfterCapture(keepCurrentScreen);
    }

    // and return 이 붙은 단축키만 ImageFrame 으로 올라오고, 나머지 단축키는
    // 보고 있던 화면을 그대로 둔다. 컨트롤 패널 버튼으로 찍은 경우에만
    // keep screen 체크박스를 따른다.
    static boolean shouldKeepCurrentScreen(
        boolean keepCurrentScreenEnabled,
        AutoShotMode autoShotMode
    ) {
        if (autoShotMode.isReturnToImageFrame()) {
            return false;
        }

        if (autoShotMode.isAutoShot()) {
            return true;
        }

        return keepCurrentScreenEnabled;
    }

    // 캡처가 끝나면 어느 경로로 숨겼든 ImageFrame 을 항상 되살린다.
    // keep current screen 이 켜져 있으면 되살리되 앞으로 올리지 않아
    // 방금 캡처한 화면을 그대로 보고 작업을 이어 갈 수 있다.
    // and return 이 붙은 단축키는 돌아오는 것이 목적이므로 체크박스를 건드리지 않고
    // 이번 캡처만 앞으로 올린다.
    private void restoreAfterCapture(AutoShotMode autoShotMode) {
        boolean keepCurrentScreen = shouldKeepCurrentScreen(
            this.captureConfig.isKeepCurrentScreenEnabled(), // keepCurrentScreenEnabled
            autoShotMode
        );

        try {
            SwingUtilities.invokeAndWait(() -> {
                this.showImageFrame(keepCurrentScreen);
                imageFrame.disposeScreenShotFrames();
            });
        } catch (Throwable ignored) {
        }

        if (keepCurrentScreen) {
            // shift+f2 로 시작한 캡처라면 화면을 유지하는 쪽이 원래 쓰던 앱으로 돌아가는 것이다.
            imageFrame.restoreCaptureReturnTarget();

            return;
        }

        imageFrame.clearCaptureReturnTarget();

        try {
            imageFrame.bringCurrentAppToFront();
        } catch (Throwable ignored) {
        }

        SwingUtilities.invokeLater(() -> {
            imageFrame.toFront();
            imageFrame.requestFocus();
        });
    }

    private void record() {
        Rectangle selectionRectangle = this.getSelectionRectangle();

        if (selectionRectangle == null) {
            return;
        }

        if (controlPanel != null) {
            this.hideControlPanel(shouldRepaintWhenHidingControlPanel(true));
        }

        imageFrame.setVisible(false);
        imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));

        stratPoint = null;
        endPoint = null;
        this.windowCapturePreviewRect = null;
        this.windowCaptureTarget = null;
        guideOverlayVisible = false;

        Rectangle display = graphicsDevice.getDefaultConfiguration().getBounds();
        Rectangle captureRectangle = new Rectangle(selectionRectangle);
        captureRectangle.x += display.x;
        captureRectangle.y += display.y;

        imageFrame.startRecording(
            this.graphicsDevice, // graphicsDevice
            captureRectangle // captureRectangle
        );
    }

    // esc 로 취소되면 false 를 반환해 촬영을 건너뛰게 한다.
    private boolean runCountdown(int second) throws Exception {
        CountdownOverlay[] holder = new CountdownOverlay[1];

        this.countdownState.start();

        SwingUtilities.invokeAndWait(() -> {
            holder[0] = new CountdownOverlay(this.graphicsDevice);

            holder[0].setSecond(second);

            holder[0].setVisible(true);
        });

        try {
            for (int remaining = second; remaining >= 1; remaining--) {
                int value = remaining;

                SwingUtilities.invokeLater(() -> holder[0].setSecond(value));

                // esc 를 바로 반영하려고 1초를 잘게 나눠 기다린다.
                for (int elapsed = 0; elapsed < COUNTDOWN_TICK_MS; elapsed += COUNTDOWN_POLL_INTERVAL_MS) {
                    if (this.countdownState.isCancelled()) {
                        return false;
                    }

                    Thread.sleep(COUNTDOWN_POLL_INTERVAL_MS);
                }
            }

            return !this.countdownState.isCancelled();
        } finally {
            this.countdownState.finish();

            SwingUtilities.invokeAndWait(() -> holder[0].dispose());

            Thread.sleep(WINDOW_FRONT_SETTLE_DELAY_MS);
        }
    }

    private void enterSeePreview(Rectangle localRectangle) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
        Rectangle absoluteRectangle = new Rectangle(localRectangle);
        absoluteRectangle.x += displayBounds.x;
        absoluteRectangle.y += displayBounds.y;

        this.hideControlPanel();

        this.seePreview = new SeePreview(
            this.graphicsDevice,
            absoluteRectangle, // rectangle
            () -> this.captureSeePreview(absoluteRectangle), // onCapture
            () -> this.cancelSeePreview() // onCancel
        );

        this.seePreview.show();

        // 반투명 딤 오버레이 창을 없애 선택 영역 내부가 밑의 앱으로 클릭/드래그 통과되도록 한다.
        SwingUtilities.invokeLater(() -> imageFrame.disposeScreenShotFrames());
    }

    private void captureSeePreview(Rectangle absoluteRectangle) {
        SeePreview preview = this.seePreview;

        new Thread(() -> {
            try {
                PointerInfo pointerInfo = MouseInfo.getPointerInfo();
                Point mousePoint = pointerInfo.getLocation();
                int x = (int) mousePoint.getX();
                int y = (int) mousePoint.getY();

                // 캡처 도중 esc 등으로 미리보기가 정리되어도 NPE가 나지 않도록 지역 참조를 쓴다.
                if (preview != null) {
                    SwingUtilities.invokeAndWait(preview::hideWindows);
                }

                Thread.sleep(PRE_CAPTURE_HIDE_DELAY_MS);

                Robot robot = new Robot();

                captureConfig.setLastRectangle(new Rectangle(absoluteRectangle));

                capture(
                    robot,
                    absoluteRectangle, // rectangle
                    x,
                    y,
                    this.tabbedPane,
                    captureConfig, // config
                    false // windowCapture
                );
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                this.finishSeePreview();
            }
        }).start();
    }

    private void finishSeePreview() {
        boolean keepCurrentScreen = this.captureConfig.isKeepCurrentScreenEnabled();

        SwingUtilities.invokeLater(() -> {
            this.disposeSeePreview();

            this.showImageFrame(keepCurrentScreen);

            if (keepCurrentScreen) {
                imageFrame.restoreCaptureReturnTarget();

                return;
            }

            imageFrame.clearCaptureReturnTarget();

            imageFrame.toFront();

            imageFrame.requestFocus();
        });
    }

    private void cancelSeePreview() {
        this.disposeSeePreview();

        boolean returningToPreviousApp = imageFrame.restoreCaptureReturnTarget();

        this.showImageFrame(returningToPreviousApp);

        if (returningToPreviousApp) {
            return;
        }

        imageFrame.toFront();

        imageFrame.requestFocus();
    }

    private void disposeSeePreview() {
        if (this.seePreview != null) {
            this.seePreview.dispose();

            this.seePreview = null;
        }

        this.captureConfig.setSeeMode(false);
    }

    void cancelCapture() {
        this.disposeSeePreview();

        this.hideControlPanel();

        this.resetColorPreviewState();
        this.windowCaptureHoverTimer.stop();
        this.windowCapturePreviewRect = null;
        this.windowCaptureTarget = null;
        this.windowCaptureHoverPoint = null;
        stratPoint = null;
        endPoint = null;
        mousePosition = null;
        guideOverlayVisible = true;
        this.autoTrimKeyDown = false;
        this.captureConfig.setCaptureShortcut(CaptureShortcut.NONE);
        imageFrame.disposeScreenShotFrames();

        // 단축키(shift+f2 ~ shift+f5)로 시작한 캡처를 esc 로 접으면 ImageFrame 으로 가지 않고
        // 단축키를 누르기 직전에 쓰던 앱으로 되돌아간다.
        // 버튼으로 시작한 캡처는 돌아갈 앱이 없으므로 ImageFrame 을 앞으로 불러낸다.
        boolean returningToPreviousApp = imageFrame.restoreCaptureReturnTarget();

        this.showImageFrame(returningToPreviousApp);

        if (returningToPreviousApp) {
            return;
        }

        imageFrame.toFront();

        imageFrame.requestFocus();
    }

    private void startColorPreview(Point point) {
        this.rightButtonPressed = true;
        this.colorPreviewPoint = point;
        this.updateColorPreview(point);
        this.repaint();
    }

    private void updateColorPreview(Point point) {
        this.colorPreviewPoint = point;

        if (point == null || this.baseScreenImage == null) {
            this.colorPreviewColor = null;
            return;
        }

        int x = Math.max(0, Math.min(point.x, this.baseScreenImage.getWidth() - 1));
        int y = Math.max(0, Math.min(point.y, this.baseScreenImage.getHeight() - 1));
        this.colorPreviewColor = new Color(this.baseScreenImage.getRGB(x, y));
    }

    private void commitColorSelection(Point point) {
        this.updateColorPreview(point);
        Color selectedColor = this.colorPreviewColor;

        if (selectedColor != null) {
            imageFrame.setPickedColor(selectedColor);
            imageFrame.savePickedColor(selectedColor, this.toAbsolutePoint(point));
        }

        this.cancelCapture();
    }

    private Point toAbsolutePoint(Point point) {
        if (point == null) {
            return null;
        }

        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
        return new Point(point.x + displayBounds.x, point.y + displayBounds.y);
    }

    private void resetColorPreviewState() {
        this.rightButtonPressed = false;
        this.colorPreviewPoint = null;
        this.colorPreviewColor = null;
    }

    public static void capture(
        Robot robot,
        Rectangle rectangle,
        int x,
        int y,
        ImageTabPanel tabbedPane,
        CaptureConfig config,
        boolean windowCapture
    ) throws IOException {

        capture(
            robot,
            rectangle,
            x,
            y,
            tabbedPane,
            config,
            windowCapture,
            true // hideMouse
        );
    }

    // hideMouse=false 이면 마우스를 전혀 건드리지 않는다.
    // delay shot 처럼 사용자가 카운트다운 동안 커서 위치나 hover 상태를 만들어 두는 경우,
    // 캡처 직전에 커서를 옮기면 그 상태가 그대로 풀려버리기 때문이다.
    public static void capture(
        Robot robot,
        Rectangle rectangle,
        int x,
        int y,
        ImageTabPanel tabbedPane,
        CaptureConfig config,
        boolean windowCapture,
        boolean hideMouse
    ) throws IOException {

        if (hideMouse) {
            // 캡처 전 마우스를 화면 밖으로 이동하여 커서가 캡처되지 않도록 함
            robot.mouseMove(-10000, -10000);

            // 마우스 이동 후 잠시 대기 (화면 갱신 시간)
            try {
                Thread.sleep(MOUSE_HIDE_SETTLE_DELAY_MS);
            } catch (InterruptedException ignored) {
            }
        }

        BufferedImage image = robot.createScreenCapture(rectangle);
        Rectangle capturedRectangle = new Rectangle(rectangle);

        if (config.isAutoTrimEnabled() && !windowCapture) {
            Rectangle trimBounds = trimUniformBorderBounds(image);

            capturedRectangle = toScreenRectangle(rectangle, image, trimBounds);

            image = trimUniformBorder(image);
        }

        Integer captureGridSize = config.getCaptureGridMode().getCaptureGridSize();

        if (captureGridSize != null) {
            Graphics2D g2 = image.createGraphics();

            drawGrid(
                g2,
                image.getWidth(),
                image.getHeight(),
                captureGridSize,
                rectangle.x,
                rectangle.y,
                CAPTURE_GRID_COLOR,
                CAPTURE_GRID_LABEL_COLOR,
                CAPTURE_GRID_LABEL_BACKGROUND
            );

            g2.dispose();
        }

        if (windowCapture) {
            image = applyWindowCaptureFrame(image);
        }

        if (hideMouse) {
            // 캡처 후 마우스를 원래 위치로 복원
            robot.mouseMove(x, y);
        }

        if (config.isImgTagEnabled()) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);

            String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
            String imgTag = "<img src=\"data:image/png;base64," + base64 + "\">";
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(imgTag), null);

            config.setWriteAfterCaptureEnabled(false);

            return;
        }

        String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
        File file = Util.getImageFile(fileName);
        ImageIO.write(image, "png", file);

        try {
            ImageViewPanel.copy(file);
        } catch (Throwable ignored) {
        }

        tabbedPane.addTab(
            fileName, // name
            new Rectangle(capturedRectangle), // captureRectangle
            config, // captureConfig
            windowCapture
        );

        // 한 번 찍을 때만 적용되는 옵션이라, 새 탭이 값을 받아 간 뒤 바로 끈다.
        config.setWriteAfterCaptureEnabled(false);
    }

    // 자른 이미지 영역(이미지 픽셀)을 실제 화면 좌표(논리 좌표)로 변환한다.
    // Retina 등으로 캡처 이미지가 확대되어 있어도 원본 rectangle과의 비율로 보정한다.
    private static Rectangle toScreenRectangle(
        Rectangle rectangle,
        BufferedImage image,
        Rectangle trimBounds
    ) {
        if (image.getWidth() <= 0 || image.getHeight() <= 0) {
            return new Rectangle(rectangle);
        }

        double scaleX = rectangle.width / (double) image.getWidth();
        double scaleY = rectangle.height / (double) image.getHeight();

        int x = rectangle.x + (int) Math.round(trimBounds.x * scaleX);
        int y = rectangle.y + (int) Math.round(trimBounds.y * scaleY);
        int width = (int) Math.round(trimBounds.width * scaleX);
        int height = (int) Math.round(trimBounds.height * scaleY);

        return new Rectangle(x, y, width, height);
    }

    static BufferedImage trimUniformBorder(BufferedImage image) {
        if (image == null || image.getWidth() <= 2 || image.getHeight() <= 2) {
            return image;
        }

        Rectangle bounds = trimUniformBorderBounds(image);

        if (bounds.x == 0
            && bounds.y == 0
            && bounds.width == image.getWidth()
            && bounds.height == image.getHeight()) {
            return image;
        }

        return copySubImage(image, bounds);
    }

    // 잘라낼 영역(이미지 픽셀 좌표)을 계산한다. 잘라낼 여백이 없으면 이미지 전체 영역을 반환한다.
    static Rectangle trimUniformBorderBounds(BufferedImage image) {
        if (image == null || image.getWidth() <= 2 || image.getHeight() <= 2) {
            int width = image == null ? 0 : image.getWidth();
            int height = image == null ? 0 : image.getHeight();

            return new Rectangle(0, 0, width, height);
        }

        int[] backgroundSamples = new int[]{
            image.getRGB(0, 0),
            image.getRGB(image.getWidth() - 1, 0),
            image.getRGB(0, image.getHeight() - 1),
            image.getRGB(image.getWidth() - 1, image.getHeight() - 1)
        };

        int top = 0;
        while (top < image.getHeight() - 1 && !rowContainsForeground(image, top, backgroundSamples)) {
            top++;
        }

        int bottom = image.getHeight() - 1;
        while (bottom > top && !rowContainsForeground(image, bottom, backgroundSamples)) {
            bottom--;
        }

        int left = 0;
        while (left < image.getWidth() - 1 && !columnContainsForeground(image, left, top, bottom, backgroundSamples)) {
            left++;
        }

        int right = image.getWidth() - 1;
        while (right > left && !columnContainsForeground(image, right, top, bottom, backgroundSamples)) {
            right--;
        }

        return new Rectangle(
            left,
            top,
            right - left + 1,
            bottom - top + 1
        );
    }

    private static boolean rowContainsForeground(
        BufferedImage image,
        int y,
        int[] backgroundSamples
    ) {
        int nonBackgroundPixelCount = 0;
        int requiredForegroundPixels = Math.max(1, image.getWidth() / 100);

        for (int x = 0; x < image.getWidth(); x++) {
            if (!matchesBackground(image.getRGB(x, y), backgroundSamples)) {
                nonBackgroundPixelCount++;
                if (nonBackgroundPixelCount >= requiredForegroundPixels) {
                    return true;
                }
            }
        }

        return false;
    }

    private static boolean columnContainsForeground(
        BufferedImage image,
        int x,
        int top,
        int bottom,
        int[] backgroundSamples
    ) {
        int nonBackgroundPixelCount = 0;
        int requiredForegroundPixels = Math.max(1, (bottom - top + 1) / 100);

        for (int y = top; y <= bottom; y++) {
            if (!matchesBackground(image.getRGB(x, y), backgroundSamples)) {
                nonBackgroundPixelCount++;
                if (nonBackgroundPixelCount >= requiredForegroundPixels) {
                    return true;
                }
            }
        }

        return false;
    }

    private static boolean matchesBackground(
        int rgb,
        int[] backgroundSamples
    ) {
        for (int backgroundSample : backgroundSamples) {
            if (colorDistance(rgb, backgroundSample) <= AUTO_TRIM_COLOR_THRESHOLD) {
                return true;
            }
        }

        return false;
    }

    private static BufferedImage copySubImage(
        BufferedImage image,
        Rectangle bounds
    ) {
        BufferedImage subImage = image.getSubimage(bounds.x, bounds.y, bounds.width, bounds.height);
        BufferedImage copiedImage = new BufferedImage(bounds.width, bounds.height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = copiedImage.createGraphics();

        try {
            g2.drawImage(subImage, 0, 0, null);
        } finally {
            g2.dispose();
        }

        return copiedImage;
    }

    private static BufferedImage applyWindowCaptureFrame(BufferedImage capturedImage) {
        int width = capturedImage.getWidth();
        int height = capturedImage.getHeight();
        int paddedWidth = width + WINDOW_CAPTURE_PADDING * 2;
        int paddedHeight = height + WINDOW_CAPTURE_PADDING * 2;

        BufferedImage framed = new BufferedImage(
            paddedWidth,
            paddedHeight,
            BufferedImage.TYPE_INT_ARGB
        );

        Graphics2D g2 = framed.createGraphics();

        try {
            g2.setRenderingHint(
                java.awt.RenderingHints.KEY_ANTIALIASING,
                java.awt.RenderingHints.VALUE_ANTIALIAS_ON
            );
            g2.setColor(WINDOW_CAPTURE_BACKGROUND_COLOR);
            g2.fillRect(0, 0, paddedWidth, paddedHeight);

            WindowCornerRadii cornerRadii = resolveWindowCornerRadii(capturedImage);
            if (cornerRadii.max() > 0) {
                BufferedImage roundedImage = applyRoundedWindowMask(capturedImage, cornerRadii);
                g2.drawImage(roundedImage, WINDOW_CAPTURE_PADDING, WINDOW_CAPTURE_PADDING, null);
            } else {
                g2.drawImage(capturedImage, WINDOW_CAPTURE_PADDING, WINDOW_CAPTURE_PADDING, null);
            }
        } finally {
            g2.dispose();
        }

        return framed;
    }

    private static BufferedImage applyRoundedWindowMask(BufferedImage capturedImage, WindowCornerRadii cornerRadii) {
        int width = capturedImage.getWidth();
        int height = capturedImage.getHeight();
        BufferedImage roundedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        int maxRadius = Math.min(width, height) / 2;
        int topLeftRadius = Math.min(cornerRadii.topLeft, maxRadius);
        int topRightRadius = Math.min(cornerRadii.topRight, maxRadius);
        int bottomLeftRadius = Math.min(cornerRadii.bottomLeft, maxRadius);
        int bottomRightRadius = Math.min(cornerRadii.bottomRight, maxRadius);

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int argb = capturedImage.getRGB(x, y);
                float alphaFactor = resolveCornerAlphaFactor(
                    x,
                    y,
                    width,
                    height,
                    topLeftRadius,
                    topRightRadius,
                    bottomLeftRadius,
                    bottomRightRadius
                );

                if (alphaFactor >= 0.999f) {
                    roundedImage.setRGB(x, y, argb);
                    continue;
                }

                int alpha = (argb >>> 24) & 0xFF;
                int adjustedAlpha = Math.max(0, Math.min(255, Math.round(alpha * alphaFactor)));
                roundedImage.setRGB(x, y, (adjustedAlpha << 24) | (argb & 0x00FFFFFF));
            }
        }

        return roundedImage;
    }

    private static float resolveCornerAlphaFactor(int x,
                                                  int y,
                                                  int width,
                                                  int height,
                                                  int topLeftRadius,
                                                  int topRightRadius,
                                                  int bottomLeftRadius,
                                                  int bottomRightRadius) {
        int radius;
        if (x < topLeftRadius && y < topLeftRadius) {
            radius = topLeftRadius;
        } else if (x >= width - topRightRadius && y < topRightRadius) {
            radius = topRightRadius;
        } else if (x < bottomLeftRadius && y >= height - bottomLeftRadius) {
            radius = bottomLeftRadius;
        } else if (x >= width - bottomRightRadius && y >= height - bottomRightRadius) {
            radius = bottomRightRadius;
        } else {
            return 1.0f;
        }

        boolean left = x < radius;
        boolean right = x >= width - radius;
        boolean top = y < radius;
        boolean bottom = y >= height - radius;

        if ((!left && !right) || (!top && !bottom)) {
            return 1.0f;
        }

        float centerX;
        float centerY;

        if (left && top) {
            centerX = radius;
            centerY = radius;
        } else if (right && top) {
            centerX = width - radius;
            centerY = radius;
        } else if (left) {
            centerX = radius;
            centerY = height - radius;
        } else {
            centerX = width - radius;
            centerY = height - radius;
        }

        int insideSamples = 0;
        int sampleCount = WINDOW_CORNER_ALPHA_SAMPLES * WINDOW_CORNER_ALPHA_SAMPLES;
        float step = 1.0f / WINDOW_CORNER_ALPHA_SAMPLES;
        float radiusSquared = radius * radius;

        for (int sampleY = 0; sampleY < WINDOW_CORNER_ALPHA_SAMPLES; sampleY++) {
            for (int sampleX = 0; sampleX < WINDOW_CORNER_ALPHA_SAMPLES; sampleX++) {
                float px = x + (sampleX + 0.5f) * step;
                float py = y + (sampleY + 0.5f) * step;
                float dx = px - centerX;
                float dy = py - centerY;
                if (dx * dx + dy * dy <= radiusSquared) {
                    insideSamples++;
                }
            }
        }

        return insideSamples / (float) sampleCount;
    }

    private static WindowCornerRadii resolveWindowCornerRadii(BufferedImage capturedImage) {
        int topLeft = clampCornerRadius(detectTopLeftCornerRadius(capturedImage, Math.min(40, Math.min(
            capturedImage.getWidth(),
            capturedImage.getHeight()
        ) / 2)));
        int topRight = clampCornerRadius(detectTopRightCornerRadius(capturedImage, Math.min(40, Math.min(
            capturedImage.getWidth(),
            capturedImage.getHeight()
        ) / 2)));
        int bottomLeft = clampCornerRadius(detectBottomLeftCornerRadius(capturedImage, Math.min(40, Math.min(
            capturedImage.getWidth(),
            capturedImage.getHeight()
        ) / 2)));
        int bottomRight = clampCornerRadius(detectBottomRightCornerRadius(capturedImage, Math.min(40, Math.min(
            capturedImage.getWidth(),
            capturedImage.getHeight()
        ) / 2)));

        if (topLeft == 0 && topRight == 0 && bottomLeft == 0 && bottomRight == 0 && looksLikeRoundedWindow(capturedImage)) {
            int fallback = clampCornerRadius(estimateFallbackCornerRadius(capturedImage));
            return new WindowCornerRadii(fallback, fallback, fallback, fallback);
        }

        int fallback = clampCornerRadius(estimateFallbackCornerRadius(capturedImage));
        if (topLeft == 0 && topRight > 0) {
            topLeft = topRight;
        }
        if (topLeft == 0 && bottomLeft > 0) {
            topLeft = bottomLeft;
        }
        if (topLeft == 0 && bottomRight > 0) {
            topLeft = bottomRight;
        }
        if (topLeft == 0 && looksLikeRoundedWindow(capturedImage)) {
            topLeft = fallback;
        }

        if (topRight == 0) {
            topRight = topLeft > 0 ? topLeft : fallback;
        }
        if (bottomLeft == 0) {
            bottomLeft = topLeft > 0 ? topLeft : fallback;
        }
        if (bottomRight == 0) {
            bottomRight = topLeft > 0 ? topLeft : fallback;
        }

        return new WindowCornerRadii(topLeft, topRight, bottomLeft, bottomRight);
    }

    private static int clampCornerRadius(int radius) {
        if (radius <= 0) {
            return 0;
        }
        return Math.max(WINDOW_CORNER_MIN_RADIUS, Math.min(WINDOW_CORNER_MAX_RADIUS, radius));
    }

    private static int resolveWindowCornerRadius(BufferedImage capturedImage) {
        WindowCornerRadii cornerRadii = resolveWindowCornerRadii(capturedImage);
        if (cornerRadii.max() == 0) {
            return 0;
        }
        return (cornerRadii.topLeft + cornerRadii.topRight + cornerRadii.bottomLeft + cornerRadii.bottomRight) / 4;
    }

    private static boolean looksLikeRoundedWindow(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();

        if (width < WINDOW_CORNER_SAMPLE_SIZE * 4 || height < WINDOW_CORNER_SAMPLE_SIZE * 4) {
            return false;
        }

        int bodyInset = Math.min(Math.min(width - 1, height - 1), 16);
        int bodyReference = image.getRGB(bodyInset, bodyInset);
        int topLeft = image.getRGB(0, 0);
        int topRight = image.getRGB(width - 1, 0);
        int bottomLeft = image.getRGB(0, height - 1);
        int bottomRight = image.getRGB(width - 1, height - 1);

        return colorDistance(topLeft, bodyReference) >= WINDOW_CORNER_COLOR_THRESHOLD
            || colorDistance(topRight, bodyReference) >= WINDOW_CORNER_COLOR_THRESHOLD
            || colorDistance(bottomLeft, bodyReference) >= WINDOW_CORNER_COLOR_THRESHOLD
            || colorDistance(bottomRight, bodyReference) >= WINDOW_CORNER_COLOR_THRESHOLD;
    }

    private static boolean[][] detectWindowOutsideMask(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        boolean[][] outsideMask = new boolean[height][width];

        if (width < WINDOW_CORNER_SAMPLE_SIZE * 4 || height < WINDOW_CORNER_SAMPLE_SIZE * 4) {
            return outsideMask;
        }

        int maxScan = Math.min(40, Math.min(width, height) / 2);
        floodCornerOutsideMask(image, outsideMask, 0, 0, 1, 1, maxScan);
        floodCornerOutsideMask(image, outsideMask, width - 1, 0, -1, 1, maxScan);
        floodCornerOutsideMask(image, outsideMask, 0, height - 1, 1, -1, maxScan);
        floodCornerOutsideMask(image, outsideMask, width - 1, height - 1, -1, -1, maxScan);
        return outsideMask;
    }

    private static void floodCornerOutsideMask(BufferedImage image,
                                               boolean[][] outsideMask,
                                               int startX,
                                               int startY,
                                               int stepX,
                                               int stepY,
                                               int maxScan) {
        int seedColor = image.getRGB(startX, startY);

        boolean[][] visited = new boolean[image.getHeight()][image.getWidth()];
        Deque<Point> queue = new ArrayDeque<Point>();
        queue.add(new Point(startX, startY));

        while (!queue.isEmpty()) {
            Point point = queue.removeFirst();
            int x = point.x;
            int y = point.y;

            if (x < 0 || y < 0 || x >= image.getWidth() || y >= image.getHeight()) {
                continue;
            }
            if (visited[y][x]) {
                continue;
            }
            visited[y][x] = true;

            if (!isInsideCornerScan(startX, startY, x, y, maxScan)) {
                continue;
            }

            int pixel = image.getRGB(x, y);
            if (colorDistance(pixel, seedColor) > WINDOW_CORNER_SEED_THRESHOLD) {
                continue;
            }

            outsideMask[y][x] = true;
            queue.add(new Point(x + stepX, y));
            queue.add(new Point(x, y + stepY));
            queue.add(new Point(x + stepX, y + stepY));
            queue.add(new Point(x - stepX, y));
            queue.add(new Point(x, y - stepY));
        }
    }

    private static boolean isInsideCornerScan(int startX, int startY, int x, int y, int maxScan) {
        return Math.abs(x - startX) < maxScan && Math.abs(y - startY) < maxScan;
    }

    private static int detectCornerRadius(BufferedImage image) {
        WindowCornerRadii cornerRadii = resolveWindowCornerRadii(image);
        if (cornerRadii.max() == 0) {
            return 0;
        }
        return (cornerRadii.topLeft + cornerRadii.topRight + cornerRadii.bottomLeft + cornerRadii.bottomRight) / 4;
    }

    private static int detectTopLeftCornerRadius(BufferedImage image, int maxScan) {
        int bodyInset = Math.min(Math.min(image.getWidth() - 1, image.getHeight() - 1), 16);
        int bodyColor = image.getRGB(bodyInset, bodyInset);
        return resolveDetectedCornerRadius(
            image,
            bodyColor,
            maxScan,
            true,
            true
        );
    }

    private static int detectTopRightCornerRadius(BufferedImage image, int maxScan) {
        int bodyInset = Math.min(Math.min(image.getWidth() - 1, image.getHeight() - 1), 16);
        int bodyColor = image.getRGB(Math.max(0, image.getWidth() - 1 - bodyInset), bodyInset);
        return resolveDetectedCornerRadius(
            image,
            bodyColor,
            maxScan,
            false,
            true
        );
    }

    private static int detectBottomLeftCornerRadius(BufferedImage image, int maxScan) {
        int bodyInset = Math.min(Math.min(image.getWidth() - 1, image.getHeight() - 1), 16);
        int bodyColor = image.getRGB(bodyInset, Math.max(0, image.getHeight() - 1 - bodyInset));
        return resolveDetectedCornerRadius(
            image,
            bodyColor,
            maxScan,
            true,
            false
        );
    }

    private static int detectBottomRightCornerRadius(BufferedImage image, int maxScan) {
        int width = image.getWidth();
        int height = image.getHeight();
        int bodyInset = Math.min(Math.min(width - 1, height - 1), 16);
        int bodyColor = image.getRGB(Math.max(0, width - 1 - bodyInset), Math.max(0, height - 1 - bodyInset));
        return resolveDetectedCornerRadius(
            image,
            bodyColor,
            maxScan,
            false,
            false
        );
    }

    private static int resolveDetectedCornerRadius(BufferedImage image,
                                                   int bodyColor,
                                                   int maxScan,
                                                   boolean fromLeft,
                                                   boolean fromTop) {
        int horizontal = findBodyTransition(image, bodyColor, true, maxScan, fromLeft, fromTop);
        int vertical = findBodyTransition(image, bodyColor, false, maxScan, fromLeft, fromTop);

        if (horizontal >= 3 && vertical >= 3 && Math.abs(horizontal - vertical) <= 8) {
            return (horizontal + vertical) / 2;
        }

        if (horizontal >= 3 && vertical >= 3) {
            return Math.min(horizontal, vertical);
        }

        int detected = Math.max(horizontal, vertical);
        if (detected >= 3) {
            return detected;
        }

        return 0;
    }

    private static int findBodyTransition(BufferedImage image,
                                          int bodyColor,
                                          boolean horizontal,
                                          int maxScan,
                                          boolean fromLeft,
                                          boolean fromTop) {
        if (horizontal) {
            int row0 = fromTop ? 0 : image.getHeight() - 1;
            int row1 = fromTop
                ? Math.min(1, image.getHeight() - 1)
                : Math.max(0, image.getHeight() - 2);

            for (int offset = 0; offset < maxScan; offset++) {
                int x = fromLeft ? offset : image.getWidth() - 1 - offset;
                int distance0 = colorDistance(image.getRGB(x, row0), bodyColor);
                int distance1 = colorDistance(image.getRGB(x, row1), bodyColor);
                if (Math.min(distance0, distance1) < WINDOW_CORNER_SEED_THRESHOLD) {
                    return offset;
                }
            }
            return -1;
        }

        int col0 = fromLeft ? 0 : image.getWidth() - 1;
        int col1 = fromLeft
            ? Math.min(1, image.getWidth() - 1)
            : Math.max(0, image.getWidth() - 2);

        for (int offset = 0; offset < maxScan; offset++) {
            int y = fromTop ? offset : image.getHeight() - 1 - offset;
            int distance0 = colorDistance(image.getRGB(col0, y), bodyColor);
            int distance1 = colorDistance(image.getRGB(col1, y), bodyColor);
            if (Math.min(distance0, distance1) < WINDOW_CORNER_SEED_THRESHOLD) {
                return offset;
            }
        }
        return -1;
    }

    private static int estimateFallbackCornerRadius(BufferedImage image) {
        int shorterSide = Math.min(image.getWidth(), image.getHeight());
        int estimated = Math.max(WINDOW_CORNER_FALLBACK_RADIUS, Math.round(shorterSide * 0.018f));
        return Math.max(WINDOW_CORNER_MIN_RADIUS, Math.min(WINDOW_CORNER_MAX_RADIUS, estimated));
    }

    private static int colorDistance(int argb1, int argb2) {
        int r1 = (argb1 >> 16) & 0xFF;
        int g1 = (argb1 >> 8) & 0xFF;
        int b1 = argb1 & 0xFF;
        int r2 = (argb2 >> 16) & 0xFF;
        int g2 = (argb2 >> 8) & 0xFF;
        int b2 = argb2 & 0xFF;

        return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e)) {
            this.startColorPreview(e.getPoint());
            return;
        }

        if (this.captureConfig.isWindowCaptureMode()) {
            return;
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null) {
            Point clickPoint = e.getPoint();
            stratPoint = clickPoint;
            endPoint = new Point(clickPoint.x + fixedWidth, clickPoint.y + fixedHeight);
            mousePosition = null;
            e.getComponent().repaint();
            this.shot(null, false);
            return;
        }

        // 이미 선택 영역이 있으면 핸들 드래그로 크기를 조절하고, 내부 드래그로 위치를 옮긴다.
        SelectionHandle handle = this.findSelectionHandle(e.getPoint());

        if (handle != SelectionHandle.NONE) {
            this.activeSelectionHandle = handle;
            this.selectionDragStartPoint = e.getPoint();
            this.selectionDragOriginRectangle = this.getRectangle();
            this.hideControlPanel();
            this.repaint();
            return;
        }

        this.clearSelectionDragState();

        this.autoTrimKeyDown = e.isMetaDown();

        // 새 드래그를 시작하면 직전 선택은 사라진다. 그 자리를 지우고 가야
        // 드래그 중에 달라지는 자리만 다시 그려도 잔상이 남지 않는다.
        Rectangle previousDamage = this.getOverlayDamageBounds();

        stratPoint = e.getPoint();
        endPoint = null;

        this.hideControlPanel();

        if (previousDamage != null) {
            this.repaint(previousDamage.x, previousDamage.y, previousDamage.width, previousDamage.height);
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e) && this.rightButtonPressed) {
            this.rightButtonPressed = false;
            this.commitColorSelection(e.getPoint());
            return;
        }

        if (this.captureConfig.isWindowCaptureMode()) {
            return;
        }

        // 핸들 드래그가 끝나면 조절 상태를 풀고, 아래에서 조절된 영역에 컨트롤 패널을 다시 띄운다.
        this.clearSelectionDragState();

        if (stratPoint == null || endPoint == null) {
            return;
        }

        try {
            Rectangle rectangle = this.getRectangle();

            if (this.captureConfig.isSeeMode()) {
                this.enterSeePreview(rectangle);

                return;
            }

            // shift+f3 ~ shift+f6 으로 시작한 캡처는 영역을 다 고른 순간
            // 컨트롤 패널을 띄우지 않고 해당 버튼을 누른 것처럼 바로 찍는다.
            // 드래그를 놓을 때 cmd 를 누르고 있었으면 auto 쪽(여백 자동 잘라내기)으로 찍는다.
            AutoShotMode autoShotMode = this.captureConfig.getAutoShotMode();

            if (autoShotMode.isAutoShot()) {
                this.captureConfig.setAutoShotMode(AutoShotMode.NONE);
                this.captureConfig.setCaptureShortcut(CaptureShortcut.NONE);

                this.shot(
                    null, // second
                    false, // isAll
                    e.isMetaDown(), // autoTrim
                    autoShotMode
                );

                return;
            }

            if (this.controlPanel == null) {
                this.controlPanel = this.createControlPanel();
                this.add(this.controlPanel);
                this.revalidate();
                this.repaint();
            }

            this.syncKeepCurrentScreenCheckBox();

            this.controlPanel.setVisible(true);
            Dimension dimension = controlPanel.getPreferredSize();

            this.controlPanel.setBounds(rectangle.x + (int) ((rectangle.getWidth() - dimension.getWidth()) / 2),
                rectangle.y + (int) ((rectangle.getHeight()  - dimension.getHeight()) / 2),
                (int) dimension.getWidth(),
                (int) dimension.getHeight());
        } catch (Throwable throwable) {
            throw new RuntimeException(throwable);
        }
    }

    @Override
    public void mouseEntered(MouseEvent e) {
        if (this.captureConfig.isWindowCaptureMode()) {
            this.windowCaptureHoverPoint = e.getPoint();
            if (this.windowCapturePreviewRect != null && this.windowCapturePreviewRect.contains(e.getPoint())) {
                this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                this.refreshOverlayImmediately();
            }
            this.windowCaptureHoverTimer.restart();
        }
    }

    @Override
    public void mouseExited(MouseEvent e) {
        if (this.captureConfig.isWindowCaptureMode()) {
            Point localMousePoint = this.getCurrentLocalMousePoint();
            if (this.isInsideActiveWindowCaptureArea(localMousePoint)) {
                this.windowCaptureHoverPoint = localMousePoint;
                this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                this.refreshOverlayImmediately();
                return;
            }

            this.windowCaptureHoverTimer.stop();
            this.windowCaptureHoverPoint = null;
            this.windowCapturePreviewRect = null;
            this.windowCaptureTarget = null;
            this.hideControlPanel();
            this.refreshOverlayImmediately();
        }
    }

    @Override
    public void mouseDragged(MouseEvent e) {
        if (this.rightButtonPressed) {
            this.updateColorPreview(e.getPoint());
            e.getComponent().repaint();
            return;
        }

        if (this.captureConfig.isWindowCaptureMode()) {
            return;
        }

        this.autoTrimKeyDown = e.isMetaDown();

        Rectangle previousDamage = this.getOverlayDamageBounds();

        if (this.activeSelectionHandle != SelectionHandle.NONE) {
            this.updateSelectionByHandle(e.getPoint());
            this.repaintOverlayDamage(previousDamage);
            return;
        }

        endPoint = e.getPoint();
        this.repaintOverlayDamage(previousDamage);
    }

    @Override
    public void mouseMoved(MouseEvent e) {
        if (this.captureConfig.isWindowCaptureMode()) {
            this.windowCaptureHoverPoint = e.getPoint();

            if (this.windowCapturePreviewRect != null && this.windowCapturePreviewRect.contains(e.getPoint())) {
                this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                this.windowCaptureHoverTimer.restart();
                this.refreshOverlayImmediately();
                return;
            }

            this.windowCaptureHoverTimer.restart();
            return;
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null) {
            Rectangle previousDamage = this.getOverlayDamageBounds();
            mousePosition = e.getPoint();
            this.repaintOverlayDamage(previousDamage);
            return;
        }

        Cursor cursor = this.findSelectionHandle(e.getPoint()).getCursor();

        if (this.getCursor() != cursor) {
            this.setCursor(cursor);
        }
    }

    // 선택 영역을 다시 드래그해 조절할 수 있도록 8방향 핸들과 이동 영역을 제공한다.
    private enum SelectionHandle {
        NORTH_WEST(Cursor.NW_RESIZE_CURSOR),
        NORTH(Cursor.N_RESIZE_CURSOR),
        NORTH_EAST(Cursor.NE_RESIZE_CURSOR),
        EAST(Cursor.E_RESIZE_CURSOR),
        SOUTH_EAST(Cursor.SE_RESIZE_CURSOR),
        SOUTH(Cursor.S_RESIZE_CURSOR),
        SOUTH_WEST(Cursor.SW_RESIZE_CURSOR),
        WEST(Cursor.W_RESIZE_CURSOR),
        MOVE(Cursor.MOVE_CURSOR),
        NONE(Cursor.DEFAULT_CURSOR);

        private final int cursorType;

        SelectionHandle(int cursorType) {
            this.cursorType = cursorType;
        }

        private Cursor getCursor() {
            return Cursor.getPredefinedCursor(this.cursorType);
        }

        private boolean isResize() {
            return this != MOVE && this != NONE;
        }
    }

    private void clearSelectionDragState() {
        this.activeSelectionHandle = SelectionHandle.NONE;
        this.selectionDragStartPoint = null;
        this.selectionDragOriginRectangle = null;
    }

    // 안내가 떠 있을 때만 다시 그린다. 캡처 중이 아닌 cmd 입력까지 화면을 건드리게 두지 않는다.
    private void updateAutoTrimKeyDown(boolean autoTrimKeyDown) {
        if (this.autoTrimKeyDown == autoTrimKeyDown) {
            return;
        }

        boolean shouldRepaint = this.captureConfig.getCaptureShortcut().isShortcut() && this.hasSelection();
        // 안내 글이 바뀌면 설명 상자 폭도 달라지므로 바꾸기 전 자리도 같이 지워야 한다.
        Rectangle previousDamage = shouldRepaint ? this.getOverlayDamageBounds() : null;

        this.autoTrimKeyDown = autoTrimKeyDown;

        if (shouldRepaint) {
            this.repaintOverlayDamage(previousDamage);
        }
    }

    private boolean hasSelection() {
        if (this.captureConfig.isWindowCaptureMode()) {
            return false;
        }

        // 고정 크기 모드는 클릭 한 번으로 바로 캡처하므로 조절 대상이 아니다.
        if (this.captureConfig.getFixedWidth() != null && this.captureConfig.getFixedHeight() != null) {
            return false;
        }

        return this.stratPoint != null && this.endPoint != null;
    }

    private SelectionHandle findSelectionHandle(Point point) {
        if (!this.hasSelection()) {
            return SelectionHandle.NONE;
        }

        Rectangle rectangle = this.getRectangle();

        for (SelectionHandle handle : SelectionHandle.values()) {
            if (!handle.isResize()) {
                continue;
            }

            if (this.getSelectionHandleBounds(rectangle, handle, SELECTION_HANDLE_HIT_SIZE).contains(point)) {
                return handle;
            }
        }

        if (shouldMoveSelection(
            rectangle,
            point
        )) {
            return SelectionHandle.MOVE;
        }

        return SelectionHandle.NONE;
    }

    static boolean shouldMoveSelection(
        Rectangle rectangle,
        Point point
    ) {
        return rectangle.contains(point);
    }

    private Rectangle getSelectionHandleBounds(Rectangle rectangle, SelectionHandle handle, int size) {
        Point center = this.getSelectionHandleCenter(rectangle, handle);

        return new Rectangle(center.x - size / 2, center.y - size / 2, size, size);
    }

    private Point getSelectionHandleCenter(Rectangle rectangle, SelectionHandle handle) {
        int left = rectangle.x;
        int centerX = rectangle.x + rectangle.width / 2;
        int right = rectangle.x + rectangle.width;
        int top = rectangle.y;
        int centerY = rectangle.y + rectangle.height / 2;
        int bottom = rectangle.y + rectangle.height;

        switch (handle) {
            case NORTH_WEST:
                return new Point(left, top);
            case NORTH:
                return new Point(centerX, top);
            case NORTH_EAST:
                return new Point(right, top);
            case EAST:
                return new Point(right, centerY);
            case SOUTH_EAST:
                return new Point(right, bottom);
            case SOUTH:
                return new Point(centerX, bottom);
            case SOUTH_WEST:
                return new Point(left, bottom);
            case WEST:
                return new Point(left, centerY);
            default:
                return new Point(centerX, centerY);
        }
    }

    private void updateSelectionByHandle(Point point) {
        if (this.activeSelectionHandle == SelectionHandle.MOVE) {
            this.moveSelection(point);
            return;
        }

        this.resizeSelection(point);
    }

    private void moveSelection(Point point) {
        if (this.selectionDragOriginRectangle == null || this.selectionDragStartPoint == null) {
            return;
        }

        Rectangle movedRectangle = moveSelectionRectangle(
            this.selectionDragOriginRectangle,
            this.selectionDragStartPoint,
            point,
            this.getWidth(), // boundaryWidth
            this.getHeight() // boundaryHeight
        );

        this.applySelectionRectangle(movedRectangle);
    }

    static Rectangle moveSelectionRectangle(
        Rectangle origin,
        Point startPoint,
        Point point,
        int boundaryWidth,
        int boundaryHeight
    ) {
        int x = origin.x + point.x - startPoint.x;
        int y = origin.y + point.y - startPoint.y;

        x = Math.max(0, Math.min(x, boundaryWidth - origin.width));
        y = Math.max(0, Math.min(y, boundaryHeight - origin.height));

        Rectangle movedRectangle = new Rectangle(origin);
        movedRectangle.setLocation(
            x,
            y
        );

        return movedRectangle;
    }

    private void resizeSelection(Point point) {
        Rectangle rectangle = this.getRectangle();

        int left = rectangle.x;
        int top = rectangle.y;
        int right = rectangle.x + rectangle.width;
        int bottom = rectangle.y + rectangle.height;

        int x = Math.max(0, Math.min(point.x, this.getWidth()));
        int y = Math.max(0, Math.min(point.y, this.getHeight()));

        switch (this.activeSelectionHandle) {
            case NORTH_WEST:
                left = Math.min(x, right - SELECTION_MIN_SIZE);
                top = Math.min(y, bottom - SELECTION_MIN_SIZE);
                break;
            case NORTH:
                top = Math.min(y, bottom - SELECTION_MIN_SIZE);
                break;
            case NORTH_EAST:
                right = Math.max(x, left + SELECTION_MIN_SIZE);
                top = Math.min(y, bottom - SELECTION_MIN_SIZE);
                break;
            case EAST:
                right = Math.max(x, left + SELECTION_MIN_SIZE);
                break;
            case SOUTH_EAST:
                right = Math.max(x, left + SELECTION_MIN_SIZE);
                bottom = Math.max(y, top + SELECTION_MIN_SIZE);
                break;
            case SOUTH:
                bottom = Math.max(y, top + SELECTION_MIN_SIZE);
                break;
            case SOUTH_WEST:
                left = Math.min(x, right - SELECTION_MIN_SIZE);
                bottom = Math.max(y, top + SELECTION_MIN_SIZE);
                break;
            case WEST:
                left = Math.min(x, right - SELECTION_MIN_SIZE);
                break;
            default:
                return;
        }

        this.applySelectionRectangle(new Rectangle(left, top, right - left, bottom - top));
    }

    private void applySelectionRectangle(Rectangle rectangle) {
        this.stratPoint = new Point(rectangle.x, rectangle.y);
        this.endPoint = new Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
    }

    private void drawSelectionHandles(Graphics2D g2, Rectangle rectangle) {
        if (!this.hasSelection()) {
            return;
        }

        for (SelectionHandle handle : SelectionHandle.values()) {
            if (!handle.isResize()) {
                continue;
            }

            Rectangle bounds = this.getSelectionHandleBounds(rectangle, handle, SELECTION_HANDLE_SIZE);

            g2.setColor(SELECTION_HANDLE_COLOR);
            g2.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            g2.setColor(SELECTION_HANDLE_BORDER_COLOR);
            g2.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
    }

    public Rectangle getRectangle() {
        return Util.getRectangle(this.stratPoint, this.endPoint);
    }

    // 드래그는 1 초에 수십 번 다시 그린다. 그때마다 화면 전체를 다시 칠하면
    // 투명 창 전체가 다시 합성되면서 번쩍이므로, 실제로 달라지는 자리만 다시 그린다.
    private void repaintOverlayDamage(Rectangle previousDamage) {
        Rectangle damage = this.getOverlayDamageBounds();

        if (damage == null) {
            damage = previousDamage;
        } else if (previousDamage != null) {
            damage = damage.union(previousDamage);
        }

        // 다시 그릴 자리를 모르면 안전하게 전체를 다시 그린다.
        if (damage == null || damage.isEmpty()) {
            this.repaint();
            return;
        }

        this.repaint(damage.x, damage.y, damage.width, damage.height);
    }

    // drawOverlayContents 가 바탕 위에 얹는 것(영역, 핸들, 좌표 안내, 단축키 설명)을 모두 감싼다.
    private Rectangle getOverlayDamageBounds() {
        Rectangle rectangle = this.getOverlayHighlightRectangle();

        if (rectangle == null) {
            return null;
        }

        Rectangle damage = new Rectangle(rectangle);

        // 핸들은 경계 바깥으로 절반 나온다.
        damage.grow(SELECTION_HANDLE_SIZE, SELECTION_HANDLE_SIZE);
        damage.add(this.getSelectionGuideBounds(rectangle));
        damage.add(this.getShortcutHelpBounds(rectangle, this.getFontMetrics(this.getShortcutHelpFont())));
        damage.grow(OVERLAY_DAMAGE_PADDING, OVERLAY_DAMAGE_PADDING);

        return damage.intersection(new Rectangle(0, 0, this.getWidth(), this.getHeight()));
    }

    // drawOverlayContents 와 같은 순서로 골라야 다시 그릴 자리가 어긋나지 않는다.
    private Rectangle getOverlayHighlightRectangle() {
        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null && mousePosition != null) {
            return new Rectangle(mousePosition.x, mousePosition.y, fixedWidth, fixedHeight);
        }

        return this.getSelectionRectangle();
    }

    private Rectangle getSelectionGuideBounds(Rectangle rectangle) {
        FontMetrics metrics = this.getFontMetrics(this.getFont());
        int labelWidth = this.getGuideLabelMaxWidth(rectangle, metrics);
        int labelHeight = metrics.getHeight() + GUIDE_TEXT_PADDING * 2;
        int top = rectangle.y - GUIDE_LABEL_TOP_GAP - metrics.getAscent();
        int bottom = rectangle.y + rectangle.height + GUIDE_LABEL_BOTTOM_GAP - metrics.getAscent() + labelHeight;

        // 좌표 안내는 영역 좌우 끝에 붙되 글자 상자가 영역 바깥으로 더 나갈 수 있다.
        return new Rectangle(
            rectangle.x - labelWidth,
            top,
            rectangle.width + labelWidth * 2,
            bottom - top
        );
    }

    private int getGuideLabelMaxWidth(Rectangle rectangle, FontMetrics metrics) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();

        int left = rectangle.x + displayBounds.x;
        int top = rectangle.y + displayBounds.y;
        int right = rectangle.x + rectangle.width + displayBounds.x;
        int bottom = rectangle.y + rectangle.height + displayBounds.y;

        int textWidth = metrics.stringWidth("(" + left + ", " + top + ")");
        textWidth = Math.max(textWidth, metrics.stringWidth("(" + right + ", " + top + ")"));
        textWidth = Math.max(textWidth, metrics.stringWidth("(" + left + ", " + bottom + ")"));
        textWidth = Math.max(textWidth, metrics.stringWidth("(" + right + ", " + bottom + ")"));
        textWidth = Math.max(textWidth,
            metrics.stringWidth("w: " + rectangle.width + "  h: " + rectangle.height));

        return textWidth + GUIDE_TEXT_PADDING * 2;
    }

    private Font getShortcutHelpFont() {
        return this.getFont().deriveFont(Font.BOLD, SHORTCUT_HELP_FONT_SIZE);
    }

    private Rectangle getSelectionRectangle() {
        if (this.captureConfig.isWindowCaptureMode()) {
            return this.windowCapturePreviewRect == null ? null : new Rectangle(this.windowCapturePreviewRect);
        }

        return (this.stratPoint == null || this.endPoint == null) ? null : this.getRectangle();
    }

    @Override
    public void paint(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        try {
            // 창이 불투명하므로 매 프레임 얼린 화면으로 바탕을 덮는다.
            // 뒤 화면이 비치는 것이 아니라 우리가 깐 그림이라, 다시 그려도
            // macOS 가 뒤 화면과 다시 합성하지 않아 번쩍이지 않는다.
            // 덮어쓰는 그림이 불투명하니 이전 프레임이 남아 누적될 일도 없다.
            if (this.baseScreenDisplayImage != null) {
                g2.drawImage(this.baseScreenDisplayImage, 0, 0, this.getWidth(), this.getHeight(), null);
            }

            g2.setColor(BACKGROUND_COLOR);
            g2.fillRect(0, 0, this.getWidth(), this.getHeight());

            this.drawOverlayContents(g2, true);
        } finally {
            g2.dispose();
        }

        this.paintBorder(g);
        this.paintChildren(g);
    }

    private void drawOverlayContents(Graphics2D g2, boolean includeColorPreview) {
        Integer previewGridSize = captureConfig.getCaptureGridMode().getPreviewGridSize();
        if (guideOverlayVisible && previewGridSize != null) {
            Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
            drawGrid(g2, this.getWidth(), this.getHeight(), previewGridSize, displayBounds.x, displayBounds.y,
                PREVIEW_GRID_COLOR, PREVIEW_GRID_LABEL_COLOR, null);
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null && mousePosition != null) {
            Rectangle rectangle = new Rectangle(mousePosition.x, mousePosition.y, fixedWidth, fixedHeight);
            g2.setColor(new Color(255, 255, 255, 100));
            g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            this.drawSelectionGuides(g2, rectangle);
        } else if (this.captureConfig.isWindowCaptureMode() && this.windowCapturePreviewRect != null) {
            Rectangle rectangle = this.windowCapturePreviewRect;
            g2.setColor(new Color(255, 255, 255, 100));
            this.fillWindowPreviewShape(g2, rectangle);
            this.drawSelectionGuides(g2, rectangle);
        } else if (stratPoint != null && endPoint != null) {
            Rectangle rectangle = this.getRectangle();
            g2.setColor(new Color(255, 255, 255, 100));
            g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            this.drawSelectionGuides(g2, rectangle);
            this.drawSelectionHandles(g2, rectangle);
            this.drawShortcutGuide(g2, rectangle);
        }

        if (includeColorPreview && this.rightButtonPressed && this.colorPreviewPoint != null && this.colorPreviewColor != null) {
            this.drawColorPreview(g2);
        }
    }

    private void fillWindowPreviewShape(Graphics2D g2, Rectangle rectangle) {
        int cornerRadius = this.detectPreviewWindowCornerRadius(rectangle);
        g2.setRenderingHint(
            java.awt.RenderingHints.KEY_ANTIALIASING,
            java.awt.RenderingHints.VALUE_ANTIALIAS_ON
        );

        if (cornerRadius > 0) {
            int diameter = cornerRadius * 2;
            g2.fillRoundRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, diameter, diameter);
            return;
        }

        g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }

    private int detectPreviewWindowCornerRadius(Rectangle rectangle) {
        if (this.baseScreenImage == null || rectangle.width <= 0 || rectangle.height <= 0) {
            return 0;
        }

        Rectangle imageBounds = new Rectangle(0, 0, this.baseScreenImage.getWidth(), this.baseScreenImage.getHeight());
        Rectangle sampleBounds = rectangle.intersection(imageBounds);

        if (sampleBounds.width <= 0 || sampleBounds.height <= 0) {
            return 0;
        }

        BufferedImage capturedImage = this.baseScreenImage.getSubimage(
            sampleBounds.x,
            sampleBounds.y,
            sampleBounds.width,
            sampleBounds.height
        );

        return resolveWindowCornerRadius(capturedImage);
    }

    private static void drawGrid(Graphics2D g2,
                                 int width,
                                 int height,
                                 int gridSize,
                                 int offsetX,
                                 int offsetY,
                                 Color lineColor,
                                 Color labelColor,
                                 Color labelBackgroundColor) {
        Stroke originalStroke = g2.getStroke();
        g2.setStroke(new java.awt.BasicStroke(1f, java.awt.BasicStroke.CAP_BUTT,
            java.awt.BasicStroke.JOIN_BEVEL, 0, new float[]{4f, 4f}, 0));
        g2.setColor(lineColor);

        for (int x = 0; x < width; x += gridSize) {
            g2.drawLine(x, 0, x, height);
        }

        for (int y = 0; y < height; y += gridSize) {
            g2.drawLine(0, y, width, y);
        }

        g2.setStroke(originalStroke);

        drawGridLabels(g2, width, height, gridSize, offsetX, offsetY, labelColor, labelBackgroundColor);
    }

    private static void drawGridLabels(Graphics2D g2,
                                       int width,
                                       int height,
                                       int gridSize,
                                       int offsetX,
                                       int offsetY,
                                       Color labelColor,
                                       Color labelBackgroundColor) {
        Font originalFont = g2.getFont();
        Font gridFont = originalFont.deriveFont(10f);
        g2.setFont(gridFont);
        g2.setColor(labelColor);

        for (int x = 0; x < width; x += GRID_LABEL_INTERVAL) {
            for (int y = 0; y < height; y += GRID_LABEL_INTERVAL) {
                String text = "(" + (x + offsetX) + ", " + (y + offsetY) + ")";
                drawPlainOverlayText(g2, width, height, text, x + 3, y + 12, labelColor, labelBackgroundColor);
            }
        }

        g2.setFont(originalFont);
    }

    private void drawSelectionGuides(Graphics2D g2, Rectangle rectangle) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();

        int left = rectangle.x + displayBounds.x;
        int top = rectangle.y + displayBounds.y;
        int right = rectangle.x + rectangle.width + displayBounds.x;
        int bottom = rectangle.y + rectangle.height + displayBounds.y;

        int topBaselineY = rectangle.y - GUIDE_LABEL_TOP_GAP;
        int bottomBaselineY = rectangle.y + rectangle.height + GUIDE_LABEL_BOTTOM_GAP;

        this.drawGuideLabel(g2, "(" + left + ", " + top + ")",
            rectangle.x + 6, topBaselineY, false);
        this.drawGuideLabel(g2, "(" + right + ", " + top + ")",
            rectangle.x + rectangle.width - 6, topBaselineY, true);
        this.drawGuideLabel(g2, "(" + left + ", " + bottom + ")",
            rectangle.x + 6, bottomBaselineY, false);
        this.drawGuideLabel(g2, "(" + right + ", " + bottom + ")",
            rectangle.x + rectangle.width - 6, bottomBaselineY, true);

        String sizeText = "w: " + rectangle.width + "  h: " + rectangle.height;
        int topCenterX = rectangle.x + rectangle.width / 2;
        this.drawTopCenteredGuideLabel(g2, sizeText, topCenterX, topBaselineY);
    }

    // 영역을 잡는 동안 왼쪽에는 shift+f2 ~ shift+f4 를 모두 펼쳐 두고,
    // 펑션키로 들어온 캡처는 드래그를 놓는 순간 바로 처리되므로
    // 지금 놓으면 무엇이 일어날지를 영역 안에도 적어 준다.
    private void drawShortcutGuide(Graphics2D g2, Rectangle rectangle) {
        CaptureShortcut captureShortcut = this.captureConfig.getCaptureShortcut();

        // 컨트롤 패널이 뜬 뒤에는 "놓으면" 안내가 지나간 이야기이고 버튼과 자리도 겹친다.
        if (captureShortcut.isShortcut() && !this.isControlPanelShowing()) {
            this.drawReleaseActionLabel(g2, rectangle, captureShortcut);
        }

        this.drawShortcutHelp(g2, rectangle, captureShortcut);
    }

    private boolean isControlPanelShowing() {
        return this.controlPanel != null && this.controlPanel.isVisible();
    }

    private void drawReleaseActionLabel(Graphics2D g2, Rectangle rectangle, CaptureShortcut captureShortcut) {
        String text = "놓으면  " + captureShortcut.toReleaseActionLabel(this.autoTrimKeyDown);

        Font originalFont = g2.getFont();
        g2.setFont(originalFont.deriveFont(Font.BOLD, RELEASE_ACTION_FONT_SIZE));

        try {
            FontMetrics metrics = g2.getFontMetrics();
            int boxWidth = metrics.stringWidth(text) + RELEASE_ACTION_PADDING * 2;
            int boxHeight = metrics.getHeight() + RELEASE_ACTION_PADDING * 2;

            // 영역이 글자 상자보다 작으면 안에 끼워 넣어 봐야 영역만 가린다.
            if (rectangle.width < boxWidth || rectangle.height < boxHeight) {
                return;
            }

            int x = rectangle.x + (rectangle.width - boxWidth) / 2;
            int y = rectangle.y + (rectangle.height - boxHeight) / 2;

            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
            g2.setColor(GUIDE_TEXT_BACKGROUND);
            g2.fillRoundRect(x, y, boxWidth, boxHeight, GUIDE_BOX_ARC, GUIDE_BOX_ARC);
            g2.setColor(GUIDE_TEXT_COLOR);
            g2.drawString(text, x + RELEASE_ACTION_PADDING, y + RELEASE_ACTION_PADDING + metrics.getAscent());
        } finally {
            g2.setFont(originalFont);
        }
    }

    // 키 칸과 하는 일 칸을 세로로 맞춘 두 칸짜리 표로 그린다.
    // 지금 캡처를 시작시킨 단축키 줄만 밝게 칠해, 펼쳐 둔 목록 안에서 바로 찾을 수 있게 한다.
    private void drawShortcutHelp(Graphics2D g2, Rectangle rectangle, CaptureShortcut captureShortcut) {
        List<CaptureShortcut> areaShortcutList = CaptureShortcut.getAreaShortcutList();

        Font originalFont = g2.getFont();
        Font detailFont = originalFont.deriveFont(SHORTCUT_HELP_FONT_SIZE);
        Font activeFont = detailFont.deriveFont(Font.BOLD);

        try {
            // 굵은 글씨가 제일 넓으므로 칸 너비는 그 쪽으로 재야 어느 줄이 켜져도 흔들리지 않는다.
            g2.setFont(activeFont);
            FontMetrics metrics = g2.getFontMetrics();
            int lineHeight = metrics.getHeight();
            int keyWidth = this.getShortcutHelpKeyWidth(metrics);
            Rectangle box = this.getShortcutHelpBounds(rectangle, metrics);
            int boxWidth = box.width;
            int boxHeight = box.height;
            int x = box.x;
            int y = box.y;
            int keyX = x + SHORTCUT_HELP_PADDING;
            int actionX = keyX + keyWidth + SHORTCUT_HELP_COLUMN_GAP;

            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
            g2.setColor(GUIDE_TEXT_BACKGROUND);
            g2.fillRoundRect(x, y, boxWidth, boxHeight, GUIDE_BOX_ARC, GUIDE_BOX_ARC);

            int rowY = y + SHORTCUT_HELP_PADDING;

            for (CaptureShortcut areaShortcut : areaShortcutList) {
                boolean active = areaShortcut == captureShortcut;

                if (active) {
                    g2.setColor(SHORTCUT_HELP_ACTIVE_BACKGROUND);
                    g2.fillRoundRect(x + SHORTCUT_HELP_ACTIVE_INSET, rowY,
                        boxWidth - SHORTCUT_HELP_ACTIVE_INSET * 2, lineHeight,
                        GUIDE_BOX_ARC, GUIDE_BOX_ARC);
                }

                g2.setFont(active ? activeFont : detailFont);
                g2.setColor(active ? GUIDE_TEXT_COLOR : SHORTCUT_HELP_DETAIL_COLOR);

                int baselineY = rowY + metrics.getAscent();

                g2.drawString(areaShortcut.getKeyLabel(), keyX, baselineY);
                g2.drawString(areaShortcut.toActionLabel(this.autoTrimKeyDown), actionX, baselineY);

                rowY += lineHeight;
            }

            // 조합키 설명은 단축키 목록과 한 칸 띄워 둔다.
            rowY += SHORTCUT_HELP_SECTION_GAP;

            g2.setFont(detailFont);
            g2.setColor(SHORTCUT_HELP_DETAIL_COLOR);

            for (String[] modifierRow : SHORTCUT_HELP_MODIFIER_ROW_ARRAY) {
                int baselineY = rowY + metrics.getAscent();

                g2.drawString(modifierRow[0], keyX, baselineY);
                g2.drawString(modifierRow[1], actionX, baselineY);

                rowY += lineHeight;
            }
        } finally {
            g2.setFont(originalFont);
        }
    }

    private int getShortcutHelpKeyWidth(FontMetrics metrics) {
        int keyWidth = 0;

        for (CaptureShortcut areaShortcut : CaptureShortcut.getAreaShortcutList()) {
            keyWidth = Math.max(keyWidth, metrics.stringWidth(areaShortcut.getKeyLabel()));
        }

        for (String[] modifierRow : SHORTCUT_HELP_MODIFIER_ROW_ARRAY) {
            keyWidth = Math.max(keyWidth, metrics.stringWidth(modifierRow[0]));
        }

        return keyWidth;
    }

    private int getShortcutHelpActionWidth(FontMetrics metrics) {
        int actionWidth = 0;

        for (CaptureShortcut areaShortcut : CaptureShortcut.getAreaShortcutList()) {
            actionWidth = Math.max(actionWidth,
                metrics.stringWidth(areaShortcut.toActionLabel(this.autoTrimKeyDown)));
        }

        for (String[] modifierRow : SHORTCUT_HELP_MODIFIER_ROW_ARRAY) {
            actionWidth = Math.max(actionWidth, metrics.stringWidth(modifierRow[1]));
        }

        return actionWidth;
    }

    // 그릴 때와 다시 그릴 자리를 잡을 때가 같은 값을 보도록 상자 자리를 한 곳에서 계산한다.
    private Rectangle getShortcutHelpBounds(Rectangle rectangle, FontMetrics metrics) {
        int rowCount = CaptureShortcut.getAreaShortcutList().size() + SHORTCUT_HELP_MODIFIER_ROW_ARRAY.length;
        int boxWidth = this.getShortcutHelpKeyWidth(metrics)
            + SHORTCUT_HELP_COLUMN_GAP
            + this.getShortcutHelpActionWidth(metrics)
            + SHORTCUT_HELP_PADDING * 2;
        int boxHeight = metrics.getHeight() * rowCount + SHORTCUT_HELP_SECTION_GAP + SHORTCUT_HELP_PADDING * 2;

        return new Rectangle(
            toShortcutHelpX(rectangle, boxWidth, SHORTCUT_HELP_GAP, this.getWidth()),
            toShortcutHelpY(rectangle, boxHeight, this.getHeight()),
            boxWidth,
            boxHeight
        );
    }

    // 설명 상자는 선택 영역 왼쪽에 붙인다. 왼쪽이 모자라면 오른쪽으로 넘기고,
    // 양쪽 다 모자라면 화면 안으로만 밀어 넣는다.
    static int toShortcutHelpX(Rectangle rectangle, int boxWidth, int gap, int overlayWidth) {
        int leftX = rectangle.x - gap - boxWidth;

        if (leftX >= 0) {
            return leftX;
        }

        int rightX = rectangle.x + rectangle.width + gap;

        if (rightX + boxWidth <= overlayWidth) {
            return rightX;
        }

        return Math.max(0, overlayWidth - boxWidth);
    }

    // 선택 영역과 눈높이를 맞추되 화면 밖으로는 나가지 않게 한다.
    static int toShortcutHelpY(Rectangle rectangle, int boxHeight, int overlayHeight) {
        int y = rectangle.y + (rectangle.height - boxHeight) / 2;

        return Math.max(0, Math.min(y, overlayHeight - boxHeight));
    }

    private void drawGuideLabel(Graphics2D g2, String text, int anchorX, int baselineY, boolean alignRight) {
        FontMetrics metrics = g2.getFontMetrics();
        int textWidth = metrics.stringWidth(text);
        int textHeight = metrics.getHeight();
        int x = alignRight ? anchorX - textWidth - GUIDE_TEXT_PADDING * 2 : anchorX;
        int y = baselineY - metrics.getAscent();

        x = Math.max(0, Math.min(x, this.getWidth() - textWidth - GUIDE_TEXT_PADDING * 2));
        y = Math.max(0, Math.min(y, this.getHeight() - textHeight - GUIDE_TEXT_PADDING * 2));

        g2.setColor(GUIDE_TEXT_BACKGROUND);
        g2.fillRoundRect(x, y, textWidth + GUIDE_TEXT_PADDING * 2, textHeight + GUIDE_TEXT_PADDING * 2, 8, 8);
        g2.setColor(GUIDE_TEXT_COLOR);
        g2.drawString(text, x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING + metrics.getAscent());
    }

    private void drawTopCenteredGuideLabel(Graphics2D g2, String text, int centerX, int baselineY) {
        FontMetrics metrics = g2.getFontMetrics();
        int textWidth = metrics.stringWidth(text);
        int textHeight = metrics.getHeight();
        int x = centerX - (textWidth + GUIDE_TEXT_PADDING * 2) / 2;
        int y = baselineY - metrics.getAscent();

        x = Math.max(0, Math.min(x, this.getWidth() - textWidth - GUIDE_TEXT_PADDING * 2));
        y = Math.max(0, Math.min(y, this.getHeight() - textHeight - GUIDE_TEXT_PADDING * 2));

        g2.setColor(GUIDE_TEXT_BACKGROUND);
        g2.fillRoundRect(x, y, textWidth + GUIDE_TEXT_PADDING * 2, textHeight + GUIDE_TEXT_PADDING * 2, 8, 8);
        g2.setColor(GUIDE_TEXT_COLOR);
        g2.drawString(text, x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING + metrics.getAscent());
    }

    private static void drawPlainOverlayText(Graphics2D g2,
                                             int width,
                                             int height,
                                             String text,
                                             int x,
                                             int baselineY,
                                             Color textColor,
                                             Color backgroundColor) {
        FontMetrics metrics = g2.getFontMetrics();
        int clampedX = Math.max(0, Math.min(x, width - metrics.stringWidth(text)));
        int clampedBaselineY = Math.max(metrics.getAscent(), Math.min(baselineY, height - metrics.getDescent()));

        if (backgroundColor != null) {
            int boxX = Math.max(0, clampedX - 2);
            int boxY = Math.max(0, clampedBaselineY - metrics.getAscent());
            int boxWidth = Math.min(width - boxX, metrics.stringWidth(text) + 4);
            int boxHeight = Math.min(height - boxY, metrics.getHeight());
            Color originalColor = g2.getColor();
            g2.setColor(backgroundColor);
            g2.fillRoundRect(boxX, boxY, boxWidth, boxHeight, 6, 6);
            g2.setColor(textColor);
            g2.drawString(text, clampedX, clampedBaselineY);
            g2.setColor(originalColor);
            return;
        }

        Color originalColor = g2.getColor();
        g2.setColor(textColor);
        g2.drawString(text, clampedX, clampedBaselineY);
        g2.setColor(originalColor);
    }

    private void drawColorPreview(Graphics2D g2) {
        if (this.colorPreviewColor == null) {
            return;
        }

        String text = "RGB(" + this.colorPreviewColor.getRed()
            + ", " + this.colorPreviewColor.getGreen()
            + ", " + this.colorPreviewColor.getBlue()
            + ") " + String.format("#%02X%02X%02X",
            this.colorPreviewColor.getRed(),
            this.colorPreviewColor.getGreen(),
            this.colorPreviewColor.getBlue());

        FontMetrics metrics = g2.getFontMetrics();
        int textWidth = metrics.stringWidth(text);
        int textHeight = metrics.getHeight();
        int swatchSize = textHeight;
        int boxWidth = textWidth + swatchSize + GUIDE_TEXT_PADDING * 4;
        int boxHeight = textHeight + GUIDE_TEXT_PADDING * 2;
        int preferredRightX = this.colorPreviewPoint.x + 16;
        int preferredLeftX = this.colorPreviewPoint.x - boxWidth - 16;
        int x = preferredRightX + boxWidth <= this.getWidth()
            ? preferredRightX
            : Math.max(0, preferredLeftX);
        int y = Math.max(0, Math.min(this.colorPreviewPoint.y - boxHeight / 2, this.getHeight() - boxHeight));

        g2.setColor(GUIDE_TEXT_BACKGROUND);
        g2.fillRoundRect(x, y, boxWidth, boxHeight, 8, 8);

        if (this.colorPreviewColor != null) {
            g2.setColor(this.colorPreviewColor);
            g2.fillRect(x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING, swatchSize, swatchSize);
            g2.setColor(Color.WHITE);
            g2.drawRect(x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING, swatchSize, swatchSize);
        }

        g2.setColor(GUIDE_TEXT_COLOR);
        int textX = x + swatchSize + GUIDE_TEXT_PADDING * 3;
        int textY = y + GUIDE_TEXT_PADDING + metrics.getAscent();
        g2.drawString(text, textX, textY);
    }

    private void resolveWindowCapturePreview() {
        if (!this.captureConfig.isWindowCaptureMode() || this.windowCaptureHoverPoint == null) {
            return;
        }

        Point localPoint = new Point(this.windowCaptureHoverPoint);
        Point absolutePoint = this.toAbsolutePoint(localPoint);
        int requestId = ++this.windowCaptureRequestId;

        new Thread(() -> {
            try {
                ImageFrame.WindowTarget target = this.imageFrame.getWindowTargetAtPoint(absolutePoint);
                Rectangle localRect = this.toLocalRectangle(target.getRectangle());

                SwingUtilities.invokeLater(() -> {
                    if (requestId != this.windowCaptureRequestId) {
                        return;
                    }

                    this.windowCaptureTarget = target;
                    this.windowCapturePreviewRect = localRect;
                    this.showControlPanelForRectangle(localRect);
                    this.refreshOverlayImmediately();
                });
            } catch (Throwable ignored) {
                SwingUtilities.invokeLater(() -> {
                    if (requestId != this.windowCaptureRequestId) {
                        return;
                    }

                    if (this.isInsideActiveWindowCaptureArea(this.windowCaptureHoverPoint)) {
                        this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                        this.refreshOverlayImmediately();
                        return;
                    }

                    this.windowCaptureTarget = null;
                    this.windowCapturePreviewRect = null;
                    this.hideControlPanel();
                    this.refreshOverlayImmediately();
                });
            }
        }, "window-capture-preview").start();
    }

    private Rectangle toLocalRectangle(Rectangle globalRect) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
        Rectangle localRect = new Rectangle(globalRect);
        localRect.translate(-displayBounds.x, -displayBounds.y);
        return localRect.intersection(new Rectangle(0, 0, this.getWidth(), this.getHeight()));
    }

    private void showControlPanelForRectangle(Rectangle rectangle) {
        if (rectangle.width <= 0 || rectangle.height <= 0) {
            this.hideControlPanel();
            return;
        }

        if (this.controlPanel == null) {
            this.controlPanel = this.createControlPanel();
            this.add(this.controlPanel);
            this.revalidate();
            this.repaint();
        }

        this.syncKeepCurrentScreenCheckBox();

        Rectangle previousBounds = this.controlPanel.getBounds();
        this.controlPanel.setVisible(true);
        Dimension dimension = this.controlPanel.getPreferredSize();
        this.controlPanel.setBounds(
            rectangle.x + (int) ((rectangle.getWidth() - dimension.getWidth()) / 2),
            rectangle.y + (int) ((rectangle.getHeight() - dimension.getHeight()) / 2),
            (int) dimension.getWidth(),
            (int) dimension.getHeight()
        );
        this.controlPanel.repaint();

        if (!previousBounds.isEmpty() && !previousBounds.equals(this.controlPanel.getBounds())) {
            this.repaintExpanded(previousBounds);
        }

        this.repaintExpanded(this.controlPanel.getBounds());
    }

    static boolean shouldRepaintWhenHidingControlPanel(boolean captureStarting) {
        return !captureStarting;
    }

    private void hideControlPanel() {
        this.hideControlPanel(shouldRepaintWhenHidingControlPanel(false));
    }

    private void hideControlPanel(boolean repaintBounds) {
        if (this.controlPanel == null || !this.controlPanel.isVisible()) {
            return;
        }

        Rectangle bounds = this.controlPanel.getBounds();
        this.controlPanel.setVisible(false);

        if (repaintBounds) {
            this.repaintExpanded(bounds);
        }
    }

    private void repaintExpanded(Rectangle bounds) {
        this.repaint(
            bounds.x - CONTROL_PANEL_REPAINT_PADDING,
            bounds.y - CONTROL_PANEL_REPAINT_PADDING,
            bounds.width + CONTROL_PANEL_REPAINT_PADDING * 2,
            bounds.height + CONTROL_PANEL_REPAINT_PADDING * 2
        );
    }

    private Point getCurrentLocalMousePoint() {
        PointerInfo pointerInfo = MouseInfo.getPointerInfo();
        if (pointerInfo == null) {
            return null;
        }

        Point point = new Point(pointerInfo.getLocation());
        SwingUtilities.convertPointFromScreen(point, this);
        return point;
    }

    private boolean isInsideActiveWindowCaptureArea(Point point) {
        if (point == null) {
            return false;
        }

        if (this.windowCapturePreviewRect != null && this.windowCapturePreviewRect.contains(point)) {
            return true;
        }

        return this.controlPanel != null
            && this.controlPanel.isVisible()
            && this.controlPanel.getBounds().contains(point);
    }

    private void refreshOverlayImmediately() {
        if (!this.captureConfig.isWindowCaptureMode()) {
            this.repaint();
            return;
        }

        if (!SwingUtilities.isEventDispatchThread()) {
            SwingUtilities.invokeLater(this::refreshOverlayImmediately);
            return;
        }

        if (!this.isDisplayable() || this.getWidth() <= 0 || this.getHeight() <= 0) {
            this.repaint();
            return;
        }

        this.revalidate();
        this.paintImmediately(0, 0, this.getWidth(), this.getHeight());
        Toolkit.getDefaultToolkit().sync();
    }
}
