/**
 * Rifaz Cafe - Database Layer
 * LocalStorage-based data persistence (Backend Disconnected)
 * All CRUD operations work fully offline
 */

const DB = {
  // LocalStorage keys
  KEYS: {
    CUSTOMERS: "rc_customers",
    MENU_ITEMS: "rc_menu_items",
    DAILY_EXTRAS: "rc_daily_extras",
    ADVANCE_PAYMENTS: "rc_advance_payments",
    INVOICES: "rc_invoices",
  },

  // =====================================================
  // Storage Helpers
  // =====================================================

  _get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  },

  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  _generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  },

  // Stub for API compatibility — not used in localStorage mode
  async fetchAPI(endpoint, options = {}) {
    console.log(`[DB Local] ${options.method || "GET"} ${endpoint}`);
    return [];
  },

  // =====================================================
  // Customer Operations
  // =====================================================

  async getCustomers() {
    return this._get(this.KEYS.CUSTOMERS);
  },

  async getActiveCustomers() {
    const customers = await this.getCustomers();
    return customers.filter((c) => c.status === "active");
  },

  async getCustomer(id) {
    const customers = await this.getCustomers();
    return customers.find((c) => c.id === id) || null;
  },

  async addCustomer(customer) {
    const customers = await this.getCustomers();
    const newCustomer = {
      id: this._generateId("cust"),
      name: customer.name || "",
      mobile: customer.mobile || "",
      address: customer.address || "",
      subscriptionType: customer.subscriptionType || "daily",
      dailyAmount: parseFloat(customer.dailyAmount) || 300,
      mealTimes: customer.mealTimes || ["breakfast", "lunch", "dinner"],
      advanceAmount: parseFloat(customer.advanceAmount) || 0,
      referral: customer.referral || "",
      startDate: customer.startDate || new Date().toISOString().split("T")[0],
      status: customer.status || "active",
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    this._set(this.KEYS.CUSTOMERS, customers);
    return newCustomer;
  },

  async updateCustomer(id, updates) {
    const customers = await this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Customer not found");
    customers[index] = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this._set(this.KEYS.CUSTOMERS, customers);
    return customers[index];
  },

  async deleteCustomer(id) {
    let customers = await this.getCustomers();
    customers = customers.filter((c) => c.id !== id);
    this._set(this.KEYS.CUSTOMERS, customers);
    return { success: true };
  },

  // =====================================================
  // Menu Item Operations
  // =====================================================

  async getMenuItems() {
    return this._get(this.KEYS.MENU_ITEMS);
  },

  async getAvailableMenuItems() {
    const items = await this.getMenuItems();
    return items.filter((m) => m.available !== false);
  },

  async getMenuItemsByCategory(category) {
    const items = await this.getAvailableMenuItems();
    return items.filter((m) => m.category === category || m.category === "all");
  },

  async getMenuItem(id) {
    const items = await this.getMenuItems();
    return items.find((m) => m.id === id) || null;
  },

  async addMenuItem(menuItem) {
    const items = await this.getMenuItems();
    const newItem = {
      id: this._generateId("menu"),
      name: menuItem.name || "",
      category: menuItem.category || "all",
      price: parseFloat(menuItem.price) || 0,
      description: menuItem.description || "",
      available: menuItem.available !== false,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    this._set(this.KEYS.MENU_ITEMS, items);
    return newItem;
  },

  async updateMenuItem(id, updates) {
    const items = await this.getMenuItems();
    const index = items.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Menu item not found");
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this._set(this.KEYS.MENU_ITEMS, items);
    return items[index];
  },

  async deleteMenuItem(id) {
    let items = await this.getMenuItems();
    items = items.filter((m) => m.id !== id);
    this._set(this.KEYS.MENU_ITEMS, items);
    return { success: true };
  },

  // =====================================================
  // Daily Extras Operations
  // =====================================================

  async getDailyExtras() {
    return this._get(this.KEYS.DAILY_EXTRAS);
  },

  async getExtrasByCustomer(customerId) {
    const extras = await this.getDailyExtras();
    return extras.filter((e) => e.customerId === customerId);
  },

  async getExtrasByDate(date) {
    const extras = await this.getDailyExtras();
    return extras.filter((e) => {
      const eDate = new Date(e.date).toISOString().split("T")[0];
      const tDate = new Date(date).toISOString().split("T")[0];
      return eDate === tDate;
    });
  },

  async getExtrasByCustomerAndMonth(customerId, year, month) {
    const extras = await this.getExtrasByCustomer(customerId);
    return extras.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  async getExtras(customerId, date, mealType) {
    const extras = await this.getExtrasByDate(date);
    return extras.filter(
      (e) => e.customerId === customerId && e.mealType === mealType,
    );
  },

  async addDailyExtra(extra) {
    const extras = await this.getDailyExtras();
    const newExtra = {
      id: this._generateId("ext"),
      customerId: extra.customerId,
      date: extra.date,
      mealType: extra.mealType,
      menuItemId: extra.menuItemId || null,
      price: parseFloat(extra.price) || 0,
      notes: extra.notes || "",
      createdAt: new Date().toISOString(),
    };
    extras.push(newExtra);
    this._set(this.KEYS.DAILY_EXTRAS, extras);
    return newExtra;
  },

  async deleteDailyExtra(id) {
    let extras = await this.getDailyExtras();
    extras = extras.filter((e) => e.id !== id);
    this._set(this.KEYS.DAILY_EXTRAS, extras);
    return { success: true };
  },

  async deleteExtraByDetails(customerId, date, mealType = null) {
    let extras = await this.getDailyExtras();
    const tDate = new Date(date).toISOString().split("T")[0];
    extras = extras.filter((e) => {
      const eDate = new Date(e.date).toISOString().split("T")[0];
      if (e.customerId !== customerId || eDate !== tDate) return true;
      if (mealType && e.mealType !== mealType) return true;
      return false;
    });
    this._set(this.KEYS.DAILY_EXTRAS, extras);
    return { success: true };
  },

  // =====================================================
  // Advance Payment Operations
  // =====================================================

  async getAdvancePayments(customerId = null, year = null) {
    let payments = this._get(this.KEYS.ADVANCE_PAYMENTS);
    if (customerId)
      payments = payments.filter((p) => p.customerId === customerId);
    if (year)
      payments = payments.filter((p) => {
        const d = new Date(p.date || p.createdAt);
        return d.getFullYear() === parseInt(year);
      });
    return payments;
  },

  async addAdvancePayment(payment) {
    const payments = this._get(this.KEYS.ADVANCE_PAYMENTS);
    const newPayment = {
      id: this._generateId("adv"),
      customerId: payment.customerId,
      amount: parseFloat(payment.amount) || 0,
      date: payment.date || new Date().toISOString().split("T")[0],
      month: payment.month || new Date().getMonth() + 1,
      year: payment.year || new Date().getFullYear(),
      notes: payment.notes || "",
      createdAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    this._set(this.KEYS.ADVANCE_PAYMENTS, payments);
    return newPayment;
  },

  async deleteAdvancePayment(id) {
    let payments = this._get(this.KEYS.ADVANCE_PAYMENTS);
    payments = payments.filter((p) => p.id !== id);
    this._set(this.KEYS.ADVANCE_PAYMENTS, payments);
    return { success: true };
  },

  // =====================================================
  // Invoice / Pending Amount Operations
  // =====================================================

  async getPendingInvoices() {
    const invoices = this._get(this.KEYS.INVOICES);
    return invoices.filter((inv) => inv.status === "pending");
  },

  async getPaidInvoices() {
    const invoices = this._get(this.KEYS.INVOICES);
    return invoices.filter((inv) => inv.status === "paid");
  },

  async getAllInvoices() {
    return this._get(this.KEYS.INVOICES);
  },

  async saveInvoiceAsPending(invoice) {
    const invoices = this._get(this.KEYS.INVOICES);
    const newInvoice = {
      id: this._generateId("inv"),
      customerId: invoice.customerId,
      customerName: invoice.customerName || "",
      amount: parseFloat(invoice.amount) || 0,
      month: invoice.month,
      year: invoice.year,
      status: "pending",
      details: invoice.details || null,
      createdAt: new Date().toISOString(),
    };
    invoices.push(newInvoice);
    this._set(this.KEYS.INVOICES, invoices);
    return newInvoice;
  },

  async markInvoiceAsPaid(id, notes) {
    const invoices = this._get(this.KEYS.INVOICES);
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) throw new Error("Invoice not found");
    invoices[index].status = "paid";
    invoices[index].paidAt = new Date().toISOString();
    invoices[index].notes = notes || "";
    this._set(this.KEYS.INVOICES, invoices);
    return invoices[index];
  },

  // =====================================================
  // Invoice Generation Helpers
  // =====================================================

  async generateInvoiceData(customerId, year, month) {
    const customer = await this.getCustomer(customerId);
    if (!customer) return null;

    const extras = await this.getExtrasByCustomerAndMonth(
      customerId,
      year,
      month,
    );
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateWiseData = [];
    let breakfastTotal = 0;
    let lunchTotal = 0;
    let dinnerTotal = 0;

    const menuItems = await this.getMenuItems();
    const findMenuItem = (id) => menuItems.find((m) => m.id === id);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const matchDate = (extraDate) => {
        const d = new Date(extraDate);
        const dStr = d.toISOString().split("T")[0];
        return dStr === dateStr;
      };

      const dayBreakfasts = extras.filter(
        (e) => matchDate(e.date) && e.mealType === "breakfast",
      );
      const dayLunches = extras.filter(
        (e) => matchDate(e.date) && e.mealType === "lunch",
      );
      const dayDinners = extras.filter(
        (e) => matchDate(e.date) && e.mealType === "dinner",
      );

      dayBreakfasts.forEach((e) => (breakfastTotal += parseFloat(e.price)));
      dayLunches.forEach((e) => (lunchTotal += parseFloat(e.price)));
      dayDinners.forEach((e) => (dinnerTotal += parseFloat(e.price)));

      dateWiseData.push({
        date: dateStr,
        day,
        breakfast:
          dayBreakfasts.length > 0
            ? dayBreakfasts
                .map((e) =>
                  this.formatExtraDisplay(e, findMenuItem(e.menuItemId)),
                )
                .join("<br>")
            : "-",
        lunch:
          dayLunches.length > 0
            ? dayLunches
                .map((e) =>
                  this.formatExtraDisplay(e, findMenuItem(e.menuItemId)),
                )
                .join("<br>")
            : "-",
        dinner:
          dayDinners.length > 0
            ? dayDinners
                .map((e) =>
                  this.formatExtraDisplay(e, findMenuItem(e.menuItemId)),
                )
                .join("<br>")
            : "-",
      });
    }

    let subscriptionTotal =
      customer.subscriptionType === "monthly"
        ? parseFloat(customer.dailyAmount)
        : parseFloat(customer.dailyAmount) * daysInMonth;
    const extrasTotal = breakfastTotal + lunchTotal + dinnerTotal;

    const advancePayments = await this.getAdvancePayments(customerId, year);
    const relevantAdvances = advancePayments.filter(
      (p) => p.month === month + 1,
    );

    let totalAdvance = 0;
    relevantAdvances.forEach((p) => (totalAdvance += parseFloat(p.amount)));

    const grandTotal = subscriptionTotal + extrasTotal - totalAdvance;

    return {
      customer,
      month,
      year,
      periodType: "monthly",
      monthName: new Date(year, month).toLocaleString("default", {
        month: "long",
      }),
      dateWiseData,
      summary: {
        daysInMonth,
        dailyAmount: customer.dailyAmount,
        subscriptionTotal,
        breakfastTotal,
        lunchTotal,
        dinnerTotal,
        extrasTotal,
        totalAdvance,
        grandTotal,
      },
    };
  },

  async generateDailyInvoiceData(customerId, date) {
    const customer = await this.getCustomer(customerId);
    if (!customer) return null;

    const extras = await this.getExtrasByDate(date);
    const customerExtras = extras.filter((e) => e.customerId === customerId);

    const menuItems = await this.getMenuItems();
    const findMenuItem = (id) => menuItems.find((m) => m.id === id);

    let breakfastTotal = 0,
      lunchTotal = 0,
      dinnerTotal = 0;
    customerExtras.forEach((e) => {
      if (e.mealType === "breakfast") breakfastTotal += parseFloat(e.price);
      if (e.mealType === "lunch") lunchTotal += parseFloat(e.price);
      if (e.mealType === "dinner") dinnerTotal += parseFloat(e.price);
    });

    const subscriptionTotal =
      customer.subscriptionType === "monthly"
        ? 0
        : parseFloat(customer.dailyAmount);
    const extrasTotal = breakfastTotal + lunchTotal + dinnerTotal;
    const grandTotal = subscriptionTotal + extrasTotal;

    const dateObj = new Date(date);

    return {
      customer,
      date,
      periodType: "daily",
      monthName: dateObj.toLocaleString("default", { month: "long" }),
      year: dateObj.getFullYear(),
      day: dateObj.getDate(),
      dateWiseData: [
        {
          date,
          day: dateObj.getDate(),
          breakfast:
            customerExtras
              .filter((e) => e.mealType === "breakfast")
              .map((e) =>
                this.formatExtraDisplay(e, findMenuItem(e.menuItemId)),
              )
              .join("<br>") || "-",
          lunch:
            customerExtras
              .filter((e) => e.mealType === "lunch")
              .map((e) =>
                this.formatExtraDisplay(e, findMenuItem(e.menuItemId)),
              )
              .join("<br>") || "-",
          dinner:
            customerExtras
              .filter((e) => e.mealType === "dinner")
              .map((e) =>
                this.formatExtraDisplay(e, findMenuItem(e.menuItemId)),
              )
              .join("<br>") || "-",
        },
      ],
      summary: {
        daysInMonth: 1,
        dailyAmount: customer.dailyAmount,
        subscriptionTotal,
        breakfastTotal,
        lunchTotal,
        dinnerTotal,
        extrasTotal,
        grandTotal,
      },
    };
  },

  formatExtraDisplay(extra, menuItem) {
    const name = menuItem ? menuItem.name : "Item";
    let display = `${name} – ₹${extra.price}`;
    if (extra.notes && extra.notes.trim()) {
      display += ` (${extra.notes})`;
    }
    return display;
  },

  // =====================================================
  // Statistics
  // =====================================================

  async getStats() {
    const customers = await this.getCustomers();
    const menuItems = await this.getMenuItems();
    const extras = await this.getDailyExtras();
    const today = new Date().toISOString().split("T")[0];
    const todayExtras = await this.getExtrasByDate(today);
    const pendingInvoices = await this.getPendingInvoices();

    let pendingAmount = 0;
    pendingInvoices.forEach((inv) => (pendingAmount += parseFloat(inv.amount)));

    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter((c) => c.status === "active").length,
      totalMenuItems: menuItems.length,
      availableMenuItems: menuItems.filter((m) => m.available !== false).length,
      todayExtrasCount: todayExtras.length,
      totalExtras: extras.length,
      pendingCount: pendingInvoices.length,
      pendingAmount,
    };
  },

  // =====================================================
  // Data Migration (from old localStorage keys)
  // =====================================================

  async migrateData() {
    const OLD_KEYS = {
      CUSTOMERS: "bc_customers",
      MENU_ITEMS: "bc_menu_items",
      DAILY_EXTRAS: "bc_daily_extras",
    };

    const getOld = (key) => {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    };

    const customers = getOld(OLD_KEYS.CUSTOMERS);
    const menu = getOld(OLD_KEYS.MENU_ITEMS);
    const extras = getOld(OLD_KEYS.DAILY_EXTRAS);

    console.log("Starting migration...");

    for (const c of customers) {
      await this.addCustomer(c).catch((err) =>
        console.error("Error migrating customer", c.name, err),
      );
    }
    for (const m of menu) {
      await this.addMenuItem(m).catch((err) =>
        console.error("Error migrating menu item", m.name, err),
      );
    }
    for (const e of extras) {
      await this.addDailyExtra(e).catch((err) =>
        console.error("Error migrating extra", e, err),
      );
    }

    console.log("Migration complete!");
    return true;
  },
};

// Make DB available globally
window.DB = DB;
