package com.gs.administraciones.repository;

import com.gs.administraciones.model.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {

    long countByIsActiveTrue();
}
