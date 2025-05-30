import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RequestsList } from '../components/RequestsList';

export const Credits = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-end">
        <Button
          className="bg-[#499403] hover:bg-[#8bd149] text-white hover:text-white"
          onClick={() => navigate('/credit/clients')}
        >
          Iniciar Crédito
        </Button>
      </div>
      <RequestsList />
    </div>
  );
};
