package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Frame;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

import static java.awt.BorderLayout.CENTER;
import static java.awt.BorderLayout.SOUTH;
import static java.awt.FlowLayout.RIGHT;

public class ColorHistoryDialog extends JDialog {
    public ColorHistoryDialog(Frame owner, ColorHistoryRepository repository) {
        super(owner, "Color History", true);
        this.initComponents(repository);
    }

    private void initComponents(ColorHistoryRepository repository) {
        this.setSize(860, 500);
        this.setLocationRelativeTo(getOwner());
        this.setLayout(new BorderLayout());

        String[] columns = {"Time", "R", "G", "B", "HTML", "Color", "X", "Y"};
        DefaultTableModel model = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        List<ColorHistoryEntry> entries = repository.findAll();
        for (ColorHistoryEntry entry : entries) {
            model.addRow(new Object[]{
                entry.getPickedAt(),
                entry.getRed(),
                entry.getGreen(),
                entry.getBlue(),
                entry.getHtmlColor(),
                new Color(entry.getRed(), entry.getGreen(), entry.getBlue()),
                entry.getScreenX(),
                entry.getScreenY()
            });
        }

        JTable table = new JTable(model);
        table.setRowSelectionAllowed(true);
        table.setFillsViewportHeight(true);
        table.getColumnModel().getColumn(0).setPreferredWidth(180);
        table.getColumnModel().getColumn(1).setPreferredWidth(45);
        table.getColumnModel().getColumn(2).setPreferredWidth(45);
        table.getColumnModel().getColumn(3).setPreferredWidth(45);
        table.getColumnModel().getColumn(4).setPreferredWidth(100);
        table.getColumnModel().getColumn(5).setCellRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table,
                                                           Object value,
                                                           boolean isSelected,
                                                           boolean hasFocus,
                                                           int row,
                                                           int column) {
                JPanel panel = new JPanel();
                panel.setOpaque(true);
                panel.setBackground(value instanceof Color ? (Color) value : Color.WHITE);
                return panel;
            }
        });
        table.getColumnModel().getColumn(5).setPreferredWidth(60);
        table.getColumnModel().getColumn(6).setPreferredWidth(90);
        table.getColumnModel().getColumn(7).setPreferredWidth(90);
        this.add(new JScrollPane(table), CENTER);

        JPanel bottomPanel = new JPanel(new java.awt.FlowLayout(RIGHT));
        JButton closeButton = new JButton("close");
        closeButton.addActionListener(e -> this.dispose());
        bottomPanel.add(closeButton);
        this.add(bottomPanel, SOUTH);
    }
}
