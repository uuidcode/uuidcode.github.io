public class ContainerClassTest {
    public static void main(String[] args){

        InnerClassWrapper.NoneStaticInnerClass noneStaticInnerClass =
            new InnerClassWrapper().new NoneStaticInnerClass();

        InnerClassWrapper.StaticInnerClass staticInnerClass=
            new InnerClassWrapper.StaticInnerClass();

        noneStaticInnerClass.toString();
        staticInnerClass.toString();
    }
}
