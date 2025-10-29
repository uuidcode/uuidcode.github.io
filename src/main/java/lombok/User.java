package lombok;

@Value
@Builder
public class User {
    Magazine magazine;

    public User(Magazine magazine) {
        this.magazine = magazine;
    }

    public void hello() {
        String title = this.magazine.getArticle()
            .getTitle();

        System.out.println(title);
    }
}


