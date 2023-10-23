package screen;

import java.awt.Point;

import lombok.Data;
import lombok.experimental.Accessors;

@Data(staticConstructor = "of")
@Accessors(chain = true)
public class Arrow {
    private Point startPoint;
    private Point endPoint;
}
