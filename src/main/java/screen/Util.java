package screen;

import java.io.File;

public class Util {
    public static File getImageFile(String name) {
        return new File("screenshot/" + name + ".png");
    }
}
