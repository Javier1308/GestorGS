import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import type { Building } from '../../types';

interface BuildingsListProps {
  buildings: Building[];
  isLoading: boolean;
  onEdit: (building: Building) => void;
  onView: (building: Building) => void;
  onDelete: (id: number) => void;
}

export default function BuildingsList({
  buildings,
  isLoading,
  onEdit,
  onView,
  onDelete,
}: BuildingsListProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Direccion
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contacto
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              Servicios
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tickets Activos
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estado
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {buildings.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                No hay edificios registrados
              </td>
            </tr>
          ) : (
            buildings.map((building) => (
              <tr
                key={building.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
                  {building.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                  {building.address}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  <div>{building.phone}</div>
                  <div className="text-xs text-slate-400">{building.email}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-slate-600">
                  {building.totalUtilities}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  {building.activeWorkOrders > 0 ? (
                    <Badge color="amber">{building.activeWorkOrders}</Badge>
                  ) : (
                    <Badge color="green">0</Badge>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <Badge color={building.isActive ? 'green' : 'gray'}>
                    {building.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(building)}
                    >
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(building)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(building.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
