package screen;

import java.io.File;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

// write 는 master 에서만 수행되고 끝나면 원래 브랜치로 돌아와야 한다.
// 임시 저장소를 만들어 브랜치 전환만 검증한다. 원격 push 는 하지 않는다.
public class WriteBranchUnitTest {
    private File repositoryDirectory;

    @Before
    public void createRepository() throws Exception {
        this.repositoryDirectory = Files.createTempDirectory("write-branch-test-").toFile();

        git("init", "-q");
        git("config", "user.email", "test@example.com");
        git("config", "user.name", "test");
        git("checkout", "-q", "-b", "master");

        Files.write(
            new File(this.repositoryDirectory, "readme.txt").toPath(),
            "hello".getBytes(StandardCharsets.UTF_8)
        );

        git("add", "readme.txt");
        git("commit", "-q", "-m", "init");
    }

    @After
    public void removeRepository() throws Exception {
        deleteRecursively(this.repositoryDirectory);
    }

    private void git(String... arguments) throws Exception {
        List<String> command = new ArrayList<>();
        command.add("git");
        command.addAll(Arrays.asList(arguments));

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(this.repositoryDirectory);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        if (process.waitFor() != 0) {
            throw new IllegalStateException("git " + String.join(" ", arguments) + " failed.");
        }
    }

    private static void deleteRecursively(File file) {
        if (file == null || !file.exists()) {
            return;
        }

        File[] children = file.listFiles();

        if (children != null) {
            for (File child : children) {
                deleteRecursively(child);
            }
        }

        file.delete();
    }

    private static Object invoke(
        String name,
        Object... arguments
    ) throws Exception {
        for (Method method : ImagePanel.class.getDeclaredMethods()) {
            if (!method.getName().equals(name)) {
                continue;
            }

            method.setAccessible(true);

            return method.invoke(null, arguments);
        }

        throw new IllegalStateException(name + " not found.");
    }

    private String currentRef() throws Exception {
        return (String) invoke("gitCurrentRef", this.repositoryDirectory);
    }

    @Test
    public void currentRefReportsBranchName() throws Exception {
        assertEquals(
            "master", // expected
            this.currentRef() // actual
        );
    }

    // 다른 브랜치에서 write 하면 master 로 옮기고, 돌아갈 자리를 알려 줘야 한다.
    @Test
    public void checkoutMovesToMasterAndRemembersPreviousBranch() throws Exception {
        this.git("checkout", "-q", "-b", "feature");

        String previousRef = (String) invoke("checkoutWriteBranch", this.repositoryDirectory);

        assertEquals(
            "feature", // expected
            previousRef // actual
        );

        assertEquals(
            "master", // expected
            this.currentRef() // actual
        );
    }

    // 이미 master 면 옮길 것도 되돌릴 것도 없다.
    @Test
    public void checkoutOnMasterHasNothingToRestore() throws Exception {
        assertNull(invoke("checkoutWriteBranch", this.repositoryDirectory));

        assertEquals(
            "master", // expected
            this.currentRef() // actual
        );
    }

    @Test
    public void restoreReturnsToPreviousBranch() throws Exception {
        this.git("checkout", "-q", "-b", "feature");

        String previousRef = (String) invoke("checkoutWriteBranch", this.repositoryDirectory);

        invoke(
            "restorePreviousRef",
            this.repositoryDirectory,
            previousRef
        );

        assertEquals(
            "feature", // expected
            this.currentRef() // actual
        );
    }

    // 되돌릴 대상이 없으면 브랜치를 건드리지 않아야 한다.
    @Test
    public void restoreWithNullKeepsCurrentBranch() throws Exception {
        invoke(
            "restorePreviousRef",
            this.repositoryDirectory,
            null
        );

        assertEquals(
            "master", // expected
            this.currentRef() // actual
        );
    }

    // detached HEAD 에서는 브랜치 이름이 없으므로 커밋 해시로 돌아와야 한다.
    @Test
    public void detachedHeadIsRestoredByCommitHash() throws Exception {
        this.git("checkout", "-q", "--detach");

        String detachedRef = this.currentRef();

        // 브랜치 이름이 아니라 커밋 해시여야 한다.
        assertEquals(
            40, // expected
            detachedRef.length() // actual
        );

        String previousRef = (String) invoke("checkoutWriteBranch", this.repositoryDirectory);

        assertEquals(
            detachedRef, // expected
            previousRef // actual
        );

        assertEquals(
            "master", // expected
            this.currentRef() // actual
        );

        invoke(
            "restorePreviousRef",
            this.repositoryDirectory,
            previousRef
        );

        assertEquals(
            detachedRef, // expected
            this.currentRef() // actual
        );
    }
}
