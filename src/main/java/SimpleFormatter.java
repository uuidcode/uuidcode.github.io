import java.util.StringTokenizer;

public class SimpleFormatter {
    public static void main(String[] args){
        StringTokenizer tokenizer = new StringTokenizer("select 1 from daul", " ", true);

        while (tokenizer.hasMoreTokens()) {
            String token = tokenizer.nextToken();

            if ("from".equals(token)) {

            }
        }
    }
}
