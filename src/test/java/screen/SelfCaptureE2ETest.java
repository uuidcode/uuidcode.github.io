package screen;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import static screen.ScreenShotPanel.AreaControlButton;

// capture 로 시작해서 self 로 자기 UI 를 띄우고 shot 으로 찍는 흐름.
// 촬영 경로가 가시성을 건드리지 않아야 self 로 띄운 화면이 그대로 찍힌다.
public class SelfCaptureE2ETest {
    @Test
    public void selfIsBetweenAutoAndRecord() {
        List<String> labels = new ArrayList<>();

        for (AreaControlButton areaControlButton : AreaControlButton.values()) {
            labels.add(areaControlButton.getLabel());
        }

        int selfIndex = labels.indexOf("self");

        assertEquals(
            "auto", // expected
            labels.get(selfIndex - 1) // actual
        );

        assertEquals(
            "record", // expected
            labels.get(selfIndex + 1) // actual
        );
    }

    // shot 이 가시성을 건드리면 self 로 띄운 자기 UI 가 다시 사라져 버린다.
    @Test
    public void shotDoesNotTakeAnyVisibilityArgument() {
        boolean found = false;

        for (Method method : ScreenShotPanel.class.getDeclaredMethods()) {
            if (!"shot".equals(method.getName())) {
                continue;
            }

            found = true;

            for (Class<?> parameterType : method.getParameterTypes()) {
                assertFalse(parameterType.isEnum());
            }
        }

        assertTrue(found);
    }
}
