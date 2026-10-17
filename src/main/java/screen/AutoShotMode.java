package screen;

// shift+f4 / shift+f5 로 시작한 캡처는 영역 드래그가 끝나는 순간
// 컨트롤 패널을 거치지 않고 auto 버튼(여백 자동 잘라내기)을 누른 것처럼 바로 찍는다.
// f4 는 거기에 write 까지 이어 간다.
public enum AutoShotMode {
    NONE,
    AUTO,
    AUTO_AND_WRITE;

    public boolean isAutoShot() {
        return this != NONE;
    }

    public boolean isWriteAfterCapture() {
        return this == AUTO_AND_WRITE;
    }
}
