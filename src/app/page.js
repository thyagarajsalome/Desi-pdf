"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const categories = [
    {
      title: "Popular PDF Tools",
      color: "blue",
      tools: [
        { id: "pdf-to-jpg", title: "PDF to JPG", desc: "Extract images locally", icon: "fa-image", route: "/pdf-to-jpg" },
        { id: "merge", title: "Merge PDF", desc: "Combine multiple files", icon: "fa-object-group", route: "/merge" },
        { id: "compress", title: "Compress PDF", desc: "Reduce file size", icon: "fa-minimize", route: "/compress" },
        { id: "split", title: "Split PDF", desc: "Extract specific pages", icon: "fa-scissors", route: "/split" },
      ]
    },
    {
      title: "Govt Exams & Forms 🇮🇳",
      color: "emerald",
      tools: [
        { id: "ssc-photo", title: "SSC Photo Resizer", desc: "Resize to 20-50KB exactly", icon: "fa-id-badge", route: "/ssc-photo-compressor" },
        { id: "ibps-sign", title: "IBPS Signature", desc: "Crop to 140x60 pixels", icon: "fa-signature", route: "/ssc-photo-compressor" },
        { id: "thumb-impression", title: "Thumb Impression", desc: "Optimize ink scans", icon: "fa-fingerprint", route: "/thumb-impression" },
        { id: "passport-photo", title: "Passport Photo Maker", desc: "Crop to 3.5x4.5cm", icon: "fa-camera", route: "/passport-maker" },
      ]
    },
    {
      title: "Official ID Utilities",
      color: "indigo",
      tools: [
        { id: "aadhaar-unlock", title: "Aadhaar Unlocker", desc: "Remove PDF password", icon: "fa-unlock-keyhole", route: "/aadhaar-unlock" },
        { id: "pan-merge", title: "PAN Front & Back", desc: "Merge on single page", icon: "fa-address-card", route: "/pan-merge" },
        { id: "voter-id", title: "Voter ID Format", desc: "Convert to 100KB PDF", icon: "fa-box-archive", route: "/voter-id-pdf" },
      ]
    }
  ];

  const getColorClasses = (color) => {
    const maps = {
      blue: "from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-[0_8px_20px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_8px_20px_rgba(37,99,235,0.05)]",
      emerald: "from-emerald-50/50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-[0_8px_20px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_8px_20px_rgba(16,185,129,0.05)]",
      indigo: "from-indigo-50/50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_8px_20px_rgba(79,70,229,0.05)]",
    };
    return maps[color];
  };

  const getIconBg = (color) => {
    const maps = {
      blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
      emerald: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      indigo: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
    };
    return maps[color];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 left-1/2 -z-10 w-[800px] h-[400px] bg-gradient-to-r from-blue-100/50 via-indigo-50/50 to-purple-100/50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50 -translate-x-1/2"></div>
      </div>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 text-center px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            Every PDF Tool You Need, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">Built for India.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            From unlocking Aadhaar cards to compressing SSC photos and splitting huge PDFs. Fast, secure, and completely free.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition">
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </div>
            <input 
              type="text" 
              className="w-full bg-white dark:bg-[#09090b] border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl py-5 pl-14 pr-6 text-lg font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none transition shadow-sm focus:shadow-[0_8px_30px_rgba(37,99,235,0.15)] dark:focus:shadow-none" 
              placeholder="What do you need to do today? (e.g., 'Compress Photo')"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col gap-16">
          
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx} 
              className="relative"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                {cat.title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                {cat.tools.map((tool) => (
                  <motion.div key={tool.id} variants={itemVariants}>
                    {tool.comingSoon ? (
                      <div className={`group block bg-gray-50 dark:bg-[#09090b]/50 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 opacity-70 relative cursor-not-allowed`}>
                        <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded">
                          Coming Soon
                        </div>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl bg-gray-200 dark:bg-gray-800 text-gray-400`}>
                            <i className={`fa-solid ${tool.icon}`}></i>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{tool.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{tool.desc}</p>
                      </div>
                    ) : (
                      <Link href={tool.route} className={`group block bg-white dark:bg-[#09090b] border-2 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${getColorClasses(cat.color)}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-300 ${getIconBg(cat.color)}`}>
                            <i className={`fa-solid ${tool.icon}`}></i>
                          </div>
                          <div className="text-gray-300 dark:text-gray-700 group-hover:text-current transition-colors">
                            <i className="fa-solid fa-arrow-right -rotate-45"></i>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-current transition-colors">{tool.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300">{tool.desc}</p>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </>
  );
}
