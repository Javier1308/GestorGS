import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { useBuildingUtilities, useCreateUtility } from '../../hooks/useBuildings';
import type { Building } from '../../types';

const utilitySchema = z.object({
  name: z.string().min(1, 'Ingrese el nombre del servicio'),
  accountNumber: z.string().min(1, 'Ingrese el numero de cuenta'),
});

type UtilityFormData = z.infer<typeof utilitySchema>;

interface BuildingDetailProps {
  building: Building;
  onClose: () => void;
}

export default function BuildingDetail({
  building,
  onClose,
}: BuildingDetailProps) {
  const { data: utilities = [], isLoading } = useBuildingUtilities(building.id);
  const createUtility = useCreateUtility();
  const [showAddUtility, setShowAddUtility] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UtilityFormData>({
    resolver: zodResolver(utilitySchema),
  });

  const onSubmitUtility = (data: UtilityFormData) => {
    createUtility.mutate(
      { buildingId: building.id, data },
      {
        onSuccess: () => {
          reset();
          setShowAddUtility(false);
        },
      }
    );
  };

  return (
    <Modal isOpen onClose={onClose} title={building.name} size="lg">
      <div className="space-y-6">
        {/* Building info */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
          <div>
            <p className="text-xs text-slate-500">Direccion</p>
            <p className="text-sm font-medium text-slate-700">
              {building.address}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Telefono</p>
            <p className="text-sm font-medium text-slate-700">
              {building.phone}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-700">
              {building.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Estado</p>
            <Badge color={building.isActive ? 'green' : 'gray'}>
              {building.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>

        {/* Utilities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">
              Servicios ({utilities.length})
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddUtility(!showAddUtility)}
            >
              {showAddUtility ? 'Cancelar' : 'Agregar Servicio'}
            </Button>
          </div>

          {/* Add utility form */}
          {showAddUtility && (
            <form
              onSubmit={handleSubmit(onSubmitUtility)}
              className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
            >
              <Input
                label="Nombre del Servicio"
                placeholder="Ej: Agua, Luz, Gas"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Numero de Cuenta"
                placeholder="Ej: 12345678"
                error={errors.accountNumber?.message}
                {...register('accountNumber')}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={createUtility.isPending}
                >
                  Agregar
                </Button>
              </div>
            </form>
          )}

          {/* Utilities list */}
          {isLoading ? (
            <Spinner size="sm" className="py-4" />
          ) : utilities.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">
              No hay servicios registrados
            </p>
          ) : (
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {utilities.map((utility) => (
                <div
                  key={utility.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {utility.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Cuenta: {utility.accountNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
