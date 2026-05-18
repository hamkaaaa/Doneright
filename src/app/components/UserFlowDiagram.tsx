export default function UserFlowDiagram() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Flow - DoneRight System</h1>
          <p className="text-gray-600">Alur penggunaan sistem dari perspektif pengguna</p>
        </div>

        {/* Flow 1: Registrasi dan Login */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Flow 1: Registrasi & Login</h2>

          <div className="space-y-4">
            {/* Start */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                START
              </div>
              <div className="flex-1 border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="font-semibold">User mengakses aplikasi DoneRight</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Decision */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <div className="flex-1 border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                <p className="font-semibold text-center">Sudah punya akun?</p>
              </div>
            </div>

            {/* Branches */}
            <div className="grid grid-cols-2 gap-8 pl-16">
              {/* Belum Punya Akun */}
              <div className="space-y-3">
                <div className="text-center text-sm font-semibold text-red-600">TIDAK</div>
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold">1. Klik "Daftar di sini"</p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold">2. Mengisi Form Registrasi:</p>
                  <ul className="text-sm mt-2 space-y-1 ml-4">
                    <li>• Nama Lengkap</li>
                    <li>• Email</li>
                    <li>• Password</li>
                    <li>• Konfirmasi Password</li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold">3. Klik "Daftar"</p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                  <p className="font-semibold text-center">Validasi Input</p>
                  <p className="text-xs text-center mt-1">(Format email, password match, dll)</p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                  <p className="font-semibold">✓ Registrasi Berhasil</p>
                  <p className="text-sm">Redirect ke halaman Login</p>
                </div>
              </div>

              {/* Sudah Punya Akun */}
              <div className="space-y-3">
                <div className="text-center text-sm font-semibold text-green-600">YA</div>
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold">1. Berada di halaman Login</p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold">2. Mengisi Form Login:</p>
                  <ul className="text-sm mt-2 space-y-1 ml-4">
                    <li>• Email</li>
                    <li>• Password</li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
                  <p className="font-semibold">3. Klik "Login"</p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                  <p className="font-semibold text-center">Autentikasi</p>
                  <p className="text-xs text-center mt-1">(Verifikasi email & password)</p>
                </div>
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                  <p className="font-semibold text-center">Cek Role User</p>
                </div>
              </div>
            </div>

            {/* Merge to role check */}
            <div className="flex justify-center mt-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Role Decision */}
            <div className="grid grid-cols-2 gap-8 pl-16">
              <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                <p className="font-semibold text-center">Role: MAHASISWA</p>
                <p className="text-sm text-center mt-1">→ Dashboard Mahasiswa</p>
              </div>
              <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                <p className="font-semibold text-center">Role: ADMIN</p>
                <p className="text-sm text-center mt-1">→ Dashboard Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flow 2: Mahasiswa - Mengelola Tugas */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Flow 2: Mahasiswa - Mengelola Tugas</h2>

          <div className="space-y-4">
            {/* Start */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                START
              </div>
              <div className="flex-1 border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="font-semibold">Mahasiswa berada di Dashboard</p>
              </div>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* View Dashboard */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12"></div>
              <div className="flex-1 border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                <p className="font-semibold">Melihat Dashboard:</p>
                <ul className="text-sm mt-2 space-y-1 ml-4">
                  <li>• Widget Progress (% penyelesaian tugas)</li>
                  <li>• Daftar semua tugas</li>
                  <li>• Filter & Search bar</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Action Selection */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <div className="flex-1 border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                <p className="font-semibold text-center">Pilih Aksi</p>
              </div>
            </div>

            {/* Multiple Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pl-16">
              {/* Add Task */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-indigo-600">TAMBAH TUGAS</div>
                <div className="border-2 border-indigo-300 rounded-lg p-3 bg-indigo-50 text-sm">
                  <p className="font-semibold">1. Klik "Tambah Tugas"</p>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-3 bg-indigo-50 text-sm">
                  <p className="font-semibold">2. Isi Form:</p>
                  <ul className="text-xs mt-1 ml-3">
                    <li>• Judul</li>
                    <li>• Deskripsi</li>
                    <li>• Kategori</li>
                    <li>• Prioritas</li>
                    <li>• Deadline</li>
                  </ul>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-3 bg-indigo-50 text-sm">
                  <p className="font-semibold">3. Klik "Simpan"</p>
                </div>
                <div className="border-2 border-yellow-300 rounded-lg p-3 bg-yellow-50 text-sm">
                  <p className="font-semibold text-center">Validasi</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">✓ Tugas Tersimpan</p>
                  <p className="text-xs">Progress terupdate</p>
                </div>
              </div>

              {/* View/Edit Task */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-purple-600">LIHAT/EDIT</div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">1. Klik "Detail"</p>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">2. Lihat Detail Tugas</p>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">3. Klik "Edit"</p>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">4. Ubah Data</p>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">5. Klik "Simpan"</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">✓ Tugas Diupdate</p>
                </div>
              </div>

              {/* Mark Complete */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-green-600">TANDAI SELESAI</div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">1. Centang Checkbox</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">2. Status berubah</p>
                  <p className="text-xs">ACTIVE → COMPLETED</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">3. Timestamp tersimpan</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">4. Progress terupdate</p>
                  <p className="text-xs">Persentase naik</p>
                </div>
              </div>

              {/* Delete Task */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-red-600">HAPUS TUGAS</div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">1. Klik "Detail"</p>
                </div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">2. Klik "Hapus"</p>
                </div>
                <div className="border-2 border-yellow-300 rounded-lg p-3 bg-yellow-50 text-sm">
                  <p className="font-semibold text-center">Konfirmasi?</p>
                </div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">3. Konfirmasi "Ya"</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                  <p className="font-semibold">✓ Soft Delete</p>
                  <p className="text-xs">deleted_at terisi</p>
                </div>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="mt-8 border-t-2 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12"></div>
                <div className="flex-1 border-2 border-cyan-400 rounded-lg p-4 bg-cyan-50">
                  <p className="font-semibold text-center">FITUR FILTER & SEARCH</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pl-16">
                <div className="border-2 border-cyan-300 rounded-lg p-4 bg-cyan-50">
                  <p className="font-semibold">Search</p>
                  <p className="text-sm mt-1">Ketik kata kunci → Filter by judul/deskripsi</p>
                </div>
                <div className="border-2 border-cyan-300 rounded-lg p-4 bg-cyan-50">
                  <p className="font-semibold">Filter Status</p>
                  <p className="text-sm mt-1">Pilih: All / Active / Completed / Overdue</p>
                </div>
                <div className="border-2 border-cyan-300 rounded-lg p-4 bg-cyan-50">
                  <p className="font-semibold">Filter Prioritas</p>
                  <p className="text-sm mt-1">Pilih: All / High / Medium / Low</p>
                </div>
              </div>
              <div className="flex justify-center mt-3">
                <div className="border-2 border-cyan-300 rounded-lg p-4 bg-cyan-50 max-w-md">
                  <p className="font-semibold">Sorting</p>
                  <p className="text-sm mt-1">Urutkan berdasarkan: Deadline atau Prioritas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow 3: Admin - Monitoring Sistem */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Flow 3: Admin - Monitoring Sistem</h2>

          <div className="space-y-4">
            {/* Start */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                START
              </div>
              <div className="flex-1 border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="font-semibold">Admin berada di Dashboard</p>
              </div>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Tab Selection */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <div className="flex-1 border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                <p className="font-semibold text-center">Pilih Tab Menu</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pl-16">
              {/* Overview */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-blue-600">OVERVIEW</div>
                <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50 text-sm">
                  <p className="font-semibold">Melihat Statistik:</p>
                  <ul className="text-xs mt-1 ml-3">
                    <li>• Total Tugas</li>
                    <li>• Tugas Selesai</li>
                    <li>• Tugas Aktif</li>
                    <li>• Tugas Overdue</li>
                    <li>• Completion Rate</li>
                  </ul>
                </div>
                <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50 text-sm">
                  <p className="font-semibold">Distribusi Prioritas</p>
                  <p className="text-xs">Visualisasi bar chart</p>
                </div>
              </div>

              {/* All Tasks */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-indigo-600">SEMUA TUGAS</div>
                <div className="border-2 border-indigo-300 rounded-lg p-3 bg-indigo-50 text-sm">
                  <p className="font-semibold">Melihat Tabel:</p>
                  <p className="text-xs mt-1">Seluruh tugas dari semua mahasiswa</p>
                </div>
                <div className="border-2 border-indigo-300 rounded-lg p-3 bg-indigo-50 text-sm">
                  <p className="font-semibold">Info Ditampilkan:</p>
                  <ul className="text-xs mt-1 ml-3">
                    <li>• Judul & Deskripsi</li>
                    <li>• Prioritas</li>
                    <li>• Status</li>
                    <li>• Deadline</li>
                  </ul>
                </div>
              </div>

              {/* Overdue */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-red-600">TUGAS OVERDUE</div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">Melihat Daftar:</p>
                  <p className="text-xs mt-1">Tugas yang melewati deadline</p>
                </div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">Badge Counter</p>
                  <p className="text-xs mt-1">Jumlah tugas overdue</p>
                </div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">Prioritas Perhatian</p>
                  <p className="text-xs">Highlight merah</p>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="text-center text-xs font-semibold text-purple-600">KELOLA KATEGORI</div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">Lihat Semua Kategori</p>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50 text-sm">
                  <p className="font-semibold">Tambah Kategori:</p>
                  <p className="text-xs mt-1">1. Klik "Tambah"<br/>2. Isi nama<br/>3. Simpan</p>
                </div>
                <div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 text-sm">
                  <p className="font-semibold">Hapus Kategori:</p>
                  <p className="text-xs mt-1">Opsi: Hapus tugas terkait atau pertahankan</p>
                </div>
              </div>
            </div>

            {/* Generate Report */}
            <div className="mt-6 border-t-2 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12"></div>
                <div className="flex-1 border-2 border-green-400 rounded-lg p-4 bg-green-50">
                  <p className="font-semibold text-center">GENERATE LAPORAN SISTEM</p>
                </div>
              </div>
              <div className="flex justify-center mt-3">
                <div className="max-w-2xl space-y-2">
                  <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                    <p className="font-semibold">1. Pilih parameter laporan (periode, status, dll)</p>
                  </div>
                  <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                    <p className="font-semibold">2. Klik "Generate Laporan"</p>
                  </div>
                  <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                    <p className="font-semibold">3. Pilih format export (PDF/CSV)</p>
                  </div>
                  <div className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-sm">
                    <p className="font-semibold">4. Download laporan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow 4: Complete User Journey */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-6">Flow 4: Skenario Lengkap - Mahasiswa</h2>

          <div className="space-y-4">
            <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
              <p className="font-semibold text-lg mb-3">Skenario: Lanjar Setiawan mengelola tugas kuliah</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <p className="font-semibold">Akses & Login</p>
                    <p className="text-sm">Lanjar membuka DoneRight → Login dengan email mahasiswa@undip.ac.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <p className="font-semibold">Melihat Dashboard</p>
                    <p className="text-sm">Progress widget menunjukkan 1 dari 2 tugas selesai (50%)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <p className="font-semibold">Tambah Tugas Baru</p>
                    <p className="text-sm">Klik "Tambah Tugas" → Isi form (Judul: "Tugas RPL D2", Kategori: Akademik, Prioritas: High, Deadline: 20 Mei 2026) → Simpan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <p className="font-semibold">Filter Tugas</p>
                    <p className="text-sm">Pilih filter "High Priority" untuk melihat tugas penting saja</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
                  <div>
                    <p className="font-semibold">Tandai Tugas Selesai</p>
                    <p className="text-sm">Centang checkbox "Tugas Basis Data" → Status berubah menjadi Completed → Progress naik menjadi 66%</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">6</div>
                  <div>
                    <p className="font-semibold">Edit Tugas</p>
                    <p className="text-sm">Klik "Detail" pada tugas RPL → Klik "Edit" → Ubah deadline → Simpan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">7</div>
                  <div>
                    <p className="font-semibold">Generate Laporan Pribadi</p>
                    <p className="text-sm">Klik "Generate Laporan" → Pilih format PDF → Download laporan progres tugas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">✓</div>
                  <div>
                    <p className="font-semibold">Logout</p>
                    <p className="text-sm">Klik "Logout" → Kembali ke halaman login</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan User Flow</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Flow</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Aktor</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Langkah Utama</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">Registrasi & Login</td>
                  <td className="border border-gray-300 px-4 py-3">Semua User</td>
                  <td className="border border-gray-300 px-4 py-3">
                    1. Akses aplikasi<br/>
                    2. Pilih Login/Register<br/>
                    3. Isi form & validasi<br/>
                    4. Autentikasi<br/>
                    5. Redirect ke dashboard sesuai role
                  </td>
                  <td className="border border-gray-300 px-4 py-3">User masuk ke dashboard (Mahasiswa/Admin)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">Mengelola Tugas</td>
                  <td className="border border-gray-300 px-4 py-3">Mahasiswa</td>
                  <td className="border border-gray-300 px-4 py-3">
                    1. Lihat dashboard & progress<br/>
                    2. CRUD tugas (Tambah/Edit/Hapus)<br/>
                    3. Tandai selesai via checkbox<br/>
                    4. Filter & search tugas<br/>
                    5. Generate laporan pribadi
                  </td>
                  <td className="border border-gray-300 px-4 py-3">Tugas terkelola, progress terupdate</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">Monitoring Sistem</td>
                  <td className="border border-gray-300 px-4 py-3">Admin</td>
                  <td className="border border-gray-300 px-4 py-3">
                    1. Lihat statistik overview<br/>
                    2. Monitor semua tugas mahasiswa<br/>
                    3. Cek tugas overdue<br/>
                    4. Kelola kategori (CRUD)<br/>
                    5. Generate laporan sistem
                  </td>
                  <td className="border border-gray-300 px-4 py-3">Sistem termonitor, laporan tersedia</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <span className="text-sm">Start/End</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded"></div>
              <span className="text-sm">Decision Point</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-300 bg-blue-50"></div>
              <span className="text-sm">Process/Action</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-300 bg-green-50"></div>
              <span className="text-sm">Success State</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
