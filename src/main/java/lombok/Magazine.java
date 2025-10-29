package lombok;

@Value
@Builder
public class Magazine {
    String title;
    Cover cover;
    @With
    Article article;

    public Magazine(Cover cover, Article article) {
        this.cover = cover;
        this.article = article;
        this.title = article.getTitle();

        String result = this.process();

        System.out.println(result);
    }

    public String process() {
        Article tempArticle = this.article.withTitle("temp");
        Magazine magazine = this.withArticle(tempArticle);

        User user = User.builder()
            .magazine(magazine)
            .build();

        return user.getMagazine().getArticle().getTitle();
    }
}
