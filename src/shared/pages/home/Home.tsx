'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import {
  Sprout,
  TrendingUp,
  Shield,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Leaf,
  BarChart3,
  HandHeart,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Tasas Competitivas',
      description:
        'Ofrecemos las mejores tasas del mercado adaptadas al sector agrícola',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Aprobación Rápida',
      description:
        'Proceso de evaluación automatizado con respuesta en 24-48 horas',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Evaluación Inteligente',
      description:
        'Sistema de scoring especializado en el perfil agrícola colombiano',
    },
    {
      icon: <HandHeart className="h-6 w-6" />,
      title: 'Acompañamiento',
      description: 'Asesoría personalizada durante todo el proceso crediticio',
    },
  ];

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: '5,000+',
      label: 'Agricultores Beneficiados',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      value: '$50B+',
      label: 'Créditos Otorgados',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      value: '95%',
      label: 'Tasa de Aprobación',
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      value: '12',
      label: 'Departamentos',
    },
  ];

  const benefits = [
    'Sin garantías hipotecarias para montos menores',
    'Plazos flexibles hasta 60 meses',
    'Evaluación basada en perfil agrícola',
    'Tasas preferenciales para productores certificados',
    'Proceso 100% digital',
    'Acompañamiento técnico especializado',
  ];

  return (
    <>
      <Helmet>
        <title>Inicio</title>
        <meta name="description" content="Bienvenido a la página de inicio" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <section className="relative px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 border-green-200 text-green-700"
                >
                  <Sprout className="h-3 w-3 mr-1" />
                  Financiamiento Agrícola Inteligente
                </Badge>

                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                  <span className="text-green-600">AgriCapital</span>
                  <br />
                  Impulsa tu proyecto agrícola
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Conectamos a los productores agrícolas colombianos con el
                  financiamiento que necesitan para hacer crecer sus cultivos y
                  expandir sus operaciones.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/credit/request-by-client/${user?.id}`}>
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                      <Sprout className="h-5 w-5 mr-2" />
                      Solicitar Crédito
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Conocer Más
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-400 to-green-600 p-8 shadow-2xl">
                  <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white">
                      <Leaf className="h-24 w-24 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold mb-2">Tecnología</h3>
                      <p className="text-lg opacity-90">
                        al servicio del campo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir AgriCapital?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Somos la plataforma líder en financiamiento agrícola, diseñada
                específicamente para las necesidades del sector rural
                colombiano.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Beneficios exclusivos para el sector agrícola
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Entendemos las particularidades del sector agrícola y hemos
                  diseñado productos financieros que se adaptan a los ciclos
                  productivos y necesidades específicas.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Hasta $50 millones
                    </h3>
                    <p className="text-gray-600 mb-6">
                      En financiamiento para proyectos de inversión, capital de
                      trabajo y expansión agrícola.
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-green-200 text-green-800"
                    >
                      Tasas desde 12.1% EA
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-600">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Listo para hacer crecer tu proyecto agrícola?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Únete a miles de productores que ya confían en AgriCapital para
              financiar sus sueños.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/credit/request-by-client/${user?.id}`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                >
                  <Sprout className="h-5 w-5 mr-2" />
                  Solicitar Crédito Ahora
                </Button>
              </Link>
            </div>

            <p className="text-sm text-green-200 mt-6">
              * Sujeto a evaluación crediticia. Términos y condiciones aplican.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};
