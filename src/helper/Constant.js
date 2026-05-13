
export const PER_PAGE_ITEMS = 10

export const ORIGIN_OPTIONS = [
    { value: "in_house", label: "In-House" },
    { value: "client_design", label: "Client Design" },
    { value: "market_sample", label: "Market Sample" },
];

export const HIDDEN_COLUMNS = {
  notifications: ["user_id", "is_read", "type_id", "user_role"],
};

export const STATUS_OPTIONS = [
  { value: "new", label: "New", cls: "rb-rd" },
  { value: "reviewing", label: "Reviewing", cls: "rb-sourcing" },
  { value: "quoted", label: "Quoted", cls: "rb-sales" },
  { value: "negotiating", label: "Negotiating", cls: "rb-costing" },
  { value: "accepted", label: "Accepted", cls: "rb-qc" },
  { value: "rejected", label: "Rejected", cls: "rb-vendor" },
  { value: "on_hold", label: "On Hold", cls: "rb-production" },
];

export const SOURCE_OPTIONS = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "walk_in", label: "Walk-in" },
  { value: "exhibition", label: "Exhibition / Trade Fair" },
  { value: "reference", label: "Referral" },
];

export const MATERIAL_OPTIONS = [
  "Silver",
  "Gold 18K",
  "Gold 22K",
  "Gold 14K",
  "Gold Plated Silver",
  "Brass",
  "Platinum",
];

export const STONE_OPTIONS = [
  "Real Diamond",
  "Lab Grown Diamond",
  "Ruby",
  "Emerald",
  "Sapphire",
  "Pearl",
  "Moissanite",
  "Cubic Zirconia",
  "No Stone",
];

export const PLATING_OPTIONS = [
  "1 micron",
  "3 micron",
  "5 micron",
  "No Plating",
];

export const UNITS = ["grams", "carats", "pcs", "job", "cm2", "meters", "ml"];

