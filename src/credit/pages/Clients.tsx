import { UserList } from '../components/UserList';
import { CreateClient } from '../components/CreateOrEditClient';

export const Clients = () => {
  return (
    <div>
      <div className="flex justify-end">
        <CreateClient
          label="Crear Cliente"
          className="bg-[#499403] hover:bg-[#8bd149] text-white hover:text-white"
        />
      </div>
      <UserList />
    </div>
  );
};
