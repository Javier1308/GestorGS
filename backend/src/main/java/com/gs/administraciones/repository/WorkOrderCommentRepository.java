package com.gs.administraciones.repository;

import com.gs.administraciones.model.entity.WorkOrderComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderCommentRepository extends JpaRepository<WorkOrderComment, Long> {

    List<WorkOrderComment> findByWorkOrderIdOrderByCreatedAtAsc(Long workOrderId);
}
