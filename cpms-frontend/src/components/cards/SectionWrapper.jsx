import React from "react";

const SectionWrapper = ({ icon, title, description, children, variant }) => {
  // Set background and text colors based on variant
  const bgClass = variant === "green" ? "bg-green-50" : "bg-white";
  const titleColor = variant === "green" ? "text-green-800" : "text-gray-900";
  const descColor = variant === "green" ? "text-green-700" : "text-gray-600";
  const shadowClass = "shadow-card hover:shadow-lg transition-shadow";

  return (
    <div className={`${bgClass} p-6 rounded-xl ${shadowClass} mb-6`}>
      {/* Icon + Title */}
      <div className="flex items-center mb-4">
        {icon && <span className="text-2xl mr-2">{icon}</span>}
        <h3 className={`text-lg font-semibold ${titleColor}`}>{title}</h3>
      </div>

      {/* Description */}
      {description && <p className={`mb-4 ${descColor}`}>{description}</p>}

      {/* Children (progress bars, cards, etc.) */}
      {children}
    </div>
  );
};

export default SectionWrapper;
