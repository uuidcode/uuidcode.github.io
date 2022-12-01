package medical;

import java.util.List;

import lombok.Data;
import lombok.experimental.Accessors;

@Data(staticConstructor = "of")
@Accessors(chain = true)
public class Info {
    private String name;
    private List<Person> personList;
}
