import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { FormField } from '../common/FormField.jsx';
import { Button } from '../common/Button.jsx';
import { Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function EnquiryModal() {
  const { isEnquiryModalOpen, closeEnquiryModal, enquiryModalPrefill, addToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    destination: '',
    packageId: '',
    travelers: '2 Adults',
    travelDate: '',
    notes: '',
    source: 'Plan My Journey Modal'
  });

  const [destinationsList, setDestinationsList] = useState([]);
  const [packagesList, setPackagesList] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        const dests = await api.getDestinations();
        const pkgs = await api.getPackages();
        setDestinationsList(dests);
        setPackagesList(pkgs);
      } catch (err) {
        console.error("Failed to load modal options:", err);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    if (enquiryModalPrefill) {
      setFormData(prev => ({
        ...prev,
        destination: enquiryModalPrefill.destination || prev.destination,
        packageId: enquiryModalPrefill.packageId || prev.packageId,
        notes: enquiryModalPrefill.notes || prev.notes,
        source: enquiryModalPrefill.source || prev.source
      }));
    }
  }, [enquiryModalPrefill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await api.submitEnquiry(formData);
      setSubmittedSuccess(true);
      addToast('Your travel enquiry has been submitted! Our concierge will contact you within 24 hours.', 'success');
      setTimeout(() => {
        setSubmittedSuccess(false);
        closeEnquiryModal();
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          destination: '',
          packageId: '',
          travelers: '2 Adults',
          travelDate: '',
          notes: '',
          source: 'Plan My Journey Modal'
        });
      }, 2500);
    } catch (err) {
      addToast('Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isEnquiryModalOpen}
      onClose={closeEnquiryModal}
      title="Plan Your Luxury Journey"
      maxWidth="680px"
    >
      {submittedSuccess ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <CheckCircle2 size={64} color="var(--olive)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>
            Enquiry Received
          </h3>
          <p style={{ color: '#666', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Thank you, {formData.fullName}! Our regional travel specialist will curate a custom itinerary for you and reach out shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
            Fill out the details below and our personal concierge team will design a tailor-made itinerary crafted precisely to your desires.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              required
              error={errors.fullName}
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="eleanor@example.com"
              required
              error={errors.email}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
              error={errors.phone}
            />
            <FormField
              label="Preferred Destination"
              name="destination"
              type="select"
              value={formData.destination}
              onChange={handleChange}
              options={[
                { label: '-- Select Destination --', value: '' },
                ...destinationsList.map(d => ({ label: `${d.name} (${d.country})`, value: d.name }))
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Travelers"
              name="travelers"
              type="select"
              value={formData.travelers}
              onChange={handleChange}
              options={['1 Adult', '2 Adults', '2 Adults + 1 Child', 'Family (4+)', 'Group (6+)']}
            />
            <FormField
              label="Target Travel Date"
              name="travelDate"
              type="date"
              value={formData.travelDate}
              onChange={handleChange}
            />
          </div>

          <FormField
            label="Curated Package (Optional)"
            name="packageId"
            type="select"
            value={formData.packageId}
            onChange={handleChange}
            options={[
              { label: '-- Select Optional Package --', value: '' },
              ...packagesList.map(p => ({ label: `${p.title} ($${p.price})`, value: p.id }))
            ]}
          />

          <FormField
            label="Special Requests & Preferences"
            name="notes"
            type="textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tell us about your flight preferences, hotel room type, dietary needs, or occasion (e.g. Honeymoon, Anniversary)..."
            rows={3}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={closeEnquiryModal} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading} icon={Send}>
              Submit Enquiry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
