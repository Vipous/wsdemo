package moscow.vipous;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimpData {
    //@DateTimeFormat(pattern = DateTimeFormatter.ISO_LOCAL_DATE_TIME)
    private Date date_time;

    private BigDecimal wob;
    private BigDecimal wob_norm;
    private Integer wob_type1;
    private Integer wob_type2;
    private Integer wob_type3;

    private BigDecimal rop;
    private BigDecimal rop_norm;
    private Integer rop_type1;
    private Integer rop_type2;
    private Integer rop_type3;

    private BigDecimal rpm;
    private BigDecimal rpm_norm;
    private Integer rpm_type1;
    private Integer rpm_type2;
    private Integer rpm_type3;

    private BigDecimal flw_pmps;
    private BigDecimal flw_pmps_norm;
    private Integer flw_pmps_type1;
    private Integer flw_pmps_type2;
    private Integer flw_pmps_type3;

    private BigDecimal bit_depth;
}
