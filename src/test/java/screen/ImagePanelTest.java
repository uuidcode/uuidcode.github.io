package screen;

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
    public void defaultShapeTypeIsSelectableFilledArrow() {
        assertEquals(ShapeType.FILL_ARROW, ImagePanel.DEFAULT_SHAPE_TYPE);

        assertTrue(Arrays.asList(ImagePanel.selectableShapeTypes())
            .contains(ImagePanel.DEFAULT_SHAPE_TYPE));
    }

}
