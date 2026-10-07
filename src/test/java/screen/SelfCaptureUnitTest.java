package screen;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import static screen.ScreenShotPanel.AreaControlButton;

// 자신을 찍는 것은 self 버튼이 담당한다.
// alt(cmd)+tab 으로 고른 창은 알아낼 수 없어 버튼으로 의도를 받는다.
public class SelfCaptureUnitTest {
    private static List<String> labels() {
        List<String> result = new ArrayList<>();

        for (AreaControlButton areaControlButton : AreaControlButton.values()) {
            result.add(areaControlButton.getLabel());
        }

        return result;
    }

    @Test
    public void areaControlPanelHasSelfButton() {
        assertTrue(labels().contains("self"));
    }

    @Test
    public void selfFollowsAuto() {
        List<String> labels = labels();

        assertEquals(
            "self", // expected
            labels.get(labels.indexOf("auto") + 1) // actual
        );
    }

    @Test
    public void areaControlButtonOrderIsFixed() {
        assertEquals(
            List.of(
                "shot",
                "see",
                "auto",
                "self",
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
        List<String> methodNames = new ArrayList<>();

        for (java.lang.reflect.Method method : CaptureConfig.class.getMethods()) {
            methodNames.add(method.getName());
        }

        assertFalse(methodNames.contains("isSelfAreaCaptureMode"));

        assertFalse(methodNames.contains("setSelfAreaCaptureMode"));
    }
}
