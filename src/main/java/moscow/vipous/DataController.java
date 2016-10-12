package moscow.vipous;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Random;

/**
 * Created by vipous on 06.10.16.
 *
 */
@RestController
@RequestMapping
public class DataController {
    private static final String SQL_STR = "select date_time, " +
                "wob, " +
                "wob_norm, " +
                "wob_type1, " +
                "wob_type2, " +
                "wob_type3, " +

                "rop, " +
                "rop_norm, " +
                "rop_type1, " +
                "rop_type2, " +
                "rop_type3, " +

                "rpm, " +
                "rpm_norm, " +
                "rpm_type1, " +
                "rpm_type2, " +
                "rpm_type3, " +

                "flw_pmps, " +
                "flw_pmps_norm, " +
                "flw_pmps_type1, " +
                "flw_pmps_type2, " +
                "flw_pmps_type3, " +

                "bit_depth " +
            "from VW_D_GTI_MULTI_COL2";

    private static final String SQL_STR_BOUND = "select * from D_GTI_BOUND";

    public static final BeanPropertyRowMapper<SimpDataBound> simpDataBoundMapper = new BeanPropertyRowMapper<>(SimpDataBound.class);
    private static RowMapper<SimpData> rowMapper = new BeanPropertyRowMapper<>(SimpData.class);

    private static Random random = new Random();
    private static double MIN = -1;
    private static double MAX = 1;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @RequestMapping("/bound")
    public SimpDataBound getBound(){
        return queryDataBound();
    }

    @Scheduled(fixedRate = 5000)
    private void smplData(){
        simpMessagingTemplate.convertAndSend("/topic/data", queryData());
    }

    @SneakyThrows
    private List<SimpData> queryData(){
        return jdbcTemplate.query(SQL_STR, rowMapper);
    }

    private SimpDataBound queryDataBound(){
        return jdbcTemplate.queryForObject(SQL_STR_BOUND, simpDataBoundMapper);

    }

}
