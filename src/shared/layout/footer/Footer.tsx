export function Footer() {
  return (
    <footer className="bg-gray-800 text-center text-gray-100">
      <div className="w-full md:max-w-7xl mx-auto px-4 py-6 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <img
            src="https://agricapital.com.co/wp-content/uploads/2021/02/Logos-pie-de-pagina-e1738009157979.png"
            alt="Flowbite Logo"
            className="h-20 w-28"
          />
        </div>

        <div className="flex justify-center mt-4 sm:mt-0 space-x-6">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Licensing
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-2" />

      <div className="py-4 text-sm">
        © {new Date().getFullYear()}{' '}
        <a
          href="https://agricapital.com.co/"
          target="_blank"
          className="hover:underline"
        >
          AgriCapital
        </a>
        <span> - Prueba técnica.</span>
      </div>
    </footer>
  );
}
