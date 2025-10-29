package lombok;

public final class Article {
    private final
    String title;
    Like like;

    Article(String title) {
        this.title = title;
        this.like = new Like(this);
        Article childArticle = like.article();

        Magazine.builder()
            .article(childArticle)
            .build();
    }

    public static void main(String[] args) {
        Article article = Article.builder()
            .title("title")
            .build();

        Cover cover = Cover.builder()
            .title("title")
            .build();

        Magazine.builder()
            .title("title")
            .article(article)
            .cover(cover)
            .build();
    }

    public static ArticleBuilder builder() {
        return new ArticleBuilder();
    }

    public String getTitle() {
        return this.title;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Article)) return false;
        final Article other = (Article) o;
        final Object this$title = this.getTitle();
        final Object other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title))
            return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $title = this.getTitle();
        result = result * PRIME + ($title == null ? 43 : $title.hashCode());
        return result;
    }

    public String toString() {
        return "Article(title=" + this.getTitle() + ")";
    }

    public Article withTitle(String title) {
        return this.title == title ? this : new Article(title);
    }

    public static class ArticleBuilder {
        private String title;

        ArticleBuilder() {
        }

        public ArticleBuilder title(String title) {
            this.title = title;
            return this;
        }

        public Article build() {
            return new Article(this.title);
        }

        public String toString() {
            return "Article.ArticleBuilder(title=" + this.title + ")";
        }
    }
}
