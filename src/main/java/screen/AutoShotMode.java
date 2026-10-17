package screen;

// shift+f4 / shift+f5 로 시작한 캡처는 영역 드래그가 끝나는 순간
// 컨트롤 패널을 거치지 않고 어느 버튼을 누른 것처럼 처리할지를 이 값으로 정한다.
// 여백 자동 잘라내기(auto)는 드래그할 때 cmd 를 누르고 있었는지로 갈린다.
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
