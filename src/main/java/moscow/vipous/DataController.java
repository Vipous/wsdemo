package moscow.vipous;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.Random;

/**
 * Created by vipous on 06.10.16.
 *
 */
@Controller
public class DataController {

    private static Random random = new Random();

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Scheduled(fixedDelay = 100)
    private void smplData(){
        simpMessagingTemplate.convertAndSend("/topic/data", new SimpData(random.nextInt()));
    }

    @Data
    @AllArgsConstructor
    public static class SimpData{
        private int data;
    }

}
