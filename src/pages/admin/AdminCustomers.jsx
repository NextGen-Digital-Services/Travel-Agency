import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Search, Eye, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Drawer } from '../../components/common/Drawer.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { api } from '../../services/api.js';

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const enqs = await api.getEnquiries();
        const bks = await api.getBookings();

        setEnquiries(enqs);
        setBookings(bks);

        // Aggregate unique customers by email
        const map = new Map();

        enqs.forEach(e => {
          const key = e.email.toLowerCase();
          if (!map.has(key)) {
            map.set(key, {
              id: key,
              name: e.fullName,
              email: e.email,
              phone: e.phone,
              enquiriesCount: 1,
              bookingsCount: 0,
              totalSpent: 0
            });
          } else {
            const cust = map.get(key);
            cust.enquiriesCount += 1;
          }
        });

        bks.forEach(b => {
          const key = b.customerEmail.toLowerCase();
          if (!map.has(key)) {
            map.set(key, {
              id: key,
              name: b.customerName,
              email: b.customerEmail,
              phone: b.customerPhone,
              enquiriesCount: 0,
              bookingsCount: 1,
              totalSpent: b.totalAmount || 0
            });
          } else {
            const cust = map.get(key);
            cust.bookingsCount += 1;
            cust.totalSpent += (b.totalAmount || 0);
          }
        });

        setCustomers(Array.from(map.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const handleOpenDetail = (cust) => {
    setSelectedCustomer(cust);
    setIsDrawerOpen(true);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const customerEnquiries = enquiries.filter(e => selectedCustomer && e.email.toLowerCase() === selectedCustomer.email.toLowerCase());
  const customerBookings = bookings.filter(b => selectedCustomer && b.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase());

  const columns = [
    {
      title: 'Customer Name', key: 'name', render: (row) => (
        <div>
          <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.name}</strong>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>{row.email}</span>
        </div>
      )
    },
    { title: 'Phone', key: 'phone' },
    { title: 'Enquiries', key: 'enquiriesCount', render: (row) => <Badge variant="navy">{row.enquiriesCount}</Badge> },
    { title: 'Bookings', key: 'bookingsCount', render: (row) => <Badge variant="olive">{row.bookingsCount}</Badge> },
    { title: 'Total Spent', key: 'totalSpent', render: (row) => <strong>${row.totalSpent?.toLocaleString()}</strong> },
    {
      title: 'Action', key: 'id', render: (row) => (
        <Button size="sm" variant="secondary" icon={Eye} onClick={() => handleOpenDetail(row)}>
          Details
        </Button>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Customer Directory | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Customer Directory
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Directory of luxury travelers, their active enquiries, and booking history.
          </p>
        </div>
      </div>

      <div className="table-toolbar">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Total: {filtered.length} customers</span>
      </div>

      <Table columns={columns} data={filtered} />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Customer Profile Details">
        {selectedCustomer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--ivory)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--adriatic)', margin: '0 0 0.5rem' }}>{selectedCustomer.name}</h3>
              <div style={{ fontSize: '0.9rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><Mail size={16} inline /> Email: {selectedCustomer.email}</div>
                <div><Phone size={16} inline /> Phone: {selectedCustomer.phone}</div>
                <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--terracotta)' }}>
                  Total Lifetime Spent: ${selectedCustomer.totalSpent?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Customer Bookings */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--adriatic)', marginBottom: '0.75rem' }}>
                Confirmed Bookings ({customerBookings.length})
              </h4>
              {customerBookings.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#777' }}>No confirmed bookings yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {customerBookings.map(b => (
                    <div key={b.id} style={{ padding: '0.85rem', backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--adriatic)' }}>{b.packageTitle}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        Date: {b.travelDate} • Amount: ${b.totalAmount} • <Badge variant="olive">{b.paymentStatus}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Enquiries */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--adriatic)', marginBottom: '0.75rem' }}>
                Submitted Enquiries ({customerEnquiries.length})
              </h4>
              {customerEnquiries.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#777' }}>No enquiries submitted.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {customerEnquiries.map(e => (
                    <div key={e.id} style={{ padding: '0.85rem', backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--adriatic)' }}>Destination: {e.destination || 'General Inquiry'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        Status: <Badge variant="gold">{e.status}</Badge> • Submitted: {new Date(e.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
