import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

public class ProgressBarExample {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(ProgressBarExample::createAndShowGUI);
    }

    private static void createAndShowGUI() {
        JFrame frame = new JFrame("Progress Bar Example");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 150);
        frame.setLayout(new BorderLayout());

        JProgressBar progressBar = new JProgressBar();
        progressBar.setIndeterminate(true);
        progressBar.setString("Loading...");
        progressBar.setStringPainted(true);

        JButton startButton = new JButton("Start");

        frame.add(progressBar, BorderLayout.CENTER);
        frame.add(startButton, BorderLayout.SOUTH);

        startButton.addActionListener(new ActionListener() {
            Timer timer;

            @Override
            public void actionPerformed(ActionEvent e) {
                progressBar.setIndeterminate(true);
                progressBar.setString("Processing...");
                timer = new Timer(5000, new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent evt) {
                        progressBar.setIndeterminate(false);
                        progressBar.setString("Complete");
                        JOptionPane.showMessageDialog(frame, "Task Complete!", "Message", JOptionPane.INFORMATION_MESSAGE);
                    }
                });
                timer.setRepeats(false);
                timer.start();
            }
        });

        frame.setVisible(true);
    }
}
