import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGetAllComplaints, adminGetAllStudents, adminUpdateComplaintStatus } from '../../../service/api';
import toast from 'react-hot-toast';

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

interface Complaint {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    created_at: string;
    student_name: string;
    student_email: string;
    studentID: string;
    department: string;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeNav, setActiveNav] = useState<NavItem>('overview');
    const [statusFilter, setStatusFilter] = useState<Status>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Complaint | 'date', direction: 'asc' | 'desc' } | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const token = localStorage.getItem('token') || "";

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const complaintsRes = await adminGetAllComplaints(token);
            setComplaints(complaintsRes.complaints);

            const studentsRes = await adminGetAllStudents(token);
            setStudents(studentsRes.students);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            if ((error as any).message?.includes("token") || (error as any).message?.includes("authorized")) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await adminUpdateComplaintStatus(id, newStatus, token);
            fetchAllData();
            if (selectedComplaint && selectedComplaint.id === id) {
                setSelectedComplaint({ ...selectedComplaint, status: newStatus });
            }
            toast.success("Complaint status updated successfully!");
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const requestSort = (key: keyof Complaint | 'date') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesSearch = c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.studentID.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStudent = !selectedStudentId || c.studentID === selectedStudentId;
        return matchesStatus && matchesSearch && matchesStudent;
    });

    const sortedComplaints = [...filteredComplaints].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        
        let aValue: any = key === 'date' ? new Date(a.created_at).getTime() : a[key as keyof Complaint];
        let bValue: any = key === 'date' ? new Date(b.created_at).getTime() : b[key as keyof Complaint];

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    const exportToCSV = () => {
        const headers = ["ID", "Title", "Student", "StudentID", "Department", "Category", "Status", "Date"];
        const rows = sortedComplaints.map(c => [
            c.id,
            `"${c.title.replace(/"/g, '""')}"`,
            `"${c.student_name}"`,
            c.studentID,
            c.department,
            c.category,
            c.status,
            new Date(c.created_at).toLocaleDateString()
        ]);
        
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `complaints_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium italic">Loading administrative data...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-20 flex-shrink-0`}>
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

                <nav className="flex-1 mt-6 px-3 space-y-1">
                    <NavLink icon={<OverviewIcon />} label="Overview" active={activeNav === 'overview'} collapsed={!sidebarOpen} onClick={() => setActiveNav('overview')} />
                    <NavLink icon={<ComplaintsIcon />} label="Complaints" active={activeNav === 'complaints'} collapsed={!sidebarOpen} onClick={() => { setActiveNav('complaints'); setSelectedStudentId(null); }} badge={stats.pending} />
                    <NavLink icon={<StudentsIcon />} label="Students" active={activeNav === 'students'} collapsed={!sidebarOpen} onClick={() => setActiveNav('students')} />
                </nav>

                <div className="p-3 border-t border-slate-800">
                    <button onClick={handleLogout} className={`w-full flex items-center p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
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
                        {activeNav === 'complaints' && (
                            <button onClick={exportToCSV} className="flex items-center space-x-2 text-xs font-bold bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export CSV</span>
                            </button>
                        )}
                        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {stats.pending > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                        </button>
                        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">A</div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-bold text-slate-900">Admin</p>
                                <p className="text-xs text-slate-400">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {activeNav === 'overview' && <OverviewPage stats={stats} complaints={complaints} onViewAll={() => setActiveNav('complaints')} />}
                    {activeNav === 'complaints' && (
                        <ComplaintsPage
                            complaints={sortedComplaints}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onView={setSelectedComplaint}
                            stats={stats}
                            sortConfig={sortConfig}
                            onSort={requestSort}
                            selectedStudentId={selectedStudentId}
                            onClearStudentFilter={() => setSelectedStudentId(null)}
                        />
                    )}
                    {activeNav === 'students' && (
                        <StudentsPage 
                            students={students} 
                            complaints={complaints} 
                            onStudentClick={(id) => {
                                setSelectedStudentId(id);
                                setActiveNav('complaints');
                            }}
                        />
                    )}
                </main>
            </div>

            {/* Complaint Detail Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedComplaint.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">#{selectedComplaint.id} · Submitted {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4 mb-8 text-slate-700 bg-slate-50 p-4 rounded-xl text-sm italic border border-slate-100 italic">
                            "{selectedComplaint.description}"
                        </div>
                        <div className="space-y-4 mb-8">
                            <DetailRow label="Student" value={`${selectedComplaint.student_name} (${selectedComplaint.studentID})`} />
                            <DetailRow label="Department" value={selectedComplaint.department} />
                            <DetailRow label="Category" value={selectedComplaint.category} />
                            <DetailRow label="Status" value={selectedComplaint.status} />
                        </div>
                        <div className="mb-8">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Update Status</label>
                            <div className="flex space-x-2">
                                {(['Pending', 'In Progress', 'Resolved'] as const).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusUpdate(selectedComplaint.id, s)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${selectedComplaint.status === s ? COLORS[s] + ' border-current' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setSelectedComplaint(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ---- Sub-pages ----

const OverviewPage: React.FC<{ stats: { total: number, pending: number, inProgress: number, resolved: number }, complaints: Complaint[], onViewAll: () => void }> = ({ stats, complaints, onViewAll }) => (
    <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Welcome Back, Admin!</h2>
                <p className="text-blue-100 text-sm max-w-md">You have {stats.pending} pending complaints that need your attention today. Keeping students happy starts here.</p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute right-10 -bottom-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BigStatCard label="Total Received" value={stats.total} icon="📊" color="bg-blue-500" />
            <BigStatCard label="Pending Action" value={stats.pending} icon="🔔" color="bg-amber-500" />
            <BigStatCard label="Under Review" value={stats.inProgress} icon="⚙️" color="bg-blue-400" />
            <BigStatCard label="Successfully Resolved" value={stats.resolved} icon="✨" color="bg-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 rounded-t-2xl">
                    <h3 className="font-bold text-slate-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recent Complaint Submissions
                    </h3>
                    <button onClick={onViewAll} className="text-blue-600 text-xs font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">View All Activity</button>
                </div>
                <div className="divide-y divide-slate-100 p-2">
                    {complaints.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 italic">No submissions yet.</div>
                    ) : complaints.slice(0, 5).map(c => (
                        <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-all cursor-default">
                            <div className="flex items-center space-x-4">
                                <div className={`w-2 h-2 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-500' : c.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{c.title}</p>
                                    <p className="text-xs text-slate-400 font-medium">{c.student_name} · <span className="text-slate-300 font-mono">#{c.id}</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={c.status as any} />
                                <p className="text-[10px] text-slate-400 mt-1 font-bold">{new Date(c.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Distribution by Category
                </h3>
                <div className="space-y-6 flex-1">
                    {[
                        { label: 'Academic', count: complaints.filter(c => c.category === 'Academic').length, color: 'bg-indigo-500', icon: '🎓' },
                        { label: 'Administrative', count: complaints.filter(c => c.category === 'Administrative').length, color: 'bg-cyan-500', icon: '🏢' },
                        { label: 'Facilities', count: complaints.filter(c => c.category === 'Facilities').length, color: 'bg-orange-500', icon: '🏗️' },
                        { label: 'Other', count: complaints.filter(c => c.category === 'Other').length, color: 'bg-slate-400', icon: '📁' },
                    ].map(cat => (
                        <div key={cat.label} className="group">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-700 flex items-center">
                                    <span className="mr-2 opacity-60 group-hover:opacity-100 transition-opacity">{cat.icon}</span>
                                    {cat.label}
                                </span>
                                <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[10px]">{cat.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className={`${cat.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${complaints.length > 0 ? (cat.count / complaints.length) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-300">Data updated just now</p>
                </div>
            </div>
        </div>
    </div>
);

const ComplaintsPage: React.FC<{
    complaints: Complaint[],
    statusFilter: Status,
    setStatusFilter: (s: Status) => void,
    searchQuery: string,
    setSearchQuery: (q: string) => void,
    onView: (c: Complaint) => void,
    stats: { total: number, pending: number, inProgress: number, resolved: number },
    sortConfig: { key: keyof Complaint | 'date', direction: 'asc' | 'desc' } | null,
    onSort: (key: keyof Complaint | 'date') => void,
    selectedStudentId: string | null,
    onClearStudentFilter: () => void
}> = ({ complaints, statusFilter, setStatusFilter, searchQuery, setSearchQuery, onView, stats, sortConfig, onSort, selectedStudentId, onClearStudentFilter }) => (
    <div className="space-y-6">
        {/* Filters & Search */}
        <div className="flex flex-col space-y-4">
            {selectedStudentId && (
                <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-blue-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Showing complaints for student ID: <span className="font-bold ml-1">{selectedStudentId}</span>
                    </p>
                    <button onClick={onClearStudentFilter} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Clear Filter</button>
                </div>
            )}
            
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search by student, ID, or title..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map(s => (
                        <button 
                            key={s} 
                            onClick={() => setStatusFilter(s)} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {s} <span className="ml-1 opacity-50">{s === 'Pending' ? stats.pending : s === 'In Progress' ? stats.inProgress : s === 'Resolved' ? stats.resolved : stats.total}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-left">
                            <th onClick={() => onSort('id')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                                <div className="flex items-center space-x-1">
                                    <span>#</span>
                                    {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </div>
                            </th>
                            <th onClick={() => onSort('student_name')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                                <div className="flex items-center space-x-1">
                                    <span>Student</span>
                                    {sortConfig?.key === 'student_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint</th>
                            <th onClick={() => onSort('category')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                                <div className="flex items-center space-x-1">
                                    <span>Category</span>
                                    {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </div>
                            </th>
                            <th onClick={() => onSort('date')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                                <div className="flex items-center space-x-1">
                                    <span>Date</span>
                                    {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </div>
                            </th>
                            <th onClick={() => onSort('status')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                    {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {complaints.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-400 font-medium">No complaints matching your criteria.</p>
                                </div>
                            </td></tr>
                        ) : complaints.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{c.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                            {c.student_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{c.student_name}</p>
                                            <p className="text-xs text-slate-400">{c.studentID} · {c.department}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-700 max-w-xs">
                                    <p className="truncate font-medium">{c.title}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${COLORS[c.category as keyof typeof COLORS] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{c.category}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap font-medium">{new Date(c.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={c.status as 'Pending' | 'In Progress' | 'Resolved'} />
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => onView(c)} className="text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white px-4 py-2 border border-blue-600/20 rounded-lg transition-all">
                                        Open
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const StudentsPage: React.FC<{ 
    students: any[], 
    complaints: Complaint[],
    onStudentClick: (id: string) => void
}> = ({ students, complaints, onStudentClick }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">Student Registry</h3>
                    <p className="text-xs text-slate-400 font-medium">{students.length} students currently registered</p>
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {students.map(s => {
                    const studentComplaints = complaints.filter(c => c.studentID === s.studentID);
                    return (
                        <div key={s.id} onClick={() => onStudentClick(s.studentID)} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer group transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors flex items-center justify-center text-slate-400 group-hover:text-blue-600 font-bold text-lg">
                                    {s.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{s.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{s.studentID} · {s.department}</p>
                                    <p className="text-[10px] text-slate-300 tracking-wide mt-0.5 uppercase font-bold">{s.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${studentComplaints.length > 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                        {studentComplaints.length} Complaints
                                    </span>
                                    <svg className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                {studentComplaints.length > 0 && (
                                    <p className="text-[10px] text-slate-400 font-medium italic">Latest: {new Date(studentComplaints[0].created_at).toLocaleDateString()}</p>
                                )}
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
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${COLORS[status] || COLORS.Other}`}>{status}</span>
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

// Reusable UI components and Icons are defined above
export default AdminDashboard;
