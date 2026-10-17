package screen;

// shift+f4 / shift+f5 로 시작한 캡처는 영역 드래그가 끝나는 순간
// 컨트롤 패널을 거치지 않고 어느 버튼을 누른 것처럼 처리할지를 이 값으로 정한다.
// 여백 자동 잘라내기(auto)는 드래그할 때 cmd 를 누르고 있었는지로 갈린다.
public enum AutoShotMode {
    NONE,
    SHOT,
    SHOT_AND_RETURN,
    SHOT_AND_WRITE;

    public boolean isAutoShot() {
        return this != NONE;
    }

    public boolean isWriteAfterCapture() {
        return this == SHOT_AND_WRITE;
    }

    // 찍은 뒤 화면을 유지하지 않고 ImageFrame 을 앞으로 불러낼지.
    public boolean isReturnToImageFrame() {
        return this == SHOT_AND_RETURN;
    }

    // 드래그를 놓는 순간 눌린 셈이 되는 컨트롤 패널 버튼 이름.
    // cmd 를 누른 채로 놓으면 여백을 자동으로 잘라내는 auto 쪽 버튼이 된다.
    public String toButtonLabel(boolean autoTrim) {
        if (this == NONE) {
            return null;
        }

        if (this == SHOT_AND_WRITE) {
            return autoTrim ? "auto and write" : "shot and write";
        }

        if (this == SHOT_AND_RETURN) {
            return autoTrim ? "auto and return" : "shot and return";
        }

        return autoTrim ? "auto" : "shot";
    }
}
