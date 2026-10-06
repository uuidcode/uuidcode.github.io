package screen;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import static screen.ScreenShotPanel.AreaControlButton;

// 자신을 찍는 일은 alt(cmd)+tab 이 담당하므로 전용 버튼이나 모드가 남아 있지 않아야 한다.
public class SelfCaptureUnitTest {
    private static List<String> labels() {
        List<String> result = new ArrayList<>();

        for (AreaControlButton areaControlButton : AreaControlButton.values()) {
            result.add(areaControlButton.getLabel());
        }

        return result;
    }

    @Test
    public void areaControlPanelHasNoSelfButton() {
        assertFalse(labels().contains("self"));
    }

    @Test
    public void areaControlButtonOrderIsFixed() {
        assertEquals(
            List.of(
                "shot",
                "see",
                "auto",
                "record",
                "delay shot",
                "delay shot all",
                "cancel"
            ), // expected
            labels() // actual
        );
    }

    // selfAreaCaptureMode 가 사라져서 캡처 설정에 자신 캡처용 모드가 없어야 한다.
    @Test
    public void captureConfigHasNoSelfMode() {
        List<String> propertyNames = new ArrayList<>();

        for (java.lang.reflect.Method method : CaptureConfig.class.getMethods()) {
            propertyNames.add(method.getName());
        }

        assertFalse(propertyNames.contains("isSelfAreaCaptureMode"));

        assertFalse(propertyNames.contains("setSelfAreaCaptureMode"));
    }

    @Test
    public void copyKeepsRemainingModes() {
        CaptureConfig config = new CaptureConfig();
        config.setWindowCaptureMode(true);
        config.setSeeMode(true);

        CaptureConfig copied = config.copy();

        assertEquals(
            config.isWindowCaptureMode(), // expected
            copied.isWindowCaptureMode() // actual
        );

        assertEquals(
            config.isSeeMode(), // expected
            copied.isSeeMode() // actual
        );
    }
}
