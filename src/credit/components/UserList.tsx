/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { UserService } from '../services/userService';
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
import { useNavigate } from 'react-router-dom';

export function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, [page]);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data, count } = await UserService.fetchClientUsers(page, limit);
      setUsers(data);
      setTotal(count || 0);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1 className="mb-8 text-2xl font-bold">Listado de Clientes</h1>

      {loading && <p>Cargando usuarios...</p>}

      {!loading && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-left">ID</TableHead>
                <TableHead className="w-[200px] text-left">Nombre</TableHead>
                <TableHead className="w-[250px] text-left">Email</TableHead>
                <TableHead className="w-[150px] text-left">Teléfono</TableHead>
                <TableHead className="w-[120px] text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="w-[80px] font-medium text-left">
                    {u.id}
                  </TableCell>
                  <TableCell className="w-[200px] text-left">
                    {u.name || u.full_name}
                  </TableCell>
                  <TableCell className="w-[250px] text-left">
                    {u.email}
                  </TableCell>
                  <TableCell className="w-[150px] text-left">
                    {u.phone}
                  </TableCell>
                  <TableCell className="w-[120px] text-center flex justify-center">
                    <Button
                      className="bg-[#499403] hover:bg-[#8bd149] text-white hover:text-white"
                      onClick={() => navigate(`/credit/init/${u.id}`)}
                      variant="outline"
                    >
                      Crédito
                    </Button>
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
