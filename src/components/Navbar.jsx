 /* eslint-disable react/prop-types */

function Navbar({ darkTheme, setDarkTheme }) {
  return (
    <div
      className={
        darkTheme
          ? "w-full h-[12vh] flex justify-between items-center sticky top-0 z-10 bg-[#b2bec3]"
          : "w-full h-[12vh] flex justify-between items-center bg-[#2c3e50] sticky top-0 z-10"
      }
    >
      {/* Logo Section */}
      <div className="ms-4 sm:ms-8 md:ms-12">
        <p
          className={
            darkTheme
              ? "text-xl sm:text-2xl md:text-3xl text-black font-semibold italic"
              : "text-xl sm:text-2xl md:text-3xl text-[#ecf0f1] font-semibold italic"
          }
        >
          Crypto-Wallet
        </p>
      </div>

      {/* Toggle Button Section */}
      <div className="me-4 sm:me-8 md:me-12">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            onChange={() => setDarkTheme(!darkTheme)}
            className="sr-only peer"
            value=""
            type="checkbox"
          />
          <div className="peer rounded-full outline-none duration-100 after:duration-500 w-16 h-8 sm:w-20 sm:h-10 bg-blue-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 after:content-['Off'] after:absolute after:outline-none after:rounded-full after:h-6 after:w-6 sm:after:h-8 sm:after:w-8 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-8 sm:peer-checked:after:translate-x-10 peer-checked:after:content-['On'] peer-checked:after:border-white"></div>
        </label>
      </div>
    </div>
  );
}

export default Navbar;