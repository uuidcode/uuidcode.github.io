public class Math {
    public static void main(String[] args) {
        for (int i = 1; i <= 1000; i++) {
            if (i % 4 == 3 && i % 3 == 2) {
                System.out.println(i);
            }
        }
    }
}
