package screen;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// self 는 찍는 동작이 아니라 자기 UI 를 보였다 숨겼다 하는 토글이다.
// 촬영 경로는 ImageFrame 가시성을 건드리지 않는다.
public class SelfCaptureApiTest {
    private static List<String> declaredMethodNames() {
        List<String> result = new ArrayList<>();

        for (Method method : ScreenShotPanel.class.getDeclaredMethods()) {
            result.add(method.getName());
        }

        return result;
    }

    @Test
    public void toggleSelfExists() {
        assertTrue(declaredMethodNames().contains("toggleSelf"));
    }

    // 자신을 바로 찍어 버리면 영역을 자기 UI 에 맞출 수 없다.
    @Test
    public void thereIsNoShotSelf() {
        assertFalse(declaredMethodNames().contains("shotSelf"));
    }

    @Test
    public void captureConfigNoLongerCarriesSelfMode() {
        CaptureConfig config = new CaptureConfig();

        assertFalse(config.copy().isWindowCaptureMode());

        assertFalse(config.copy().isSeeMode());
    }
}
