import { INITIAL_DATA } from '../data/initialData.js';

// LocalStorage Keys
const STORAGE_KEYS = {
  SETTINGS: 'roamora_settings',
  DESTINATIONS: 'roamora_destinations',
  PACKAGES: 'roamora_packages',
  SERVICES: 'roamora_services',
  BLOGS: 'roamora_blogs',
  TESTIMONIALS: 'roamora_testimonials',
  GALLERY: 'roamora_gallery',
  TEAM: 'roamora_team',
  FAQS: 'roamora_faqs',
  ENQUIRIES: 'roamora_enquiries',
  BOOKINGS: 'roamora_bookings',
  SUBSCRIBERS: 'roamora_subscribers'
};

// Internal Event Listener system for real-time reactivity without page refresh
const listeners = new Set();

export const subscribeToDataChange = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const notifyDataChange = (entityType) => {
  listeners.forEach(cb => cb(entityType));
};

// Seed LocalStorage on first run
const getStorageItem = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultVal;
  }
};

const setStorageItem = (key, value, entityType) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyDataChange(entityType);
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

// Helper simulation for network delay (10-50ms) to ensure true async Promise contracts
const delay = (ms = 20) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- SITE SETTINGS ---
  getSettings: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.SETTINGS, INITIAL_DATA.siteSettings);
  },
  updateSettings: async (newSettings) => {
    await delay();
    const current = getStorageItem(STORAGE_KEYS.SETTINGS, INITIAL_DATA.siteSettings);
    const updated = { ...current, ...newSettings };
    setStorageItem(STORAGE_KEYS.SETTINGS, updated, 'settings');
    return updated;
  },

  // --- DESTINATIONS ---
  getDestinations: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.DESTINATIONS, INITIAL_DATA.destinations);
  },
  getDestinationById: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.DESTINATIONS, INITIAL_DATA.destinations);
    return list.find(d => d.id === id || d.slug === id) || null;
  },
  saveDestination: async (destinationData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.DESTINATIONS, INITIAL_DATA.destinations);
    let updated;
    if (destinationData.id) {
      updated = list.map(d => d.id === destinationData.id ? { ...d, ...destinationData } : d);
    } else {
      const newDest = {
        ...destinationData,
        id: 'dest-' + Date.now(),
        slug: (destinationData.name || 'destination').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };
      updated = [newDest, ...list];
    }
    setStorageItem(STORAGE_KEYS.DESTINATIONS, updated, 'destinations');
    return destinationData;
  },
  deleteDestination: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.DESTINATIONS, INITIAL_DATA.destinations);
    const updated = list.filter(d => d.id !== id);
    setStorageItem(STORAGE_KEYS.DESTINATIONS, updated, 'destinations');
    return true;
  },

  // --- PACKAGES ---
  getPackages: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.PACKAGES, INITIAL_DATA.packages);
  },
  getPackageById: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.PACKAGES, INITIAL_DATA.packages);
    return list.find(p => p.id === id || p.slug === id) || null;
  },
  savePackage: async (pkgData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.PACKAGES, INITIAL_DATA.packages);
    let updated;
    if (pkgData.id) {
      updated = list.map(p => p.id === pkgData.id ? { ...p, ...pkgData } : p);
    } else {
      const newPkg = {
        ...pkgData,
        id: 'pkg-' + Date.now(),
        slug: (pkgData.title || 'package').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviewsCount: 1,
        active: true
      };
      updated = [newPkg, ...list];
    }
    setStorageItem(STORAGE_KEYS.PACKAGES, updated, 'packages');
    return pkgData;
  },
  deletePackage: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.PACKAGES, INITIAL_DATA.packages);
    const updated = list.filter(p => p.id !== id);
    setStorageItem(STORAGE_KEYS.PACKAGES, updated, 'packages');
    return true;
  },

  // --- SERVICES ---
  getServices: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.SERVICES, INITIAL_DATA.services);
  },

  // --- BLOGS ---
  getBlogs: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.BLOGS, INITIAL_DATA.blogs);
  },
  getBlogById: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.BLOGS, INITIAL_DATA.blogs);
    return list.find(b => b.id === id || b.slug === id) || null;
  },
  saveBlog: async (blogData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.BLOGS, INITIAL_DATA.blogs);
    let updated;
    if (blogData.id) {
      updated = list.map(b => b.id === blogData.id ? { ...b, ...blogData } : b);
    } else {
      const newBlog = {
        ...blogData,
        id: 'blog-' + Date.now(),
        slug: (blogData.title || 'blog').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
      updated = [newBlog, ...list];
    }
    setStorageItem(STORAGE_KEYS.BLOGS, updated, 'blogs');
    return blogData;
  },
  deleteBlog: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.BLOGS, INITIAL_DATA.blogs);
    const updated = list.filter(b => b.id !== id);
    setStorageItem(STORAGE_KEYS.BLOGS, updated, 'blogs');
    return true;
  },

  // --- TESTIMONIALS ---
  getTestimonials: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.TESTIMONIALS, INITIAL_DATA.testimonials);
  },
  saveTestimonial: async (testData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.TESTIMONIALS, INITIAL_DATA.testimonials);
    let updated;
    if (testData.id) {
      updated = list.map(t => t.id === testData.id ? { ...t, ...testData } : t);
    } else {
      const newTest = {
        ...testData,
        id: 'test-' + Date.now(),
        status: testData.status || 'approved'
      };
      updated = [newTest, ...list];
    }
    setStorageItem(STORAGE_KEYS.TESTIMONIALS, updated, 'testimonials');
    return testData;
  },
  deleteTestimonial: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.TESTIMONIALS, INITIAL_DATA.testimonials);
    const updated = list.filter(t => t.id !== id);
    setStorageItem(STORAGE_KEYS.TESTIMONIALS, updated, 'testimonials');
    return true;
  },

  // --- GALLERY ---
  getGallery: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.GALLERY, INITIAL_DATA.gallery);
  },
  saveGalleryItem: async (itemData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.GALLERY, INITIAL_DATA.gallery);
    const newItem = {
      ...itemData,
      id: itemData.id || 'gal-' + Date.now()
    };
    const updated = [newItem, ...list];
    setStorageItem(STORAGE_KEYS.GALLERY, updated, 'gallery');
    return newItem;
  },
  deleteGalleryItem: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.GALLERY, INITIAL_DATA.gallery);
    const updated = list.filter(g => g.id !== id);
    setStorageItem(STORAGE_KEYS.GALLERY, updated, 'gallery');
    return true;
  },

  // --- TEAM ---
  getTeam: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.TEAM, INITIAL_DATA.team);
  },
  saveTeamMember: async (memberData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.TEAM, INITIAL_DATA.team);
    let updated;
    if (memberData.id) {
      updated = list.map(m => m.id === memberData.id ? { ...m, ...memberData } : m);
    } else {
      const newMember = { ...memberData, id: 'team-' + Date.now() };
      updated = [...list, newMember];
    }
    setStorageItem(STORAGE_KEYS.TEAM, updated, 'team');
    return memberData;
  },
  deleteTeamMember: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.TEAM, INITIAL_DATA.team);
    const updated = list.filter(m => m.id !== id);
    setStorageItem(STORAGE_KEYS.TEAM, updated, 'team');
    return true;
  },

  // --- FAQS ---
  getFaqs: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.FAQS, INITIAL_DATA.faqs);
  },
  saveFaq: async (faqData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.FAQS, INITIAL_DATA.faqs);
    let updated;
    if (faqData.id) {
      updated = list.map(f => f.id === faqData.id ? { ...f, ...faqData } : f);
    } else {
      const newFaq = { ...faqData, id: 'faq-' + Date.now() };
      updated = [...list, newFaq];
    }
    setStorageItem(STORAGE_KEYS.FAQS, updated, 'faqs');
    return faqData;
  },
  deleteFaq: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.FAQS, INITIAL_DATA.faqs);
    const updated = list.filter(f => f.id !== id);
    setStorageItem(STORAGE_KEYS.FAQS, updated, 'faqs');
    return true;
  },

  // --- ENQUIRIES ---
  getEnquiries: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.ENQUIRIES, INITIAL_DATA.enquiries);
  },
  submitEnquiry: async (enquiryData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.ENQUIRIES, INITIAL_DATA.enquiries);
    const newEnquiry = {
      ...enquiryData,
      id: 'enq-' + Date.now(),
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const updated = [newEnquiry, ...list];
    setStorageItem(STORAGE_KEYS.ENQUIRIES, updated, 'enquiries');
    return newEnquiry;
  },
  updateEnquiryStatus: async (id, status, notes = '') => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.ENQUIRIES, INITIAL_DATA.enquiries);
    const updated = list.map(e => e.id === id ? { ...e, status, notes: notes || e.notes } : e);
    setStorageItem(STORAGE_KEYS.ENQUIRIES, updated, 'enquiries');
    return true;
  },
  deleteEnquiry: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.ENQUIRIES, INITIAL_DATA.enquiries);
    const updated = list.filter(e => e.id !== id);
    setStorageItem(STORAGE_KEYS.ENQUIRIES, updated, 'enquiries');
    return true;
  },

  // --- BOOKINGS ---
  getBookings: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_DATA.bookings);
  },
  saveBooking: async (bookingData) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_DATA.bookings);
    let updated;
    if (bookingData.id) {
      updated = list.map(b => b.id === bookingData.id ? { ...b, ...bookingData } : b);
    } else {
      const newBooking = {
        ...bookingData,
        id: 'bk-' + Date.now(),
        bookingDate: new Date().toISOString().split('T')[0]
      };
      updated = [newBooking, ...list];
    }
    setStorageItem(STORAGE_KEYS.BOOKINGS, updated, 'bookings');
    return bookingData;
  },
  deleteBooking: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_DATA.bookings);
    const updated = list.filter(b => b.id !== id);
    setStorageItem(STORAGE_KEYS.BOOKINGS, updated, 'bookings');
    return true;
  },

  // --- SUBSCRIBERS ---
  getSubscribers: async () => {
    await delay();
    return getStorageItem(STORAGE_KEYS.SUBSCRIBERS, INITIAL_DATA.subscribers);
  },
  subscribeNewsletter: async (email) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.SUBSCRIBERS, INITIAL_DATA.subscribers);
    if (list.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: true, message: 'Already subscribed!' };
    }
    const newSub = {
      id: 'sub-' + Date.now(),
      email,
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newSub, ...list];
    setStorageItem(STORAGE_KEYS.SUBSCRIBERS, updated, 'subscribers');
    return { success: true, message: 'Subscribed successfully!' };
  },
  deleteSubscriber: async (id) => {
    await delay();
    const list = getStorageItem(STORAGE_KEYS.SUBSCRIBERS, INITIAL_DATA.subscribers);
    const updated = list.filter(s => s.id !== id);
    setStorageItem(STORAGE_KEYS.SUBSCRIBERS, updated, 'subscribers');
    return true;
  }
};
