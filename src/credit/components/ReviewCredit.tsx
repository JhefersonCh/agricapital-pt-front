/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import {
  CalendarDays,
  DollarSign,
  FileText,
  MapPin,
  TrendingUp,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { Request } from '../interfaces/requestInterface';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Client } from '../interfaces/clientInterface';
import { RequestService } from '../services/requestService';
import { ClientProfileService } from '../services/clientProfileService';
import { Input } from '@/components/ui/input';

export function ReviewCredit({
  className,
  label,
  icon,
  requestId,
  clientId,
}: {
  className?: string;
  label: string;
  icon?: React.ReactNode;
  requestId: string;
  clientId: string;
}) {
  const [requestStatus, setRequestStatus] = useState<
    { id: string; name: string }[]
  >([]);
  const [request, setRequest] = useState<Request>({
    id: '',
    client_id: '',
    requested_amount: 0,
    term_months: 0,
    annual_interest_rate: 0,
    credit_type_id: '',
    status_id: '',
    approved_amount: 0,
    approved_at: null,
    analyst_id: null,
    rejection_reason: null,
    risk_score: 0,
    risk_assessment_details: {
      monthly_payment: 0,
      age_calculated: 0,
      weights_applied: {
        collateral: 0,
        debt_burden: 0,
        demographics: 0,
        credit_history: 0,
        payment_capacity: 0,
        agricultural_profile: 0,
        loan_characteristics: 0,
      },
      final_risk_score: 0,
      scores_by_category: {
        collateral: 0,
        debt_burden: 0,
        demographics: 0,
        credit_history: 0,
        payment_capacity: 0,
        agricultural_profile: 0,
        loan_characteristics: 0,
      },
      total_positive_score: 0,
      payment_to_income_ratio: 0,
    },
    purpose_description: '',
    applicant_contribution_amount: 0,
    collateral_offered_description: '',
    collateral_value: 0,
    number_of_dependents: 0,
    other_income_sources: 0,
    previous_defaults: 0,
    created_at: new Date(),
    updated_at: new Date(),
    credit_type: {
      name: '',
      description: '',
      code: '',
      updated_at: new Date(),
      id: '',
      is_active: true,
      created_at: new Date(),
    },
    status: {
      name: '',
      description: '',
      code: '',
      updated_at: new Date(),
      id: '',
      is_active: true,
      created_at: new Date(),
    },
  });

  const [clientProfile, setClientProfile] = useState<Client>({
    user_id: '',
    date_of_birth: new Date(),
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
    created_at: new Date(),
    updated_at: new Date(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const requestService = useCallback(() => new RequestService(), []);
  const clientService = useCallback(() => new ClientProfileService(), []);

  const loadData = useCallback(async () => {
    if (!requestId || !clientId || loading) return;

    setLoading(true);
    try {
      const [requestRes, clientRes, relatedData] = await Promise.all([
        requestService().getRequestById(requestId),
        clientService().getClientProfile(clientId),
        requestService().getRelatedData(),
      ]);

      setRequest(requestRes.data);
      setClientProfile(clientRes.data);
      setRequestStatus(relatedData.data.request_statuses);
      setSelectedStatus(requestRes.data.status_id);
      setRejectionReason(requestRes.data.rejection_reason);
      setApprovedAmount(requestRes.data.approved_amount);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [requestId, clientId, loading, requestService, clientService]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      const timeout = setTimeout(() => {
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'default';
  };
  const getRiskLabel = (score: number) => {
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

  const handleSubmit = async () => {
    try {
      if (
        selectedStatus ===
        requestStatus.find((status: any) => status.code === 'APPROVED')?.id
      ) {
        await requestService().approveRequest(requestId, {
          status_id: selectedStatus,
          approved_amount: Number(approvedAmount),
        });
      } else if (
        selectedStatus ===
        requestStatus.find((status: any) => status.code === 'REJECTED')?.id
      ) {
        await requestService().rejectRequest(requestId, {
          status_id: selectedStatus,
          rejection_reason: rejectionReason,
        });
      } else {
        await requestService().changeRequestStatus(requestId, selectedStatus);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={className}
          onClick={() => loadData()}
        >
          {icon ? icon : label}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-h-[90vh] overflow-y-auto sm:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Revisión de Solicitud de Crédito
          </DialogTitle>
          <DialogDescription>ID: {request.id}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Monto Solicitado
                  </Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(request.requested_amount)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Plazo
                  </Label>
                  <p className="text-lg font-semibold">
                    {request.term_months} meses
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tasa Anual
                  </Label>
                  <p className="text-lg font-semibold">
                    {(request.annual_interest_rate * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Pago Mensual
                  </Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      request.risk_assessment_details?.monthly_payment,
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tipo de Crédito
                  </Label>
                  <p className="font-medium">{request.credit_type?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.credit_type?.description}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Estado Actual
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{request.status?.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.status?.description}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Propósito
                </Label>
                <p className="font-medium">{request.purpose_description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Evaluación de Riesgo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Evaluación de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Puntuación de Riesgo
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {request.risk_score?.toFixed(1)}
                    </span>
                    <Badge variant={getRiskBadgeColor(request.risk_score)}>
                      {getRiskLabel(request.risk_score)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Puntuación Positiva Total
                  </Label>
                  <p className="text-xl font-semibold text-green-600">
                    {request.risk_assessment_details?.total_positive_score.toFixed(
                      1,
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Puntuaciones por Categoría
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {request?.risk_assessment_details?.scores_by_category &&
                    Object.entries(
                      request?.risk_assessment_details?.scores_by_category,
                    ).map(([category, score]) => (
                      <div
                        key={category}
                        className="text-center p-2 border rounded"
                      >
                        <p className="text-xs text-muted-foreground capitalize">
                          {category.replace('_', ' ')}
                        </p>
                        <p className="font-semibold">{score}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ratio Pago/Ingreso
                  </Label>
                  <p className="font-semibold">
                    {request.risk_assessment_details?.payment_to_income_ratio.toFixed(
                      2,
                    )}
                    %
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Incumplimientos Previos
                  </Label>
                  <p className="font-semibold">
                    {request.previous_defaults ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Solicitante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Información del Solicitante
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Dirección
                    </Label>
                    <p className="font-medium">{clientProfile.address_line1}</p>
                    <p className="text-sm text-muted-foreground">
                      {clientProfile.address_city},{' '}
                      {clientProfile.address_region} -{' '}
                      {clientProfile.address_postal_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Fecha de Nacimiento
                    </Label>
                    <p className="font-medium">
                      {typeof clientProfile.date_of_birth === 'string'
                        ? formatDate(clientProfile.date_of_birth)
                        : formatDate(clientProfile.date_of_birth?.toString())}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ingresos Anuales
                  </Label>
                  <p className="font-semibold">
                    {formatCurrency(clientProfile.annual_income)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Experiencia Agrícola
                  </Label>
                  <p className="font-semibold">
                    {clientProfile.years_of_agricultural_experience} años
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tamaño de Finca
                  </Label>
                  <p className="font-semibold">
                    {clientProfile.farm_size_hectares} hectáreas
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Dependientes
                  </Label>
                  <p className="font-semibold">
                    {request.number_of_dependents}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Score Crediticio
                  </Label>
                  <p className="font-semibold text-lg">
                    {clientProfile.internal_credit_history_score}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ratio Deuda/Ingreso
                  </Label>
                  <p className="font-semibold">
                    {(clientProfile.current_debt_to_income_ratio * 100).toFixed(
                      1,
                    )}
                    %
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Seguro Agrícola
                  </Label>
                  <Badge
                    variant={
                      clientProfile.has_agricultural_insurance
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {clientProfile.has_agricultural_insurance ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Colateral */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Colateral</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Descripción del Colateral
                  </Label>
                  <p className="font-medium">
                    {request.collateral_offered_description}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Valor del Colateral
                  </Label>
                  <p className="font-semibold">
                    {formatCurrency(request.collateral_value)}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Aporte del Solicitante
                </Label>
                <p className="font-semibold">
                  {formatCurrency(request.applicant_contribution_amount)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Decisión */}
          <Card>
            <CardHeader>
              <CardTitle>Decisión de la Solicitud</CardTitle>
              <CardDescription>
                Selecciona el nuevo estado para esta solicitud de crédito
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2 select-w-full">
                <Label htmlFor="status">Nuevo Estado</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestStatus.map((status: any) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStatus ===
                requestStatus.find((status: any) => status.code === 'REJECTED')
                  ?.id && (
                <div className="grid gap-2">
                  <Label htmlFor="rejection-reason">Razón del Rechazo</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Describe las razones por las cuales se rechaza esta solicitud..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {selectedStatus ===
                requestStatus.find((status: any) => status.code === 'APPROVED')
                  ?.id && (
                <div className="grid gap-2">
                  <Label htmlFor="approved-amount">Monto Aprobado</Label>
                  <Input
                    type="number"
                    id="approved-amount"
                    placeholder="Monto Aprobado"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    min={0}
                    max={request.requested_amount}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedStatus || selectedStatus === request.status_id}
          >
            Actualizar Estado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
