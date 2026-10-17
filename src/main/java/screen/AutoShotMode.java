package screen;

// shift+f4 ~ shift+f6 으로 시작한 캡처는 영역 드래그가 끝나는 순간
// 컨트롤 패널을 거치지 않고 어느 버튼을 누른 것처럼 처리할지를 이 값으로 정한다.
// auto 는 여백 자동 잘라내기, write 는 찍은 뒤 레포에 올리는 것까지를 뜻한다.
public enum AutoShotMode {
    NONE(false, false),
    SHOT(false, false),
    SHOT_AND_WRITE(false, true),
    AUTO_AND_WRITE(true, true);

    private final boolean autoTrim;
    private final boolean writeAfterCapture;

    AutoShotMode(boolean autoTrim, boolean writeAfterCapture) {
        this.autoTrim = autoTrim;
        this.writeAfterCapture = writeAfterCapture;
    }

    public boolean isAutoShot() {
        return this != NONE;
    }

    public boolean isAutoTrim() {
        return this.autoTrim;
    }

    public boolean isWriteAfterCapture() {
        return this.writeAfterCapture;
    }
}
