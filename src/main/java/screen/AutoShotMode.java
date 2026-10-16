package screen;

// shift+f4 / shift+f5 로 시작한 캡처는 영역 드래그가 끝나는 순간
// 컨트롤 패널을 거치지 않고 바로 찍는다. 어느 버튼을 누른 셈으로 칠지 구분한다.
public enum AutoShotMode {
    NONE,
    SHOT,
    SHOT_AND_WRITE;

    public boolean isAutoShot() {
        return this != NONE;
    }

    public boolean isWriteAfterCapture() {
        return this == SHOT_AND_WRITE;
    }
}
