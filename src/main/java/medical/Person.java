package medical;

import lombok.Data;
import lombok.experimental.Accessors;

@Data(staticConstructor = "of")
@Accessors(chain = true)
public class Person {
    private String name;
    private String number1;
    private String number2;
    private String phone1;
    private String phone2;
    private String phone3;
    private boolean owner;
    private Bank bank;
}
