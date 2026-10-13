package fourier;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Shape;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;
import java.awt.geom.Path2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.function.DoubleUnaryOperator;

import javax.imageio.ImageIO;

import static fourier.DiagramStyle.ARROW_FONT;
import static fourier.DiagramStyle.BLUE_COLOR;
import static fourier.DiagramStyle.BLUE_FILL_COLOR;
import static fourier.DiagramStyle.BODY_FONT;
import static fourier.DiagramStyle.GREEN_COLOR;
import static fourier.DiagramStyle.GREEN_FILL_COLOR;
import static fourier.DiagramStyle.HEAD_FONT;
import static fourier.DiagramStyle.INK_COLOR;
import static fourier.DiagramStyle.LINE_COLOR;
import static fourier.DiagramStyle.MATH_BIG_FONT;
import static fourier.DiagramStyle.MATH_FONT;
import static fourier.DiagramStyle.MUTED_COLOR;
import static fourier.DiagramStyle.NUMBER_FONT;
import static fourier.DiagramStyle.ORANGE_COLOR;
import static fourier.DiagramStyle.ORANGE_FILL_COLOR;
import static fourier.DiagramStyle.OUTLINE_COLOR;
import static fourier.DiagramStyle.PANEL_COLOR;
import static fourier.DiagramStyle.RED_FILL_COLOR;
import static fourier.DiagramStyle.SIGN_FONT;
import static fourier.DiagramStyle.SUBSCRIPT_FONT;
import static fourier.DiagramStyle.TINY_FONT;
import static fourier.DiagramStyle.badge;
import static fourier.DiagramStyle.center;
import static fourier.DiagramStyle.divider;
import static fourier.DiagramStyle.header;
import static fourier.DiagramStyle.open;
import static fourier.DiagramStyle.text;

/**
 * "함수를 벡터로 본다" 를 설명하는 그림 두 장을 그려 PNG 로 떨군다.
 *
 * <p>첫 장은 벡터의 내적에서 출발해 표본 합, 적분으로 넘어가는 3단계이고,
 * 둘째 장은 곱한 넓이가 상쇄되면 두 함수가 수직이라는 내용이다.
 * {@link FourierSeries} 가 왜 sin, cos 축에 정사영을 내릴 수 있는지에 대한 그림 설명이다.
 */
public class InnerProductDiagram {
    public static final int SHEET_WIDTH = DiagramStyle.SHEET_WIDTH;
    public static final int MAIN_HEIGHT = 1000;
    public static final int ORTHOGONAL_HEIGHT = 640;

    public static final String MAIN_FILE_NAME = "inner-product.png";
    public static final String ORTHOGONAL_FILE_NAME = "orthogonal.png";

    private static final String DEFAULT_OUTPUT_DIRECTORY = "src/main/resources/fourier";
    private static final String VECTOR_TAIL = "f  ≈  ( f(t₁),  f(t₂),  … ,  f(t";

    private InnerProductDiagram() {
    }

    public static void main(String[] args) throws IOException {
        String directory = DEFAULT_OUTPUT_DIRECTORY;

        if (args.length > 0) {
            directory = args[0];
        }

        write(new File(directory));

        System.out.println("wrote " + MAIN_FILE_NAME + ", " + ORTHOGONAL_FILE_NAME + " to " + directory);
    }

    /**
     * 그림 두 장을 directory 아래에 PNG 로 쓴다.
     */
    public static void write(File directory) throws IOException {
        if (!directory.isDirectory() && !directory.mkdirs()) {
            throw new IOException("출력 디렉터리를 만들 수 없습니다: " + directory);
        }

        ImageIO.write(
            drawMain(),
            "png",
            new File(directory, MAIN_FILE_NAME)
        );

        ImageIO.write(
            drawOrthogonal(),
            "png",
            new File(directory, ORTHOGONAL_FILE_NAME)
        );
    }

    // ------------------------------------------------------------------ 첫째 장

    public static BufferedImage drawMain() {
        BufferedImage image = new BufferedImage(SHEET_WIDTH, MAIN_HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = open(image);

        try {
            header(
                g2,
                "함수를 벡터로 본다",
                "내적은 \"성분끼리 곱해서 전부 더하기\". 벡터든 함수든 원리는 똑같고, 성분의 개수만 다르다."
            );

            drawVectorStep(g2);
            drawSampleStep(g2);
            drawIntegralStep(g2);
        } finally {
            g2.dispose();
        }

        return image;
    }

    private static void drawVectorStep(Graphics2D g2) {
        double top = 160;

        badge(
            g2,
            "1",
            71,
            top
        );

        text(
            g2,
            "3차원 벡터의 내적",
            HEAD_FONT,
            INK_COLOR,
            100,
            top + 7
        );

        text(
            g2,
            "성분 3개 → 곱 3개 → 더하면 끝.",
            BODY_FONT,
            MUTED_COLOR,
            100,
            top + 34
        );

        double x0 = 470;
        double pitch = 64;
        double size = 50;
        int[] leftList = {3, 1, 2};
        int[] rightList = {1, 2, 2};

        text(
            g2,
            "u",
            MATH_BIG_FONT,
            BLUE_COLOR,
            x0 - 44,
            top - 14
        );

        text(
            g2,
            "v",
            MATH_BIG_FONT,
            ORANGE_COLOR,
            x0 - 44,
            top + 46
        );

        text(
            g2,
            "곱",
            TINY_FONT,
            GREEN_COLOR.darker(),
            x0 - 44,
            top + 108
        );

        for (int index = 0; index < leftList.length; index++) {
            double x = x0 + index * pitch;

            box(
                g2,
                String.valueOf(leftList[index]),
                x,
                top - 40,
                size,
                BLUE_COLOR,
                BLUE_FILL_COLOR
            );

            box(
                g2,
                String.valueOf(rightList[index]),
                x,
                top + 20,
                size,
                ORANGE_COLOR,
                ORANGE_FILL_COLOR
            );

            box(
                g2,
                String.valueOf(leftList[index] * rightList[index]),
                x,
                top + 86,
                size,
                GREEN_COLOR,
                GREEN_FILL_COLOR
            );

            center(
                g2,
                "×",
                SIGN_FONT,
                MUTED_COLOR,
                x + size / 2,
                top + 16
            );

            center(
                g2,
                "=",
                SIGN_FONT,
                MUTED_COLOR,
                x + size / 2,
                top + 82
            );
        }

        double tail = x0 + leftList.length * pitch + 6;

        text(
            g2,
            "3 + 2 + 4  =  9",
            MATH_BIG_FONT,
            GREEN_COLOR.darker(),
            tail,
            top + 120
        );

        center(
            g2,
            "모두 더한다",
            TINY_FONT,
            MUTED_COLOR,
            tail + 62,
            top + 146
        );

        divider(g2, top + 190);
    }

    private static void drawSampleStep(Graphics2D g2) {
        double top = 420;

        badge(
            g2,
            "2",
            71,
            top
        );

        text(
            g2,
            "함수는 \"성분이 아주 많은\" 벡터",
            HEAD_FONT,
            INK_COLOR,
            100,
            top + 7
        );

        text(
            g2,
            "함수를 M군데서 찍으면",
            BODY_FONT,
            MUTED_COLOR,
            100,
            top + 34
        );

        text(
            g2,
            "그냥 M차원 벡터가 된다.",
            BODY_FONT,
            MUTED_COLOR,
            100,
            top + 56
        );

        double px = 430;
        double pw = 650;
        double axis = top + 36;
        double amp = 62;
        int sampleCount = 24;

        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1.2f));
        g2.draw(new Line2D.Double(px, axis, px + pw, axis));

        for (int index = 0; index < sampleCount; index++) {
            double t = 2 * Math.PI * index / sampleCount;
            double x = px + pw * index / (double) sampleCount;
            double y = axis - sampleF(t) * amp;

            g2.setColor(BLUE_FILL_COLOR);
            g2.setStroke(new BasicStroke(7f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
            g2.draw(new Line2D.Double(x, axis, x, y));
            g2.setColor(BLUE_COLOR);
            g2.fill(new Ellipse2D.Double(x - 3.2, y - 3.2, 6.4, 6.4));
        }

        g2.setColor(BLUE_COLOR);
        g2.setStroke(new BasicStroke(2f));

        g2.draw(curveOf(
            px,
            pw,
            axis,
            amp,
            InnerProductDiagram::sampleF
        ));

        text(
            g2,
            "f (t)",
            MATH_FONT,
            BLUE_COLOR,
            px + pw + 10,
            axis - 46
        );

        center(
            g2,
            "0",
            TINY_FONT,
            MUTED_COLOR,
            px,
            axis + 20
        );

        center(
            g2,
            "2π",
            TINY_FONT,
            MUTED_COLOR,
            px + pw,
            axis + 20
        );

        double boxTop = top + 128;
        double boxWidth = 22;
        double boxPitch = 26;

        for (int index = 0; index < sampleCount; index++) {
            RoundRectangle2D.Double rectangle = new RoundRectangle2D.Double(
                px + index * boxPitch,
                boxTop,
                boxWidth,
                26,
                5,
                5
            );

            g2.setColor(BLUE_FILL_COLOR);
            g2.fill(rectangle);
            g2.setColor(BLUE_COLOR);
            g2.setStroke(new BasicStroke(1.1f));
            g2.draw(rectangle);
        }

        text(
            g2,
            VECTOR_TAIL,
            MATH_FONT,
            INK_COLOR,
            px,
            boxTop + 58
        );

        g2.setFont(MATH_FONT);

        double tailWidth = g2.getFontMetrics().stringWidth(VECTOR_TAIL);

        text(
            g2,
            "M",
            SUBSCRIPT_FONT,
            INK_COLOR,
            px + tailWidth,
            boxTop + 62
        );

        text(
            g2,
            ") )",
            MATH_FONT,
            INK_COLOR,
            px + tailWidth + 12,
            boxTop + 58
        );

        text(
            g2,
            "← M차원 벡터",
            BODY_FONT,
            MUTED_COLOR,
            px + tailWidth + 46,
            boxTop + 58
        );

        divider(g2, top + 240);
    }

    private static void drawIntegralStep(Graphics2D g2) {
        double top = 730;

        badge(
            g2,
            "3",
            71,
            top
        );

        text(
            g2,
            "M을 늘리면 합이 적분이 된다",
            HEAD_FONT,
            INK_COLOR,
            100,
            top + 7
        );

        text(
            g2,
            "f(tⱼ)·g(tⱼ) 를 막대로 쌓아",
            BODY_FONT,
            MUTED_COLOR,
            100,
            top + 34
        );

        text(
            g2,
            "더한 것이 곧 넓이다.",
            BODY_FONT,
            MUTED_COLOR,
            100,
            top + 56
        );

        int[] countList = {8, 32, 0};
        String[] captionList = {"M = 8", "M = 32", "M → ∞"};
        double px = 420;
        double pw = 200;
        double gap = 42;

        for (int index = 0; index < countList.length; index++) {
            double x0 = px + index * (pw + gap);

            drawProductPlot(
                g2,
                x0,
                top - 16,
                pw,
                countList[index]
            );

            center(
                g2,
                captionList[index],
                BODY_FONT,
                INK_COLOR,
                x0 + pw / 2,
                top + 100
            );

            if (index < countList.length - 1) {
                text(
                    g2,
                    "→",
                    ARROW_FONT,
                    MUTED_COLOR,
                    x0 + pw + 12,
                    top + 40
                );
            }
        }

        RoundRectangle2D.Double panel = new RoundRectangle2D.Double(
            420,
            top + 124,
            704,
            74,
            14,
            14
        );

        g2.setColor(PANEL_COLOR);
        g2.fill(panel);
        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1.2f));
        g2.draw(panel);

        center(
            g2,
            "⟨ f , g ⟩  =  Σ f(tⱼ) g(tⱼ) Δt      ⟶      ⟨ f , g ⟩  =  ∫ f(t) g(t) dt",
            MATH_FONT,
            INK_COLOR,
            772,
            top + 158
        );

        center(
            g2,
            "성분끼리 곱해서 더하기  —  그걸 연속으로 했을 뿐이다",
            TINY_FONT,
            MUTED_COLOR,
            772,
            top + 182
        );
    }

    /**
     * 두 함수를 곱한 값을 막대 또는 매끄러운 넓이로 그린다. count 가 0 이면 M → ∞ 를 뜻한다.
     */
    private static void drawProductPlot(
        Graphics2D g2,
        double x0,
        double y0,
        double width,
        int count
    ) {
        double axis = y0 + 54;
        double amp = 104;
        DoubleUnaryOperator product = t -> sampleF(t) * sampleG(t);

        if (count == 0) {
            Path2D.Double area = areaOf(
                x0,
                width,
                axis,
                amp,
                product
            );

            fillSignedArea(
                g2,
                area,
                axis,
                x0,
                width
            );

            g2.setColor(OUTLINE_COLOR);
            g2.setStroke(new BasicStroke(1.6f));
            g2.draw(area);
        } else {
            double barWidth = width / count;

            for (int index = 0; index < count; index++) {
                double t = 2 * Math.PI * (index + 0.5) / count;
                double value = product.applyAsDouble(t) * amp;
                Color barColor = RED_FILL_COLOR;

                if (value >= 0) {
                    barColor = GREEN_FILL_COLOR;
                }

                Rectangle2D.Double bar = new Rectangle2D.Double(
                    x0 + index * barWidth,
                    Math.min(axis, axis - value),
                    barWidth,
                    Math.abs(value)
                );

                g2.setColor(barColor);
                g2.fill(bar);
                g2.setColor(OUTLINE_COLOR);
                g2.setStroke(new BasicStroke(0.8f));
                g2.draw(bar);
            }
        }

        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1.2f));
        g2.draw(new Line2D.Double(x0, axis, x0 + width, axis));
    }

    // ------------------------------------------------------------------ 둘째 장

    public static BufferedImage drawOrthogonal() {
        BufferedImage image = new BufferedImage(SHEET_WIDTH, ORTHOGONAL_HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = open(image);

        try {
            header(
                g2,
                "내적이 0이면 \"수직\"",
                "두 함수를 곱한 넓이가 깔끔하게 상쇄되면, 둘은 서로 아무 성분도 공유하지 않는다."
            );

            pairPlot(
                g2,
                80,
                480,
                t -> Math.cos(t),
                t -> Math.cos(t),
                "cos t  ×  cos t",
                "넓이가 전부 +쪽에 남는다",
                "⟨ cos t , cos t ⟩  =  π"
            );

            pairPlot(
                g2,
                640,
                480,
                t -> Math.cos(t),
                t -> Math.cos(2 * t),
                "cos t  ×  cos 2t",
                "+넓이와 −넓이가 정확히 상쇄",
                "⟨ cos t , cos 2t ⟩  =  0"
            );
        } finally {
            g2.dispose();
        }

        return image;
    }

    private static void pairPlot(
        Graphics2D g2,
        double x0,
        double width,
        DoubleUnaryOperator first,
        DoubleUnaryOperator second,
        String title,
        String note,
        String result
    ) {
        double y0 = 160;
        double axis = y0 + 150;
        double amp = 62;

        center(
            g2,
            title,
            HEAD_FONT,
            INK_COLOR,
            x0 + width / 2,
            y0 + 10
        );

        Path2D.Double area = areaOf(
            x0,
            width,
            axis,
            amp,
            t -> first.applyAsDouble(t) * second.applyAsDouble(t)
        );

        fillSignedArea(
            g2,
            area,
            axis,
            x0,
            width
        );

        g2.setColor(OUTLINE_COLOR);
        g2.setStroke(new BasicStroke(1.4f));
        g2.draw(area);

        g2.setColor(BLUE_COLOR);
        g2.setStroke(new BasicStroke(2.2f));

        g2.draw(curveOf(
            x0,
            width,
            axis,
            amp,
            first
        ));

        g2.setColor(ORANGE_COLOR);
        g2.setStroke(new BasicStroke(2.2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_ROUND, 10f, new float[] {7f, 5f}, 0f));

        g2.draw(curveOf(
            x0,
            width,
            axis,
            amp,
            second
        ));

        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1.2f));
        g2.draw(new Line2D.Double(x0, axis, x0 + width, axis));

        center(
            g2,
            "0",
            TINY_FONT,
            MUTED_COLOR,
            x0,
            axis + 20
        );

        center(
            g2,
            "2π",
            TINY_FONT,
            MUTED_COLOR,
            x0 + width,
            axis + 20
        );

        center(
            g2,
            note,
            BODY_FONT,
            MUTED_COLOR,
            x0 + width / 2,
            y0 + 262
        );

        center(
            g2,
            result,
            MATH_BIG_FONT,
            INK_COLOR,
            x0 + width / 2,
            y0 + 306
        );
    }

    // ------------------------------------------------------------------ 공통 도구

    /**
     * 그림에 쓰는 보기용 함수. 낮은 차수 몇 개만 섞어 울퉁불퉁한 곡선을 만든다.
     */
    static double sampleF(double t) {
        return 0.72 * Math.cos(t) + 0.26 * Math.sin(2 * t);
    }

    static double sampleG(double t) {
        return 0.55 * Math.cos(t) + 0.30 * Math.cos(2 * t);
    }

    private static void box(
        Graphics2D g2,
        String label,
        double x,
        double y,
        double size,
        Color strokeColor,
        Color fillColor
    ) {
        RoundRectangle2D.Double rectangle = new RoundRectangle2D.Double(
            x,
            y,
            size,
            size,
            10,
            10
        );

        g2.setColor(fillColor);
        g2.fill(rectangle);
        g2.setColor(strokeColor);
        g2.setStroke(new BasicStroke(1.6f));
        g2.draw(rectangle);

        center(
            g2,
            label,
            NUMBER_FONT,
            strokeColor.darker(),
            x + size / 2,
            y + size / 2 + 8
        );
    }

    private static Path2D.Double curveOf(
        double x0,
        double width,
        double axis,
        double amp,
        DoubleUnaryOperator function
    ) {
        Path2D.Double path = new Path2D.Double();

        for (int index = 0; index <= 400; index++) {
            double t = 2 * Math.PI * index / 400;
            double x = x0 + width * index / 400.0;
            double y = axis - function.applyAsDouble(t) * amp;

            if (index == 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        }

        return path;
    }

    private static Path2D.Double areaOf(
        double x0,
        double width,
        double axis,
        double amp,
        DoubleUnaryOperator function
    ) {
        Path2D.Double area = new Path2D.Double();
        area.moveTo(x0, axis);

        for (int index = 0; index <= 400; index++) {
            double t = 2 * Math.PI * index / 400;
            area.lineTo(x0 + width * index / 400.0, axis - function.applyAsDouble(t) * amp);
        }

        area.lineTo(x0 + width, axis);
        area.closePath();

        return area;
    }

    /**
     * 축 위쪽은 초록, 아래쪽은 분홍으로 칠해 +넓이와 −넓이를 눈으로 구분하게 한다.
     */
    private static void fillSignedArea(
        Graphics2D g2,
        Path2D.Double area,
        double axis,
        double x0,
        double width
    ) {
        Shape previousClip = g2.getClip();

        g2.setClip(new Rectangle2D.Double(x0, axis - 400, width, 400));
        g2.setColor(GREEN_FILL_COLOR);
        g2.fill(area);
        g2.setClip(new Rectangle2D.Double(x0, axis, width, 400));
        g2.setColor(RED_FILL_COLOR);
        g2.fill(area);
        g2.setClip(previousClip);
    }
}
