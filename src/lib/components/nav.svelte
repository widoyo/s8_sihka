<script>
    import { page } from '$app/stores';
</script>

<nav class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
  
  <div class="shrink-0">
    <a href="/" class="flex items-center space-x-2 font-bold text-xl text-blue-700">
      <span class="bg-blue-700 text-white p-1.5 rounded">S8</span>
    </a>
  </div>

  <div class="flex items-center space-x-6 xl:space-x-10">
    
    <div class="hidden md:flex items-center space-x-6">
      <div class="relative group">
        <button class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium py-2">
          <span>Data Hidrologi</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div class="absolute left-0 hidden group-hover:block w-48 bg-white border border-gray-100 shadow-lg rounded-md mt-0 z-50">
          <a href="/hujan" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Data Hujan</a>
          <a href="/sungai" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Data TMA</a>
        </div>
      </div>

      <div class="relative group">
        <button class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium py-2">
          <span>Peta</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div class="absolute left-0 hidden group-hover:block w-48 bg-white border border-gray-100 shadow-lg rounded-md mt-0 z-50">
          <a href="/peta/hujan" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Hujan</a>
          <a href="/peta/sungai" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Sungai</a>
        </div>
      </div>
    </div>

    <div class="hidden xl:block h-6 w-px bg-gray-300"></div>

    <div class="relative group">
      <button class="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition border border-blue-100">
        <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">JD</div>
        <span class="text-sm font-semibold text-blue-900">John Doe</span>
      </button>
      
      <div class="absolute right-0 hidden group-hover:block w-52 bg-white border border-gray-100 shadow-xl rounded-md mt-1 z-50 py-2">
        <div class="px-4 py-2 text-xs text-gray-400 uppercase font-bold tracking-wider">User Menu</div>
        <a href="/download" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Download</a>
        <a href="/pos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Semua Pos</a>
        <a href="/logger" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Semua Logger</a>
        <hr class="my-1 border-gray-100">
        <a href="/logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Logout</a>
      </div>
    </div>

  </div>
</nav>