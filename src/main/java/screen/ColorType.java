package screen;

import java.awt.Color;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Accessors(chain = true)
public enum ColorType {
    BLUE,
    GREEN;

    @Setter
    private Color color;

    static {
        BLUE.setColor(new Color(124, 166, 208, 255));
        GREEN.setColor(new Color(102, 255, 102, 255));
    }

}
