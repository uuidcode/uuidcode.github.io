package screen;

import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;

public enum ShapeType implements Drawable {
    FILL_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.FILL);
        }
    },
    DRAW_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.DRAW);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.FILL);
        }
    },
    DRAW_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.DRAW);
        }
    },
    ALPHABET {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, ALPHASBET_LIST.get(index % ALPHASBET_LIST.size()));
            index++;
        }
    },
    BLUR {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processBlur(bufferedImage, g2, startPoint,endPoint, 20);
        }
    };

    private static int index = 0;
    private final static List<String> ALPHASBET_LIST = new ArrayList<String>() {{
        this.add("A");
        this.add("B");
        this.add("C");
        this.add("D");
        this.add("E");
        this.add("F");
    }};

    public static void init() {
        index = 0;
    }
}
