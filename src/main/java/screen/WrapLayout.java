package screen;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Insets;

import javax.swing.JScrollPane;
import javax.swing.SwingUtilities;

/**
 * FlowLayout 을 확장해 컨테이너 너비에 맞춰 줄바꿈되며,
 * 줄바꿈된 실제 높이를 preferredSize 로 반영해 BorderLayout.NORTH 등에서도
 * 여러 줄이 잘리지 않고 표시되도록 한다.
 */
public class WrapLayout extends FlowLayout {
    public WrapLayout(int align, int hgap, int vgap) {
        super(align, hgap, vgap);
    }

    @Override
    public Dimension preferredLayoutSize(Container target) {
        return this.layoutSize(target, true);
    }

    @Override
    public Dimension minimumLayoutSize(Container target) {
        Dimension minimum = this.layoutSize(target, false);
        minimum.width -= (this.getHgap() + 1);
        return minimum;
    }

    private Dimension layoutSize(Container target, boolean preferred) {
        synchronized (target.getTreeLock()) {
            int targetWidth = this.resolveTargetWidth(target);

            int hgap = this.getHgap();
            int vgap = this.getVgap();
            Insets insets = target.getInsets();
            int horizontalInsetsAndGap = insets.left + insets.right + (hgap * 2);
            int maxWidth = targetWidth - horizontalInsetsAndGap;

            Dimension dimension = new Dimension(0, 0);
            int rowWidth = 0;
            int rowHeight = 0;
            int memberCount = target.getComponentCount();

            for (int i = 0; i < memberCount; i++) {
                Component member = target.getComponent(i);

                if (!member.isVisible()) {
                    continue;
                }

                Dimension memberSize = preferred ? member.getPreferredSize() : member.getMinimumSize();

                if (rowWidth + memberSize.width > maxWidth) {
                    this.addRow(dimension, rowWidth, rowHeight);
                    rowWidth = 0;
                    rowHeight = 0;
                }

                if (rowWidth != 0) {
                    rowWidth += hgap;
                }

                rowWidth += memberSize.width;
                rowHeight = Math.max(rowHeight, memberSize.height);
            }

            this.addRow(dimension, rowWidth, rowHeight);

            dimension.width += horizontalInsetsAndGap;
            dimension.height += insets.top + insets.bottom + vgap * 2;

            Container scrollPane = SwingUtilities.getAncestorOfClass(JScrollPane.class, target);

            if (scrollPane != null && target.isValid()) {
                dimension.width -= (hgap + 1);
            }

            return dimension;
        }
    }

    private int resolveTargetWidth(Container target) {
        Container container = target;

        while (container.getSize().width == 0 && container.getParent() != null) {
            container = container.getParent();
        }

        int width = container.getSize().width;

        return width == 0 ? Integer.MAX_VALUE : width;
    }

    private void addRow(Dimension dimension, int rowWidth, int rowHeight) {
        dimension.width = Math.max(dimension.width, rowWidth);

        if (dimension.height > 0) {
            dimension.height += this.getVgap();
        }

        dimension.height += rowHeight;
    }
}
