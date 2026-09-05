package screen;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertFalse;

public class ImagePanelTest {
    @Test
    public void selectableShapeTypesExcludeToggleShapeTypes() {
        List<ShapeType> shapeTypeList = Arrays.asList(ImagePanel.selectableShapeTypes());

        assertFalse(shapeTypeList.contains(ShapeType.CROP));

        assertFalse(shapeTypeList.contains(ShapeType.BLUR));

        assertFalse(shapeTypeList.contains(ShapeType.BLUR_CLIPPING));
    }

}
