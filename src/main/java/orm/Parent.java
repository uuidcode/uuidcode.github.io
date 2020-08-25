package orm;

import java.util.List;
import java.util.function.Function;

import lombok.Data;
import lombok.experimental.Accessors;

@Data(staticConstructor = "of")
@Accessors(chain = true)
public class Parent<P, C> {
    private Function<P, Long> key;
    private Function<P, List<C>> childList;
}
