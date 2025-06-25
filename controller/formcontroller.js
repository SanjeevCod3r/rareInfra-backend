import Form from '../models/formmodel.js';

export const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body; // Debugging log

    const newForm = new Form({
      name,
      email,
      phone,
      message,
    });

    const savedForm = await newForm.save();
    

    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllFormData = async (req, res) => {
  try {
    const forms = await Form.find().select('name email phone message');
    res.json({success: true,forms});
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Form.findByIdAndDelete(req.body.id);
    if (!contact) {
      return res.status(404).json({ message: 'contact not found', success: false });
    }
    return res.json({ message: 'Contact deleted successfully', success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Server Error', success: false });
  }
};
