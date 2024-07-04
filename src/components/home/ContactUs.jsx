import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function ContactUs() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMessageSent, setMessageSent] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const emailParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      message: formData.get('message'),
    };

    emailjs.send('service_6fba6ot', 'template_jtaowm3', emailParams, 'kfmE6H6G0rNxfEtky')
      .then((result) => {
        console.log(result.text);
        setMessageSent(true);
        setModalOpen(false);
      }, (error) => {
        console.log(error.text);
      });

    form.reset();
  };

  return (
    <div className="w-full h-[400px]   relative h-screen bg-fixed bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)' }}>
      <div className="flex flex-col items-center justify-center h-full bg-blue-400 bg-opacity-20">
        <h1 className="text-4xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[3rem] font-playfair font-bold text-lime-100 mb-4">Contact us if you're ready</h1>
        <h3 className="text-lg md:text-xl lg:text-[1.75rem] xl:text-[2rem] font-playfair font-bold text-yellow-50 mb-6">Experience the wonders of India with personalized tours crafted just for you.</h3>
        <button 
          className="h-12 w-52 text-lg md:text-xl lg:text-[1.75rem] xl:text-[2rem] text-white bg-transparent border-2 border-white rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-gradient-to-r hover:from-blue-500 hover:to-red-500"
          onClick={toggleModal}
        >
          CONTACT US
        </button>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl mx-4 md:mx-0"> {/* Updated width here */}
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <form onSubmit={handleSend}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea name="message" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
                <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={toggleModal}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMessageSent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Message Successfully Sent</h2>
            <div className="flex justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setMessageSent(false)}>Close</button>
            </div>          </div>
        </div>
      )}
    </div>
  );
}

export default ContactUs;
