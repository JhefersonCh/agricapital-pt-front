'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  User,
  MapPin,
  CreditCard,
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { RequestService } from '../services/requestService';

interface PersonalInfoData {
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
  client_id: string;
  requested_amount: number;
  term_months: number;
  annual_interest_rate: number;
  credit_type_id: string;
  status_id: string;
  purpose_description: string;
  applicant_contribution_amount: number;
  collateral_offered_description: string;
}

interface ReviewFormProps {
  personalInfo: PersonalInfoData;
  accountInfo: AccountInfoData;
  onPrevious: () => void;
  onSubmit: () => void;
}

export function ReviewRequest({
  personalInfo,
  accountInfo,
  onPrevious,
  onSubmit,
}: ReviewFormProps) {
  const monthlyRate = accountInfo.annual_interest_rate / 100 / 12;
  const [relatedData, setRelatedData] = useState<any>({});

  const calculateMonthlyPayment = () => {
    if (
      accountInfo.requested_amount <= 0 ||
      accountInfo.term_months <= 0 ||
      monthlyRate <= 0
    ) {
      return 0;
    }

    const principal = accountInfo.requested_amount;
    const rate = monthlyRate;
    const periods = accountInfo.term_months;

    const factor = Math.pow(1 + rate, periods);
    return (principal * rate * factor) / (factor - 1);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * accountInfo.term_months;
  const totalInterest = totalPayment - accountInfo.requested_amount;

  const monthlyIncome = personalInfo.annual_income / 12;

  const requestService = new RequestService();

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

  const calculateAge = (birthDate: Date | string) => {
    if (!birthDate) return 'No especificado';

    const today = new Date();
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) return 'Fecha inválida';

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= 0 ? `${age} años` : 'Fecha inválida';
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'No especificado';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';

    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRiskLevel = () => {
    let riskScore = 0;

    if (personalInfo.has_agricultural_insurance) riskScore += 20;
    if (personalInfo.years_of_agricultural_experience >= 10) riskScore += 30;
    else if (personalInfo.years_of_agricultural_experience >= 5)
      riskScore += 20;
    else if (personalInfo.years_of_agricultural_experience >= 2)
      riskScore += 10;

    if (personalInfo.internal_credit_history_score >= 750) riskScore += 25;
    else if (personalInfo.internal_credit_history_score >= 700) riskScore += 20;
    else if (personalInfo.internal_credit_history_score >= 650) riskScore += 10;

    if (personalInfo.current_debt_to_income_ratio <= 0.2) riskScore += 25;
    else if (personalInfo.current_debt_to_income_ratio <= 0.3) riskScore += 15;
    else if (personalInfo.current_debt_to_income_ratio <= 0.4) riskScore += 5;

    const paymentToIncomeRatio = monthlyPayment / monthlyIncome;
    if (paymentToIncomeRatio <= 0.3) riskScore += 10;
    else if (paymentToIncomeRatio > 0.5) riskScore -= 10;

    if (riskScore >= 75) {
      return {
        level: 'Bajo',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      };
    }
    if (riskScore >= 45) {
      return {
        level: 'Medio',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      };
    }
    return {
      level: 'Alto',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    };
  };

  const riskAssessment = getRiskLevel();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CO').format(number);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Resumen de Solicitud de Crédito
          </CardTitle>
          <CardDescription className="text-base">
            La información suministrada en los pasos anteriores fue guardada,
            esto es un resumen de la solicitud.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de Nacimiento
              </p>
              <p className="text-base font-semibold">
                {personalInfo.date_of_birth
                  ? formatDate(personalInfo.date_of_birth)
                  : 'No especificado'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                (
                {personalInfo.date_of_birth
                  ? calculateAge(personalInfo.date_of_birth)
                  : 'No especificado'}
                )
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Dirección Completa
              </p>
              <p className="text-base font-semibold">
                {personalInfo.address_line1}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {personalInfo.address_city}, {personalInfo.address_region}{' '}
                {personalInfo.address_postal_code}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ID del Cliente
              </p>
              <p className="text-base font-mono text-sm">
                {accountInfo.client_id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Financiera Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Perfil Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ingreso Anual
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(personalInfo.annual_income)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ~{formatCurrency(monthlyIncome)} mensual
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ratio Deuda/Ingreso
              </p>
              <p className="text-2xl font-bold">
                {(personalInfo.current_debt_to_income_ratio * 100).toFixed(1)}%
              </p>
              <Badge
                variant={
                  personalInfo.current_debt_to_income_ratio <= 0.3
                    ? 'default'
                    : personalInfo.current_debt_to_income_ratio <= 0.4
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {personalInfo.current_debt_to_income_ratio <= 0.3
                  ? 'Saludable'
                  : personalInfo.current_debt_to_income_ratio <= 0.4
                  ? 'Moderado'
                  : 'Alto'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Puntaje Crediticio
              </p>
              <p className="text-2xl font-bold">
                {personalInfo.internal_credit_history_score}
              </p>
              <Badge
                variant={
                  personalInfo.internal_credit_history_score >= 750
                    ? 'default'
                    : personalInfo.internal_credit_history_score >= 700
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {personalInfo.internal_credit_history_score >= 750
                  ? 'Excelente'
                  : personalInfo.internal_credit_history_score >= 700
                  ? 'Bueno'
                  : personalInfo.internal_credit_history_score >= 650
                  ? 'Regular'
                  : 'Bajo'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Agrícola */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Perfil Agrícola
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Experiencia
              </p>
              <p className="text-xl font-bold">
                {personalInfo.years_of_agricultural_experience}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                años en agricultura
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tamaño de Granja
              </p>
              <p className="text-xl font-bold">
                {formatNumber(personalInfo.farm_size_hectares)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                hectáreas
              </p>
            </div>

            <div className="space-y-1 justify-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Seguro Agrícola
              </p>
              <div className="flex items-center justify-center gap-2">
                <Shield
                  className={`w-4 h-4 ${
                    personalInfo.has_agricultural_insurance
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                />
                <Badge
                  variant={
                    personalInfo.has_agricultural_insurance
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {personalInfo.has_agricultural_insurance
                    ? 'Asegurado'
                    : 'Sin seguro'}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nivel de Riesgo
              </p>
              <div className={`p-2 rounded-lg ${riskAssessment.bgColor}`}>
                <p className={`font-bold ${riskAssessment.color}`}>
                  {riskAssessment.level}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles del Crédito Solicitado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Detalles del Crédito Solicitado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Monto Solicitado
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(accountInfo.requested_amount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Plazo
                  </p>
                  <p className="text-lg font-semibold">
                    {accountInfo.term_months} meses
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tasa Anual
                  </p>
                  <p className="text-lg font-semibold">
                    {accountInfo.annual_interest_rate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tipo de Crédito
                </p>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {relatedData?.credit_types?.find(
                    (type: any) => type.id === accountInfo.credit_type_id,
                  )?.name || 'No especificado'}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Estado Actual
                </p>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {relatedData?.request_statuses?.find(
                    (status: any) => status.id === accountInfo.status_id,
                  )?.name || 'No especificado'}
                </Badge>
              </div>

              {accountInfo.applicant_contribution_amount > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Aporte Propio
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(accountInfo.applicant_contribution_amount)}
                  </p>
                </div>
              )}
            </div>

            {/* Resumen Financiero */}
            {monthlyPayment > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Resumen de Pagos
                </h4>

                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cuota Mensual:
                    </span>
                    <span className="font-bold text-lg">
                      {formatCurrency(monthlyPayment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total a Pagar:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(totalPayment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Intereses:
                    </span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(totalInterest)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      % del Ingreso Mensual:
                    </span>
                    <span
                      className={`font-semibold ${
                        monthlyPayment / monthlyIncome > 0.5
                          ? 'text-red-600'
                          : monthlyPayment / monthlyIncome > 0.3
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {((monthlyPayment / monthlyIncome) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      {(accountInfo.purpose_description ||
        accountInfo.collateral_offered_description) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountInfo.purpose_description && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Propósito del Crédito
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {accountInfo.purpose_description}
                  </p>
                </div>
              </div>
            )}

            {accountInfo.collateral_offered_description && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Garantía Ofrecida
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {accountInfo.collateral_offered_description}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fecha y Hora de Solicitud */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              Solicitud preparada el{' '}
              {new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="sm:w-auto"
            >
              ← Editar Información
            </Button>
            <Button
              onClick={onSubmit}
              className="bg-green-600 hover:bg-green-700 sm:w-auto"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Finalizar
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              Recibirás una confirmación por correo electrónico, revisaremos tu
              solicitud y te contactaremos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
