import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Mock Data ---
const MOCK_COMPLAINTS = [
    { id: 1, student: 'Alice Johnson', studentId: 'STU001', title: 'Grade dispute in Math 101', category: 'Academic', status: 'Pending', date: '2026-03-14', department: 'Engineering' },
    { id: 2, student: 'Bob Smith', studentId: 'STU002', title: 'Library access issue', category: 'Facilities', status: 'In Progress', date: '2026-03-13', department: 'Science' },
    { id: 3, student: 'Carol Williams', studentId: 'STU003', title: 'Wrong course fees charged', category: 'Administrative', status: 'Resolved', date: '2026-03-12', department: 'Business' },
    { id: 4, student: 'David Brown', studentId: 'STU004', title: 'Classroom equipment broken', category: 'Facilities', status: 'Pending', date: '2026-03-11', department: 'Engineering' },
    { id: 5, student: 'Eva Davis', studentId: 'STU005', title: 'Unfair assignment grading', category: 'Academic', status: 'In Progress', date: '2026-03-10', department: 'Arts' },
    { id: 6, student: 'Frank Miller', studentId: 'STU006', title: 'Transcript request delay', category: 'Administrative', status: 'Resolved', date: '2026-03-09', department: 'Science' },
];

const COLORS = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Academic: 'bg-purple-100 text-purple-700',
    Administrative: 'bg-cyan-100 text-cyan-700',
    Facilities: 'bg-orange-100 text-orange-700',
    Other: 'bg-gray-100 text-gray-700',
};

type Status = 'All' | 'Pending' | 'In Progress' | 'Resolved';
type NavItem = 'overview' | 'complaints' | 'students';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeNav, setActiveNav] = useState<NavItem>('overview');
    const [statusFilter, setStatusFilter] = useState<Status>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState<typeof MOCK_COMPLAINTS[0] | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const filteredComplaints = MOCK_COMPLAINTS.filter(c => {
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesSearch = c.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.studentId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: MOCK_COMPLAINTS.length,
        pending: MOCK_COMPLAINTS.filter(c => c.status === 'Pending').length,
        inProgress: MOCK_COMPLAINTS.filter(c => c.status === 'In Progress').length,
        resolved: MOCK_COMPLAINTS.filter(c => c.status === 'Resolved').length,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20 flex-shrink-0`}>
                {/* Logo */}
                <div className={`p-5 flex items-center border-b border-slate-800 ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">SCM Admin</p>
                            <p className="text-slate-400 text-xs">Control Panel</p>
                        </div>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-1 mt-6 px-3 space-y-1">
                    <NavLink icon={<OverviewIcon />} label="Overview" active={activeNav === 'overview'} collapsed={!sidebarOpen} onClick={() => setActiveNav('overview')} />
                    <NavLink icon={<ComplaintsIcon />} label="Complaints" active={activeNav === 'complaints'} collapsed={!sidebarOpen} onClick={() => setActiveNav('complaints')} badge={stats.pending} />
                    <NavLink icon={<StudentsIcon />} label="Students" active={activeNav === 'students'} collapsed={!sidebarOpen} onClick={() => setActiveNav('students')} />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-slate-800">
                    <button onClick={handleLogout} className={`w-full flex items-center p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-base font-bold text-slate-900 capitalize">{activeNav === 'overview' ? 'Dashboard Overview' : activeNav === 'complaints' ? 'Complaint Management' : 'Student Registry'}</h1>
                            <p className="text-xs text-slate-400">SCM Admin Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {stats.pending > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                        </button>
                        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">A</div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-bold text-slate-900">Admin</p>
                                <p className="text-xs text-slate-400">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {activeNav === 'overview' && <OverviewPage stats={stats} complaints={MOCK_COMPLAINTS} onViewAll={() => setActiveNav('complaints')} />}
                    {activeNav === 'complaints' && (
                        <ComplaintsPage
                            complaints={filteredComplaints}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onView={setSelectedComplaint}
                            stats={stats}
                        />
                    )}
                    {activeNav === 'students' && <StudentsPage complaints={MOCK_COMPLAINTS} />}
                </main>
            </div>

            {/* Complaint Detail Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedComplaint.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">#{selectedComplaint.id} · Submitted {selectedComplaint.date}</p>
                            </div>
                            <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4 mb-8">
                            <DetailRow label="Student" value={`${selectedComplaint.student} (${selectedComplaint.studentId})`} />
                            <DetailRow label="Department" value={selectedComplaint.department} />
                            <DetailRow label="Category" value={selectedComplaint.category} />
                            <DetailRow label="Status" value={selectedComplaint.status} />
                        </div>
                        <div className="mb-8">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Update Status</label>
                            <div className="flex space-x-2">
                                {(['Pending', 'In Progress', 'Resolved'] as const).map(s => (
                                    <button key={s} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${selectedComplaint.status === s ? COLORS[s] + ' border-current' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setSelectedComplaint(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Close</button>
                            <button className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ---- Sub-pages ----

const OverviewPage: React.FC<{ stats: { total: number, pending: number, inProgress: number, resolved: number }, complaints: typeof MOCK_COMPLAINTS, onViewAll: () => void }> = ({ stats, complaints, onViewAll }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BigStatCard label="Total Complaints" value={stats.total} icon="📋" color="bg-blue-600" />
            <BigStatCard label="Pending" value={stats.pending} icon="⏳" color="bg-amber-500" />
            <BigStatCard label="In Progress" value={stats.inProgress} icon="🔄" color="bg-indigo-500" />
            <BigStatCard label="Resolved" value={stats.resolved} icon="✅" color="bg-emerald-500" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Recent Complaints</h3>
                    <button onClick={onViewAll} className="text-blue-600 text-sm font-bold hover:underline">View All →</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {complaints.slice(0, 4).map(c => (
                        <div key={c.id} className="py-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                                <p className="text-xs text-slate-400">{c.student} · {c.date}</p>
                            </div>
                            <StatusBadge status={c.status as 'Pending' | 'In Progress' | 'Resolved'} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-6">By Category</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Academic', count: complaints.filter(c => c.category === 'Academic').length, color: 'bg-purple-500' },
                        { label: 'Administrative', count: complaints.filter(c => c.category === 'Administrative').length, color: 'bg-cyan-500' },
                        { label: 'Facilities', count: complaints.filter(c => c.category === 'Facilities').length, color: 'bg-orange-500' },
                    ].map(cat => (
                        <div key={cat.label}>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-medium text-slate-700">{cat.label}</span>
                                <span className="font-bold text-slate-900">{cat.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${(cat.count / complaints.length) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ComplaintsPage: React.FC<{
    complaints: typeof MOCK_COMPLAINTS,
    statusFilter: Status,
    setStatusFilter: (s: Status) => void,
    searchQuery: string,
    setSearchQuery: (q: string) => void,
    onView: (c: typeof MOCK_COMPLAINTS[0]) => void,
    stats: { total: number, pending: number, inProgress: number, resolved: number }
}> = ({ complaints, statusFilter, setStatusFilter, searchQuery, setSearchQuery, onView, stats }) => (
    <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search by student, ID, or complaint..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex space-x-2">
                {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {s} {s === 'Pending' ? `(${stats.pending})` : s === 'In Progress' ? `(${stats.inProgress})` : s === 'Resolved' ? `(${stats.resolved})` : `(${stats.total})`}
                    </button>
                ))}
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {complaints.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No complaints found matching your filters.</td></tr>
                    ) : complaints.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{c.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                        {c.student.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{c.student}</p>
                                        <p className="text-xs text-slate-400">{c.studentId} · {c.department}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-700 max-w-xs">
                                <p className="truncate font-medium">{c.title}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${COLORS[c.category as keyof typeof COLORS] || 'bg-gray-100 text-gray-700'}`}>{c.category}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{c.date}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={c.status as 'Pending' | 'In Progress' | 'Resolved'} />
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => onView(c)} className="text-blue-600 font-bold text-xs hover:underline px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                    Review
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const StudentsPage: React.FC<{ complaints: typeof MOCK_COMPLAINTS }> = ({ complaints }) => {
    const uniqueStudents = Array.from(new Map(complaints.map(c => [c.studentId, c])).values());
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Registered Students</h3>
                <p className="text-sm text-slate-400">{uniqueStudents.length} students with complaints</p>
            </div>
            <div className="divide-y divide-slate-100">
                {uniqueStudents.map(s => {
                    const studentComplaints = complaints.filter(c => c.studentId === s.studentId);
                    return (
                        <div key={s.studentId} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {s.student.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{s.student}</p>
                                    <p className="text-xs text-slate-400">{s.studentId} · {s.department}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">{studentComplaints.length} complaint{studentComplaints.length !== 1 ? 's' : ''}</p>
                                <p className="text-xs text-slate-400">Last: {studentComplaints[0]?.date}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ---- Reusable UI Components ----

const NavLink: React.FC<{ icon: React.ReactNode, label: string, active: boolean, collapsed: boolean, onClick: () => void, badge?: number }> = ({ icon, label, active, collapsed, onClick, badge }) => (
    <button onClick={onClick} className={`w-full flex items-center p-3 rounded-xl transition-all ${collapsed ? 'justify-center' : 'space-x-3'} ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="text-sm font-semibold">{label}</span>}
        {!collapsed && badge != null && badge > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>
        )}
    </button>
);

const BigStatCard: React.FC<{ label: string, value: number, icon: string, color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <span className="text-2xl">{icon}</span>
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
        </div>
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
    </div>
);

const StatusBadge: React.FC<{ status: 'Pending' | 'In Progress' | 'Resolved' }> = ({ status }) => (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${COLORS[status]}`}>{status}</span>
);

const DetailRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
);

// ---- Icons ----
const OverviewIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
    </svg>
);
const ComplaintsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const StudentsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

// Unused import cleanup
const _Link = Link;
void _Link;

export default AdminDashboard;
