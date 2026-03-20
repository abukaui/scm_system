import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { type UserData, getComplaints, createComplaint, type ComplaintResponse, type ComplaintData, updateUserProfile } from '../../service/api';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isComplaints = location.pathname === '/complaints';
    const [student, setStudent] = useState<UserData | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<ComplaintData>({ title: '', description: '', category: 'Academic' });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState<UserData>({ email: '' });


    useEffect(() => {
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        if (userDataStr) {
            const parsed = JSON.parse(userDataStr);
            setStudent(parsed);
            setProfileForm(parsed);
        }

        fetchComplaints(token);
    }, [navigate]);

    const fetchComplaints = async (token: string) => {
        try {
            setIsLoading(true);
            const data = await getComplaints(token);
            setComplaints(data.compliant || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateComplaint = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const data = await createComplaint(formData, token);
            setComplaints([data.compliant, ...complaints]);
            setShowForm(false);
            setFormData({ title: '', description: '', category: 'Academic' });
            toast.success("Complaint submitted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit complaint.");
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const updatedUser = await updateUserProfile(profileForm, token);
            setStudent(updatedUser.user);
            localStorage.setItem('user', JSON.stringify(updatedUser.user));
            toast.success("Profile updated successfully!");
            setShowProfileModal(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (!student) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}>
                <div className="p-6 flex items-center space-x-3 overflow-hidden whitespace-nowrap border-b border-blue-800/50">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Student<span className="text-blue-400">Hub</span></span>
                </div>

                <nav className="flex-1 mt-8 px-4 space-y-2">
                    <DashboardLink to="/dashboard" icon={<DashboardIcon />} active={!isComplaints} collapsed={!sidebarOpen}>Overview</DashboardLink>
                    <DashboardLink to="/complaints" icon={<ComplaintsIcon />} active={isComplaints} collapsed={!sidebarOpen}>My Complaints</DashboardLink>
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className={`w-full flex items-center space-x-3 p-3.5 rounded-xl transition-all group text-blue-200 hover:bg-blue-800/50 hover:text-white`}
                    >
                        <span className="text-blue-400 group-hover:text-blue-100 transition-colors"><ProfileIcon /></span>
                        {!sidebarOpen ? null : <span>Profile Settings</span>}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3 pl-6 border-l border-gray-100 hover:bg-gray-50 rounded-lg p-2 transition-colors focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">{student.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{student.department} Dept</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-blue-900/10 border border-gray-100 overflow-hidden z-50">
                                    <button
                                        onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }}
                                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center space-x-2"
                                    >
                                        <ProfileIcon />
                                        <span>Update Profile</span>
                                    </button>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center space-x-2"
                                    >
                                        <LogoutIcon />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Welcome back, {student.name}! 👋</h3>
                            <p className="text-blue-100 max-w-xl">
                                Here's what's happening with your complaints  Track and manage everything in one place.
                            </p>
                        </div>
                        <svg className="absolute right-0 bottom-0 w-64 h-64 text-white/10 -mr-16 -mb-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z" />
                        </svg>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Complaints" value={complaints.length.toString()} color="blue" />
                        <StatCard title="In Progress" value={complaints.filter(c => c.status === 'In Progress').length.toString()} color="orange" />
                        <StatCard title="Resolved" value={complaints.filter(c => c.status === 'Resolved').length.toString()} color="green" />
                        <StatCard title="Pending Review" value={complaints.filter(c => c.status === 'Pending').length.toString()} color="purple" />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Details */}
                        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Profile Details</span>
                            </h4>
                            <div className="space-y-6">
                                <DetailItem label="Full Name" value={student.name || 'N/A'} />
                                <DetailItem label="Email Address" value={student.email} />
                                <DetailItem label="Department" value={student.department || 'N/A'} />
                                <DetailItem label="Student ID" value={student.studentID || 'N/A'} />
                            </div>
                            <button className="w-full mt-8 py-3 bg-gray-50 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        {/* Recent Activity or Form */}
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            {showForm ? (
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-lg font-bold text-gray-900">New Complaint</h4>
                                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                                    </div>
                                    <form onSubmit={handleCreateComplaint} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brief summary of the issue" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="Academic">Academic</option>
                                                <option value="Administrative">Administrative</option>
                                                <option value="Facilities">Facilities</option>
                                                <option value="Other">department head</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="Detailed description of your complaint..."></textarea>
                                        </div>
                                        <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all">Submit Complaint</button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-lg font-bold text-gray-900">Recent Complaints</h4>
                                        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors">New Complaint</button>
                                    </div>

                                    {isLoading ? (
                                        <p className="text-center text-gray-500 py-8">Loading complaints...</p>
                                    ) : complaints.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h5 className="text-gray-900 font-bold mb-1">No complaints found</h5>
                                            <p className="text-gray-500 text-sm max-w-xs mb-6">You haven't submitted any complaints yet. Your history will appear here.</p>
                                            <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all">
                                                New Complaint
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {complaints.map((c) => (
                                                <div key={c.id} className="p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h5 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-tight">{c.title}</h5>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{c.category}</p>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                c.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>
                                                            {c.status || 'Pending'}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 italic">"{c.description}"</p>
                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                                        <span className="text-[10px] text-slate-400 font-bold">{new Date(c.created_at).toLocaleDateString()}</span>
                                                        <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest leading-none">View Details</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            {/* Profile Update Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-gray-100">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-3 text-blue-600">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <ProfileIcon />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
                                </div>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Department</label>
                                        <select
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900"
                                            value={profileForm.department}
                                            onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                                        >
                                            <option value="">Select Dept</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Business">Business</option>
                                            <option value="Arts">Arts</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Student ID</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900"
                                            value={profileForm.studentID}
                                            onChange={(e) => setProfileForm({ ...profileForm, studentID: e.target.value })}
                                            placeholder="e.g. STU123"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowProfileModal(false)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-bold text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-md shadow-blue-600/20 transition-all transform active:scale-95"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const DashboardLink: React.FC<{ to: string, icon: React.ReactNode, children: React.ReactNode, active?: boolean, collapsed?: boolean }> = ({ to, icon, children, active, collapsed }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-bold' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
    >
        <span className={`${active ? 'text-white' : 'text-blue-400 group-hover:text-blue-100'} transition-colors`}>{icon}</span>
        {!collapsed && <span>{children}</span>}
    </Link>
);

const StatCard: React.FC<{ title: string, value: string, color: 'blue' | 'green' | 'orange' | 'purple' }> = ({ title, value, color }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        green: 'text-green-600 bg-green-50 border-green-100',
        orange: 'text-orange-600 bg-orange-50 border-orange-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-100'
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h5 className="text-gray-500 text-sm font-medium mb-1">{title}</h5>
            <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900">{value}</span>
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs ${colors[color]}`}>
                    {title.charAt(0)}
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <p className="text-gray-900 font-medium">{value}</p>
    </div>
);

// Icons
const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
    </svg>
);
const ComplaintsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const ProfileIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const LogoutIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default StudentDashboard;