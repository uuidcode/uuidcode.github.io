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
    private boolean selfAreaCaptureMode = false;
    private Integer fixedWidth;
    private Integer fixedHeight;
    private Rectangle lastRectangle;
}
