package screen;

import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;

import lombok.Getter;
import lombok.Setter;

import static lombok.AccessLevel.PRIVATE;
import static screen.FillType.TRANSPARENT;

@Getter
public enum ShapeType implements Drawable {
    FILL_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.FILL, colorType);
        }
    },
    DRAW_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.DRAW, colorType);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.FILL, colorType);
        }
    },
    DRAW_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.DRAW, colorType);
        }
    },
    BLUR {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processBlur(bufferedImage, g2, startPoint, endPoint, 50, false);
        }
    },
    BLUR_CLIPPING {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processBlur(bufferedImage, g2, startPoint, endPoint, 50, true);
        }
    },
    CROP {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processRect(g2, startPoint, endPoint, TRANSPARENT, DrawType.FILL, colorType);
        }
    };

    @Setter(PRIVATE)
    private String title;

    static {
        FILL_ARROW.setTitle("화살표");
        DRAW_ARROW.setTitle("외곽 화살표");
        FILL_RECTANGLE.setTitle("사각형");
        DRAW_RECTANGLE.setTitle("외곽 사각형");
        BLUR.setTitle("흐리게");
        BLUR_CLIPPING.setTitle("선택영역외 흐리게");
        CROP.setTitle("자르기");
    }
}
