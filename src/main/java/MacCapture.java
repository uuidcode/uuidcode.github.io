import javax.imageio.ImageIO;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.event.InputEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class MacCapture {
    private static int index = 1;
    private static Robot robot = null;

    public static void main(String[] args) throws Exception {
        Thread.sleep(1000 * 1);

        robot = new Robot();

        click(700, 60);

        Thread.sleep(1000 * 2);
        capture();

        click(520, 210);
        Thread.sleep(2000);

        click(700, 230);
        Thread.sleep(100);

        for (int i = 0; i < 120; i++) {
            robot.mouseWheel(24);
            Thread.sleep(100);
            capture();
        }
    }

    private static void click(int x, int y) {
        robot.mouseMove(x, y);
        robot.mousePress(InputEvent.BUTTON1_MASK);
        robot.mouseRelease(InputEvent.BUTTON1_MASK);
    }

    private static void capture() throws IOException {
        Rectangle rectangle = new Rectangle(503, 223, 637, 454);
        BufferedImage bufferedImage = robot.createScreenCapture(rectangle);

        String indexValue = String.valueOf(index);
        if (indexValue.length() == 1) {
            indexValue = "0" + indexValue;
        }

        String filename = "result" + indexValue + ".png";
        System.out.println(filename);
        File file = new File(filename);
        ImageIO.write(bufferedImage, "png", file);

        index++;
    }
}
