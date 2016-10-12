package moscow.vipous;

import lombok.Data;

import java.util.Date;

/**
 * Created by vipous on 10.10.16.
 *
 */
@Data
public class SimpDataBound {
    private String nodeId;
    private Date dateTimeFrom;
    private Date dateTimeTo;
}
