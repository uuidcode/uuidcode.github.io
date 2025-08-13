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
    N1 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "1");
        }
    },
    N2 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "2");
        }
    },
    N3 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "3");
        }
    },
    N4 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "4");
        }
    },
    N5 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "5");
        }
    },
    N6 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "6");
        }
    },
    A {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "A");
        }
    },
    B {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "B");
        }
    },
    C {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "C");
        }
    },
    D {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "D");
        }
    },
    E {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "E");
        }
    },
    F {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "F");
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
        N1.setTitle("1");
        N2.setTitle("2");
        N3.setTitle("3");
        N4.setTitle("4");
        N5.setTitle("5");
        N6.setTitle("6");
        A.setTitle("A");
        B.setTitle("B");
        C.setTitle("C");
        D.setTitle("D");
        E.setTitle("E");
        F.setTitle("F");
        BLUR.setTitle("흐리게");
        BLUR_CLIPPING.setTitle("선택영역외 흐리게");
        CROP.setTitle("자르기");
    }
}
