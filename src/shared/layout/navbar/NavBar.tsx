import { Notifications } from '@/shared/components/Notifications';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useRole } from '@/shared/contexts/RoleContext';
import type { NotificationsUser } from '@/shared/interfaces/notification.interface';
import { NotificationsService } from '@/shared/services/notificationsService';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Inicio', href: '/', current: true },
  { name: 'Nosotros', href: '/about', current: false },
  { name: 'Clientes', href: '/credit/clients', current: false },
  { name: 'Solicitudes', href: '/credit/requests', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, loading, signOut } = useAuth();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const { role, setRole } = useRole();
  const [notifications, setNotifications] = useState<NotificationsUser[]>([]);
  const service = new NotificationsService();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  useEffect(() => {
    service.getNotifications().then((data) => {
      setNotifications(data.data);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderAuthSection = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-w-[120px]">
          <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
        </div>
      );
    }

    if (session) {
      return (
        <>
          <Notifications
            count={notifications.length}
            notifications={notifications}
          />
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src={
                    session.user?.user_metadata?.avatar_url ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  }
                  className="size-8 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <MenuItem>
                <a
                  onClick={() => navigate('/user/profile')}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Tu Perfil
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={() => navigate('/user/settings')}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Configuración
                </a>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Cerrar sesión
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </>
      );
    }

    return (
      <button
        onClick={() => navigate('/auth/login')}
        className="cursor-pointer ml-4 inline-flex items-center rounded-md border border-transparent bg-[#499403] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#8bd149] transition-colors duration-200"
      >
        Iniciar sesión
      </button>
    );
  };

  return (
    <Disclosure as="nav" className="bg-gray-700">
      <div className="mx-auto w-full px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Your Company" src="/logo.png" className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const hasPermission =
                    role?.permissions.some((p) => item.href.includes(p)) ||
                    ['/', '/auth/login', '/about'].includes(item.href);
                  return (
                    hasPermission && (
                      <a
                        key={item.name}
                        onClick={() => navigate(item.href)}
                        aria-current={
                          currentPath === item.href ? 'page' : undefined
                        }
                        className={classNames(
                          currentPath === item.href
                            ? 'bg-gray-600 text-[#8bd149]'
                            : 'text-[#499403] hover:bg-gray-700 hover:text-[#8bd149]',
                          'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                        )}
                      >
                        {item.name}
                      </a>
                    )
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {renderAuthSection()}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="button"
              onClick={() => navigate(item.href)}
              aria-current={currentPath === item.href ? 'page' : undefined}
              className={classNames(
                currentPath === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
          {/* Mobile auth section */}
          <div className="border-t border-gray-700 pt-4">
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-400">Cargando...</span>
              </div>
            ) : session ? (
              <div className="space-y-1">
                <DisclosureButton
                  as="button"
                  onClick={() => navigate('/user/profile')}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Tu Perfil
                </DisclosureButton>
                <DisclosureButton
                  as="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Cerrar sesión
                </DisclosureButton>
              </div>
            ) : (
              <DisclosureButton
                as="button"
                onClick={() => navigate('/auth/login')}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium bg-[#499403] text-white hover:bg-[#8bd149]"
              >
                Iniciar sesión
              </DisclosureButton>
            )}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
