'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [trustees, setTrustees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<'cattle' | 'medical' | 'gavyam' | 'inventory' | 'donations' | 'expenses' | 'staff' | 'docs' | 'reports' | 'users'>('cattle');

  const [cattleList, setCattleList] = useState<any[]>([]);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState<string | null>(null);
  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('Desi');
  const [gender, setGender] = useState('Cow');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [locationShed, setLocationShed] = useState('Main Shelter');
  const [sponsorName, setSponsorName] = useState('');
  const [motherTag, setMotherTag] = useState('');

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [vaccinationsList, setVaccinationsList] = useState<any[]>([]);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [medCattleId, setMedCattleId] = useState('');
  const [condition, setCondition] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [vetName, setVetName] = useState('Dr. Sharma');
  const [vacCattleTag, setVacCattleTag] = useState('');
  const [vaccineType, setVaccineType] = useState('FMD (Foot & Mouth)');
  const [customVaccine, setCustomVaccine] = useState('');
  const [vacDueDate, setVacDueDate] = useState('');

  const [gavyamList, setGavyamList] = useState<any[]>([]);
  const [showGavyamModal, setShowGavyamModal] = useState(false);
  const [morningMilk, setMorningMilk] = useState('');
  const [eveningMilk, setEveningMilk] = useState('');
  const [calfMilk, setCalfMilk] = useState('');
  const [gavyamNotes, setGavyamNotes] = useState('');

  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStockLogModal, setShowStockLogModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [logType, setLogType] = useState<'IN' | 'OUT'>('IN');
  const [logQty, setLogQty] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Fodder');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Kg');
  const [newItemThreshold, setNewItemThreshold] = useState('50');

  const [donationsList, setDonationsList] = useState<any[]>([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<any | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [donationTxnRef, setDonationTxnRef] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [donationPurpose, setDonationPurpose] = useState('General Gau Seva (12A & 80G Eligible)');

  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Fodder & Feed');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePaymentMode, setExpensePaymentMode] = useState('Cash');
  const [expenseTxnRef, setExpenseTxnRef] = useState('');
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [expenseBillNo, setExpenseBillNo] = useState('');

  const [staffList, setStaffList] = useState<any[]>([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Gwala / Caretaker');
  const [staffSalary, setStaffSalary] = useState('');
  const [staffAdvance, setStaffAdvance] = useState('0');
  const [staffAdvanceNotes, setStaffAdvanceNotes] = useState('');

  const [docsList, setDocsList] = useState<any[]>([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('12A / 80G / Legal');
  const [docNumber, setDocNumber] = useState('');
  const [docExpiry, setDocExpiry] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const [userList, setUserList] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showResetPwModal, setShowResetPwModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
  const [newUserModules, setNewUserModules] = useState<string[]>(['cattle', 'medical', 'gavyam', 'inventory', 'donations', 'expenses', 'staff', 'docs', 'reports']);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<any | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState<'admin' | 'user'>('admin');
  const [editUserModules, setEditUserModules] = useState<string[]>([]);
  const [resetPwInput, setResetPwInput] = useState('');

  async function refreshProfiles(currentFallbackProfile?: any) {
    try {
      const { data: rpcJson } = await supabase.rpc('get_all_trustees');
      if (Array.isArray(rpcJson) && rpcJson.length > 0) {
        setUserList(rpcJson);
        setTrustees(rpcJson);
        return rpcJson;
      }
    } catch (e) {}

    const { data: directProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, trustee_id, role, assigned_modules');

    if (directProfiles && directProfiles.length > 0) {
      setUserList(directProfiles);
      setTrustees(directProfiles);
      return directProfiles;
    }

    if (currentFallbackProfile) {
      setUserList([currentFallbackProfile]);
      setTrustees([currentFallbackProfile]);
    }
    return [];
  }

  async function loadAdminData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/';
      return;
    }

    const emailPrefix = user.email?.split('@')[0]?.toUpperCase() || 'SUPERADMIN';
    const currentProfile = {
      id: user.id,
      full_name: user.email === 'sushanto@maiyajashoda.org' ? 'Sushanto Chakraborty' : (user.email === 'balvirgiri@maiyajashoda.org' ? 'Balvir Giri' : 'Trust Super Admin'),
      role: 'admin',
      trustee_id: emailPrefix,
      assigned_modules: ['cattle', 'medical', 'gavyam', 'inventory', 'donations', 'expenses', 'staff', 'docs', 'reports', 'users']
    };
    setProfile(currentProfile);

    await refreshProfiles(currentProfile);

    const { data: cattle } = await supabase.from('cattle').select('*').order('created_at', { ascending: false });
    setCattleList(cattle || []);

    const { data: meds } = await supabase.from('medical_records').select('*, cattle(tag_number, name, gender, health_status)').order('created_at', { ascending: false });
    setMedicalRecords(meds || []);

    const { data: vacs } = await supabase.from('vaccinations').select('*').order('due_date', { ascending: true });
    setVaccinationsList(vacs || []);

    const { data: gavs } = await supabase.from('gavyam_logs').select('*').order('log_date', { ascending: false });
    setGavyamList(gavs || []);

    const { data: inv } = await supabase.from('inventory').select('*').order('item_name', { ascending: true });
    setInventoryList(inv || []);

    const { data: invLogs } = await supabase.from('inventory_logs').select('*, inventory(item_name, unit)').order('logged_at', { ascending: false }).limit(25);
    setInventoryLogs(invLogs || []);

    const { data: dons } = await supabase.from('donations').select('*').order('donation_date', { ascending: false });
    setDonationsList(dons || []);

    const { data: exps } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    setExpensesList(exps || []);

    const { data: stf } = await supabase.from('sevadars').select('*').order('created_at', { ascending: false });
    setStaffList(stf || []);

    const { data: dcs } = await supabase.from('trust_documents').select('*').order('created_at', { ascending: false });
    setDocsList(dcs || []);

    setLoading(false);
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleSaveAnimal(e: React.FormEvent) {
    e.preventDefault();
    if (!tagNumber || !name) return;
    setSubmitting(true);

    const payload: any = {
      tag_number: tagNumber.trim(),
      name: name.trim(),
      breed,
      gender,
      health_status: healthStatus,
      location_shed: locationShed,
      sponsor_name: sponsorName.trim() || null,
      mother_tag: motherTag.trim() || null,
    };

    if (editingAnimalId) {
      await supabase.from('cattle').update(payload).eq('id', editingAnimalId);
    } else {
      await supabase.from('cattle').insert([payload]);
    }

    setShowAnimalModal(false);
    setEditingAnimalId(null);
    setTagNumber('');
    setName('');
    setSponsorName('');
    setMotherTag('');
    await loadAdminData();
    setSubmitting(false);
  }

  async function handleDeleteAnimal(item: any) {
    if (!window.confirm(`Kya aap "${item.name}" (${item.tag_number}) ko remove karna chahte hain?`)) return;
    await supabase.from('cattle').delete().eq('id', item.id);
    await loadAdminData();
  }

  async function handleSaveMedical(e: React.FormEvent) {
    e.preventDefault();
    if (!medCattleId || !condition) return;
    setSubmitting(true);

    await supabase.from('medical_records').insert([{
      cattle_id: medCattleId,
      condition: condition.trim(),
      treatment_details: treatmentDetails.trim(),
      vet_name: vetName.trim(),
      status: 'Ongoing',
    }]);

    await supabase.from('cattle').update({ health_status: 'Under Treatment' }).eq('id', medCattleId);

    setShowMedicalModal(false);
    setCondition('');
    setTreatmentDetails('');
    await loadAdminData();
    setSubmitting(false);
  }

  async function handleDeleteMedical(id: string) {
    if (!window.confirm('Kya aap is medical entry ko delete karna chahte hain?')) return;
    await supabase.from('medical_records').delete().eq('id', id);
    await loadAdminData();
  }

  async function handleMarkRecovered(rec: any) {
    await supabase.from('medical_records').update({ status: 'Recovered' }).eq('id', rec.id);
    await supabase.from('cattle').update({ health_status: 'Healthy' }).eq('id', rec.cattle_id);
    await loadAdminData();
  }

  async function handleSaveVaccine(e: React.FormEvent) {
    e.preventDefault();
    if (!vacCattleTag || !vacDueDate) return;
    setSubmitting(true);

    const finalVaccineType = vaccineType === 'Other (Manual)' ? customVaccine.trim() : vaccineType;

    const { error } = await supabase.from('vaccinations').insert([{
      cattle_tag: vacCattleTag.trim(),
      vaccine_type: finalVaccineType,
      due_date: vacDueDate,
      status: 'Pending'
    }]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setShowVaccineModal(false);
      setVacCattleTag('');
      setCustomVaccine('');
      setVacDueDate('');
      await loadAdminData();
    }
    setSubmitting(false);
  }

  async function handleDeleteVaccine(id: string) {
    if (!window.confirm('Kya aap is vaccine schedule ko delete karna chahte hain?')) return;
    await supabase.from('vaccinations').delete().eq('id', id);
    await loadAdminData();
  }

  async function handleCompleteVaccine(v: any) {
    await supabase.from('vaccinations').update({ status: 'Completed' }).eq('id', v.id);
    await loadAdminData();
  }

  async function handleSaveGavyam(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('gavyam_logs').insert([{
      morning_milk: Number(morningMilk) || 0,
      evening_milk: Number(eveningMilk) || 0,
      calf_consumption: Number(calfMilk) || 0,
      notes: gavyamNotes.trim() || null
    }]);
    setShowGavyamModal(false);
    setMorningMilk('');
    setEveningMilk('');
    setCalfMilk('');
    setGavyamNotes('');
    await loadAdminData();
    setSubmitting(false);
  }

  async function handleSaveNewItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName) return;
    setSubmitting(true);
    const initialStock = Number(newItemQty) || 0;

    const { data: ins } = await supabase.from('inventory').insert([{
      item_name: newItemName.trim(),
      category: newItemCategory,
      quantity: initialStock,
      unit: newItemUnit.trim(),
      min_alert_threshold: Number(newItemThreshold) || 20,
    }]).select().single();

    if (ins && initialStock > 0) {
      await supabase.from('inventory_logs').insert([{
        item_id: ins.id,
        change_type: 'IN',
        quantity: initialStock,
        notes: 'Initial opening stock',
      }]);
    }
    setNewItemName('');
    setNewItemQty('');
    setShowItemModal(false);
    await loadAdminData();
    setSubmitting(false);
  }

  async function handleSaveStockLog(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem || !logQty) return;
    const amount = Number(logQty);
    setSubmitting(true);

    const newQty = logType === 'IN' ? Number(selectedItem.quantity) + amount : Math.max(0, Number(selectedItem.quantity) - amount);
    await supabase.from('inventory').update({ quantity: newQty, last_updated: new Date().toISOString() }).eq('id', selectedItem.id);
    await supabase.from('inventory_logs').insert([{
      item_id: selectedItem.id,
      change_type: logType,
      quantity: amount,
      notes: logNotes.trim(),
    }]);

    setShowStockLogModal(false);
    setLogQty('');
    setLogNotes('');
    await loadAdminData();
    setSubmitting(false);
  }

  async function handleSaveDonation(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(donationAmount);
    if (!donorName || isNaN(amt) || amt <= 0) return;
    setSubmitting(true);

    const receipt = `MJGST-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    await supabase.from('donations').insert([{
      donor_name: donorName.trim(),
      amount: amt,
      payment_mode: paymentMode,
      transaction_ref: paymentMode !== 'Cash' ? donationTxnRef.trim() : null,
      receipt_number: receipt,
      purpose: `General Gau Seva | PAN: ${donorPan ? donorPan.toUpperCase() : 'N/A'} (12A & 80G Certified)`,
    }]);

    setShowDonationModal(false);
    setDonorName('');
    setDonationAmount('');
    setDonationTxnRef('');
    setDonorPan('');
    setPaymentMode('Cash');
    await loadAdminData();
    setSubmitting(false);
  }

  function handleExportDonationsCSV() {
    const headers = ['Receipt_No,Donor_Name,Amount_INR,Payment_Mode,Reference,Details_PAN_80G,Date'];
    const rows = donationsList.map(d =>
      `"${d.receipt_number}","${d.donor_name}",${d.amount},"${d.payment_mode}","${d.transaction_ref || ''}","${(d.purpose || '').replace(/"/g, '""')}","${d.donation_date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Maiya_Jashoda_80G_Donations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleSaveExpense(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(expenseAmount);
    if (!expenseTitle || isNaN(amt) || amt <= 0) return;
    setSubmitting(true);

    const { error } = await supabase.from('expenses').insert([{
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: amt,
      payment_mode: expensePaymentMode,
      transaction_ref: expensePaymentMode !== 'Cash' ? expenseTxnRef.trim() : null,
      paid_to: expensePaidTo.trim(),
      bill_number: expenseBillNo.trim() || null
    }]);

    if (error) {
      alert('Error saving expense: ' + error.message);
    } else {
      setShowExpenseModal(false);
      setExpenseTitle('');
      setExpenseAmount('');
      setExpenseTxnRef('');
      setExpensePaidTo('');
      setExpenseBillNo('');
      setExpensePaymentMode('Cash');
      await loadAdminData();
    }
    setSubmitting(false);
  }

  async function handleSaveStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!staffName || !staffSalary) return;
    setSubmitting(true);

    const payload = {
      full_name: staffName.trim(),
      role: staffRole,
      monthly_salary: Number(staffSalary) || 0,
      advance_taken: Number(staffAdvance) || 0,
      advance_notes: staffAdvanceNotes.trim() || null,
      status: 'Active'
    };

    let error = null;
    if (editingStaffId) {
      const res = await supabase.from('sevadars').update(payload).eq('id', editingStaffId);
      error = res.error;
    } else {
      const res = await supabase.from('sevadars').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert('Error saving sevadar: ' + error.message);
    } else {
      setShowStaffModal(false);
      setEditingStaffId(null);
      setStaffName('');
      setStaffRole('Gwala / Caretaker');
      setStaffSalary('');
      setStaffAdvance('0');
      setStaffAdvanceNotes('');
      await loadAdminData();
    }
    setSubmitting(false);
  }

  async function handleDeleteStaff(id: string) {
    if (!window.confirm('Kya aap is sevadar ko delete karna chahte hain?')) return;
    await supabase.from('sevadars').delete().eq('id', id);
    await loadAdminData();
  }

  async function handleSaveDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!docTitle) return;
    setSubmitting(true);

    const { error } = await supabase.from('trust_documents').insert([{
      doc_title: docTitle.trim(),
      category: docCategory,
      doc_number: docNumber.trim() || null,
      expiry_date: docExpiry || null,
      file_url: docUrl.trim() || null
    }]);

    if (error) {
      alert('Error saving document: ' + error.message);
    } else {
      setShowDocModal(false);
      setDocTitle('');
      setDocNumber('');
      setDocExpiry('');
      setDocUrl('');
      await loadAdminData();
    }
    setSubmitting(false);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    const cleanUserId = newUserId.trim();
    if (!newUserName.trim() || !cleanUserId || !newUserPassword.trim()) return;
    setSubmitting(true);

    const { data: res, error: rpcError } = await supabase.rpc('admin_create_user', {
      new_username: newUserName.trim(),
      new_user_id: cleanUserId,
      new_password: newUserPassword.trim(),
      new_role: newUserRole,
      new_modules: newUserModules
    });

    if (rpcError || (res && !res.success)) {
      alert('Error: ' + (rpcError?.message || res?.error));
      setSubmitting(false);
      return;
    }

    setShowUserModal(false);
    setNewUserName('');
    setNewUserId('');
    setNewUserPassword('');
    await refreshProfiles(profile);
    setSubmitting(false);
    alert(`User ID "${cleanUserId.toUpperCase()}" successfully create ho gaya!`);
  }

  function handleOpenEditUser(u: any) {
    setSelectedUserToEdit(u);
    setEditUserName(u.full_name || '');
    setEditUserRole(u.role === 'super_admin' || u.role === 'admin' ? 'admin' : 'user');
    setEditUserModules(u.assigned_modules || ['cattle', 'medical', 'gavyam', 'inventory', 'donations', 'expenses', 'staff', 'docs', 'reports']);
    setShowEditUserModal(true);
  }

  async function handleSaveEditUser(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserToEdit || !editUserName.trim()) return;
    setSubmitting(true);

    await supabase.rpc('admin_update_profile', {
      target_profile_id: selectedUserToEdit.id,
      new_name: editUserName.trim(),
      new_role: editUserRole,
      new_modules: editUserModules
    });

    setShowEditUserModal(false);
    await refreshProfiles(profile);
    setSubmitting(false);
  }

  async function handleSaveResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserToEdit || !resetPwInput.trim()) return;
    setSubmitting(true);

    await supabase.rpc('admin_reset_password', {
      target_user_id: selectedUserToEdit.trustee_id,
      new_password: resetPwInput.trim()
    });

    setShowResetPwModal(false);
    setResetPwInput('');
    setSubmitting(false);
    alert('Password reset successfully!');
  }

  const sickAnimals = cattleList.filter(c => c.health_status === 'Under Treatment' || c.health_status === 'Critical');
  const healthyCount = cattleList.filter(c => c.health_status === 'Healthy').length;
  const lowStockCount = inventoryList.filter(i => Number(i.quantity) <= Number(i.min_alert_threshold)).length;
  const totalDonations = donationsList.reduce((s, d) => s + Number(d.amount || 0), 0);
  const totalExpenses = expensesList.reduce((s, e) => s + Number(e.amount || 0), 0);
  const netTrustBalance = totalDonations - totalExpenses;
  const pendingVaccines = vaccinationsList.filter(v => v.status === 'Pending').length;
  const sickCattleList = cattleList.filter(c => c.health_status === 'Under Treatment' || c.health_status === 'Critical');

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f4', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#57534e', fontSize: '1.1rem', fontWeight: 600 }}>Loading Super Admin ERP Portal...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f5f4', padding: '1.25rem', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #e7e5e4', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2.25rem' }}>🐄</span>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', margin: 0 }}>
              Maiya Jashoda Gauv Seva Trust
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase', margin: '0.15rem 0 0' }}>
              {profile?.full_name} &bull; ROLE: SUPER ADMIN &bull; ID: {profile?.trustee_id}
            </p>
          </div>
        </div>

        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
          style={{ padding: '0.5rem 0.85rem', backgroundColor: '#e7e5e4', color: '#292524', fontWeight: 600, fontSize: '0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </header>

      <div style={{ maxWidth: '1280px', margin: '1.25rem auto 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.45rem', borderBottom: '2px solid #e7e5e4', paddingBottom: '0.5rem', flexWrap: 'wrap', overflowX: 'auto' }}>
          <button onClick={() => setActiveTab('cattle')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'cattle' ? '#b45309' : '#e7e5e4', color: activeTab === 'cattle' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            🐄 Animal & Dattak ({cattleList.length})
          </button>
          <button onClick={() => setActiveTab('medical')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'medical' ? '#b45309' : '#e7e5e4', color: activeTab === 'medical' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            🩺 Medical & Vaccine ({sickAnimals.length + pendingVaccines})
          </button>
          <button onClick={() => setActiveTab('gavyam')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'gavyam' ? '#b45309' : '#e7e5e4', color: activeTab === 'gavyam' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            🥛 Doodh & Gavyam ({gavyamList.length})
          </button>
          <button onClick={() => setActiveTab('inventory')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'inventory' ? '#b45309' : '#e7e5e4', color: activeTab === 'inventory' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            🌾 Chara & Stock {lowStockCount > 0 && `(⚠️ ${lowStockCount})`}
          </button>
          <button onClick={() => setActiveTab('donations')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'donations' ? '#b45309' : '#e7e5e4', color: activeTab === 'donations' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            🙏 Donations 80G (₹{totalDonations.toLocaleString('en-IN')})
          </button>
          <button onClick={() => setActiveTab('expenses')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'expenses' ? '#b45309' : '#e7e5e4', color: activeTab === 'expenses' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            🧾 Expenses (₹{totalExpenses.toLocaleString('en-IN')})
          </button>
          <button onClick={() => setActiveTab('staff')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'staff' ? '#b45309' : '#e7e5e4', color: activeTab === 'staff' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            👷 Sevadar & Salary ({staffList.length})
          </button>
          <button onClick={() => setActiveTab('docs')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'docs' ? '#b45309' : '#e7e5e4', color: activeTab === 'docs' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            📁 Document Vault ({docsList.length})
          </button>
          <button onClick={() => setActiveTab('reports')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'reports' ? '#b45309' : '#e7e5e4', color: activeTab === 'reports' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
            📊 Reports & Analytics
          </button>
          <button onClick={() => setActiveTab('users')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'users' ? '#1e3a8a' : '#dbeafe', color: activeTab === 'users' ? '#fff' : '#1e40af', whiteSpace: 'nowrap' }}>
            👥 User Management ({userList.length})
          </button>
        </div>

        {activeTab === 'cattle' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Gau-Vansh Registry & Gau-Dattak (Sponsorship)</h2>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#78716c' }}>Complete animal records, lineage, and Gau-Dattak donor adoption tracking</p>
              </div>
              <button 
                type="button"
                onClick={() => { 
                  setEditingAnimalId(null); 
                  setTagNumber(''); 
                  setName(''); 
                  setGender('Cow'); 
                  setLocationShed('Main Shelter');
                  setHealthStatus('Healthy');
                  setSponsorName(''); 
                  setMotherTag(''); 
                  setShowAnimalModal(true); 
                }} 
                style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              >
                + Enroll New Animal
              </button>
            </div>

            {/* --- DESKTOP TABLE VIEW --- */}
            <div className="hidden md:block overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                    <th style={{ padding: '0.6rem' }}>Tag ID</th>
                    <th style={{ padding: '0.6rem' }}>Name & Lineage</th>
                    <th style={{ padding: '0.6rem' }}>Category</th>
                    <th style={{ padding: '0.6rem' }}>Shed</th>
                    <th style={{ padding: '0.6rem' }}>Gau-Dattak (Sponsor)</th>
                    <th style={{ padding: '0.6rem' }}>Health Status</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cattleList.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{item.tag_number}</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>
                        {item.name}
                        {item.mother_tag && <span style={{ display: 'block', fontSize: '0.7rem', color: '#78716c' }}>Mother: {item.mother_tag}</span>}
                      </td>
                      <td style={{ padding: '0.6rem' }}>{item.gender}</td>
                      <td style={{ padding: '0.6rem' }}>{item.location_shed}</td>
                      <td style={{ padding: '0.6rem' }}>
                        {item.sponsor_name ? <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>🤝 {item.sponsor_name}</span> : '—'}
                      </td>
                      <td style={{ padding: '0.6rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: item.health_status === 'Healthy' ? '#dcfce7' : '#fee2e2', color: item.health_status === 'Healthy' ? '#15803d' : '#b91c1c' }}>
                          {item.health_status}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                        <button onClick={() => { setEditingAnimalId(item.id); setTagNumber(item.tag_number); setName(item.name); setGender(item.gender); setLocationShed(item.location_shed); setHealthStatus(item.health_status); setSponsorName(item.sponsor_name || ''); setMotherTag(item.mother_tag || ''); setShowAnimalModal(true); }} style={{ marginRight: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #d6d3d1', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDeleteAnimal(item)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- MOBILE CARD VIEW --- */}
            <div className="block md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {cattleList.map(item => (
                <div key={item.id} style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#b45309', fontSize: '0.95rem' }}>{item.tag_number} - {item.name}</span>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: item.health_status === 'Healthy' ? '#dcfce7' : '#fee2e2', color: item.health_status === 'Healthy' ? '#15803d' : '#b91c1c' }}>
                      {item.health_status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#44403c', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                    <div><strong>Category:</strong> {item.gender}</div>
                    <div><strong>Shed:</strong> {item.location_shed}</div>
                    <div style={{ gridColumn: 'span 2' }}><strong>Sponsor:</strong> {item.sponsor_name ? item.sponsor_name : '—'}</div>
                    {item.mother_tag && <div style={{ gridColumn: 'span 2' }}><strong>Mother:</strong> {item.mother_tag}</div>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e7e5e4' }}>
                    <button onClick={() => { setEditingAnimalId(item.id); setTagNumber(item.tag_number); setName(item.name); setGender(item.gender); setLocationShed(item.location_shed); setHealthStatus(item.health_status); setSponsorName(item.sponsor_name || ''); setMotherTag(item.mother_tag || ''); setShowAnimalModal(true); }} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #d6d3d1', background: '#fff', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteAnimal(item)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs remain fully functional */}
        {activeTab === 'medical' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Chikitsa & Ongoing Treatments</h2>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#78716c' }}>Showing only sick or under-treatment animals</p>
                </div>
                <button type="button" onClick={() => setShowMedicalModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + New Treatment Entry
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                    <th style={{ padding: '0.6rem' }}>Animal</th>
                    <th style={{ padding: '0.6rem' }}>Diagnosis</th>
                    <th style={{ padding: '0.6rem' }}>Treatment & Medicines</th>
                    <th style={{ padding: '0.6rem' }}>Doctor</th>
                    <th style={{ padding: '0.6rem' }}>Status</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{m.cattle?.tag_number} ({m.cattle?.name})</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{m.condition}</td>
                      <td style={{ padding: '0.6rem' }}>{m.treatment_details || '—'}</td>
                      <td style={{ padding: '0.6rem' }}>{m.vet_name}</td>
                      <td style={{ padding: '0.6rem' }}>{m.status}</td>
                      <td style={{ padding: '0.6rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {m.status !== 'Recovered' ? (
                          <button onClick={() => handleMarkRecovered(m)} style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #86efac', backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 700, cursor: 'pointer' }}>Mark Cured</button>
                        ) : <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>✓ Healthy</span>}
                        <button onClick={() => handleDeleteMedical(m.id)} style={{ marginLeft: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>💉 Vaccination & Deworming Schedule</h2>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#78716c' }}>Applicable for all animals anytime</p>
                </div>
                <button type="button" onClick={() => setShowVaccineModal(true)} style={{ backgroundColor: '#15803d', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + Schedule Vaccine
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                    <th style={{ padding: '0.6rem' }}>Animal Tag</th>
                    <th style={{ padding: '0.6rem' }}>Vaccine / Dose Type</th>
                    <th style={{ padding: '0.6rem' }}>Due Date</th>
                    <th style={{ padding: '0.6rem' }}>Status</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinationsList.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{v.cattle_tag}</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{v.vaccine_type}</td>
                      <td style={{ padding: '0.6rem' }}>{v.due_date}</td>
                      <td style={{ padding: '0.6rem' }}>{v.status}</td>
                      <td style={{ padding: '0.6rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {v.status === 'Pending' ? (
                          <button onClick={() => handleCompleteVaccine(v)} style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #86efac', backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        ) : <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>✓ Done</span>}
                        <button onClick={() => handleDeleteVaccine(v.id)} style={{ marginLeft: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'gavyam' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>🥛 Daily Doodh Sankalan & Panchgavya Log</h2>
              </div>
              <button type="button" onClick={() => setShowGavyamModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                + Log Milk Yield
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Date</th>
                  <th style={{ padding: '0.6rem' }}>Morning</th>
                  <th style={{ padding: '0.6rem' }}>Evening</th>
                  <th style={{ padding: '0.6rem' }}>Calves</th>
                  <th style={{ padding: '0.6rem' }}>Total</th>
                  <th style={{ padding: '0.6rem' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {gavyamList.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{g.log_date}</td>
                    <td style={{ padding: '0.6rem' }}>{g.morning_milk} L</td>
                    <td style={{ padding: '0.6rem' }}>{g.evening_milk} L</td>
                    <td style={{ padding: '0.6rem', color: '#b45309' }}>{g.calf_consumption} L</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#15803d' }}>{Number(g.morning_milk) + Number(g.evening_milk)} L</td>
                    <td style={{ padding: '0.6rem', color: '#57534e' }}>{g.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Chara & Shelter Supplies</h2>
              </div>
              <button type="button" onClick={() => setShowItemModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                + Add Item
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Item</th>
                  <th style={{ padding: '0.6rem' }}>Category</th>
                  <th style={{ padding: '0.6rem' }}>Stock</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{item.item_name}</td>
                    <td style={{ padding: '0.6rem' }}>{item.category}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#15803d' }}>{item.quantity} {item.unit}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => { setSelectedItem(item); setLogType('IN'); setShowStockLogModal(true); }} style={{ marginRight: '0.3rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '4px', cursor: 'pointer' }}>+ IN</button>
                      <button onClick={() => { setSelectedItem(item); setLogType('OUT'); setShowStockLogModal(true); }} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '4px', cursor: 'pointer' }}>- OUT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'donations' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Gau Daan & Donations (80G)</h2>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#78716c' }}>Total: ₹{totalDonations.toLocaleString('en-IN')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={handleExportDonationsCSV} style={{ backgroundColor: '#1e3a8a', color: '#ffffff', fontWeight: 600, fontSize: '0.8rem', padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  📥 Export CSV
                </button>
                <button type="button" onClick={() => { setDonorName(''); setDonationAmount(''); setDonorPan(''); setDonationTxnRef(''); setPaymentMode('Cash'); setShowDonationModal(true); }} style={{ backgroundColor: '#15803d', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + Record Donation
                </button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Receipt #</th>
                  <th style={{ padding: '0.6rem' }}>Donor</th>
                  <th style={{ padding: '0.6rem' }}>Amount</th>
                  <th style={{ padding: '0.6rem' }}>Mode & Ref</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {donationsList.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{d.receipt_number}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>{d.donor_name}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem' }}>{d.payment_mode} {d.transaction_ref ? `(${d.transaction_ref})` : ''}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                      <button onClick={() => setReceiptToPrint(d)} style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Print 80G</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Trust Monthly Expenses</h2>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', color: netTrustBalance >= 0 ? '#15803d' : '#b91c1c', fontWeight: 700 }}>Net Balance: ₹{netTrustBalance.toLocaleString('en-IN')}</p>
              </div>
              <button type="button" onClick={() => { setExpenseTitle(''); setExpenseAmount(''); setExpensePaymentMode('Cash'); setExpenseTxnRef(''); setShowExpenseModal(true); }} style={{ backgroundColor: '#c2410c', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                + Record Expense
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Bill #</th>
                  <th style={{ padding: '0.6rem' }}>Title</th>
                  <th style={{ padding: '0.6rem' }}>Category</th>
                  <th style={{ padding: '0.6rem' }}>Amount</th>
                  <th style={{ padding: '0.6rem' }}>Mode</th>
                </tr>
              </thead>
              <tbody>
                {expensesList.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{exp.bill_number || 'N/A'}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>{exp.title}</td>
                    <td style={{ padding: '0.6rem' }}>{exp.category}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b91c1c' }}>₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem' }}>{exp.payment_mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'staff' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>👷 Sevadar & Salary Register</h2>
              </div>
              <button type="button" onClick={() => { setEditingStaffId(null); setStaffName(''); setStaffRole('Gwala / Caretaker'); setStaffSalary(''); setStaffAdvance('0'); setStaffAdvanceNotes(''); setShowStaffModal(true); }} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                + Enroll Sevadar
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Name & Role</th>
                  <th style={{ padding: '0.6rem' }}>Salary</th>
                  <th style={{ padding: '0.6rem' }}>Advance / Upad</th>
                  <th style={{ padding: '0.6rem' }}>Payable</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{s.full_name} <span style={{ display: 'block', fontSize: '0.75rem', color: '#78716c', fontWeight: 400 }}>{s.role}</span></td>
                    <td style={{ padding: '0.6rem' }}>₹{Number(s.monthly_salary).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem', color: '#c2410c' }}>₹{Number(s.advance_taken || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem', color: '#15803d', fontWeight: 700 }}>₹{(Number(s.monthly_salary) - Number(s.advance_taken || 0)).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => { setEditingStaffId(s.id); setStaffName(s.full_name); setStaffRole(s.role); setStaffSalary(s.monthly_salary); setStaffAdvance(s.advance_taken || '0'); setStaffAdvanceNotes(s.advance_notes || ''); setShowStaffModal(true); }} style={{ marginRight: '0.3rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #d6d3d1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeleteStaff(s.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #fecaca', borderRadius: '4px', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'docs' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>📁 Trust Compliance Document Locker</h2>
              </div>
              <button type="button" onClick={() => { setDocTitle(''); setDocExpiry(''); setDocUrl(''); setShowDocModal(true); }} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                + Add Document
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Title</th>
                  <th style={{ padding: '0.6rem' }}>Category</th>
                  <th style={{ padding: '0.6rem' }}>Expiry</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Link</th>
                </tr>
              </thead>
              <tbody>
                {docsList.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{doc.doc_title}</td>
                    <td style={{ padding: '0.6rem' }}>{doc.category}</td>
                    <td style={{ padding: '0.6rem' }}>{doc.expiry_date || 'Lifetime'}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                      {doc.file_url ? <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: 700 }}>Open ↗</a> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e7e5e4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>📊 Gaushala & Trust Complete Reports & Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#fafaf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                <p style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600, margin: 0 }}>Total Cattle</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b45309', margin: '0.25rem 0 0' }}>{cattleList.length}</h3>
                <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0.3rem 0 0', fontWeight: 600 }}>Healthy: {healthyCount} | Sick: {sickAnimals.length}</p>
              </div>
              <div style={{ backgroundColor: '#fafaf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                <p style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600, margin: 0 }}>Total Donations (80G)</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#15803d', margin: '0.25rem 0 0' }}>₹{totalDonations.toLocaleString('en-IN')}</h3>
                <p style={{ fontSize: '0.75rem', color: '#78716c', margin: '0.3rem 0 0' }}>Receipts: {donationsList.length}</p>
              </div>
              <div style={{ backgroundColor: '#fafaf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                <p style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600, margin: 0 }}>Total Expenses</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#c2410c', margin: '0.25rem 0 0' }}>₹{totalExpenses.toLocaleString('en-IN')}</h3>
                <p style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, margin: '0.3rem 0 0' }}>Net Balance: ₹{netTrustBalance.toLocaleString('en-IN')}</p>
              </div>
              <div style={{ backgroundColor: '#fafaf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                <p style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600, margin: 0 }}>Active Sevadars & Vaccines</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', margin: '0.25rem 0 0' }}>{staffList.length} Staff</h3>
                <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, margin: '0.3rem 0 0' }}>Vaccines Due: {pendingVaccines}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#1e3a8a' }}>👥 Trustee & User Management</h2>
              <button type="button" onClick={() => setShowUserModal(true)} style={{ backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                + Add Trustee
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>User ID</th>
                  <th style={{ padding: '0.6rem' }}>Name</th>
                  <th style={{ padding: '0.6rem' }}>Role</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{u.trustee_id}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>{u.full_name}</td>
                    <td style={{ padding: '0.6rem' }}>{u.role}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => handleOpenEditUser(u)} style={{ marginRight: '0.3rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #d6d3d1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => { setSelectedUserToEdit(u); setResetPwInput(''); setShowResetPwModal(true); }} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #fed7aa', borderRadius: '4px', background: '#fff7ed', color: '#c2410c', cursor: 'pointer' }}>Reset PW</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAnimalModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{editingAnimalId ? 'Edit Animal & Sponsorship' : 'Enroll Animal'}</h3>
            <form onSubmit={handleSaveAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={tagNumber} onChange={e => setTagNumber(e.target.value)} placeholder="Tag ID *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={gender} onChange={e => setGender(e.target.value)} placeholder="Category *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={locationShed} onChange={e => setLocationShed(e.target.value)} placeholder="Shed *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input value={sponsorName} onChange={e => setSponsorName(e.target.value)} placeholder="Gau-Dattak Sponsor Name (Optional)" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <select value={healthStatus} onChange={e => setHealthStatus(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }}>
                <option value="Healthy">Healthy</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical">Critical</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAnimalModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMedicalModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Log Treatment</h3>
            <form onSubmit={handleSaveMedical} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <select required value={medCattleId} onChange={e => setMedCattleId(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }}>
                <option value="">-- Select Sick Animal --</option>
                {sickCattleList.map(c => <option key={c.id} value={c.id}>{c.tag_number} - {c.name} ({c.health_status})</option>)}
              </select>
              <input required value={condition} onChange={e => setCondition(e.target.value)} placeholder="Diagnosis *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input value={treatmentDetails} onChange={e => setTreatmentDetails(e.target.value)} placeholder="Medicines" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowMedicalModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVaccineModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>💉 Schedule Vaccine</h3>
            <form onSubmit={handleSaveVaccine} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={vacCattleTag} onChange={e => setVacCattleTag(e.target.value)} placeholder="Animal Tag ID (or ALL) *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <select value={vaccineType} onChange={e => setVaccineType(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }}>
                <option value="FMD (Foot & Mouth)">FMD (Foot & Mouth)</option>
                <option value="Deworming (3-Month Dose)">Deworming (3-Month Dose)</option>
                <option value="Anti-Rabies">Anti-Rabies</option>
                <option value="Tetanus">Tetanus</option>
                <option value="HS / BQ Vaccine">HS / BQ Vaccine</option>
                <option value="Other (Manual)">Other (Manual Type)</option>
              </select>
              {vaccineType === 'Other (Manual)' && (
                <input required value={customVaccine} onChange={e => setCustomVaccine(e.target.value)} placeholder="Type Custom Vaccine Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              )}
              <input type="date" required value={vacDueDate} onChange={e => setVacDueDate(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowVaccineModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#15803d', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGavyamModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>🥛 Log Milk Yield</h3>
            <form onSubmit={handleSaveGavyam} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="number" step="any" required value={morningMilk} onChange={e => setMorningMilk(e.target.value)} placeholder="Morning Milk (L) *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="number" step="any" required value={eveningMilk} onChange={e => setEveningMilk(e.target.value)} placeholder="Evening Milk (L) *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="number" step="any" value={calfMilk} onChange={e => setCalfMilk(e.target.value)} placeholder="Fed to Calves (L)" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowGavyamModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Add Supply Item</h3>
            <form onSubmit={handleSaveNewItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input required value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Item Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <select value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }}>
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="Bori / Bag">Bori / Bag</option>
                <option value="Packet">Packet</option>
                <option value="Litre">Litre</option>
                <option value="Pcs">Pcs</option>
              </select>
              <input type="number" step="any" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} placeholder="Quantity" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowItemModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStockLogModal && selectedItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{logType === 'IN' ? 'Stock Entry' : 'Feed Out'}</h3>
            <form onSubmit={handleSaveStockLog} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input type="number" step="any" required value={logQty} onChange={e => setLogQty(e.target.value)} placeholder="Quantity *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowStockLogModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#15803d', color: '#fff', fontWeight: 600 }}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDonationModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#15803d' }}>🙏 Record Donation</h3>
            <form onSubmit={handleSaveDonation} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Donor Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input value={donorPan} onChange={e => setDonorPan(e.target.value)} placeholder="PAN Number (For 80G)" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1', textTransform: 'uppercase' }} />
              <input type="number" required value={donationAmount} onChange={e => setDonationAmount(e.target.value)} placeholder="Amount (₹) *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cheque">Cheque</option>
              </select>
              {paymentMode !== 'Cash' && (
                <input required value={donationTxnRef} onChange={e => setDonationTxnRef(e.target.value)} placeholder="Transaction / Reference Number *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowDonationModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#15803d', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Record Expense</h3>
            <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={expenseTitle} onChange={e => setExpenseTitle(e.target.value)} placeholder="Expense Title *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="number" required value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="Amount (₹) *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <select value={expensePaymentMode} onChange={e => setExpensePaymentMode(e.target.value)} style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cheque">Cheque</option>
              </select>
              {expensePaymentMode !== 'Cash' && (
                <input required value={expenseTxnRef} onChange={e => setExpenseTxnRef(e.target.value)} placeholder="Transaction Reference Number *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowExpenseModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#c2410c', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStaffModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{editingStaffId ? 'Edit Sevadar' : 'Enroll Sevadar'}</h3>
            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input value={staffRole} onChange={e => setStaffRole(e.target.value)} placeholder="Role (Gwala / Caretaker)" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="number" required value={staffSalary} onChange={e => setStaffSalary(e.target.value)} placeholder="Monthly Salary (₹) *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="number" value={staffAdvance} onChange={e => setStaffAdvance(e.target.value)} placeholder="Total Advance / Upad (₹)" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <textarea value={staffAdvanceNotes} onChange={e => setStaffAdvanceNotes(e.target.value)} placeholder="Upad History Notes" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1', minHeight: '60px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowStaffModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDocModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Add Document</h3>
            <form onSubmit={handleSaveDoc} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Document Title *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="date" value={docExpiry} onChange={e => setDocExpiry(e.target.value)} placeholder="Expiry Date" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input value={docUrl} onChange={e => setDocUrl(e.target.value)} placeholder="Google Drive Link" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowDocModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Add Trustee</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input required value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Full Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={newUserId} onChange={e => setNewUserId(e.target.value)} placeholder="User ID *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input type="password" required value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Password *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowUserModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#1e3a8a', color: '#fff', fontWeight: 700 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditUserModal && selectedUserToEdit && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Edit Trustee</h3>
            <form onSubmit={handleSaveEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input required value={editUserName} onChange={e => setEditUserName(e.target.value)} placeholder="Full Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowEditUserModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#1e3a8a', color: '#fff', fontWeight: 700 }}>Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetPwModal && selectedUserToEdit && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Reset Password</h3>
            <form onSubmit={handleSaveResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input type="password" required value={resetPwInput} onChange={e => setResetPwInput(e.target.value)} placeholder="New Password *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowResetPwModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#c2410c', color: '#fff', fontWeight: 700 }}>Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {receiptToPrint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 200 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', maxWidth: '600px', width: '100%', padding: '2rem', border: '2px solid #b45309' }}>
            <h2 style={{ textAlign: 'center', color: '#b45309' }}>MAIYA JASHODA GAUV SEVA TRUST</h2>
            <p><strong>Receipt No:</strong> {receiptToPrint.receipt_number}</p>
            <p><strong>Donor Name:</strong> {receiptToPrint.donor_name}</p>
            <p><strong>Amount:</strong> ₹{Number(receiptToPrint.amount).toLocaleString('en-IN')}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => setReceiptToPrint(null)} style={{ padding: '0.5rem 1rem' }}>Close</button>
              <button onClick={() => window.print()} style={{ padding: '0.5rem 1.2rem', backgroundColor: '#15803d', color: '#fff' }}>Print</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}