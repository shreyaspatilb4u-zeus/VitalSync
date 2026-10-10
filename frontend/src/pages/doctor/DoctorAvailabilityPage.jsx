import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import doctorService from '../../services/doctorService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatTime } from '../../lib/utils';
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react';

export default function DoctorAvailabilityPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add slot form
  const [slotDate, setSlotDate] = useState('2026-10-15');
  const [slotTime, setSlotTime] = useState('09:00');
  const [addingSlot, setAddingSlot] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const fetchSlots = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getDoctorAvailability(user.id);
      setSlots(data);
    } catch (err) {
      setError(err.message || 'Failed to load availability slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [user]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotDate || !slotTime) {
      toast.warning('Please specify both date and time.');
      return;
    }

    setAddingSlot(true);
    try {
      const isoString = `${slotDate}T${slotTime}:00.000Z`;
      await doctorService.addAvailabilitySlot(user.id, isoString);
      toast.success(`Slot added for ${formatDate(isoString)} at ${slotTime}`);
      await fetchSlots();
    } catch (err) {
      toast.error(err.message || 'Failed to add slot');
    } finally {
      setAddingSlot(false);
    }
  };

  const handleRemoveSlot = async (slotId) => {
    setRemovingId(slotId);
    try {
      await doctorService.removeAvailabilitySlot(slotId);
      toast.success('Availability slot removed.');
      await fetchSlots();
    } catch (err) {
      toast.error(err.message || 'Cannot remove booked slot.');
    } finally {
      setRemovingId(null);
    }
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const d = slot.slot_start.split('T')[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(slotsByDate).sort();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Manage Weekly Availability
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Open consultation slots for patient self-scheduling. Booked slots are locked.
        </p>
      </div>

      {/* Add New Slot Form */}
      <Card className="border-teal-100 bg-teal-50/20">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4 text-teal-600" />
          <span>Add Availability Time Slot</span>
        </h2>

        <form onSubmit={handleAddSlot} className="flex flex-col sm:flex-row items-end gap-3">
          {/* Date Picker */}
          <div className="flex-1 w-full">
            <label htmlFor="slotDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Select Date
            </label>
            <input
              id="slotDate"
              type="date"
              min="2026-10-09"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Time Picker */}
          <div className="flex-1 w-full">
            <label htmlFor="slotTime" className="block text-xs font-semibold text-slate-700 mb-1">
              Start Time
            </label>
            <select
              id="slotTime"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="08:30">08:30 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="09:30">09:30 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="13:00">01:00 PM</option>
              <option value="13:30">01:30 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="14:30">02:30 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="15:30">03:30 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Plus}
            className="w-full sm:w-auto"
            loading={addingSlot}
          >
            Add Slot
          </Button>
        </form>
      </Card>

      {/* Slots List by Date */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSlots} />
      ) : sortedDates.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No availability slots published"
          description="Use the form above to add your available consultation windows."
        />
      ) : (
        <div className="space-y-5">
          {sortedDates.map((dateStr) => {
            const dateSlots = slotsByDate[dateStr];
            return (
              <Card key={dateStr} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-800">
                      {formatDate(`${dateStr}T00:00:00.000Z`)}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {dateSlots.length} {dateSlots.length === 1 ? 'Slot' : 'Slots'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {dateSlots.map((slot) => {
                    return (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                          slot.is_booked
                            ? 'bg-slate-50 border-slate-200 text-slate-500'
                            : 'bg-white border-teal-200 text-slate-800 hover:border-teal-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock
                            className={`w-4 h-4 ${
                              slot.is_booked ? 'text-slate-400' : 'text-teal-600'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-bold">{formatTime(slot.slot_start)}</p>
                            <span className="text-[10px] text-slate-400">
                              {slot.is_booked ? 'Booked by Patient' : 'Open for Booking'}
                            </span>
                          </div>
                        </div>

                        <div>
                          {slot.is_booked ? (
                            <span
                              title="Booked slots cannot be removed"
                              className="p-1 text-slate-400 cursor-not-allowed inline-block"
                            >
                              <Lock className="w-4 h-4" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(slot.id)}
                              disabled={removingId === slot.id}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Remove availability slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
