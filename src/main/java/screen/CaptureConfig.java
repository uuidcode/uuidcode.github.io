package screen;

import java.awt.Rectangle;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class CaptureConfig {
    private boolean borderEnabled = true;
    private boolean imgTagEnabled = false;
    private Integer fixedWidth;
    private Integer fixedHeight;
    private Rectangle lastRectangle;
}
