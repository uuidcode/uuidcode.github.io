package screen;

// shift + 기능키 단축키 6개. 선언 순서가 그대로 메뉴 순서가 된다.
// 앱 안 디스패처, 전역 핫키 헬퍼, 메뉴바 아이콘이 모두 이 목록을 쓴다.
public enum FunctionShortcut {
    TO_FRONT(
        ImageFrame.TO_FRONT_SHORTCUT_KEY_CODE,
        ImageFrame.TO_FRONT_HOTKEY_NAME,
        "앞으로 가져오기"
    ),
    CAPTURE(
        ImageFrame.CAPTURE_SHORTCUT_KEY_CODE,
        ImageFrame.CAPTURE_HOTKEY_NAME,
        "캡처"
    ),
    SHOT(
        ImageFrame.AUTO_SHOT_SHORTCUT_KEY_CODE,
        ImageFrame.AUTO_SHOT_HOTKEY_NAME,
        "바로 찍기"
    ),
    SHOT_AND_RETURN(
        ImageFrame.AUTO_SHOT_RETURN_SHORTCUT_KEY_CODE,
        ImageFrame.AUTO_SHOT_RETURN_HOTKEY_NAME,
        "바로 찍고 돌아오기"
    ),
    SHOT_AND_WRITE(
        ImageFrame.AUTO_SHOT_WRITE_SHORTCUT_KEY_CODE,
        ImageFrame.AUTO_SHOT_WRITE_HOTKEY_NAME,
        "바로 찍고 write"
    ),
    SHOT_AND_WRITE_AND_RETURN(
        ImageFrame.AUTO_SHOT_WRITE_RETURN_SHORTCUT_KEY_CODE,
        ImageFrame.AUTO_SHOT_WRITE_RETURN_HOTKEY_NAME,
        "바로 찍고 write 후 돌아오기"
    );

    private final int keyCode;
    private final String hotkeyName;
    private final String title;

    FunctionShortcut(
        int keyCode,
        String hotkeyName,
        String title
    ) {
        this.keyCode = keyCode;
        this.hotkeyName = hotkeyName;
        this.title = title;
    }

    public int getKeyCode() {
        return this.keyCode;
    }

    public String getHotkeyName() {
        return this.hotkeyName;
    }

    public String getTitle() {
        return this.title;
    }

    // f1 -> shift+F1
    public String getShortcutText() {
        return "shift+" + this.hotkeyName.toUpperCase();
    }

    // 메뉴에 보여 줄 한 줄
    public String getMenuLabel() {
        return this.getShortcutText() + "  " + this.title;
    }
}
