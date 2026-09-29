import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FileText, CalendarCheck, DollarSign, Package, Users, Mail, ArrowRight, Plus, Eye, CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { StatCard } from '../../components/admin/StatCard.jsx';
import { Table } from '../../components/common/Table.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { api, subscribeToDataChange } from '../../services/api.js';

export function Dashboard() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const enqs = await api.getEnquiries();
      const bks = await api.getBookings();
      const pkgs = await api.getPackages();
      const subs = await api.getSubscribers();

      setEnquiries(enqs);
      setBookings(bks);
      setPackages(pkgs);
      setSubscribers(subs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const unsub = subscribeToDataChange(() => {
      loadDashboardData();
    });
    return () => unsub();
  }, []);

  // Compute Stat Metrics
  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const confirmedBookingsCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const activePackagesCount = packages.filter(p => p.active).length;
  const totalSubscribers = subscribers.length;

  // Chart 1: Enquiries Over Time Data
  const lineChartData = [
    { month: 'May', enquiries: 12 },
    { month: 'Jun', enquiries: 18 },
    { month: 'Jul', enquiries: 24 },
    { month: 'Aug', enquiries: 30 },
    { month: 'Sep', enquiries: enquiries.length }
  ];

  // Chart 2: Bookings By Destination Data
  const barChartData = [
    { destination: 'Amalfi', bookings: 4 },
    { destination: 'Maldives', bookings: 7 },
    { destination: 'Swiss Alps', bookings: 5 },
    { destination: 'Dubai', bookings: 6 },
    { destination: 'Rajasthan', bookings: 3 }
  ];

  // Chart 3: Donut Chart Enquiry Status
  const statusCounts = {
    New: enquiries.filter(e => e.status === 'New').length,
    Contacted: enquiries.filter(e => e.status === 'Contacted').length,
    FollowUp: enquiries.filter(e => e.status === 'Follow-up').length,
    Confirmed: enquiries.filter(e => e.status === 'Confirmed').length,
    Lost: enquiries.filter(e => e.status === 'Lost').length
  };

  const donutChartData = [
    { name: 'New', value: statusCounts.New || 1, color: '#B5573A' },
    { name: 'Contacted', value: statusCounts.Contacted || 1, color: '#C2993F' },
    { name: 'Follow-up', value: statusCounts.FollowUp || 1, color: '#1a73e8' },
    { name: 'Confirmed', value: statusCounts.Confirmed || 1, color: '#6B7040' },
    { name: 'Lost', value: statusCounts.Lost || 1, color: '#888888' }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'New': return 'terracotta';
      case 'Contacted': return 'warning';
      case 'Follow-up': return 'info';
      case 'Confirmed': return 'olive';
      case 'Lost': return 'danger';
      default: return 'navy';
    }
  };

  const enquiryColumns = [
    { title: 'Client Name', key: 'fullName', render: (row) => <strong>{row.fullName}</strong> },
    { title: 'Destination', key: 'destination' },
    { title: 'Travelers', key: 'travelers' },
    { title: 'Status', key: 'status', render: (row) => <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge> },
    { title: 'Date', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      title: 'Action', key: 'id', render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => navigate('/admin/enquiries')}>
          View
        </Button>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard Overview | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', color: 'var(--adriatic)', margin: 0 }}>
            Executive Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Overview of luxury bookings, enquiries, revenue, and active packages.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/admin/packages')}>
            Add Package
          </Button>
          <Button variant="gold" icon={CalendarCheck} onClick={() => navigate('/admin/bookings')}>
            Create Booking
          </Button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        <StatCard icon={FileText} label="Total Enquiries" value={totalEnquiries} trend="+18% this month" trendType="up" />
        <StatCard icon={FileText} label="New Enquiries" value={newEnquiriesCount} trend="Requires Action" trendType="down" />
        <StatCard icon={CalendarCheck} label="Confirmed Bookings" value={confirmedBookingsCount} trend="+12% growth" trendType="up" />
        <StatCard icon={DollarSign} label="Total Revenue" value={totalRevenue} prefix="$" trend="+24% YoY" trendType="up" />
        <StatCard icon={Package} label="Active Packages" value={activePackagesCount} />
        <StatCard icon={Mail} label="Subscribers" value={totalSubscribers} />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Enquiries Line Chart */}
        <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
            Enquiry Trends Over Time
          </h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enquiries" stroke="var(--terracotta)" strokeWidth={3} dot={{ r: 5, fill: 'var(--gold)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enquiry Status Donut Chart */}
        <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
            Enquiry Status Breakdown
          </h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {donutChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart & Recent Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 2fr', gap: '1.5rem' }}>
        {/* Bookings Bar Chart */}
        <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
            Bookings By Top Destination
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="destination" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="var(--adriatic)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Enquiries Table */}
        <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', margin: 0 }}>
              Recent Client Enquiries
            </h3>
            <NavLink to="/admin/enquiries" style={{ fontSize: '0.85rem', color: 'var(--terracotta)', fontWeight: 600 }}>
              View All →
            </NavLink>
          </div>
          <Table columns={enquiryColumns} data={enquiries.slice(0, 5)} />
        </div>
      </div>
    </>
  );
}
