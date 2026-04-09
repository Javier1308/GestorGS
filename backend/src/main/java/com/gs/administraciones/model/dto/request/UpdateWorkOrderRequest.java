package com.gs.administraciones.model.dto.request;

import com.gs.administraciones.model.enums.Priority;
import com.gs.administraciones.model.enums.WorkOrderStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateWorkOrderRequest {

    @Size(max = 200)
    private String title;

    private String description;

    private Long buildingId;

    private Long assignedToId;

    private WorkOrderStatus status;

    private Priority priority;
}
