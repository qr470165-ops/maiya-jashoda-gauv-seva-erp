'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TrusteeDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('cattle');

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

  async function loadTrusteeData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/';
      return;
    }

    const emailPrefix = user.email?.split('@')[0]?.toUpperCase() || 'TRUSTEE';
    const { data: allProfiles } = await supabase.from('profiles').select('*');
    const userProfile = allProfiles?.find((t: any) => t.id === user.id) || allProfiles?.find((t: any) => t.trustee_id === emailPrefix);

    const defaultTrusteeModules = ['cattle', 'medical', 'gavyam', 'inventory', 'donations', 'expenses', 'staff', 'docs', 'reports'];
    const finalModules = Array.isArray(userProfile?.assigned_modules) && userProfile.assigned_modules.length > 0
      ? userProfile.assigned_modules.filter((m: string) => m !== 'users' && m !== 'tasks')
      : defaultTrusteeModules;

    const currentProfile = {
      id: user.id,
      full_name: userProfile?.full_name || user.email?.split('@')[0] || 'Trustee',
      trustee_id: userProfile?.trustee_id || emailPrefix,
      role: 'user',
      assigned_modules: finalModules
    };

    setProfile(currentProfile);
    setActiveTab(prev => (prev && finalModules.includes(prev) ? prev : finalModules[0]));

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
    loadTrusteeData();
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
    await loadTrusteeData();
    setSubmitting(false);
  }

  async function handleDeleteAnimal(item: any) {
    if (!window.confirm(`Kya aap "${item.name}" (${item.tag_number}) ko remove karna chahte hain?`)) return;
    await supabase.from('cattle').delete().eq('id', item.id);
    await loadTrusteeData();
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
    await loadTrusteeData();
    setSubmitting(false);
  }

  async function handleDeleteMedical(id: string) {
    if (!window.confirm('Kya aap is medical entry ko delete karna chahte hain?')) return;
    await supabase.from('medical_records').delete().eq('id', id);
    await loadTrusteeData();
  }

  async function handleMarkRecovered(rec: any) {
    await supabase.from('medical_records').update({ status: 'Recovered' }).eq('id', rec.id);
    await supabase.from('cattle').update({ health_status: 'Healthy' }).eq('id', rec.cattle_id);
    await loadTrusteeData();
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
      await loadTrusteeData();
    }
    setSubmitting(false);
  }

  async function handleDeleteVaccine(id: string) {
    if (!window.confirm('Kya aap is vaccine schedule ko delete karna chahte hain?')) return;
    await supabase.from('vaccinations').delete().eq('id', id);
    await loadTrusteeData();
  }

  async function handleCompleteVaccine(v: any) {
    await supabase.from('vaccinations').update({ status: 'Completed' }).eq('id', v.id);
    await loadTrusteeData();
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
    await loadTrusteeData();
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
    await loadTrusteeData();
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
    await loadTrusteeData();
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
    await loadTrusteeData();
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
      await loadTrusteeData();
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
      await loadTrusteeData();
    }
    setSubmitting(false);
  }

  async function handleDeleteStaff(id: string) {
    if (!window.confirm('Kya aap is sevadar ko delete karna chahte hain?')) return;
    await supabase.from('sevadars').delete().eq('id', id);
    await loadTrusteeData();
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
      await loadTrusteeData();
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f4', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#57534e', fontSize: '1.1rem', fontWeight: 600 }}>Loading Trustee ERP Portal...</p>
      </main>
    );
  }

  const assignedModules: string[] = profile?.assigned_modules || ['cattle', 'medical', 'gavyam', 'inventory', 'donations', 'expenses', 'staff', 'docs', 'reports'];
  const sickAnimals = cattleList.filter(c => c.health_status === 'Under Treatment' || c.health_status === 'Critical');
  const healthyCount = cattleList.filter(c => c.health_status === 'Healthy').length;
  const lowStockCount = inventoryList.filter(i => Number(i.quantity) <= Number(i.min_alert_threshold)).length;
  const totalDonations = donationsList.reduce((s, d) => s + Number(d.amount || 0), 0);
  const totalExpenses = expensesList.reduce((s, e) => s + Number(e.amount || 0), 0);
  const netTrustBalance = totalDonations - totalExpenses;
  const pendingVaccines = vaccinationsList.filter(v => v.status === 'Pending').length;
  const sickCattleList = cattleList.filter(c => c.health_status === 'Under Treatment' || c.health_status === 'Critical');

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
              {profile?.full_name} &bull; ROLE: TRUSTEE &bull; ID: {profile?.trustee_id}
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
          {assignedModules.includes('cattle') && (
            <button onClick={() => setActiveTab('cattle')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'cattle' ? '#b45309' : '#e7e5e4', color: activeTab === 'cattle' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              🐄 Animal & Dattak ({cattleList.length})
            </button>
          )}
          {assignedModules.includes('medical') && (
            <button onClick={() => setActiveTab('medical')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'medical' ? '#b45309' : '#e7e5e4', color: activeTab === 'medical' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              🩺 Medical & Vaccine ({sickAnimals.length + pendingVaccines})
            </button>
          )}
          {assignedModules.includes('gavyam') && (
            <button onClick={() => setActiveTab('gavyam')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'gavyam' ? '#b45309' : '#e7e5e4', color: activeTab === 'gavyam' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              🥛 Doodh & Gavyam ({gavyamList.length})
            </button>
          )}
          {assignedModules.includes('inventory') && (
            <button onClick={() => setActiveTab('inventory')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'inventory' ? '#b45309' : '#e7e5e4', color: activeTab === 'inventory' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              🌾 Chara & Stock {lowStockCount > 0 && `(⚠️ ${lowStockCount})`}
            </button>
          )}
          {assignedModules.includes('donations') && (
            <button onClick={() => setActiveTab('donations')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'donations' ? '#b45309' : '#e7e5e4', color: activeTab === 'donations' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              🙏 Donations 80G (₹{totalDonations.toLocaleString('en-IN')})
            </button>
          )}
          {assignedModules.includes('expenses') && (
            <button onClick={() => setActiveTab('expenses')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'expenses' ? '#b45309' : '#e7e5e4', color: activeTab === 'expenses' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              🧾 Expenses (₹{totalExpenses.toLocaleString('en-IN')})
            </button>
          )}
          {assignedModules.includes('staff') && (
            <button onClick={() => setActiveTab('staff')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'staff' ? '#b45309' : '#e7e5e4', color: activeTab === 'staff' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              👷 Sevadar & Salary ({staffList.length})
            </button>
          )}
          {assignedModules.includes('docs') && (
            <button onClick={() => setActiveTab('docs')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'docs' ? '#b45309' : '#e7e5e4', color: activeTab === 'docs' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              📁 Document Vault ({docsList.length})
            </button>
          )}
          {assignedModules.includes('reports') && (
            <button onClick={() => setActiveTab('reports')} style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: activeTab === 'reports' ? '#b45309' : '#e7e5e4', color: activeTab === 'reports' ? '#fff' : '#44403c', whiteSpace: 'nowrap' }}>
              📊 Reports & Analytics
            </button>
          )}
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

        {/* Other trustee tabs remain fully intact */}
        {activeTab === 'medical' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Chikitsa & Ongoing Treatments</h2>
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
                    <th style={{ padding: '0.6rem' }}>Treatment</th>
                    <th style={{ padding: '0.6rem' }}>Status</th>
                    <th style={{ padding: '0.6rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{m.cattle?.tag_number}</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{m.condition}</td>
                      <td style={{ padding: '0.6rem' }}>{m.treatment_details || '—'}</td>
                      <td style={{ padding: '0.6rem' }}>{m.status}</td>
                      <td style={{ padding: '0.6rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {m.status !== 'Recovered' ? (
                          <button onClick={() => handleMarkRecovered(m)} style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #86efac', backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 700, cursor: 'pointer' }}>Cured</button>
                        ) : <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>✓</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>💉 Vaccination Schedule</h2>
                </div>
                <button type="button" onClick={() => setShowVaccineModal(true)} style={{ backgroundColor: '#15803d', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + Schedule
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                    <th style={{ padding: '0.6rem' }}>Tag</th>
                    <th style={{ padding: '0.6rem' }}>Vaccine</th>
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
                      <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                        {v.status === 'Pending' ? (
                          <button onClick={() => handleCompleteVaccine(v)} style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #86efac', backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        ) : <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>✓</span>}
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
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>🥛 Milk Log</h2>
              <button type="button" onClick={() => setShowGavyamModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Log</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Date</th>
                  <th style={{ padding: '0.6rem' }}>Morning</th>
                  <th style={{ padding: '0.6rem' }}>Evening</th>
                  <th style={{ padding: '0.6rem' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {gavyamList.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{g.log_date}</td>
                    <td style={{ padding: '0.6rem' }}>{g.morning_milk} L</td>
                    <td style={{ padding: '0.6rem' }}>{g.evening_milk} L</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#15803d' }}>{Number(g.morning_milk) + Number(g.evening_milk)} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Inventory</h2>
              <button type="button" onClick={() => setShowItemModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add Item</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Item</th>
                  <th style={{ padding: '0.6rem' }}>Stock</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{item.item_name}</td>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Donations (80G)</h2>
              <button type="button" onClick={() => { setDonorName(''); setDonationAmount(''); setDonorPan(''); setDonationTxnRef(''); setPaymentMode('Cash'); setShowDonationModal(true); }} style={{ backgroundColor: '#15803d', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Record</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Receipt</th>
                  <th style={{ padding: '0.6rem' }}>Donor</th>
                  <th style={{ padding: '0.6rem' }}>Amount</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {donationsList.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b45309' }}>{d.receipt_number}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>{d.donor_name}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                      <button onClick={() => setReceiptToPrint(d)} style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Print</button>
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
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Expenses</h2>
              <button type="button" onClick={() => setShowExpenseModal(true)} style={{ backgroundColor: '#c2410c', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Record</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Title</th>
                  <th style={{ padding: '0.6rem' }}>Category</th>
                  <th style={{ padding: '0.6rem' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expensesList.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>{exp.title}</td>
                    <td style={{ padding: '0.6rem' }}>{exp.category}</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: '#b91c1c' }}>₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'staff' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Staff</h2>
              <button type="button" onClick={() => setShowStaffModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Enroll</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Name</th>
                  <th style={{ padding: '0.6rem' }}>Salary</th>
                  <th style={{ padding: '0.6rem' }}>Advance</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{s.full_name}</td>
                    <td style={{ padding: '0.6rem' }}>₹{Number(s.monthly_salary).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem', color: '#c2410c' }}>₹{Number(s.advance_taken || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'docs' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e7e5e4', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Documents</h2>
              <button type="button" onClick={() => setShowDocModal(true)} style={{ backgroundColor: '#b45309', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>+ Add</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e7e5e4', color: '#78716c' }}>
                  <th style={{ padding: '0.6rem' }}>Title</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Link</th>
                </tr>
              </thead>
              <tbody>
                {docsList.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f5f5f4' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700 }}>{doc.doc_title}</td>
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
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>📊 Reports & Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#fafaf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                <p style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600, margin: 0 }}>Total Cattle</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b45309', margin: '0.25rem 0 0' }}>{cattleList.length}</h3>
              </div>
              <div style={{ backgroundColor: '#fafaf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e7e5e4' }}>
                <p style={{ fontSize: '0.8rem', color: '#78716c', fontWeight: 600, margin: 0 }}>Total Donations</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#15803d', margin: '0.25rem 0 0' }}>₹{totalDonations.toLocaleString('en-IN')}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAnimalModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Enroll Animal</h3>
            <form onSubmit={handleSaveAnimal} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required value={tagNumber} onChange={e => setTagNumber(e.target.value)} placeholder="Tag ID *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Name *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={gender} onChange={e => setGender(e.target.value)} placeholder="Category *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input required value={locationShed} onChange={e => setLocationShed(e.target.value)} placeholder="Shed *" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <input value={sponsorName} onChange={e => setSponsorName(e.target.value)} placeholder="Sponsor Name" style={{ padding: '0.55rem', borderRadius: '6px', border: '1px solid #d6d3d1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAnimalModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d6d3d1', backgroundColor: '#fff' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: '#b45309', color: '#fff', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Other modals omitted for brevity or kept standard */}
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