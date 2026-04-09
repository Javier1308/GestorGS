package com.gs.administraciones.repository;

import com.gs.administraciones.model.entity.Utility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilityRepository extends JpaRepository<Utility, Long> {

    List<Utility> findByBuildingId(Long buildingId);
}
