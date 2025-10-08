// frontend/src/components/Sidebar.jsx
import React from 'react';
import { 
    LayoutDashboard, 
    CircleDollarSign, 
    ReceiptText, 
    FileText, 
    LogOut,
    User 
} from 'lucide-react'; // Using lucide-react for professional icons

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard', color: 'text-indigo-600' },
    { name: 'Add Transaction', icon: CircleDollarSign, view: 'manual', color: 'text-green-600' },
    { name: 'Scan Receipt (AI)', icon: ReceiptText, view: 'receipt', color: 'text-blue-600' },
    { name: 'Upload PDF (Bonus)', icon: FileText, view: 'pdf_upload', color: 'text-yellow-600' },
];

export default function Sidebar({ currentView, setView, user, onLogout }) {
    return (
        <div className="bg-white shadow-2xl p-6 min-h-screen border-r border-gray-200 w-full">
            <div className="flex flex-col space-y-6">
                
                {/* User Status Card */}
                <div className="p-3 bg-indigo-50 rounded-xl shadow-inner border border-indigo-200">
                    <User className="w-6 h-6 text-indigo-600 mb-2" />
                    <p className="text-sm font-medium text-gray-500">Welcome back,</p>
                    <p className="text-lg font-bold text-indigo-800 truncate">
                        {user ? user.username : 'Guest'}
                    </p>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2 pt-4 border-t">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => setView(item.view)}
                                className={`flex items-center w-full p-3 rounded-xl transition duration-200 shadow-md ${
                                    currentView === item.view
                                        ? 'bg-indigo-600 text-white font-bold' // <-- Solid indigo background for clear active state
                                        : 'text-gray-700 hover:bg-indigo-100' // <-- Light hover state
                                }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${currentView === item.view ? 'text-white' : item.color}`} />
                                <span className="text-sm">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                {user && (
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full p-3 rounded-xl transition duration-200 text-red-600 hover:bg-red-50 border border-red-200 mt-6"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                )}
            </div>
        </div>
    );
}