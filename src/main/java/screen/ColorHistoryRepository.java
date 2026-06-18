package screen;

import java.awt.Color;
import java.awt.Point;
import java.io.File;
import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ColorHistoryRepository {
    private static final String TABLE_NAME = "color_history";
    private static final int MAX_HISTORY_SIZE = 1000;
    private final File dbFile;
    private final String jdbcUrl;

    public ColorHistoryRepository() {
        this.dbFile = this.resolveDbFile();
        this.jdbcUrl = "jdbc:sqlite:" + this.dbFile.getAbsolutePath();
        this.initSchema();
    }

    public void save(Color color, Point point) {
        String insertSql = "insert into " + TABLE_NAME
            + " (picked_at, red, green, blue, html_color, screen_x, screen_y)"
            + " values (?, ?, ?, ?, ?, ?, ?)";
        String deleteSql = "delete from " + TABLE_NAME
            + " where id not in (select id from " + TABLE_NAME + " order by id desc limit ?)";

        try (Connection connection = DriverManager.getConnection(this.jdbcUrl);
             PreparedStatement insertStatement = connection.prepareStatement(insertSql);
             PreparedStatement deleteStatement = connection.prepareStatement(deleteSql)) {
            connection.setAutoCommit(false);
            insertStatement.setString(1, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
            insertStatement.setInt(2, color.getRed());
            insertStatement.setInt(3, color.getGreen());
            insertStatement.setInt(4, color.getBlue());
            insertStatement.setString(5, String.format("#%02X%02X%02X", color.getRed(), color.getGreen(), color.getBlue()));

            if (point == null) {
                insertStatement.setObject(6, null);
                insertStatement.setObject(7, null);
            } else {
                insertStatement.setInt(6, point.x);
                insertStatement.setInt(7, point.y);
            }

            insertStatement.executeUpdate();
            deleteStatement.setInt(1, MAX_HISTORY_SIZE);
            deleteStatement.executeUpdate();
            connection.commit();
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }

    public List<ColorHistoryEntry> findAll() {
        String sql = "select picked_at, red, green, blue, html_color, screen_x, screen_y"
            + " from " + TABLE_NAME
            + " order by id desc";

        List<ColorHistoryEntry> list = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(this.jdbcUrl);
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                list.add(new ColorHistoryEntry(
                    resultSet.getString("picked_at"),
                    resultSet.getInt("red"),
                    resultSet.getInt("green"),
                    resultSet.getInt("blue"),
                    resultSet.getString("html_color"),
                    (Integer) resultSet.getObject("screen_x"),
                    (Integer) resultSet.getObject("screen_y")
                ));
            }
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }

        return list;
    }

    private void initSchema() {
        String sql = "create table if not exists " + TABLE_NAME + " ("
            + "id integer primary key autoincrement, "
            + "picked_at text not null, "
            + "red integer not null, "
            + "green integer not null, "
            + "blue integer not null, "
            + "html_color text not null, "
            + "screen_x integer, "
            + "screen_y integer"
            + ")";

        try (Connection connection = DriverManager.getConnection(this.jdbcUrl);
             Statement statement = connection.createStatement()) {
            statement.execute(sql);
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }

    private File resolveDbFile() {
        File stableFile = new File(this.resolveProjectDir(), "color-history.db");
        File legacyFile = new File("color-history.db").getAbsoluteFile();

        if (!stableFile.equals(legacyFile) && legacyFile.exists() && !stableFile.exists()) {
            stableFile.getParentFile().mkdirs();
            legacyFile.renameTo(stableFile);
        }

        return stableFile;
    }

    private File resolveProjectDir() {
        try {
            File codeSource = new File(ColorHistoryRepository.class
                .getProtectionDomain()
                .getCodeSource()
                .getLocation()
                .toURI());

            File baseDir = codeSource.isFile() ? codeSource.getParentFile() : codeSource;
            File projectDir = baseDir != null ? baseDir.getParentFile() : null;

            if (projectDir != null) {
                return projectDir;
            }
        } catch (URISyntaxException ignored) {
        }

        return new File(System.getProperty("user.dir"));
    }
}
