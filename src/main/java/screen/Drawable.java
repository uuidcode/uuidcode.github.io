package screen;

import java.awt.Graphics;
import java.awt.Point;
import java.awt.image.BufferedImage;

public interface Drawable {
    default void draw(Graphics g, BufferedImage bufferedImage, Point startPoint, Point endPoint) {
        if (bufferedImage == null) {
            this.draw(g, startPoint, endPoint);
        } else {
            this.draw(bufferedImage.getGraphics(), startPoint, endPoint);
        }
    }

    void draw(Graphics g, Point startPoint, Point endPoint);
}
