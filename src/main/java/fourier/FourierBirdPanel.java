package fourier;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.Stroke;
import java.awt.geom.AffineTransform;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;
import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.util.List;

import javax.swing.JPanel;
import javax.swing.Timer;

/**
 * 벌새 외곽선을 두 개의 푸리에 급수로 그려내는 화면.
 *
 * <p>위쪽 청록색 사슬이 x 좌표를, 왼쪽 금색 사슬이 y 좌표를 만들고
 * 두 점선 안내선이 만나는 자리에 펜이 놓인다. 그림 아래 숫자는 각 좌표에 남겨 둔 최고 차수다.
 */
public class FourierBirdPanel extends JPanel {
    private static final int DESIGN_WIDTH = 720;
    private static final int DESIGN_HEIGHT = 900;

    private static final double BIRD_HEIGHT = 300;
    private static final double ORIGIN_X = 415;
    private static final double ORIGIN_Y = 528;
    private static final double X_CHAIN_Y = 205;
    private static final double Y_CHAIN_X = 170;
    private static final double FORMULA_X = 48;
    private static final double FORMULA_FIRST_Y = 262;
    private static final double FORMULA_SECOND_Y = 352;
    private static final double NUMBER_CENTER_X = 455;
    private static final double NUMBER_BASELINE_Y = 772;

    private static final int FRAME_DELAY = 16;
    private static final int TRACE_RESOLUTION = 1600;
    private static final int[] HARMONIC_SCHEDULE = {
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        12, 14, 17, 20, 24, 30, 40, 55, 75, 100
    };

    private static final Color BACKGROUND_COLOR = new Color(8, 18, 15);
    private static final Color GHOST_COLOR = new Color(58, 41, 35);
    private static final Color TRACE_FILL_COLOR = new Color(166, 70, 44, 185);
    private static final Color TRACE_LINE_COLOR = new Color(246, 124, 92);
    private static final Color X_CHAIN_COLOR = new Color(143, 216, 206);
    private static final Color Y_CHAIN_COLOR = new Color(232, 184, 75);
    private static final Color GUIDE_COLOR = new Color(196, 196, 190, 150);
    private static final Color NUMBER_COLOR = new Color(226, 106, 72);

    private static final Font MAIN_FONT = new Font("Serif", Font.ITALIC, 27);
    private static final Font SMALL_FONT = new Font("Serif", Font.PLAIN, 15);
    private static final Font SIGMA_FONT = new Font("Serif", Font.PLAIN, 42);
    private static final Font NUMBER_FONT = new Font("Serif", Font.PLAIN, 58);

    private static final String SIGMA = "∑";
    private static final String UPPER_LIMIT = "N";
    private static final String LOWER_LIMIT = "k = 1";

    private final FourierBirdModel model;
    private final double scale;
    private final Timer timer;

    private List<Point2D.Double> approximationPointList;
    private double maxErrorRatio;
    private int harmonicCount = 1;
    private int scheduleIndex = 0;
    private double progress = 0;
    private double lapSeconds = 4;
    private boolean autoAdvance = true;
    private Runnable stateListener;

    public FourierBirdPanel(FourierBirdModel model) {
        this.model = model;
        this.scale = BIRD_HEIGHT / model.getBounds().height;
        this.timer = new Timer(FRAME_DELAY, event -> onTick());

        this.setBackground(BACKGROUND_COLOR);
        this.setPreferredSize(new Dimension(DESIGN_WIDTH, DESIGN_HEIGHT));
        this.setHarmonicCount(HARMONIC_SCHEDULE[0]);
    }

    public void start() {
        this.timer.start();
    }

    public void setPlaying(boolean playing) {
        if (playing) {
            this.timer.start();
        } else {
            this.timer.stop();
        }
    }

    public boolean isPlaying() {
        return this.timer.isRunning();
    }

    public void reset() {
        this.progress = 0;
        this.scheduleIndex = 0;
        this.setHarmonicCount(HARMONIC_SCHEDULE[0]);
    }

    public void setAutoAdvance(boolean autoAdvance) {
        this.autoAdvance = autoAdvance;
    }

    public boolean isAutoAdvance() {
        return this.autoAdvance;
    }

    public void setLapSeconds(double lapSeconds) {
        this.lapSeconds = Math.max(0.2, lapSeconds);
    }

    public void setHarmonicCount(int harmonicCount) {
        int limited = Math.max(1, Math.min(harmonicCount, this.model.getMaxHarmonic()));

        if (this.approximationPointList != null && limited == this.harmonicCount) {
            return;
        }

        this.harmonicCount = limited;

        this.approximationPointList = this.model.approximationPointList(
            limited,
            TRACE_RESOLUTION
        );

        this.maxErrorRatio = this.model.maxErrorRatio(limited);

        this.repaint();
    }

    public int getHarmonicCount() {
        return this.harmonicCount;
    }

    public double getMaxErrorRatio() {
        return this.maxErrorRatio;
    }

    public double getProgress() {
        return this.progress;
    }

    /**
     * 한 바퀴 안에서의 진행도를 0 에서 1 사이로 직접 지정한다.
     */
    public void setProgress(double progress) {
        this.progress = Math.max(0, Math.min(progress, 1));

        this.repaint();
    }

    public FourierBirdModel getModel() {
        return this.model;
    }

    public void setStateListener(Runnable stateListener) {
        this.stateListener = stateListener;
    }

    private void onTick() {
        this.progress += FRAME_DELAY / (this.lapSeconds * 1000);

        if (this.progress >= 1) {
            this.progress -= 1;

            if (this.autoAdvance) {
                this.scheduleIndex = (this.scheduleIndex + 1) % HARMONIC_SCHEDULE.length;
                this.setHarmonicCount(HARMONIC_SCHEDULE[this.scheduleIndex]);
            }
        }

        this.repaint();

        if (this.stateListener != null) {
            this.stateListener.run();
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        Graphics2D g2 = (Graphics2D) g.create();

        try {
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
            g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
            g2.setColor(BACKGROUND_COLOR);
            g2.fillRect(0, 0, this.getWidth(), this.getHeight());

            double viewScale = Math.min(this.getWidth() / (double) DESIGN_WIDTH, this.getHeight() / (double) DESIGN_HEIGHT);
            g2.translate((this.getWidth() - DESIGN_WIDTH * viewScale) / 2, (this.getHeight() - DESIGN_HEIGHT * viewScale) / 2);
            g2.scale(viewScale, viewScale);

            this.drawScene(g2);
        } finally {
            g2.dispose();
        }
    }

    /**
     * 기준 좌표 720 x 900 공간에 한 장면을 그린다. 테스트에서 오프스크린 렌더링에도 쓴다.
     */
    public void drawScene(Graphics2D g2) {
        double t = 2 * Math.PI * this.progress;

        this.drawGhost(g2);
        this.drawTrace(g2);

        Point2D.Double xPen = this.drawChain(
            g2,
            this.model.getSeriesX(),
            ORIGIN_X,
            X_CHAIN_Y,
            t,
            false,
            X_CHAIN_COLOR
        );

        Point2D.Double yPen = this.drawChain(
            g2,
            this.model.getSeriesY(),
            Y_CHAIN_X,
            ORIGIN_Y,
            t,
            true,
            Y_CHAIN_COLOR
        );

        this.drawGuides(g2, xPen, yPen);
        this.drawFormulaList(g2);
        this.drawHarmonicNumber(g2);
    }

    private void drawGhost(Graphics2D g2) {
        AffineTransform transform = new AffineTransform();
        transform.translate(ORIGIN_X, ORIGIN_Y);
        transform.scale(this.scale, this.scale);
        transform.translate(-this.model.getSeriesX().getMean(), -this.model.getSeriesY().getMean());

        Shape shape = transform.createTransformedShape(this.model.getOutlinePath());

        g2.setColor(GHOST_COLOR);
        g2.fill(shape);
    }

    private void drawTrace(Graphics2D g2) {
        int total = this.approximationPointList.size();
        int drawCount = (int) Math.round(this.progress * (total - 1)) + 1;

        if (drawCount < 2) {
            return;
        }

        Path2D.Double path = new Path2D.Double();

        for (int index = 0; index < drawCount; index++) {
            Point2D.Double point = this.toDesign(this.approximationPointList.get(index));

            if (index == 0) {
                path.moveTo(point.x, point.y);
            } else {
                path.lineTo(point.x, point.y);
            }
        }

        g2.setColor(TRACE_FILL_COLOR);
        g2.fill(path);
        g2.setColor(TRACE_LINE_COLOR);
        g2.setStroke(new BasicStroke(2.4f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.draw(path);
    }

    private Point2D.Double drawChain(
        Graphics2D g2,
        FourierSeries series,
        double anchorX,
        double anchorY,
        double t,
        boolean vertical,
        Color color
    ) {
        List<Harmonic> harmonicList = series.getHarmonicList();
        int limit = Math.min(this.harmonicCount, harmonicList.size());
        double currentX = anchorX;
        double currentY = anchorY;

        g2.setColor(color);
        g2.setStroke(new BasicStroke(1.1f));

        for (int index = 0; index < limit; index++) {
            Harmonic harmonic = harmonicList.get(index);
            double radius = harmonic.getAmplitude() * this.scale;
            double angle = harmonic.getOrder() * t - harmonic.getPhase();
            double stepX = radius * Math.cos(angle);
            double stepY = radius * Math.sin(angle);

            if (vertical) {
                stepX = radius * Math.sin(angle);
                stepY = radius * Math.cos(angle);
            }

            if (radius > 0.8) {
                Ellipse2D.Double circle = new Ellipse2D.Double(
                    currentX - radius,
                    currentY - radius,
                    radius * 2,
                    radius * 2
                );

                g2.draw(circle);

                Line2D.Double spoke = new Line2D.Double(
                    currentX,
                    currentY,
                    currentX + stepX,
                    currentY + stepY
                );

                g2.draw(spoke);
            }

            currentX += stepX;
            currentY += stepY;
        }

        return new Point2D.Double(
            currentX,
            currentY
        );
    }

    private void drawGuides(
        Graphics2D g2,
        Point2D.Double xPen,
        Point2D.Double yPen
    ) {
        Stroke dashed = new BasicStroke(
            1.3f,
            BasicStroke.CAP_BUTT,
            BasicStroke.JOIN_MITER,
            10f,
            new float[] {10f, 10f},
            0f
        );

        g2.setStroke(dashed);
        g2.setColor(GUIDE_COLOR);
        g2.draw(new Line2D.Double(xPen.x, xPen.y, xPen.x, yPen.y));
        g2.draw(new Line2D.Double(yPen.x, yPen.y, xPen.x, yPen.y));

        double penRadius = 4.5;

        Ellipse2D.Double pen = new Ellipse2D.Double(
            xPen.x - penRadius,
            yPen.y - penRadius,
            penRadius * 2,
            penRadius * 2
        );

        g2.setColor(TRACE_LINE_COLOR);
        g2.fill(pen);
    }

    private void drawFormulaList(Graphics2D g2) {
        this.drawFormula(
            g2,
            "x",
            "a",
            "b",
            FORMULA_FIRST_Y,
            X_CHAIN_COLOR
        );

        this.drawFormula(
            g2,
            "y",
            "c",
            "d",
            FORMULA_SECOND_Y,
            Y_CHAIN_COLOR
        );
    }

    private void drawFormula(
        Graphics2D g2,
        String variable,
        String cosineName,
        String sineName,
        double baselineY,
        Color color
    ) {
        g2.setColor(color);

        FormulaCursor cursor = new FormulaCursor(
            g2,
            FORMULA_X,
            baselineY
        );

        cursor.main(variable);
        cursor.subscript("N");
        cursor.main("(t) = ");

        double afterSigma = this.drawSigma(
            g2,
            cursor.getX(),
            baselineY
        );

        cursor.setX(afterSigma);
        cursor.main("(" + cosineName);
        cursor.subscript("k");
        cursor.main(" cos kt + ");
        cursor.main(sineName);
        cursor.subscript("k");
        cursor.main(" sin kt)");
    }

    /**
     * 합 기호와 그 위아래의 범위를 그리고, 이어서 쓸 x 좌표를 돌려준다.
     */
    private double drawSigma(
        Graphics2D g2,
        double x,
        double baselineY
    ) {
        g2.setFont(SIGMA_FONT);

        double sigmaWidth = g2.getFontMetrics().stringWidth(SIGMA);
        g2.drawString(SIGMA, (float) x, (float) (baselineY + 10));
        g2.setFont(SMALL_FONT);

        double upperWidth = g2.getFontMetrics().stringWidth(UPPER_LIMIT);
        double lowerWidth = g2.getFontMetrics().stringWidth(LOWER_LIMIT);
        g2.drawString(UPPER_LIMIT, (float) (x + (sigmaWidth - upperWidth) / 2), (float) (baselineY - 28));
        g2.drawString(LOWER_LIMIT, (float) (x + (sigmaWidth - lowerWidth) / 2), (float) (baselineY + 36));

        return x + sigmaWidth + 8;
    }

    private void drawHarmonicNumber(Graphics2D g2) {
        String text = String.valueOf(this.harmonicCount);

        g2.setFont(NUMBER_FONT);
        g2.setColor(NUMBER_COLOR);

        double width = g2.getFontMetrics().stringWidth(text);
        g2.drawString(text, (float) (NUMBER_CENTER_X - width / 2), (float) NUMBER_BASELINE_Y);
    }

    private Point2D.Double toDesign(Point2D.Double point) {
        return new Point2D.Double(
            ORIGIN_X + (point.x - this.model.getSeriesX().getMean()) * this.scale,
            ORIGIN_Y + (point.y - this.model.getSeriesY().getMean()) * this.scale
        );
    }

    /**
     * 수식을 왼쪽에서 오른쪽으로 이어 쓰기 위한 커서.
     */
    private static class FormulaCursor {
        private final Graphics2D g2;
        private final double baselineY;
        private double x;

        FormulaCursor(
            Graphics2D g2,
            double x,
            double baselineY
        ) {
            this.g2 = g2;
            this.x = x;
            this.baselineY = baselineY;
        }

        double getX() {
            return this.x;
        }

        void setX(double x) {
            this.x = x;
        }

        void main(String text) {
            this.draw(
                text,
                MAIN_FONT,
                0
            );
        }

        void subscript(String text) {
            this.draw(
                text,
                SMALL_FONT,
                7
            );
        }

        private void draw(
            String text,
            Font font,
            double offsetY
        ) {
            this.g2.setFont(font);
            this.g2.drawString(text, (float) this.x, (float) (this.baselineY + offsetY));
            this.x += this.g2.getFontMetrics().stringWidth(text);
        }
    }
}
