import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Camera, Play, ArrowRight } from "lucide-react";

const ContactPage  = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: ''
  });

  const ordersFaqs = [
    { id: 1, question: 'Where do you deliver?', answer: 'We currently deliver to all 50 US states. Shipping typically takes 3-5 business days.' },
    { id: 2, question: 'Does SPYLT need to ship cold?', answer: 'No, SPYLT is shelf-stable! However, we recommend refrigerating before consumption for the best taste experience.' },
    { id: 3, question: 'My SPYLT arrived damaged, now what?', answer: 'Oh no! Please contact us immediately at contact@SPYLT.com with photos of the damage, and we\'ll make it right.' },
    { id: 4, question: 'Can I order SPYLT in Canada?', answer: 'We\'re working on international shipping! Sign up for our newsletter to be the first to know when we expand.' },
    { id: 5, question: 'I need SPYLT and I\'m not in the US', answer: 'Currently we only ship within the US, but we\'re expanding soon. Join our waitlist for international updates!' },
    { id: 6, question: 'Can I buy SPYLT in person?', answer: 'Yes! Check our store locator to find SPYLT at a retailer near you.', hasAction: true }
  ];

  const productFaqs = [
    { id: 7, question: 'What flavors are available?', answer: 'We offer Chocolate, Vanilla, Strawberry, and Mocha flavors. Each packed with 20g protein!' },
    { id: 8, question: 'Is SPYLT lactose-free?', answer: 'SPYLT contains dairy but is low in lactose. We recommend consulting with your doctor if you have severe lactose intolerance.' },
    { id: 9, question: 'How much caffeine is in SPYLT?', answer: 'Each can contains 90mg of natural caffeine, about the same as a cup of coffee.' }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We\'ll get back to you soon.');
  };

  const currentFaqs = activeTab === 'orders' ? ordersFaqs : productFaqs;

  return (
    <div className="min-h-screen bg-[#F5E6D3] font-sans text-[#2C1810] overflow-x-hidden">
      {/* Navigation would go here */}
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center overflow-hidden bg-[#3E2723]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=1920&q=80" 
            alt="Chocolate splash background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3E2723]/90 via-[#3E2723]/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-white max-w-xl">
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
              GET IN<br />TOUCH
            </h1>
            <p className="text-lg mb-4 text-[#D7CCC8] leading-relaxed">
              We love to hear from you. Reach out with comments, questions and feedback. Our lovely team will reply as quickly as we can.
            </p>
            <p className="text-[#D7CCC8]">
              Feel free to shoot us an email <a href="mailto:contact@SPYLT.com" className="text-white underline hover:text-[#FFB74D] transition-colors">contact@SPYLT.com</a>
            </p>
          </div>

          {/* Product Image */}
          <div className="hidden lg:block relative">
            <img 
              src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" 
              alt="SPYLT Chocolate Milk" 
              className="w-64 h-auto drop-shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500"
            />
          </div>

          {/* Contact Form */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-[#F5E6D3] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-center mb-8 text-[#3E2723]" style={{ fontFamily: 'Impact, sans-serif' }}>
                DON'T BE SHY.<br />
                <span className="text-[#5D4037]">HIT US UP AND WE'LL GET BACK TO YOU!</span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-full bg-white border-2 border-[#D7CCC8] focus:border-[#FFB74D] focus:outline-none text-[#3E2723] placeholder-[#A1887F]"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-full bg-white border-2 border-[#D7CCC8] focus:border-[#FFB74D] focus:outline-none text-[#3E2723] placeholder-[#A1887F]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-full bg-white border-2 border-[#D7CCC8] focus:border-[#FFB74D] focus:outline-none text-[#3E2723] appearance-none cursor-pointer"
                    >
                      <option value="">Subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Issue</option>
                      <option value="product">Product Question</option>
                      <option value="partnership">Partnership</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A1887F] pointer-events-none w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="orderNumber"
                    placeholder="Order number (optional)"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-full bg-white border-2 border-[#D7CCC8] focus:border-[#FFB74D] focus:outline-none text-[#3E2723] placeholder-[#A1887F]"
                  />
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#D7CCC8] focus:border-[#FFB74D] focus:outline-none text-[#3E2723] placeholder-[#A1887F] resize-none"
                    required
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button type="button" className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-3 bg-[#FFB74D] hover:bg-[#FFA726] text-[#3E2723] font-bold rounded-full transition-all transform hover:scale-105 shadow-lg mx-auto block"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-12 text-[#3E2723]" style={{ fontFamily: 'Impact, sans-serif' }}>
            FREQUENTLY ASKED<br />
            <span className="relative inline-block">
              <span className="relative z-10 px-4 text-white">QUESTIONS</span>
              <span className="absolute inset-0 bg-[#FFB74D] transform -skew-x-12 -rotate-2"></span>
            </span>
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-8 py-3 rounded-full border-2 font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#3E2723] text-white border-[#3E2723]'
                  : 'bg-transparent text-[#3E2723] border-[#3E2723] hover:bg-[#3E2723] hover:text-white'
              }`}
            >
              ORDERS
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className={`px-8 py-3 rounded-full border-2 font-bold transition-all ${
                activeTab === 'product'
                  ? 'bg-[#3E2723] text-white border-[#3E2723]'
                  : 'bg-transparent text-[#3E2723] border-[#3E2723] hover:bg-[#3E2723] hover:text-white'
              }`}
            >
              PRODUCT QUESTIONS
            </button>
          </div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {currentFaqs.map((faq) => (
              <div key={faq.id} className="bg-[#E6D5C3] rounded-full overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#D7CCC8] transition-colors"
                >
                  <span className="font-medium text-[#3E2723] pr-4">{faq.question}</span>
                  {faq.hasAction ? (
                    <span className="px-4 py-1 bg-white rounded-full text-xs font-bold text-[#3E2723] whitespace-nowrap">
                      FIND IN STORES
                    </span>
                  ) : (
                    <ChevronDown 
                      className={`w-5 h-5 text-[#3E2723] transform transition-transform duration-300 flex-shrink-0 ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>
                
                {openFaq === faq.id && !faq.hasAction && (
                  <div className="px-6 pb-4 text-[#5D4037] animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#1a1a1a] text-white pt-32 pb-8 overflow-hidden">
        {/* Chocolate Drip Effect */}
        <div className="absolute top-0 left-0 right-0 h-24">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="#F5E6D3" 
              opacity="1"
            />
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              fill="#F5E6D3" 
              opacity="0.5"
            />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            {/* Product Image */}
            <div className="relative w-64 lg:w-80">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" 
                alt="SPYLT Can" 
                className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Social Icons */}
            <div className="flex gap-6">
              <a href="#" className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-all">
                <Play className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-all">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4 text-[#FFB74D]">SPYLT Flavors</h4>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#FFB74D]">Chug Club</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Student Marketing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dairy Dealers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#FFB74D]">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contacts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tasty Talk</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#FFB74D]">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">Get Exclusive Early Access and Stay Informed About Product Updates, Events, and More!</p>
              <div className="flex border-b border-white/30 pb-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
                />
                <button className="text-white hover:text-[#FFB74D] transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>Copyright © 2025 Spylt - All Rights Reserved</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage ;