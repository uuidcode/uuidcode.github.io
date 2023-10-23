package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.HashMap;
import java.util.Map;

import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JPanel;

import static java.awt.BorderLayout.CENTER;
import static javax.swing.BorderFactory.createCompoundBorder;
import static javax.swing.BorderFactory.createEmptyBorder;
import static javax.swing.BorderFactory.createEtchedBorder;
import static javax.swing.BorderFactory.createLoweredBevelBorder;
import static javax.swing.BorderFactory.createRaisedBevelBorder;
import static javax.swing.BoxLayout.LINE_AXIS;

public class ButtonTabPanel extends JPanel {
    public static final Color SELECTED_COLOR = new Color(124, 166, 208, 244);
    private final JPanel controlPanel;
    private final Map<String, JPanel> contentPanelMap = new HashMap<>();
    private final Map<String, JLabel> buttonMap = new HashMap<>();
    private JPanel contentPanel = null;
    private Color defaultColor = null;

    public void close(String name) {
        System.out.println(name);
        contentPanel.remove(this.buttonMap.get(name));
        contentPanel.revalidate();
        contentPanel.repaint();

        this.remove(this.contentPanelMap.get(name));
        this.revalidate();
        this.repaint();
    }

    public ButtonTabPanel() {
        this.setLayout(new BorderLayout());
        this.controlPanel = this.createControlPanel();
    }

    private JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, LINE_AXIS));
        panel.setBorder(createCompoundBorder(
            createEtchedBorder(), createEmptyBorder(10, 10, 0, 10)));
        this.add(panel, BorderLayout.NORTH);
        return panel;
    }

    public void unselectedButton() {
        this.buttonMap.values().forEach(b -> {
            b.setBackground(this.defaultColor);
            b.setBorder(
                createCompoundBorder(createRaisedBevelBorder(),
                    createEmptyBorder(10, 10, 10, 10)));
        });
    }

    public void selectedButton(JLabel label) {
        label.setBackground(SELECTED_COLOR);
        label.setBorder(createCompoundBorder(
            createLoweredBevelBorder(),
                createEmptyBorder(10, 10, 10, 10)));
    }

    public void addTab(String name) {
        this.unselectedButton();

        JLabel button = new JLabel(name);

        if (defaultColor == null) {
            this.defaultColor = button.getBackground();
        }

        button.setName(name);
        this.buttonMap.put(name, button);
        this.selectedButton(button);

        button.addMouseListener(new MouseListener() {
            @Override
            public void mouseClicked(MouseEvent e) {
                String selectedName = e.getComponent().getName();
                JPanel selectedPanel = contentPanelMap.get(selectedName);
                unselectedButton();
                selectedButton(buttonMap.get(selectedName));
                select(selectedPanel);
            }

            @Override
            public void mousePressed(MouseEvent e) {

            }

            @Override
            public void mouseReleased(MouseEvent e) {

            }

            @Override
            public void mouseEntered(MouseEvent e) {

            }

            @Override
            public void mouseExited(MouseEvent e) {

            }
        });

        this.controlPanel.add(button);

        JPanel imageContentPanel = new ImageContentPanel(name, Util.getImageFile(name), this);
        imageContentPanel.setBorder(createCompoundBorder(
            createEtchedBorder(), createEmptyBorder(10, 10, 10, 10)));

        if (contentPanel == null) {
            contentPanel = new JPanel(new BorderLayout());
            this.add(contentPanel, CENTER);
            this.select(imageContentPanel);
        } else {
            this.select(imageContentPanel);
        }

        this.revalidate();
        this.repaint();

        this.contentPanelMap.put(name, imageContentPanel);
    }

    private void select(JPanel imageContentPanel) {
        contentPanel.removeAll();
        contentPanel.add(imageContentPanel, CENTER);
        contentPanel.revalidate();
        contentPanel.repaint();
    }
}
