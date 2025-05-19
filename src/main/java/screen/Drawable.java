package screen;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;

public interface Drawable {
    default void draw(Graphics g, FillType fillType, BufferedImage bufferedImage, Point startPoint, Point endPoint, ColorType colorType) {
        this.draw((Graphics2D) g, fillType, bufferedImage, startPoint, endPoint, colorType);
    }

    default void draw(Graphics2D g2, FillType fillType, BufferedImage bufferedImage, Point startPoint, Point endPoint, ColorType colorType) {
        if (bufferedImage == null) {
            this.draw(bufferedImage, g2, fillType, startPoint, endPoint, colorType);
        } else {
            this.draw(bufferedImage, (Graphics2D) bufferedImage.getGraphics(), fillType, startPoint, endPoint, colorType);
        }
    }

    void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType);

    default void draw(BufferedImage bufferedImage, Graphics g, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
        this.draw(bufferedImage, (Graphics2D) g, fillType, startPoint, endPoint, colorType);
    }
}
