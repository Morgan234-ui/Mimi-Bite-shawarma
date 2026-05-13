const orderForm = document.getElementById('orderForm');
const message = document.getElementById('message');

// Business contact details
const BUSINESS_EMAIL = 'info@morganedache875.com';
const BUSINESS_PHONE = '+2348126201628';

orderForm.addEventListener('submit', function(e){
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const food = document.getElementById('food').value;
  const location = document.getElementById('location').value;
  const instructions = document.getElementById('instructions').value;

  // Clear previous message
  message.textContent = '';
  message.className = 'message';

  // Validate inputs
  if (!name.trim() || !phone.trim() || !email.trim() || !food || !location.trim()) {
    message.textContent = '❌ Please fill in all required fields.';
    message.classList.add('error');
    return;
  }

  // Validate email
  if (!isValidEmail(email)) {
    message.textContent = '❌ Please enter a valid email address.';
    message.classList.add('error');
    return;
  }

  // Validate phone number
  if (!isValidPhone(phone)) {
    message.textContent = '❌ Please enter a valid phone number.';
    message.classList.add('error');
    return;
  }

  // Show loading state
  message.textContent = '⏳ Processing your order...';
  message.classList.add('info');

  // Send email to business
  sendEmailToBusiness(name, phone, email, food, location, instructions);
  
  // Send SMS to business
  sendSMSToBusiness(name, phone, email, food, location);
  
  // Send confirmation email to customer
  sendConfirmationEmailToCustomer(name, email, food, location);

  // Success message
  setTimeout(() => {
    message.innerHTML = `✓ Thank you, ${name}! Your order for ${food} has been received successfully.<br>We'll deliver to ${location} soon.<br>Check your email for confirmation.`;
    message.classList.remove('info');
    message.classList.add('success');
    
    // Reset form
    orderForm.reset();
    
    // Auto-hide message after 7 seconds
    setTimeout(() => {
      message.textContent = '';
      message.className = 'message';
    }, 7000);
  }, 1000);
});

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format
function isValidPhone(phone) {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  // Accept any phone number with 10 or more digits
  return digitsOnly.length >= 10;
}

// Send email to business
function sendEmailToBusiness(name, phone, email, food, location, instructions) {
  const emailBody = `
NEW ORDER RECEIVED

Customer Name: ${name}
Phone Number: ${phone}
Email: ${email}
Order Item: ${food}
Delivery Location: ${location}
Special Instructions: ${instructions || 'None'}

Order Time: ${new Date().toLocaleString()}
  `.trim();

  // Using EmailJS or similar service (free tier available)
  // For this demo, we'll use a backend service approach
  sendToBackend('email', {
    to: BUSINESS_EMAIL,
    subject: `New Order from ${name}`,
    body: emailBody,
    customerEmail: email
  });
}

// Send SMS to business
function sendSMSToBusiness(name, phone, email, food, location) {
  const smsMessage = `New Order - ${name} ordered ${food} for delivery to ${location}. Contact: ${phone}`;

  // Using Twilio or similar SMS service
  sendToBackend('sms', {
    to: BUSINESS_PHONE,
    message: smsMessage,
    customerPhone: phone
  });
}

// Send confirmation email to customer
function sendConfirmationEmailToCustomer(name, email, food, location) {
  const confirmationBody = `
Hello ${name},

Thank you for ordering with MimiRichies Bite!

Order Details:
- Item: ${food}
- Delivery Location: ${location}
- Order Time: ${new Date().toLocaleString()}

We will prepare your order and deliver it shortly.
For inquiries, contact us at:
📱 ${BUSINESS_PHONE}
📧 ${BUSINESS_EMAIL}

Thank you for choosing MimiRichies Bite!
  `.trim();

  sendToBackend('email', {
    to: email,
    subject: 'Order Confirmation - MimiRichies Bite',
    body: confirmationBody,
    isCustomer: true
  });
}

// Send data to backend (requires a backend service)
function sendToBackend(type, data) {
  // This would connect to your backend service
  // For now, we'll simulate with localStorage and console log
  
  if (type === 'email') {
    console.log('📧 Email to:', data.to);
    console.log('Subject:', data.subject);
    console.log('Message:', data.body);
    
    // Store in localStorage for demonstration
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      type: 'email',
      to: data.to,
      subject: data.subject,
      body: data.body,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
  } else if (type === 'sms') {
    console.log('📱 SMS to:', data.to);
    console.log('Message:', data.message);
    
    // Store in localStorage for demonstration
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      type: 'sms',
      to: data.to,
      message: data.message,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
  }
  
  // Note: For production, you would:
  // 1. Set up EmailJS (https://www.emailjs.com/) - Free tier available
  // 2. Set up Twilio (https://www.twilio.com/) - For SMS
  // 3. Or create your own backend with Node.js/Express
}
