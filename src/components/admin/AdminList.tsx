// src/components/admin/AdminList.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { Admin } from '@/lib/types';
import ConfirmDialog from './ConfirmDialog';
import { formatDate } from '@/lib/utils/helpers';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface AdminListProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const AdminList: React.FC<AdminListProps> = ({
  admins,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + itemsPerPage);

  const getRoleBadgeColor = (role: string) => {
    return role === 'super_admin' 
      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-sm text-foreground-secondary">
          Total: {filteredAdmins.length} admins
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block bg-card-bg rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent-light border-b border-border">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Admin</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Club</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Last Login</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {paginatedAdmins.map((admin) => (
                  <motion.tr
                    key={admin._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-accent-light/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{admin.name}</p>
                          <p className="text-sm text-foreground-secondary">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(admin.role)}`}>
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Club Admin'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {admin.club ? (
                        <span className="text-foreground">
                          {typeof admin.club === 'string' ? admin.club : admin.club.name}
                        </span>
                      ) : (
                        <span className="text-foreground-secondary">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => onToggleStatus(admin._id, admin.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(admin.isActive)}`}
                      >
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-sm text-foreground-secondary">
                      {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(admin)}
                          className="p-2 hover:bg-accent-light rounded-lg transition-colors"
                          aria-label="Edit admin"
                        >
                          <Edit className="w-4 h-4 text-foreground-secondary" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(admin._id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          aria-label="Delete admin"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedAdmins.map((admin) => (
          <motion.div
            key={admin._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card-bg rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{admin.name}</h3>
                  <p className="text-sm text-foreground-secondary">{admin.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAdmin(selectedAdmin === admin._id ? null : admin._id)}
                className="p-2 hover:bg-accent-light rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-foreground-secondary" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-foreground-secondary mb-1">Role</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(admin.role)}`}>
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Club Admin'}
                </span>
              </div>
              <div>
                <p className="text-xs text-foreground-secondary mb-1">Status</p>
                <button
                  onClick={() => onToggleStatus(admin._id, admin.isActive)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(admin.isActive)}`}
                >
                  {admin.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-foreground-secondary">
                <Mail className="w-4 h-4 mr-2" />
                {admin.email}
              </div>
              <div className="flex items-center text-foreground-secondary">
                <Calendar className="w-4 h-4 mr-2" />
                Last login: {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
              </div>
            </div>

            {selectedAdmin === admin._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-border flex space-x-2"
              >
                <button
                  onClick={() => onEdit(admin)}
                  className="flex-1 py-2 bg-accent-light hover:bg-accent-medium rounded-lg text-sm font-medium text-foreground transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(admin._id)}
                  className="flex-1 py-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-card-bg rounded-lg border border-border">
          <div className="text-sm text-foreground-secondary">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAdmins.length)} of {filteredAdmins.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium px-3 py-1 bg-accent-light rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => {
          if (showDeleteConfirm) {
            onDelete(showDeleteConfirm);
            setShowDeleteConfirm(null);
          }
        }}
        title="Delete Admin"
        message="Are you sure you want to delete this admin? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default AdminList;