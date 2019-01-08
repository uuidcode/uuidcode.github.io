import javax.imageio.ImageIO;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;

public class MergeImage {
    public static void main(String[] args) throws Exception {
        int index = 103;
        BufferedImage bufferedImage = new BufferedImage(637, 454 * index, BufferedImage.TYPE_INT_RGB);
        Graphics g = bufferedImage.getGraphics();

        for (int i = 0; i < index; i++) {
            String indexValue = String.valueOf(i + 1);
            if (indexValue.length() == 1) {
                indexValue = "0" + indexValue;
            }

            String filename = "result" + indexValue + ".png";
            BufferedImage currentBufferedImage = ImageIO.read(new File(filename));
            g.drawImage(currentBufferedImage, 0, 454 * i, null);

            System.out.println(i);
        }
        ImageIO.write(bufferedImage, "png", new File("result.png"));
    }
}
