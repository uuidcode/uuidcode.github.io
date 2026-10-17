package screen;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

// 영역 캡처를 시작시킨 전역 단축키. 버튼으로 시작한 캡처는 NONE 이다.
// 펑션키로 들어온 캡처는 드래그를 놓는 순간 바로 처리되므로,
// 어떤 단축키로 들어왔는지(영역 왼쪽)와 놓으면 무엇이 일어나는지(영역 안)를
// 오버레이에 미리 적어 두는 데 쓴다.
public enum CaptureShortcut {
    NONE(null, null, AutoShotMode.NONE),
    CAPTURE("shift+f2", "capture", AutoShotMode.NONE),
    SHOT("shift+f3", "shot", AutoShotMode.SHOT),
    SHOT_AND_RETURN("shift+f4", "shot and return", AutoShotMode.SHOT_AND_RETURN),
    SHOT_AND_WRITE("shift+f5", "shot and write", AutoShotMode.SHOT_AND_WRITE);

    // 컨트롤 패널을 거치는 단축키는 놓는 순간 버튼이 뜰 뿐이라 누른 버튼이 없다.
    private static final String CONTROL_PANEL_ACTION_LABEL = "버튼 선택";

    // 영역을 드래그해서 쓰는 단축키만, 선언 순서(f2 → f5) 그대로 설명에 올린다.
    // shift+f1 은 영역과 상관없이 창만 앞으로 부르므로 뺀다.
    private static final List<CaptureShortcut> AREA_SHORTCUT_LIST =
        Collections.unmodifiableList(Arrays.asList(CAPTURE, SHOT, SHOT_AND_RETURN, SHOT_AND_WRITE));

    private final String keyLabel;
    private final String actionLabel;
    private final AutoShotMode autoShotMode;

    CaptureShortcut(String keyLabel, String actionLabel, AutoShotMode autoShotMode) {
        this.keyLabel = keyLabel;
        this.actionLabel = actionLabel;
        this.autoShotMode = autoShotMode;
    }

    public static List<CaptureShortcut> getAreaShortcutList() {
        return AREA_SHORTCUT_LIST;
    }

    public AutoShotMode getAutoShotMode() {
        return this.autoShotMode;
    }

    public String getKeyLabel() {
        return this.keyLabel;
    }

    public boolean isShortcut() {
        return this != NONE;
    }

    // 왼쪽 설명에 적는, 이 단축키가 하는 일.
    // cmd 를 누르고 있는 동안에는 여백을 자동으로 잘라내는 auto 쪽 이름으로 바뀐다.
    public String toActionLabel(boolean autoTrim) {
        if (this == NONE) {
            return null;
        }

        String buttonLabel = this.autoShotMode.toButtonLabel(autoTrim);

        return buttonLabel == null ? this.actionLabel : buttonLabel;
    }

    // 영역 안에 적는, 지금 드래그를 놓으면 어느 버튼을 누른 셈이 되는지.
    // 컨트롤 패널을 거치는 단축키는 누른 버튼이 없으므로 버튼이 뜬다고만 알려 준다.
    public String toReleaseActionLabel(boolean autoTrim) {
        if (this == NONE) {
            return null;
        }

        String buttonLabel = this.autoShotMode.toButtonLabel(autoTrim);

        return buttonLabel == null ? CONTROL_PANEL_ACTION_LABEL : buttonLabel;
    }
}
