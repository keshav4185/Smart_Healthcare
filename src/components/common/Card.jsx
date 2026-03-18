const Card = ({ title, children, className = '', headerAction }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
