import{ Link, useLocation } from 'react-router-dom';

function TopNav() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isLive = location.pathname === '/live';

  return (
    <header className="bg-[#061e58] border-b border-gray-200 ">
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className=' overflow-hidden w-25 h-16  '>
        <img className='w-full h-full object-cover object-center ' src="https://www.iplt20.com/assets/images/teams-right-img.png" alt="desing " />
        </div>
            <img src="/logo.png" alt="Logo" className="h-15 w-auto mr-2" />
            <h1 className="text-xl font-bold text-blue-600  tracking-tight">
              RIT <span className="text-white font-medium">Auction Simulation</span>
            </h1>
           <div className=' overflow-hidden w-25 h-16 rotate-180 '>
        <img className='w-full h-full object-cover object-center ' src="https://www.iplt20.com/assets/images/teams-right-img.png" alt="desing " />
        </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              to="/live"
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${isLive ? 'bg-red-50 text-red-600 border border-red-100' : 'text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent'}`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
                Go Live
              </span>
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${!isAdmin && !isLive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isAdmin ? 'bg-blue-50 text-blue-700' : 'text-white hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Admin Controls
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default TopNav;