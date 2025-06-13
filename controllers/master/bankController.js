const Bank = require('../../models/Bank');
const parse = require('csv-parse/sync');
const xlsx = require('xlsx');

// GET /api/master/banks
exports.getBanks = async (req, res) => {
  try {
    const banks = await Bank.find().sort('name');
    res.json(banks);
  } catch (err) {
    console.error('getBanks:', err);
    res.status(500).json({ message: 'Failed to load banks' });
  }
};

// POST /api/master/banks
exports.createBank = async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    res.json(bank);
  } catch (err) {
    console.error('createBank:', err);
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/master/banks/:id
exports.updateBank = async (req, res) => {
  try {
    const bank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bank) return res.status(404).json({ message: 'Bank not found' });
    res.json(bank);
  } catch (err) {
    console.error('updateBank:', err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/master/banks/:id
exports.deleteBank = async (req, res) => {
  try {
    const bank = await Bank.findByIdAndDelete(req.params.id);
    if (!bank) return res.status(404).json({ message: 'Bank not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('deleteBank:', err);
    res.status(500).json({ message: 'Failed to delete bank' });
  }
};

// POST /api/master/banks/bulk
exports.bulkUploadBanks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let records;
  const buffer = req.file.buffer;
  const name = req.file.originalname.toLowerCase();

  try {
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      // Parse Excel
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (name.endsWith('.csv')) {
      // Parse CSV
      records = parse(buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
      });
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Map your CSV/Excel columns to Bank fields
    const docs = records.map((r) => ({
      name: r.name,
      ifsc: r.ifsc,
      branchName: r.branchName,
      address: r.address,
      city: r.city,
      state: r.state,
      stdCode: r.stdCode,
      phone: r.phone,
    }));

    const inserted = await Bank.insertMany(docs, { ordered: false });
    return res.json({ inserted: inserted.length });
  } catch (err) {
    console.error('bulkUploadBanks failed:', err);
    return res
      .status(500)
      .json({ message: 'Bulk upload failed', error: err.message });
  }
};
