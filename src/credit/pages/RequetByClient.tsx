import { useEffect, useState } from 'react';
import { Stepper } from '../components/Steper';
import { ClientProfileForm } from '../components/ClientProfileForm';
import { CreditRequestForm } from '../components/CreditRequestForm';
import { ClientProfileService } from '../services/clientProfileService';
import { useNavigate } from 'react-router-dom';
import { RequestService } from '../services/requestService';
import { ReviewRequest } from '../components/ReviewRequest';
import { Helmet } from 'react-helmet-async';

const steps = [
  {
    id: 'personal',
    title: 'Personal',
    description: 'Datos agrícolas',
  },
  {
    id: 'credit',
    title: 'Crédito',
    description: 'Detalles del crédito',
  },
  {
    id: 'review',
    title: 'Revisar',
    description: 'Revisión de los datos',
  },
];

interface PersonalInfoData {
  user_id: string;
  date_of_birth: Date | null;
  address_line1: string;
  address_city: string;
  address_region: string;
  address_postal_code: string;
  annual_income: number;
  years_of_agricultural_experience: number;
  has_agricultural_insurance: boolean;
  internal_credit_history_score: number;
  current_debt_to_income_ratio: number;
  farm_size_hectares: number;
}

interface AccountInfoData {
  id?: string;
  client_id: string;
  requested_amount: number;
  term_months: number;
  annual_interest_rate: number;
  credit_type_id: string;
  status_id: string;
  purpose_description: string;
  applicant_contribution_amount: number;
  collateral_offered_description: string;
  collateral_value: number;
  number_of_dependents: number;
  other_income_sources: number;
  previous_defaults: boolean;
}

export const RequestByClient = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const step = queryParams.get('step');
    return step ? parseInt(step) : 0;
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    user_id: '',
    date_of_birth: null,
    address_line1: '',
    address_city: '',
    address_region: '',
    address_postal_code: '',
    annual_income: 0,
    years_of_agricultural_experience: 0,
    has_agricultural_insurance: false,
    internal_credit_history_score: 0,
    current_debt_to_income_ratio: 0,
    farm_size_hectares: 0,
  });

  const [accountInfo, setAccountInfo] = useState<AccountInfoData>({
    id: '',
    client_id: '',
    requested_amount: 0,
    term_months: 0,
    annual_interest_rate: 0,
    credit_type_id: '',
    status_id: '',
    purpose_description: '',
    applicant_contribution_amount: 0,
    collateral_offered_description: '',
    collateral_value: 0,
    number_of_dependents: 0,
    other_income_sources: 0,
    previous_defaults: false,
  });

  const clientProfileService = new ClientProfileService();
  const requestService = new RequestService();

  useEffect(() => {
    const queryParams = new URLSearchParams({ step: currentStep.toString() });
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
    const userId = location.pathname.split('/')[3];
    if (currentStep === 0) {
      clientProfileService.getClientProfile(userId).then((data) => {
        setPersonalInfo(data.data);
      });
    }
    if (currentStep === 1) {
      requestService.getRequestByClientId(userId).then((data) => {
        setAccountInfo(data.data);
      });
    }

    if (currentStep === 2) {
      clientProfileService.getClientProfile(userId).then((data) => {
        setPersonalInfo(data.data);
      });
      requestService.getRequestByClientId(userId).then((data) => {
        setAccountInfo(data.data);
      });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    navigate(`/`);
  };
  return (
    <>
      <Helmet>
        <title>Solicitud de Crédito</title>
        <meta
          name="description"
          content="Bienvenido a la página de solicitud de crédito"
        />
      </Helmet>
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Solicitud de Crédito</h1>
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="mt-8">
          {currentStep === 0 && (
            <ClientProfileForm
              data={personalInfo}
              onDataChange={setPersonalInfo}
              onNext={handleNext}
              byClient
            />
          )}
          {currentStep === 1 && (
            <CreditRequestForm
              data={accountInfo}
              onDataChange={setAccountInfo}
              onNext={handleNext}
              onPrevious={handlePrevious}
              byClient
            />
          )}
          {currentStep === 2 && (
            <ReviewRequest
              accountInfo={accountInfo}
              personalInfo={personalInfo}
              onSubmit={handleSubmit}
              onPrevious={handlePrevious}
            />
          )}
        </div>
      </div>
    </>
  );
};
