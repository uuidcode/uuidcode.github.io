package screen;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import static screen.Mode.ARROW;

public class Store {
    public static List<ScreenShotFrame> screenShotFrameList = new ArrayList<>();
    public static Mode mode = ARROW;
    public static BufferedImage bufferedImage;
    public static List<BufferedImage> historyList = new ArrayList<>();
    public static int historyIndex = -1;

    public static void setBufferedImage(BufferedImage image, File imageFile) {
        BufferedImage history = Util.deepCopy(image);
        historyList.add(history);

        historyIndex++;

        if (historyList.size() > 10) {
            historyList.remove(0);
            historyIndex--;
        }

        bufferedImage = image;

        try {
            ImageIO.write(bufferedImage, "png", imageFile);
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }

    public BufferedImage getPrevious() {
        if (historyIndex < 1) {
            return null;
        }

        return historyList.get(--historyIndex);
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
}
