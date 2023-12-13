package com.mesumo.msclubs.models.repository;

import com.mesumo.msclubs.models.entities.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ISlotRepository extends JpaRepository<Slot, Long>, JpaSpecificationExecutor<Slot> {
}
