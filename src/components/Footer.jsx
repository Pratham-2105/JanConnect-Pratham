import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="footer" className="py-10 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-t border-white/10 dark:border-white/5 transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-xl border border-white dark:border-gray-300 text-gray-800 dark:text-white bg-transparent hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              Sign Up
            </motion.button>
          </motion.div>

          {/* Social icons */}
          <motion.ul 
            className="flex gap-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <a 
                href="#" 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <a 
                href="#" 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <a 
                href="#" 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </motion.li>
          </motion.ul>

          {/* Copyright */}
          <motion.div 
            className="text-sm text-gray-600 dark:text-gray-400 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>All copyrights reserved 2025.</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}