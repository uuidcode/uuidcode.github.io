package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
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
    private final Map<String, ImagePanel> contentPanelMap = new LinkedHashMap<>();
    private final Map<String, JLabel> buttonMap = new LinkedHashMap<>();
    private JPanel contentPanel = null;
    private Color defaultColor = null;

    public void close(String name) {
        this.contentPanelMap.remove(name);
        List<JPanel> panelList = new ArrayList<>(contentPanelMap.values());
        this.contentPanel.removeAll();

        if (!panelList.isEmpty()) {
            contentPanel.add(panelList.get(panelList.size() - 1));
        }

        this.contentPanel.revalidate();
        this.contentPanel.repaint();

        JLabel currentLabel = this.buttonMap.remove(name);
        this.controlPanel.remove(currentLabel);

        List<JLabel> labelList = new ArrayList<>(this.buttonMap.values());
        this.unselectedButton();

        if (!labelList.isEmpty()) {
            this.selectedButton(labelList.get(labelList.size() - 1));
        }

        this.controlPanel.revalidate();
        this.controlPanel.repaint();
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

        button.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                String selectedName = e.getComponent().getName();
                JPanel selectedPanel = contentPanelMap.get(selectedName);
                unselectedButton();
                selectedButton(buttonMap.get(selectedName));
                select(selectedPanel);
            }
        });

        this.controlPanel.add(button);

        ImagePanel imagePanel = new ImagePanel(name, Util.getImageFile(name), this);
        imagePanel.setBorder(createCompoundBorder(
            createEtchedBorder(), createEmptyBorder(10, 10, 10, 10)));

        if (contentPanel == null) {
            contentPanel = new JPanel(new BorderLayout());
            this.add(contentPanel, CENTER);
            this.select(imagePanel);
        } else {
            this.select(imagePanel);
        }

        this.revalidate();
        this.repaint();

        this.contentPanelMap.put(name, imagePanel);
    }

    private void select(JPanel imageContentPanel) {
        contentPanel.removeAll();
        contentPanel.add(imageContentPanel, CENTER);
        contentPanel.revalidate();
        contentPanel.repaint();
    }
}
