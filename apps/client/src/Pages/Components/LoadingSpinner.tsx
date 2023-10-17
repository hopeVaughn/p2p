export default function LoadingSpinner() {
  return (
    <div className="bg-gray-200 w-full min-h-screen flex justify-center items-center">
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-cyan-500 animate-spin">
          <div className="h-9 w-9 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
