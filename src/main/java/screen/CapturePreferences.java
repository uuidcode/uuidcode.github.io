package screen;

import java.util.prefs.Preferences;

// 캡처 옵션 중 다음 실행까지 기억해야 하는 값만 OS 사용자 설정에 저장한다.
public class CapturePreferences {
    static final String KEEP_CURRENT_SCREEN_KEY = "keepCurrentScreen";
    static final boolean KEEP_CURRENT_SCREEN_DEFAULT = true;

    private static final Preferences PREFERENCES =
        Preferences.userNodeForPackage(CapturePreferences.class);

    private CapturePreferences() {
    }

    // 저장된 값이 없는 첫 실행에서만 기본값(체크됨)을 쓰고, 그 뒤로는 마지막 선택을 따른다.
    public static boolean isKeepCurrentScreenEnabled() {
        try {
            return PREFERENCES.getBoolean(
                KEEP_CURRENT_SCREEN_KEY, // key
                KEEP_CURRENT_SCREEN_DEFAULT // def
            );
        } catch (Throwable ignored) {
            return KEEP_CURRENT_SCREEN_DEFAULT;
        }
    }

    public static void setKeepCurrentScreenEnabled(boolean enabled) {
        try {
            PREFERENCES.putBoolean(
                KEEP_CURRENT_SCREEN_KEY, // key
                enabled // value
            );

            PREFERENCES.flush();
        } catch (Throwable ignored) {
        }
    }
}
