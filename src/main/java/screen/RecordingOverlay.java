package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GraphicsDevice;
import java.awt.Rectangle;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JWindow;
import javax.swing.Timer;

// 화면 녹화 중 상단에 떠서 경과 시간을 보여주고 녹화를 멈출 수 있는 오버레이 창.
public class RecordingOverlay extends JWindow {
    private static final int OVERLAY_WIDTH = 200;
    private static final int OVERLAY_HEIGHT = 44;
    private static final int TOP_MARGIN = 24;
    private static final int SECONDS_PER_MINUTE = 60;
    private static final int TICK_INTERVAL_MS = 500;
    private static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 200);
    private static final Color TEXT_COLOR = new Color(255, 255, 255, 235);
    private final Runnable onStop;
    private final JLabel elapsedLabel;
    private final Timer tickTimer;
    private long startMillis;

    public RecordingOverlay(
        GraphicsDevice graphicsDevice,
        Runnable onStop
    ) {
        this.onStop = onStop;
        this.setAlwaysOnTop(true);
        this.setBackground(new Color(0, 0, 0, 0));

        JPanel panel = new JPanel(new FlowLayout(FlowLayout.CENTER, 8, 8));
        panel.setBackground(BACKGROUND_COLOR);

        this.elapsedLabel = new JLabel("● REC 00:00");
        this.elapsedLabel.setForeground(TEXT_COLOR);
        panel.add(this.elapsedLabel);

        JButton stopButton = new JButton("stop");
        stopButton.addActionListener(e -> this.onStop.run());
        Util.styleButtonAsSquare(stopButton);
        panel.add(stopButton);

        this.setContentPane(panel);

        Rectangle bounds = graphicsDevice.getDefaultConfiguration().getBounds();
        int x = bounds.x + (bounds.width - OVERLAY_WIDTH) / 2;
        int y = bounds.y + TOP_MARGIN;

        this.setBounds(
            x, // x
            y, // y
            OVERLAY_WIDTH, // width
            OVERLAY_HEIGHT // height
        );

        this.tickTimer = new Timer(
            TICK_INTERVAL_MS, // delay
            e -> this.updateElapsed() // listener
        );
    }

    public void start() {
        this.startMillis = System.currentTimeMillis();
        this.updateElapsed();
        this.tickTimer.start();
    }

    @Override
    public void dispose() {
        this.tickTimer.stop();
        super.dispose();
    }

    private void updateElapsed() {
        long elapsedSeconds = (System.currentTimeMillis() - this.startMillis) / 1000;
        long minutes = elapsedSeconds / SECONDS_PER_MINUTE;
        long seconds = elapsedSeconds % SECONDS_PER_MINUTE;

        this.elapsedLabel.setText(String.format("● REC %02d:%02d", minutes, seconds));
    }

    public Dimension getOverlaySize() {
        return new Dimension(OVERLAY_WIDTH, OVERLAY_HEIGHT);
    }
}
