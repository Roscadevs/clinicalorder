import org.springframework.boot.jdbc.DataSourceBuilder;
import javax.sql.DataSource;

public class TestUrl {
    public static void main(String[] args) {
        DataSource ds = DataSourceBuilder.create()
            .url("postgresql://user:pass@host:5432/db")
            .build();
        System.out.println(ds);
    }
}
