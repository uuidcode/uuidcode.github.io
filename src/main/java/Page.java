public class Page {
    private String title;
    private String url;

    public String getUrl() {
        return this.url;
    }

    public Page setUrl(String url) {
        this.url = url;
        return this;
    }

    public String getTitle() {
        return this.title;
    }

    public Page setTitle(String title) {
        this.title = title;
        return this;
    }

    public static Page of() {
        return new Page();
    }
}
