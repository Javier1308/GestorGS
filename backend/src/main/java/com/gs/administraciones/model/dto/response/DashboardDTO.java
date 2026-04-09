package com.gs.administraciones.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {
    private Long overduePaymentsCount;
    private Long openWorkOrdersCount;
    private Long activeUsersCount;
    private Long buildingsCount;
    private List<ActivityLogDTO> recentActivity;
}
