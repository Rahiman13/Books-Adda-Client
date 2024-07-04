import { FaBook, FaChalkboardTeacher, FaCoffee, FaCalendarAlt } from 'react-icons/fa';
import serviceImage from '../../components/assets/Nayum.jpg'; // Update import as needed

const services = [
  { title: "Book Sales", description: "Wide range of books across various genres and authors.", icon: <FaBook /> },
  { title: "Reading Events", description: "Exciting reading events and book signings with authors.", icon: <FaCalendarAlt /> },
  { title: "Book Clubs", description: "Join our book clubs for engaging discussions and meetups.", icon: <FaChalkboardTeacher /> },
  { title: "Cafe", description: "Relax and enjoy a cup of coffee at our in-store cafe.", icon: <FaCoffee /> },
];

function Services() {
  const serviceImages = [
    serviceImage, // Use the imported image
    serviceImage,
    serviceImage,
    serviceImage,
  ];

  return (
    <div className="container mx-auto px-8 py-8">
      <h2 className="text-4xl font-bold mb-4 text-center">Our Services</h2>
      <div className="flex flex-wrap justify-center">
        {services.map((service, index) => (
          <div key={index} className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
            <div
              className="rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-4 flex flex-col flex-grow">
                <div className="text-5xl text-center mb-4">
                  {service.icon}
                </div>
                <div className="font-bold text-xl mb-2 text-center">{service.title}</div>
                <p className="text-gray-700 text-base mb-4 text-center">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
