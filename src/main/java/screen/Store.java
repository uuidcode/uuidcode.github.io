package screen;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import com.github.uuidcode.util.CoreUtil;

import lombok.Data;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

import static screen.Mode.ARROW;

@Slf4j
@Data(staticConstructor = "of")
@Accessors(chain = true)
public class Store {
    private List<ScreenShotFrame> screenShotFrameList = new ArrayList<>();
    private Mode mode = ARROW;
    private List<BufferedImage> historyList = new ArrayList<>();
    private int historyIndex = -1;
    private static Store store = new Store();

    private Store() {
    }

    public static Store get() {
        return store;
    }

    public void setBufferedImage(File imageFile) {
        try {
            Store.get().setBufferedImage(ImageIO.read(imageFile), imageFile, true);
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }

    public void setBufferedImage(BufferedImage image, File imageFile, boolean addHistory) {
        if (addHistory) {
            BufferedImage history = Util.deepCopy(image);

            for (int i = this.historyIndex + 1; i < historyList.size(); i++) {
                historyList.remove(this.historyIndex + 1);
            }

            historyList.add(history);
            historyIndex++;

            if (historyList.size() > 10) {
                historyList.remove(0);
                historyIndex--;
            }
        }

        try {
            ImageIO.write(image, "png", imageFile);
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }

        if (log.isDebugEnabled()) {
            log.debug(">>> setBufferedImage store: {}", CoreUtil.toJson(Store.get()));
        }
    }

    public BufferedImage getPrevious() {
        if (historyIndex < 1) {
            return null;
        }

        return this.historyList.get(--this.historyIndex);
    }

    public BufferedImage getNext() {
        if (historyIndex == -1) {
            return null;
        }

        if (historyIndex >= historyList.size() - 1) {
            return null;

        }

        return historyList.get(++historyIndex);
    }

    public BufferedImage getBufferedImage() {
        if (historyIndex < 0) {
            return null;
        }

        if (this.historyIndex >= this.historyList.size()) {
            return null;
        }

        return this.historyList.get(this.historyIndex);
    }
}
