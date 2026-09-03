package screen;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ImagePanelTest {
    @Test
    public void selectableShapeTypesExcludeToggleShapeTypes() {
        List<ShapeType> shapeTypeList = Arrays.asList(ImagePanel.selectableShapeTypes());

        assertFalse(shapeTypeList.contains(ShapeType.CROP));

        assertFalse(shapeTypeList.contains(ShapeType.BLUR));

        assertFalse(shapeTypeList.contains(ShapeType.BLUR_CLIPPING));
    }

    @Test
    public void containsIntellijProjectWindowReturnsTrueWhenUuidcodeProjectIsOpen() {
        boolean containsProjectWindow = ImagePanel.containsIntellijProjectWindow(
            "uuidcode.github.io - ImagePanel.java"
        );

        assertTrue(containsProjectWindow);
    }

    @Test
    public void containsIntellijProjectWindowReturnsFalseWhenUuidcodeProjectIsNotOpen() {
        boolean containsProjectWindow = ImagePanel.containsIntellijProjectWindow(
            "other-project - Main.java"
        );

        assertFalse(containsProjectWindow);
    }

    @Test
    public void openApplicationCommandUsesApplicationNameAndTarget() {
        List<String> command = ImagePanel.openApplicationCommand(
            "Google Chrome", // applicationName
            "http://localhost:63342/uuidcode.github.io/stream/images/2026.html" // pathOrUrl
        );

        List<String> expectedCommand = new ArrayList<>();
        expectedCommand.add("open");

        expectedCommand.add("-a");

        expectedCommand.add("Google Chrome");

        expectedCommand.add("http://localhost:63342/uuidcode.github.io/stream/images/2026.html");

        assertEquals(
            expectedCommand, // expected
            command // actual
        );
    }
}
