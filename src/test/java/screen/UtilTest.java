package screen;

import org.junit.Test;

import java.awt.Insets;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class UtilTest {
    @Test
    public void styleButtonsAsSquareAppliesSquareTypeAndTightMargin() {
        JPanel panel = new JPanel();
        JButton button = new JButton("capture");
        panel.add(button);

        Util.styleButtonsAsSquare(panel);

        Insets margin = button.getMargin();

        assertEquals("square", button.getClientProperty("JButton.buttonType"));
        assertEquals(6, margin.left);
        assertEquals(6, margin.right);
    }

    @Test
    public void styleButtonsAsSquareIgnoresNonButtonComponents() {
        JPanel panel = new JPanel();
        JLabel label = new JLabel("width:");
        panel.add(label);

        Util.styleButtonsAsSquare(panel);

        assertNull(label.getClientProperty("JButton.buttonType"));
    }

    // 알림 문구에 따옴표가 들어가도 AppleScript 가 깨지지 않아야 한다.
    @Test
    public void toAppleScriptStringEscapesQuotesAndBackslashes() {
        assertEquals(
            "\"write \\\"done\\\"\"", // expected
            Util.toAppleScriptString("write \"done\"") // actual
        );

        assertEquals(
            "\"a\\\\b\"", // expected
            Util.toAppleScriptString("a\\b") // actual
        );
    }
}
