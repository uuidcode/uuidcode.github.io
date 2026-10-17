package screen;

import java.awt.Rectangle;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class CaptureConfig {
    private CaptureGridMode captureGridMode = CaptureGridMode.NONE_NONE;
    private boolean imgTagEnabled = false;
    private boolean autoTrimEnabled = false;
    private boolean windowCaptureMode = false;
    private boolean seeMode = false;
    private boolean keepCurrentScreenEnabled = CapturePreferences.isKeepCurrentScreenEnabled();
    // shot and write 로 찍은 캡처는 탭이 열리자마자 write 까지 자동으로 이어 간다.
    private boolean writeAfterCaptureEnabled = false;
    // shot and return 으로 찍은 캡처는 keep screen 설정과 무관하게 ImageFrame 을 앞으로 불러낸다.
    private boolean returnToImageFrameEnabled = false;
    private AutoShotMode autoShotMode = AutoShotMode.NONE;
    // 펑션키로 들어온 캡처만 오버레이에 단축키 설명을 띄운다. 버튼으로 시작하면 NONE 이다.
    private CaptureShortcut captureShortcut = CaptureShortcut.NONE;
    private Integer fixedWidth;
    private Integer fixedHeight;
    private Rectangle lastRectangle;

    public CaptureConfig copy() {
        return new CaptureConfig()
            .setCaptureGridMode(this.captureGridMode)
            .setImgTagEnabled(this.imgTagEnabled)
            .setAutoTrimEnabled(this.autoTrimEnabled)
            .setWindowCaptureMode(this.windowCaptureMode)
            .setSeeMode(this.seeMode)
            .setKeepCurrentScreenEnabled(this.keepCurrentScreenEnabled)
            .setWriteAfterCaptureEnabled(this.writeAfterCaptureEnabled)
            .setReturnToImageFrameEnabled(this.returnToImageFrameEnabled)
            .setAutoShotMode(this.autoShotMode)
            .setCaptureShortcut(this.captureShortcut)
            .setFixedWidth(this.fixedWidth)
            .setFixedHeight(this.fixedHeight)
            .setLastRectangle(this.lastRectangle == null ? null : new Rectangle(this.lastRectangle));
    }
}
