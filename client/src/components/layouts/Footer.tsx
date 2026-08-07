import { Mail, MapPin, Phone } from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">

        {/* Company */}
        <div>
          <h2 className="text-3xl font-bold text-blue-400">
            CareConnect
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            Connecting patients with trusted healthcare professionals through
            modern technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3 text-slate-300">
            <li className="cursor-pointer hover:text-white">Home</li>
            <li className="cursor-pointer hover:text-white">Doctors</li>
            <li className="cursor-pointer hover:text-white">Appointments</li>
            <li className="cursor-pointer hover:text-white">About</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold">
            Services
          </h3>

          <ul className="mt-5 space-y-3 text-slate-300">
            <li>Online Consultation</li>
            <li>Health Checkups</li>
            <li>Emergency Support</li>
            <li>Medical Records</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold">
            Contact
          </h3>

          <div className="mt-5 space-y-4 text-slate-300">

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-400" />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <span>support@careconnect.com</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>Bhopal, India</span>
            </div>

          </div>

          <div className="mt-6 flex gap-5 text-xl">
            <FaFacebook className="cursor-pointer transition hover:text-blue-500" />
            <FaInstagram className="cursor-pointer transition hover:text-pink-500" />
            <FaLinkedin className="cursor-pointer transition hover:text-blue-400" />
            <FaXTwitter className="cursor-pointer transition hover:text-sky-400" />
          </div>

        </div>

      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        © 2026 CareConnect. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;