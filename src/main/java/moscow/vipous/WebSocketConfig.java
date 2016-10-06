package moscow.vipous;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * Created by vipous on 06.10.16.
 *
 */
@Configuration
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer{

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/data").withSockJS();
    }

}
