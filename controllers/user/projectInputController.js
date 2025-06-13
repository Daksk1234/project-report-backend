const ProjectInput = require('./../../models/ProjectInput');

// GET /api/project-inputs/:projectId
exports.getByProject = async (req, res) => {
  try {
    const pi = await ProjectInput.findOne({ projectId: req.params.projectId });
    if (!pi) return res.status(404).json({ msg: 'Not found' });
    res.json(pi);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// PUT /api/project-inputs/:projectId
exports.upsert = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const data = req.body;

    // Atomically update or insert in one go:
    const pi = await ProjectInput.findOneAndUpdate(
      { projectId },
      { $set: data },
      {
        new: true, // return the new document
        upsert: true, // create if it doesn't exist
        setDefaultsOnInsert: true,
      }
    );

    res.json(pi);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// DELETE /api/project-inputs/:projectId
exports.remove = async (req, res) => {
  try {
    await ProjectInput.deleteOne({ projectId: req.params.projectId });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
