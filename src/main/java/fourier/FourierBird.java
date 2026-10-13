package fourier;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.text.DecimalFormat;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.SwingUtilities;

/**
 * 벌새 외곽선을 두 개의 푸리에 급수로 되살리는 시뮬레이션 실행기.
 */
public class FourierBird {
    private static final DecimalFormat ERROR_FORMAT = new DecimalFormat("0.00");

    private FourierBird() {
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(FourierBird::createAndShowGUI);
    }

    private static void createAndShowGUI() {
        FourierBirdModel model = FourierBirdModel.create();
        FourierBirdPanel panel = new FourierBirdPanel(model);

        JFrame frame = new JFrame("Fourier Hummingbird");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());
        frame.add(panel, BorderLayout.CENTER);
        frame.add(createControlPanel(panel, model), BorderLayout.SOUTH);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        panel.start();
    }

    static JPanel createControlPanel(
        FourierBirdPanel panel,
        FourierBirdModel model
    ) {
        JButton playButton = new JButton("일시정지");
        JButton resetButton = new JButton("처음부터");
        JCheckBox autoCheckBox = new JCheckBox("차수 자동 증가", true);
        JLabel statusLabel = new JLabel();

        JSlider harmonicSlider = new JSlider(1, model.getMaxHarmonic(), panel.getHarmonicCount());
        harmonicSlider.setPreferredSize(new Dimension(220, 24));

        JSlider speedSlider = new JSlider(1, 20, 3);
        speedSlider.setPreferredSize(new Dimension(140, 24));

        boolean[] syncing = new boolean[1];

        playButton.addActionListener(event -> {
            panel.setPlaying(!panel.isPlaying());

            if (panel.isPlaying()) {
                playButton.setText("일시정지");
            } else {
                playButton.setText("재생");
            }
        });

        resetButton.addActionListener(event -> panel.reset());

        autoCheckBox.addActionListener(event -> panel.setAutoAdvance(autoCheckBox.isSelected()));

        harmonicSlider.addChangeListener(event -> {
            if (syncing[0]) {
                return;
            }

            autoCheckBox.setSelected(false);
            panel.setAutoAdvance(false);
            panel.setHarmonicCount(harmonicSlider.getValue());
            statusLabel.setText(toStatusText(panel));
        });

        speedSlider.addChangeListener(event -> panel.setLapSeconds(12.0 / speedSlider.getValue()));

        panel.setStateListener(() -> {
            syncing[0] = true;
            harmonicSlider.setValue(panel.getHarmonicCount());
            syncing[0] = false;
            statusLabel.setText(toStatusText(panel));
        });

        statusLabel.setText(toStatusText(panel));

        JPanel controlPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
        controlPanel.setBorder(BorderFactory.createEmptyBorder(2, 8, 2, 8));
        controlPanel.add(playButton);
        controlPanel.add(resetButton);
        controlPanel.add(autoCheckBox);
        controlPanel.add(Box.createHorizontalStrut(8));
        controlPanel.add(new JLabel("차수"));
        controlPanel.add(harmonicSlider);
        controlPanel.add(new JLabel("속도"));
        controlPanel.add(speedSlider);
        controlPanel.add(Box.createHorizontalStrut(8));
        controlPanel.add(statusLabel);

        return controlPanel;
    }

    static String toStatusText(FourierBirdPanel panel) {
        double percent = panel.getMaxErrorRatio() * 100;

        return "N = " + panel.getHarmonicCount() + ", 최대 오차 " + ERROR_FORMAT.format(percent) + "%";
    }
}
