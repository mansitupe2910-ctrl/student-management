import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Shield,
  GraduationCap,
  KeyRound,
  UserCheck,
  Edit2,
  X,
  Check,
  Send
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  addedBy: 'Admin' | 'Teacher';
  addedAt: string;
}

type UserRole = 'admin' | 'teacher';

interface CurrentUser {
  role: UserRole;
  displayName: string;
}

// Configured Passkeys
const PASSKEYS: Record<UserRole, string> = {
  admin: 'admin2026',
  teacher: 'teacher2026'
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    department: 'Computer Science',
    addedBy: 'Admin',
    addedAt: '2026-10-01 09:30'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@university.edu',
    department: 'Mechanical Engineering',
    addedBy: 'Teacher',
    addedAt: '2026-10-01 11:15'
  },
  {
    id: 3,
    name: 'Clara Oswald',
    email: 'clara.oswald@university.edu',
    department: 'Electrical Engineering',
    addedBy: 'Admin',
    addedAt: '2026-10-01 14:20'
  }
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('sms_current_user');
    return saved ? JSON.parse(saved) : { role: 'teacher', displayName: 'Faculty Teacher' };
  });

  const [inputPasskey, setInputPasskey] = useState('');
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole>('teacher');
  const [loginError, setLoginError] = useState('');

  // Shared Student List (persisted in localStorage so changes sync immediately across portals)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sms_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Next ID sequence
  const [nextId, setNextId] = useState<number>(() => {
    const saved = localStorage.getItem('sms_students');
    if (saved) {
      const parsed: Student[] = JSON.parse(saved);
      return parsed.length > 0 ? Math.max(...parsed.map(s => s.id)) + 1 : 1;
    }
    return 4;
  });

  // Teacher & Admin Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDept, setFormDept] = useState('Computer Science');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAddedStudent, setLastAddedStudent] = useState<Student | null>(null);

  // Admin Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Admin: Toggle Add Student Section in Admin Portal
  const [showAdminAddForm, setShowAdminAddForm] = useState(false);

  // Admin: Edit Student Modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync students to localStorage
  useEffect(() => {
    localStorage.setItem('sms_students', JSON.stringify(students));
  }, [students]);

  // Sync user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sms_current_user');
    }
  }, [currentUser]);

  // Handle Passkey Login
  const handlePasskeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedPasskey = inputPasskey.trim();

    if (!trimmedPasskey) {
      setLoginError('Please enter your passkey.');
      return;
    }

    if (trimmedPasskey === PASSKEYS[selectedRoleForLogin]) {
      const user: CurrentUser = {
        role: selectedRoleForLogin,
        displayName: selectedRoleForLogin === 'admin' ? 'Administrator' : 'Faculty Teacher'
      };
      setCurrentUser(user);
      setInputPasskey('');
      showNotification(`Logged in as ${user.displayName}.`, 'success');
    } else {
      setLoginError(`Invalid passkey for ${selectedRoleForLogin === 'admin' ? 'Administrator' : 'Teacher'}.`);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setInputPasskey('');
    setLoginError('');
    showNotification('Logged out successfully.', 'info');
  };

  // Handle Adding Student (from Teacher or Admin)
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formName.trim();
    const email = formEmail.trim();
    const dept = formDept.trim();

    if (!name || !email || !dept) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    // Check duplicate email
    const exists = students.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showNotification(`A student with email "${email}" already exists.`, 'error');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newStudent: Student = {
      id: nextId,
      name,
      email,
      department: dept,
      addedBy: currentUser?.role === 'admin' ? 'Admin' : 'Teacher',
      addedAt: timestamp
    };

    // Add to list immediately
    const updated = [newStudent, ...students];
    setStudents(updated);
    setNextId(nextId + 1);
    setLastAddedStudent(newStudent);

    // Reset Form
    setFormName('');
    setFormEmail('');
    setIsSubmitting(false);

    if (currentUser?.role === 'teacher') {
      showNotification(
        `Student "${newStudent.name}" submitted! Record updated in the Admin Portal.`,
        'success'
      );
    } else {
      showNotification(`Student "${newStudent.name}" added to database.`, 'success');
      setShowAdminAddForm(false);
    }
  };

  // Handle Delete Student (Admin only)
  const handleDeleteStudent = (id: number, name: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only administrators have permission to delete students.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete student "${name}" (ID #${id})?`)) {
      return;
    }

    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    showNotification(`Student ID #${id} (${name}) deleted from database.`, 'info');
  };

  // Handle Update Student (Admin only)
  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = students.map(s => (s.id === editingStudent.id ? editingStudent : s));
    setStudents(updated);
    setEditingStudent(null);
    showNotification(`Student "${editingStudent.name}" updated successfully.`, 'success');
  };

  // Filtered Students (for Admin Management)
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.id).includes(searchQuery);

    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* ==============================================================
            HEADING: Strictly NOTHING around it, pristine alignment
            ============================================================== */}
        <header className="mb-6 pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Student Management System
          </h1>
        </header>

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 transition-all animate-in fade-in">
            <div
              className={`px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2.5 border ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : notification.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                  : 'bg-blue-50 text-blue-900 border-blue-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* ==============================================================
            SCREEN 1: PASSKEY LOGIN (WHEN LOGGED OUT)
            ============================================================== */}
        {!currentUser ? (
          <div className="max-w-md mx-auto mt-10">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Passkey Login</h2>
                  <p className="text-xs text-slate-500">Access Teacher Portal or Admin Portal</p>
                </div>
              </div>

              {loginError && (
                <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handlePasskeyLogin} className="space-y-4">
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleForLogin('teacher');
                        setLoginError('');
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                        selectedRoleForLogin === 'teacher'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Teacher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleForLogin('admin');
                        setLoginError('');
                      }}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                        selectedRoleForLogin === 'admin'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                {/* Passkey Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {selectedRoleForLogin === 'admin' ? 'Admin' : 'Teacher'} Passkey
                  </label>
                  <input
                    type="password"
                    value={inputPasskey}
                    onChange={e => setInputPasskey(e.target.value)}
                    placeholder={`Enter ${selectedRoleForLogin} passkey`}
                    autoFocus
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                </div>

                {/* Default Passkey Hints */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <span className="font-semibold text-slate-700 block">Default Passkeys:</span>
                  <div className="flex items-center justify-between">
                    <span>Teacher (Add Student):</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleForLogin('teacher');
                        setInputPasskey('teacher2026');
                      }}
                      className="font-mono text-blue-600 hover:underline bg-white px-2 py-0.5 rounded border border-slate-200"
                    >
                      teacher2026
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admin (Manage Students):</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleForLogin('admin');
                        setInputPasskey('admin2026');
                      }}
                      className="font-mono text-purple-600 hover:underline bg-white px-2 py-0.5 rounded border border-slate-200"
                    >
                      admin2026
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Log In with Passkey</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ==============================================================
              SCREEN 2: AUTHENTICATED PORTALS
              ============================================================== */
          <div className="space-y-6">
            
            {/* Contextual Status Bar */}
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {currentUser.displayName}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {currentUser.role === 'teacher'
                      ? 'Teacher Access: Submit new students. Records update immediately in the Admin Portal.'
                      : 'Administrator Access: Full management of all students (edit, delete, search, filter).'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Switch to other portal or Logout */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const newRole: UserRole = currentUser.role === 'admin' ? 'teacher' : 'admin';
                    setCurrentUser({
                      role: newRole,
                      displayName: newRole === 'admin' ? 'Administrator' : 'Faculty Teacher'
                    });
                    showNotification(`Switched to ${newRole === 'admin' ? 'Admin Portal' : 'Teacher Portal'}.`, 'info');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  title="Switch between Teacher and Admin to test live synchronization"
                >
                  Switch to {currentUser.role === 'admin' ? 'Teacher Portal' : 'Admin Portal'}
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* ==============================================================
                TEACHER PORTAL: ONLY ADD STUDENT
                ============================================================== */}
            {currentUser.role === 'teacher' && (
              <div className="max-w-2xl mx-auto space-y-5">
                <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
                  <div className="pb-4 border-b border-slate-100 mb-5">
                    <h2 className="font-bold text-slate-900 text-lg">
                      Add New Student
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter student details below. Once added, the record is immediately updated in the Admin Portal.
                    </p>
                  </div>

                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        required
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        placeholder="e.g. eleanor.vance@university.edu"
                        required
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Academic Department <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formDept}
                        onChange={e => setFormDept(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                        <option value="Information Systems">Information Systems</option>
                        <option value="Physics">Physics</option>
                      </select>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Add Student</span>
                      </button>
                    </div>
                  </form>
                </section>

                {/* Confirmation Box for Teacher */}
                {lastAddedStudent && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Last student added successfully!</p>
                      <p className="mt-0.5">
                        <strong>{lastAddedStudent.name}</strong> ({lastAddedStudent.email}) - {lastAddedStudent.department}.
                      </p>
                      <p className="text-emerald-700 mt-1">
                        This record is now actively updated and visible in the Administrator Portal.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==============================================================
                ADMIN PORTAL: COMPLETE MANAGEMENT OF STUDENTS
                ============================================================== */}
            {currentUser.role === 'admin' && (
              <div className="space-y-6">
                
                {/* Admin Management Section */}
                <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  
                  {/* Management Header & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="font-bold text-slate-900 text-lg">
                        Manage Students
                      </h2>
                      <span className="text-xs text-slate-500 font-mono tabular-nums">
                        {filteredStudents.length} of {students.length} total students registered
                      </span>
                    </div>

                    {/* Filter, Search & Admin Add Button */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search students..."
                          className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-36 sm:w-44"
                        />
                      </div>

                      <select
                        value={deptFilter}
                        onChange={e => setDeptFilter(e.target.value)}
                        className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
                      >
                        <option value="ALL">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                        <option value="Information Systems">Information Systems</option>
                        <option value="Physics">Physics</option>
                      </select>

                      <button
                        onClick={() => setShowAdminAddForm(!showAdminAddForm)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{showAdminAddForm ? 'Close Form' : 'Add Student'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Optional Admin Add Student Form (Collapsible) */}
                  {showAdminAddForm && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                      <h3 className="font-semibold text-slate-900 text-sm mb-3">
                        Admin: Register New Student
                      </h3>
                      <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          placeholder="Full Name *"
                          required
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                        />
                        <input
                          type="email"
                          value={formEmail}
                          onChange={e => setFormEmail(e.target.value)}
                          placeholder="Email Address *"
                          required
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                        />
                        <div className="flex gap-2">
                          <select
                            value={formDept}
                            onChange={e => setFormDept(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                          >
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                            <option value="Information Systems">Information Systems</option>
                            <option value="Physics">Physics</option>
                          </select>
                          <button
                            type="submit"
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Management Data Table */}
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/60">
                          <th className="py-2.5 px-3 w-16 text-left">ID</th>
                          <th className="py-2.5 px-3 text-left">Name</th>
                          <th className="py-2.5 px-3 text-left">Email</th>
                          <th className="py-2.5 px-3 text-left">Department</th>
                          <th className="py-2.5 px-3 text-left">Origin</th>
                          <th className="py-2.5 px-3 text-right w-28">Management</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                              <p className="font-medium text-slate-700">No students found</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {searchQuery || deptFilter !== 'ALL'
                                  ? 'Try modifying your search or department filter.'
                                  : 'No students registered. Teachers or admins can add students.'}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50/75 transition-colors">
                              <td className="py-3 px-3 font-mono text-xs text-slate-400 tabular-nums">
                                #{student.id}
                              </td>
                              <td className="py-3 px-3 font-medium text-slate-900">
                                {student.name}
                              </td>
                              <td className="py-3 px-3 text-slate-600 text-xs font-mono">
                                {student.email}
                              </td>
                              <td className="py-3 px-3 text-slate-600 text-xs">
                                {student.department}
                              </td>
                              <td className="py-3 px-3 text-slate-500 text-xs">
                                <span
                                  className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                                    student.addedBy === 'Teacher'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : 'bg-purple-50 text-purple-700 border border-purple-100'
                                  }`}
                                >
                                  {student.addedBy}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingStudent(student)}
                                    className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                                    title="Edit student"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student.id, student.name)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                                    title={`Delete ${student.name}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

          </div>
        )}

        {/* ==============================================================
            MODAL: EDIT STUDENT (ADMIN ONLY)
            ============================================================== */}
        {editingStudent && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-semibold text-slate-900 text-base">
                  Edit Student #{editingStudent.id}
                </h3>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={editingStudent.department}
                    onChange={e => setEditingStudent({ ...editingStudent, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                    <option value="Information Systems">Information Systems</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
