import React, { useState } from 'react';
import { List, CreditCard, History, Plus, FileText, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import { MOCK_EXPENSES, MOCK_HISTORY } from '../constants';
import { TripRecord, Expense } from '../types';

interface TripOrganizerProps {
    bookings?: TripRecord[];
    expenses?: Expense[];
}

export const TripOrganizer: React.FC<TripOrganizerProps> = ({ bookings = MOCK_HISTORY, expenses: initialExpenses }) => {
    const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses' | 'history'>('itinerary');
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses || MOCK_EXPENSES);
    const [newExpense, setNewExpense] = useState({ item: '', amount: '' });
    
    // Dynamic Budget Calculation
    const [totalBudget, setTotalBudget] = useState(25000);
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    // Include bookings cost in total spent? For now, let's assume Bookings are separate or pre-paid. 
    // But let's show them in history.

    const handleAddExpense = () => {
        if (!newExpense.item || !newExpense.amount) return;
        const exp: Expense = {
            id: Date.now().toString(),
            category: 'Misc',
            amount: parseFloat(newExpense.amount),
            currency: 'INR',
            date: new Date().toISOString().split('T')[0],
            note: newExpense.item
        };
        setExpenses([exp, ...expenses]);
        setNewExpense({ item: '', amount: '' });
    };

    const renderItineraryColumn = () => (
        <div className="space-y-4 animate-fade-in">
             <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
                 <h2 className="font-bold text-lg">Current Trip: Rajasthan</h2>
                 <p className="text-xs opacity-90 mb-3">5 Days • Family Trip</p>
                 <div className="flex justify-between text-xs font-semibold bg-white/20 p-2 rounded-lg">
                     <span>Status: Ongoing</span>
                     <span>Day 2 of 5</span>
                 </div>
             </div>

             <div className="space-y-3">
                 <h3 className="font-bold text-slate-700 text-sm">Today's Plan</h3>
                 {['Breakfast at Laxmi Mishthan', 'Visit Amber Fort (10 AM)', 'Shopping at Johri Bazaar', 'Dinner at Chokhi Dhani'].map((item, i) => (
                     <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center shadow-sm">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${i === 0 ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                             {i === 0 && <CheckCircle size={12}/>}
                         </div>
                         <span className={`text-sm ${i === 0 ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item}</span>
                     </div>
                 ))}
                 
                 {/* Dynamically Added Bookings showing up in Itinerary */}
                 {bookings.filter(b => b.status === 'Upcoming').map(b => (
                      <div key={b.id} className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center shadow-sm">
                         <div className="w-5 h-5 rounded-full border-2 border-indigo-300 flex items-center justify-center mr-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                         </div>
                         <div>
                            <span className="text-sm font-bold text-indigo-900">{b.destination}</span>
                            <p className="text-[10px] text-indigo-600">{b.type} • {b.date}</p>
                         </div>
                     </div>
                 ))}

                 <button className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                     + Add Custom Activity
                 </button>
             </div>
        </div>
    );

    const renderExpensesColumn = () => (
        <div className="space-y-4 animate-fade-in">
             {/* Total Budget Input */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">Total Budget</span>
                    <span className="text-xs font-bold text-slate-500">Spent: ₹{totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-slate-700">₹</span>
                    <input 
                        type="number" 
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(Number(e.target.value))}
                        className="font-bold text-lg text-slate-800 w-full outline-none border-b border-slate-200 focus:border-indigo-500"
                    />
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div 
                        className={`h-2 rounded-full transition-all duration-500 ${totalSpent > totalBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                    ></div>
                </div>
                <div className="mt-2 text-right">
                    <span className={`text-xs font-bold ${totalBudget - totalSpent < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {totalBudget - totalSpent < 0 ? 'Over Budget by ' : 'Remaining: '} 
                        ₹{Math.abs(totalBudget - totalSpent).toLocaleString()}
                    </span>
                </div>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 text-sm mb-3">Add New Expense</h3>
                 <div className="flex space-x-2 mb-2">
                     <input 
                        value={newExpense.item}
                        onChange={(e) => setNewExpense({...newExpense, item: e.target.value})}
                        placeholder="Item (e.g. Taxi)"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500"
                     />
                     <input 
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        placeholder="Amount"
                        type="number"
                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500"
                     />
                 </div>
                 <button onClick={handleAddExpense} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-indigo-700">
                     Add to Tracker
                 </button>
             </div>

             <div className="space-y-2">
                 {expenses.map((exp) => (
                     <div key={exp.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                         <div className="flex items-center space-x-3">
                             <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                                 <CreditCard size={16} />
                             </div>
                             <div>
                                 <p className="font-bold text-slate-800 text-sm">{exp.note || exp.category}</p>
                                 <p className="text-[10px] text-slate-400">{exp.date}</p>
                             </div>
                         </div>
                         <span className="font-bold text-slate-800">₹{exp.amount}</span>
                     </div>
                 ))}
             </div>
        </div>
    );

    const renderHistoryColumn = () => (
        <div className="space-y-4 animate-fade-in">
             {bookings.map((trip) => (
                 <div key={trip.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold rounded-bl-xl ${
                         trip.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                         trip.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                     }`}>
                         {trip.status}
                     </div>
                     
                     <div className="flex items-start space-x-3 mb-3">
                         <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                             <History size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800">{trip.destination}</h3>
                             <p className="text-xs text-slate-500">{trip.date}</p>
                         </div>
                     </div>
                     
                     <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                         <span className="text-xs text-slate-500">Total Spent</span>
                         <span className="font-bold text-slate-800">₹{trip.totalCost.toLocaleString()}</span>
                     </div>
                     
                     {trip.status === 'Completed' && (
                         <button className="w-full mt-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                             View Memories
                         </button>
                     )}
                 </div>
             ))}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Trip Organizer</h2>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    {[
                        {id: 'itinerary', icon: List, label: 'Itinerary'},
                        {id: 'expenses', icon: CreditCard, label: 'Expenses'},
                        {id: 'history', icon: History, label: 'History'},
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                        >
                            <tab.icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'itinerary' && renderItineraryColumn()}
                {activeTab === 'expenses' && renderExpensesColumn()}
                {activeTab === 'history' && renderHistoryColumn()}
            </div>
        </div>
    );
};