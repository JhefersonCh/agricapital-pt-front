/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import '../assets/CreditRequestForm.css';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useLocation } from 'react-router-dom';
import { RequestService } from '../services/requestService';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface RelatedData {
  credit_types: { id: string; name: string }[];
  request_statuses: { id: string; name: string }[];
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

interface AccountInfoFormProps {
  data: AccountInfoData;
  onDataChange: (data: AccountInfoData) => void;
  onNext: () => void;
  onPrevious: () => void;
  byClient?: boolean;
}

export function CreditRequestForm({
  data,
  onDataChange,
  onNext,
  onPrevious,
  byClient = false,
}: AccountInfoFormProps) {
  const location = useLocation();
  const requestService = new RequestService();
  const [relatedData, setRelatedData] = useState<RelatedData | null>(null);
  const handleInputChange = (field: keyof AccountInfoData, value: any) => {
    onDataChange({ ...data, [field]: value });
  };

  const handleNumberChange = (field: keyof AccountInfoData, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    onDataChange({ ...data, [field]: numValue });
  };

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const data = await requestService.getRelatedData();
        setRelatedData(data.data);
      } catch (error) {
        console.error('Error fetching related data:', error);
      }
    };
    fetchRelatedData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let request = {
      ...data,
      client_id: location.pathname.split('/')[3],
      previous_defaults: data.previous_defaults === true,
    };
    if (byClient) {
      request = {
        ...request,
        status_id:
          relatedData?.request_statuses?.find((s) => s.name === 'Pendiente')
            ?.id || '',
      };
    }
    requestService.createRequest(request).then(() => {
      onNext();
    });
  };

  const isValid = () => {
    if (byClient) {
      return (
        data?.requested_amount > 0 &&
        data?.term_months > 0 &&
        data?.credit_type_id
      );
    }
    return (
      data?.requested_amount > 0 &&
      data?.term_months > 0 &&
      data?.credit_type_id &&
      data?.status_id
    );
  };

  const monthlyRate = data?.annual_interest_rate / 12;
  const monthlyPayment =
    data?.requested_amount > 0 && data?.term_months > 0 && monthlyRate > 0
      ? (data.requested_amount *
          monthlyRate *
          Math.pow(1 + monthlyRate, data.term_months)) /
        (Math.pow(1 + monthlyRate, data.term_months) - 1)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle title="Información del Crédito">
          Información del Crédito
        </CardTitle>
        <CardDescription>
          Especifica los detalles de tu solicitud de crédito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">ID del Cliente</Label>
                <Input
                  id="client_id"
                  value={data?.client_id}
                  onChange={(e) =>
                    handleInputChange('client_id', e.target.value)
                  }
                  placeholder={location.pathname.split('/')[3]}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500">
                  Este campo se genera automáticamente
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 mt-16">
              Detalles del Crédito
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requested_amount">Monto Solicitado *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <Input
                      id="requested_amount"
                      type="number"
                      value={data?.requested_amount ?? ''}
                      onChange={(e) =>
                        handleNumberChange('requested_amount', e.target.value)
                      }
                      placeholder="1000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term_months">Plazo en Meses *</Label>
                  <Input
                    id="term_months"
                    type="number"
                    value={data?.term_months === 0 ? '' : data?.term_months}
                    onChange={(e) =>
                      handleNumberChange('term_months', e.target.value)
                    }
                    placeholder="12"
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_interest_rate">
                  Tasa de Interés Anual
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                  <Slider
                    id="annual_interest_rate"
                    min={0}
                    max={0.5}
                    step={0.001}
                    value={[data?.annual_interest_rate ?? 0]}
                    onValueChange={(value) =>
                      handleInputChange('annual_interest_rate', value[0])
                    }
                  />
                  <div className="text-right text-sm">
                    {(data?.annual_interest_rate ?? 0 * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 w-full select-w-full">
                  <Label htmlFor="credit_type_id">Tipo de Crédito *</Label>
                  <Select
                    value={data?.credit_type_id}
                    onValueChange={(value) =>
                      handleInputChange('credit_type_id', value)
                    }
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

                {!byClient && (
                  <div className="space-y-2 w-full select-w-full">
                    <Label htmlFor="status_id">Estado de la Solicitud *</Label>
                    <Select
                      value={data?.status_id}
                      onValueChange={(value) =>
                        handleInputChange('status_id', value)
                      }
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
                )}
              </div>

              {monthlyPayment > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Cuota Mensual Estimada
                  </h4>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${monthlyPayment.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Basado en {data?.term_months} meses al{' '}
                    {(data?.annual_interest_rate * 100).toFixed(1)}% anual
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-medium mb-4">Información Adicional</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose_description">
                  Propósito del Crédito
                </Label>
                <Textarea
                  id="purpose_description"
                  value={data?.purpose_description}
                  onChange={(e) =>
                    handleInputChange('purpose_description', e.target.value)
                  }
                  placeholder="Describe para qué necesitas el crédito (ej: Compra de fertilizantes, semillas, etc.)"
                  className="min-h-[100px]"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500">
                  {data?.purpose_description?.length}/1000 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicant_contribution_amount">
                  Aporte Propio
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <Input
                    id="applicant_contribution_amount"
                    type="number"
                    value={
                      data?.applicant_contribution_amount === 0
                        ? ''
                        : data?.applicant_contribution_amount
                    }
                    onChange={(e) =>
                      handleNumberChange(
                        'applicant_contribution_amount',
                        e.target.value,
                      )
                    }
                    placeholder="100"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Monto que puedes aportar de tu propio capital
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collateral_offered_description">
                  Garantía Ofrecida
                </Label>
                <Textarea
                  id="collateral_offered_description"
                  value={data?.collateral_offered_description}
                  onChange={(e) =>
                    handleInputChange(
                      'collateral_offered_description',
                      e.target.value,
                    )
                  }
                  placeholder="Describe la garantía que puedes ofrecer (ej: Motocicleta, terreno, etc.)"
                  className="min-h-[80px]"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500">
                  {data?.collateral_offered_description?.length}/1000 caracteres
                </p>
              </div>
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collateral_value">
                      Valor de la Garantía
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <Input
                        id="collateral_value"
                        type="number"
                        value={data?.collateral_value}
                        onChange={(e) =>
                          handleNumberChange('collateral_value', e.target.value)
                        }
                        placeholder="5000"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number_of_dependents">
                      Número de Dependientes
                    </Label>
                    <Input
                      id="number_of_dependents"
                      type="number"
                      value={data?.number_of_dependents}
                      onChange={(e) =>
                        handleNumberChange(
                          'number_of_dependents',
                          e.target.value,
                        )
                      }
                      placeholder="0"
                      min="0"
                      max="20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other_income_sources">
                    Otros Ingresos (COP)
                  </Label>
                  <Input
                    id="other_income_sources"
                    type="number"
                    value={data?.other_income_sources}
                    onChange={(e) =>
                      handleNumberChange('other_income_sources', e.target.value)
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2 flex items-center gap-2">
                  <Checkbox
                    id="previous_defaults"
                    checked={data?.previous_defaults}
                    onCheckedChange={(e) =>
                      handleInputChange('previous_defaults', e)
                    }
                  />
                  <Label
                    htmlFor="previous_defaults"
                    className="mb-0 cursor-pointer"
                  >
                    ¿Has tenido incumplimientos anteriores?
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Anterior
            </Button>
            <Button type="submit" disabled={!isValid()}>
              Guardar
            </Button>
            {isValid() && data?.id && (
              <Button type="button" variant="outline" onClick={onNext}>
                Siguiente
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
