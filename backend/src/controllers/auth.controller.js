exports.register = (req, res) => {
  res.json({ success: true, message: 'User registered (mock)' });
};

exports.login = (req, res) => {
  res.json({ success: true, message: 'Login success (mock)' });
};

exports.test = (req, res) => {
  res.json({ success: true, message: 'Auth route working ✅' });
};
