@Controller
public class SearchController extends Google {
    @RequestMapping("/search")
    public Payload search(Payload payload) {
        return this.searchService.search(payload);
    }
}
