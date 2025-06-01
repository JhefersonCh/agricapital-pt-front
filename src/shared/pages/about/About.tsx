'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sprout,
  Target,
  Eye,
  Heart,
  Users,
  TrendingUp,
  Shield,
  Cpu,
  Award,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Leaf,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const About = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Compromiso Social',
      description:
        'Creemos en el desarrollo sostenible del sector agrícola colombiano y el bienestar de las comunidades rurales.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Transparencia',
      description:
        'Operamos con total transparencia en nuestros procesos, tasas y condiciones crediticias.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Innovación',
      description:
        'Utilizamos tecnología de punta para democratizar el acceso al crédito agrícola.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Cercanía',
      description:
        'Entendemos las necesidades específicas de cada productor y región del país.',
    },
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Fundación',
      description:
        'Nace AgriCapital con la visión de transformar el financiamiento agrícola en Colombia.',
    },
    {
      year: '2021',
      title: 'Primeros Créditos',
      description:
        'Otorgamos nuestros primeros $500 millones en créditos a pequeños productores.',
    },
    {
      year: '2022',
      title: 'Expansión Nacional',
      description:
        'Llegamos a 8 departamentos y superamos los 1,000 agricultores beneficiados.',
    },
    {
      year: '2023',
      title: 'Tecnología IA',
      description:
        'Implementamos inteligencia artificial para evaluación de riesgo crediticio.',
    },
    {
      year: '2024',
      title: 'Liderazgo',
      description:
        'Nos consolidamos como la fintech agrícola líder con $50B+ en créditos otorgados.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Solicitud Digital',
      description:
        'El productor completa su solicitud en línea con información básica de su perfil agrícola.',
    },
    {
      step: '02',
      title: 'Evaluación IA',
      description:
        'Nuestro sistema de inteligencia artificial evalúa el riesgo en tiempo real.',
    },
    {
      step: '03',
      title: 'Revisión Humana',
      description:
        'Nuestros analistas especializados revisan y validan la evaluación automatizada.',
    },
    {
      step: '04',
      title: 'Decisión Rápida',
      description:
        'Comunicamos la decisión en máximo 48 horas con condiciones transparentes.',
    },
    {
      step: '05',
      title: 'Desembolso',
      description:
        'Una vez aprobado, el dinero se transfiere directamente a la cuenta del productor.',
    },
  ];

  const impact = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: '5,000+',
      label: 'Familias Beneficiadas',
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      value: '12',
      label: 'Departamentos',
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      value: '15,000',
      label: 'Hectáreas Financiadas',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      value: '98%',
      label: 'Satisfacción Cliente',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sobre Nosotros</title>
        <meta
          name="description"
          content="Bienvenido a la página de sobre nosotros"
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <section className="relative px-6 lg:px-8 py-24 bg-gradient-to-b from-green-50 to-white">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-green-200 text-green-700"
            >
              <Sprout className="h-3 w-3 mr-1" />
              Nuestra Historia
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Transformando el
              <span className="text-green-600"> futuro agrícola</span> de
              Colombia
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              En AgriCapital creemos que cada productor merece acceso a
              financiamiento justo y oportuno. Combinamos tecnología de punta
              con conocimiento profundo del sector para democratizar el crédito
              agrícola.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="border-0 shadow-lg p-8">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <Target className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Democratizar el acceso al crédito agrícola en Colombia
                    mediante tecnología innovadora, evaluaciones justas y un
                    profundo entendimiento de las necesidades del sector rural.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg p-8">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <Eye className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Ser la plataforma líder de financiamiento agrícola en
                    América Latina, impulsando el crecimiento sostenible del
                    sector y mejorando la calidad de vida de las comunidades
                    rurales.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Valores
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Los principios que guían cada decisión y nos mantienen
                comprometidos con nuestros agricultores.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center p-6"
                >
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nuestro Camino
              </h2>
              <p className="text-xl text-gray-600">
                Desde nuestros inicios hasta convertirnos en líderes del
                financiamiento agrícola.
              </p>
            </div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {item.year}
                      </Badge>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nuestro Proceso
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un proceso simple, transparente y eficiente diseñado para las
                necesidades del sector agrícola.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                      {step.step}
                    </div>
                    {index < process.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-600">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Nuestro Impacto
              </h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Números que reflejan nuestro compromiso con el desarrollo del
                sector agrícola colombiano.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {impact.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-green-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 border-green-200 text-green-700"
                >
                  <Cpu className="h-3 w-3 mr-1" />
                  Tecnología de Punta
                </Badge>

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Innovación al servicio del campo
                </h2>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Utilizamos inteligencia artificial, machine learning y
                  análisis de big data para evaluar el riesgo crediticio de
                  manera más precisa y justa, considerando las particularidades
                  del sector agrícola.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">
                      Algoritmos especializados en riesgo agrícola
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">
                      Análisis de datos climáticos y de mercado
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">
                      Evaluación en tiempo real 24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">
                      Plataforma 100% digital y segura
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Reconocimientos
                    </h3>
                    <div className="space-y-3">
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-800 block"
                      >
                        Mejor Fintech Agrícola 2024
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-800 block"
                      >
                        Premio Innovación Rural
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-800 block"
                      >
                        Certificación ISO 27001
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              ¿Quieres ser parte de nuestra historia?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a miles de productores que ya confían en AgriCapital para
              hacer crecer sus proyectos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  navigate(
                    user
                      ? `/credit/request-by-client/${user?.id}`
                      : '/auth/login',
                  )
                }
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <Sprout className="h-5 w-5 mr-2" />
                Solicitar Crédito
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
