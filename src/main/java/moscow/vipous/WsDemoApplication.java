package moscow.vipous;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import javax.sql.DataSource;

@SpringBootApplication
@EnableScheduling
@EnableWebSocketMessageBroker
public class WsDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsDemoApplication.class, args);
	}

	@Bean
	@ConfigurationProperties(prefix="datasource.db-smpo")
	public DataSource dataSource() {
		return new DriverManagerDataSource();
	}
}
