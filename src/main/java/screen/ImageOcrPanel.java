package screen;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.UIManager;
import javax.swing.ListSelectionModel;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.AbstractTableModel;
import javax.swing.table.JTableHeader;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ImageOcrPanel extends JPanel {
    private final OcrTableModel tableModel = new OcrTableModel();
    private final JTextArea textTextArea = new JTextArea();
    private final JTextArea jsonTextArea = new JTextArea();
    private final JTable table = new JTable(this.tableModel);
    private final JTabbedPane tabbedPane = new JTabbedPane();
    private final JButton showRectButton = new JButton("show rect");
    private final OcrPanelListener listener;
    private boolean showRectEnabled;

    public ImageOcrPanel(OcrPanelListener listener) {
        super(new BorderLayout());
        this.listener = listener;
        this.setBorder(BorderFactory.createEmptyBorder(4, 4, 4, 4));

        this.configureTable();

        JScrollPane tableScrollPane = new JScrollPane(this.table);
        JScrollBar horizontalScrollBar = tableScrollPane.getHorizontalScrollBar();
        horizontalScrollBar.setUnitIncrement(16);

        this.textTextArea.setEditable(false);
        this.textTextArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        this.textTextArea.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        JScrollPane textScrollPane = new JScrollPane(this.textTextArea);

        this.jsonTextArea.setEditable(false);
        this.jsonTextArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        this.jsonTextArea.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        JScrollPane jsonScrollPane = new JScrollPane(this.jsonTextArea);

        this.tabbedPane.addTab("table", tableScrollPane);
        this.tabbedPane.addTab("json", jsonScrollPane);
        this.tabbedPane.addTab("text", textScrollPane);
        this.tabbedPane.addChangeListener(e -> this.updateTabAppearance());
        this.updateTabAppearance();

        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 6, 0));
        topPanel.add(this.showRectButton);

        JButton resetButton = new JButton("reset");
        resetButton.addActionListener(e -> this.resetSelectionAndOverlay());
        topPanel.add(resetButton);

        JButton closeButton = new JButton("close");
        closeButton.addActionListener(e -> this.listener.onCloseRequested());
        topPanel.add(closeButton);

        this.showRectButton.addActionListener(e -> this.toggleShowRect());

        this.add(topPanel, BorderLayout.NORTH);
        this.add(this.tabbedPane, BorderLayout.CENTER);
    }

    private void updateTabAppearance() {
        Color normalForeground = new Color(70, 70, 70);
        Color selectedForeground = new Color(20, 20, 20);
        Color defaultBackground = UIManager.getColor("Panel.background");

        for (int i = 0; i < this.tabbedPane.getTabCount(); i++) {
            boolean selected = i == this.tabbedPane.getSelectedIndex();
            this.tabbedPane.setForegroundAt(i, selected ? selectedForeground : normalForeground);
            if (defaultBackground != null) {
                this.tabbedPane.setBackgroundAt(i, defaultBackground);
            }
        }
    }

    private void configureTable() {
        this.table.setAutoCreateRowSorter(true);
        this.table.getTableHeader().setReorderingAllowed(false);
        this.table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        this.table.setFillsViewportHeight(true);
        this.table.setRowHeight(24);
        this.table.setShowVerticalLines(true);
        this.table.setGridColor(new Color(224, 224, 224));
        this.table.getColumnModel().getColumn(0).setPreferredWidth(320);
        this.table.getColumnModel().getColumn(1).setPreferredWidth(120);
        this.table.getSelectionModel().addListSelectionListener(new ListSelectionListener() {
            @Override
            public void valueChanged(ListSelectionEvent e) {
                if (!e.getValueIsAdjusting()) {
                    notifySelectionChanged();
                }
            }
        });

        JTableHeader tableHeader = this.table.getTableHeader();
        tableHeader.setOpaque(true);
        tableHeader.setBackground(new Color(230, 230, 230));
        tableHeader.setForeground(new Color(45, 45, 45));
        tableHeader.setBorder(BorderFactory.createMatteBorder(1, 0, 1, 0, new Color(188, 188, 188)));
        tableHeader.setFont(tableHeader.getFont().deriveFont(Font.BOLD, 13f));
        tableHeader.setPreferredSize(new Dimension(tableHeader.getPreferredSize().width, 30));
    }

    public void showLoading() {
        this.tableModel.setItems(Collections.<ImageOcrService.OcrItem>emptyList());
        this.resetState();
        this.textTextArea.setText("Running OCR...");
        this.textTextArea.setCaretPosition(0);
        this.jsonTextArea.setText("Running OCR...");
        this.jsonTextArea.setCaretPosition(0);
    }

    public void showError(String message) {
        this.tableModel.setItems(Collections.<ImageOcrService.OcrItem>emptyList());
        this.resetState();
        this.textTextArea.setText(message);
        this.textTextArea.setCaretPosition(0);
        this.jsonTextArea.setText(message);
        this.jsonTextArea.setCaretPosition(0);
    }

    public void setResult(ImageOcrService.OcrRunResult runResult) {
        this.tableModel.setItems(runResult.getResponse().getItems());
        this.resetState();
        this.textTextArea.setText(runResult.getResponse().getOriginalText());
        this.textTextArea.setCaretPosition(0);
        this.jsonTextArea.setText(runResult.getPrettyJson());
        this.jsonTextArea.setCaretPosition(0);
    }

    private void resetState() {
        this.showRectEnabled = false;
        this.showRectButton.setText("show rect");
        this.resetSort();
        this.table.clearSelection();
        this.listener.onResetRequested();
    }

    private void resetSort() {
        if (this.table.getRowSorter() != null) {
            this.table.getRowSorter().setSortKeys(null);
        }
    }

    private void toggleShowRect() {
        this.showRectEnabled = !this.showRectEnabled;
        this.showRectButton.setText(this.showRectEnabled ? "hide rect" : "show rect");
        this.listener.onShowRectsChanged(this.showRectEnabled, this.tableModel.getItems());
        this.notifySelectionChanged();
    }

    private void resetSelectionAndOverlay() {
        this.showRectEnabled = false;
        this.showRectButton.setText("show rect");
        this.table.clearSelection();
        this.listener.onResetRequested();
    }

    private void notifySelectionChanged() {
        int viewRow = this.table.getSelectedRow();
        if (viewRow < 0) {
            this.listener.onItemSelected(null);
            return;
        }

        int modelRow = this.table.convertRowIndexToModel(viewRow);
        this.listener.onItemSelected(this.tableModel.getItemAt(modelRow));
    }

    public interface OcrPanelListener {
        void onShowRectsChanged(boolean visible, List<ImageOcrService.OcrItem> items);
        void onItemSelected(ImageOcrService.OcrItem item);
        void onResetRequested();
        void onCloseRequested();
    }

    private static class OcrTableModel extends AbstractTableModel {
        private final String[] columns = {"text", "x,y,w,h"};
        private List<ImageOcrService.OcrItem> items = new ArrayList<ImageOcrService.OcrItem>();

        public void setItems(List<ImageOcrService.OcrItem> items) {
            this.items = new ArrayList<ImageOcrService.OcrItem>(items);
            this.fireTableDataChanged();
        }

        public List<ImageOcrService.OcrItem> getItems() {
            return new ArrayList<ImageOcrService.OcrItem>(this.items);
        }

        public ImageOcrService.OcrItem getItemAt(int rowIndex) {
            return this.items.get(rowIndex);
        }

        @Override
        public int getRowCount() {
            return this.items.size();
        }

        @Override
        public int getColumnCount() {
            return this.columns.length;
        }

        @Override
        public String getColumnName(int column) {
            return this.columns[column];
        }

        @Override
        public Class<?> getColumnClass(int columnIndex) {
            return String.class;
        }

        @Override
        public Object getValueAt(int rowIndex, int columnIndex) {
            ImageOcrService.OcrItem item = this.items.get(rowIndex);

            if (columnIndex == 0) {
                return item.getText();
            }

            ImageOcrService.OcrRect rect = item.getRect();
            return rect == null ? "" : rect.toDisplayText();
        }
    }
}
