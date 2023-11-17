export default function LoadingSpinner({ inline = false }) {
  const spinnerStyle = inline ? { height: '50px', width: '50px' } : { minHeight: '100vh', width: '100%' };

  return (
    <div className="bg-gray-200 flex justify-center items-center" style={spinnerStyle}>
      <div className="flex items-center justify-center bg-gradient-to-tr from-orange-500 to-cyan-500 animate-spin" style={{ height: '40px', width: '40px' }}>
        <div className="bg-gray-200" style={{ height: '30px', width: '30px' }}></div>
      </div>
    </div>
  );
}
