package com.cdrn.repository;

import com.cdrn.entity.IncidentReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<IncidentReport, Long> {
}
