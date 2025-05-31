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
import { RequestService } from '../services/requestService';
import { ReviewCredit } from './ReviewCredit';

export function RequestsList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('id');
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  const [loading, setLoading] = useState(false);
  const requestService = new RequestService();

  useEffect(() => {
    loadRequests();
  }, [page, sortOrder, orderBy]);

  async function loadRequests() {
    setLoading(true);

    try {
      const res = await requestService.getPaginatedList(
        page,
        limit,
        sortOrder,
        orderBy,
      );
      setRequests(res.data);
      setTotal(res.pagination.total_items);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (order: 'asc' | 'desc', field: string) => {
    setSortOrder(order);
    setOrderBy(field);
    setPage(1);
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

      {loading && <p>Cargando solicitudes...</p>}

      {!loading && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[80px] text-left"
                  onClick={() =>
                    handleSort(sortOrder === 'asc' ? 'desc' : 'asc', 'id')
                  }
                >
                  ID
                </TableHead>
                <TableHead
                  className="w-[200px] text-left"
                  onClick={() =>
                    handleSort(
                      sortOrder === 'asc' ? 'desc' : 'asc',
                      'client_id',
                    )
                  }
                >
                  ID Cliente
                </TableHead>
                <TableHead
                  className="w-[250px] text-left"
                  onClick={() =>
                    handleSort(
                      sortOrder === 'asc' ? 'desc' : 'asc',
                      'requested_amount',
                    )
                  }
                >
                  Monto Solicitado
                </TableHead>
                <TableHead
                  className="w-[150px] text-left"
                  onClick={() =>
                    handleSort(
                      sortOrder === 'asc' ? 'desc' : 'asc',
                      'risk_score',
                    )
                  }
                >
                  Nivel de Riesgo
                </TableHead>
                <TableHead className="w-[120px] text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="w-[80px] font-medium text-left">
                    {r.id}
                  </TableCell>
                  <TableCell className="w-[200px] text-left">
                    {r.client_id}
                  </TableCell>
                  <TableCell className="w-[250px] text-left">
                    {r.requested_amount}
                  </TableCell>
                  <TableCell className="w-[150px] text-left">
                    {`${r.risk_score} (${riks_score_to_text(r.risk_score)})`}
                  </TableCell>
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
