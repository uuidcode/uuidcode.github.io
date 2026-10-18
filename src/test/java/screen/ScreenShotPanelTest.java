package screen;

import java.awt.Color;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;

import javax.swing.JPanel;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ScreenShotPanelTest {
    @Test
    public void trimUniformBorderRemovesSolidBackgroundAroundImage() {
        BufferedImage source = new BufferedImage(6, 6, BufferedImage.TYPE_INT_ARGB);
        Color backgroundColor = new Color(0, 0, 0, 255);
        Color foregroundColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, backgroundColor.getRGB());
            }
        }

        for (int y = 2; y <= 3; y++) {
            for (int x = 2; x <= 3; x++) {
                source.setRGB(x, y, foregroundColor.getRGB());
            }
        }

        BufferedImage trimmedImage = ScreenShotPanel.trimUniformBorder(source);

        assertEquals(2, trimmedImage.getWidth());
        assertEquals(2, trimmedImage.getHeight());
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(0, 0));
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(1, 0));
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(0, 1));
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(1, 1));
    }

    @Test
    public void trimUniformBorderBoundsReportsTrimmedOffset() {
        BufferedImage source = new BufferedImage(6, 6, BufferedImage.TYPE_INT_ARGB);
        Color backgroundColor = new Color(0, 0, 0, 255);
        Color foregroundColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, backgroundColor.getRGB());
            }
        }

        for (int y = 2; y <= 3; y++) {
            for (int x = 2; x <= 3; x++) {
                source.setRGB(x, y, foregroundColor.getRGB());
            }
        }

        Rectangle bounds = ScreenShotPanel.trimUniformBorderBounds(source);

        assertEquals(2, bounds.x);
        assertEquals(2, bounds.y);
        assertEquals(2, bounds.width);
        assertEquals(2, bounds.height);
    }

    @Test
    public void trimUniformBorderBoundsReturnsFullBoundsWhenNoBorderExists() {
        BufferedImage source = new BufferedImage(2, 2, BufferedImage.TYPE_INT_ARGB);
        Color fillColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, fillColor.getRGB());
            }
        }

        Rectangle bounds = ScreenShotPanel.trimUniformBorderBounds(source);

        assertEquals(0, bounds.x);
        assertEquals(0, bounds.y);
        assertEquals(2, bounds.width);
        assertEquals(2, bounds.height);
    }

    @Test
    public void trimUniformBorderKeepsOriginalImageWhenNoSolidBorderExists() {
        BufferedImage source = new BufferedImage(2, 2, BufferedImage.TYPE_INT_ARGB);
        Color fillColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, fillColor.getRGB());
            }
        }

        BufferedImage trimmedImage = ScreenShotPanel.trimUniformBorder(source);

        assertEquals(2, trimmedImage.getWidth());
        assertEquals(2, trimmedImage.getHeight());
    }

    @Test
    public void configureControlPanelMakesPanelTransparent() {
        JPanel panel = new JPanel();

        ScreenShotPanel.configureControlPanel(panel);

        assertFalse(panel.isOpaque());
        assertEquals(new Color(0, 0, 0, 0), panel.getBackground());
    }

    @Test
    public void shouldRepaintWhenHidingControlPanelReturnsFalseWhenCaptureIsStarting() {
        boolean repaintBounds = ScreenShotPanel.shouldRepaintWhenHidingControlPanel(true);

        assertFalse(repaintBounds);
    }

    @Test
    public void shouldRepaintWhenHidingControlPanelReturnsTrueWhenCaptureIsNotStarting() {
        boolean repaintBounds = ScreenShotPanel.shouldRepaintWhenHidingControlPanel(false);

        assertTrue(repaintBounds);
    }

    // 단축키로 바로 찍는 경우에는 체크박스와 상관없이 보던 화면에 머무른다.
    @Test
    public void shortcutShotKeepsCurrentScreenEvenWhenKeepScreenIsUnchecked() {
        assertTrue(ScreenShotPanel.shouldKeepCurrentScreen(
            false, // keepCurrentScreenEnabled
            AutoShotMode.SHOT // autoShotMode
        ));

        assertTrue(ScreenShotPanel.shouldKeepCurrentScreen(
            false, // keepCurrentScreenEnabled
            AutoShotMode.SHOT_AND_WRITE // autoShotMode
        ));
    }

    // and return 이 붙은 단축키는 체크박스가 켜져 있어도 ImageFrame 으로 올라온다.
    @Test
    public void returnShortcutsAlwaysGoBackToImageFrame() {
        assertFalse(ScreenShotPanel.shouldKeepCurrentScreen(
            true, // keepCurrentScreenEnabled
            AutoShotMode.SHOT_AND_RETURN // autoShotMode
        ));

        assertFalse(ScreenShotPanel.shouldKeepCurrentScreen(
            true, // keepCurrentScreenEnabled
            AutoShotMode.SHOT_AND_WRITE_AND_RETURN // autoShotMode
        ));
    }

    // 컨트롤 패널 버튼으로 찍은 경우에만 체크박스를 따른다.
    @Test
    public void controlPanelShotFollowsTheKeepScreenCheckbox() {
        assertTrue(ScreenShotPanel.shouldKeepCurrentScreen(
            true, // keepCurrentScreenEnabled
            AutoShotMode.NONE // autoShotMode
        ));

        assertFalse(ScreenShotPanel.shouldKeepCurrentScreen(
            false, // keepCurrentScreenEnabled
            AutoShotMode.NONE // autoShotMode
        ));
    }

    @Test
    public void shouldMoveSelectionReturnsTrueInsideSelection() {
        Rectangle rectangle = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point point = new Point(
            20, // x
            20 // y
        );

        boolean moveSelection = ScreenShotPanel.shouldMoveSelection(
            rectangle,
            point
        );

        assertTrue(moveSelection);
    }

    @Test
    public void shouldMoveSelectionReturnsFalseOutsideSelection() {
        Rectangle rectangle = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point point = new Point(
            5, // x
            5 // y
        );

        boolean moveSelection = ScreenShotPanel.shouldMoveSelection(
            rectangle,
            point
        );

        assertFalse(moveSelection);
    }

    @Test
    public void moveSelectionRectangleMovesSelectionByDragDelta() {
        Rectangle origin = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point startPoint = new Point(
            20, // x
            20 // y
        );

        Point point = new Point(
            30, // x
            35 // y
        );

        Rectangle movedRectangle = ScreenShotPanel.moveSelectionRectangle(
            origin,
            startPoint,
            point,
            100, // boundaryWidth
            100 // boundaryHeight
        );

        Rectangle expectedRectangle = new Rectangle(
            20, // x
            25, // y
            40, // width
            20 // height
        );

        assertEquals(
            expectedRectangle, // expected
            movedRectangle // actual
        );
    }

    // 단축키 설명은 선택 영역 왼쪽에 붙인다.
    @Test
    public void shortcutHelpSitsOnTheLeftOfTheSelection() {
        Rectangle rectangle = new Rectangle(
            300, // x
            100, // y
            200, // width
            120 // height
        );

        int x = ScreenShotPanel.toShortcutHelpX(
            rectangle,
            160, // boxWidth
            12, // gap
            1000 // overlayWidth
        );

        assertEquals(128, x);
    }

    // 영역이 화면 왼쪽 끝에 붙어 있으면 설명이 잘리므로 오른쪽으로 넘긴다.
    @Test
    public void shortcutHelpFlipsToTheRightWhenTheLeftIsTooNarrow() {
        Rectangle rectangle = new Rectangle(
            10, // x
            100, // y
            200, // width
            120 // height
        );

        int x = ScreenShotPanel.toShortcutHelpX(
            rectangle,
            160, // boxWidth
            12, // gap
            1000 // overlayWidth
        );

        assertEquals(222, x);
    }

    // 양쪽 다 좁으면 화면 안에만 들어오게 한다.
    @Test
    public void shortcutHelpStaysInsideTheOverlayWhenBothSidesAreTooNarrow() {
        Rectangle rectangle = new Rectangle(
            10, // x
            100, // y
            200, // width
            120 // height
        );

        int x = ScreenShotPanel.toShortcutHelpX(
            rectangle,
            160, // boxWidth
            12, // gap
            300 // overlayWidth
        );

        assertEquals(140, x);
    }

    @Test
    public void shortcutHelpLinesUpWithTheMiddleOfTheSelection() {
        Rectangle rectangle = new Rectangle(
            300, // x
            100, // y
            200, // width
            120 // height
        );

        int y = ScreenShotPanel.toShortcutHelpY(
            rectangle,
            60, // boxHeight
            1000 // overlayHeight
        );

        assertEquals(130, y);
    }

    @Test
    public void shortcutHelpStaysInsideTheOverlayVertically() {
        Rectangle rectangle = new Rectangle(
            300, // x
            0, // y
            200, // width
            20 // height
        );

        int y = ScreenShotPanel.toShortcutHelpY(
            rectangle,
            60, // boxHeight
            1000 // overlayHeight
        );

        assertEquals(0, y);
    }

    @Test
    public void moveSelectionRectangleKeepsSelectionInsideBounds() {
        Rectangle origin = new Rectangle(
            70, // x
            80, // y
            40, // width
            30 // height
        );

        Point startPoint = new Point(
            80, // x
            90 // y
        );

        Point point = new Point(
            120, // x
            130 // y
        );

        Rectangle movedRectangle = ScreenShotPanel.moveSelectionRectangle(
            origin,
            startPoint,
            point,
            100, // boundaryWidth
            100 // boundaryHeight
        );

        Rectangle expectedRectangle = new Rectangle(
            60, // x
            70, // y
            40, // width
            30 // height
        );

        assertEquals(
            expectedRectangle, // expected
            movedRectangle // actual
        );
    }
}
