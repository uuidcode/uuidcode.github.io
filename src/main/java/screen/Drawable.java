package screen;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;

public interface Drawable {
    default void draw(Graphics g, FillType fillType, BufferedImage bufferedImage, Point startPoint, Point endPoint) {
        this.draw((Graphics2D) g, fillType, bufferedImage, startPoint, endPoint);
    }

    default void draw(Graphics2D g2, FillType fillType, BufferedImage bufferedImage, Point startPoint, Point endPoint) {
        if (bufferedImage == null) {
            this.draw(g2, fillType, startPoint, endPoint);
        } else {
            this.draw((Graphics2D) bufferedImage.getGraphics(), fillType, startPoint, endPoint);
        }
    }

    void draw(Graphics2D g2, FillType fillType, Point startPoint, Point endPoint);

    default void draw(Graphics g, FillType fillType, Point startPoint, Point endPoint) {
        this.draw((Graphics2D) g, fillType, startPoint, endPoint);
    }
}
