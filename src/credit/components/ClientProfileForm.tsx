'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ClientProfileService } from '../services/clientProfileService';
import { useLocation, useNavigate } from 'react-router-dom';

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

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onDataChange: (data: PersonalInfoData) => void;
  onNext: () => void;
  byClient?: boolean;
}

export function ClientProfileForm({
  data,
  onDataChange,
  onNext,
  byClient = false,
}: PersonalInfoFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleInputChange = <K extends keyof PersonalInfoData>(
    field: K,
    value: PersonalInfoData[K],
  ) => {
    onDataChange({ ...data, [field]: value });
  };

  const handleNumberChange = (field: keyof PersonalInfoData, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    onDataChange({ ...data, [field]: numValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newData = {};
    if (data.date_of_birth) {
      newData = {
        ...data,
        date_of_birth:
          typeof data.date_of_birth === 'string'
            ? data.date_of_birth
            : data.date_of_birth.toISOString().split('T')[0],
        user_id: location.pathname.split('/')[3],
      };
    }
    const clientProfileService = new ClientProfileService();
    clientProfileService.createClientProfile(newData).then();
    onNext();
  };

  const isValid =
    data.date_of_birth &&
    data.address_line1 &&
    data.address_city &&
    data.address_region &&
    data.address_postal_code;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal y Agrícola</CardTitle>
        <CardDescription>
          Ingresa tu información personal y detalles agrícolas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6 mt-8">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Fecha de Nacimiento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !data.date_of_birth && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data.date_of_birth
                        ? format(data.date_of_birth, 'PPP', { locale: es })
                        : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={data.date_of_birth ?? undefined}
                      onSelect={(date) =>
                        handleInputChange('date_of_birth', date ?? null)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line1">Dirección *</Label>
                <Input
                  id="address_line1"
                  value={data.address_line1}
                  onChange={(e) =>
                    handleInputChange('address_line1', e.target.value)
                  }
                  placeholder="Calle y número"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div className="space-y-2">
                <Label htmlFor="address_city">Ciudad *</Label>
                <Input
                  id="address_city"
                  value={data.address_city}
                  onChange={(e) =>
                    handleInputChange('address_city', e.target.value)
                  }
                  placeholder="Ciudad"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_region">Estado/Región *</Label>
                <Input
                  id="address_region"
                  value={data.address_region}
                  onChange={(e) =>
                    handleInputChange('address_region', e.target.value)
                  }
                  placeholder="Estado o región"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_postal_code">Código Postal *</Label>
                <Input
                  id="address_postal_code"
                  value={data.address_postal_code}
                  onChange={(e) =>
                    handleInputChange('address_postal_code', e.target.value)
                  }
                  placeholder="Código postal"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6 mt-16">
              Información Financiera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual_income">Ingreso Anual</Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">COP </span>
                  <Input
                    id="annual_income"
                    type="number"
                    value={data.annual_income || ''}
                    onChange={(e) =>
                      handleNumberChange('annual_income', e.target.value)
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_debt_to_income_ratio">
                  Ratio de Deuda a Ingreso
                </Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={[data.current_debt_to_income_ratio]}
                  onValueChange={(val) =>
                    handleInputChange('current_debt_to_income_ratio', val[0])
                  }
                />
                <div className="text-right text-sm">
                  {(data.current_debt_to_income_ratio * 100).toFixed(0)}%
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="internal_credit_history_score">
                  Puntaje de Historial Crediticio
                </Label>
                <Slider
                  min={0}
                  max={1000}
                  step={1}
                  value={[data.internal_credit_history_score]}
                  onValueChange={(val) =>
                    handleInputChange('internal_credit_history_score', val[0])
                  }
                />
                <div className="text-right text-sm">
                  {data.internal_credit_history_score}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium my-6 mt-16">
              Información Agrícola
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_of_agricultural_experience">
                  Años de Experiencia Agrícola
                </Label>
                <Input
                  id="years_of_agricultural_experience"
                  type="number"
                  value={data.years_of_agricultural_experience || ''}
                  onChange={(e) =>
                    handleNumberChange(
                      'years_of_agricultural_experience',
                      e.target.value,
                    )
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farm_size_hectares">
                  Tamaño de la Granja (hectáreas)
                </Label>
                <Input
                  id="farm_size_hectares"
                  type="number"
                  step="0.1"
                  value={data.farm_size_hectares || ''}
                  onChange={(e) =>
                    handleNumberChange('farm_size_hectares', e.target.value)
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-center  pt-2">
                <Label htmlFor="has_agricultural_insurance">
                  <Switch
                    id="has_agricultural_insurance"
                    checked={data.has_agricultural_insurance}
                    onCheckedChange={(val) =>
                      handleInputChange('has_agricultural_insurance', val)
                    }
                  />
                  ¿Tienes seguro agrícola?
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(!byClient ? '/credit/clients' : '/')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Guardar
            </Button>
            {isValid && data?.user_id && (
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
