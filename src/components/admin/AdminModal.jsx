const AdminModal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

export default AdminModal;
