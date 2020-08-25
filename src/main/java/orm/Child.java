package orm;

import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import lombok.Data;
import lombok.experimental.Accessors;

@Data(staticConstructor = "of")
@Accessors(chain = true)
public class Child<P, C> {
    private Function<C, Long> key;
    private BiFunction<C, Long, C> bindParentKey;
    private BiFunction<C, List<Long>, C> bindParentKeyList;
    private Supplier<C> supplier;
    private Consumer<C> insert;
    private Consumer<C> update;
    private Consumer<Long> delete;
    private Function<C, List<C>> selectList;

}
