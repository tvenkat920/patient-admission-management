import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import PatientModal from './components/PatientModal';
import PatientDetailsModal from './components/PatientDetailsModal';
import ConfirmDialog from './components/ConfirmDialog';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import { patientService } from './services/patientService';

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' or 'patients'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // System options state
  const [options, setOptions] = useState({
    genders: ['Male', 'Female', 'Other'],
    wards: ['General Ward', 'ICU', 'Emergency', 'Private Ward', 'Pediatric Ward'],
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Emergency Medicine'],
    doctors: [],
    doctors_by_department: {},
  });

  // Data state
  const [dashboardStats, setDashboardStats] = useState(null);
  const [patientsData, setPatientsData] = useState({ items: [], total: 0, page: 1, limit: 10, pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    ward: 'All',
    department: 'All',
    doctor: 'All',
    status: 'All',
    page: 1,
    limit: 10,
  });

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientModalMode, setPatientModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Confirmation dialogs state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: 'delete', // 'delete' or 'discharge'
    patient: null,
  });

  // Toasts state
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch system options once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await patientService.getOptions();
        setOptions(data);
      } catch (err) {
        console.error('Failed to load system options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch Dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      const stats = await patientService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  }, []);

  // Fetch Patients list with filters & pagination
  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.search && filters.search.trim()) params.search = filters.search.trim();
      if (filters.ward && filters.ward !== 'All') params.ward = filters.ward;
      if (filters.department && filters.department !== 'All') params.department = filters.department;
      if (filters.doctor && filters.doctor !== 'All') params.doctor = filters.doctor;
      if (filters.status && filters.status !== 'All') params.status = filters.status;

      const data = await patientService.getPatients(params);
      setPatientsData(data);
    } catch (err) {
      addToast('error', 'Network Error', err.userMessage || 'Failed to retrieve patient records.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Initial and reactive data fetching
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Handlers for Add/Edit
  const handleOpenAdd = () => {
    setPatientModalMode('add');
    setSelectedPatient(null);
    setIsPatientModalOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setPatientModalMode('edit');
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = async (payload) => {
    setIsActionLoading(true);
    try {
      if (patientModalMode === 'add') {
        const created = await patientService.createPatient(payload);
        addToast('success', 'Patient Registered', `Patient ${created.name} (${created.patient_id}) admitted successfully.`);
      } else {
        const updated = await patientService.updatePatient(selectedPatient.patient_id, payload);
        addToast('success', 'Patient Updated', `Record for ${updated.name} (${updated.patient_id}) updated successfully.`);
      }
      setIsPatientModalOpen(false);
      // Refresh both patients list and dashboard stats
      fetchPatients();
      fetchDashboardStats();
    } catch (err) {
      throw err; // let modal handle server validation error message
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handlers for View Details
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  };

  // Handlers for Discharge
  const handleInitiateDischarge = (patient) => {
    if (patient.status === 'Discharged') {
      addToast('warning', 'Already Discharged', `Patient ${patient.name} is already discharged.`);
      return;
    }
    setConfirmDialog({
      isOpen: true,
      title: 'Discharge Patient Confirmation',
      message: `Are you sure you want to mark patient ${patient.name} as discharged? This will update their active bed occupancy.`,
      actionType: 'discharge',
      patient,
    });
  };

  const handleConfirmDischarge = async () => {
    if (!confirmDialog.patient) return;
    setIsActionLoading(true);
    try {
      const updated = await patientService.dischargePatient(confirmDialog.patient.patient_id);
      addToast('success', 'Patient Discharged', `Patient ${updated.name} (${updated.patient_id}) has been marked as Discharged.`);
      setConfirmDialog({ isOpen: false, patient: null, title: '', message: '', actionType: 'discharge' });
      fetchPatients();
      fetchDashboardStats();
    } catch (err) {
      addToast('error', 'Discharge Failed', err.userMessage || 'Failed to discharge patient.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handlers for Delete
  const handleInitiateDelete = (patient) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Patient Record',
      message: `Are you sure you want to delete the record for ${patient.name}? This action is permanent and cannot be undone.`,
      actionType: 'delete',
      patient,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.patient) return;
    setIsActionLoading(true);
    try {
      await patientService.deletePatient(confirmDialog.patient.patient_id);
      addToast('success', 'Patient Deleted', `Record for ${confirmDialog.patient.name} (${confirmDialog.patient.patient_id}) was permanently deleted.`);
      setConfirmDialog({ isOpen: false, patient: null, title: '', message: '', actionType: 'delete' });
      fetchPatients();
      fetchDashboardStats();
    } catch (err) {
      addToast('error', 'Delete Failed', err.userMessage || 'Failed to delete patient record.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Navigation shortcut from Dashboard to Patients table
  const handleViewAllPatients = (statusFilter = 'All') => {
    setCurrentTab('patients');
    setFilters((prev) => ({ ...prev, status: statusFilter, page: 1 }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      ward: 'All',
      department: 'All',
      doctor: 'All',
      status: 'All',
      page: 1,
      limit: 10,
    });
  };

  const pageTitle = currentTab === 'dashboard' ? 'Hospital Dashboard' : 'Patient Management';

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">
      {/* Toast alerts */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        patientFilterStatus={filters.status}
        setPatientFilterStatus={(status) => {
          setFilters((prev) => ({ ...prev, status, page: 1 }));
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-300">
        {/* Top Navbar */}
        <Navbar
          pageTitle={pageTitle}
          breadcrumb={currentTab === 'dashboard' ? 'Overview' : 'Records'}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAddModal={handleOpenAdd}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' ? (
            <DashboardPage
              stats={dashboardStats}
              isLoading={isLoading}
              onOpenAddModal={handleOpenAdd}
              onViewAllPatients={handleViewAllPatients}
              onViewPatient={handleViewPatient}
              onEditPatient={handleOpenEdit}
              onDischargePatient={handleInitiateDischarge}
              onDeletePatient={handleInitiateDelete}
            />
          ) : (
            <PatientsPage
              patientsData={patientsData}
              isLoading={isLoading}
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
              options={options}
              onOpenAddModal={handleOpenAdd}
              onViewPatient={handleViewPatient}
              onEditPatient={handleOpenEdit}
              onDischargePatient={handleInitiateDischarge}
              onDeletePatient={handleInitiateDelete}
              onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Patient Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        mode={patientModalMode}
        patient={selectedPatient}
        options={options}
        isLoading={isActionLoading}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={handleSavePatient}
      />

      {/* View Patient Details Modal */}
      <PatientDetailsModal
        isOpen={isDetailsModalOpen}
        patient={selectedPatient}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={(p) => handleOpenEdit(p)}
        onDischarge={(p) => handleInitiateDischarge(p)}
      />

      {/* Confirmation Dialog for Delete / Discharge */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        actionType={confirmDialog.actionType}
        patient={confirmDialog.patient}
        isLoading={isActionLoading}
        onConfirm={confirmDialog.actionType === 'delete' ? handleConfirmDelete : handleConfirmDischarge}
        onCancel={() => setConfirmDialog({ isOpen: false, patient: null, title: '', message: '', actionType: 'delete' })}
      />
    </div>
  );
}
