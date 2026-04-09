import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useWorkOrder, useAddComment } from '../../hooks/useWorkOrders';
import type { Priority, WorkOrderStatus } from '../../types';

const commentSchema = z.object({
  content: z.string().min(1, 'Escriba un comentario'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface WorkOrderDetailProps {
  workOrderId: number;
  onClose: () => void;
}

const priorityBadge: Record<Priority, { color: 'blue' | 'amber' | 'orange' | 'red'; label: string }> = {
  BAJA: { color: 'blue', label: 'Baja' },
  MEDIA: { color: 'amber', label: 'Media' },
  ALTA: { color: 'orange', label: 'Alta' },
  URGENTE: { color: 'red', label: 'Urgente' },
};

const statusLabels: Record<WorkOrderStatus, string> = {
  ABIERTA: 'Abierta',
  EN_PROGRESO: 'En Progreso',
  COMPLETADA: 'Completada',
  CERRADA: 'Cerrada',
};

export default function WorkOrderDetail({
  workOrderId,
  onClose,
}: WorkOrderDetailProps) {
  const { data: workOrder, isLoading } = useWorkOrder(workOrderId);
  const addComment = useAddComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmitComment = (data: CommentFormData) => {
    addComment.mutate(
      { workOrderId, data },
      { onSuccess: () => reset() }
    );
  };

  return (
    <Modal isOpen onClose={onClose} title={`Ticket WO-${workOrderId}`} size="lg">
      {isLoading || !workOrder ? (
        <div className="py-8">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {workOrder.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge color={priorityBadge[workOrder.priority].color}>
                {priorityBadge[workOrder.priority].label}
              </Badge>
              <Badge color="violet">{statusLabels[workOrder.status]}</Badge>
              <span className="text-xs text-slate-500">
                {workOrder.buildingName}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-1 text-sm font-medium text-slate-600">
              Descripcion
            </h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {workOrder.description}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-xs text-slate-500">Creado por</p>
              <p className="text-sm font-medium text-slate-700">
                {workOrder.createdByName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Asignado a</p>
              <p className="text-sm font-medium text-slate-700">
                {workOrder.assignedToName || 'Sin asignar'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Creado</p>
              <p className="text-sm font-medium text-slate-700">
                {format(new Date(workOrder.createdAt), "dd MMM yyyy HH:mm", { locale: es })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Actualizado</p>
              <p className="text-sm font-medium text-slate-700">
                {formatDistanceToNow(new Date(workOrder.updatedAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-700">
              Comentarios ({workOrder.comments?.length || 0})
            </h4>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin">
              {(!workOrder.comments || workOrder.comments.length === 0) ? (
                <p className="text-sm text-slate-500">Sin comentarios aun</p>
              ) : (
                workOrder.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add comment form */}
            <form
              onSubmit={handleSubmit(onSubmitComment)}
              className="flex gap-2"
            >
              <div className="flex-1">
                <textarea
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  rows={2}
                  placeholder="Agregar un comentario..."
                  {...register('content')}
                />
                {errors.content?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="sm"
                isLoading={addComment.isPending}
                className="self-end"
              >
                Enviar
              </Button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
