package screen;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Frame;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.ActionEvent;
import java.util.List;

import javax.swing.AbstractAction;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.KeyStroke;
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
        table.setCellSelectionEnabled(true);
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
        this.installCopyAction(table);
        this.add(new JScrollPane(table), CENTER);

        JPanel bottomPanel = new JPanel(new java.awt.FlowLayout(RIGHT));
        JButton closeButton = new JButton("close");
        closeButton.addActionListener(e -> this.dispose());
        bottomPanel.add(closeButton);
        this.add(bottomPanel, SOUTH);
    }

    private void installCopyAction(JTable table) {
        KeyStroke keyStroke = KeyStroke.getKeyStroke('C', Toolkit.getDefaultToolkit().getMenuShortcutKeyMask());
        table.getInputMap(JComponent.WHEN_FOCUSED).put(keyStroke, "copy-cell");
        table.getActionMap().put("copy-cell", new AbstractAction() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int[] rows = table.getSelectedRows();
                int[] columns = table.getSelectedColumns();

                if (rows.length == 0 || columns.length == 0) {
                    return;
                }

                StringBuilder builder = new StringBuilder();

                for (int rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    if (rowIndex > 0) {
                        builder.append('\n');
                    }

                    for (int columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                        if (columnIndex > 0) {
                            builder.append('\t');
                        }

                        Object value = table.getValueAt(rows[rowIndex], columns[columnIndex]);
                        if (value instanceof Color) {
                            Color color = (Color) value;
                            builder.append(String.format("#%02X%02X%02X", color.getRed(), color.getGreen(), color.getBlue()));
                        } else if (value != null) {
                            builder.append(value);
                        }
                    }
                }

                Toolkit.getDefaultToolkit().getSystemClipboard()
                    .setContents(new StringSelection(builder.toString()), null);
            }
        });
    }
}
