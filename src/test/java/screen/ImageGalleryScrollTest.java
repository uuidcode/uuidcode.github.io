package screen;

import java.awt.Component;
import java.awt.Container;
import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;

import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JViewport;
import javax.swing.SwingUtilities;

import org.junit.Assume;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

// 갤러리가 선택된 탭의 썸네일을 실제로 화면 안으로 스크롤하는지 실제 위젯 트리로 확인한다.
// 화면이 없는 환경에서는 건너뛴다.
public class ImageGalleryScrollTest {
    private static final int TAB_COUNT = 12;
    private static final int FRAME_WIDTH = 800;
    private static final int FRAME_HEIGHT = 900;

    @Test
    public void selectedThumbnailIsScrolledIntoView() throws Exception {
        Assume.assumeTrue(!GraphicsEnvironment.isHeadless());

        File imageDir = Files.createTempDirectory("gallery-scroll-test").toFile();
        imageDir.deleteOnExit();

        ImageTabPanel tabbedPane = new ImageTabPanel();
        JFrame frame = new JFrame("gallery-scroll-test");

        SwingUtilities.invokeAndWait(() -> {
            frame.setContentPane(tabbedPane);
            frame.setSize(FRAME_WIDTH, FRAME_HEIGHT);

            for (int i = 0; i < TAB_COUNT; i++) {
                String name = "tab" + i;
                tabbedPane.addTab(
                    name, // title
                    newImagePanel(name, imageDir, tabbedPane) // component
                );
            }

            tabbedPane.setSelectedIndex(0);
            tabbedPane.setGalleryVisible(true);

            // 화면 밖에 띄운다. 창이 보이지 않으면 peer 가 없어 Swing 이 레이아웃 자체를 건너뛴다.
            frame.setLocation(-10000, -10000);
            frame.setVisible(true);
        });

        flushEventQueue();

        // 마지막 탭을 선택하면 그 썸네일은 스크롤 영역 오른쪽 바깥에 있다.
        SwingUtilities.invokeAndWait(() -> tabbedPane.setSelectedIndex(TAB_COUNT - 1));

        flushEventQueue();

        assertThumbnailVisible(tabbedPane, TAB_COUNT - 1);

        SwingUtilities.invokeAndWait(frame::dispose);
    }

    // 갤러리를 처음 켜는 순간에는 갤러리 패널이 막 만들어져 레이아웃 전이다.
    // 이때도 선택된 탭의 썸네일이 보여야 한다.
    @Test
    public void selectedThumbnailIsVisibleWhenGalleryIsTurnedOn() throws Exception {
        Assume.assumeTrue(!GraphicsEnvironment.isHeadless());

        File imageDir = Files.createTempDirectory("gallery-toggle-test").toFile();
        imageDir.deleteOnExit();

        ImageTabPanel tabbedPane = new ImageTabPanel();
        JFrame frame = new JFrame("gallery-toggle-test");

        SwingUtilities.invokeAndWait(() -> {
            frame.setContentPane(tabbedPane);
            frame.setSize(FRAME_WIDTH, FRAME_HEIGHT);

            for (int i = 0; i < TAB_COUNT; i++) {
                String name = "tab" + i;
                tabbedPane.addTab(
                    name, // title
                    newImagePanel(name, imageDir, tabbedPane) // component
                );
            }

            // 갤러리를 켜기 전에 마지막 탭을 선택해 둔다.
            tabbedPane.setSelectedIndex(TAB_COUNT - 1);

            frame.setLocation(-10000, -10000);
            frame.setVisible(true);
        });

        flushEventQueue();

        SwingUtilities.invokeAndWait(() -> tabbedPane.setGalleryVisible(true));

        flushEventQueue();

        assertThumbnailVisible(tabbedPane, TAB_COUNT - 1);

        SwingUtilities.invokeAndWait(frame::dispose);
    }

    // 갤러리를 켜 둔 채로 새 탭을 캡처하면, 그 탭 패널은 아직 한 번도 레이아웃되지 않은 상태다.
    // ImageTabPanel.addTab() 의 마지막 순서(탭 추가 → 선택 → 갤러리 표시)를 그대로 따라간다.
    @Test
    public void newTabThumbnailIsScrolledIntoView() throws Exception {
        Assume.assumeTrue(!GraphicsEnvironment.isHeadless());

        File imageDir = Files.createTempDirectory("gallery-newtab-test").toFile();
        imageDir.deleteOnExit();

        ImageTabPanel tabbedPane = new ImageTabPanel();
        JFrame frame = new JFrame("gallery-newtab-test");

        SwingUtilities.invokeAndWait(() -> {
            frame.setContentPane(tabbedPane);
            frame.setSize(FRAME_WIDTH, FRAME_HEIGHT);

            for (int i = 0; i < TAB_COUNT; i++) {
                String name = "tab" + i;
                tabbedPane.addTab(
                    name, // title
                    newImagePanel(name, imageDir, tabbedPane) // component
                );
            }

            tabbedPane.setSelectedIndex(0);
            tabbedPane.setGalleryVisible(true);

            frame.setLocation(-10000, -10000);
            frame.setVisible(true);
        });

        flushEventQueue();

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel added = newImagePanel("added", imageDir, tabbedPane);

            tabbedPane.addTab(
                "added", // title
                added // component
            );

            tabbedPane.setSelectedComponent(added);
            added.setGalleryVisible(true);
        });

        flushEventQueue();

        assertThumbnailVisible(tabbedPane, TAB_COUNT);

        SwingUtilities.invokeAndWait(frame::dispose);
    }

    private static void assertThumbnailVisible(ImageTabPanel tabbedPane, int index) {
        ImagePanel selected = (ImagePanel) tabbedPane.getSelectedComponent();
        JScrollPane scrollPane = findGalleryScrollPane(selected);
        assertNotNull("갤러리 스크롤 패널을 찾지 못했다", scrollPane);

        JViewport viewport = scrollPane.getViewport();
        Container strip = (Container) viewport.getView();
        JLabel thumbnail = (JLabel) strip.getComponent(index);

        Rectangle visible = new Rectangle(
            viewport.getViewPosition().x, // x
            viewport.getViewPosition().y, // y
            viewport.getWidth(), // width
            viewport.getHeight() // height
        );

        assertTrue(
            "썸네일 좌표가 잡히지 않았다: " + thumbnail.getBounds(),
            thumbnail.getWidth() > 0
        );

        assertTrue(
            "선택된 썸네일이 보이지 않는다. visible=" + visible + " thumbnail=" + thumbnail.getBounds(),
            visible.contains(thumbnail.getBounds())
        );
    }

    private static ImagePanel newImagePanel(String name, File imageDir, ImageTabPanel tabbedPane) {
        try {
            File imageFile = new File(imageDir, name + ".png");
            ImageIO.write(
                new BufferedImage(400, 300, BufferedImage.TYPE_INT_RGB), // im
                "png", // formatName
                imageFile // output
            );

            return new ImagePanel(
                name,
                imageFile,
                tabbedPane,
                null, // captureRectangle
                null, // captureConfig
                false // windowCapture
            );
        } catch (Exception exception) {
            throw new IllegalStateException(exception);
        }
    }

    // 갤러리 패널 안의 스크롤 패널을 위젯 트리에서 찾는다.
    private static JScrollPane findGalleryScrollPane(Container container) {
        for (Component component : container.getComponents()) {
            if (component instanceof JScrollPane && component.getParent() instanceof ImageGalleryPanel) {
                return (JScrollPane) component;
            }

            if (component instanceof Container) {
                JScrollPane found = findGalleryScrollPane((Container) component);

                if (found != null) {
                    return found;
                }
            }
        }

        return null;
    }

    // invokeLater 로 미뤄둔 스크롤과 레이아웃이 모두 끝날 때까지 EDT 를 비운다.
    private static void flushEventQueue() throws Exception {
        for (int i = 0; i < 10; i++) {
            SwingUtilities.invokeAndWait(() -> { });
        }
    }
}
