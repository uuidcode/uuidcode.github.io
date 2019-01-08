import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService extends Google {
    public Payload search(Payload payload) {
        this.logService.log(payload.getQuery());

        List<Page> pageList = new ArrayList<>();
        pageList.add(Page.of().setTitle("youtube").setUrl("www.youtube.com"));
        pageList.add(Page.of().setTitle("facebook").setUrl("www.facebook.com"));

        return Payload.of()
            .setPageList(pageList);
    }
}
