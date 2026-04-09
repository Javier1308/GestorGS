import { useState } from 'react';
import { useBuildings, useDeleteBuilding } from '../hooks/useBuildings';
import BuildingsList from '../components/buildings/BuildingsList';
import BuildingForm from '../components/buildings/BuildingForm';
import BuildingDetail from '../components/buildings/BuildingDetail';
import Button from '../components/ui/Button';
import type { Building } from '../types';

export default function BuildingsPage() {
  const { data: buildings = [], isLoading } = useBuildings();
  const deleteBuilding = useDeleteBuilding();
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [viewingBuilding, setViewingBuilding] = useState<Building | null>(null);

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBuilding(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Esta seguro de eliminar este edificio?')) {
      deleteBuilding.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edificios</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona los edificios y sus servicios
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Edificio
        </Button>
      </div>

      <BuildingsList
        buildings={buildings}
        isLoading={isLoading}
        onEdit={handleEdit}
        onView={(b) => setViewingBuilding(b)}
        onDelete={handleDelete}
      />

      <BuildingForm
        isOpen={showForm}
        onClose={handleCloseForm}
        building={editingBuilding}
      />

      {viewingBuilding && (
        <BuildingDetail
          building={viewingBuilding}
          onClose={() => setViewingBuilding(null)}
        />
      )}
    </div>
  );
}
