import { UserList } from '../components/UserList';
import { CreateClient } from '../components/CreateOrEditClient';
import { Helmet } from 'react-helmet-async';

export const Clients = () => {
  return (
    <>
      <Helmet>
        <title>Clientes</title>
        <meta name="description" content="Bienvenido a la página de clientes" />
      </Helmet>
      <div>
        <div className="flex justify-end">
          <CreateClient
            label="Crear Cliente"
            className="bg-[#499403] hover:bg-[#8bd149] text-white hover:text-white"
          />
        </div>
        <UserList />
      </div>
    </>
  );
};
