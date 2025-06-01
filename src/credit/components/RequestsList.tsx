/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Paginator } from '@/shared/components/Paginator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { RequestService } from '../services/requestService';
import { ReviewCredit } from './ReviewCredit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { UserService } from '../services/userService';

export function RequestsList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('created_at');
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  const [loading, setLoading] = useState(false);
  const [relatedData, setRelatedData] = useState<any>({});
  const [firstRequest, setFirstRequest] = useState<boolean>(true);
  const [filteredLoading, setFilteredLoading] = useState<boolean>(false);
  const [filterClientId, setFilterClientId] = useState('');
  const [filterStatusId, setFilterStatusId] = useState('');
  const [filterCreditTypeId, setFilterCreditTypeId] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const requestService = new RequestService();

  const allowedSortFields = [
    'created_at',
    'updated_at',
    'requested_amount',
    'approved_amount',
    'term_months',
    'annual_interest_rate',
    'risk_score',
    'id',
    'client_id',
  ];

  useEffect(() => {
    loadRequests(true);
  }, [page, sortOrder, orderBy]);

  async function loadRequests(applyFilters = false) {
    if (applyFilters) {
      setFilteredLoading(true);
    }
    if (firstRequest) {
      setLoading(true);
    }

    const client_id =
      applyFilters && filterClientId ? filterClientId : undefined;
    const status_id =
      applyFilters && filterStatusId ? filterStatusId : undefined;
    const credit_type_id =
      applyFilters && filterCreditTypeId ? filterCreditTypeId : undefined;

    try {
      const res = await requestService.getPaginatedList(
        page,
        limit,
        sortOrder,
        orderBy,
        client_id,
        status_id,
        credit_type_id,
      );
      setRequests(res.data);
      setTotal(res.pagination.total_items);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    } finally {
      if (applyFilters) {
        setFilteredLoading(false);
      }
      if (firstRequest) {
        setLoading(false);
      }
    }
    if (firstRequest) {
      setFirstRequest(false);
    }
  }

  useEffect(() => {
    loadRelatedData();
    loadUsers();
  }, []);

  async function loadRelatedData() {
    try {
      const res = await requestService.getRelatedData();
      setRelatedData(res.data);
    } catch (err) {
      console.error('Error al cargar datos relacionados:', err);
    }
  }

  async function loadUsers() {
    try {
      const res = await UserService.fetchClientUsers(1, 10);
      setUsers(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  }

  const handleSort = (field: string) => {
    const newSortOrder =
      orderBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setOrderBy(field);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    loadRequests(true);
  };

  const handleClearFilters = () => {
    setFilterClientId('');
    setFilterStatusId('');
    setFilterCreditTypeId('');
    setPage(1);
    loadRequests();
  };

  const riks_score_to_text = (score: number) => {
    if (score < 10) {
      return 'Muy bajo';
    } else if (score < 25) {
      return 'Bajo';
    } else if (score < 50) {
      return 'Medio';
    } else if (score < 75) {
      return 'Alto';
    } else {
      return 'Muy alto';
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1 className="mb-8 text-2xl font-bold">Listado de Solicitudes</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="select-w-full">
          <Label
            htmlFor="creditTypeIdFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Usuario
          </Label>
          <Select
            value={filterClientId}
            onValueChange={(value) => setFilterClientId(value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Selecciona usuario"
                title="Selecciona usuario"
              />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user: any) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="select-w-full">
          <Label
            htmlFor="creditTypeIdFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Crédito
          </Label>
          <Select
            value={filterCreditTypeId}
            onValueChange={(value) => setFilterCreditTypeId(value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Selecciona tipo de crédito"
                title="Selecciona tipo de crédito"
              />
            </SelectTrigger>
            <SelectContent>
              {relatedData?.credit_types?.map((type: any) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-full select-w-full">
          <Label htmlFor="status_id">Estado de la Solicitud</Label>
          <Select
            value={filterStatusId}
            onValueChange={(value) => setFilterStatusId(value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Selecciona estado"
                title="Selecciona estado"
              />
            </SelectTrigger>
            <SelectContent>
              {relatedData?.request_statuses?.map((status: any) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3 flex justify-end gap-2">
          <Button onClick={handleApplyFilters} disabled={filteredLoading}>
            {filteredLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Aplicar Filtros</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={filteredLoading}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {loading && firstRequest && <p>Cargando solicitudes...</p>}

      {!loading && !firstRequest && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {allowedSortFields.map((field) => (
                  <TableHead
                    key={field}
                    className="text-left cursor-pointer"
                    onClick={() => handleSort(field)}
                  >
                    {field === 'id' && 'ID'}
                    {field === 'client_id' && 'ID Cliente'}
                    {field === 'requested_amount' && 'Monto Solicitado'}
                    {field === 'approved_amount' && 'Monto Aprobado'}
                    {field === 'term_months' && 'Plazo (Meses)'}
                    {field === 'annual_interest_rate' && 'Tasa Interés Anual'}
                    {field === 'risk_score' && 'Nivel de Riesgo'}
                    {field === 'created_at' && 'Fecha Creación'}
                    {field === 'updated_at' && 'Fecha Actualización'}
                    {orderBy === field &&
                      (sortOrder === 'asc' ? ' ↑' : ' ↓')}{' '}
                    {/* Sort indicator */}
                  </TableHead>
                ))}
                <TableHead className="w-[120px] text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  {/* Map over the allowedSortFields to display data dynamically */}
                  {allowedSortFields.map((field) => (
                    <TableCell key={`${r.id}-${field}`} className="text-left">
                      {field === 'risk_score'
                        ? `${r.risk_score} (${riks_score_to_text(
                            r.risk_score,
                          )})`
                        : field === 'created_at' || field === 'updated_at'
                        ? new Date(r[field]).toLocaleDateString() // Format dates
                        : r[field]}
                    </TableCell>
                  ))}
                  <TableCell className="w-[120px] text-center flex justify-center">
                    <ReviewCredit
                      label="Revisar"
                      className="bg-[#499403] hover:bg-[#8bd149] text-white hover:text-white"
                      requestId={r.id}
                      clientId={r.client_id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div style={{ marginTop: '1rem' }}>
            <Paginator page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
