import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class Project {
    private Project project;
    private Integer projectId;

    public Integer getProjectId() {
        return this.projectId;
    }

    public Project setProjectId(Integer projectId) {
        this.projectId = projectId;
        return this;
    }

    public Project getProject() {
        return this.project;
    }

    public Project setProject(Project project) {
        this.project = project;
        return this;
    }

    public void create() {
        for (int i = 0; i < 100; i++) {
            this.project = new Project();
            this.project.setProjectId(i);
        }
    }

    public static void main(String[] args){
        Project project = new Project();

        SoftReference<Project> softReference = new SoftReference<>(project);

        WeakReference<Project> weakReference = new WeakReference<>(project);

        Project currentProject = softReference.get();

        List<Integer> syncList = Collections.synchronizedList(new ArrayList<>());

        Map<Integer, String> syncMap = Collections.synchronizedMap(new HashMap<>());

        Map<Integer, String> concurrentMap = new ConcurrentHashMap<>();

        Set<Integer> syncSet = Collections.synchronizedSet(new HashSet<>());
    }
}
