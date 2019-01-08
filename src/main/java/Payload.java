import java.util.List;

public class Payload {
    private String query;
    private List<Page> pageList;

    public List<Page> getPageList() {
        return this.pageList;
    }

    public Payload setPageList(List<Page> pageList) {
        this.pageList = pageList;
        return this;
    }

    public static Payload of() {
        return new Payload();
    }

    public String getQuery() {
        return this.query;
    }

    public Payload setQuery(String query) {
        this.query = query;
        return this;
    }
}
